const GAS_URL = "https://script.google.com/macros/s/AKfycbwHGWcc0XnF0ZhBxszlz-5i2tbB2r1OyjCCuZ-V9y3wrI0XJWNCSvIdzwG2LvKAbdW7/exec";

async function loadData(){
  let res = await fetch(GAS_URL+"?action=data");
  let data = await res.json();

  let s = search.value.toLowerCase();
  let filtered = data.filter(x=>x.nama.toLowerCase().includes(s));

  if(filtered.length === 0){
    table.innerHTML = `<tr><td colspan="10">❌ Nama tidak ditemukan</td></tr>`;
    return;
  }

  let html="";

  filtered.forEach(d=>{
    html+=`
    <tr>
    <td>${d.tanggal}</td>
    <td>${d.nik}</td>
    <td>${d.nama}</td>
    <td>${d.pekerjaan}</td>
    <td>${d.alasan}</td>
    <td>${d.k_alasan}</td>
    <td>${d.mulai}</td>
    <td>${d.akhir}</td>
    <td>${d.total}</td>
    <td>
      <button onclick="edit(${d.id})">Edit</button>
      <button onclick="hapus(${d.id})">Hapus</button>
    </td>
    </tr>`;
  });

  table.innerHTML = html;
}

async function loadDashboard(){
  let res = await fetch(GAS_URL+"?action=dashboard");
  let d = await res.json();

  todayCount.innerText = d.todayCount;
  monthTotal.innerText = d.monthTotal;
  warning.innerText = d.warning;
}

// AUTO REFRESH (INI YANG KAMU MINTA 🔥)
setInterval(()=>{
  loadDashboard();
  loadData();
},5000);
