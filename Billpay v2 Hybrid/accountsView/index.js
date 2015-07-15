'use strict';

app.accountsView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var dataProvider = app.data.defaultProvider,
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'dbo_Accounts',
                dataProvider: dataProvider
            },
            schema: {
                model: {
                    fields: {
                        'UserID': {
                            field: 'UserID',
                            defaultValue: ''
                        },
                        'UniqueID': {
                            field: 'UniqueID',
                            defaultValue: ''
                        },
                        'Notes': {
                            field: 'Notes',
                            defaultValue: ''
                        },
                        'Type': {
                            field: 'Type',
                            defaultValue: ''
                        },
                        'Id': {
                        	field: 'Id',
                            defaultValue: ''
                    	}
                    }
                }
            },
            serverFiltering: true
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        accountsViewModel = kendo.observable({
            dataSource: dataSource,
            accountShow: function (e) {
                accountsViewModel.dataSource.filter( { field: "UserID", operator: "eq", value: app.userDBO.Id } );
                
                $("#account-list").kendoMobileListView({
                    template: $("#accountsViewModelTemplate").html(),
                    style: 'inset',
                    click: accountsViewModel.itemClick,
                    dataSource: accountsViewModel.dataSource
                });
            },
            itemClick: function(e) {
                app.mobileApp.navigate('#accountsView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    itemModel = dataSource.getByUid(item);
                accountsViewModel.set('currentItem', itemModel);
            },
            currentItem: null,
            add: function (e) {
                app.mobileApp.navigate('#accountsView/add.html');
            },
            addShow: function (e) {
                accountsViewModel.addFields.UserID = app.userDBO.Id;
            },
            addFields: {
                UserID: '',
                UniqueID: '',
                Notes: '',
                Type: ''
            },
            submit: function() {                
                var data = app.data.defaultProvider.data('dbo_Accounts');
                data.create(accountsViewModel.addFields,
                	function (addSuccess) {
                    	console.log("addwin");
                    	app.mobileApp.navigate('#:back');
                	},
                	function (addError) {
                    	console.log("adderror");
                });
            },
        	cancel: function() {
                app.mobileApp.navigate('#:back');
            }
        });

    parent.set('accountsViewModel', accountsViewModel);
})(app.accountsView);