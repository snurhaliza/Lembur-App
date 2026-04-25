const GAS_URL = "https://script.google.com/macros/s/AKfycbwDHaRgVaNDr3Oe2zhMgZZ52W-R-UdlQ_poFELzMHlZhFITzJt6EAYGrueExjC2f5k/exec";

let user = JSON.parse(localStorage.getItem("user"));

nik.value = user.nik;
nama.value = user.nama;
tanggal.value = new Date().toISOString().split("T")[0];

function menu(id){
  ["dash","input","saya"].forEach(i=>{
    document.getElementById(i).style.display="none";
  });
  document.getElementById(id).style.display="block";
}

mulai.oninput = akhir.oninput = function(){
  let a = new Date("2000 "+mulai.value);
  let b = new Date("2000 "+akhir.value);
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
      keterangan:keterangan.value,
      tipe:jenis.value
    })
  });

  alert("Tersimpan");
}
