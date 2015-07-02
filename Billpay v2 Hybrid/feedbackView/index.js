'use strict';

app.feedbackView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var feedbackViewModel = kendo.observable({
        fields: {
            example: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('feedbackViewModel', feedbackViewModel);
})(app.feedbackView);