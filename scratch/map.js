var segment = {},
    path;

$(function() {
    $('#doIt').on('click', doIt);
});

function doIt() {
    var streetA = $('#streetA').val().replace(/ /g, '+');
    var streetB = $('#streetB').val().replace(/ /g, '+');
    var streetC = $('#streetC').val().replace(/ /g, '+');
    var borough = $('#borough').val().replace(/ /g, '+');

    $.when(queryOrigin(), queryDestination()).done(function() {

    	segment.center = {
    		lat: ( segment.destination.lat - segment.origin.lat ) / 2,
    		lng: (segment.destination.lng - segment.origin.lng) / 2
    	}

        var myOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            //center: new google.maps.LatLng(40.632165, -73.984231),
            //zoom: 17
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        var poly = new google.maps.Polyline({
            map: map
        });
        path = new google.maps.MVCArray();

        // init directions service
        var dirService = new google.maps.DirectionsService();
        var dirRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        dirRenderer.setMap(map);

        // highlight a street
        var request = {
            origin: segment.origin.string,
            destination: segment.destination.string,
            travelMode: google.maps.TravelMode.DRIVING
        };
        dirService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                dirRenderer.setDirections(result);
                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                    path.push(result.routes[0].overview_path[i]);
                }
                poly.setPath(path);
            }
        });

    });

    function queryOrigin() {
        var query = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + streetA + '+and+' + streetB + '+' + borough + '+ny' + '&sensor=false';
        console.log(query)
        return $.ajax({
            url: query,
        }).done(function(data) {
            data = data.results;
            segment.origin = {
            	lat: data[0].geometry.location.lat,
            	lng: data[0].geometry.location.lng
            };
            segment.origin.string = segment.origin.lat + ',' + segment.origin.lng;
        });
    };

    function queryDestination() {
        var query = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + streetA + '+and+' + streetC + '+' + borough + '+ny' + '&sensor=false';
        console.log(query)
        return $.ajax({
            url: query,
        }).done(function(data) {
            data = data.results;
            segment.destination = {
            	lat: data[0].geometry.location.lat,
            	lng: data[0].geometry.location.lng
            }
            segment.destination.string = segment.destination.lat + ',' + segment.destination.lng;
        });
    };
}