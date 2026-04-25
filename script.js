const GAS_URL="https://script.google.com/macros/s/AKfycbybks5dvFwX8LbdFCfVL9Jb5UI3841AAaTOjEE6l3YkA80IWGkHqx-kVFLicfRLFfhQ/exec";

async function login(){

  const passInput = document.getElementById("password").value.trim();
  const roleInput = document.getElementById("role").value;

  if(!passInput){
    msg.innerText="Password wajib diisi!";
    return;
  }

  try{

    const res = await fetch(`${GAS_URL}?action=login&password=${passInput}`);
    const data = await res.json();

    if(!data.status){
      msg.innerText="NIK tidak ditemukan!";
      return;
    }

    if(data.role !== roleInput){
      msg.innerText="Role tidak sesuai!";
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    location.href = data.role==="admin"
      ? "admin.html"
      : "karyawan.html";

  }catch(e){
    msg.innerText="Server error!";
  }
}
