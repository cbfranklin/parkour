const mongo = require('mongoskin');
const geoTools = require('geojson-tools')

const db = mongo.db("mongodb://localhost:27017/parkour", {native_parser: true});

const locations = db.collection('locations')

//for all locations in Brooklyn
locations.find({
  'borough': 'K'
}, function(err, locationCursor) {
  processLocation = (err, item) => {
    if (item === null) {
      return;
    }
    // apply returned loc obj to each location doc
    getSignsForLocation(item, function(err, loc) {
      item.loc = loc;
      locations.save(item)
      locationCursor.nextObject(processLocation);
    });
  }
  locationCursor.nextObject(processLocation);
});
// get all relevant signs for location
getSignsForLocation = (location, callback) => {

  const signs = db.collection('signs');

  signs.find({
    'segment_id': location.id,
    'loc': {
      '$exists': true
    }
  }).toArray(function(err, array) {
    if (array) {
      generateLineStrings(array, callback)
    } else {
      callback();
    }
  });
}
// split signs into odd/even sides, create linestrings from sign points, return loc obj
generateLineStrings = (signs, callback) => {
  // sort each side of the street, create linestring from associated geo points
  let even = geoTools.toGeoJSON(
    signs
      .filter(streetNumberIsEven)
      .sort(byStreetNumber)
      .map(streetNumberLocToArray)
    , 'linestring');
  let odd = geoTools.toGeoJSON(
    signs
      .filter(streetNumberIsOdd)
      .sort(byStreetNumber)
      .map(streetNumberLocToArray)
    , 'linestring');

  // var even = signs.filter(streetNumberIsEven);
  // let odd = signs.filter(streetNumberIsOdd);
  //
  // odd = odd.sort(byStreetNumber);
  // even = even.sort(byStreetNumber);
  //
  // even = even.map(streetNumberLocToArray);
  // odd = odd.map(streetNumberLocToArray);
  //
  // even = geoTools.toGeoJSON(even, 'linestring')
  // odd = geoTools.toGeoJSON(odd, 'linestring')

  // label each obj
  even.properties = {
    name: "even"
  }
  odd.properties = {
    name: "odd"
  }

  // create loc obj
  const loc = {
    type: "FeatureCollection",
    features: [even, odd]
  }
  
  // callback
  callback(null, loc)
}

streetNumberIsEven = (item) => {
  return item.street_number % 2 === 0
}
streetNumberIsOdd = (item) => {
  return item.street_number % 2 !== 0
}

byStreetNumber = (a, b) => {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}

streetNumberLocToArray = (item, i) => {
  if (item.loc) {
    return geoTools.toArray(item.loc)
  } else {
    return false
  }
}
