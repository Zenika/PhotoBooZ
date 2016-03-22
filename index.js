var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var clientId = 0;
var clients = {};
var images = fs.readdirSync('./public_slideshow/pictures/');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.json({limit: '10mb'}));


app.use('/', express.static('public_slideshow'));
app.use('/camera', express.static('public_camera'));
app.use('/jquery', express.static('node_modules/jquery/dist'));

app.get('/stream', function(req, res) {
    res.writeHead(200, {
    	'Content-Type': 'text/event-stream',  // <- Important headers
    	'Cache-Control': 'no-cache',
    	'Connection': 'keep-alive'
    });
    res.write('\n\n');
    (function(clientId) {
        clients[clientId] = res;  // <- Add this client to those we consider "attached"
        req.on("close", function(){delete clients[clientId]});  // <- Remove this client when he disconnects
    })(++clientId)
});

app.get('/images', function(req, res) {

  res.send(JSON.stringify(
    images.map(function(img) {
      return "/pictures/"+img;
    })
  ));
});

app.post('/images', function(req, res) {

	if (!req.body.image) {
		res.sendStatus(400);
		return;
	}

	var now = new Date();
	var fileName = 'photo-' + now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() + '-'
		+ now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds() + '.png';

	req.body.image = req.body.image.replace(/^data:image\/\w+;base64,/, "");
	req.body.image = req.body.image.replace(/ /g, '+');

	fs.writeFile('./public_slideshow/pictures/' + fileName, req.body.image, 'base64', function(err) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		res.sendStatus(201);

    images.push(fileName);

		for (clientId in clients) {
			clients[clientId].write('data: pictures/'+ fileName + "\n\n"); // <- Push a message to a single attached client
		};
	});
});

var Twitter = require('twitter');
var twitterKeys = require('./twitterKeys');
app.post('/tweet', function(req, res) {
  console.log("received this : " + JSON.stringify(req.body));
  var imageFile = req.body.url.substring(req.body.url.lastIndexOf('/')+1);
  var account = req.body.account;
  var atAccount = account.indexOf('@') !== 0 ? '@'+account : account;

  var client = new Twitter(twitterKeys);
  var data = fs.readFileSync('public_slideshow/pictures/'+imageFile);

  client.get('users/show', {screen_name: account}, function(error, user, response) {

    if(user.errors) {
      res.sendStatus(500);
    }
    else {
      client.post('media/upload', {media: data}, function(error, media, response) {
        if(!error) {
          console.log(JSON.stringify(media));

          var status = {
            status: atAccount+' : Voilà ta photo!',
            media_ids: media.media_id_string,
            screen_name: account
          }

          client.post('statuses/update', status, function(error, tweet, response) {
            if(!error) {
              console.log(tweet);
              res.sendStatus(201)
            }
            else {
              res.sendStatus(500);
            }
          })
        }
        else {
          res.sendStatus(500);
        }
      });
    }
  });


});

app.listen(8081);
