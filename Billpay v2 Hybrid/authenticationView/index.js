'use strict';

app.authenticationView = kendo.observable({
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
            // logic for handling push in iOS
        },
        notificationCallbackAndroid: function(e) {
            // logic for handling push in Android
        },
        notificationCallbackWP8: function(e) {
            // logic for handling push in Windows Phone
        },
        customParameters: {
            dlUserId: ''
        }
    };
    
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
                        console.log(usr);
                        app.userData = usr.result;

                        var filter = {
                            'UniqueID': usr.result.Id
                        };
                        
                        var data = app.data.defaultProvider.data('dbo_Users');
                        
                        data.get(filter).then(
                        	function (userSuccess) {
                      			app.userDBO = userSuccess.result[0];
                                
                                // fire off read for paymentMethods since we may need these w/o hitting the PM screen
                                app.paymentManagementView.paymentManagementViewModel.dataSource.read();
                                
                                if (window.navigator.simulator === undefined) {
                                    // check for registration > if so do an update, if not then create
                                    app.data.defaultProvider.push.getRegistration(
                                        function (getRegSuccess) {
                                            // have push, just update params
                                            var customParameters = {
                                                "dlUserId": userSuccess.result[0].Id
                                            };
 
                                            app.data.defaultProvider.push.updateRegistration(customParameters,
                                                function (pushUpdateSuccess) {
                                                alert(pushUpdateSuccess);   
                                            }, function (pushUpdateError) {
                                                alert(pushUpdateError);
                                            }); 
                                        }, function (getRegFail) {
                                            alert("reg fail hit");
                                            // no push, register device
                                            pushSettings.customParameters.dlUserId = userSuccess.result[0].Id;
                                            app.data.defaultProvider.push.register(
                                                pushSettings,
                                                function successCallback(data) {
                                                    alert("Device push registration success!");
                                                },
                                                function errorCallback(error) {
                                                    alert("Device push registration failed.");
                                                }
                                            );   
                                        });
                                }
                                
                                app.mobileApp.navigate(redirect + '/view.html');
                            },
                            function (userError) {
                                alert(userError);
                            }
                        );
                    }, function (noUser) {
                        // if logged in and no user, that is a problem
                        alert(noUser);
                    });
            } else {
                init();
            }
        },
        regSuccessHandler = function(data) {
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect;
            
            // add new DL user w/ UniqueID as BES Id
            var dlUsers = app.data.defaultProvider.data('dbo_Users');
            
            var newUser = {
                UniqueID: data.result.Id
            };
            
            dlUsers.create(newUser,
                function (createUserSuccess) {
                // per Everlive standard, return gives us Id (primary key) and CreatedAt, so we have dbo_User field id for userDBO object
                
                app.userDBO = createUserSuccess.result;
                
                // fire off read for paymentMethods since we may need these w/o hitting the PM screen
                app.paymentManagementView.paymentManagementViewModel.dataSource.read();
                
                // TODO add simulator check, if simulator, we cannot do push reg
                if (window.navigator.simulator === undefined) {
                    pushSettings.customParameters.dlUserId = createUserSuccess.result.Id;
                    
                    app.data.defaultProvider.push.register(
                        pushSettings,
                        function successCallback(data) {
                            alert("Device push registration success!");
                            app.mobileApp.navigate(redirect + '/view.html');
                        },
                        function errorCallback(error) {
                            alert("Device push registration failed.");
                            app.mobileApp.navigate(redirect + '/view.html');
                        }
                    );   
                } else {
                    app.mobileApp.navigate(redirect + '/view.html');
                }                                             
                
            },  function (createUserFail) {
                console.log(createUserFail);
            });
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
				console.log("user login next");
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

                provider.Users.register(email, password, attrs, regSuccessHandler, init);
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