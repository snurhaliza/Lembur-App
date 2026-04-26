const GAS = "https://script.google.com/macros/s/AKfycbyJzOOUt2I-6xP8WtK4OpjQ4T8pPfp_a_UQl4Hc6MtO59cWvpBYkGUF3Ku9TXJszLQI/exec";
let user = JSON.parse(localStorage.getItem("user"));
let chart;

// LOGIN
async function login(){

  let pass = password.value.trim();
  let role = roleSelect.value;

  let d = await (await fetch(`${GAS}?action=login&password=${pass}`)).json();

  if(!d.status){
    msg.innerText="Login gagal!";
    return;
  }

  if(d.role !== role){
    msg.innerText="Role salah!";
    return;
  }

  localStorage.setItem("user",JSON.stringify(d));
  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}

// DASHBOARD
async function loadDash(){

  let url = GAS+"?action=dash";
  if(user?.nik) url+="&nik="+user.nik;

  let d = await (await fetch(url)).json();

  if(todayCount) todayCount.innerText=d.notif||0;
  if(monthTotal) monthTotal.innerText=(d.total||0)+" Jam";
}

// DATA
async function loadData(){

  let d = await (await fetch(GAS+"?action=data")).json();

  table.innerHTML = d.map(x=>`
  <tr>
    <td>${x.tanggal}</td>
    <td>${x.nik}</td>
    <td>${x.nama}</td>
    <td>${x.pekerjaan}</td>
    <td>${x.lembur}</td>
    <td>${x.k_alasan}</td>
    <td>${x.mulai}</td>
    <td>${x.akhir}</td>
    <td>${x.total}</td>
    <td><button onclick="hapus(${x.id})">Hapus</button></td>
  </tr>`).join("");
}

// DELETE
async function hapus(id){
  await fetch(GAS,{
    method:"POST",
    body:JSON.stringify({action:"hapus",id})
  });
  loadData();
}

// HITUNG JAM
function hitung(){
  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);
  let j=(b-a)/3600000;
  if(j<0) j+=24;
  total.value=j.toFixed(1);
}

// SIMPAN
async function simpan(){

  let d = await (await fetch(GAS,{
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
  })).json();

  if(!d.status){
    alert(d.msg);
    return;
  }

  alert("Tersimpan");
}

// GRAFIK
async function loadGrafik(){

  let d = await (await fetch(GAS+"?action=grafik")).json();

  let ctx=document.getElementById("chart");
  if(!ctx) return;

  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:"bar",
    data:{
      labels:d.map(x=>x.nama),
      datasets:[{data:d.map(x=>x.total)}]
    }
  });
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDash();
    loadGrafik();
  }

  if(id==="data") loadData();
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
    mulai.oninput=hitung;
    akhir.oninput=hitung;
  }

  setInterval(loadDash,15000);
}

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
