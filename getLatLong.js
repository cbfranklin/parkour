//var express = require('express');
//var app = express();
var mongo = require('mongoskin');
//var _ = require('underscore');
var request = require('request');

var db = mongo.db("mongodb://localhost:27017/parkour", {
    native_parser: true
});

var segments;

db.bind('segments');

db.segments.find({}, function(err, resultCursor) {
    function processItem(err, item) {
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
            var apiRoot = 'http://localhost/nominatim/search/';
            var req = apiRoot + number + '%20' + street + '?format=json';
            console.log('GET ' + req)
            request(req, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(response.statusCode)
                    var json = JSON.parse(body)
                    if (json[0]) {
                        console.log('LAT: ' + json[0].lat)
                        console.log('LON: ' + json[0].lon)
                        item.
                        db.segments.save(item);
                    }
                    callback()
                }
            })
        }
    } else {
        callback()
    }
    //var street = encodeURIComponent(segment.street);
    //var number = encodeURIComponent(segment.signs[m].street_number);
    //var apiRoot = 'http://localhost/nominatim/search/';
    //var req = apiRoot + number + '%20' + street + '?format=json';
    //console.log('GET' + req)
    /*request(req, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
        callback()
      }
    })*/
}
/*function getLatLong(){
    segments(0)
    function repeatSegments(n){
        if(segments.signs){
            signs(0)
            function repeatSigns(m){
                var street = encodeURIComponent(segments[n].street);
                var number = encodeURIComponent(segments[n].signs[m].street_number);
                var apiRoot = 'http://localhost/nominatim/search/';
                var req = apiRoot + number + '%20' + street + '?format=json';
                console.log('GET' + req)
                request(req, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                    console.log(body)
                    if(m < signs.length){
                        repeatSigns(m+1)
                    }
                  }
                })
            }
        }
      if(n < segments.length){
        repeatSegments
      }  
    }
}*/