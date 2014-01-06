var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

module.exports.bannerProfile = function (options) {

	var data = fs.readFileSync(path.normalize(__dirname  + '/../views/bannerProfile.html'), {encoding: 'utf8'});
	data = ejs.render(data, options);
	return data;
};