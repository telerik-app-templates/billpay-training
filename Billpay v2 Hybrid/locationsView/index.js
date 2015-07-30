'use strict';

app.locationsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var locationsViewModel = kendo.observable({
        onShow: function (e) {
            
        }
    });

    parent.set('locationsViewModel', locationsViewModel);
})(app.locationsView);