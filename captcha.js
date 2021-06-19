let lmodel;
const my_video = document.getElementById('video'); //captcha.html 파일에서 웹캠 화면을 띄우는 태그를 저장함
const my_canvas = document.getElementById('canvas'); //captcha.html파일에서 손 모양을 표시하는 박스를 띄우기 위한 캔버스 태그를 저장함
const draw_canvas = document.getElementById('draw'); //captcha.html파일에서 손의 중앙을 따라 그림을 그리는 캔버스 태그를 저장함
const bt_loading = document.getElementById('btn_loading'); //handtrack모듈을 로딩해오는 버튼 태그를 저장함
const ctx = draw_canvas.getContext('2d'); //저장한 캔버스 태그를 그림을 2d로 설정
const context = my_canvas.getContext('2d'); //저장한 캔버스 태그를 그림을 2d로 설정

let first_draw = true; //음성이 끝난 후 그림그리기를 시작하기 위해 필요한 변수
let draw_work = false; //현재 그림을 그리는 상태인지 확인하는 변수
let drawData = []; //서버에 보낼 데이터를 담는 배열

my_video.style.display = 'none'; //처음에는 화면에 웹캠을 표시하지 ㅇ않음

const labelMap1 = {
	1: 'open',
	2: 'closed',
}; //handtrack모듈에서 상용하는 파라미터를 위한 객체

/*
	함수이름: send_data
	기능: 인자로 받은 데이터를 서버로 보낸다
	인자: data-서버로 보낼 데이터를 입력받음
*/
function send_data(data) {
	if (send_count < 1) {
		//첫번째로 완료된 데이터만 보낸다
		fetch('http://34.64.121.246:3000/detect', {
			//서버와 url로 통신하는 fetch함수를 사용
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}).then((response) => {
			console.log(response); //응답을 출력
		});
	}
}

/* 
	함수이름: start_video
	기능: 웹캠을 띄울 캕버스를 설정함
	인자: 없음
*/
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

let startX = 0; //x좌표 초기화
let startY = 0; //y좌표 초기화
let curX = 0; //현재x좌표 초기화
let curY = 0; //현재y좌표 초기화
let count = 1; //배열의 index를 나타내는 counter 초기화
let send_count = 0; //첫번째 완성된 그림만 보내기위한 counter

/* 
	함수이름: run_detection
	기능: 웹캠에 띄워진 손을 인식하여 그림을 그리고 그림의 좌표들을 배열에 담음
	인자: 없음
*/
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
				drawData[0] = {
					timestamp: localStorage.getItem('timestamp'),
					location_tag: localStorage.getItem('mission_num'),
				}; //drawData의 첫번째 인덱스에는 현재 데이터의 id로 쓰일 timestamp와 현재 미션의 번호가 들어감
				send_data(drawData); //만들어진 drawData를 send_data함수에 전달
				send_count++; //send_count를  1증가시켜 한번 전송과정이 이뤄졌음을 표시
				count = 1; //변수에 저장하는 카운터를 1로 초기화
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

/*
	함수이름: draw
	기능: 입력된 좌표들 사이를 선으로 이어줌
	인자: startX-이전 x좌표, startY-이전 y좌표, curX-현재 x좌표, curY-현재 y좌표
*/
function draw(startX, startY, curX, curY) {
	ctx.beginPath(); //선 긋기 시작
	ctx.lineWidth = 5; //선의 굵기는 5px
	ctx.moveTo(startX, startY); //이전 좌표로 부터
	ctx.lineTo(curX, curY); //현재 좌표까지
	ctx.stroke(); //선을 긋는다
}

/*
	함수이름: clear
	기능: 화면에 그려진 그림을 지우는 함수
	인자: 없음
*/
function clear() {
	ctx.clearRect(0, 0, draw_canvas.width, draw_canvas.height); //그림이 그려진 캔버스를 초기화 함
}

const modelParams = {
	//handtrack 모듈에 사용되는  설정값들
	flipHorizontal: true, // flip e.g for video
	imageScaleFactor: 0.9, // reduce input image size for gains in speed.
	maxNumBoxes: 5, // maximum number of boxes to detect
	iouThreshold: 0.7, // ioU threshold for non-max suppression
	scoreThreshold: 0.7, // confidence threshold for predictions.
	lableMap: labelMap1,
};
handTrack.load(modelParams).then((model) => {
	//handtrack 모듈을 불러옴
	lmodel = model;
	// console.log(model.getModelParameters());
	btn_loading.style.display = 'none';
	start_video();
});
