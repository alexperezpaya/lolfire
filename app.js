
// Modules

var async = require('async');
var express = require('express');
var Lollib = require('irelia');
var webshot = require('webshot');
var frame = require(__dirname + '/lib/frame');
var config = require(__dirname + '/config.json');

// Global modules

require(__dirname + '/lib/redis');

// var redis = require('rediswrapper');

var app = express();

global.lol = new Lollib({
	endpoint: 'http://prod.api.pvp.net/api/lol/',
	key: config.api.beta_key,
	debug: config.debug
});

app.use('/static', express.static('static'));

// App router

// Modularize each function

app.get('/', function (req, res){
	res.redirect('/image/banner/euw/nszombie');
});

app.get('/frame/banner/:region/:summoner', frame.summoner);

app.get('/image/banner/:region/:summoner', function (req, res){

	webshot('http://localhost/frame/banner/'+req.params.region+'/'+req.params.summoner, {
		screenSize: {
			width: 960,
			height: 240
		}

	}, function(err, stream) {
		
		if(err){
			console.log(err);
			res.send(err);
		} else{

			res.writeHead(200, {
			  'Content-Type': 'image/png'
			});

			stream.on('data', function(data) {
				res.write(data);
			});

			stream.on('end', function (){
				res.end();
			});
		}

	});

});

app.listen(config.port);