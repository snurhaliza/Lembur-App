const GAS_URL="https://script.google.com/macros/s/AKfycbyj3aR7074AlbGRh1r45270mbx_xkPRRDHsrIJnoaHvPNFeaeZGdnn_BBrIyJ28HvJv/exec";

async function loadDash(){

let r=await fetch(GAS_URL+"?action=dashboard");
let d=await r.json();

todayCount.innerText=d.todayTotal||0;
monthTotal.innerText=d.monthTotal||0;
warning.innerText=d.status||"-";

}

async function loadData(){

let r=await fetch(GAS_URL+"?action=data");
let data=await r.json();

table.innerHTML="";

data.forEach(d=>{
table.innerHTML+=`
<tr>
<td>${d.tanggal}</td>
<td>${d.nik}</td>
<td>${d.nama}</td>
<td>${d.pekerjaan}</td>
<td>${d.alasan}</td>
<td>${d.mulai}</td>
<td>${d.akhir}</td>
<td>${d.total}</td>
<td><button onclick="hapus(${d.id})">Hapus</button></td>
</tr>`;
});

}

async function hapus(id){

await fetch(GAS_URL,{
method:"POST",
body:JSON.stringify({action:"delete",id})
});

loadData();
}

loadDash();
loadData();
