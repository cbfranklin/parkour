var bunyan = require('bunyan');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/parkour", {
    native_parser: true
});

var toad = '    ████████\n   ███░░▓▓▓▓███\n   █░░░░▓▓▓▓░░█\n  █░░░░▓▓▓▓▓▓░░█\n ██░░░▓▓░░░░▓▓░██\n █▓▓▓▓▓░░░░░░▓▓▓█\n █▓░░▓▓░░░░░░▓▓▓█\n █░░░░▓░░░░░░▓▓░█\n █░░░░▓▓░░░░▓▓░░█\n █▓░░▓▓▓▓▓▓▓▓▓░░█\n █▓▓▓████████▓▓░█\n  ███░░█░░█░░███\n   █░░░█░░█░░░█\n   █░░░░░░░░░░█\n    █░░░░░░░░█\n     ████████\n';

var log = new bunyan({
    name: 'parkour',
    streams: [{
        path: 'log.log'
    }, {
        stream: process.stdout
    }]
});


console.log(toad, '     START!')
console.log('===================================================')

var Converter = require("csvtojson").Converter;

var locationsConverter = new Converter({});
locationsConverter.fromFile("csv/locations.CSV", function(err, result) {
    db.createCollection('locations')
    db.collection('locations').insert(result, function(){
        if(err) throw err;
        if(result) console.log('locations added')
    })

});

var signsConverter = new Converter({});
signsConverter.fromFile("csv/signs.CSV", function(err, result) {
    db.createCollection('signs')
    db.collection('signs').insert(result, function(){
        if(err) throw err;
        if(result) console.log('signs added'); return;
    })
});
