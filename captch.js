let lmodel;
const my_video = document.getElementById("video");
const my_canvas = document.getElementById("canvas");
const draw_canvas = document.getElementById('draw');
const bt_loading = document.getElementById("btn_loading");
const ctx = draw_canvas.getContext("2d");
const context = my_canvas.getContext("2d");
let first_draw = true;

my_video.style.display = "none";

function checkLength(prevx,prevy,curx,cury){
    let difx = Math.abs(curx-prevx);
    let dify = Math.abs(cury-prevy);
    let result = Math.sqrt(Math.pow(difx,2)+Math.pow(dify,2));
    console.log(result);
    if(result > 270){
        return true;
    } else{
        return false;
    }
    
}

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
let count = 0;
function run_detection() {
    lmodel.detect(my_video).then(predictions => {
        //console.log(predictions);
        let detected_class = predictions[0].class;
        if(predictions[0].bbox[0]=== undefined){
            clear();
        }
        if(detected_class === 0){
            if(first_draw){
                startX = predictions[0].bbox[0]+(predictions[0].bbox[2]/2);
                startY = predictions[0].bbox[1]+(predictions[0].bbox[3]/2);
                first_draw =false;
            }
            // let drawCheck = checkLength(curX,curY,(predictions[0].bbox[0]+(predictions[0].bbox[2]/2)),(predictions[0].bbox[1]+(predictions[0].bbox[3]/2)));
            // console.log(drawCheck);
            // if(drawCheck === true){
                if(count === 1){
                    curX = predictions[0].bbox[0]+(predictions[0].bbox[2]/2);
                    curY = predictions[0].bbox[1]+(predictions[0].bbox[3]/2);
                    draw(startX, startY, curX, curY);
                    startX = curX;
                    startY = curY;
                    count = 0;
                }
            // }
            console.log(lmodel.getModelParameters());
            count ++;
         }
        lmodel.renderPredictions(predictions, my_canvas, context, video);
    });
}


function draw (startX,startY,curX,curY){
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(startX,startY);
    ctx.lineTo(curX,curY);
    ctx.stroke();
}


function clear (){
    ctx.clearRect(0,0,draw_canvas.width, draw_canvas.height);
}



const modelParams = {
    flipHorizontal: true, // flip e.g for video
    imageScaleFactor: 0.9, // reduce input image size for gains in speed.
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.9, // ioU threshold for non-max suppression
    scoreThreshold: 0.8 // confidence threshold for predictions.
};
handTrack.load(modelParams).then(model => {
    lmodel = model;
    // console.log(model.getModelParameters());
    btn_loading.style.display = "none";
    start_video();
});