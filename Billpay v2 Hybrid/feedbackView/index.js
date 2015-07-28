'use strict';

app.feedbackView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var feedbackViewModel = kendo.observable({
        fields: {
            Title: '',
            Notes: '',
            UserID: ''
        },
        feedbackShow: function (e) {
            feedbackViewModel.fields.Title = '';
            feedbackViewModel.fields.Notes = '';
            feedbackViewModel.fields.UserID = app.userDBO.Id;
        },
        submit: function() {
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
        },
        cancel: function() {
            app.mobileApp.navigate('#:back');
        }
    });

    parent.set('feedbackViewModel', feedbackViewModel);
})(app.feedbackView);