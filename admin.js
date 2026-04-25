const GAS_URL = "https://script.google.com/macros/s/AKfycbzEslE_V9X4C3xVnc_MLrzirZMFaWHWQtxo2JlvNphXyeTMvoGNd9lZ6IyrFPQHs_mw/exec";

let chart;

// ================= MENU =================
function menu(id){
  ["dash","data","grafik"].forEach(x=>{
    document.getElementById(x).style.display="none";
  });

  document.getElementById(id).style.display="block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadChart();
}

// ================= LOAD AWAL =================
window.onload = function(){
  menu("dash");
};

// ================= DASHBOARD =================
async function loadDashboard(){
  try{
    let res = await fetch(GAS_URL+"?action=dashboard");
    let d = await res.json();

    document.getElementById("todayCount").innerText = d.todayCount ?? 0;
    document.getElementById("monthTotal").innerText = d.monthTotal ?? 0;
    document.getElementById("warning").innerText = d.warning ?? "0";

  }catch(err){
    console.error(err);
    alert("❌ Gagal load dashboard");
  }
}

// ================= DATA =================
async function loadData(){
  try{
    let res = await fetch(GAS_URL+"?action=data");
    let data = await res.json();

    let s = document.getElementById("search").value.toLowerCase();
    let html="";

    let filtered = data.filter(x =>
      x.nama.toLowerCase().includes(s)
    );

    if(filtered.length === 0){
      html = `<tr><td colspan="10">❌ Nama tidak ditemukan</td></tr>`;
    }else{
      filtered.forEach(d=>{
        html+=`
        <tr>
          <td>${d.tanggal}</td>
          <td>${d.nik}</td>
          <td>${d.nama}</td>
          <td>${d.pekerjaan}</td>
          <td>${d.alasan}</td>
          <td>${d.k_alasan}</td>
          <td>${d.mulai}</td>
          <td>${d.akhir}</td>
          <td>${d.total}</td>
          <td>
            <button onclick="edit(${d.id})">Edit</button>
            <button onclick="hapus(${d.id})">Hapus</button>
          </td>
        </tr>`;
      });
    }

    document.getElementById("table").innerHTML = html;

  }catch(err){
    console.error(err);
    alert("❌ Gagal load data");
  }
}

// ================= DELETE =================
async function hapus(id){
  if(!confirm("Yakin hapus data?")) return;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });

  loadData();
}

// ================= EDIT =================
async function edit(id){
  alert("✏️ Edit manual dari spreadsheet dulu (fitur bisa ditambah nanti)");
}

// ================= CHART =================
async function loadChart(){
  try{
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
          label:"Top 3 Lembur",
          data:total
        }]
      }
    });

  }catch(err){
    console.error(err);
    alert("❌ Gagal load grafik");
  }
}

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}

// ================= AUTO REFRESH =================
setInterval(loadDashboard,5000);
