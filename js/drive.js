// Client ID and API key from the Developer Console
var CLIENT_ID =
  "613633799370-oq1j8j8te4nlb01hd2srbsqhg8vmnh8d.apps.googleusercontent.com";
var API_KEY = "AIzaSyDN1w4HgvGe0ytbOUJ6T10i5ymjW9j0qE0";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  "https://people.googleapis.com/$discovery/rest?version=v1"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES =
  "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

var authorizeButton = document.getElementsByClassName("g-signin")[0];
//var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        //signoutButton.onclick = handleSignoutClick;
      },
      function(error) {
        //appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    dialog.style.display = "none";
    listFiles();

    //Uncomment below line will signout
    //handleSignoutClick();
  } else {
    authorizeButton.src = "web/2x/btn_google_signin_dark_normal_web@2x.png";
    authorizeButton.onmouseover = () =>
      (authorizeButton.src =
        "web/2x/btn_google_signin_dark_pressed_web@2x.png");
    authorizeButton.onmouseout = () =>
      (authorizeButton.src = "web/2x/btn_google_signin_dark_normal_web@2x.png");
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

var fileResult;

function listFiles() {
  gapi.client.people.people
    .get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos"
    })
    .then(res => {
      let profile = document.getElementsByClassName("profile_img")[0];
      profile.src = res.result.photos[0].url;
      profile.alt = res.result.names[0].displayName;
    });
  gapi.client.drive.files
    .list({
      spaces: "appDataFolder",
      pageSize: 10,
      fields: "nextPageToken, files(id, name)"
    })
    .then(function(response) {
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i].id;
          getFiles(file);
        }
      } else {
        console.log("No files found.");
      }
    });
}

function getFiles(file) {
  gapi.client.drive.files
    .get({
      fileId: file,
      alt: "media"
    })
    .then(res => {
      fileResult = res.result;
      for (const data in fileResult) {
        console.log(data + " : " + fileResult[data]);
      }
    });
}
