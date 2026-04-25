const URL = "https://script.google.com/macros/s/AKfycbwdsDcuy1LcBnuyl8LKhjKvQn67NgMdPoNKHybmNgDpIegz1bnnsrFUTA9rniqXrUk8/exec";

let user={};

function login(){
  fetch(URL,{
    method:"POST",
    body:JSON.stringify({
      action:"login",
      nik:nik.value,
      password:password.value
    })
  })
  .then(r=>r.json())
  .then(res=>{
    if(!res.status) return alert("Gagal login");

    user=res;

    loginPage.style.display="none";
    app.style.display="block";

    if(res.role==="admin"){
      adminSidebar.style.display="block";
      show("adminDash");
      loadAdmin();
    }else{
      userSidebar.style.display="block";
      show("userDash");
      loadUser();
    }
  });
}

function show(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";
}

function logout(){location.reload();}

/* ADMIN */
function loadAdmin(){
  fetch(URL+"?action=dashboard")
  .then(r=>r.json())
  .then(d=>{
    today.innerText=d.today;
    month.innerText=d.month;
    warning.innerHTML=d.warningList.map(x=>`${x.nama} - ${x.total} jam`).join("<br>");
  });

  loadTable();
}

function loadTable(){
  let n = searchName.value;
  let m = searchMonth.value;

  fetch(URL+`?action=all&name=${n||""}&month=${m||""}`)
  .then(r=>r.json())
  .then(data=>{
    tbl.innerHTML=data.map(x=>`
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

function hapus(id){
  fetch(URL+"?action=delete&id="+id)
  .then(()=>loadTable());
}

/* USER */
function loadUser(){
  tanggal.innerText=new Date().toLocaleDateString();
  nama.innerText=user.nama;
}

function exportExcel(){
  window.open(URL+"?action=export");
}
