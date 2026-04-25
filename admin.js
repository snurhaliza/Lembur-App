const GAS_URL = "https://script.google.com/macros/s/AKfycbxh4yXDGDs_PcnQbZ4IEhtsYIRSXMvluDLiLXvjtCV_U8GjkMHxs2lSS_eivvnToj9M/exec";

/* ================= MENU ================= */
function menu(id){
  ["dash","data","grafik"].forEach(x=>{
    document.getElementById(x).style.display="none";
  });

  document.getElementById(id).style.display="block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadChart();
}

/* ================= DASHBOARD ================= */
async function loadDashboard(){
  let res = await fetch(GAS_URL+"?action=dashboard");
  let d = await res.json();

  document.getElementById("todayCount").innerText = d.todayCount || 0;
  document.getElementById("monthTotal").innerText = d.monthTotal || 0;
  document.getElementById("warning").innerText = d.warning || 0;
}

/* ================= DATA LEMBUR + VALIDASI SEARCH ================= */
async function loadData(){
  let res = await fetch(GAS_URL+"?action=data");
  let data = await res.json();

  let s = document.getElementById("search").value.toLowerCase();

  // FILTER DATA
  let hasil = data.filter(x => x.nama.toLowerCase().includes(s));

  // ❌ VALIDASI JIKA TIDAK DITEMUKAN
  if(hasil.length === 0){
    document.getElementById("table").innerHTML = `
      <tr>
        <td colspan="9">❌ Nama tidak ditemukan</td>
      </tr>
    `;
    return;
  }

  let html = "";

  hasil.forEach(d=>{
    html += `
    <tr>
      <td>${d.tanggal}</td>
      <td>${d.nik}</td>
      <td>${d.nama}</td>
      <td>${d.keterangan}</td>
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

/* ================= DELETE ================= */
async function hapus(id){
  if(!confirm("Yakin ingin menghapus data ini?")) return;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"delete",
      id:id
    })
  });

  loadData();
}

/* ================= GRAFIK ================= */
let chart;

async function loadChart(){
  let res = await fetch(GAS_URL+"?action=grafik");
  let data = await res.json();

  let nama = data.map(x=>x.nama);
  let total = data.map(x=>x.total);

  // destroy chart lama
  if(chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels:nama,
      datasets:[{
        label:"Jam Lembur",
        data:total
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true}
      }
    }
  });
}

/* ================= LOGOUT ================= */
function logout(){
  localStorage.clear();
  window.location.href = "index.html";
}

/* ================= AUTO REFRESH DASHBOARD ================= */
setInterval(loadDashboard, 10000);
