'use strict';

/*

todo section:

V appfeedback
V analytics
V billStatus screen for paid bills
V paymentMethod detail screen

V add maps/Locations >> working, asked Mehfuz for help

+ add user registration to DL server upon registration

++ post-meeting due to cloud code component, still working on that
+ add push for pending bills,
+ add registration for push 
+ work on cloud code for self account push notification feature

*/

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

                var filter = {
                    'AccountID': itemModel.Id
                };
                
                app.mobileApp.showLoading();
                
                var bills = app.data.defaultProvider.data('dbo_Bills');
                bills.get(filter)
                .then(function (success) {
                    if (success.result.length > 0) {
                        $("#no-bills-span").hide();
                        $("#bill-list").show();
                        
                        var billList = $("#bill-list").data("kendoMobileListView");
                        
                        if (billList == undefined) {
                            $("#bill-list").kendoMobileListView({
                                template: $("#billTemplate").html(),
                                style: 'inset',
                                click: accountsViewModel.billClick,
                                dataSource: new kendo.data.DataSource({ data: success.result })
                            });
                        } else {
                            var dS = new kendo.data.DataSource({ data: success.result });
                            billList.setDataSource(dS);
                        }
                    } else {
                        $("#no-bills-span").show();
                        $("#bill-list").hide();
                    }
                    
                    app.mobileApp.hideLoading();
                },
                function (error) {
                    console.log(error);
                    app.mobileApp.hideLoading();
                });
                
            },
            currentItem: null,
            
            // bill functionality
            currentBill: null,
            billClick: function (e) {
                accountsViewModel.set('currentBill', e.dataItem);

                if (e.dataItem.Status > 0) {
                    app.mobileApp.navigate('#accountsView/billStatus.html');
                } else {
                    app.mobileApp.navigate('#accountsView/pay.html');
                }
            },
            
            currentPayment: null,
            statusShow: function (e) {
                // get payment related to this bill
                var filter = {
                    'BillID': accountsViewModel.currentBill.Id
                };
                
                var data = app.data.defaultProvider.data('dbo_Payments');
                data.get(filter)
                .then(function (success) {
                    // have Payment, this should always work if Bill is in Paid (1) status
                    var payment = success.result[0];
                    accountsViewModel.set('currentPayment', payment);
                    
                }, function (error) {
                    // Something has gone wrong
                    alert(error);
                });
            },
            payFields: {
                UserID: '',
                BillID: '',
                PaymentAccountID: '',
                Amount: '',
                Note: ''
            },
            payShow: function (e) {
                // clear and populate available payment types, in case user added one since last visit
                var options = $("#paymentTypes")
                	.find('option')
                    .remove()
                    .end();
                
                $.each(app.paymentManagementView.paymentManagementViewModel.dataSource.data(), function() {
                    options.append($("<option />").val(this.Id).text(this.Description));
                });
                
                // set known fields, reset old fields
                accountsViewModel.payFields.UserID = app.userDBO.Id;
                accountsViewModel.payFields.BillID = accountsViewModel.currentBill.Id;
                accountsViewModel.set('payFields.Amount', accountsViewModel.currentBill.Amount);
                accountsViewModel.payFields.Note = '';
            },
            paySubmit: function (e) {
                app.mobileApp.showLoading();
                var data = app.data.defaultProvider.data('dbo_Payments');
                var selected = $("#paymentTypes option:selected").val();
                accountsViewModel.payFields.PaymentAccountID = selected;
                
                data.create(accountsViewModel.payFields,
                	function (addSuccess) {
                    	// we have created the payment successfully if we reach this point,
                    	// so now update Bill status to Paid, aka 1
                    
                    	accountsViewModel.currentBill.Status = 1;
                    	var bills = app.data.defaultProvider.data('dbo_Bills');
                    
                    	bills.updateSingle(accountsViewModel.currentBill,
                           function (billSuccess) {
                                app.mobileApp.navigate('#:back');
                    			// toast for add success
                            	app.mobileApp.hideLoading();
                        }, function (billError) {
                            // toast for bill update error
                            app.mobileApp.hideLoading();
                        });
                	},
                	function (addError) {
                    	// toast for add error
                    	app.mobileApp.hideLoading();
                });
            },
            payCancel: function (e) {
                app.mobileApp.navigate('#:back');
            },
            
            // add functionality
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
                app.mobileApp.showLoading();
                var data = app.data.defaultProvider.data('dbo_Accounts');
                
                data.create(accountsViewModel.addFields,
                	function (addSuccess) {
                    	app.mobileApp.hideLoading();
                    	app.mobileApp.navigate('#:back');
                    	// toast for add success
                	},
                	function (addError) {
                    	// toast for add error
                    	app.mobileApp.hideLoading();
                });
            },
        	cancel: function() {
                app.mobileApp.navigate('#:back');
            }
        });

    parent.set('accountsViewModel', accountsViewModel);
})(app.accountsView);