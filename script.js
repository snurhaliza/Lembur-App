const GAS = "https://script.google.com/macros/s/AKfycbxJghFH4e9L0ld9KJjRXJIOjNLkkuP04htRK2Bnq07b6uQyYJxig3XooKyc_lmjNbId/exec"; // ganti

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// INIT
function init(){

  if(user){
    nik.value=user.nik;
    nama.value=user.nama;
    welcome.innerText="Halo "+user.nama;
  }

  menu("dash");

  mulai.oninput=hitung;
  akhir.oninput=hitung;
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDash();
    loadGrafik();
  }
}

// DASHBOARD
async function loadDash(){

  let url = GAS+"?action=dash&nik="+user.nik;
  let d = await (await fetch(url)).json();

  monthTotal.innerText=(d.total||0)+" Jam";
}

// HITUNG JAM
function hitung(){
  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);
  let j=(b-a)/3600000;
  if(j<0) j+=24;
  total.value=j.toFixed(1);
}

// SIMPAN
async function simpan(){

  if(!keterangan.value||!jenis.value||!jam.value||!mulai.value||!akhir.value){
    alert("Isi semua!");
    return;
  }

  let r = await fetch(GAS,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:keterangan.value,
      lembur:jenis.value,
      k_alasan:jam.value,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value
    })
  });

  let d = await r.json();

  if(!d.status){
    alert("Sudah input hari ini!");
    return;
  }

  alert("Tersimpan");
  resetForm();
  loadDash();
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

// GRAFIK
async function loadGrafik(){

  let d = await (await fetch(GAS+"?action=grafik")).json();

  let ctx = document.getElementById("chart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:d.map(x=>x.nama),
      datasets:[{
        label:"Jam Lembur",
        data:d.map(x=>x.total)
      }]
    }
  });
}

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
