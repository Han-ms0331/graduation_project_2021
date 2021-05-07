let lmodel;
const my_video = document.getElementById("video");
const my_canvas = document.getElementById("canvas");
const draw_canvas = document.getElementById('draw');
const bt_loading = document.getElementById("btn_loading");
const ctx = draw_canvas.getContext("2d");
const context = my_canvas.getContext("2d");
let first_draw = true;
let drawEnd = true;

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
let startX = 0;
let startY = 0;
let curX = 0;
let curY = 0;
function run_detection() {
    lmodel.detect(my_video).then(predictions => {
        console.log(predictions[0].bbox);
        let detected_class = predictions[0].class;
        if(detected_class === 1){
            if(first_draw){
                startX = predictions[0].bbox[0];
                startY = predictions[0].bbox[1];
                first_draw =false;
            }
            curX = predictions[0].bbox[0];
            curY = predictions[0].bbox[1];
            draw(startX, startY, curX, curY);
            startX = curX;
            startY = curY;
         }
        
        lmodel.renderPredictions(predictions, my_canvas, context, video);
    });
}


function draw (startX,startY,curX,curY){
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(curX,curY);
    ctx.stroke();
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