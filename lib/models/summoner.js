
// Module declaration

var async = require('async');
var mongoose = require('mongoose');

// Mongoose objects

var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// Schema structure

var summoner = new schema({
        name: String,
        riot_id: Number,
        level: String,
        icon: Number,
        _id: ObjectId
});

// Schema functions

summoner.statics.create = function (data, callback) {
        
        var insert = new this();

        insert.region = data.region;
        insert.name = data.name;
        insert.level = data.level;
        insert.summonerId = data.id;
        insert.icon = data.icon;

        insert.save(callback);

};

summoner.statics.remove = function (id, callback){

        this.findOne({_id: id}).remove().exec(callback);

};

summoner.statics.updateById = function (id, data, callback){

        this.findById(id, function (err, summoner){

                async.map(Object.keys(data), function (key, cb){

                        summoner[key] = data[key];

                        cb();

                }, function (err){
                
                        summoner.save(callback);
                
                });

        });

};

summoner.statics.getByRegionAndName = function (region, name, callback){

        this.findOne({region: region, name: name}).exec(callback);

};

summoner.statics.getByRegionAndSummonerId = function (region, id, callback){

        this.findOne({region: data.region, summonerId: id}).exec(callback);

};

summoner.statics.getById = function (id, callback) {

        this.findById(id, callback);

}

summoner.statics.list = function (callback){

        this.find({}).all().exec(callback);

};

summoner.statics.count = function(callback){
        this.count().exec(callback);
}

module.exports = exports = summoner;