// Application Constructor
var app = {
  initialize: function() {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  onDeviceReady: async function() {
    window.screen.orientation.lock("portrait");
    CameraPreview.startCamera(null, () =>
      CameraPreview.stopCamera(() => CameraPreview.hide(app.startCamera()))
    );
  },

  startCamera() {
    const constraints = {
      video: true
    };
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment"
        }
      })
      .then(stream => {
        const player = document.querySelector("#player");
        const canvas = document.querySelector("#canvas");

        player.srcObject = stream;
        canvas.width = screen.width;
        canvas.height = screen.height;
      });
  }
};
app.initialize();
