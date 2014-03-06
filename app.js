// JS CORE Prototype mod

Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};


// Modules

var async = require('async');
var express = require('express');
var frame = require(__dirname + '/lib/frame');
var Lollib = require('irelia');
var web = require(__dirname + '/lib/web');
var webshot = require('webshot');

// Config

var config = require(__dirname + '/config.json');

// Global modules

require(__dirname + '/lib/redis');

var app = express();

// App Config

// Static Settings

app.use('/static', express.static('static'));

// View Engine Settings

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').renderFile);


// Module init

global.lol = new Lollib({
	host: 'prod.api.pvp.net',
	path: '/api/lol/',
	secure: true,
	key: config.api.prod_key || config.api.beta_key,
	debug: config.debug
});

var updateChampions = function (){

	lol.getChampions('euw', true, function (err, champions){

		if(err){
			console.log('Champions updater err: ' + err);
		} else if(champions) {
			if(typeof freetoplay !== 'undefined' && typeof champions !== 'undefined' && freetoplay !== champions.champions){
				console.log('Updated champions at: ' + Date.now());
			}

			global.freetoplay = champions.champions;
		}

	});

	lol.getChampions('euw', false, function (err, champions){
		if(err){
			console.log(err);
		} else if(typeof champions !== 'undefined'){
			global.champions = champions.champions;
		}
	});

}

updateChampions();
setInterval(updateChampions, 900000);

// App router

// Modularize each function

app.get('/', function (req, res){
	res.render('index.html', {
		freetoplay: freetoplay
	});
});

app.get('/search', function (req, res){
	res.redirect('/summoner/' + req.query.region + '/' + req.query.summoner);
});

app.get('/champions', web.champions);

app.get('/summoner/:region/:summoner', web.summoner);

app.get('/frame/banner/:region/:summoner', frame.summoner);

app.get('/image/banner/:region/:summoner', function (req, res){

	webshot('http://localhost/frame/banner/'+req.params.region+'/'+req.params.summoner, {
		screenSize: {
			width: 960,
			height: 240
		}

	}, function(err, stream) {

		if(err){
			console.log(err);
			res.send(err);
		} else{

			res.writeHead(200, {
			  'Content-Type': 'image/png'
			});

			stream.on('data', function(data) {
				res.write(data);
			});

			stream.on('end', function (){
				res.end();
			});
		}

	});

});

app.get('/riot.html', function (req, res){
	res.send('4eda04e1-bcb8-4ef8-87d7-7ec9f28018a8');
});

app.listen(config.port);
