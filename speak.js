const order = [
	//인증을 받기 위해 진행해야 할 미션들
	{
		order: ' 부저음이 울리면 손바닥을 펴세요. ',
		label: 'open'
	},
	{
		order: ' 부저음이 울이면 검지손가락만 펴세요. ',
		label: 'point'
	},
	{
		order: ' 부저음이 울리면 주먹을 쥐세요. ',
		label: 'closed'
	},
	{order: '카메라에 주먹을 보여주세요. 그리고 첫번째 '},
	{order: ' 두번째 '}
];
const order2 = [
	//인증을 받기 위해 진행해야 할 미션들
	{
		order: ' 부저음이 울리면 손바닥을 펴세요. ',
		label: 'open'
	},
	{
		order: ' 부저음이 울이면 검지손가락만 펴세요. ',
		label: 'point'
	},
	{
		order: ' 부저음이 울리면 주먹을 쥐세요. ',
		label: 'closed'
	},
	{order: '카메라에 주먹을 보여주세요. 그리고 첫번째 '},
	{order: ' 두번째 '}
];
const voice_order = [
	'다음 동물 이름을 듣고 첫번째 음절을 소리내서 읽으세요. ',
	'다음 동물 이름을 듣고 두번째 음절을 소리내서 읽으세요. ',
	'다음 동물 이름을 듣고 세번째 음절을 소리내서 읽으세요. '
];
const animal = [
	{
		order: ' 강아지',
		label_1: '강',
		label_2: '아',
		label_3: '지'
	},
	{
		order: ' 고양이',
		label_1: '고',
		label_2: '양',
		label_3: '이'
	},
	{
		order: ' 돌고래',
		label_1: '돌',
		label_2: '고',
		label_3: '래'
	},
	{
		order: ' 호랑이',
		label_1: '호',
		label_2: '랑',
		label_3: '이'
	},
	{
		order: ' 비둘기',
		label_1: '비',
		label_2: '둘',
		label_3: '기'
	},
	{
		order: ' 미어캣',
		label_1: '미',
		label_2: '어',
		label_3: '캣'
	},
	{
		order: ' 까마귀',
		label_1: '까',
		label_2: '마',
		label_3: '귀'
	},
	{
		order: ' 너구리',
		label_1: '너',
		label_2: '구',
		label_3: '리'
	},
	{
		order: ' 캥거루',
		label_1: '캥',
		label_2: '거',
		label_3: '루'
	},
	{
		order: ' 코끼리',
		label_1: '코',
		label_2: '끼',
		label_3: '리'
	}
];
let number = Math.floor(Math.random() * 2); //위의 미션들중 하나를 랜덤으로 선택
localStorage.setItem("firstOrder", order[number].label);

order2.splice(number, 1);

let number2 = Math.floor(Math.random() * 2);
localStorage.setItem("secondOrder", order2[number2].label);

let voice_number = Math.floor(Math.random() * 3);
let animal_number = Math.floor(Math.random() * 10);

const now = new Date();
const timestamp = `${now.getDate()}:${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`; //timestamp

localStorage.setItem('timestamp', timestamp); //만들어진 timestamp를 localstorage에 저장
localStorage.setItem('mission_num', number); //골라진 미션의 번호를 localstorage에 저장

/*
    함수이름: speak
    기능: order에서 골라진 명령을 tts로 읽어주는 함수
    인자: text-읽을 명령을 받음, opt_prop-속도 음의 높낮이 등 tts설정을 받음
*/

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
	//html에 구현된 음성 출력 버튼을 눌렀을때 실행되는 함수
	speak(order[3].order + order[number].order + order[4].order + order2[number2].order, {
		//speak함수를 호출
		rate: 1,
		pitch: 1,
		lang: 'ko-KR',
	});
});
