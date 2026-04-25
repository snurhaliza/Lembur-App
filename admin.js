const GAS_URL = "https://script.google.com/macros/s/AKfycbz977NPlRuMLfpD4PMFsEBPOTO_sS_t7iCdcdZMNZVBhNqLkVtMc10dsV-Y1gqm8l33/exec";

function menu(id){

  ["dash","data","grafik"].forEach(x=>{
    document.getElementById(x).style.display="none";
  });

  document.getElementById(id).style.display="block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadGrafik();
}

// DASHBOARD
async function loadDashboard(){

  let r = await fetch(GAS_URL+"?action=dashboard");
  let d = await r.json();

  todayCount.innerText = d.todayTotal;
  monthTotal.innerText = d.monthTotal;
  warning.innerText = d.warning;
}

// DATA
async function loadData(){

  let r = await fetch(GAS_URL+"?action=data");
  let data = await r.json();

  let s = search.value.toLowerCase();

  let f = data.filter(x=>x.nama.toLowerCase().includes(s));

  if(f.length===0){
    table.innerHTML = `<tr><td colspan="10">Nama tidak ditemukan</td></tr>`;
    return;
  }

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

// DELETE
async function hapus(id){
  if(!confirm("Hapus data?")) return;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });

  loadData();
}

// GRAFIK
let chart;

async function loadGrafik(){

  let bulan = filterBulan.value;

  let url = GAS_URL+"?action=grafik";
  if(bulan) url += "&bulan="+bulan;

  let r = await fetch(url);
  let d = await r.json();

  if(chart) chart.destroy();

  chart = new Chart(chart,{
    type:"bar",
    data:{
      labels:d.map(x=>x.nama),
      datasets:[{data:d.map(x=>x.total)}]
    }
  });
}

function resetChart(){
  filterBulan.value="";
  loadGrafik();
}

function logout(){
  localStorage.clear();
  location.href="index.html";
}

setInterval(loadDashboard,5000);
menu("dash");
