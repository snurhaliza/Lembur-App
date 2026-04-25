const GAS_URL = "https://script.google.com/macros/s/AKfycbzZNWLPacwWkh3bLn3MDjsAFuasWJM450PY-H9ariYe3sgVYKWjguqQen0feDlaUfoP/exec";

let user = JSON.parse(localStorage.getItem("user"));

document.getElementById("nik").value = user.nik;
document.getElementById("nama").value = user.nama;
document.getElementById("tanggal").value = new Date().toISOString().split("T")[0];

function menu(id){
  ["dash","input","saya"].forEach(i=>{
    document.getElementById(i).style.display="none";
  });
  document.getElementById(id).style.display="block";

  if(id==="saya"){
    document.getElementById("infoUser").innerText =
    `Nama: ${user.nama}\nNIK: ${user.nik}`;
  }
}

mulai.oninput = akhir.oninput = function(){
  let a = new Date("2000-01-01 "+mulai.value);
  let b = new Date("2000-01-01 "+akhir.value);

  let jam = (b-a)/3600000;
  if(jam<0) jam+=24;

  total.value = jam.toFixed(1);
};

async function simpan(){
  await fetch(GAS_URL,{
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
  });

  alert("Tersimpan");
}

function logout(){
  localStorage.clear();
  window.location.href="index.html";
}
