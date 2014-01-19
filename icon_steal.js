// LOLKING STEAL ICONS SCRIPT BIATCH

//http://lkimg.zamimg.com/shared/riot/images/profile_icons/profileIcon602.jpg Endpoint
// http://lkimg.zamimg.com/shared/riot/images/champions/254.png

var async = require('async');
var fs = require('fs');
var path = require('path');
var request = require('request');

async.timesSeries(603, function (n, callback){

	var imageStream = request.get('http://lkimg.zamimg.com/shared/riot/images/champions/'+n+'.png');
	var writeStream = fs.createWriteStream(path.normalize(__dirname + '/static/champions/'+n+'.png'));
	imageStream.pipe(writeStream);
	
	writeStream.on('finish', function (){
		callback(null);
		imageStream.end();
		writeStream.close();

		console.log('Got:'+n);

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
	if(err){
		console.log(err);
	}
});

// http://lkimg.zamimg.com/shared/riot/images/champions/75.png -> champions