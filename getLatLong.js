//var express = require('express');
//var app = express();
var mongo = require('mongoskin');
//var _ = require('underscore');
var request = require('request');

var stats = {
    total: 0,
    success: 0,
    error: 0
};

var db = mongo.db("mongodb://localhost:27017/parkour", {
    native_parser: true
});

var apiRoot = 'http://192.168.33.10/nominatim/search/';

var segments;

db.bind('segments');

db.segments.find({
    'borough': 'K'
}, function(err, resultCursor) {
    function processItem(err, item) {
        console.log(stats);
        if (item === null) {
            return; // All done!
        }

        externalAsyncFunction(item, function(err) {
            resultCursor.nextObject(processItem);
        });

    }

    resultCursor.nextObject(processItem);
});

function externalAsyncFunction(segment, callback) {
    //console.log(segment)
    if (segment.signs) {
        for (i in segment.signs) {
            var street = encodeURIComponent(segment.street);
            var number = encodeURIComponent(segment.signs[i].street_number);
            var borough = boroughify(segment.signs[i].borough);
            var req = apiRoot + number + '%20' + street + '%20' + borough + '?format=json';
            console.log('GET ' + req)
            request(req, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(response.statusCode)
                    var json = JSON.parse(body);
                    //console.log(json);
                    if (json[0] && segment.signs[i]) {
                        console.log('LAT: ' + json[0].lat);
                        console.log('LON: ' + json[0].lon);
                        segment.signs[i].location = {
                                type: 'Point',
                                coordinates: [json[0].lon, json[0].lat]
                        };
                        //delete segment.signs[i].loc.lat = json[0].lat;
                        //delete segment.signs[i].loc.lng = json[0].lon;

                        db.segments.save(segment);

                    };
                    stats.success++
                        stats.total++
                        callback();
                } else {
                    console.log('error');
                    stats.error++;
                    stats.total++
                        callback();
                }
            })
        }
        //db.segments.save(segment);
    } else {
        callback()
    }
}

function boroughify(b) {
    if (b === 'B') {
        return 'Bronx'
    }
    if (b === 'S') {
        return 'Staten Island'
    }
    if (b === 'N') {
        return "Manhattan"
    }
    if (b === 'Q') {
        return "Queens"
    }
    if (b === 'K') {
        return "Brooklyn"
    }
}
