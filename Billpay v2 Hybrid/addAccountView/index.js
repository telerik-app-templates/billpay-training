'use strict';

app.addAccountView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var addAccountViewModel = kendo.observable({
        fields: {
            description: '',
            dropdownlist: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('addAccountViewModel', addAccountViewModel);
})(app.addAccountView);