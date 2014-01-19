
// Modules

var async = require('async');
var express = require('express');
var frame = require(__dirname + '/lib/frame');
var Lollib = require('irelia');
global.models = require(__dirname + '/lib/models');
var mongoose = require('mongoose');
var web = require(__dirname + '/lib/web');
var webshot = require('webshot');

// Config

var config = require(__dirname + '/config.json');

// Global modules

require(__dirname + '/lib/redis');

// var redis = require('rediswrapper');

var app = express();

mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.database, {
	user: config.mongo.user,
	pass: config.mongo.pass,
	server: {
		socketOptions: {
			keepAlive: 1
		}
	},
	replset: {
		socketOptions: {
			keepAlive: 1
		}
	}
});

mongoose.model('Summoner', models.summoner);


// App Config

// Static Settings

app.use('/static', express.static('static'));

// View Engine Settings

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').renderFile);


// Module init

global.lol = new Lollib({
	endpoint: 'http://prod.api.pvp.net/api/lol/',
	key: config.api.beta_key,
	debug: config.debug
});

var updateChampions = function (){

	lol.getChampions('euw', true, function (err, champions){
		console.log('Updated free champions at:' + Date.now());
		global.freetoplay = champions.champions;
	});

}

updateChampions();
setInterval(updateChampions, 900000);

// App router

// Modularize each function

app.get('/', function (req, res){
	res.render('index.html', {
		freetoplay: freetoplay
	});
});

app.get('/search', function (req, res){
	res.redirect('/image/banner/'+req.query.region + '/' + req.query.summoner);
});

app.get('/champions', web.champions);

app.get('/summoner/:region/:summoner', web.summoner);

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