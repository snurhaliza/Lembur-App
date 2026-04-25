const GAS_URL = "https://script.google.com/macros/s/AKfycbwE3gjqJJZyX4wTZhds943XidSS7Vyf7WkwgxJ5Drm0gl9tCf4URqfK7dZQ4f7wEPsK/exec";

function loadDashboard(){
  fetch(GAS_URL+"?action=dashboard")
  .then(r=>r.json())
  .then(d=>{
    today.innerHTML = d.today;
    month.innerHTML = d.month;
    user.innerHTML = d.chart.length;
  });
}

function logout(){
  localStorage.clear();
  window.location.href="index.html";
}
function loadData(){
  fetch(GAS_URL+"?action=data")
  .then(r=>r.json())
  .then(data=>{

    let html = "";

    data.forEach(d=>{
      html += `
      <tr>
        <td>${d.tanggal}</td>
        <td>${d.nik}</td>
        <td>${d.nama}</td>
        <td>${d.total}</td>
        <td>${d.keterangan}</td>
        <td>
          <button onclick="hapus(${d.id})">Hapus</button>
        </td>
      </tr>`;
    });

    table.innerHTML = html;
  });
}
