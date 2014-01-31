
// Module declaration

var async = require('async');
var mongoose = require('mongoose');

// Mongoose objects

var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// Schema structure

var matches = new schema({
	region: String,
	summonerId: Number,
	gameId: Number,
	gameMode: String,
	gameType: String,
	subType: String,
	mapId: Number,
	teamId: Number,
	championId: Number,
	spell1: Number,
	spell2: Number,
	level: Number,
	createDate: Date,
	players: Array,
	stats: Object
});

// Schema extension

matches.statics.create = function (data, callback) {
	var match = new this(data);
	match.save(callback);

};

matches.statics.getBySummonerId = function (region, summonerId, limit, callback){

	if(typeof callback == 'null' || typeof callback == 'undefined' && typeof limit == 'function'){
		var callback = limit;
	}

	if(limit == 0){
		this.findAll({region: region, summonerId: summonerId}).exec(callback);
	} else if(limit){
		this.find({region: region, summonerId: summonerId}).limit(limit).exec(callback);
	} else {
		this.find({region: region, summonerId: summonerId}).exec(callback);
	}

};

module.exports = exports = matches;