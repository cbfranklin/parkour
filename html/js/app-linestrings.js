var map;
$(function() {
  map = L.map('map', {loadingControl: true}).setView([
    40.713087, -73.9441479
  ], 16);
  L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //L.tileLayer('http://localhost/osm_tiles/{id}/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    //minZoom: 13,
    id: 'map'

  }).addTo(map);
  var linesLayer = new L.LayerGroup();

  var searchLayer = L.layerGroup().addTo(map);
  // //... adding data in searchLayer ...
  map.addControl(new L.Control.Search({layer: searchLayer}));

  function getLines() {
    var bounds = map.getBounds()
    console.log(bounds)
    // var obj = {
    //   'southWestLng': bounds._southWest.lng,
    //   'southWestLat': bounds._southWest.lat,
    //   'northEastLng': bounds._northEast.lng,
    //   'northEastLat': bounds._northEast.lat
    // };
    //obj = $.param(obj);
    //var req = 'lines?' + obj;
    var req = 'lines';

    $.getJSON(req, function(data) {
      console.log(data)
      linesLayer.clearLayers();
      for (var i in data) {
        //console.log(data[i])
        var segment_id = data[i].id;
        L.geoJson(data[i].loc, {
          //   style: function(feature) {
          //     return {stroke: true, color: "red", weight: 5};
          //   },
          onEachFeature: function(feature, layer) {
            console.log(segment_id, feature.properties.name)
            layer.bindPopup(segment_id + feature.properties.name);
          }
        }).addTo(linesLayer);
      }
      map.addLayer(linesLayer);
    });
  }

  getLines()

  // map.on('moveend', function() {
  //   getLines();
  // });
})
