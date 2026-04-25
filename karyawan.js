const GAS_URL="https://script.google.com/macros/s/AKfycbyj3aR7074AlbGRh1r45270mbx_xkPRRDHsrIJnoaHvPNFeaeZGdnn_BBrIyJ28HvJv/exec";

let user=JSON.parse(localStorage.getItem("user"));

nik.value=user.nik;
nama.value=user.nama;

// DASHBOARD
async function loadDash(){

let r=await fetch(GAS_URL+`?action=dashboard&nik=${user.nik}`);
let d=await r.json();

todayTotal.innerText=d.todayTotal+" Jam";
monthTotal.innerText=d.monthTotal+" Jam";
status.innerText=d.status;

}

setInterval(loadDash,5000);
loadDash();

// HITUNG JAM
mulai.oninput=akhir.oninput=function(){
let a=new Date("2000 "+mulai.value);
let b=new Date("2000 "+akhir.value);
let j=(b-a)/3600000;
if(j<0) j+=24;
total.value=j.toFixed(1);
};

// SIMPAN
async function simpan(){

if(!keterangan.value||!mulai.value||!akhir.value){
alert("Isi semua!");
return;
}

await fetch(GAS_URL,{
method:"POST",
body:JSON.stringify({
action:"simpan",
nik:user.nik,
nama:user.nama,
pekerjaan:keterangan.value,
alasan:jenis.value,
k_alasan:jam.value,
mulai:mulai.value,
akhir:akhir.value,
total:total.value
})
});

alert("Tersimpan");
loadDash();
}
