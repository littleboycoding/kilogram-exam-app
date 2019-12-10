const alert_popup = document.getElementsByClassName("alert")[0];
function alertMSG(message, force) {
  if (!force) {
    alert_popup.classList.remove("alert_force");
    alert_popup.classList.remove("alert_fade");
    setTimeout(() => alert_popup.classList.add("alert_fade"), 100);
  } else {
    alert_popup.classList.remove("alert_force");
    alert_popup.classList.remove("alert_fade");
    setTimeout(() => alert_popup.classList.add("alert_force"), 100);
  }
  alert_popup.innerHTML = message;
}
function alertClose() {
  alert_popup.classList.remove("alert_force");
  alert_popup.classList.remove("alert_fade");
}
