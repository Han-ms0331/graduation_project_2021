const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { connect } = require('http2');

const connection = mysql.createConnection({
	host: '34.64.121.246',
	user: 'nobot',
	password: 'nobotgproject',
	port: 3306,
	database: 'gproject',
});

app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
	res.send('hi');
});

app.post('/detect', function (req, res) {
	let data = JSON.parse(Object.keys(req.body)[0]);
	let i = 1;
	console.log(data);
	//connection.connect;
	connection.query(
		`INSERT INTO dataset (set_no,location_tag) VALUES ('${data[0].timestamp}','${data[0].location_tag}')`,
		(err, rows, fields) => {
			if (err) {
				console.log(err);
			} else {
				console.log(rows.set_no);
			}
		}
	);

	// for (i in data) {
	// 	connection.query(
	// 		`INSERT INTO data_array (location_tag,dataset_no,x_location,y_location) VALUES (${data[0].location_tag},${data[0].timestamp},${data[i].x},${data[i].y})`,
	// 		(err, rows, fields) => {
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log(rows.a_no);
	// 			}
	// 		}
	// 	);
	// }
	res.send('check');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
