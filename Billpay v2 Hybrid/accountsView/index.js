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
                        'Type': {
                            field: 'Type',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        accountsViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#accountsView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    itemModel = dataSource.getByUid(item);
                accountsViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('accountsViewModel', accountsViewModel);
})(app.accountsView);