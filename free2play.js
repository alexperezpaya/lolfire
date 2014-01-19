require(__dirname + '/lib/redis');

var async = require('async');
var config = require(__dirname + '/config.json');
var Lollib = require('irelia');

// Irelia init

var lol = new Lollib({
	endpoint: 'http://prod.api.pvp.net/api/lol/',
	key: config.api.beta_key,
	debug: config.debug
});

// Redis data updater

lol.getChampions('euw', true, function (err, champions){

});