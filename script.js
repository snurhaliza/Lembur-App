const URL = "https://script.google.com/macros/s/AKfycbyRFuc1EwiMqe_8RCS-NZVEsJs9LNJTJv3fCmsxUfUWTUvoXNTvN4cVbSI_HzncjiG7/exec";

let user = {};

function login(){

  const nik = document.getElementById("nik").value;
  const password = document.getElementById("password").value;

  fetch(URL, {
    method:"POST",
    body: JSON.stringify({
      action:"login",
      nik,
      password
    })
  })
  .then(r=>r.json())
  .then(res=>{

    if(!res.status){
      alert("Login gagal");
      return;
    }

    user = res;

    document.getElementById("loginPage").style.display="none";
    document.getElementById("app").style.display="block";

    if(res.role === "admin"){
      document.getElementById("sidebarAdmin").style.display="block";
      show("adminDashboard");
      loadAdmin();
    } else {
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
    d.warningList.map(x=>x.nama+" - "+x.total+" jam").join("<br>");
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
      </tr>
    `).join("");
  });
}

/* USER */
function loadUser(){
  document.getElementById("tanggal").innerText = new Date().toLocaleDateString();
  document.getElementById("namaAkun").innerText = user.nama;
}

function exportExcel(){
  window.open(URL+"?action=export");
}
