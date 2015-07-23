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
                
                // BES stores GeoPoint as object, but we need an array, so we quickly convert results into a small array set
                var newAr = [];
                $.each(success.result, function (idx, itm) {
                    newAr.push({ Geo: [ itm.Geo.latitude, itm.Geo.longitude], Office: itm.Office });
                });
                
                $("#map-div").kendoMap({
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