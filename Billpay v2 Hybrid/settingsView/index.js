'use strict';

app.settingsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var currentUser,
        currentView = 'settings',
    	settingsViewModel = kendo.observable({
            userFields: {
                DisplayName: 'Sample',
                Email: 'Sample',
                Password: '',
                CurrentPassword: ''
            },
            settingsShow: function (e) {
                // local reference
                console.log("show start");
                currentUser = app.userData;
                settingsViewModel.userFields.DisplayName = currentUser.DisplayName;
                settingsViewModel.userFields.Email = currentUser.Email;
                console.log("show end");
            },
            toggleView: function () {
                console.log("toggle start");
                if (currentView === 'settings') {
                    $("#settings-view").hide();
                    $("#edit-settings-view").show();
                    currentView = "edit";
                } else {
                    $("#settings-view").show();
                    $("#edit-settings-view").hide();
                    currentView = "settings";
                }
                console.log("toggle end");
            },
            submit: function() {

            },
            cancel: function() {
                app.mobileApp.navigate('#:back');
            }
        });

    parent.set('settingsViewModel', settingsViewModel);
})(app.settingsView);