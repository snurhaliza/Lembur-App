const GAS_URL = "https://script.google.com/macros/s/AKfycbxh4yXDGDs_PcnQbZ4IEhtsYIRSXMvluDLiLXvjtCV_U8GjkMHxs2lSS_eivvnToj9M/exec";

async function login(){

  let password = document.getElementById("password").value;
  let role = document.getElementById("role").value;

  if(!password){
    msg.innerText = "Password wajib diisi!";
    return;
  }

  let res = await fetch(`${GAS_URL}?action=login&password=${password}`);
  let data = await res.json();

  if(!data.status){
    msg.innerText = "Login gagal!";
    return;
  }

  if(data.role !== role){
    msg.innerText = "Role tidak sesuai!";
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));

  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}
