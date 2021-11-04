//서버 설정에 필요한 모듈들을 import
const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
// const mysql = require('mysql');
const { connect } = require('http2');

// const connection = mysql.createConnection({
// 	//database와의 connection을 설정하는 객체
// 	host: '34.64.121.246',
// 	user: 'nobot',
// 	password: 'nobotgproject',
// 	port: 3306,
// 	database: 'gproject',
// });

function check_bot(time, count, averageFPS) {
	let targetCount;
	if(averageFPS >=1 && averageFPS<2){
		targetCount = 0.001 * time;
	} else if(averageFPS >=2 && averageFPS<3){
		targetCount = 0.002 * time;
	} else if(averageFPS >=3 && averageFPS<4){
		targetCount = 0.005 * time;
	} else if(averageFPS >=4 && averageFPS<5){
		targetCount = 0.01 * time;
	} else if(averageFPS >=5 && averageFPS<6){
		targetCount = 0.015 * time;
	} else if(averageFPS >=6 && averageFPS<8){
		targetCount = 0.02 * time;
	} else if(averageFPS >=8 && averageFPS<10){
		targetCount = 0.025 * time;
	} else if(averageFPS >=10 && averageFPS<12){
		targetCount = 0.03 * time;
	} else if(averageFPS >=12){
		targetCount = 0.035* time;
	}
	let minimumCount = targetCount * 0.70;
	let maximumCount = targetCount * 1.30;
	console.log(count);
	console.log(averageFPS);
	console.log(targetCount);
	console.log(maximumCount);
	console.log(minimumCount);

	if (count > minimumCount && count < maximumCount) {
		console.log("success")
		return true;
	} else {
		console.log("failed")
		return false;
	}
}

app.all('/*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
	next()
})

app.use(express.urlencoded({ extended: false })); //url에 담긴 정보를 분석하는 미들웨어

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

app.post('/authentication', function (req, res) {
	let data = JSON.parse(Object.keys(req.body)[0]);
	console.log(data);
	if(check_bot(data.time, data.count, data.averageFPS))
		res.send({result:'success'});
	else
		res.send({result:'failed'});
	res.end();
});

app.get('/authentication',(req,res) => {

})


// app.post('/detect', function (req, res) {
// 	// /detect로 들어온 요청을 처리하는  미들웨어
// 	let data = JSON.parse(Object.keys(req.body)[0]); //body에 담겨온 데이터를 data변수에 저장
// 	let i = 1; //반복문을 위한 counter
// 	connection.query(
// 		//연결한 데이터에 query문을 전송, dataset table에 현재 들어온 데이터의 timestamp와 location_tag를 저장
// 		`INSERT INTO dataset (set_no,location_tag) VALUES ('${data[0].timestamp}','${data[0].location_tag}')`,
// 		(err, rows, fields) => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log(rows.set_no);
// 			}
// 		}
// 	);
//
// 	for (i in data) {
// 		//들어온 배열의 크기만큼 반복하여 데이터를 저장
// 		connection.query(
// 			//data의 현재 인덱스의 좌표를 data_array table에 저장
// 			`INSERT INTO data_array (location_tag,dataset_no,x_location,y_location) VALUES ('${data[0].location_tag}','${data[0].timestamp}','${data[i].x}','${data[i].y}')`,
// 			(err, rows, fields) => {
// 				if (err) {
// 					console.log(err);
// 				} else {
// 					console.log(rows.a_no);
// 				}
// 			}
// 		);
// 	}
// 	res.send('check');
// });