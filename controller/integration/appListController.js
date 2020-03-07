mainApp.controller("appListController", function ($scope, $filter, $location, $log, $state, $anchorScroll, integrationConfigService) {

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

    $scope.appList = [];

    // set default app data..

    $scope.resetAppData = function(){
        $scope.appData = {
            trycount: 5, 
            timeout: 10
        };

        // reset form...
        if($scope["fOuter"]){
            $scope["fOuter"].$setUntouched();
            $scope["fOuter"].$setPristine();
        }
        
    };

    $scope.resetAppData();

    $scope.parameters = {parameterLocation: "QUERY"};

    $scope.isProcessing = false;
    $scope.isUpdate = false;

    $scope.showConfiguration = false;
    $scope.showConfigurations = function () {
        $scope.resetAppData();
        $scope.showConfiguration = !$scope.showConfiguration;
        $scope.isUpdate = false;
    };

    $scope.showParameter = false;
    $scope.showParameters = function () {
        $scope.showParameter = !$scope.showParameter;
    };

    $scope.addParameters = function (parameters) {
        $scope.appData.parameters.push(parameters);
        $scope.parameters = {parameterLocation: "QUERY"};

        var form = $scope["fInner"];
        form.$setUntouched();
        form.$setPristine();
        $scope.showParameter = false;
    };

    $scope.loadApps = function () {
        $scope.isProcessing = true;
        integrationConfigService.getAppDetails().then(function (response) {
            if (response) {
                $scope.appList = response;
            } else {
                $scope.showAlert("App Integrations", "error", "Fail To Load Apps.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Load Apps.");
        });

    };
    $scope.loadApps();

    $scope.saveApp = function (appData) {
        $scope.isProcessing = true;
        integrationConfigService.saveAppDetails(appData).then(function (response) {
            if (response) {
                $scope.showAlert("App Integrations", 'success', "App Created Successfully.");
                if(!appData._id){
                    $scope.appList.push(response);
                }
                $scope.showConfiguration = false;
                $scope.resetAppData();

                var form = $scope["fOuter"];
                form.$setUntouched();
                form.$setPristine();
            } else {

                $scope.showAlert("App Integrations", "error", "Fail To Save App.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Save App.");
        });

    };

    $scope.updateApp = function (appData) {
        $scope.isProcessing = true;
        integrationConfigService.updateAppDetails(appData).then(function (response) {
            if (response.IsSuccess) {
                $scope.showAlert("App Integrations", 'success', "App updated Successfully.");

                $scope.showConfiguration = false;
                // $scope.resetAppData();

            } else {

                $scope.showAlert("App Integrations", "error", "Fail To Save App.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Save App.");
        });

    }; 

    $scope.editApp = function(appData){
        $scope.appData = appData;
        $scope.showConfiguration = true;
        $scope.isUpdate = true;
        $anchorScroll();
    }

    $scope.configureApp = function(app_id){
        $state.go('console.appconfig', {'app_id': app_id});
    };

    $scope.deleteApp = function (appData) {
        $scope.isProcessing = true;
        $scope.showConfirm("Delete App", "Delete", "ok", "cancel", "Do you want to delete " + appData.name, function (obj) {
            integrationConfigService.deleteAppDetails(appData._id).then(function (response) {
                if (response) {
                    $scope.isProcessing = false;
                    $scope.loadApps();
                    $scope.showAlert("App Integrations", 'success', "App Deleted Successfully.");
                } else {
                    $scope.showAlert("App Integrations", "error", "Fail To Delete App.");
                }
                $scope.isProcessing = false;
            }, function (error) {
                $scope.isProcessing = false;
                $scope.showAlert("App Integrations", "error", "Fail To Delete App.");
            });
        }, function () {
            $scope.$apply(function(){
                $scope.isProcessing = false;
            });
        }, appData)
    };
});
