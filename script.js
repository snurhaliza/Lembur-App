const GAS_URL = "https://script.google.com/macros/s/AKfycbwq8xObhrM_d7RZcljULJC84YpszoaR7Hxu5Pxyx-RQqq-XjEywzFEe7w9xViFm7Uen/exec";

let user = JSON.parse(localStorage.getItem("user"));

// ================= LOGIN =================
async function login(){

  let pass = password.value.trim();
  let role = role.value;

  if(!pass){
    msg.innerText="Isi NIK!";
    return;
  }

  let r = await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d = await r.json();

  if(!d.status){
    msg.innerText="User tidak ditemukan!";
    return;
  }

  if(d.role !== role){
    msg.innerText="Role salah!";
    return;
  }

  localStorage.setItem("user", JSON.stringify(d));

  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}

// ================= INIT =================
function init(){

  if(user){
    if(nik) nik.value=user.nik;
    if(nama) nama.value=user.nama;
    if(welcome) welcome.innerText="Halo "+user.nama;
    if(todayDate) todayDate.innerText=new Date().toLocaleDateString("id-ID");
  }

  menu("dash");

  if(mulai && akhir){
    mulai.oninput=hitungJam;
    akhir.oninput=hitungJam;
  }

  setInterval(loadDashboard,5000);
}

// ================= MENU =================
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDashboard();
    loadGrafik();
  }
  if(id==="data") loadData();
}

// ================= DASHBOARD =================
async function loadDashboard(){

  let url = GAS_URL+"?action=dashboard";
  if(user?.nik) url += "&nik="+user.nik;

  let r = await fetch(url);
  let d = await r.json();

  if(todayCount) todayCount.innerText=d.todayTotal||0;
  if(todayTotal) todayTotal.innerText=(d.todayTotal||0)+" Jam";
  if(monthTotal) monthTotal.innerText=(d.monthTotal||0)+" Jam";
}

// ================= HITUNG JAM =================
function hitungJam(){
  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);
  let j=(b-a)/3600000;
  if(j<0) j+=24;
  total.value=j.toFixed(1);
}

// ================= SIMPAN =================
async function simpan(){

  if(!keterangan.value||!jenis.value||!jam.value||!mulai.value||!akhir.value){
    alert("Isi semua!");
    return;
  }

  await fetch(GAS_URL,{
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

  alert("Tersimpan");
  resetForm();
  loadDashboard();
}

// ================= RESET =================
function resetForm(){
  keterangan.value="";
  jenis.value="";
  jam.value="";
  mulai.value="";
  akhir.value="";
  total.value="";
}

// ================= DATA =================
async function loadData(){

  let r = await fetch(GAS_URL+"?action=data");
  let data = await r.json();

  let s = search.value.toLowerCase();

  let f = data.filter(x=>x.nama.toLowerCase().includes(s));

  table.innerHTML = f.map(d=>`
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

// ================= DELETE =================
async function hapus(id){
  if(!confirm("Hapus data?")) return;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });

  loadData();
}

// ================= GRAFIK =================
let chart;

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

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}
