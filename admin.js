const GAS_URL = "https://script.google.com/macros/s/AKfycbybks5dvFwX8LbdFCfVL9Jb5UI3841AAaTOjEE6l3YkA80IWGkHqx-kVFLicfRLFfhQ/exec";

// ================= INIT =================
function init(){
  menu("dash");
  loadDashboard();
}

// ================= MENU =================
function menu(id){

  document.getElementById("dash").style.display = "none";
  document.getElementById("data").style.display = "none";
  document.getElementById("grafik").style.display = "none";

  document.getElementById(id).style.display = "block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadGrafik();
}

// ================= DASHBOARD =================
async function loadDashboard(){

  let res = await fetch(GAS_URL+"?action=dashboard");
  let d = await res.json();

  document.getElementById("todayCount").innerText = d.todayTotal || 0;
  document.getElementById("monthTotal").innerText = d.monthTotal || 0;
  document.getElementById("warning").innerText = d.status || "-";
}

// ================= DATA =================
async function loadData(){

  let res = await fetch(GAS_URL+"?action=data");
  let data = await res.json();

  let keyword = document.getElementById("search").value.toLowerCase();

  let html = "";

  let filtered = data.filter(d =>
    d.nama.toLowerCase().includes(keyword)
  );

  if(filtered.length === 0){
    html = `<tr><td colspan="9">Nama tidak ditemukan</td></tr>`;
  }else{
    filtered.forEach(d=>{
      html += `
      <tr>
      <td>${d.tanggal}</td>
      <td>${d.nik}</td>
      <td>${d.nama}</td>
      <td>${d.pekerjaan}</td>
      <td>${d.alasan}</td>
      <td>${d.mulai}</td>
      <td>${d.akhir}</td>
      <td>${d.total}</td>
      <td><button onclick="hapus(${d.id})">Hapus</button></td>
      </tr>`;
    });
  }

  document.getElementById("table").innerHTML = html;
}

// ================= DELETE =================
async function hapus(id){

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });

  loadData();
}

// ================= GRAFIK =================
let chart;

async function loadGrafik(){

  let res = await fetch(GAS_URL+"?action=grafik");
  let data = await res.json();

  let ctx = document.getElementById("chart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:data.map(d=>d.nama),
      datasets:[{
        label:"Jam Lembur",
        data:data.map(d=>d.total)
      }]
    }
  });
}

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}
