'use strict';

app.settingsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var settingsViewModel = kendo.observable({
        fields: {
            Title: '',
            Notes: '',
            UserID: ''
        },
        feedbackShow: function (e) {
            
        },
        submit: function() {
            /*
            app.mobileApp.showLoading();
            var data = app.data.defaultProvider.data('FeedbackItem');
            data.create(feedbackViewModel.fields,
                function (addSuccess) {
                	app.mobileApp.hideLoading();
                    app.mobileApp.navigate('#:back');
                    alert("Thanks for your feedback!");
                },
                function (addError) {
                	app.mobileApp.hideLoading();
                	alert("Problem submitting feedback")
            });
            */
        },
        cancel: function() {
            app.mobileApp.navigate('#:back');
        }
    });

    parent.set('settingsViewModel', settingsViewModel);
})(app.settingsView);