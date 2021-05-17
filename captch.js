let lmodel;
const my_video = document.getElementById('video');
const my_canvas = document.getElementById('canvas');
const draw_canvas = document.getElementById('draw');
const bt_loading = document.getElementById('btn_loading');
const ctx = draw_canvas.getContext('2d');
const context = my_canvas.getContext('2d');
let first_draw = true;
let draw_work = false;
let drawData = [];

my_video.style.display = 'none';

const labelMap1 = {
	1: 'open',
	2: 'closed',
};

function checkLength(prevx, prevy, curx, cury) {
	let difx = Math.abs(curx - prevx);
	let dify = Math.abs(cury - prevy);
	let result = Math.sqrt(Math.pow(difx, 2) + Math.pow(dify, 2));
	console.log(result);
	if (result > 270) {
		return true;
	} else {
		return false;
	}
}

function start_video() {
	var video = document.querySelector('#video');
	if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia({
				video: true,
			})
			.then(function (stream) {
				video.srcObject = stream;
				setInterval(run_detection, 10);
			})
			.catch(function (err0r) {
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
	lmodel.detect(my_video).then((predictions) => {
		//console.log(predictions);
		lmodel.renderPredictions(predictions, my_canvas, context, video);
		if (predictions[0].label !== undefined && predictions[0].label !== 'face') {
			let detected_class = predictions[0].label;
			if (first_draw) {
				startX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2;
				startY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
				first_draw = false;
				draw_work = true;
			}
			if (detected_class === 'closed' && draw_work === true) {
				draw_work = false;
				first_draw = true;
				ctx.clearRect(0, 0, draw_canvas.width, draw_canvas.height);
				console.log(drawData);
				count = 0;
			}

			if (detected_class === 'open' && draw_work === true) {
				drawData[count++] = { x: curX, y: curY };
				curX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2;
				curY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
				draw(startX, startY, curX, curY);
				startX = curX;
				startY = curY;
			}
		}
	});
}

function draw(startX, startY, curX, curY) {
	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.moveTo(startX, startY);
	ctx.lineTo(curX, curY);
	ctx.stroke();
}

function clear() {
	ctx.clearRect(0, 0, draw_canvas.width, draw_canvas.height);
}

const modelParams = {
	flipHorizontal: true, // flip e.g for video
	imageScaleFactor: 0.9, // reduce input image size for gains in speed.
	maxNumBoxes: 5, // maximum number of boxes to detect
	iouThreshold: 0.7, // ioU threshold for non-max suppression
	scoreThreshold: 0.7, // confidence threshold for predictions.
	lableMap: labelMap1,
};
handTrack.load(modelParams).then((model) => {
	lmodel = model;
	// console.log(model.getModelParameters());
	btn_loading.style.display = 'none';
	start_video();
});
