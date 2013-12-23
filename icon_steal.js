// LOLKING STEAL ICONS SCRIPT BIATCH

//http://lkimg.zamimg.com/shared/riot/images/profile_icons/profileIcon602.jpg Endpoint

var async = require('async');
var fs = require('fs');
var path = require('path');
var request = require('request');

async.timesSeries(603, function (n, callback){

	var imageStream = request.get('http://lkimg.zamimg.com/shared/riot/images/profile_icons/profileIcon'+n+'.jpg');
	var writeStream = fs.createWriteStream(path.normalize(__dirname + '/static/icons/'+n+'.jpg'));
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