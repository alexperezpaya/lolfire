
// Module declaration

var async = require('async');
var mongoose = require('mongoose');

// Mongoose objects

var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// Schema structure

var matches = new schema({
        region: String,
        name: String,
        id: String,
        level: String,
        icon: Number,
        _id: ObjectId
});

// Schema extension

matches.statics.create = function (data, callback) {

};

module.exports = exports = matches;