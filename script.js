const GAS_URL = "https://script.google.com/macros/s/AKfycbwkboJRUaTRfr2X_8HAPbd9xRanQMnkSBF-6frBWq1iVcw0v7aQ87LsEWcxoG5ZfrFZ/exec";

async function login(){

  let password = document.getElementById("password").value.trim();
  let role = document.getElementById("role").value;
  let msg = document.getElementById("msg");

  msg.innerText = "";

  // VALIDASI INPUT
  if(!password){
    msg.innerText = "❌ Password wajib diisi!";
    return;
  }

  try{

    let res = await fetch(`${GAS_URL}?action=login&password=${password}`);
    let data = await res.json();

    // VALIDASI LOGIN
    if(!data || !data.status){
      msg.innerText = "❌ NIK / Password tidak ditemukan";
      return;
    }

    // VALIDASI ROLE
    if(data.role !== role){
      msg.innerText = "❌ Role tidak sesuai";
      return;
    }

    // SIMPAN USER
    localStorage.setItem("user", JSON.stringify(data));

    // REDIRECT
    if(role === "admin"){
      location.href = "admin.html";
    }else{
      location.href = "karyawan.html";
    }

  }catch(err){
    msg.innerText = "❌ Server error, coba lagi";
  }
}
