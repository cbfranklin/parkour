var express = require('express');
var app = express();

var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/parkour', {
    native_parser: true
});

app.use('/', express.static(__dirname + '/html'));

app.get('/signs', function(req, res) {
    var southWestLng = parseFloat(req.query.southWestLng);
    var southWestLat = parseFloat(req.query.southWestLat);
    var northEastLng = parseFloat(req.query.northEastLng);
    var northEastLat = parseFloat(req.query.northEastLat);
    console.log(southWestLng, southWestLat, northEastLng, northEastLat)
    db.collection('signs').find({
        'loc': {
            '$geoWithin': {
                '$box': [
                    [southWestLng, southWestLat],
                    [northEastLng, northEastLat]
                ]
            }
        }
        //  'borough': 'K'
    }).toArray(function(err, items) {
        if (items) console.log(items.length)
        res.json(items)
        db.close();
    });
})


app.listen(3000, function() {
    console.log('Listening on Port 3000')
});
