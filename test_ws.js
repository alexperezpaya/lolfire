
// Modules

var express = require('express');
var async = require('async');
var Lollib = require('irelia');

// var redis = require('rediswrapper');

// Initialization

var app = express();

var lol = new Lollib({
	endpoint: 'http://prod.api.pvp.net/api/lol/',
	key: '94f44207-a683-4b27-a7da-790a3ef66c6c',
	debug: true
});


var webshot = require('webshot');

app.get('/image/banner/:region/:summoner', function (req, res){

	async.waterfall([

		function (callback){
			
			// Get id from redis cache :P if no search it and add it

			lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){

				callback(err, summoner);

			});
		}, function (summoner, callback){
			lol.getSummaryStatsBySummonerId(req.params.region, summoner.id, function (err, stats){

				console.log(err, stats);
				callback(err, stats, summoner);

			});
		}

	], function (err, stats, summoner){

		if(err){
			console.log(err);
			return err;
		}

		// USE EJS TO RENDER SHOT WITH PARAMETERS;

		webshot('<html><meta charset="utf-8"><style>body{font-family: Helvetica; background: #f2f2f2};</style><body><h1>'+summoner.name+'</h1>Europe West<h2>Level: '+summoner.summonerLevel+'</h2></body></html>', {
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

app.listen(3000);