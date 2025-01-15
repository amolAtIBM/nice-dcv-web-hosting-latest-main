import "./dcvjs/dcv.js";
import dcv from "./dcvjs/dcv.js";

// import "./dcv-ui/dcv-ui.js"
// import dcv_ui from "./dcv-ui/dcv-ui.js"

let auth, connection, serverUrl;

console.log(">>>Using NICE DCV Web Client SDK version " + dcv.version.versionStr);
//console.log('Node.js version:', process.version);

// var URL="";

// function getUrl () {

// console.log("Abhishek");
//     r=document.getElementById("inputBar");
//     URL=r.value;
//     window.URL = URL;
// // document.addEventListener('DOMContentLoaded', main);
//     main();
// }

export const main = () => {
  console.log("Setting log level to INFO");
  dcv.setLogLevel(dcv.LogLevel.INFO);
  r = document.getElementById("inputBar");
  URL = r.value;
  serverUrl = URL;
  //serverUrl = "https://15.207.14.233:8443/";

  //    serverUrl = "https://your-dcv-server-url:port/";
  //    if (window.URL != "") {
  // serverUrl = window.URL;
  //    }

  // Use the provided URL or set a default one
  // const serverUrl = url || "https://your-dcv-server-url:port/";

  // console.log("Starting authentication with", serverUrl);

  console.log("Starting authentication with", serverUrl);

  auth = dcv.authenticate(serverUrl, {
    promptCredentials: onPromptCredentials,
    error: onError,
    success: onSuccess,
  });
}

function O1_onPromptCredentials(auth, challenge) {
  // Let's check if in challege we have a username and password request
  if (
    challengeHasField(challenge, "username") &&
    challengeHasField(challenge, "password")
  ) {
    auth.sendCredentials({ username: MY_DCV_USER, password: MY_PASSWORD });
  } else {
    // Challenge is requesting something else...
  }
}

function challengeHasField(challenge, field) {
  return challenge.requiredCredentials.some(
    (credential) => credential.name === field
  );
}

function onError(auth, error) {
  console.log("Error during the authentication: " + error.message);
}

// We connect to the first session returned
function onSuccess(auth, result) {
  let { sessionId, authToken } = { ...result[0] };

  connect(sessionId, authToken);
}

function connect(sessionId, authToken) {
  console.log(sessionId, authToken);

  dcv
    .connect({
      url: serverUrl,
      sessionId: sessionId,
      authToken: authToken,
      divId: "dcv-display",
      callbacks: {
        firstFrame: () => console.log("First frame received"),
      },
    })
    .then(function (conn) {
      console.log("Connection established!");
      connection = conn;
      console.log("connection", JSON.stringify(connection));
      document
        .getElementById("dcv-display")
        .addEventListener("click", () => connection.enterRelativeMouseMode());
      console.log("mouse click");
    })
    .catch(function (error) {
      console.log("Connection failed with error " + error.message);
    });
}

let form, fieldSet;

function submitCredentials(e) {
  var credentials = {};
  fieldSet.childNodes.forEach((input) => (credentials[input.id] = input.value));
  auth.sendCredentials(credentials);
  e.preventDefault();
}

function createLoginForm() {
  console.log("Creating login form");
  var submitButton = document.createElement("button");

  submitButton.type = "submit";
  submitButton.textContent = "Login";

  form = document.createElement("form");
  fieldSet = document.createElement("fieldset");

  form.onsubmit = submitCredentials;
  form.appendChild(fieldSet);
  form.appendChild(submitButton);

  document.body.appendChild(form);
}

function addInput(name) {
  var type = name === "password" ? "password" : "text";

  var inputField = document.createElement("input");
  inputField.name = name;
  inputField.id = name;
  inputField.placeholder = name;
  inputField.type = type;
  fieldSet.appendChild(inputField);
}

function onPromptCredentials(_, credentialsChallenge) {
  createLoginForm();
  credentialsChallenge.requiredCredentials.forEach((challenge) =>
    addInput(challenge.name)
  );
}
