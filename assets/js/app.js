// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

let channel = socket.channel("snapshot", {});
channel.join()
  .receive("ok", resp => { console.log("Successfully joined snapshot channel."); })
  .receive("error", resp => { console.error("Unable to join snapshot channel!"); });

(function() {
  console.log("In anonymous function...");
  var width = 320;
  var height = 0;
  var streaming = false;
  var video = null;
  var canvas = null;
  var photo = null;
  var captureButton = null;

  function startup() {
    console.log("Starting up...");
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    captureButton = document.getElementById("captureButton");

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(stream => {
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("An error occurred! " + err);
      });

    video.addEventListener("canplay", event => {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    }, false);

    captureButton.addEventListener("click", event => {
      takePicture();
      event.preventDefault();
    }, false);

    clearPhoto();
  }

  function clearPhoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  function takePicture() {
    var context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const image_mimetype = "image/png"

      var data = canvas.toDataURL(image_mimetype);
      photo.setAttribute("src", data);

      // This seems "better" than just sending the dataURL to the backend,
      // but it does seem to be an awful lot of work to get a list of bytes...
      canvas.toBlob(blob => {
        var reader = new FileReader();
        reader.addEventListener("loadend", () => {
          const typedArray = reader.result;
          const uint8Array = new Uint8Array(typedArray);
          const array = Array.from(uint8Array);
          channel.push("snapped", {data: array, mime_type: image_mimetype});
        }, image_mimetype)
        reader.readAsArrayBuffer(blob);
      });
    } else {
      clearPhoto();
    }
  }

  startup();
})()
