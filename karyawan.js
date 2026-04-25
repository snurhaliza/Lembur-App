const GAS_URL = "https://script.google.com/macros/s/AKfycby3dxo47AHIEjrrpS6tLBIJaUrLtV_J_xZRsp5M23rgzlFO9GKeRcIIcHy7o38mBSJl/exec";

let user = JSON.parse(localStorage.getItem("user"));

// AUTO FILL
document.getElementById("nik").value = user.nik;
document.getElementById("nama").value = user.nama;
document.getElementById("tanggal").value = new Date().toISOString().split("T")[0];

// NAV
function show(id){
  dashboard.style.display="none";
  input.style.display="none";
  grafik.style.display="none";

  document.getElementById(id).style.display="block";
}

// HITUNG JAM
mulai.oninput = akhir.oninput = function(){
  let a = new Date("2000-01-01 "+mulai.value);
  let b = new Date("2000-01-01 "+akhir.value);

  let jam = (b-a)/3600000;
  if(jam<0) jam+=24;

  total.value = jam.toFixed(1);
}

// SIMPAN
function simpan(){
  fetch(GAS_URL,{
    method:"POST",
    body:JSON.stringify({
      action:"simpan",
      tanggal:tanggal.value,
      nik:user.nik,
      nama:user.nama,
      mulai:mulai.value,
      akhir:akhir.value,
      total:total.value,
      keterangan:keterangan.value
    })
  })
  .then(r=>r.json())
  .then(()=>alert("Tersimpan"));
}

// LOGOUT
function logout(){
  localStorage.clear();
  window.location.href="index.html";
}
