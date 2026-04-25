const GAS_URL = "https://script.google.com/macros/s/AKfycbz977NPlRuMLfpD4PMFsEBPOTO_sS_t7iCdcdZMNZVBhNqLkVtMc10dsV-Y1gqm8l33/exec";

async function login(){

  let pass = document.getElementById("password").value.trim();
  let role = document.getElementById("role").value;

  if(!pass){
    msg.innerText = "Password wajib!";
    return;
  }

  let res = await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let d = await res.json();

  if(!d.status){
    msg.innerText = "Login gagal!";
    return;
  }

  if(d.role !== role){
    msg.innerText = "Role tidak sesuai!";
    return;
  }

  localStorage.setItem("user", JSON.stringify(d));

  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}
