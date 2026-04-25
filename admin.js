const GAS_URL = "https://script.google.com/macros/s/AKfycbwtWmjiLibJ320aegedisIa-ouw5H-buLZ8yU085MLNHfgUheNGDr-f8hE-sRqkFZWu/exec";

function menu(id){
  ["dash","data","grafik"].forEach(x=>{
    document.getElementById(x).style.display="none";
  });

  document.getElementById(id).style.display="block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadChart();
}

/* DASHBOARD */
async function loadDashboard(){
  let res = await fetch(GAS_URL+"?action=dashboard");
  let d = await res.json();

  document.getElementById("todayCount").innerText = d.todayCount;
  document.getElementById("monthTotal").innerText = d.monthTotal;
  document.getElementById("warning").innerText = d.warning;
}

/* DATA */
async function loadData(){
  let res = await fetch(GAS_URL+"?action=data");
  let data = await res.json();

  let search = document.getElementById("search").value.toLowerCase();

  let html = "";

  data.filter(d=>d.nama.toLowerCase().includes(search))
  .forEach(d=>{
    html += `
    <tr>
      <td>${d.tanggal}</td>
      <td>${d.nik}</td>
      <td>${d.nama}</td>
      <td>${d.alasan}</td>
      <td>${d.tipe}</td>
      <td>${d.mulai}</td>
      <td>${d.akhir}</td>
      <td>${d.total}</td>
      <td>
        <button onclick="hapus(${d.id})">Hapus</button>
      </td>
    </tr>`;
  });

  document.getElementById("table").innerHTML = html;
}

/* DELETE */
async function hapus(id){
  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });
  loadData();
}

/* GRAFIK */
let chart;

async function loadChart(){
  let res = await fetch(GAS_URL+"?action=grafik");
  let data = await res.json();

  let nama = data.map(x=>x.nama);
  let total = data.map(x=>x.total);

  if(chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels:nama,
      datasets:[{
        label:"Jam Lembur",
        data:total
      }]
    }
  });
}

function logout(){
  localStorage.clear();
  window.location.href="index.html";
}

/* AUTO REFRESH NOTIF */
setInterval(loadDashboard, 10000);
