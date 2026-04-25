const GAS_URL = "https://script.google.com/macros/s/AKfycby3dxo47AHIEjrrpS6tLBIJaUrLtV_J_xZRsp5M23rgzlFO9GKeRcIIcHy7o38mBSJl/exec";

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
