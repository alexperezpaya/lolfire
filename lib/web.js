	
	var async = require('async');
	var path = require('path');
	
	var romans = {
		"I": 1,
		"II": 2,
		"III": 3,
		"IV": 4,
		"V": 5
	};

	module.exports.summoner = function (req, res){
		
		req.params.summoner = req.params.summoner.toLowerCase();

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
							
							summoner = summoner[req.params.summoner.replace(' ', '')];

							callback(null, summoner);

						} else{
							callback('Summoner not found');
						}
					}

				});

			}, function (summoner, callback){

				lol.getLeagueBySummonerId(req.params.region, summoner.id, function (err, league){

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

						if(league && league[summoner.id]){

							var league = {};

							league.name = league[summoner.id].name;
							league.tier = league[summoner.id].tier;

							async.map(league[summoner.id]['entries'], function (entry){

								if(entry.playerOrTeamId == summoner.id.toString()){
									league.data = entry;
									league.data.numRank = romans[entry.rank];
									return;
								}

							});

							callback(null, summoner, league);

						} else{
							callback('League not found');
						}

					}

				});
			}, function (summoner, league, callback){

				lol.getRecentGamesBySummonerId(req.params.region, summoner.id, function (err, games){

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

					} else if(games){

						callback(null, summoner, league, games);

					} else {
						callback('No games response');
					}

				});
			}

		], function (err, summoner, league, games){

			if(err){
				res.send('<h1>'+err+'</h1>');
			} else{

				res.render(path.normalize(__dirname + '/../views/summoner.html'), {
					league: league,
					summoner: summoner,
					games: games,
					region: lol.regions[req.params.region],
					gametype: lol.gametypes,
					gamemode: lol.gamemode,
					gamesubtype: {
						'RANKED_SOLO_5x5': 'Ranked',
						'NORMAL': 'Normal'
					}
				});

			}

		});
	}

	module.exports.champions = function (req, res){

		if(req.query.free){
			var free = true;
		} else{
			var free = false;
		}

		res.render(path.normalize(__dirname + '/../views/champions.html'), {
			champions: (free) ? freetoplay : champions
		});

	};