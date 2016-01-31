var fs = require('fs')
var bunyan = require('bunyan');
var mongojs = require('mongojs');
var db = mongojs('parkour', ['segments']);


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

var locations;

fs.readFile('json/locations-signs.json', 'utf8', function(err, data) {
    if (err) throw err;
    locations = JSON.parse(data);
    console.log(locations[0])
    db.segments.insert(locations, function(err, doc) {
        if (err) throw err;
    });
});
