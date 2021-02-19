// var player = document.getElementById("player");
// // Prefer camera resolution nearest to 1280x720.
// var constraints = { audio: true, video: { width: 1280, height: 720 } };

// navigator.mediaDevices
//   .getUserMedia(constraints)
//   .then(function (mediaStream) {
//     var video = document.querySelector("video");
//     video.srcObject = mediaStream;
//     video.onloadedmetadata = function (e) {
//       video.play();
//     };
//   })
//   .catch(function (err) {
//     console.log(err.name + ": " + err.message);
//   }); // always check for errors at the end.

const player = document.getElementById("player");
let shouldStop = false;
let stopped = false;
const downloadLink = document.getElementById("download");
const stopButton = document.getElementById("stop");

stopButton.addEventListener("click", function () {
  player.pause();
  shouldStop = true;
});

var handleSuccess = function (stream) {
  const options = { mimeType: "video/webm; codecs=vp9" };
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(stream, options);
  player.srcObject = stream;

  mediaRecorder.addEventListener("dataavailable", function (e) {
    console.log("data available");
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }

    if (shouldStop === true && stopped === false) {
      mediaRecorder.stop();
      stopped = true;
    }
  });

  mediaRecorder.addEventListener("stop", function () {
    downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
    downloadLink.download = "acetest.webm";
  });

  mediaRecorder.start();
};

navigator.mediaDevices
  .getUserMedia({ audio: true, video: true })
  .then(handleSuccess);
