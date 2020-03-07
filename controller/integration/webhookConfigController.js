mainApp.controller("webhookConfigController", function ($scope, $anchorScroll, integrationConfigService) {

    $anchorScroll();

    $scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

        (new PNotify({
            title: tittle,
            text: content,
            icon: 'glyphicon glyphicon-question-sign',
            hide: false,
            confirm: {
                confirm: true
            },
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            }
        })).get().on('pnotify.confirm', function () {
            OkCallback("confirm");
        }).on('pnotify.cancel', function () {
            CancelCallBack("cancel");
        });

    };

    $scope.showAlert = function (tittle,type, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.webhookList = [];

    $scope.loadWebhooks = function () {
        $scope.isProcessing = true;
        integrationConfigService.getWebhooks().then(function (response) {
            if (response) {
                $scope.webhookList = response;
            } else {
                $scope.showAlert("Webhook configurations", "error", "Fail To Load Webhooks.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            console.log(error);
            $scope.showAlert("Webhook configurations", "error", "Fail To Load Webhooks.");
        });
    };

    $scope.loadWebhooks();

    // set default webhook data..
    $scope.resetWebhookData = function(){
        $scope.webhookData = {
            auth_type: undefined,
            token: undefined,
            username: undefined,
            password: undefined,
            url: undefined,
            event_type: undefined
        };

        // reset form...
        if($scope["webhookForm"]){
            $scope["webhookForm"].$setUntouched();
            $scope["webhookForm"].$setPristine();
        }       
    };

    $scope.resetWebhookData();

    $scope.isProcessing = false;
    $scope.isUpdate = false;

    $scope.showConfiguration = false;
    $scope.showConfigurations = function () {
        $scope.resetWebhookData();
        $scope.showConfiguration = !$scope.showConfiguration;
        $scope.isUpdate = false;
    };

    $scope.saveWebhook = function (webhookData) {
        $scope.isProcessing = true;
        integrationConfigService.saveWebhook(webhookData).then(function (response) {
            if (response) {
                $scope.showAlert("Webhook configurations", 'success', "Webhook Created Successfully.");
                if(!webhookData._id){
                    $scope.webhookList.push(response);
                }
                $scope.showConfiguration = false;
                $scope.resetWebhookData();
            } else {
                $scope.showAlert("Webhook configurations", "error", "Fail To Save Webhook.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("Webhook configurations", "error", "Fail To Save Webhook.");
        });

    };

    $scope.editWebhook = function(webhookData){
        $scope.webhookData = webhookData;
        $scope.showConfiguration = true;
        $scope.isUpdate = true;
        $anchorScroll();
    };

    $scope.updateWebhook = function (webhookData) {
        $scope.isProcessing = true;
        integrationConfigService.updateWebhook(webhookData).then(function (response) {
            if (response.IsSuccess) {
                $scope.showAlert("Webhook configurations", 'success', "Webhook updated Successfully.");

                $scope.showConfiguration = false;
            } else {

                $scope.showAlert("Webhook configurations", "error", "Fail To update webhook.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("Webhook configurations", "error", "Fail To update webhook.");
        });
    }; 
    
    $scope.deleteWebhook = function (data) {
        $scope.isProcessing = true;
        $scope.showConfirm("Delete Webhook", "Delete", "ok", "cancel", "Are you sure you want to delete?", function (obj) {
            integrationConfigService.deleteWebhook(data._id).then(function (response) {
                if (response) {
                    $scope.isProcessing = false;
                    $scope.loadWebhooks();
                    $scope.showAlert("Webhook configurations", 'success', "Webhook Deleted Successfully.");
                } else {
                    $scope.showAlert("Webhook configurations", "error", "Fail To Delete App.");
                }
                $scope.isProcessing = false;
            }, function (error) {
                $scope.isProcessing = false;
                $scope.showAlert("Webhook configurations", "error", "Fail To Delete Webhook.");
            });
        }, function () {
            $scope.$apply(function(){
                $scope.isProcessing = false;
            });
        }, data)
    }; 

    $scope.setWebhookStatus = function(webhook){
        webhook.switchDisabled = true;
        integrationConfigService.updateWebhookStatus(webhook._id, webhook.is_enabled).then(function (response) {
            if (response.IsSuccess) {
                // $scope.showAlert("Webhook configurations", 'success', "Webhook updated Successfully.");
            } else {
                webhook.is_enabled = !webhook.is_enabled;
                $scope.showAlert("Webhook configurations", "error", "Fail To update webhook.");
            }
            webhook.switchDisabled = false;
        }, function (error) {
            webhook.switchDisabled = false;
            webhook.is_enabled = !webhook.is_enabled;
            $scope.showAlert("Webhook configurations", "error", "Fail To update webhook.");
        });
    }
});
