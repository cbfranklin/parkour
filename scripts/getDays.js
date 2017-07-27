//var express = require('express');
//var app = express();
var mongo = require('mongoskin');
//var _ = require('underscore');
var request = require('request');

var db = mongo.db("mongodb://localhost:27017/parkour", {
    native_parser: true
});

var apiRoot = 'http://192.168.33.10/nominatim/search/';

db.collection('signs').find({
    'borough': 'K'
}, function(err, resultCursor) {
    function processItem(err, item) {
        if (item === null) {
            return;
        }
        setImmediate(externalAsyncFunction, item, function() {
            resultCursor.nextObject(processItem);
        });
        // externalAsyncFunction(item, function(err) {
        //     resultCursor.nextObject(processItem);
        // });

    }

    resultCursor.nextObject(processItem);
});

function externalAsyncFunction(sign, callback) {
    //console.log(segment)
    if (sign) {
        if (sign.text.indexOf("BROOM") > -1) {
            console.log(sign.text)
            var dayPat = /(MON|TUES?|WEDNES|WEDS?|THURS?|FRI|SAT|SUN)(DAY)?/ig;
            var dayFrag = sign.text.match(dayPat);
            console.log('dayFrag', dayFrag)
            var day = [];
            if (sign.text.indexOf('EXCEPT') === -1) {
                for (var f in dayFrag) {
                    if (dayFrag[f].search(/mon/i) > -1) {
                        day.push('Monday');
                    }
                    if (dayFrag[f].search(/tue/i) > -1) {
                        day.push('Tuesday');
                    }
                    if (dayFrag[f].search(/wed/i) > -1) {
                        day.push('Wednesday');
                    }
                    if (dayFrag[f].search(/thur/i) > -1) {
                        day.push('Thursday');
                    }
                    if (dayFrag[f].search(/fri/i) > -1) {
                        day.push('Friday');
                    }
                    if (dayFrag[f].search(/sat/i) > -1) {
                        day.push('Saturday');
                    }
                    if (dayFrag[f].search(/sun/i) > -1) {
                        day.push('Sunday');
                    }
                }
            }
            console.log(day);
            sign.day = day;
            db.collection('signs').save(sign);
            callback();
        } else {
            callback();
        }

    } else {
        callback();
    }
}
