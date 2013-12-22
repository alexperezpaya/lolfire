
// Modules

var async = require('async');
var express = require('express');
var Lollib = require('irelia');
var render = require(__dirname + '/lib/render');
var webshot = require('webshot');

// var redis = require('rediswrapper');

var port = 80;
/*var domain = 'lolfire.com';
var route = 'http://' + domain + ':' + port;*/

// Initialization

var app = express();

var lol = new Lollib({
	endpoint: 'http://prod.api.pvp.net/api/lol/',
	key: '94f44207-a683-4b27-a7da-790a3ef66c6c',
	debug: true
});

app.use('/static', express.static('static'));

// App router

app.get('/', function (req, res){
	res.redirect('/image/banner/euw/nszombie');
});

app.get('/image/banner/:region/:summoner', function (req, res){

	async.waterfall([

		function (callback){
			
			// Get id from redis cache :P if no search it and add it

			lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){

				callback(err, summoner);

			});
		}, function (summoner, callback){
			lol.getSummaryStatsBySummonerId(req.params.region, summoner.id, function (err, stats){

				callback(err, stats, summoner);

			});
		}

	], function (err, stats, summoner){

		if(err){
			console.log(err);
			throw err;
		}

		// USE EJS TO RENDER SHOT WITH PARAMETERS;

		webshot(render.bannerProfile({
			stats: stats,
			summoner: summoner,
			region: lol.regions[req.params.region]
		}), {
			siteType:'html',
			screenSize: {
				width: 960,
				height: 240
			}

		}, function(err, stream) {
			
			if(err){
				console.log(err);
			}

			stream.on('data', function(data) {
				res.write(data);
			});

			stream.on('end', function (){
				res.end();
			});

		});

	});

});

app.get('/frame/banner/:region/:summoner', function (req, res){

	async.waterfall([

		function (callback){
			
			// Get id from redis cache :P if no search it and add it

			lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){

				callback(err, summoner);

			});
		}, function (summoner, callback){
			lol.getSummaryStatsBySummonerId(req.params.region, summoner.id, function (err, stats){

				callback(err, stats, summoner);

			});
		}

	], function (err, stats, summoner){

		if(err){
			console.log(err);
			throw err;
		}

		// USE EJS TO RENDER SHOT WITH PARAMETERS;

		var code = render.bannerProfile({
			stats: stats,
			summoner: summoner,
			region: lol.regions[req.params.region]
		});

		res.send(code);

	});

});

app.listen(port);