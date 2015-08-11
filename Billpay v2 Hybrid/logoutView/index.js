'use strict';

app.logoutView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var logoutViewModel = kendo.observable({
        logoutShow: function (e) {
            // throwing Kendo error:
            // Uncaught TypeError: Cannot read property 'stop' of undefined
            // look more into this, same line as below works in SAM
			app.data.defaultProvider.Users.logout();
            app.mobileApp.navigate('authenticationView/view.html');
        },
        cancel: function() {
            app.mobileApp.navigate('#:back');
        }
    });

    parent.set('logoutViewModel', logoutViewModel);
})(app.logoutView);