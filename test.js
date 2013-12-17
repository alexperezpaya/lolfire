var Lollib = require('irelia');

var lol = new Lollib({
	endpoint: 'http://prod.api.pvp.net/api/lol/',
	key: '94f44207-a683-4b27-a7da-790a3ef66c6c',
	debug: true
});

/*lol.getSummonerByName('euw', 'NSZombie', function (err, res){

	console.log(err, res);

});

lol.getChampions('euw', 1, function (err, res) {

	console.log(err, res);

});*/

/*lol.getRecentGamesBySummonerId('euw', 33682129, function (err, res) {
	console.log(err, res);
});*/

lol.getSummaryStatsBySummonerId('euw', 33682129, 'SEASON3', function (err, res) {
	console.log(err, res);
});