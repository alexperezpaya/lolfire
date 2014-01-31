
var irelia = require('irelia');
var config = require(__dirname + '/../config.json');
var async = require('async');
var models = require(__dirname + '/models');

// Global modules
require(__dirname + '/mongoose');

var lol = new irelia({
	endpoint: 'http://prod.api.pvp.net/api/lol/',
	key: config.api.beta_key,
	debug: config.debug
});

// Models

mongoose.model('Summoner', models.summoner);
mongoose.model('Matches', models.matches);

// Schemas

var Summoner = mongoose.model('Summoner');
var Matches = mongoose.model('Matches');


module.exports.update = function (region, name, callback){

	name = name.toLowerCase();
	region = region.toLowerCase();

	async.waterfall([
		
		function (callback){
			
			lol.getSummonerByName(region, name, function (err, _summoner){

				if(err){

					callback(err);

				} else if(_summoner){

					_summoner = _summoner[name];

					Summoner.getByRegionAndName(region, name, function (err, summoner){

						if(err){
							callback(err);
						} else if (summoner){

							Summoner.updateById(summoner._id, {
								region: _summoner.region,
								name: _summoner.name,
								level: _summoner.summonerLevel,
								summonerId: _summoner.id,
								icon: _summoner.profileIconId
							}, function (err){
								if(err){
									callback(err);
								} else {
									callback(null, _summoner);
								}
							});

						} else{

							Summoner.create({
								region: _summoner.region,
								name: _summoner.name,
								level: _summoner.summonerLevel,
								summonerId: _summoner.id,
								icon: _summoner.profileIconId
							}, function (err, summoner){

								if(err){
									callback(err);
								} else {
									callback(null, _summoner);
								}

							});

						}

					});

				} else {
					callback('Unknown error');
				}

			});

		}, function (summoner, callback){

			lol.getSummaryStatsBySummonerId(region, summoner[name].id, function (err, stats){

				if(err){
				
					callback(err);
				
				} else if(stats) {

					console.log(stats);
					
					// TODO -> Return in callback or directly add to db?

					callback(null, summoner);

				} else{
					callback('Unknown error');
				}

			});

		}, function (summoner, callback) {

			lol.getLeagueBySummonerId(region, summoner[name].id, function(err, league){

				if(err){
				
					callback(err);
				
				} else if(league) {

					// TODO -> Add to db

					console.log(league);

					callback(null, summoner);

				} else{
					callback('Unknown error');
				}

			});

		}, function (summoner, callback) {

			lol.getRankedStatsBySummonerId(region, summoner[name].id, 'SEASON4', function(err, ranked){

				if(err){
					if(err.status){
						
					}
					callback(err);
				
				} else if(ranked) {

					// TODO -> Add to db

					console.log(ranked)

					callback(null, summoner);

				} else{
					callback('Unknown error');
				}

			});

		}, function (summoner, callback){

			lol.getRecentGamesBySummonerId(region, summoner[name].id, function(err, games){

				if(err){
				
					callback(err);
				
				} else if(games) {

					// TODO -> Add to db

					console.log(games);

					callback(null, summoner);

				} else{
					callback('Unknown error');
				}

			});

		}, function (summoner, callback){

			lol.getMasteriesBySummonerId(region, summoner[name].id, function(err, maestries){

				if(err){
				
					callback(err);
				
				} else if(maestries) {

					// TODO -> Add to db

					console.log(maestries);

					callback(null, summoner);

				} else{
					callback('Unknown error');
				}

			});

		}, function (summoner, callback){

			lol.getRunesBySummonerId(region, summoner[name].id, function(err, runes){

				if(err){
				
					callback(err);
				
				} else if(runes) {

					// TODO -> Add to db

					console.log(runes);

					callback(null, summoner);

				} else{
					callback('Unknown error');
				}

			});

		}, function (summoner, callback){

			lol.getTeamsBySummonerId(region, summoner[name].id, function(err, teams){

				if(err){
				
					callback(err);
				
				} else if(teams) {

					// TODO -> Add to db

					console.log(teams)

					callback(null, summoner);

				} else{
					callback('Unknown error');
				}

			});

		}

	], function (err){
	
		callback(err);
	
	});

};

module.exports.get = function (region, summoner) {

};