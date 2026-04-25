const GAS_URL = "https://script.google.com/macros/s/AKfycbwtWmjiLibJ320aegedisIa-ouw5H-buLZ8yU085MLNHfgUheNGDr-f8hE-sRqkFZWu/exec";

function login(){
  fetch(`${GAS_URL}?action=login&nik=${nik.value}&password=${password.value}`)
  .then(r=>r.json())
  .then(res=>{
    if(!res.status){
      alert("Login gagal");
      return;
    }

    localStorage.setItem("user", JSON.stringify(res));

    // REDIRECT ROLE
    if(res.role === "admin"){
      window.location.href = "admin.html";
    } else {
      window.location.href = "karyawan.html";
    }
  });
}
