let lmodel;
const my_video = document.getElementById("video");
const my_canvas = document.getElementById("canvas");
const bt_loading = document.getElementById("btn_loading");
const context = my_canvas.getContext("2d");

my_video.style.display = "none";

function start_video() {
    var video = document.querySelector('#video');
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({
                video: true
            })
            .then(function(stream) {
                video.srcObject = stream;
                setInterval(run_detection, 10);
            })
            .catch(function(err0r) {
                console.log(err0r);
            });
    }
}

function run_detection() {
    lmodel.detect(my_video).then(predictions => {
        console.log(predictions);
        lmodel.renderPredictions(predictions, my_canvas, context, video);
    });
}
const modelParams = {
    flipHorizontal: true, // flip e.g for video
    imageScaleFactor: 0.7, // reduce input image size for gains in speed.
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.79 // confidence threshold for predictions.
};
handTrack.load(modelParams).then(model => {
    lmodel = model;
    
    btn_loading.style.display = "none";
    start_video();
});