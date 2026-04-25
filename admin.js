const GAS_URL = "https://script.google.com/macros/s/AKfycby3dxo47AHIEjrrpS6tLBIJaUrLtV_J_xZRsp5M23rgzlFO9GKeRcIIcHy7o38mBSJl/exec";

function loadDashboard(){
  fetch(GAS_URL+"?action=dashboard")
  .then(r=>r.json())
  .then(d=>{
    today.innerHTML = d.today;
    month.innerHTML = d.month;
    user.innerHTML = d.chart.length;
  });
}

function logout(){
  localStorage.clear();
  window.location.href="index.html";
}
