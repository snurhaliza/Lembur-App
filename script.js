const GAS_URL="https://script.google.com/macros/s/AKfycbyj3aR7074AlbGRh1r45270mbx_xkPRRDHsrIJnoaHvPNFeaeZGdnn_BBrIyJ28HvJv/exec";

async function login(){

  let password=password.value;
  let role=role.value;

  if(!password){
    msg.innerText="Password wajib!";
    return;
  }

  let res=await fetch(`${GAS_URL}?action=login&password=${password}`);
  let d=await res.json();

  if(!d.status){
    msg.innerText="Login gagal!";
    return;
  }

  if(d.role!==role){
    msg.innerText="Role salah!";
    return;
  }

  localStorage.setItem("user",JSON.stringify(d));

  location.href= role==="admin"?"admin.html":"karyawan.html";
}
