'use strict';

app.authenticationView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var provider = app.data.defaultProvider,
        mode = 'signin',
        registerRedirect = 'accountsView',
        signinRedirect = 'accountsView',
        init = function(error) {
            if (error) {
                if (error.message) {
                    alert(error.message);
                }

                return false;
            }

            var activeView = mode === 'signin' ? '.signin-view' : '.signup-view';

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }
        },
        successHandler = function(data) {
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect;

            if (data && data.result) {
                app.user = data.result;
                provider.Users.currentUser().then(
                    function (usr) {
                        app.userData = usr.result;
                        
                        var filter = {
                            'UniqueID': usr.result.Id
                        };
                        
                        var data = app.data.defaultProvider.data('dbo_Users');
                        
                        data.get(filter).then(
                        	function (userSuccess) {                                
                                app.userDBO = userSuccess.result[0];
                                app.mobileApp.navigate(redirect + '/view.html');
                                
                                // fire off read for paymentMethods since we may need these w/o hitting the PM screen
                                app.paymentManagementView.paymentManagementViewModel.dataSource.read();
                            },
                            function (userError) {
                                // todo, error response
                            }
                        );
                    }, function (bad) {
                        // todo, error response
                    });
            } else {
                init();
            }
        },
        authenticationViewModel = kendo.observable({
            displayName: '',
            email: 'hutnick@progress.com',
            password: 'demo',
            validateData: function(data) {
                if (!data.email) {
                    alert('Missing email');
                    return false;
                }

                if (!data.password) {
                    alert('Missing password');
                    return false;
                }

                return true;
            },
            signin: function() {
                var model = authenticationViewModel,
                    email = model.email.toLowerCase(),
                    password = model.password;

                if (!model.validateData(model)) {
                    return false;
                }

                provider.Users.login(email, password, successHandler, init);
            },
            register: function() {
                var model = authenticationViewModel,
                    email = model.email.toLowerCase(),
                    password = model.password,
                    displayName = model.displayName,
                    attrs = {
                        Email: email,
                        DisplayName: displayName
                    };

                if (!model.validateData(model)) {
                    return false;
                }

                provider.Users.register(email, password, attrs, successHandler, init);
            },
            toggleView: function() {
                mode = mode === 'signin' ? 'register' : 'signin';
                init();
            }
        });

    parent.set('authenticationViewModel', authenticationViewModel);
    parent.set('onShow', function() {
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.authenticationView);