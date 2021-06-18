const order = [
	'손바닥을 펴서 허공에 원을 시계방향으로 그리시오',
	'손바닥을 펴서 허공에 원을 반시계방향으로 그리시오',
	'손바닥을 펴서 허공에 위가 뾰족한 삼각형을 그리시오',
	'손바닥을 펴서 허공에 아래가 뾰족한 삼각형을 그리시오',
	'손바닥을 펴서 허공에 다이아몬드 모양을 그리시오',
	'손바닥을 펴서 허공에 사각형을 그리시오',
	'손바닥을 펴서 허공에 별을 그리시오',
	'손바닥을 펴서 허공에 초승달을 그리시오',
	'손바닥을 펴서 허공에 하트를 그리시오',
	'손바닥을 펴서 허공에 자음 기역을 그리시오',
	'손바닥을 펴서 허공에 자음 니은을 그리시오',
	'손바닥을 펴서 허공에 자음 디귿을 그리시오',
	'손바닥을 펴서 허공에 자음 리을을 그리시오',
	'손바닥을 펴서 허공에 자음 비읍을 그리시오',
	'손바닥을 펴서 허공에 자음 시옷을 그리시오',
	'손바닥을 펴서 허공에 자음 지읒을 그리시오',
	'손바닥을 펴서 허공에 자음 치읓을 그리시오',
	'손바닥을 펴서 허공에 자음 키읔을 그리시오',
	'손바닥을 펴서 허공에 자음 티읕을 그리시오',
	'손바닥을 펴서 허공에 자음 피읖을 그리시오',
	'손바닥을 펴서 허공에 자음 히읗을 그리시오',
	'손바닥을 펴서 허공에 숫자 둘을 그리시오',
	'손바닥을 펴서 허공에 숫자 삼을 그리시오',
	'손바닥을 펴서 허공에 숫자 넷을 그리시오',
	'손바닥을 펴서 허공에 숫자 오를 그리시오',
	'손바닥을 펴서 허공에 숫자 여섯을 그리시오',
	'손바닥을 펴서 허공에 숫자 팔을 그리시오',
	'손바닥을 펴서 허공에 숫자 아홉을 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 에이를 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 비를 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 에이치를 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 케이를 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 엠을 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 알을 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 에스를 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 브이를 그리시오',
	'손바닥을 펴서 허공에 알파벳 대문자 엑스를 그리시오',
	'손바닥을 펴서 허공에 무한대 기호를 그리시오',
	'손바닥을 펴서 허공에 덧셈 기호를 그리시오',
	'손바닥을 펴서 허공에 우물 정자를 그리시오',
	'손바닥을 펴서 허공에 골뱅이표 기호를 그리시오',
];
const now = new Date();
const timestamp = `${now.getDate()}:${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

let number = Math.floor(Math.random() * 42);
localStorage.setItem('timestamp', timestamp);
localStorage.setItem('mission_num', number);

function speak(text, opt_prop) {
	if (
		typeof SpeechSynthesisUtterance === 'undefined' ||
		typeof window.speechSynthesis === 'undefined'
	) {
		alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
		return;
	}

	window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

	const prop = opt_prop || {};

	const speechMsg = new SpeechSynthesisUtterance();
	speechMsg.rate = prop.rate || 1; // 속도: 0.1 ~ 10
	speechMsg.pitch = prop.pitch || 1; // 음높이: 0 ~ 2
	speechMsg.lang = prop.lang || 'ko-KR';
	speechMsg.text = text;

	// SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
	window.speechSynthesis.speak(speechMsg);
}
const btnRead = document.getElementById('read-btn');

btnRead.addEventListener('click', (e) => {
	speak(order[number], {
		rate: 1,
		pitch: 1.2,
		lang: 'ko-KR',
	});
});

// btnRead.addEventListener("click", e => {
//     speak(order[0], {
//         rate: 1,
//         pitch: 1.2,
//         lang: "ko-KR"
//     })
// });
// window.onload = speak(order[0],
//     {
//         rate: 1,
//         pitch: 1.2,
//         lang: 'ko-KR'
//     });
