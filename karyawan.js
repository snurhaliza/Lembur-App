const GAS_URL="https://script.google.com/macros/s/AKfycbz977NPlRuMLfpD4PMFsEBPOTO_sS_t7iCdcdZMNZVBhNqLkVtMc10dsV-Y1gqm8l33/exec";

let user=JSON.parse(localStorage.getItem("user"));

function init(){

  nik.value=user.nik;
  nama.value=user.nama;
  welcome.innerText="Halo "+user.nama;

  todayDate.innerText=new Date().toLocaleDateString("id-ID");

  loadDash();
  setInterval(loadDash,5000);
}

async function loadDash(){

  let r=await fetch(GAS_URL+`?action=dashboard&nik=${user.nik}`);
  let d=await r.json();

  todayTotal.innerText=d.todayTotal+" Jam";
  monthTotal.innerText=d.monthTotal+" Jam";
  status.innerText=d.status;
}

mulai.oninput=akhir.oninput=function(){
  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);
  let j=(b-a)/3600000;
  if(j<0) j+=24;
  total.value=j.toFixed(1);
};

async function simpan(){

  if(!keterangan.value||!jenis.value||!jam.value||!mulai.value||!akhir.value){
    alert("Isi semua!");
    return;
  }

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:keterangan.value,
      jenis:jenis.value,
      jam:jam.value,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value
    })
  });

  alert("Tersimpan");
  resetForm();
  loadDash();
}

function resetForm(){
  keterangan.value="";
  jenis.value="";
  jam.value="";
  mulai.value="";
  akhir.value="";
  total.value="";
}

function menu(id){
  document.querySelectorAll(".content > div").forEach(d=>d.style.display="none");
  document.getElementById(id).style.display="block";
  if(id==="grafik") loadGrafik();
}

let chart;

async function loadGrafik(){
  let r=await fetch(GAS_URL+"?action=grafik");
  let d=await r.json();

  if(chart) chart.destroy();

  chart=new Chart(chart,{
    type:"bar",
    data:{
      labels:d.map(x=>x.nama),
      datasets:[{data:d.map(x=>x.total)}]
    }
  });
}

function logout(){
  localStorage.clear();
  location.href="index.html";
}
