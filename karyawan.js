const GAS_URL = "https://script.google.com/macros/s/AKfycbwHGWcc0XnF0ZhBxszlz-5i2tbB2r1OyjCCuZ-V9y3wrI0XJWNCSvIdzwG2LvKAbdW7/exec";

let user = JSON.parse(localStorage.getItem("user"));

// VALIDASI USER LOGIN
if(!user){
  location.href = "index.html";
}

// AUTO ISI
nik.value = user.nik;
nama.value = user.nama;

// FORMAT TANGGAL INDONESIA
let todayDate = new Date();
tanggal.value = todayDate.toISOString().split("T")[0];

// ================= MENU =================
function menu(id){
  ["dash","input","saya"].forEach(i=>{
    document.getElementById(i).style.display="none";
  });
  document.getElementById(id).style.display="block";
}

// ================= HITUNG JAM =================
mulai.oninput = akhir.oninput = function(){

  if(!mulai.value || !akhir.value) return;

  let a = new Date("2000-01-01 " + mulai.value);
  let b = new Date("2000-01-01 " + akhir.value);

  let jam = (b - a) / 3600000;

  if(jam < 0) jam += 24;

  total.value = jam.toFixed(1);
};

// ================= SIMPAN =================
async function simpan(){

  if(!keterangan.value || !mulai.value || !akhir.value){
    alert("❌ Semua field wajib diisi");
    return;
  }

  await fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      tanggal: tanggal.value,
      nik: user.nik,
      nama: user.nama,
      pekerjaan: keterangan.value,
      alasan: jenis.value,
      k_alasan: jam.value,
      mulai: mulai.value,
      akhir: akhir.value,
      total: total.value
    })
  });

  alert("✅ Data lembur tersimpan");

  resetForm();
  loadNotif(); // refresh notif setelah submit
}

// ================= RESET =================
function resetForm(){
  keterangan.value = "";
  mulai.value = "";
  akhir.value = "";
  total.value = "";
}

// ================= NOTIF REALTIME =================
async function loadNotif(){

  let res = await fetch(GAS_URL + "?action=data");
  let data = await res.json();

  // FORMAT TANGGAL HARUS SAMA DENGAN GS
  let today = new Date().toLocaleDateString("id-ID");

  let ada = data.find(d =>
    d.nik == user.nik &&
    d.tanggal == today
  );

  status.innerText = ada
    ? "✅ Sudah Input Hari Ini"
    : "❌ Belum Input Hari Ini";
}

// ================= AUTO REFRESH =================
loadNotif();
setInterval(loadNotif, 5000);
