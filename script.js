const GAS_URL = "https://script.google.com/macros/s/AKfycbwVhwF-WUuyUwoFVdGXZlVVfRekyioZWZhoV-EQDpygqbzNJYpI3yvMQZcX55OHYhbx/exec";

const loginNik = document.getElementById("loginNik");
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

const dashboard = document.getElementById("dashboard");
const lembur = document.getElementById("lembur");

const todayTotal = document.getElementById("todayTotal");
const monthTotal = document.getElementById("monthTotal");
const warningList = document.getElementById("warningList");
const top3 = document.getElementById("top3");
const tableLembur = document.getElementById("tableLembur");

function login(){

  const nik = loginNik.value.trim();
  const role = document.getElementById("role").value;

  if(!nik){
    alert("NIK wajib diisi");
    return;
  }

  fetch(`${GAS_URL}?action=login&nik=${nik}&password=${nik}`)
  .then(r=>r.json())
  .then(res=>{

    if(!res.status){
      alert("Login gagal");
      return;
    }

    res.role = role;
    localStorage.setItem("user", JSON.stringify(res));

    loginPage.style.display="none";
    appPage.style.display="block";

    document.getElementById("welcome").innerText =
      `Selamat datang ${res.nama} (${role})`;

    loadDashboard();
  })
  .catch(()=>{
    alert("Server error / koneksi gagal");
  });
}

function showPage(p){
  dashboard.style.display="none";
  lembur.style.display="none";
  document.getElementById(p).style.display="block";

  if(p==="lembur") loadLembur();
}

function logout(){
  localStorage.clear();
  location.reload();
}

function loadDashboard(){
  fetch(`${GAS_URL}?action=dashboard`)
  .then(r=>r.json())
  .then(d=>{

    todayTotal.innerText = d.today;
    monthTotal.innerText = d.month;

    warningList.innerHTML = d.warningList
      .map(x=>`${x.nama} (${x.total} jam)`)
      .join("<br>");

    let top = d.chart.sort((a,b)=>b.total-a.total).slice(0,3);

    top3.innerHTML = top
      .map(x=>`<li>${x.nama} - ${x.total} jam</li>`)
      .join("");
  });
}

function loadLembur(){
  fetch(`${GAS_URL}?action=all`)
  .then(r=>r.json())
  .then(data=>{
    renderTable(data);
  });
}

function renderTable(data){
  tableLembur.innerHTML = data.map(x=>`
    <tr>
      <td>${x.tanggal}</td>
      <td>${x.nama}</td>
      <td>${x.pekerjaan}</td>
      <td>${x.total}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="hapus('${x.id}')">X</button>
      </td>
    </tr>
  `).join("");
}

function hapus(id){
  fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"hapus", id})
  }).then(()=>loadLembur());
}

function exportExcel(){
  window.open(GAS_URL+"?action=export");
}
