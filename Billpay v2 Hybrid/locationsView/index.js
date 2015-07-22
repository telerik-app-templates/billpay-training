'use strict';

app.locationsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var locationsViewModel = kendo.observable({
        locationsShow: function (e) {
            feedbackViewModel.fields.Title = '';
        },
        submit: function() {
            app.mobileApp.showLoading();
            var data = app.data.defaultProvider.data('Location');
            data.get()
            .then(function (success) {
                
            }, function (error) {
                
            });
            
            /*
                function (addSuccess) {
                	app.mobileApp.hideLoading();
                    app.mobileApp.navigate('#:back');
                    // toast for success
                },
                function (addError) {
                	// toast for error
                	app.mobileApp.hideLoading();
            });*/
        }
    });

    parent.set('locationsViewModel', locationsViewModel);
})(app.feedbackView);