var express = require('express');
var app = express();
var mongo = require('mongoskin');
var _ = require('underscore');

var db = mongo.db("mongodb://localhost:27017/parkour", {
    native_parser: true
});
var locations, signs;
db.bind('signs');
db.bind('locations');
db.locations.find().toArray(function(err, items) {
    db.close();
    locations = items;
    console.log('locations loaded')
    db.signs.find().toArray(function(err, items2) {
        db.close();
        signs = items2;
        var signsLength = signs.length;
        console.log('signsLength',signsLength)
        console.log('signs loaded')
        for (i in signs) {
            var segment = signs[i].segment_id;
            var index = findWithAttr(locations, 'id', segment);
            if (index > -1) {
                locations[index].signs = [];
                locations[index].signs.push(signs[i])
                console.log(signs.length,parseFloat(i))
                //console.log(i, 'added sign', signs[i].sign_id, 'to segment:', locations[index].id)
                if (i === signs.length) {
                    console.log('DONE')
                    fs.writeFile('locations_and_signs.json', JSON.stringify(locations), function(err) {
                        if (err) throw err;
                        console.log('It\'s saved!');
                    });
                }
            }
            else{
            	console.log(i,'not found.')
            }

        }
    });
});

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
}



//app.use('/', express.static(__dirname + '/html'));


/*app.get('/search', function(req, res) {
	
});*/

//app.listen(process.env.PORT || 3000);
