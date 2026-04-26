const GAS_URL = "https://script.google.com/macros/s/AKfycbwIKHpxc7tgQ8lvpTnDXHVQMYKwJluIHZGLHtw1z-z3vNr_JwOlMczhhprs3EEL0BDD/exec";

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// LOGIN
async function login(){

  let pass = password.value.trim();
  let role = document.getElementById("role").value;

  if(!pass){
    msg.innerText="NIK wajib diisi!";
    return;
  }

  let r = await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d = await r.json();

  if(!d.status){
    msg.innerText="User tidak ditemukan!";
    return;
  }

  if(d.role!==role){
    msg.innerText="Role salah!";
    return;
  }

  localStorage.setItem("user",JSON.stringify(d));
  location.href = role==="admin"?"admin.html":"karyawan.html";
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    setTanggal();
    loadDashboard();
    loadGrafik();
  }

  if(id==="data") loadData();
}

// TANGGAL
function setTanggal(){
  let el = document.getElementById("todayDate");
  if(!el) return;

  let now = new Date();

  el.innerText = now.toLocaleDateString("id-ID",{
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
  });
}

// DASHBOARD
async function loadDashboard(){

  let url = GAS_URL+"?action=dashboard";

  if(user){
    url += "&role="+user.role;
  }

  let r = await fetch(url);
  let d = await r.json();

  if(todayCount) todayCount.innerText = d.todayTotal||0;
}

// GRAFIK
async function loadGrafik(){

  let bulan = document.getElementById("filterBulan")?.value || "";

  let url = GAS_URL+"?action=grafik";
  if(bulan) url += "&bulan="+bulan;

  let r = await fetch(url);
  let d = await r.json();

  let ctx = document.getElementById("chart");
  if(!ctx) return;

  if(chart) chart.destroy();

  if(!d.length){
    chart = new Chart(ctx,{
      type:"bar",
      data:{
        labels:["Belum ada data"],
        datasets:[{data:[0]}]
      }
    });
    return;
  }

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

// INIT
function init(){

  if(user){
    if(nik) nik.value=user.nik;
    if(nama) nama.value=user.nama;
    if(welcome) welcome.innerText="Halo "+user.nama;
  }

  setTanggal();
  menu("dash");

  setInterval(()=>{
    loadDashboard();
    loadGrafik();
  },10000);
}

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
