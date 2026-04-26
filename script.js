const GAS = "https://script.google.com/macros/s/AKfycbxJghFH4e9L0ld9KJjRXJIOjNLkkuP04htRK2Bnq07b6uQyYJxig3XooKyc_lmjNbId/exec"; // 🔥 GANTI

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// LOGIN
async function login(){

  let pass = password.value.trim();

  let r = await fetch(GAS+"?action=login&password="+pass);
  let d = await r.json();

  if(!d.status){
    msg.innerText="Login gagal!";
    return;
  }

  localStorage.setItem("user",JSON.stringify(d));

  if(d.role==="admin") location.href="admin.html";
  else location.href="karyawan.html";
}

// INIT
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
}

// MENU
function menu(id){
  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDash();
    loadGrafik();
  }

  if(id==="data") loadData();
}

// DASH
async function loadDash(){

  let url = GAS+"?action=dash";
  if(user?.nik) url+="&nik="+user.nik;

  let d = await (await fetch(url)).json();

  if(todayCount) todayCount.innerText=d.notif||0;
  if(monthTotal) monthTotal.innerText=(d.total||0)+" Jam";
}

// HITUNG JAM
function hitung(){
  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);
  let j=(b-a)/3600000;
  if(j<0) j+=24;
  total.value=j.toFixed(1);
}

// SIMPAN
async function simpan(){

  let r = await fetch(GAS,{
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

  let d = await r.json();

  if(!d.status){
    alert("Sudah input hari ini!");
    return;
  }

  alert("Tersimpan");
}

// DATA
async function loadData(){

  let data = await (await fetch(GAS+"?action=data")).json();

  table.innerHTML = data.map(d=>`
  <tr>
    <td>${d.tanggal}</td>
    <td>${d.nik}</td>
    <td>${d.nama}</td>
    <td>${d.pekerjaan}</td>
    <td>${d.lembur}</td>
    <td>${d.k_alasan}</td>
    <td>${d.mulai}</td>
    <td>${d.akhir}</td>
    <td>${d.total}</td>
    <td><button onclick="hapus(${d.id})">Hapus</button></td>
  </tr>
  `).join("");
}

// HAPUS
async function hapus(id){
  await fetch(GAS,{
    method:"POST",
    body:JSON.stringify({action:"hapus",id})
  });
  loadData();
}

// GRAFIK
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
        label:"Jam",
        data:d.map(x=>x.total)
      }]
    }
  });
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

// LOGOUT
function logout(){
  localStorage.clear();
  location.href="index.html";
}
