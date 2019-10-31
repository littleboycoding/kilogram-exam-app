cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-android-permissions.Permissions",
      "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
      "pluginId": "cordova-plugin-android-permissions",
      "clobbers": [
        "cordova.plugins.permissions"
      ]
    },
    {
      "id": "cordova-plugin-permission.Permission",
      "file": "plugins/cordova-plugin-permission/www/index.js",
      "pluginId": "cordova-plugin-permission",
      "clobbers": [
        "window.plugins.Permission"
      ]
    },
    {
      "id": "cordova-plugin-permission.tests",
      "file": "plugins/cordova-plugin-permission/tests/index.spec.js",
      "pluginId": "cordova-plugin-permission"
    },
    {
      "id": "cordova-plugin-document-scanner.scan",
      "file": "plugins/cordova-plugin-document-scanner/www/scan.js",
      "pluginId": "cordova-plugin-document-scanner",
      "clobbers": [
        "scan"
      ]
    },
    {
      "id": "cordova-plugin-camera-preview.CameraPreview",
      "file": "plugins/cordova-plugin-camera-preview/www/CameraPreview.js",
      "pluginId": "cordova-plugin-camera-preview",
      "clobbers": [
        "CameraPreview"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-android-permissions": "1.0.2",
    "cordova-plugin-permission": "0.1.0",
    "cordova-plugin-document-scanner": "4.2.1",
    "cordova-plugin-camera-preview": "0.11.0"
  };
});