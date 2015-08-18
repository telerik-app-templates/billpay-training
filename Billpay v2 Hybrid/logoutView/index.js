'use strict';

app.logoutView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var logoutViewModel = kendo.observable({
        logoutShow: function (e) {
			app.data.defaultProvider.Users.logout(
            function (success) {
                app.mobileApp.navigate('authenticationView/view.html');
            }, function (error) {
                alert("Problem with logging out. Please shut down the app if this continues to login again.");
            });
        }
    });

    parent.set('logoutViewModel', logoutViewModel);
})(app.logoutView);