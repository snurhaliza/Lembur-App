const GAS_URL = "https://script.google.com/macros/s/AKfycbyFmMRBvObPknM7Vwe4EoXWV5vr5jrXhSBF5p6DPFVCw3Lo85i3Xre0-rUz_Gs3NTd8/exec";

// LOGIN
function login(){
  fetch(`${GAS_URL}?action=login&nik=${loginNik.value}`)
  .then(r=>r.json())
  .then(res=>{
    if(!res.status) return alert("Login gagal");

    res.role = role.value;
    localStorage.setItem("user",JSON.stringify(res));

    loginPage.style.display="none";
    appPage.style.display="block";

    if(res.role==="admin"){
      loadDashboard();
    }
  });
}

// DASHBOARD
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

// TABLE BULAN
function loadTable(){
  let [y,m]=filterBulan.value.split("-");

  fetch(`${GAS_URL}?action=grafik&tahun=${y}&bulan=${m}`)
  .then(r=>r.json())
  .then(d=>{
    tableBody.innerHTML="";

    d.forEach(x=>{
      tableBody.innerHTML+=`<tr><td>${x.nama}</td><td>${x.total}</td></tr>`;
    });
  });
}

filterBulan.onchange=loadTable;

// EXPORT
function exportExcel(){
  alert("Export Excel (bisa pakai Sheet langsung)");
}

function exportPDF(){
  window.print();
}

// NAV
function showPage(p){
  dashboard.style.display="none";
  data.style.display="none";
  all.style.display="none";

  document.getElementById(p).style.display="block";
}
