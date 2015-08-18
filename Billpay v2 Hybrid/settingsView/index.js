'use strict';

app.settingsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var pushSettings = {
        iOS: {
            badge: true,
            sound: true,
            alert: true,
            clearBadge: true
        },
        android: {
            projectNumber: '939319765294'
        },
        wp8: {
            channelName: 'EverlivePushChannel'
        },
        notificationCallbackIOS: function(e) {
            alert("push received!");
            alert(JSON.stringify(e));
        },
        notificationCallbackAndroid: function(e) {
            alert("push received!");
            alert(JSON.stringify(e));
        },
        notificationCallbackWP8: function(e) {
            alert("push received!");
            alert(JSON.stringify(e));
        },
        customParameters: {
            dlUserId: ''
        }
    };
    
    var settingsViewModel = kendo.observable({
        fields: {
            Email: '',
            NewPassword: '',
            NewPasswordAgain: '',
            CurrentPassword: '',
            Username: ''
        },
        settingsShow: function (e) {
            $("#settings-email").text(app.userData.Email);
        },
        cancel: function() {
            app.mobileApp.navigate('#:back');
        },
        editPassword: function() {
            $("#settings-view").hide();
            $("#edit-password-view").show();
        },
        pushSetting: true,
        modifyPush: function() {
            $("#settings-view").hide();
            $("#modify-push-view").show();
            app.mobileApp.showLoading();
            
            app.data.defaultProvider.push.getRegistration(
                function (success) { 
					$("#push-status").text("Push Enabled");
                    $("#push-change-button").html("Disable Push");
                    settingsViewModel.pushSetting = true;
                    app.mobileApp.hideLoading();
            }, function (fail) {
                    $("#push-status").text("Push Disabled");
                    $("#push-change-button").html("Enable Push");
                	settingsViewModel.pushSetting = false;
                	app.mobileApp.hideLoading();
            });
        },
        changePassword: function() {
			if (settingsViewModel.fields.NewPassword != settingsViewModel.fields.NewPasswordAgain) {
                alert("New passwords must match!");
                return;
            }
            analytics.Monitor().TrackFeatureStart("Settings.ChangePassword");
            app.data.defaultProvider.Users.changePassword(app.userData.Username, // username
                settingsViewModel.fields.CurrentPassword, // current password
                settingsViewModel.fields.NewPassword, // new password
                true, // keep the user's tokens
                function (data) {
                    alert("Password changed successfully!");
                	settingsViewModel.cancelChange();
                	analytics.Monitor().TrackFeatureStop("Settings.ChangePassword");
                },
                function(error){
                    alert("Error changing password, if problem persists contact support.");
                	analytics.Monitor().TrackFeatureStop("Settings.ChangePassword");
                });
        },
        updatePush: function() {
            if (settingsViewModel.pushSetting) {
                // push is enabled, we need to disable
                app.data.defaultProvider.push.unregister(
                function (success) {
                    alert("Device unregistered from push notifications.");
                    settingsViewModel.cancelChange();
                },
                function (fail) {
                    alert("Problem unregistering, please contact support.");
                    settingsViewModel.cancelChange();
                });
            } else {
                pushSettings.customParameters.dlUserId = app.userDBO.Id;
                app.data.defaultProvider.push.register(
                    pushSettings,
                    function successCallback(data) {
                        alert("Device push registration success!");
                        settingsViewModel.cancelChange();
                    },
                    function errorCallback(error) {
                        alert("Device push registration failed.");
                        settingsViewModel.cancelChange();
                    }
                );   
            }
        },
        cancelChange: function() {
            $("#edit-password-view").hide();
            $("#modify-push-view").hide();
            $("#settings-view").show();
        }
    });

    parent.set('settingsViewModel', settingsViewModel);
})(app.settingsView);