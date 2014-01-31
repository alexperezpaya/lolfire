// Requires redis

require(__dirname + '/lib/redis');

var updateSummoner = require(__dirname + '/lib/summoner').update;

var interval = 1000 * 20;
//				1sec		= 20secs

var update = function () {

	redis.lpop('update_queue', function (err, data){

		if(err){

			console.log(err);

		} else if(data){

			redis.rpush('update_queue', data);

			var __summoner = data.split(':');

			var summoner = __summoner[1];
			var region = __summoner[0];

			__summoner = null;


			updateSummoner(region, summoner, function (err){

				if(err){
					console.log(err);
				}

				redis.set(data + ':update', Date.now());

			});


			// End update

		} else {

			console.log('Empty queue');

		}

	});

}


update();

setInterval(update, interval);