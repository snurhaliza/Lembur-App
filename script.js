const GAS_URL="https://script.google.com/macros/s/AKfycbzHlet2nSy-tHbJkzoQrlJ-a8c5XPXru-NUqXj0gNbYuvbWyPTwCvAtUBs6vwRFawGT/exec";

let user=JSON.parse(localStorage.getItem("user"));

// LOGIN
async function login(){
  let pass=password.value.trim();
  let role=document.getElementById("role").value;

  let r=await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d=await r.json();

  if(!d.status){ msg.innerText="User tidak ditemukan"; return; }
  if(d.role!==role){ msg.innerText="Role salah"; return; }

  localStorage.setItem("user",JSON.stringify(d));
  location.href=role==="admin"?"admin.html":"karyawan.html";
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash") loadDashboard();
  if(id==="data") loadData();
  if(id==="grafik") loadGrafik();
}

// DASHBOARD
async function loadDashboard(){

  let url=GAS_URL+"?action=dashboard";
  if(user?.role==="karyawan") url+="&nik="+user.nik;

  let r=await fetch(url+"&t="+Date.now());
  let d=await r.json();

  if(todayCount) todayCount.innerText=d.notif||0;
  if(monthTotal) monthTotal.innerText=(d.monthTotal||0)+" Jam";
}

// HITUNG JAM
function hitungJam(){
  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);
  let j=(b-a)/3600000;
  if(j<0) j+=24;
  total.value=j.toFixed(1);
}

// SIMPAN
async function simpan(){

  let r=await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:keterangan.value,
      lembur:jenis.value,
      k_alasan:jam.value,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value
    })
  });

  let d=await r.json();

  if(!d.status){ alert(d.msg); return; }

  alert("Tersimpan");
  resetForm();
  loadDashboard();
}

// RESET
function resetForm(){
  keterangan.value="";
  jenis.value="";
  jam.value="";
  mulai.value="";
  akhir.value="";
  total.value="";
}

// DATA
async function loadData(){

  let r=await fetch(GAS_URL+"?action=data");
  let d=await r.json();

  table.innerHTML=d.map(x=>`
  <tr>
  <td>${x.tanggal}</td>
  <td>${x.nik}</td>
  <td>${x.nama}</td>
  <td>${x.pekerjaan}</td>
  <td>${x.lembur}</td>
  <td>${x.k_alasan}</td>
  <td>${x.mulai}</td>
  <td>${x.akhir}</td>
  <td>${x.total}</td>
  <td><button onclick="hapus(${x.id})">Hapus</button></td>
  </tr>`).join("");
}

// DELETE
async function hapus(id){
  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });
  loadData();
}

// GRAFIK
let chart;
async function loadGrafik(){

  let r=await fetch(GAS_URL+"?action=grafik");
  let d=await r.json();

  let ctx=document.getElementById("chart");

  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:"bar",
    data:{
      labels:d.map(x=>x.nama),
      datasets:[{data:d.map(x=>x.total)}]
    }
  });
}

// INIT
function init(){

  if(user){
    if(nik) nik.value=user.nik;
    if(nama) nama.value=user.nama;
    if(welcome) welcome.innerText="Halo "+user.nama;
  }

  menu("dash");

  if(mulai){
    mulai.oninput=hitungJam;
    akhir.oninput=hitungJam;
  }

  setInterval(loadDashboard,5000);
}

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
