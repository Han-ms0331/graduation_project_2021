const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createConnection({
	host: '34.64.87.171',
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
	const data = req.body;
	console.log(req);
	res.send('check');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
