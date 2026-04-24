const GAS_URL = "https://script.google.com/macros/s/AKfycbypLFpFkBjIGegg8aXQyNd1pzrMOvKA7rwwp5yWpdckUBSEnjdkb2LDiJJrCxSKnZxd/exec";

// LOGIN (NIK = PASSWORD)
function login(){

  if(!loginNik.value){
    return alert("Isi NIK");
  }

  fetch(`${GAS_URL}?action=login&nik=${loginNik.value}&password=${loginNik.value}`)
  .then(r=>r.json())
  .then(res=>{
    if(!res.status) return alert("Login gagal");

    localStorage.setItem("user", JSON.stringify(res));

    loginPage.style.display="none";
    appPage.style.display="block";

    welcome.innerHTML = "Halo, " + res.nama;
    nama.value = res.nama;

    if(res.role === "admin"){
      loadDashboard();
      showPage("dashboard");
    }else{
      showPage("input");
    }
  })
  .catch(()=>{
    alert("Server error");
  });
}

// NAVIGATION
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
  location.reload();
}

// HITUNG JAM OTOMATIS
mulai.oninput = hitung;
akhir.oninput = hitung;

function hitung(){
  if(!mulai.value || !akhir.value) return;

  let a = new Date("2000-01-01 "+mulai.value);
  let b = new Date("2000-01-01 "+akhir.value);

  let jam = (b - a) / 3600000;
  if(jam < 0) jam += 24;

  total.value = jam.toFixed(1);
}

// SIMPAN LEMBUR
function simpan(){

  if(!tanggal.value) return alert("Tanggal kosong");
  if(!pekerjaan.value) return alert("Pekerjaan kosong");
  if(!total.value) return alert("Jam belum dihitung");

  let user = JSON.parse(localStorage.getItem("user"));

  fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      tanggal:tanggal.value,
      nik:user.nik,
      nama:user.nama,
      pekerjaan:pekerjaan.value,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value
    })
  })
  .then(r=>r.json())
  .then(res=>{
    if(res==="SUDAH_ADA") return alert("Sudah isi hari ini");

    alert("Lembur tersimpan");

    // RESET FORM
    pekerjaan.value="";
    mulai.value="";
    akhir.value="";
    total.value="";
  });
}

// DASHBOARD ADMIN
function loadDashboard(){
  fetch(`${GAS_URL}?action=dashboard`)
  .then(r=>r.json())
  .then(d=>{
    todayTotal.innerHTML=d.today;
    monthTotal.innerHTML=d.month;
    warningTotal.innerHTML=d.warning;

    new Chart(chart,{
      type:'bar',
      data:{
        labels:d.chart.map(x=>x.nama),
        datasets:[{data:d.chart.map(x=>x.total)}]
      }
    });
  });
}

// GRAFIK
function loadGrafik(){
  let [y,m]=bulanTahun.value.split("-");

  fetch(`${GAS_URL}?action=grafik&tahun=${y}&bulan=${m}`)
  .then(r=>r.json())
  .then(d=>{
    new Chart(chart2,{
      type:'bar',
      data:{
        labels:d.map(x=>x.nama),
        datasets:[{data:d.map(x=>x.total)}]
      }
    });
  });
}
