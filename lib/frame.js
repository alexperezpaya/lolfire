	
	var async = require('async');
	var render = require(__dirname + '/render');
	
	module.exports.summoner = function (req, res){
		async.waterfall([

			function (callback){
				
				// Get id from redis cache :P if no search it and add it

				redis.hgetall('summoner:'+req.params.region+':'+req.params.summoner, function (err, summoner){

					if(err){
						
						lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){
							
							if(summoner){
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'id', summoner.id);
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'profileIconId', summoner.profileIconId);
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'summonerLevel', summoner.summonerLevel);
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'name', summoner.name);
								
								callback(err, summoner);

							} else{
								res.send('Summoner doesn\'t exist');
								return;
							}
						
						});
					
					} else if(summoner){
					
						callback(null, summoner);
					
					} else{

						lol.getSummonerByName(req.params.region, req.params.summoner, function (err, summoner){
							
							if(summoner){
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'id', summoner.id);
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'profileIconId', summoner.profileIconId);
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'summonerLevel', summoner.summonerLevel);
								redis.hset('summoner:'+req.params.region+':'+req.params.summoner, 'name', summoner.name);
								
								callback(err, summoner);

							} else{
								res.send('Summoner doesn\'t exist');
								return;
							}
						
						});

					}
				});

			}, function (summoner, callback){
				
				lol.getSummaryStatsBySummonerId(req.params.region, summoner.id, function (err, stats){

					callback(err, stats, summoner);

				});
			}

		], function (err, stats, summoner){

			if(err){
				console.log(err);
				res.send(err);
			}

			// USE EJS TO RENDER SHOT WITH PARAMETERS;

			var code = render.bannerProfile({
				stats: stats,
				summoner: summoner,
				region: lol.regions[req.params.region]
			});

			res.send(code);

		});
	}