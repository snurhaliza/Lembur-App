const GAS_URL = "https://script.google.com/macros/s/AKfycbzEF_Ux0ZcCUkHa5EAXWyno0Ys66po_GNAYkhumRdUdqpYpDXXc2txGLY8XGhsSoSfq/exec";

// TOAST
function toast(msg,type="success"){
  let d=document.createElement("div");
  d.className="toast "+type;
  d.innerHTML=msg;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2500);
}

// LOGIN
function login(){
  if(!loginNik.value || !loginPass.value){
    return toast("Isi semua field","error");
  }

  fetch(`${GAS_URL}?action=login&nik=${loginNik.value}&password=${loginPass.value}`)
  .then(r=>r.json())
  .then(res=>{
    if(!res.status) return toast("Login gagal","error");

    localStorage.setItem("user", JSON.stringify(res));
    init(res);
    show("appPage");
  });
}

// INIT
function init(u){
  welcome.innerHTML="Halo, "+u.nama;
  nama.value=u.nama;
  window.userNik=u.nik;

  setDashboard();
  showPage("dashboard");

  bulanTahun.value=new Date().toISOString().slice(0,7);
}

// DASHBOARD
function setDashboard(){
  let t=new Date();
  todayDate.innerHTML=t.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}

// NAV
function show(id){
  loginPage.classList.remove("active");
  appPage.classList.remove("active");
  document.getElementById(id).classList.add("active");
}

function showPage(p){
  dashboard.style.display="none";
  input.style.display="none";
  grafik.style.display="none";

  document.getElementById(p).style.display="block";

  if(p==="grafik") loadGrafik();
}

// LOGOUT
function logout(){
  localStorage.removeItem("user");
  show("loginPage");
}

// HITUNG JAM
function hitung(){
  if(!mulai.value || !akhir.value) return total.value="";

  let [a,b]=mulai.value.split(":").map(Number);
  let [c,d]=akhir.value.split(":").map(Number);

  let m=(c*60+d)-(a*60+b);
  if(m<0) m+=1440;

  let j=m/60;
  if(lembur.value==="N" && j>=5) j--;

  total.value=j.toFixed(1);
}
mulai.oninput=hitung;
akhir.oninput=hitung;
lembur.onchange=hitung;

// SIMPAN
function simpan(){
  if(!tanggal.value) return toast("Tanggal wajib","error");
  if(!pekerjaan.value) return toast("Pekerjaan wajib","error");
  if(!lembur.value) return toast("Pilih lembur","error");
  if(!alasan.value) return toast("Pilih alasan","error");
  if(!mulai.value || !akhir.value) return toast("Jam belum lengkap","error");

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
    if(res==="SUDAH_ADA") return toast("Sudah isi hari ini","error");

    toast("✔ Lembur berhasil disimpan","success");
    statusHari.innerHTML="Sudah Input ✔";
  });
}

// GRAFIK
let chartInstance;

function loadGrafik(){
  let [y,m]=bulanTahun.value.split("-");

  fetch(`${GAS_URL}?action=grafik&tahun=${y}&bulan=${m}`)
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
      }
    });
  });
}

// AUTO LOGIN
window.onload=function(){
  let u=JSON.parse(localStorage.getItem("user"));
  if(u){
    init(u);
    show("appPage");
  }
}
