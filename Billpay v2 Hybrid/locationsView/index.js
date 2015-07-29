'use strict';

app.locationsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var locationsViewModel = kendo.observable({
        onShow: function (e) {
            app.mobileApp.showLoading();
            
            var data = app.data.defaultProvider.data('Location');
            data.get()
            .then(function (success) {
                var current_location = new google.maps.LatLng(38.89394, -121.65100000000001);
                
                var mapOptions = {
                    center: { lat: 38.89394, lng: -121.65100000000001},
                    zoom: 7
                };
                
                var map = new google.maps.Map(document.getElementById("map-div"), mapOptions);                  
                
                $.each(success.result, function (idx, itm) {
                    var latLng = new google.maps.LatLng(itm.Geo.latitude, itm.Geo.longitude);
                    
                    var marker = new google.maps.Marker({
                        position: latLng,
                        title: itm.Office,
                        map: map
                    });
                    
                    google.maps.event.addListener(marker, 'click', function() {
                        map.setCenter(marker.getPosition());
                        
                        var latLng = marker.getPosition();
                        
                        new google.maps.Geocoder().geocode({'latLng':latLng}, function(results, status){
                            if (results[1]){
                                if (results[1].formatted_address){
                                     $('#location').html(results[1].formatted_address);
                                }
                            } 
                        });
                    });
                });
                
                app.mobileApp.hideLoading();
            }, function (error) {
                alert(error);
                app.mobileApp.hideLoading();
            });
            
        }
    });

    parent.set('locationsViewModel', locationsViewModel);
})(app.locationsView);