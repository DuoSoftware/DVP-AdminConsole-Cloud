/**
 * Created by Waruna on 7/3/2017.
 */

mainApp.controller("integrationConfigController", function ($scope, $filter, $location, $log, $anchorScroll, integrationConfigService) {

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

    $scope.integrationDataList = [];
    $scope.integrationData = {method: "GET", parameters: []};
    $scope.parameters = {parameterLocation: "QUERY"};

    $scope.isProcessing = false;

    $scope.showConfiguration = false;
    $scope.showConfigurations = function () {
        $scope.showConfiguration = !$scope.showConfiguration;
    };

    $scope.showParameter = false;
    $scope.showParameters = function () {
        $scope.showParameter = !$scope.showParameter;
    };

    $scope.addParameters = function (parameters) {
        $scope.integrationData.parameters.push(parameters);
        $scope.parameters = {parameterLocation: "QUERY"};

        var form = $scope["fInner"];
        form.$setUntouched();
        form.$setPristine();
        $scope.showParameter = false;
    };

    $scope.loadConfig = function () {
        $scope.isProcessing = true;
        integrationConfigService.getIntegrationAPIDetails().then(function (response) {
            if (response) {
                $scope.integrationDataList = response;
            } else {
                $scope.showAlert("Integrations", "error", "Fail To Load Integration Configurations.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("Integrations", "error", "Fail To Load Integration Configurations.");
        });

    };
    $scope.loadConfig();

    $scope.saveConfig = function (integrationData) {
        $scope.isProcessing = true;
        integrationConfigService.saveIntegrationAPIDetails(integrationData).then(function (response) {
            if (response) {
                $scope.showAlert("Integrations", 'success', "Configurations Created Successfully.");
                $scope.integrationDataList.push(response);
                $scope.showConfiguration = false;
                $scope.integrationData = {method: "GET", parameters: []};

                var form = $scope["fOuter"];
                form.$setUntouched();
                form.$setPristine();
            } else {

                $scope.showAlert("Integrations", "error", "Fail To Save Integration Configurations.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("Integrations", "error", "Fail To Save Integration Configurations.");
        });

    };

    $scope.deleteIntegrationAPIDetails = function (integrationData) {
        $scope.showConfirm("Delete Configurations", "Delete", "ok", "cancel", "Do you want to delete " + integrationData.name, function (obj) {
            $scope.isProcessing = true;
            integrationConfigService.deleteIntegrationAPIDetails(integrationData._id).then(function (response) {
                if (response) {
                    $scope.loadConfig();
                    $scope.showAlert("Integrations", 'success', "Configurations Deleted Successfully.");
                } else {
                    $scope.showAlert("Integrations", "error", "Fail To Delete Integration Configurations.");
                }
                $scope.isProcessing = false;
            }, function (error) {
                $scope.isProcessing = false;
                $scope.showAlert("Integrations", "error", "Fail To Delete Integration Configurations.");
            });
        }, function () {

        }, integrationData)
    };

    $scope.deleteParameter = function (parameters) {
        var index = $scope.integrationData.parameters.indexOf(parameters);
        $scope.integrationData.parameters.splice(index, 1);
    }
});