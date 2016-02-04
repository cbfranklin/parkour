var request = require('request');

var req = 'http://localhost/nominatim/search/103%20MORRIS%20PARK%20AVENUE?format=json'

request(req, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(response.statusCode)
    console.log(body)
    callback()
  }
})

function callback(){
	console.log(callback)
}