const GAS_URL = "https://script.google.com/macros/s/AKfycbwtWmjiLibJ320aegedisIa-ouw5H-buLZ8yU085MLNHfgUheNGDr-f8hE-sRqkFZWu/exec";

async function login(){

  let nikVal = document.getElementById("nik").value;
  let passVal = document.getElementById("password").value;
  let roleVal = document.getElementById("role").value;

  let res = await fetch(`${GAS_URL}?action=login&nik=${nikVal}&password=${passVal}`);
  let data = await res.json();

  if(!data.status){
    document.getElementById("msg").innerText = "Login gagal";
    return;
  }

  // VALIDASI ROLE
  if(data.role !== roleVal){
    document.getElementById("msg").innerText = "Role tidak sesuai!";
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));

  if(data.role === "admin"){
    window.location.href = "admin.html";
  }else{
    window.location.href = "karyawan.html";
  }
}
