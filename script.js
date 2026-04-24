const GAS_URL = "https://script.google.com/macros/s/AKfycbxgTy5d1O9TvD465oSDd-GdNWMGBHJ4UCAdk92J1zuYMvDUaE9HwRjZ6n8xXBJwBwXp/exec"

function toast(msg){
  let d=document.createElement("div");
  d.className="toast";
  d.innerHTML=msg;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2000);
}

// LOGIN
function login(){
  if(!loginNik.value || !loginPass.value){
    return toast("Isi semua field");
  }

  fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"login",
      nik:loginNik.value,
      password:loginPass.value
    })
  })
  .then(r=>r.json())
  .then(res=>{
    if(!res.status) return toast("Login gagal");

    localStorage.setItem("user", JSON.stringify(res));
    init(res);
    show("appPage");
  })
  .catch(()=>toast("Server error"));
}

// INIT
function init(u){
  welcome.innerHTML="Halo "+u.nama;
  nama.value=u.nama;
  window.userNik=u.nik;
}

// NAV
function show(id){
  loginPage.classList.remove("active");
  appPage.classList.remove("active");
  document.getElementById(id).classList.add("active");
}

function showPage(p){
  input.style.display="none";
  grafik.style.display="none";

  if(p==="input") input.style.display="block";
  else{
    grafik.style.display="block";
    loadGrafik();
  }
}

// SIMPAN
function simpan(){

  if(!tanggal.value) return toast("Tanggal kosong");
  if(!pekerjaan.value) return toast("Pekerjaan kosong");
  if(!mulai.value || !akhir.value) return toast("Jam belum lengkap");

  fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      tanggal:tanggal.value,
      nik:userNik,
      nama:nama.value,
      pekerjaan:pekerjaan.value,
      lembur:lembur.value,
      alasan:alasan.value,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value
    })
  })
  .then(r=>r.json())
  .then(res=>{
    if(res==="SUDAH_ADA") return toast("Sudah isi hari ini");

    toast("✔ Berhasil simpan");
  })
  .catch(()=>toast("Gagal simpan"));
}

// GRAFIK
let chartInstance;

function loadGrafik(){
  let [y,m]=bulanTahun.value.split("-");

  fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"grafik",
      tahun:Number(y),
      bulan:Number(m)
    })
  })
  .then(r=>r.json())
  .then(d=>{
    if(chartInstance) chartInstance.destroy();

    chartInstance=new Chart(chart,{
      type:'bar',
      data:{
        labels:d.map(x=>x.nama),
        datasets:[{
          data:d.map(x=>x.total),
          backgroundColor:'#2563eb'
        }]
      },
      options:{plugins:{legend:{display:false}}}
    });
  })
  .catch(()=>toast("Gagal load grafik"));
}
