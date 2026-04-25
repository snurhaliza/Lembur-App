const GAS_URL = "https://script.google.com/macros/s/AKfycbzZNWLPacwWkh3bLn3MDjsAFuasWJM450PY-H9ariYe3sgVYKWjguqQen0feDlaUfoP/exec";

function menu(id){
  document.getElementById("dash").style.display="none";
  document.getElementById("data").style.display="none";

  document.getElementById(id).style.display="block";

  if(id==="data") loadData();
  if(id==="dash") loadDashboard();
}

async function loadDashboard(){
  let res = await fetch(GAS_URL+"?action=dashboard");
  let d = await res.json();

  document.getElementById("todayCount").innerText = d.today || 0;
  document.getElementById("monthTotal").innerText = d.month || 0;
}

async function loadData(){
  let res = await fetch(GAS_URL+"?action=data");
  let data = await res.json();

  let search = document.getElementById("search").value.toLowerCase();

  let html = "";

  data
  .filter(d => d.nama.toLowerCase().includes(search))
  .forEach(d=>{
    html += `
    <tr>
      <td>${d.tanggal}</td>
      <td>${d.nik}</td>
      <td>${d.nama}</td>
      <td>${d.total}</td>
      <td>${d.keterangan}</td>
      <td><button onclick="hapus(${d.id})">Hapus</button></td>
    </tr>`;
  });

  document.getElementById("table").innerHTML = html;
}

function logout(){
  localStorage.clear();
  window.location.href="index.html";
}
