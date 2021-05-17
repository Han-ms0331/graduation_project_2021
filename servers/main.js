const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: false }));

app.post('/detect', function (req, res) {
	const data = req.body;
	console.log(data);
	res.send('success');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
