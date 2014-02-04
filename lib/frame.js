http://prod.api.pvp.net/api/lol/euw/v1.1/summoner/by-name/snowpinkman?api_key=94f44207-a683-4b27-a7da-790a3ef66c6c	
	var async = require('async');
	var render = require(__dirname + '/render');
	
	var romans = {
		"I": 1,
		"II": 2,
		"III": 3,
		"IV": 4,
		"V": 5
	};


	module.exports.summoner = function (req, res){
			
		req.params.summoner = req.params.summoner.replace(/\s/g, '').toLowerCase();

		async.waterfall([

			function (callback){
				
				// Get id from redis cache :P if no search it and add it

				lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){
					//var summoner = summoner[req.params.summoner];
					if (err){
						
						if(err.status){
							if(err.status.code == 429){
								callback(err.status.message);
							} else if(err.status.code == 404){
								callback('Summoner not found');
							} else if(err.status.code == 500){
								callback(err.status.message);
							} else {
								callback(err.status.message);
							}
						} else {
							callback(err);
						}

					} else {

						if(summoner){
							
							callback(null, summoner);

						} else{
							callback('Summoner not found');
						}
					}

				});

			}, function (summoner, callback){

				var summoner = summoner[req.params.summoner.replace(' ', '')];

				lol.getLeagueBySummonerId(req.params.region, summoner.id, function (err, leagues){

					if (err){
								
						if(err.status){
							if(err.status.code == 429){
								callback(err.status.message);
							} else if(err.status.code == 404){
								callback(null, summoner, {});
							} else if(err.status.code == 500){
								callback(err.status.message);
							} else {
								callback(err.status.message);
							}
						} else {
							callback(err);
						}

					} else{

						if(leagues){

							var league = {};

							league.name = leagues[0].name;
							league.tier = leagues[0].tier;

							async.map(leagues[0].entries, function (entry, callback){

								if(entry.playerOrTeamId == summoner.id.toString()){
									league.data = entry;
									league.data.numRank = romans[entry.rank];
								}

								return callback();

							}, function (){
								callback(null, summoner, league);
							});

						} else{
							callback('League not found');
						}

					}

				});
			}

		], function (err, summoner, ranked_stats){

			if(err){
				res.send('<h1>'+err+'</h1>');
			} else{

				// USE EJS TO RENDER SHOT WITH PARAMETERS;

				var code = render.bannerProfile({
					ranked_stats: ranked_stats,
					summoner: summoner,
					region: lol.regions[req.params.region]
				});

				res.send(code);
			}

		});
	}