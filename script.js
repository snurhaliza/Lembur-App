const GAS_URL="https://script.google.com/macros/s/AKfycbyJnanMe4OREBwdUjFyQ0Tiiv7emMkwJZNGYJB2IqFRbLfrM6tMrWNhyGDdAexbXgau/exec";

async function login(){

  let pass = document.getElementById("password").value;
  let role = document.getElementById("role").value;

  if(!pass){
    msg.innerText="Password wajib diisi!";
    return;
  }

  let res = await fetch(`${GAS_URL}?action=login&password=${pass}`);
  let data = await res.json();

  if(!data.status){
    msg.innerText="Login gagal!";
    return;
  }

  if(data.role !== role){
    msg.innerText="Role tidak sesuai!";
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));

  location.href = role==="admin" ? "admin.html" : "karyawan.html";
}
