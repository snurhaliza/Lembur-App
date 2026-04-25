const GAS_URL = "https://script.google.com/macros/s/AKfycbzEslE_V9X4C3xVnc_MLrzirZMFaWHWQtxo2JlvNphXyeTMvoGNd9lZ6IyrFPQHs_mw/exec";

let user = JSON.parse(localStorage.getItem("user"));

nik.value = user.nik;
nama.value = user.nama;
tanggal.value = new Date().toISOString().split("T")[0];

// SAPAAN
welcome.innerText = "Halo, " + user.nama;

// TANGGAL HARI INI
todayDate.innerText = new Date().toLocaleDateString("id-ID", {
  weekday:"long",
  day:"numeric",
  month:"long",
  year:"numeric"
});

// MENU
function menu(id){
  ["dash","input","grafik"].forEach(x=>{
    document.getElementById(x).style.display="none";
  });
  document.getElementById(id).style.display="block";

  if(id==="grafik") loadChart();
}

// HITUNG JAM OTOMATIS
mulai.oninput = akhir.oninput = function(){
  let a = new Date("2000 "+mulai.value);
  let b = new Date("2000 "+akhir.value);
  let jam = (b-a)/3600000;
  if(jam<0) jam+=24;
  total.value = jam.toFixed(1);
};

// SIMPAN
async function simpan(){

  if(!keterangan.value || !jenis.value || !jam.value || !mulai.value || !akhir.value){
    alert("❌ Semua field wajib diisi");
    return;
  }

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:keterangan.value,
      alasan:jenis.value,
      k_alasan:jam.value,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value
    })
  });

  alert("✅ Tersimpan");
  resetForm();
  loadDashboard();
}

// RESET
function resetForm(){
  keterangan.value="";
  jenis.value="";
  jam.value="";
  mulai.value="";
  akhir.value="";
  total.value="";
}

// DASHBOARD REALTIME
async function loadDashboard(){

  let res = await fetch(GAS_URL+"?action=data");
  let data = await res.json();

  let today = new Date().toLocaleDateString("id-ID");

  let userData = data.filter(d=>d.nik===user.nik);

  // TOTAL HARI INI
  let todayData = userData.filter(d=>d.tanggal===today);
  let totalToday = todayData.reduce((a,b)=>a+Number(b.total),0);

  todayJam.innerText = totalToday+" Jam";

  // STATUS
  status.innerText = todayData.length ? "✅ Sudah Input" : "❌ Belum Input";

  // TOTAL BULAN
  let bulan = new Date().getMonth()+1;
  let tahun = new Date().getFullYear();

  let totalMonth = userData.filter(d=>{
    let [dd,mm,yy] = d.tanggal.split("/");
    return Number(mm)===bulan && Number(yy)===tahun;
  }).reduce((a,b)=>a+Number(b.total),0);

  monthTotal.innerText = totalMonth+" Jam";
}

// GRAFIK
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
      datasets:[{data:total}]
    }
  });
}

// AUTO REFRESH
setInterval(loadDashboard,5000);
loadDashboard();

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
