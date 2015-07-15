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
            Description: '',
            UserID: ''
        },
        feedbackShow: function (e) {
            feedbackViewModel.fields.Title = '';
            feedbackViewModel.fields.Description = '';
            feedbackViewModel.fields.UserID = app.userDBO.Id;
            console.log("fbs");
        },
        submit: function() {
            var data = app.data.defaultProvider.data('FeedbackItem');
            data.create(feedbackViewModel.fields,
                function (addSuccess) {
                    console.log("addwin");
                    app.mobileApp.navigate('#:back');
                    // todo - Toast to say feedback submitted?
                },
                function (addError) {
                    console.log("adderror");
            });
        },
        cancel: function() {
            app.mobileApp.navigate('#:back');
        }
    });

    parent.set('feedbackViewModel', feedbackViewModel);
})(app.feedbackView);