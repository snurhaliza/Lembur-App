const GAS_URL = "https://script.google.com/macros/s/AKfycbyjhPZD19TH-Q6XGmBUUTx72X3bqPoYsvdsRumD7wDV5S3-CokcHdV2oecp0yNpgz3S/exec";

// ================= INIT =================
function init(){
  menu("dash");
}

// ================= MENU =================
function menu(id){

  ["dash","data","grafik"].forEach(x=>{
    document.getElementById(x).style.display = "none";
  });

  document.getElementById(id).style.display = "block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadGrafik();
}

// ================= DASHBOARD =================
async function loadDashboard(){

  try{
    let res = await fetch(GAS_URL+"?action=dashboard");
    let d = await res.json();

    // ADMIN = global (tanpa nik)
    document.getElementById("todayCount").innerText = d.todayTotal || 0;
    document.getElementById("monthTotal").innerText = d.monthTotal || 0;
    document.getElementById("warning").innerText = d.status || "-";

  }catch(err){
    console.log("Dashboard error:", err);
  }
}

// ================= DATA =================
async function loadData(){

  try{
    let res = await fetch(GAS_URL+"?action=data");
    let data = await res.json();

    let keyword = document.getElementById("search").value.toLowerCase();

    let html = "";

    let filtered = data.filter(d =>
      d.nama.toLowerCase().includes(keyword)
    );

    if(filtered.length === 0){
      html = `<tr><td colspan="10">❌ Nama tidak ditemukan</td></tr>`;
    }else{

      filtered.forEach(d=>{
        html += `
        <tr>
          <td>${d.tanggal}</td>
          <td>${d.nik}</td>
          <td>${d.nama}</td>
          <td>${d.pekerjaan}</td>
          <td>${d.lembur}</td>      <!-- ✅ FIX -->
          <td>${d.k_alasan}</td>    <!-- ✅ FIX -->
          <td>${d.mulai}</td>
          <td>${d.akhir}</td>
          <td>${d.total}</td>
          <td>
            <button onclick="hapus(${d.id})">Hapus</button>
          </td>
        </tr>`;
      });

    }

    document.getElementById("table").innerHTML = html;

  }catch(err){
    console.log("Data error:", err);
  }
}

// ================= DELETE =================
async function hapus(id){

  if(!confirm("Yakin hapus data?")) return;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"delete",
      id:id
    })
  });

  loadData();
}

// ================= GRAFIK =================
let chart;

async function loadGrafik(){

  try{

    let bulan = document.getElementById("filterBulan").value;

    let url = GAS_URL+"?action=grafik";
    if(bulan) url += "&bulan="+bulan;

    let res = await fetch(url);
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

  }catch(err){
    console.log("Grafik error:", err);
  }
}

// ================= RESET FILTER =================
function resetChart(){
  document.getElementById("filterBulan").value = "";
  loadGrafik();
}

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}

// ================= AUTO LOAD =================
init();

// refresh dashboard realtime
setInterval(loadDashboard, 5000);
