const player = document.getElementById("player");
const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");
const videoState = document.getElementById("video-state");

let isRecording = false;

recordButton.addEventListener("click", async () => {
  const constraints = {
    video: {
      width: 720,
      height: 480,
    },
  };
  if (!isRecording) {
    await init(constraints);
    recordButton.innerText = "Stop";
    videoState.innerText = "Recording..";
    recordButton.classList.remove("btn-primary");
    recordButton.classList.add("btn-danger");
    await startRecording();
  } else {
    videoState.innerHTML = "&nbsp";
    recordButton.innerText = "Record";
    recordButton.classList.remove("btn-danger");
    recordButton.classList.add("btn-primary");
    await stopRecording();
  }
});

// stopButton.addEventListener("click", () => {
//   stopRecording();
// });

let mediaRecorder;
let recordedBlobs;

function handleSuccess(stream) {
  console.log("getUserMedia() got stream:", stream);
  window.stream = stream;

  player.srcObject = stream;
}

function handleDataAvailable(event) {
  console.log("handleDataAvailable", event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  isRecording = true;
  // handle video codec, set supported codec
  let options = { mimeType: "video/webm;codecs=vp9,opus" };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = { mimeType: "video/webm;codecs=vp8,opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = { mimeType: "video/webm" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = { mimeType: "" };
      }
    }
  }
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error("Exception while creating MediaRecorder:", e);
    return;
  }
  console.log("Created MediaRecorder", mediaRecorder, "with options", options);
  // disable record button to prevent concurrent recordings

  mediaRecorder.onstop = (event) => {
    console.log("Recorder stopped: ", event);
    console.log("Recorded Blobs: ", recordedBlobs);

    var formData = new FormData();
    var fileName = "abc.webm";
    // JavaScript file-like object
    var myblob = new Blob(recordedBlobs, { type: "video/webm" });
    myblob.lastModifiedDate = new Date().getTime();
    myblob.name = fileName;

    formData.append("video", myblob, fileName);
    // send formdata as request
    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:8080/video");
    request.send(formData);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log("MediaRecorder started", mediaRecorder);
}

function stopRecording() {
  console.log("Stopping");
  isRecording = false;
  // mediaRecorder.stop();

  // stop accessing webcam media device
  player.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  player.srcObject = null;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error("navigator.getUserMedia error:", e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}
