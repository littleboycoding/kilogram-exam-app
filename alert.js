console.log("Alert.js loaded");
const alert_popup = document.getElementsByClassName("alert")[0];
function alertMSG(message) {
  alert_popup.innerHTML = message;
  alert_popup.classList.remove("alert_fade");
  setTimeout(() => alert_popup.classList.add("alert_fade"), 1);
}
