const GAS_URL="https://script.google.com/macros/s/AKfycbwSLo5yKCOIthk6blzLgX7RUbzLQIk7TQCiq-mghrcscd1c-dH14cEHOeZbodHjwUlu/exec";

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

const SHEET = SpreadsheetApp
  .openById("1Wy5Mao9n2h7v1G_LPHxePqW5eIxMmd3bTO40GuLexnQ")
  .getSheetByName("DATA_LEMBUR");

// OUTPUT
function output(data){
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET
function doGet(e){

  if(!e || !e.parameter) return output({status:false});

  const a = e.parameter.action;

  if(a==="login") return login(e);
  if(a==="dashboard") return dashboard(e);
  if(a==="data") return getData();
  if(a==="grafik") return grafik();

  return output({status:false});
}

// POST
function doPost(e){
  const d = JSON.parse(e.postData.contents);

  if(d.action==="simpan") return simpan(d);
  if(d.action==="delete") return hapus(d.id);

  return output({status:false});
}

// LOGIN
function login(e){

  const nik = e.parameter.password;

  const s = SpreadsheetApp.getActive().getSheetByName("DATA_KARYAWAN");
  const data = s.getDataRange().getValues();

  for(let i=1;i<data.length;i++){
    if(data[i][0]==nik){
      return output({
        status:true,
        nik:data[i][0],
        nama:data[i][1],
        role:data[i][3]
      });
    }
  }

  return output({status:false});
}

// SIMPAN + VALIDASI
function simpan(d){

  let data = SHEET.getDataRange().getValues();
  data.shift();

  let today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(),"yyyy-MM-dd");

  for(let r of data){
    let tgl = Utilities.formatDate(new Date(r[0]), Session.getScriptTimeZone(),"yyyy-MM-dd");

    if(r[1]==d.nik && tgl==today){
      return output({status:false,msg:"Sudah input hari ini!"});
    }
  }

  SHEET.appendRow([
    new Date(),
    d.nik,
    d.nama,
    d.pekerjaan,
    d.lembur,
    d.k_alasan,
    d.mulai,
    d.akhir,
    Number(d.total)
  ]);

  return output({status:true});
}

// DATA
function getData(){

  let data = SHEET.getDataRange().getValues();
  data.shift();

  return output(data.map((r,i)=>({
    id:i+2,
    tanggal: Utilities.formatDate(new Date(r[0]), Session.getScriptTimeZone(),"dd/MM/yyyy"),
    nik:r[1],
    nama:r[2],
    pekerjaan:r[3],
    lembur:r[4],
    k_alasan:r[5],
    mulai: Utilities.formatDate(new Date(r[6]), Session.getScriptTimeZone(),"HH:mm"),
    akhir: Utilities.formatDate(new Date(r[7]), Session.getScriptTimeZone(),"HH:mm"),
    total:r[8]
  })));
}

// DASHBOARD
function dashboard(e){

  let nik = e.parameter.nik;

  let data = SHEET.getDataRange().getValues();
  data.shift();

  let today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(),"yyyy-MM-dd");
  let bulan = Utilities.formatDate(new Date(), Session.getScriptTimeZone(),"yyyy-MM");

  let notif = new Set();
  let total = 0;

  data.forEach(r=>{

    let tgl = Utilities.formatDate(new Date(r[0]), Session.getScriptTimeZone(),"yyyy-MM-dd");
    let bln = Utilities.formatDate(new Date(r[0]), Session.getScriptTimeZone(),"yyyy-MM");

    if(tgl==today) notif.add(r[1]);

    if(nik){
      if(r[1]==nik && bln==bulan){
        total += Number(r[8]||0);
      }
    }else{
      if(bln==bulan){
        total += Number(r[8]||0);
      }
    }

  });

  return output({
    notif: notif.size,
    monthTotal: total
  });
}

// DELETE
function hapus(id){
  SHEET.deleteRow(id);
  return output({status:true});
}

// GRAFIK
function grafik(){

  let data = SHEET.getDataRange().getValues();
  data.shift();

  let map={};

  data.forEach(r=>{
    let n=r[2];
    let t=Number(r[8]||0);
    map[n]=(map[n]||0)+t;
  });

  let arr=Object.keys(map).map(n=>({nama:n,total:map[n]}));
  arr.sort((a,b)=>b.total-a.total);

  return output(arr.slice(0,3));
} grafik top 3 masi belum muncul, buat filtter per bulan untuk grafik dan juga lembur bulan ini pada karyawan beljum terupdate, yang lain sudah ok pebaiki tanpa ada eror
