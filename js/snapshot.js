const player = document.querySelector("#player");
const canvas = document.querySelector("#canvas");
const dialog = document.getElementsByClassName("signin_dialog")[0];
var check;
var close_timeout;
var track;

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

async function snapshot() {
  if (canvas.style.display === "none") {
    let context = canvas.getContext("2d");

    context.drawImage(player, 0, 0);
    if ((await transform()) && (await tracking_start())) {
      canvas.style.display = "block";
      player.style.display = "none";
    } else {
      document.getElementById("back").style.display = "block";
      document.getElementById("flashlight").style.display = "block";
      return;
    }
  } else {
    if (document.getElementById("saveCtrl").style.display == "none")
      close_snapshot();
  }
}

function close_snapshot() {
  setTimeout(() => {
    clearTimeout(close_timeout);

    canvas.style.display = "none";
    player.style.display = "block";

    document.getElementById("back").style.display = "block";
    document.getElementById("flashlight").style.display = "block";

    document.getElementById("saveCtrl").style.display = "none";
    alertClose();
  }, 100);
}

function cameraInit() {
  startCamera();
  check = setInterval(() => {
    if (cv.Mat != undefined) {
      clearInterval(check);
      document.getElementById("player").style.display = "block";
    }
  }, 0.5);
}

function startCamera() {
  const constraints = {
    video: {
      facingMode: { ideal: "environment" },
      width: screen.width > screen.height ? screen.width : screen.height,
      height: screen.height < screen.width ? screen.height : screen.width
    }
  };

  alert(screen.width, screen.height);
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    player.srcObject = stream;
    window.onresize();

    track = stream.getVideoTracks()[0];

    imageCapture = new ImageCapture(track);
    photoCap = imageCapture.getPhotoCapabilities();
  });
}
