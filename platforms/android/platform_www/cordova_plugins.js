cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-camera-preview.CameraPreview",
      "file": "plugins/cordova-plugin-camera-preview/www/CameraPreview.js",
      "pluginId": "cordova-plugin-camera-preview",
      "clobbers": [
        "CameraPreview"
      ]
    },
    {
      "id": "es6-promise-plugin.Promise",
      "file": "plugins/es6-promise-plugin/www/promise.js",
      "pluginId": "es6-promise-plugin",
      "runs": true
    },
    {
      "id": "cordova-plugin-screen-orientation.screenorientation",
      "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
      "pluginId": "cordova-plugin-screen-orientation",
      "clobbers": [
        "cordova.plugins.screenorientation"
      ]
    },
    {
      "id": "cordova-plugin-jc-googledrive.GoogleDrive",
      "file": "plugins/cordova-plugin-jc-googledrive/www/googleDrive.js",
      "pluginId": "cordova-plugin-jc-googledrive",
      "clobbers": [
        "window.plugins.gdrive"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-camera-preview": "0.11.0",
    "es6-promise-plugin": "4.2.2",
    "cordova-plugin-screen-orientation": "3.0.2",
    "cordova-plugin-jc-googledrive": "1.1.0"
  };
});