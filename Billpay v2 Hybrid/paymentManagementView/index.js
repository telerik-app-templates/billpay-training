'use strict';

app.paymentManagementView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var dataProvider = app.data.defaultProvider,
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'dbo_PaymentAccounts',
                dataProvider: dataProvider
            },
            schema: {
                model: {
                    fields: {
                        'Type': {
                            field: 'Type',
                            defaultValue: ''
                        },
                        'Description': {
                            field: 'Description',
                            defaultValue: ''
                        }
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        paymentManagementViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#paymentManagementView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                analytics.Monitor().TrackFeatureStart("PaymentManagement.DetailsView");
                var item = e.view.params.uid,
                    itemModel = dataSource.getByUid(item);
                paymentManagementViewModel.set('currentItem', itemModel);
                analytics.Monitor().TrackFeatureStop("PaymentManagement.DetailsView");
            },
            currentItem: null,
            add: function (e) {
                app.mobileApp.navigate('#paymentManagementView/add.html');
            },
            addShow: function (e) {
                paymentManagementViewModel.addFields.UserID = app.userDBO.Id;
            },
            addFields: {
                UserID: '',
                UniqueID: '',
                Description: '',
                Type: ''
            },
            submit: function () {
                app.mobileApp.showLoading();
                var data = app.data.defaultProvider.data('dbo_PaymentAccounts');
                data.create(paymentManagementViewModel.addFields,
                	function (addSuccess) {               
                    	app.mobileApp.hideLoading();
                    	app.mobileApp.navigate('#:back');
                    	alert("Payment Account added successfully!");
                	},
                	function (addError) {
                    	app.mobileApp.hideLoading();
                    	alert(addError);
                });
            },
            cancel: function () {
                app.mobileApp.navigate('#:back');
            },
            getMethodDescription: function(id) {
                // get matching payment method for displaying a completed bill
                var i = 0;
                var dt = dataSource.data();
                for (i = 0; i < dt.length; i++) {
                    if (id == dt[i].Id) {
                        return dt[i];
                    }
                }
            }
        });

    parent.set('paymentManagementViewModel', paymentManagementViewModel);
})(app.paymentManagementView);