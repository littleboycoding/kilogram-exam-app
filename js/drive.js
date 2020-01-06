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
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

var authorizeButton = document.getElementsByClassName("g-signin")[0];
//var signoutButton = document.getElementById("signout_button");

var drive;
var question_list = {};
var studentList;

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
    initList();

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
  if (confirm("ต้องการออกจากระบบ ?")) {
    gapi.auth2.getAuthInstance().signOut();
    window.location = "index.html";
  }
}

var fileResult;
var selectedQuestion;

async function initList() {
  drive = gapi.client.drive.files;
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

  studentList = await downloadFile("student.json");
  resultJSON = await downloadFile("result.json");
  fileResult = await downloadFile("question.json");
  if (Object.keys(fileResult).length > 0) {
    for (const data in fileResult) {
      question_list[data] = fileResult[data];
      let select = document.getElementsByClassName("question_selection")[0];
      select.innerHTML =
        select.innerHTML +
        "<div class='question_bt' onclick='question_selected(\"" +
        data +
        "\")'>" +
        data +
        " - ทั้งหมด " +
        Object.keys(fileResult[data]).length +
        " ข้อ</div>";
    }
  } else {
    let select = (document.getElementsByClassName(
      "question_selection"
    )[0].innerHTML =
      "<div class='question_bt' style='border: none;'>ไม่มีการสร้างข้อสอบในบัญชีนี้</div>");
  }
  console.log(resultJSON);
}

async function saveResult() {
  if (studentResult) {
    const loading = document.getElementById("loadingTOP");
    loading.style.display = "block";
    await updateFile("result.json", JSON.stringify(resultJSON));

    loading.style.display = "none";
  }
  close_snapshot();
}

async function updateFileContent(fileId, contentBlob) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = function() {
      if (xhr.readyState != XMLHttpRequest.DONE) {
        return;
      }
      resolve(xhr.response);
    };
    xhr.open(
      "PATCH",
      "https://www.googleapis.com/upload/drive/v3/files/" +
        fileId +
        "?uploadType=media"
    );
    xhr.setRequestHeader(
      "Authorization",
      "Bearer " + gapi.auth.getToken().access_token
    );
    xhr.send(contentBlob);
  });
}

async function updateFile(fileName, data) {
  return new Promise(async (resolve, reject) => {
    const fileID = await getFileID(fileName);
    await updateFileContent(fileID, data).then(res => resolve(res));
  });
}

async function downloadFile(fileName) {
  return new Promise(async (resolve, reject) => {
    const fileID = await getFileID(fileName);

    drive
      .get({
        fileId: fileID,
        alt: "media"
      })
      .then(res => {
        resolve(res.result);
      });
  });
}

function getFileID(fileName) {
  return new Promise((resolve, reject) => {
    drive
      .list({
        spaces: "appDataFolder",
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
      })
      .then(function(response) {
        const files = response.result.files.findIndex(
          data => data.name == fileName
        );
        resolve(response.result.files[files].id);
      });
  });
}

async function question_selected(name) {
  if (await cameraInit()) {
    const qList = document.getElementsByClassName("question_list")[0];
    const back = document.getElementById("back");
    const flashlight = document.getElementById("flashlight");
    back.style.display = "block";
    flashlight.style.display = "block";
    qList.style.display = "none";
    selectedQuestion = name;

    lockScreen();
  } else {
    alertMSG("มีปัญหาในการเข้าถึงกล้อง");
  }
}

function backtoSelect() {
  const qList = document.getElementsByClassName("question_list")[0];
  qList.style.display = "block";
  const back = document.getElementById("back");
  back.style.display = "none";
  const flashlight = document.getElementById("flashlight");
  flashlight.style.display = "none";
}
