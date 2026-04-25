const GAS_URL = "https://script.google.com/macros/s/AKfycbwDHaRgVaNDr3Oe2zhMgZZ52W-R-UdlQ_poFELzMHlZhFITzJt6EAYGrueExjC2f5k/exec";

function menu(id){
  ["dash","data","grafik"].forEach(x=>{
    document.getElementById(x).style.display="none";
  });

  document.getElementById(id).style.display="block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadChart();
}

async function loadDashboard(){
  let res = await fetch(GAS_URL+"?action=dashboard");
  let d = await res.json();

  todayCount.innerText = d.todayCount;
  monthTotal.innerText = d.monthTotal;
  warning.innerText = d.warning;
}

async function loadData(){
  let res = await fetch(GAS_URL+"?action=data");
  let data = await res.json();

  let s = search.value.toLowerCase();
  let html="";

  data.filter(x=>x.nama.toLowerCase().includes(s))
  .forEach(d=>{
    html+=`
    <tr>
    <td>${d.tanggal}</td>
    <td>${d.nik}</td>
    <td>${d.nama}</td>
    <td>${d.keterangan}</td>
    <td>${d.tipe}</td>
    <td>${d.mulai}</td>
    <td>${d.akhir}</td>
    <td>${d.total}</td>
    <td><button onclick="hapus(${d.id})">Hapus</button></td>
    </tr>`;
  });

  table.innerHTML=html;
}

async function hapus(id){
  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });
  loadData();
}

let chart;

async function loadChart(){
  let res = await fetch(GAS_URL+"?action=grafik");
  let data = await res.json();

  let nama = data.map(x=>x.nama);
  let total = data.map(x=>x.total);

  if(chart) chart.destroy();

  chart = new Chart(chartCanvas,{
    type:"bar",
    data:{
      labels:nama,
      datasets:[{data:total}]
    }
  });
}

function logout(){
  localStorage.clear();
  location.href="index.html";
}

setInterval(loadDashboard,10000);
