const GAS_URL="https://script.google.com/macros/s/AKfycbxw4S2O1OBBSPTfqmUJlJHzAPHLiEr_-y7w_CDQnBDKOYZTZMIbcNq65gAUM9HNeyjy/exec";

let user=JSON.parse(localStorage.getItem("user"));

// LOGIN
async function login(){
  let pass=password.value.trim();
  let role=document.getElementById("role").value;

  let r=await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d=await r.json();

  if(!d.status){ msg.innerText="User tidak ditemukan"; return; }
  if(d.role!==role){ msg.innerText="Role salah"; return; }

  localStorage.setItem("user",JSON.stringify(d));
  location.href=role==="admin"?"admin.html":"karyawan.html";
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDashboard();
    loadGrafik(); // 🔥 FIX
  }

  if(id==="data") loadData();
}

// DASHBOARD
async function loadDashboard(){

  let url=GAS_URL+"?action=dashboard";
  if(user?.role==="karyawan") url+="&nik="+user.nik;

  let r=await fetch(url+"&t="+Date.now());
  let d=await r.json();

  if(todayCount) todayCount.innerText=d.notif||0;
  if(monthTotal) monthTotal.innerText=(d.monthTotal||0)+" Jam";
}

// GRAFIK
let chart;

async function loadGrafik(){

  let r=await fetch(GAS_URL+"?action=grafik&t="+Date.now());
  let d=await r.json();

  let ctx=document.getElementById("chart");

  if(!ctx) return;

  if(chart) chart.destroy();

  // fallback kalau kosong
  if(!d || d.length===0){
    chart=new Chart(ctx,{
      type:"bar",
      data:{
        labels:["Belum ada data"],
        datasets:[{data:[0]}]
      }
    });
    return;
  }

  chart=new Chart(ctx,{
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

  menu("dash");

  setInterval(()=>{
    loadDashboard();
    loadGrafik();
  },5000);
}

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
