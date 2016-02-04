var map;
$(function() {
    map = L.map('map').setView([-73.9441479, 40.713087], 13);
    
    L.tileLayer('http://localhost/osm_tiles/{id}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'map'
    }).addTo(map);

    getSigns()

    function getSigns() {
        var bounds = map.getBounds()
        console.log(bounds)
        var obj = {
            'southWestLng': bounds._southWest.lng,
            'southWestLat': bounds._southWest.lat,
            'northEastLng': bounds._northEast.lng,
            'northEastLat': bounds._northEast.lat
        }
        obj = $.param(obj)
        var req = 'signs?' + obj;


        $.getJSON(req, function(data) {
            console.log(data)
            for (i in data) {
                var latlng = [data[i].loc.coordinates[0], data[i].loc.coordinates[1]];
                L.marker(latlng).addTo(map);
            }
        });
    }

    map.on('moveend', function() {
        getSigns();
    });
})