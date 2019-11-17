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
      console.log(req.path);
      readTextFile("file:///android_asset/www" + req.path, req.requestId);
    });
    window.open = cordova.InAppBrowser.open;
    var drive = window.open(
      "http://localhost:8080/home.html",
      "_system",
      "location=yes"
    );
    window.screen.orientation.lock("portrait");
    /*
    CameraPreview.startCamera(null, () =>
      CameraPreview.stopCamera(() => CameraPreview.hide(app.startCamera()))
    );
    */
  }
};
app.initialize();
