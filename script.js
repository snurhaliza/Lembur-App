const GAS_URL = "https://script.google.com/macros/s/AKfycbzBoeWSNMAPTqVTU9wTx6Af54P2ij5oCwOG_z8f3UFNlcNsfpr6A2OW0FB-lFL2uua0/exec";

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// LOGIN
async function login(){

  let pass = password.value.trim();
  let role = document.getElementById("role").value;

  let r = await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d = await r.json();

  if(!d.status){
    msg.innerText="Login gagal!";
    return;
  }

  if(d.role!==role){
    msg.innerText="Role salah!";
    return;
  }

  localStorage.setItem("user",JSON.stringify(d));

  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDashboard();
    loadGrafik();
  }

  if(id==="data") loadData();
}

// DASHBOARD
async function loadDashboard(){

  let url = GAS_URL+"?action=dashboard";
  if(user?.nik) url+="&nik="+user.nik;

  let r = await fetch(url);
  let d = await r.json();

  if(todayCount) todayCount.innerText = d.todayTotal||0;
  if(monthTotal) monthTotal.innerText = (d.monthTotal||0)+" Jam";
}

// GRAFIK
async function loadGrafik(){

  let r = await fetch(GAS_URL+"?action=grafik");
  let d = await r.json();

  let ctx = document.getElementById("chart");
  if(!ctx) return;

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:d.map(x=>x.nama),
      datasets:[{
        label:"Jam Lembur",
        data:d.map(x=>x.total)
      }]
    }
  });
}

// INPUT
function hitungJam(){
  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);
  let j=(b-a)/3600000;
  if(j<0) j+=24;
  total.value=j.toFixed(1);
}

async function simpan(){

  let r = await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:keterangan.value,
      lembur:jenis.value,
      k_alasan:jam.value,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value
    })
  });

  let d = await r.json();

  if(!d.status){
    alert(d.msg);
    return;
  }

  alert("Tersimpan");
  resetForm();
  loadDashboard();
}

function resetForm(){
  keterangan.value="";
  jenis.value="";
  jam.value="";
  mulai.value="";
  akhir.value="";
  total.value="";
}

// DATA ADMIN
async function loadData(){

  let r = await fetch(GAS_URL+"?action=data");
  let data = await r.json();

  table.innerHTML = data.map(d=>`
  <tr>
    <td>${d.tanggal}</td>
    <td>${d.nik}</td>
    <td>${d.nama}</td>
    <td>${d.pekerjaan}</td>
    <td>${d.lembur}</td>
    <td>${d.k_alasan}</td>
    <td>${d.mulai}</td>
    <td>${d.akhir}</td>
    <td>${d.total}</td>
    <td><button onclick="hapus(${d.id})">Hapus</button></td>
  </tr>`).join("");
}

async function hapus(id){
  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });
  loadData();
}

// INIT
function init(){

  if(user){
    if(nik) nik.value=user.nik;
    if(nama) nama.value=user.nama;
    if(welcome) welcome.innerText="Halo "+user.nama;
  }

  menu("dash");

  if(mulai && akhir){
    mulai.oninput=hitungJam;
    akhir.oninput=hitungJam;
  }

  setInterval(()=>{
    loadDashboard();
    loadGrafik();
  },10000); // 🔥 jangan terlalu sering
}

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
