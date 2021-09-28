let lmodel;
const my_video = document.getElementById('video'); //captcha.html 파일에서 웹캠 화면을 띄우는 태그를 저장함
const my_canvas = document.getElementById('canvas'); //captcha.html파일에서 손 모양을 표시하는 박스를 띄우기 위한 캔버스 태그를 저장함
const draw_canvas = document.getElementById('draw'); //captcha.html파일에서 손의 중앙을 따라 그림을 그리는 캔버스 태그를 저장함
const bt_loading = document.getElementById('btn_loading'); //handtrack모듈을 로딩해오는 버튼 태그를 저장함
const ctx = draw_canvas.getContext('2d'); //저장한 캔버스 태그를 그림을 2d로 설정
const context = my_canvas.getContext('2d'); //저장한 캔버스 태그를 그림을 2d로 설정


const term = [1000,1500,2000,2500,3000]
let closeCount = 0;
let openCount = 0;
let termNum = Math.floor(Math.random() * 5);
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



/* 
	함수이름: run_detection
	기능: 웹캠에 띄워진 손을 인식하여 그림을 그리고 그림의 좌표들을 배열에 담음
	인자: 없음
*/
function run_detection() {
	lmodel.detect(my_video).then((predictions) => {
		lmodel.renderPredictions(predictions, my_canvas, context, video); //손 모양을 인식하는 모듈을 캔버스에 랜더링 하는 부분
		// if (predictions[0].label !== undefined && predictions[0].label !== 'face') {
		// 	//인식된 손모양이 펼쳐진 손 모양일때만 만족하는 조건문
		// 	let detected_class = predictions[0].label; //인식된 손모양의 명칭이 담기는 변수
		// 	if (first_draw) {
		// 		//처음으로 손이 인식 될 때까지 그림을 그리지 않음
		// 		startX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2; //중심 좌표를 구하는 코드, 처음에 찍힌 손의 값이 초기값이 된다
		// 		startY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
		// 		first_draw = false; //처음 점이 찍힌 이후부터는 연속해서 점을 찍어 그림을 그림
		// 		draw_work = true; //그림 그리기를 시작한 변수
		// 	}
		// 	if (detected_class === 'closed' && draw_work === true) {
		// 		//손 모양이 닫힌 모양이면 그림 그리기를 종료
		// 		draw_work = false; //그림그리기 종료
		// 		first_draw = true; //이후에 그려지는 그림은 다시 처음부터 그려짐
		// 		ctx.clearRect(0, 0, draw_canvas.width, draw_canvas.height); //캔버스에 그려진 그림을 지움
		// 		drawData[0] = {
		// 			timestamp: localStorage.getItem('timestamp'),
		// 			location_tag: localStorage.getItem('mission_num'),
		// 		}; //drawData의 첫번째 인덱스에는 현재 데이터의 id로 쓰일 timestamp와 현재 미션의 번호가 들어감
		// 		send_data(drawData); //만들어진 drawData를 send_data함수에 전달
		// 		send_count++; //send_count를  1증가시켜 한번 전송과정이 이뤄졌음을 표시
		// 		count = 1; //변수에 저장하는 카운터를 1로 초기화
		// 	}
		//
		// 	if (detected_class === 'open' && draw_work === true) {
		// 		//인식된 손 모양이 펼쳐진 손 모양이고 그림그리기 상태가 true이면 그림을 그림
		// 		drawData[count++] = { x: curX, y: curY }; //이전 손의 중심 좌표를 배열에 담음
		// 		curX = predictions[0].bbox[0] + predictions[0].bbox[2] / 2; //현재 손의 좌표를 계산하여 현재 좌표를 갱신
		// 		curY = predictions[0].bbox[1] + predictions[0].bbox[3] / 2;
		// 		draw(startX, startY, curX, curY); //이전 손의 좌표부터 현재 손의 좌표까지 선을 그어서 그림을 그림
		// 		startX = curX; //그림을 그린 후 현재 손의 좌표가 이전 손의 좌표가 됨
		// 		startY = curY;
		// 	}
		// }
		if ((predictions[1].label === 'closed' || predictions[0].label === 'closed') && closeCount === 0) {
			console.log(predictions);
			closeCount++;
			beep();
		}
		if (closeCount >=1 && (predictions[1].label === 'open' || predictions[0].label === 'open')) {
			if (closeCount === 1) {
				closeCount++;
			}
			openCount++;
			console.log(openCount);
		}
		if(closeCount > 1 && (predictions[1].label === 'closed' || predictions[0].label === 'closed')){
			closeCount++;
			console.log(closeCount);
		}
	});
}

function beep() {
	var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
	snd.play();
	sleep(term[termNum]).then(snd.play());

}

function sleep(ms){
	return new Promise((r) => setTimeout(r,ms));
}



const modelParams = {
	//handtrack 모듈에 사용되는  설정값들
	flipHorizontal: true, // flip e.g for video
	imageScaleFactor: 0.6, // reduce input image size for gains in speed.
	maxNumBoxes: 2, // maximum number of boxes to detect
	iouThreshold: 0.7, // ioU threshold for non-max suppression
	scoreThreshold: 0.7, // confidence threshold for predictions.
};


// handTrack.load(modelParams).then((model) => {
// 	//handtrack 모듈을 불러옴
// 	lmodel = model;
// 	// console.log(model.getModelParameters());
// 	btn_loading.style.display = 'none';
// 	start_video();
// });

beep();