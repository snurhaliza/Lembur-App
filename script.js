const GAS_URL = "https://script.google.com/macros/s/AKfycbxfdAbe5tyS_kh8SIlkCafqZ7nbv1nzSZDm619NxS8Cvr-eOzwn_j01OmJnA_g_CrNo/exec";

// LOGIN
function login(){
  fetch(`${GAS_URL}?action=login&nik=${loginNik.value}&password=${loginNik.value}`)
  .then(r=>r.json())
  .then(res=>{
    if(!res.status) return alert("Login gagal");

    localStorage.setItem("user",JSON.stringify(res));
    init(res);
    show("appPage");
  });
}

// INIT
function init(u){
  nama.value=u.nama;
  welcome.innerHTML="Halo "+u.nama;

  let t=new Date();
  todayDate.innerHTML=t.toDateString();
  todayTop.innerHTML=t.toDateString();

  bulanTahun.value=new Date().toISOString().slice(0,7);
}

// NAV
function show(id){
  loginPage.style.display="none";
  appPage.style.display="block";
}

function showPage(p){
  dashboard.style.display="none";
  input.style.display="none";
  grafik.style.display="none";

  document.getElementById(p).style.display="block";

  if(p==="grafik") loadGrafik();
}

// HITUNG
mulai.oninput=hitung;
akhir.oninput=hitung;

function hitung(){
  if(!mulai.value||!akhir.value) return;

  let a=new Date("2000-01-01 "+mulai.value);
  let b=new Date("2000-01-01 "+akhir.value);

  let jam=(b-a)/3600000;
  if(jam<0) jam+=24;

  total.value=jam.toFixed(1);
}

// SIMPAN
function simpan(){
  fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      tanggal:tanggal.value,
      nik:JSON.parse(localStorage.getItem("user")).nik,
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
    if(res==="SUDAH_ADA") return alert("Sudah ada");

    successPopup.style.display="flex";
    setTimeout(()=>successPopup.style.display="none",2000);

    pekerjaan.value="";
    mulai.value="";
    akhir.value="";
    total.value="";
  });
}

// GRAFIK
function loadGrafik(){
  let [y,m]=bulanTahun.value.split("-");

  fetch(`${GAS_URL}?action=grafik&tahun=${y}&bulan=${m}`)
  .then(r=>r.json())
  .then(d=>{
    new Chart(chart,{
      type:'bar',
      data:{
        labels:d.map(x=>x.nama),
        datasets:[{data:d.map(x=>x.total)}]
      }
    });
  });
}
