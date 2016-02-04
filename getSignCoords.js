//var express = require('express');
//var app = express();
var mongo = require('mongoskin');
//var _ = require('underscore');
var request = require('request');

var db = mongo.db("mongodb://localhost:27017/parkour", {
    native_parser: true
});

db.collection('signs').find({
    'borough': 'K',
    'loc': {
        '$exists': true
    }
}, function(err, resultCursor) {
    function processItem(err, item) {
        if (item === null) {
            return;
        }

        externalAsyncFunction(item, function(err) {
            resultCursor.nextObject(processItem);
        });

    }

    resultCursor.nextObject(processItem);
});

function externalAsyncFunction(sign, callback) {
    //console.log(segment)
    if (sign) {
        //get location by id
        db.collection('locations').findOne({
            "id": sign.segment_id
        }, function(err, location) {

            var street = location.street;
            var number = sign.street_number;
            var borough = boroughify(sign.borough);

            var apiRoot = 'http://localhost/nominatim/search/';
            var req = apiRoot + encodeURIComponent(number) + '%20' + encodeURIComponent(street) + '%20' + encodeURIComponent(borough) + '%20New%20York%20City' + '?format=json';
            console.log('\n' + number + ' ' + street);
            console.log(req)
            request(req, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var json = JSON.parse(body)
                    if (json[0]) {
                        var lat = parseFloat(json[0].lat);
                        var lon = parseFloat(json[0].lon);
                        console.log('LAT: ' + lat)
                        console.log('LON: ' + lon)
                        sign.loc = {
                            'type': 'Point',
                            'coordinates': [lon, lat]
                        }
                        db.collection('signs').save(sign)
                        callback()
                    } else {
                        console.log('NO RESULT')
                        callback()
                    }
                }
            })
        })
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