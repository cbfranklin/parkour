//var express = require('express');
//var app = express();
var mongo = require('mongoskin');
//var _ = require('underscore');
var request = require('request');

var db = mongo.db("mongodb://localhost:27017/parkour", {native_parser: true});

var apiRoot = 'http://192.168.33.10/nominatim/search/';

db.collection('signs').find({
  'borough': 'K'
  // 'loc': {'$exists': false}
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
      console.log('\n', location.street, '\n');
      var number = sign.street_number;
      var borough = boroughify(sign.borough);
      var numberStreet = /\d+\W*[a-z]*/;
      if (numberStreet.test(street)) {
        street = suffixify(street);
      }
      if (street.indexOf("*") > -1) {
        street = serviceRoadify(street);
      }
      var req = apiRoot + encodeURIComponent(number) + '%20' + encodeURIComponent(street) + '%20' + encodeURIComponent(borough) + '%20New%20York%20City' + '?format=json';
      console.log('\n' + number + ' ' + street);
      console.log(req);
      request(req, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var json = JSON.parse(body);
          if (json[0]) {
            var lat = parseFloat(json[0].lat);
            var lon = parseFloat(json[0].lon);
            console.log('LAT: ' + lat);
            console.log('LON: ' + lon);
            sign.loc = {
              'type': 'Point',
              'coordinates': [lon, lat]
            };
            db.collection('signs').save(sign);
            callback();
          } else {
            console.log('NO RESULT');
            callback();
          }
        }
      });
    });
  } else {
    callback();
  }
}

function boroughify(b) {
  if (b === 'B') {
    return 'Bronx';
  }
  if (b === 'S') {
    return 'Staten Island';
  }
  if (b === 'N') {
    return "Manhattan";
  }
  if (b === 'Q') {
    return "Queens";
  }
  if (b === 'K') {
    return "Brooklyn";
  }
}

function suffixify(a) {
  var numberPat = /\d+/;
  var nonNumberPat = /\D+/g;
  var number = a.replace(nonNumberPat, '');
  //console.log(number)
  var restOfName = a.replace(numberPat, '{{number}}');
  //console.log(restOfName)
  var suffixedNumber = suffix(number);

  function suffix(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  var newName = restOfName.replace("{{number}}", suffixedNumber);
  console.log(newName);
  return newName;
}

function serviceRoadify(street) {
  street.replace(/\*(N|S|E|W) S\/R/, 'Service Road');
}

function inArray(arr, obj) {
  return (arr.indexOf(obj) != -1);
}
