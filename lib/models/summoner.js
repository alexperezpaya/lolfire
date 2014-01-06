
// Module declaration

var async = require('async');
var mongoose = require('mongoose');

// Mongoose objects

var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// Schema structure

var summoner = new schema({
        region: String,
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
        insert.riot_id = data.id;
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

summoner.statics.getByRegionAndName = function (data, callback){

        this.findOne({region: data.region, name: data.name}).exec(callback);

};

summoner.statics.getByRegionAndRiotId = function (data, callback){

        this.findOne({region: data.region, riot_id: data.id}).exec(callback);

};

summoner.statics.getById = function (id, callback) {

        this.findById(id, callback);

}

summoner.statics.list = function (callback){

        this.find({}).exec(callback);

};

module.exports = exports = summoner;