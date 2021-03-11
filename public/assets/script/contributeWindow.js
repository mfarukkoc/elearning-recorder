let countributeButton = document.getElementById("contribute-button");
let countributeButton2 = document.getElementById("contribute-button-2");

var width = 720;
var height = 480;
var left = screen.width - screen.width;
var bottom = 0;
var params = "width=" + width + ", height=" + height;
params += ", bottom=" + top + ", left=" + left;
params += ", directories=no";
params += ", location=no";
params += ", menubar=no";
params += ", resizable=no";
params += ", scrollbars=no";
params += ", status=no";
params += ", toolbar=no";

countributeButton.addEventListener("click", async () => {
  var recordWindow = window.open("./contribute.html", "", params);
});
countributeButton2.addEventListener("click", async () => {
  var recordWindow = window.open("./contribute.html", "", params);
});
