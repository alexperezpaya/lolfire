	
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
		async.waterfall([

			function (callback){
				
				// Get id from redis cache :P if no search it and add it

				redis.hgetall('summoner:'+req.params.region+':'+req.params.summoner, function (err, summoner){

					if(err){
						
						lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){
								
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
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'id', summoner.id);
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'profileIconId', summoner.profileIconId);
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'summonerLevel', summoner.summonerLevel);
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'name', summoner.name);
									
									callback(err, summoner);

								} else{
									callback('Summoner not found');
								}
							}
						});
					
					} else if(summoner){
					
						callback(null, summoner);
					
					} else{

						lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){
								
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
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'id', summoner.id);
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'profileIconId', summoner.profileIconId);
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'summonerLevel', summoner.summonerLevel);
									redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'name', summoner.name);
									
									callback(err, summoner);

								} else{
									callback('Summoner not found');
								}
							}

						});

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

						if(league){
							var ranked_stats = {};

							ranked_stats.name = league[summoner.id].name;
							ranked_stats.tier = league[summoner.id].tier;

							async.map(league[summoner.id]['entries'], function (entry){

								if(entry.playerOrTeamId == summoner.id.toString()){
									ranked_stats.data = entry;
									ranked_stats.data.numRank = romans[entry.rank];
									return;
								}

							});

							callback(null, summoner, ranked_stats);

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

				res.render(path.normalize(__dirname + '/../views/summoner.html'), {
					ranked_stats: ranked_stats,
					summoner: summoner,
					region: lol.regions[req.params.region]
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

		lol.getChampions('euw', free, function (err, champions){
			res.render(path.normalize(__dirname + '/../views/champions.html'), {
				champions: champions.champions
			});
		});

	};