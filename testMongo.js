var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/parkour', {
    native_parser: true
});

db.collection('signs').find({
        'loc': {
            '$geoWithin': {
                '$box': [
                    [req.params.southWest],
                    [req.params.northEast]
                ]
            }
        },
        'text': {
            '$regex': 'BROOM'
        },
        'borough': 'K'
    }).toArray(function(err,items){
    	console.log(items)
    	db.close();
    });