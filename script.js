const GAS = "https://script.google.com/macros/s/AKfycby28MjajmSn8bahXvXCmKU4XALQRVir-GYZUNwg223tK4pdLeJhpc8vyrfHhcSiNEM/exec"; 

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// ================= LOGIN =================
async function login(){

  let pass = document.getElementById("password").value.trim();
  let role = document.getElementById("role").value;

  if(!pass){
    msg.innerText="Isi NIK!";
    return;
  }

  try{
    let res = await fetch(GAS+"?action=login&password="+pass);
    let d = await res.json();

    if(!d.status){
      msg.innerText="User tidak ditemukan!";
      return;
    }

    localStorage.setItem("user",JSON.stringify(d));

    if(d.role==="admin"){
      location.href="admin.html";
    }else{
      location.href="karyawan.html";
    }

  }catch(e){
    msg.innerText="Server error!";
  }
}

// ================= DASHBOARD =================
async function loadDash(){

  let url = GAS+"?action=dash";
  if(user?.nik) url+="&nik="+user.nik;

  let d = await (await fetch(url)).json();

  if(document.getElementById("todayCount"))
    todayCount.innerText=d.notif||0;

  if(document.getElementById("monthTotal"))
    monthTotal.innerText=(d.total||0)+" Jam";
}

// ================= DATA =================
async function loadData(){

  let d = await (await fetch(GAS+"?action=data")).json();

  table.innerHTML = d.map(x=>`
  <tr>
    <td>${x[0]}</td>
    <td>${x[1]}</td>
    <td>${x[2]}</td>
    <td>${x[3]}</td>
    <td>${x[4]}</td>
    <td>${x[5]}</td>
    <td>${x[6]}</td>
    <td>${x[7]}</td>
    <td>${x[8]}</td>
    <td><button onclick="hapus(${x.id})">Hapus</button></td>
  </tr>`).join("");
}

// ================= HAPUS =================
async function hapus(id){
  await fetch(GAS,{
    method:"POST",
    body:JSON.stringify({action:"hapus",id})
  });
  loadData();
}

// ================= HITUNG JAM =================
function hitung(){

  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);

  let j=(b-a)/3600000;
  if(j<0) j+=24;

  total.value=j.toFixed(1);
}

// ================= SIMPAN =================
async function simpan(){

  let d = await (await fetch(GAS,{
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
  })).json();

  if(!d.status){
    alert("Gagal / sudah input hari ini");
    return;
  }

  alert("Tersimpan");
}

// ================= GRAFIK =================
async function loadGrafik(){

  let d = await (await fetch(GAS+"?action=grafik")).json();

  let ctx = document.getElementById("chart");
  if(!ctx) return;

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:d.map(x=>x.nama),
      datasets:[{
        label:"Jam Lembur",
        data:d.map(x=>x.total)
      }]
    }
  });
}

// ================= MENU =================
function menu(id){

  document.querySelectorAll(".content > div")
  .forEach(x=>x.style.display="none");

  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDash();
    loadGrafik();
  }

  if(id==="data") loadData();
}

// ================= INIT =================
function init(){

  if(user){
    if(nik) nik.value=user.nik;
    if(nama) nama.value=user.nama;
    if(welcome) welcome.innerText="Halo "+user.nama;
  }

  menu("dash");

  if(mulai && akhir){
    mulai.oninput=hitung;
    akhir.oninput=hitung;
  }

  setInterval(loadDash,15000);
}

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}
