'use strict';

app.feedbackView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    //FeedbackItem
    // Title
    // Description
    // UserID
    
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
            console.log("fbs");
        },
        submit: function() {
            app.mobileApp.showLoading();
            var data = app.data.defaultProvider.data('FeedbackItem');
            data.create(feedbackViewModel.fields,
                function (addSuccess) {
                	app.mobileApp.hideLoading();
                    app.mobileApp.navigate('#:back');
                    // toast for success
                },
                function (addError) {
                	// toast for error
                	app.mobileApp.hideLoading();
            });
        },
        cancel: function() {
            app.mobileApp.navigate('#:back');
        }
    });

    parent.set('feedbackViewModel', feedbackViewModel);
})(app.feedbackView);