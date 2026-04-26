const GAS_URL = "https://script.google.com/macros/s/AKfycbxvZAr2a-MfbzQsBQO2RQZbnvfEpPqvJLr_2qlHD9CvD0r-faoYU-e32U9lWbPFXOzk/exec";

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// ================= LOGIN =================
async function login(){

  let pass = password.value.trim();
  let role = document.getElementById("role").value;

  if(!pass){
    msg.innerText="NIK wajib diisi!";
    return;
  }

  let r = await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d = await r.json();

  if(!d.status){
    msg.innerText="User tidak ditemukan!";
    return;
  }

  if(d.role!==role){
    msg.innerText="Role salah!";
    return;
  }

  localStorage.setItem("user",JSON.stringify(d));
  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}

// ================= MENU =================
function menu(id){

  document.querySelectorAll(".content > div").forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";

  if(id==="dash"){
    loadDashboard();
    loadGrafik();
  }

  if(id==="data") loadData();
}

// ================= DASHBOARD =================
async function loadDashboard(){

  let url = GAS_URL+"?action=dashboard";

  if(user && user.nik){
    url += "&nik="+encodeURIComponent(user.nik);
  }

  let r = await fetch(url+"&t="+Date.now());
  let d = await r.json();

  if(todayCount) todayCount.innerText = d.todayTotal||0;
  if(monthTotal) monthTotal.innerText = (d.monthTotal||0)+" Jam";
}

// ================= GRAFIK =================
async function loadGrafik(){

  let r = await fetch(GAS_URL+"?action=grafik&t="+Date.now());
  let d = await r.json();

  let ctx = document.getElementById("chart");
  if(!ctx) return;

  if(chart) chart.destroy();

  if(!d || d.length===0){
    chart = new Chart(ctx,{
      type:"bar",
      data:{
        labels:["Belum ada data"],
        datasets:[{data:[0]}]
      }
    });
    return;
  }

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

// ================= HITUNG JAM =================
function hitungJam(){

  if(!mulai.value || !akhir.value){
    total.value="";
    return;
  }

  let a=new Date("2000 "+mulai.value);
  let b=new Date("2000 "+akhir.value);

  let j=(b-a)/3600000;
  if(j<0) j+=24;

  total.value=j.toFixed(1);
}

// ================= SIMPAN =================
async function simpan(){

  if(!keterangan.value.trim()) return alert("Pekerjaan wajib diisi!");
  if(!jenis.value) return alert("Jenis wajib!");
  if(!jam.value) return alert("Keterangan wajib!");
  if(!mulai.value) return alert("Mulai wajib!");
  if(!akhir.value) return alert("Akhir wajib!");
  if(!total.value || total.value==0) return alert("Total tidak valid!");

  let r = await fetch(GAS_URL,{
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
    alert(d.msg);
    return;
  }

  alert("Tersimpan");
  resetForm();
  loadDashboard();
}

// ================= RESET =================
function resetForm(){
  keterangan.value="";
  jenis.value="";
  jam.value="";
  mulai.value="";
  akhir.value="";
  total.value="";
}

// ================= DATA =================
async function loadData(){

  let r = await fetch(GAS_URL+"?action=data");
  let data = await r.json();

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
  </tr>`).join("");
}

// ================= DELETE =================
async function hapus(id){

  if(!confirm("Yakin hapus?")) return;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });

  loadData();
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
    mulai.oninput=hitungJam;
    akhir.oninput=hitungJam;
  }

  setInterval(()=>{
    loadDashboard();
    loadGrafik();
  },10000);
}

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}
