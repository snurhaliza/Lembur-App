const GAS_URL = "https://script.google.com/macros/s/AKfycbyjhPZD19TH-Q6XGmBUUTx72X3bqPoYsvdsRumD7wDV5S3-CokcHdV2oecp0yNpgz3S/exec";

let user = JSON.parse(localStorage.getItem("user"));

if(!user){
  alert("Session habis!");
  location.href = "index.html";
}

// INIT
function init(){
  document.getElementById("nik").value = user.nik;
  document.getElementById("nama").value = user.nama;
  document.getElementById("welcome").innerText = "Halo, " + user.nama;

  loadDash();
  setInterval(loadDash, 5000);
}

// DASHBOARD
async function loadDash(){

  let r = await fetch(GAS_URL + `?action=dashboard&nik=${user.nik}`);
  let d = await r.json();

  document.getElementById("todayJam").innerText = (d.todayTotal || 0) + " Jam";
  document.getElementById("monthTotal").innerText = (d.monthTotal || 0) + " Jam";
  document.getElementById("status").innerText = d.status;
}

// HITUNG JAM
document.getElementById("mulai").oninput =
document.getElementById("akhir").oninput = function(){

  let mulai = document.getElementById("mulai").value;
  let akhir = document.getElementById("akhir").value;

  if(!mulai || !akhir) return;

  let a = new Date("2000-01-01T" + mulai);
  let b = new Date("2000-01-01T" + akhir);

  let jam = (b - a) / 3600000;
  if(jam < 0) jam += 24;

  document.getElementById("total").value = jam.toFixed(1);
};

// SIMPAN
async function simpan(){

  let pekerjaan = document.getElementById("keterangan").value;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:pekerjaan,
      jenis:document.getElementById("jenis").value,
      jam:document.getElementById("jam").value,
      mulai:document.getElementById("mulai").value,
      akhir:document.getElementById("akhir").value,
      total:document.getElementById("total").value
    })
  });

  alert("Tersimpan");
  loadDash();
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(d=>{
    d.style.display="none";
  });
  document.getElementById(id).style.display="block";

  if(id === "grafik") loadGrafik();
}

// GRAFIK
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
        label:"Jam Lembur",
        data:data.map(d=>d.total)
      }]
    }
  });
}

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}

init();
