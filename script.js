const URL = "https://script.google.com/macros/s/AKfycbxXn-dqRFV_6W0t05d6zFfoUSqCohdCO2lgVtw1l5YomTp6W1IOM-Eu9PGtC8FWp3h7/exec";

let user = {};

function login(){
  const nik = document.getElementById("nik").value;
  const role = document.getElementById("role").value;

  fetch(URL+"?action=login&nik="+nik+"&password="+nik)
  .then(r=>r.json())
  .then(res=>{
    if(!res.status) return alert("Login gagal");

    user = {...res, role};

    document.getElementById("loginPage").style.display="none";
    document.getElementById("app").style.display="block";

    if(role==="admin"){
      document.getElementById("sidebarAdmin").style.display="block";
      show("adminDashboard");
      loadAdmin();
    }else{
      document.getElementById("sidebarUser").style.display="block";
      show("userDashboard");
      loadUser();
    }
  });
}

function show(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";
}

function logout(){
  location.reload();
}

/* ADMIN */
function loadAdmin(){
  fetch(URL+"?action=dashboard")
  .then(r=>r.json())
  .then(d=>{
    document.getElementById("today").innerText=d.today;
    document.getElementById("month").innerText=d.month;

    document.getElementById("warning").innerHTML =
    d.warningList.map(x=>x.nama+" "+x.total+" jam").join("<br>");
  });

  loadTable();
}

function loadTable(){
  fetch(URL+"?action=all")
  .then(r=>r.json())
  .then(data=>{
    document.getElementById("tbl").innerHTML =
    data.map(x=>`
      <tr>
        <td>${x.tanggal}</td>
        <td>${x.nik}</td>
        <td>${x.nama}</td>
        <td>${x.total}</td>
        <td><button onclick="hapus(${x.id})">Hapus</button></td>
      </tr>
    `).join("");
  });
}

/* USER */
function loadUser(){
  document.getElementById("tanggal").innerText = new Date().toLocaleDateString();
  document.getElementById("namaAkun").innerText = user.nama;
}

/* SAVE LEMBUR */
function save(){
  alert("Simpan ke GAS (belum dihubungkan)");
}

/* EXPORT */
function exportExcel(){
  window.open(URL+"?action=export");
}
