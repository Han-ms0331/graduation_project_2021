const order = [
"손바닥을 펴서 허공에 원을 시계방향으로 그리시오",
"손바닥을 펴서 허공에 원을 반시계방향으로 그리시오",
"손바닥을 펴서 허공에 사각형을 그리시오",
"손바닥을 펴서 허공에 별을 그리시오",
"손바닥을 펴서 허공에 선을 위에서 아래로 그리시오",
"손바닥을 펴서 허공에 선을 아래에서 위로 그리시오",
"손바닥을 펴서 허공에 선을 오른쪽에서 왼쪽으로 그리시오",
"손바닥을 펴서 허공에 선을 왼쪽에서 오른쪽으로 그리시오",
'손바닥을 펴서 허공에 삼각형을 그리시오',
];

let number = Math.floor(Math.random() * 10);

function speak(text, opt_prop) {
    if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
        alert("이 브라우저는 음성 합성을 지원하지 않습니다.")
        return
    }
    
    window.speechSynthesis.cancel() // 현재 읽고있다면 초기화

    const prop = opt_prop || {}

    const speechMsg = new SpeechSynthesisUtterance()
    speechMsg.rate = prop.rate || 1 // 속도: 0.1 ~ 10      
    speechMsg.pitch = prop.pitch || 1 // 음높이: 0 ~ 2
    speechMsg.lang = prop.lang || "ko-KR"
    speechMsg.text = text
    
    // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
    window.speechSynthesis.speak(speechMsg)
};
const btnRead = document.getElementById("read-btn");

btnRead.addEventListener("click", e => {
    speak(order[number],
        {
            rate: 1,
            pitch: 1.2,
            lang: 'ko-KR'
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