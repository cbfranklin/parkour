//var express = require('express');
//var app = express();
//var mongo = require('mongoskin');
//var _ = require('underscore');
var fs = require('fs')
var bunyan = require('bunyan');


var data = {};


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
    data.locations = result;
    //save every minute
    log.info('LOCATIONS LOADED')
    var signsConverter = new Converter({});
    signsConverter.fromFile("csv/signs.CSV", function(err, result) {
        data.signs = result;
        log.info('SIGNS LOADED');
        matchSignsToLocations(data.locations, data.signs);
    });
});

function matchSignsToLocations(locations, signs) {
    log.info('MATCHING SIGNS TO LOCATIONS')
        //loop through locations
    for (i in locations) {
        var segment = locations[i].id;
        //loop through signs
        for (j in signs) {
            //find signs assigned to this location
            if (signs[j].segment_id === segment) {
                //only add signs that contain BROOM symbol
                if (typeof signs[j].text === 'string') {
                    if (signs[j].text.indexOf('BROOM') > -1) {
                        //check to see if signs array exists
                        if (!locations[i].signs) {
                            locations[i].signs = [];
                        }
                        //prevent duplicate signs, check to see if sign already added to location
                        var signExists = false;
                        for (k in locations[i].signs) {
                            if (locations[i].signs[k].sign_id === signs[j].sign_id) {
                                signExists = true;
                            }
                        }
                        //if sign does not already exist in location
                        if (!signExists) {
                            locations[i].signs.push(signs[j])
                            log.info('Added Sign', signs[j].sign_id, 'to Location', locations[i].id)
                        }
                    }
                }
            }

        }
    }
    //log.info('REMOVING LOCATIONS WITHOUT SIGNS')
        //remove locations that do not have BROOM signs
    /*for (var i = locations.length; i > 0; i--) {
        if (!locations[i].signs) {
            log.info('Removing Location Without Sign:', locations[i].id)
            locations.splice(i, 1)
        }
    }*/
    log.info('SAVING RESULT')
        //save result as JSON
        saveResult()
}

function saveResult(){
    var result = JSON.stringify(data.locations)
    fs.writeFile('result.json', result, function(err) {
        if (err) return log.info(err);
        log.info('SAVED');
        console.log('===================================================')
        console.log(toad, '    FINISH!')
    });
}
