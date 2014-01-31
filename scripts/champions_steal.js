// Champion steal

// LOLKING STEAL ICONS SCRIPT BIATCH

//http://lkimg.zamimg.com/shared/riot/images/profile_icons/profileIcon602.jpg Endpoint
// http://lkimg.zamimg.com/shared/riot/images/champions/254.png

var async = require('async');
var fs = require('fs');
var path = require('path');
var request = require('request');

request.get('https://prod.api.pvp.net/api/lol/euw/v1.1/champion?freeToPlay=false&api_key=94f44207-a683-4b27-a7da-790a3ef66c6c', function (err, res, body){

	async.map(JSON.parse(body).champions, function (champion, callback){
 		var n = champion.id;
		var imageStream = request.get('http://lkimg.zamimg.com/shared/riot/images/champions/'+n+'.png');
		var writeStream = fs.createWriteStream(path.normalize(__dirname + '/static/champions/'+n+'.png'));
		imageStream.pipe(writeStream);
		
		writeStream.on('finish', function (){
			callback(null);
			imageStream.end();
			writeStream.close();

			console.log('Got: ' + champion.name + ' with id: ' + champion.id);

		});

		writeStream.on('error', function (err){
			callback(err);
			imageStream.end();
			writeStream.close();
		});

		imageStream.on('close', function (){
			callback(null);
			imageStream.end();
			writeStream.close();
		});

		imageStream.on('error', function (err){
			callback(err);
			imageStream.end();
			writeStream.close();
		});

	}, function (err){
		console.log(err);
	});

});

// http://lkimg.zamimg.com/shared/riot/images/champions/75.png -> champions