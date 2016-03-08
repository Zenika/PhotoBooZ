var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.json({limit: '10mb'}));


app.get('/', function(req, res) {
	res.send('Hello');
});

app.post('/image', function(req, res) {

	if (!req.body.image) {
		res.status(400);
		return;
	}

	var now = new Date();
	var fileName = './pictures/photo-' + now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() + '-' 
		+ now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds() + '.png';

	req.body.image = req.body.image.replace(/^data:image\/\w+;base64,/, "");
	req.body.image = req.body.image.replace(/ /g, '+');

	fs.writeFile(fileName, req.body.image, 'base64', function(err) {
		if (err) {
			res.status(500);
			return;
		}

		res.status(201);
	});

	
});

app.listen(8081);