const GAS_URL = "https://script.google.com/macros/s/AKfycby9Qunx5lbCBThMRIln56ckHoJy37xdIoJY__UP2yc_-VOaaukCQMUncs_5MN-Izh60/exec";

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// ================= LOGIN =================
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
  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}

// ================= DASHBOARD =================
async function loadDashboard(){

  let url = GAS_URL+"?action=dashboard";

  if(user){
    url += "&nik="+user.nik;
    url += "&role="+user.role;
  }

  let r = await fetch(url+"&t="+Date.now());
  let d = await r.json();

  if(todayCount) todayCount.innerText = d.todayTotal||0;
  if(monthTotal) monthTotal.innerText = (d.monthTotal||0)+" Jam";
}

// ================= GRAFIK (SUDAH FILTER) =================
async function loadGrafik(){

  let bulan = document.getElementById("filterBulan")?.value;

  let url = GAS_URL+"?action=grafik";

  if(bulan){
    url += "&bulan="+bulan;
  }

  let r = await fetch(url+"&t="+Date.now());
  let d = await r.json();

  let ctx = document.getElementById("chart");
  if(!ctx) return;

  if(chart) chart.destroy();

  if(!d || d.length===0){
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

// ================= INIT =================
function init(){

  if(user){
    if(nik) nik.value=user.nik;
    if(nama) nama.value=user.nama;
    if(welcome) welcome.innerText="Halo "+user.nama;
  }

  loadDashboard();
  loadGrafik();

  // ✅ trigger filter bulan
  let filter = document.getElementById("filterBulan");
  if(filter){
    filter.onchange = loadGrafik;
  }

  setInterval(()=>{
    loadDashboard();
    loadGrafik();
  },10000);
}

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}
