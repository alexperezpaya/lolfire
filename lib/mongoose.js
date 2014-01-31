
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.database, {
	user: config.mongo.user,
	pass: config.mongo.pass,
	server: {
		socketOptions: {
			keepAlive: 1
		}
	},
	replset: {
		socketOptions: {
			keepAlive: 1
		}
	}
});

global.mongoose = mongoose;