const GAS_URL = "https://script.google.com/macros/s/AKfycbwDHaRgVaNDr3Oe2zhMgZZ52W-R-UdlQ_poFELzMHlZhFITzJt6EAYGrueExjC2f5k/exec";

async function login(){
  let password = document.getElementById("password").value;
  let role = document.getElementById("role").value;

  let res = await fetch(`${GAS_URL}?action=login&password=${password}`);
  let data = await res.json();

  if(!data.status){
    msg.innerText = "Login gagal";
    return;
  }

  if(data.role !== role){
    msg.innerText = "Role salah!";
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));

  if(role==="admin") location.href="admin.html";
  else location.href="karyawan.html";
}
