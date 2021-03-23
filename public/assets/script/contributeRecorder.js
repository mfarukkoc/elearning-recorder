const player = document.getElementById("player");
const progressBar = document.getElementById("myBar");
const totalCount = document.getElementById("total-count");
const progressCount = document.getElementById("progress-count");
const progressStatus = document.getElementById("progress-status");
let uploadQue = [];
let totalUploads = 0;
let currentUpload = 0;
let isRecording = false;
window.onload = async () => {
  const constraints = {
    video: {
      width: 720,
      height: 480,
    },
  };
  await init(constraints);
  await startRecording();
};

let mediaRecorder;
let recordedBlobs;
let recordingInterval;
let timeStamps = {};

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
    timeStamps = { startTime: new Date() };
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
    var fileName = "video.webm";
    // JavaScript file-like object
    var myblob = new Blob(recordedBlobs, { type: "video/webm" });
    myblob.lastModifiedDate = new Date().getTime();
    myblob.name = fileName;

    formData.append("video", myblob, fileName);
    const jsonBlob = new Blob([JSON.stringify(timeStamps)], {
      type: "application/json",
    });

    formData.append("metadata", jsonBlob, "meta.json");
    // send formdata as request
    uploadQue.push(formData);
    totalUploads += 1;
    totalCount.innerText = totalUploads;
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();

  recordingInterval = setInterval(() => {
    if (mediaRecorder.state !== "recording") {
      clearInterval(recordingInterval);
      console.log("not recording");
      console.log(uploadQue);
    } else if (isRecording === false) {
      clearInterval(recordingInterval);
      recordedBlobs = [];
    } else {
      mediaRecorder.stop();
      // delay between stopping & re-starting to prevent race conditions on timestamps
      setTimeout(() => {
        recordedBlobs = [];
        timeStamps = { startTime: new Date() };
        mediaRecorder.start();
      }, 10);
    }
  }, 60000); // every 10 seconds
  console.log("MediaRecorder started", mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  clearInterval(recordingInterval);
  recordedBlobs = [];
  console.log("Stopping");
  isRecording = false;

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

// add click event listener for each emotion button
document.querySelectorAll(".btn-emotions").forEach((element) =>
  element.addEventListener("click", (e) => {
    console.log(e.target.innerText);
    let now = new Date();
    let time = now - timeStamps.startTime;
    console.log("timestamp", time);
    timeStamps.emotions = {
      ...timeStamps.emotions,
      [time]: e.target.innerText,
    };
  })
);

const uploadForm = async (formData) => {
  var request = new XMLHttpRequest();
  await request.open("POST", "http://localhost:8080/video");
  request.upload.addEventListener(
    "progress",
    function (evt) {
      if (evt.lengthComputable) {
        let percentComplete = evt.loaded / evt.total;
        percentComplete = parseInt(percentComplete * 100);
        console.log("Progress = ", percentComplete);
        move(percentComplete);
      }
    },
    false
  );
  await request.send(formData);
};

let isUploading = false;

setInterval(async () => {
  if (!isUploading && uploadQue.length > 0) {
    move(1);
    currentUpload += 1;
    isUploading = true;
    progressStatus.innerText = "Uploading..";
    progressCount.innerText = currentUpload;
    await uploadForm(uploadQue.shift());
    isUploading = false;
    if (currentUpload === totalUploads) progressStatus.innerText = "Uploaded";
  }
}, 1000);

function move(width) {
  progressBar.style.width = width + "%";
}
$(".dropdown-auto").select2();
