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
		lmodel.renderPredictions(predictions, my_canvas, context, video); //손 모양을 인식하는 모듈을 캔버스에 랜더링 하는 부분
		if (predictions[0].label !== undefined && predictions[0].label !== 'face') {
			//인식된 손모양이 펼쳐진 손 모양일때만 만족하는 조건문
			let detected_class = predictions[0].label; //인식된 손모양의 명칭이 담기는 변수
			if (first_draw) {
				//처음으로 손이 인식 될 때까지 그림을 그리지 않음
				startX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2; //중심 좌표를 구하는 코드, 처음에 찍힌 손의 값이 초기값이 된다
				startY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
				first_draw = false; //처음 점이 찍힌 이후부터는 연속해서 점을 찍어 그림을 그림
				draw_work = true; //그림 그리기를 시작한 변수
			}
			if (detected_class === 'closed' && draw_work === true) {
				//손 모양이 닫힌 모양이면 그림 그리기를 종료
				draw_work = false; //그림그리기 종료
				first_draw = true; //이후에 그려지는 그림은 다시 처음부터 그려짐
				ctx.clearRect(0, 0, draw_canvas.width, draw_canvas.height); //캔버스에 그려진 그림을 지움
				console.log(drawData);
				count = 0; //변수에 저장하는 카운터를 0으로 초기화
			}

			if (detected_class === 'open' && draw_work === true) {
				//인식된 손 모양이 펼쳐진 손 모양이고 그림그리기 상태가 true이면 그림을 그림
				drawData[count++] = { x: curX, y: curY }; //이전 손의 중심 좌표를 배열에 담음
				curX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2; //현재 손의 좌표를 계산하여 현재 좌표를 갱신
				curY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
				draw(startX, startY, curX, curY); //이전 손의 좌표부터 현재 손의 좌표까지 선을 그어서 그림을 그림
				startX = curX; //그림을 그린 후 현재 손의 좌표가 이전 손의 좌표가 됨
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
