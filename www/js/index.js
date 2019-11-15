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
    function readTextFile(file, reqID) {
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status == 0) {
            var allText = rawFile.responseText;
            webserver.sendResponse(
              reqID,
              {
                status: 200,
                body: allText,
                headers: { "Content-Type": "text/html" }
              },
              success => {
                console.log(success);
              },
              error => {
                console.log(error);
              }
            );
          }
        }
      };
      rawFile.send(null);
    }

    webserver.start(8080);
    webserver.onRequest(req => {
      readTextFile("file:///android_asset/www" + req.path, req.requestId);
    });
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
