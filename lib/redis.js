
    var redisClient = require('redis');
    var client = redisClient.createClient();

    client.on('error', function (err) {
        console.log('Redis error ' + err);
    });

    client.on('end', function (){
        client = redisClient.createClient();
    });

    global.redis = client;