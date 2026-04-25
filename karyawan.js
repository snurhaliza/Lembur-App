const GAS_URL = "https://script.google.com/macros/s/AKfycbybks5dvFwX8LbdFCfVL9Jb5UI3841AAaTOjEE6l3YkA80IWGkHqx-kVFLicfRLFfhQ/exec";

// ================= USER =================
let user = JSON.parse(localStorage.getItem("user"));

if(!user){
  alert("Session habis!");
  location.href = "index.html";
}

// ================= INIT =================
function init(){

  // SET DATA USER
  document.getElementById("nik").value = user.nik;
  document.getElementById("nama").value = user.nama;

  // SAPAAN
  document.getElementById("welcome").innerText = "Halo " + user.nama;

  // TANGGAL HARI INI
  let now = new Date();
  document.getElementById("todayDate").innerText =
    now.toLocaleDateString("id-ID", {
      weekday:"long",
      year:"numeric",
      month:"long",
      day:"numeric"
    });

  // DEFAULT TANGGAL INPUT
  document.getElementById("tanggal").value =
    new Date().toISOString().split("T")[0];

  // 🔥 PINDAHKAN EVENT KE SINI (INI YANG PENTING)
  document.getElementById("mulai").oninput = hitungJam;
  document.getElementById("akhir").oninput = hitungJam;

  // LOAD DASHBOARD
  loadDash();
  setInterval(loadDash, 5000);
}

// ================= HITUNG JAM =================
function hitungJam(){

  let mulai = document.getElementById("mulai").value;
  let akhir = document.getElementById("akhir").value;

  if(!mulai || !akhir) return;

  let a = new Date("2000-01-01 " + mulai);
  let b = new Date("2000-01-01 " + akhir);

  let jam = (b - a) / 3600000;
  if(jam < 0) jam += 24;

  document.getElementById("total").value = jam.toFixed(1);
}

// ================= DASHBOARD =================
async function loadDash(){

  try{
    let r = await fetch(GAS_URL + `?action=dashboard&nik=${user.nik}`);
    let d = await r.json();

    document.getElementById("todayTotal").innerText = (d.todayTotal || 0) + " Jam";
    document.getElementById("monthTotal").innerText = (d.monthTotal || 0) + " Jam";
    document.getElementById("status").innerText = d.status || "-";

  }catch(err){
    console.log("Dashboard error:", err);
  }
}

// ================= SIMPAN =================
async function simpan(){

  let pekerjaan = document.getElementById("keterangan").value;
  let mulai = document.getElementById("mulai").value;
  let akhir = document.getElementById("akhir").value;
  let total = document.getElementById("total").value;

  if(!pekerjaan || !mulai || !akhir){
    alert("❌ Semua field wajib diisi!");
    return;
  }

  try{

    await fetch(GAS_URL,{
      method:"POST",
      body:JSON.stringify({
        action:"simpan",
        nik:user.nik,
        nama:user.nama,
        pekerjaan:pekerjaan,
        alasan:document.getElementById("jenis").value,
        k_alasan:document.getElementById("jam").value,
        mulai:mulai,
        akhir:akhir,
        total:total
      })
    });

    alert("✅ Lembur tersimpan");

    resetForm();
    loadDash();

  }catch(err){
    alert("❌ Gagal simpan");
  }
}

// ================= RESET =================
function resetForm(){
  document.getElementById("keterangan").value = "";
  document.getElementById("mulai").value = "";
  document.getElementById("akhir").value = "";
  document.getElementById("total").value = "";
}

// ================= MENU =================
function menu(id){

  document.getElementById("dash").style.display = "none";
  document.getElementById("input").style.display = "none";
  document.getElementById("grafik").style.display = "none";

  document.getElementById(id).style.display = "block";

  if(id === "grafik") loadGrafik();
}

// ================= GRAFIK =================
let chart;

async function loadGrafik(){

  let res = await fetch(GAS_URL + "?action=grafik");
  let data = await res.json();

  let ctx = document.getElementById("chart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:data.map(d=>d.nama),
      datasets:[{
        label:"Top Lembur",
        data:data.map(d=>d.total)
      }]
    }
  });
}

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href = "index.html";
}
