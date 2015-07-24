'use strict';

app.locationsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var locationsViewModel = kendo.observable({
        onShow: function() {
            
            app.mobileApp.showLoading();
            var data = app.data.defaultProvider.data('Location');
            data.get()
            .then(function (success) {
                // make map
                console.log("map next");
                
                var current_location = new google.maps.LatLng(38.89394, -121.65100000000001);
                
                var map = new google.maps.Map(document.getElementById("map-div"), {
                    zoom:18,
                    streetViewControl: false,
                    mapTypeControl: false,
                    mapTypeId: 'roadmap',
                    zoomControl: false,
                    draggable: false,
                    scrollwheel: false, 
                    disableDoubleClickZoom: true
                });
                
                $.each(success.result, function (idx, itm) {
                    //newAr.push({ Geo: [ itm.Geo.latitude, itm.Geo.longitude], Office: itm.Office });
                    var latLng = new google.maps.LatLng(itm.Geo.latitude, itm.Geo.longitude);
                    
                    var location_marker = new google.maps.Marker({
                        position: latLng,
                        title: itm.Office,
                        map: map,
                        icon: 'styles/img/icon-location.png'
                    });
                });
                                
                /*                
                        	location_marker = new google.maps.Marker({
                position: current_location,
                title: "Current Location",
                map:map,
                icon:'img/icon-location.png'
            });
                */
                
                                
                // BES stores GeoPoint as object, but we need an array, so we quickly convert results into a small array set
/*                var newAr = [];
                $.each(success.result, function (idx, itm) {
                    newAr.push({ Geo: [ itm.Geo.latitude, itm.Geo.longitude], Office: itm.Office });
                });*/
                
               /* $("#map-div").kendoMap({
                    center: [38.89394, -121.65100000000001],
                    zoom: 10,
                    layers: [{
                        type: "tile",
                        urlTemplate: "http://a.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
                        attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>."
                    }, {
                        type: "marker",
                        locationField: "Geo",
                        dataSource: {
                            data: newAr
                        },
                        titleField: "Office"
                    }]
                });*/
                app.mobileApp.hideLoading();
            }, function (error) {
                alert(error);
                app.mobileApp.hideLoading();
            });
            
        }
    });

    parent.set('locationsViewModel', locationsViewModel);
})(app.locationsView);