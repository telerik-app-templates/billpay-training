'use strict';

app.settingsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var settingsViewModel = kendo.observable({
        fields: {
            Email: '',
            NewPassword: '',
            NewPasswordAgain: '',
            CurrentPassword: '',
            Username: ''
        },
        settingsShow: function (e) {
            
        },
        cancel: function() {
            app.mobileApp.navigate('#:back');
        },
        editPassword: function() {
            $("#settings-view").hide();
            $("#edit-password-view").show();
        },
        changePassword: function() {
			if (settingsViewModel.fields.NewPassword != settingsViewModel.fields.NewPasswordAgain) {
                alert("New passwords must match!");
                return;
            }
            
            app.data.defaultProvider.Users.changePassword(app.userData.Username, // username
                settingsViewModel.fields.CurrentPassword, // current password
                settingsViewModel.fields.NewPassword, // new password
                true, // keep the user's tokens
                function (data) {
                    alert("Password changed successfully!");
                	settingsViewModel.cancelChange();
                },
                function(error){
                    alert("Error changing password, if problem persists contact support.");
                });
        },
        editUserName: function() {
            
        },
        cancelChange: function() {
            $("#edit-password-view").hide();
            $("#settings-view").show();
        }
    });

    parent.set('settingsViewModel', settingsViewModel);
})(app.settingsView);