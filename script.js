const GAS_URL = "https://script.google.com/macros/s/AKfycby5dMuoKkX3krT-c4mu2Z8UE_1Kqd32mPvYdcc5NSWDVTs6r3ipGRAhcQ0sLVYmyqri/exec";

let user = JSON.parse(localStorage.getItem("user"));

// ================= LOGIN =================
async function login(){

  let pass = document.getElementById("password").value.trim();
  let role = document.getElementById("role").value;

  if(!pass){
    msg.innerText="Isi NIK!";
    return;
  }

  let r = await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d = await r.json();

  if(!d.status){
    msg.innerText="User tidak ditemukan!";
    return;
  }

  if(d.role !== role){
    msg.innerText="Role salah!";
    return;
  }

  localStorage.setItem("user", JSON.stringify(d));

  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}

// ================= MENU =================
function menu(id){

  document.querySelectorAll(".content > div").forEach(x=>{
    x.style.display="none";
  });

  let el = document.getElementById(id);
  if(el) el.style.display="block";

  if(id==="dash"){
    loadDashboard();
    loadGrafik(); // grafik di dashboard
  }

  if(id==="data") loadData();
}

// ================= DASHBOARD =================
async function loadDashboard(){

  let url = GAS_URL+"?action=dashboard";

  if(user?.nik) url += "&nik="+user.nik;

  let r = await fetch(url);
  let d = await r.json();

  // ===== ADMIN =====
  if(document.getElementById("todayCount")){
    document.getElementById("todayCount").innerText = d.todayCount || 0;
  }

  // ===== KARYAWAN =====
  if(document.getElementById("todayTotal")){
    document.getElementById("todayTotal").innerText = (d.todayTotal || 0) + " Jam";
  }

  if(document.getElementById("monthTotal")){
    document.getElementById("monthTotal").innerText = (d.monthTotal || 0) + " Jam";
  }
}

// ================= HITUNG JAM =================
function hitungJam(){

  let mulai = document.getElementById("mulai").value;
  let akhir = document.getElementById("akhir").value;

  if(!mulai || !akhir) return;

  let a = new Date("2000-01-01T"+mulai);
  let b = new Date("2000-01-01T"+akhir);

  let j = (b-a)/3600000;
  if(j<0) j+=24;

  document.getElementById("total").value = j.toFixed(1);
}

// ================= SIMPAN =================
async function simpan(){

  let pekerjaan = document.getElementById("keterangan").value;
  let jenis = document.getElementById("jenis").value;
  let jam = document.getElementById("jam").value;
  let mulai = document.getElementById("mulai").value;
  let akhir = document.getElementById("akhir").value;
  let total = document.getElementById("total").value;

  if(!pekerjaan || !jenis || !jam || !mulai || !akhir){
    alert("Isi semua!");
    return;
  }

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:pekerjaan,
      jenis:jenis,
      jam:jam,
      mulai:mulai,
      akhir:akhir,
      total:total
    })
  });

  alert("Tersimpan");
  resetForm();
  loadDashboard();
}

// ================= RESET =================
function resetForm(){

  document.getElementById("keterangan").value="";
  document.getElementById("jenis").value="";
  document.getElementById("jam").value="";
  document.getElementById("mulai").value="";
  document.getElementById("akhir").value="";
  document.getElementById("total").value="";
}

// ================= DATA =================
async function loadData(){

  let r = await fetch(GAS_URL+"?action=data");
  let data = await r.json();

  let keyword = document.getElementById("search").value.toLowerCase();

  let filtered = data.filter(x =>
    x.nama.toLowerCase().includes(keyword)
  );

  let html = filtered.map(d=>`
  <tr>
    <td>${d.tanggal}</td>
    <td>${d.nik}</td>
    <td>${d.nama}</td>
    <td contenteditable="true">${d.pekerjaan}</td>
    <td contenteditable="true">${d.lembur}</td>
    <td contenteditable="true">${d.k_alasan}</td>
    <td contenteditable="true">${d.mulai}</td>
    <td contenteditable="true">${d.akhir}</td>
    <td contenteditable="true">${d.total}</td>
    <td>
      <button onclick="edit(this,${d.id})">Edit</button>
      <button onclick="hapus(${d.id})">Hapus</button>
    </td>
  </tr>
  `).join("");

  document.getElementById("table").innerHTML = html;
}

// ================= EDIT =================
async function edit(btn,id){

  let tr = btn.closest("tr");
  let td = tr.querySelectorAll("td");

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"edit",
      id:id,
      pekerjaan:td[3].innerText,
      lembur:td[4].innerText,
      k_alasan:td[5].innerText,
      mulai:td[6].innerText,
      akhir:td[7].innerText,
      total:td[8].innerText
    })
  });

  alert("Update berhasil");
}

// ================= DELETE =================
async function hapus(id){

  if(!confirm("Hapus data?")) return;

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({action:"delete",id})
  });

  loadData();
}

// ================= GRAFIK =================
let chart;

async function loadGrafik(){

  let r = await fetch(GAS_URL+"?action=grafik");
  let d = await r.json();

  let canvas = document.getElementById("chart");
  if(!canvas) return;

  let ctx = canvas.getContext("2d");

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

// ================= LOGOUT =================
function logout(){
  localStorage.clear();
  location.href="index.html";
}

// ================= INIT =================
function init(){

  if(user){

    if(document.getElementById("nik"))
      document.getElementById("nik").value=user.nik;

    if(document.getElementById("nama"))
      document.getElementById("nama").value=user.nama;

    if(document.getElementById("welcome"))
      document.getElementById("welcome").innerText="Halo "+user.nama;
  }

  menu("dash");

  if(document.getElementById("mulai") && document.getElementById("akhir")){
    document.getElementById("mulai").oninput = hitungJam;
    document.getElementById("akhir").oninput = hitungJam;
  }

  setInterval(loadDashboard,5000);
}
