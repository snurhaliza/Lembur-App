const GAS_URL = "https://script.google.com/macros/s/AKfycbyCOqpOi4EHW65SD7jlmTBBWw_r6Rfs1_PlOFQ4-t0Blq_9vGeuWUEfu8spQD6U10m5/exec";

let user = JSON.parse(localStorage.getItem("user"));
let chart;

// ================= TANGGAL =================
function tampilkanTanggal(){
  let el = document.getElementById("todayDate");
  if(!el) return;

  let now = new Date();
  let hari = now.toLocaleDateString("id-ID", { weekday: "long" });
  let tanggal = now.toLocaleDateString("id-ID");

  el.innerText = hari + ", " + tanggal;
}


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

  if(user){
    url += "&nik="+user.nik;
    url += "&role="+user.role;
  }

  let r = await fetch(url+"&t="+Date.now());
  let d = await r.json();

  if(todayCount) todayCount.innerText = d.todayTotal||0;
  if(monthTotal) monthTotal.innerText = (d.monthTotal||0)+" Jam";
}

// ================= GRAFIK =================
async function loadGrafik(){

  let bulan = document.getElementById("filterBulan")?.value;

  let url = GAS_URL+"?action=grafik";

  if(bulan){
    url += "&bulan="+bulan;
  }

  let r = await fetch(url+"&t="+Date.now());
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
  if(!jenis.value) return alert("Jenis lembur wajib dipilih!");
  if(!jam.value) return alert("Keterangan alasan wajib dipilih!");
  if(!mulai.value) return alert("Jam mulai wajib diisi!");
  if(!akhir.value) return alert("Jam akhir wajib diisi!");
  if(!total.value || total.value==0) return alert("Total jam tidak valid!");

  let a = new Date("2000 "+mulai.value);
  let b = new Date("2000 "+akhir.value);

  if(a.getTime() === b.getTime()){
    return alert("Jam mulai dan akhir tidak boleh sama!");
  }

  let r = await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      nik:user.nik,
      nama:user.nama,
      pekerjaan:keterangan.value.trim(),
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

  alert("Tersimpan ✅");
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

// ================= DATA (FILTER BULAN) =================
async function loadData(){

  let r = await fetch(GAS_URL+"?action=data");
  let data = await r.json();

  let bulan = document.getElementById("filterBulanData")?.value;

  let filtered = data.filter(d => {
    if(!bulan) return true;

    let parts = d.tanggal.split("/"); // dd/MM/yyyy
    let format = parts[2] + "-" + parts[1]; // yyyy-MM

    return format === bulan;
  });

 // ================= TOTAL BULAN =================
let totalBulan = filtered.reduce((sum,d)=> sum + Number(d.total||0),0);

// isi ANGKA saja ke span
let elTotal = document.getElementById("totalBulan");
if(elTotal) elTotal.innerText = totalBulan;

// ================= GANTI NAMA BULAN =================
const namaBulan = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

let bulan = document.getElementById("filterBulanData")?.value;

let indexBulan;

if(bulan){
  indexBulan = parseInt(bulan.split("-")[1]) - 1;
}else{
  indexBulan = new Date().getMonth();
}

// 👉 UBAH TEXT SAJA, JANGAN SENTUH SPAN
let label = document.getElementById("labelTotalBulan");

if(label){
  label.childNodes[0].nodeValue = `Total Lembur Bulan ${namaBulan[indexBulan]}: `;
}
  // ================= TABLE =================
  table.innerHTML = filtered.map(d=>`
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

  if(!confirm("Yakin hapus data?")) return;

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
  tampilkanTanggal();

  if(mulai && akhir){
    mulai.oninput=hitungJam;
    akhir.oninput=hitungJam;
  }

  let filter = document.getElementById("filterBulan");
  if(filter){
    filter.onchange = loadGrafik;
  }

  // ✅ FILTER DATA BULAN
  let filterData = document.getElementById("filterBulanData");
  if(filterData){
    filterData.onchange = loadData;
  }

  setInterval(()=>{
    loadDashboard();
    loadGrafik();
  },10000);
}

// ================= LOGOUT =================
function logout(){

  let yakin = confirm("Yakin mau logout?");

  if(!yakin) return;

  localStorage.clear();
  location.href="index.html";
}
