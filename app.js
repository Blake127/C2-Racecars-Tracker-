const fieldIds = ["lfPsi","lfIn","rfPsi","rfIn","lrPsi","lrIn","rrPsi","rrIn"];
const fields = Object.fromEntries(fieldIds.map(id => [id, document.getElementById(id)]));
const frontOutput = document.getElementById("frontStagger");
const rearOutput = document.getElementById("rearStagger");
const status = document.getElementById("status");
const storageKey = "c2-race-cars-tire-tracker-v3";

function numberValue(id){
  const value = Number.parseFloat(fields[id].value);
  return Number.isFinite(value) ? value : 0;
}
function calculate(){
  frontOutput.value = (numberValue("rfIn") - numberValue("lfIn")).toFixed(3);
  rearOutput.value = (numberValue("rrIn") - numberValue("lrIn")).toFixed(3);
}
function flash(message){
  status.textContent = message;
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => status.textContent = "", 1800);
}
function saveSetup(){
  const setup = {};
  fieldIds.forEach(id => setup[id] = fields[id].value);
  localStorage.setItem(storageKey, JSON.stringify(setup));
  calculate();
  flash("Setup saved on this device.");
}
function resetSetup(){
  fieldIds.forEach(id => fields[id].value = "");
  localStorage.removeItem(storageKey);
  calculate();
  flash("Setup cleared.");
}
function loadSetup(){
  try{
    const setup = JSON.parse(localStorage.getItem(storageKey) || "{}");
    fieldIds.forEach(id => {
      if(setup[id] !== undefined) fields[id].value = setup[id];
    });
  }catch(error){}
  calculate();
}
fieldIds.forEach(id => fields[id].addEventListener("input", calculate));
document.getElementById("saveBtn").addEventListener("click", saveSetup);
document.getElementById("resetBtn").addEventListener("click", resetSetup);
loadSetup();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}
