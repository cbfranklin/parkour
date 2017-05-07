var map;
$(function() {
    map = L.map('map',{
        loadingControl: true
    }).setView([40.713087, -73.9441479], 16);
    L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //L.tileLayer('http://localhost/osm_tiles/{id}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        //minZoom: 13,
        id: 'map'
    }).addTo(map);
    var markersLayer = new L.LayerGroup();

    var dayIcons = {
        'monday' : L.divIcon({className: 'icon-day monday'}),
        'tuesday' : L.divIcon({className: 'icon-day tuesday'}),
        'wednesday' : L.divIcon({className: 'icon-day wednesday'}),
        'thursday' : L.divIcon({className: 'icon-day thursday'}),
        'friday' : L.divIcon({className: 'icon-day friday'}),
        'saturday' : L.divIcon({className: 'icon-day saturday'}),
        'sunday' : L.divIcon({className: 'icon-day sunday'}),

        'monday_thursday' : L.divIcon({className: 'icon-day monday_thursday'}),
        'monday_wednesday' : L.divIcon({className: 'icon-day monday_wednesday'}),
        'monday_wednesday_friday' : L.divIcon({className: 'icon-day monday_wednesday_friday'}),
        'monday_friday' : L.divIcon({className: 'icon-day monday_friday'}),
        'tuesday_thursday' : L.divIcon({className: 'icon-day tuesday_thursday'}),
        'tuesday_friday' : L.divIcon({className: 'icon-day tuesday_friday'}),
        'tuesday_thursday_saturday' : L.divIcon({className: 'icon-day tuesday_thursday_saturday'}),
        'monday_tuesday_thursday_friday' : L.divIcon({className: 'icon-day monday_tuesday_thursday_friday'})

    }




    getSigns()

    function getSigns() {
        var bounds = map.getBounds()
        //// console.log(bounds)
        var obj = {
            'southWestLng': bounds._southWest.lng,
            'southWestLat': bounds._southWest.lat,
            'northEastLng': bounds._northEast.lng,
            'northEastLat': bounds._northEast.lat
        };
        obj = $.param(obj);
        var req = 'signs?' + obj;

        $.getJSON(req, function(data) {
            //// console.log(data)
            markersLayer.clearLayers();
            for (var i in data) {
                var sign = data[i];
                var latlng = [data[i].loc.coordinates[1], data[i].loc.coordinates[0]];
                // console.log(sign.day)
                if(sign.day != undefined && sign.day.length > 0 && sign.text && sign.text !== "Curb Line"){
                    var days = sign.day.join('_').toLowerCase();
                    // console.log(sign.text,days,dayIcons[days]);
                    //console.log(latlng,days,dayIcons[days],sign.text)
                    L.marker(latlng, {icon: dayIcons[days]}).bindPopup(sign.text).addTo(markersLayer);
                }
                else{
                    //L.marker(latlng).bindPopup(sign.text).addTo(map);
                }

            }
            map.addLayer(markersLayer);
        });
    }

    map.on('moveend', function() {
        getSigns();
    });
})
