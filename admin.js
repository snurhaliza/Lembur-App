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
