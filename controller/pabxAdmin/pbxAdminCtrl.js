/**
 * Created by dinusha on 7/1/2016.
 */


(function () {
    var app = angular.module("veeryConsoleApp");

    var pbxAdminCtrl = function ($scope, $rootScope, pbxAdminApiHandler, loginService,$anchorScroll) {
        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };


        var loadPABXMasterData = function () {
            pbxAdminApiHandler.getPABXMasterData().then(function (data) {
                if (data.Result) {

                    $scope.pabxConfig = data.Result;

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = 'Error occurred while retrieving pabx master data';

                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var loadFeatureCodes = function () {
            pbxAdminApiHandler.getFeatureCodes().then(function (data) {
                if (data.Result) {

                    $scope.fc = data.Result;

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = 'Error occurred while retrieving feature codes';

                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var loadTransferCodes = function () {
            pbxAdminApiHandler.getTransferCodes().then(function (data) {
                if (data.Result) {

                    $scope.attTrans = data.Result;

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = 'Error occurred while retrieving transfer codes';

                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var loadEmergencyNumbers = function () {
            pbxAdminApiHandler.getEmergencyNumbers().then(function (data) {
                if (data.Result) {
                    $scope.emergencyNumbers = data.Result.map(function (item) {
                        return item['EmergencyNum'];
                    });

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = 'Error occurred while retrieving emergency numbers';

                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        loadPABXMasterData();
        loadFeatureCodes();
        loadTransferCodes();
        loadEmergencyNumbers();

        $scope.UpdatePABXMasterData = function () {

            pbxAdminApiHandler.savePBXMasterData($scope.pabxConfig).then(function (data1) {
                if (data1.IsSuccess) {
                    $scope.showAlert('SUCCESS', 'info', 'PABX master data saved');

                }
                else {
                    $scope.showAlert('Error', 'error', 'Error occurred while saving master data');
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error occurred while saving master data');
            });

        };

        $scope.UpdateFC = function () {

            pbxAdminApiHandler.saveFeatureCodes($scope.fc).then(function (data1) {
                if (data1.IsSuccess) {
                    $scope.showAlert('SUCCESS', 'info', 'PABX feature codes saved');

                }
                else {
                    $scope.showAlert('Error', 'error', 'Error occurred while saving feature codes');
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error occurred while saving festure codes');
            });

        };

        $scope.UpdateTransferCodes = function () {

            pbxAdminApiHandler.saveTransferCodes($scope.attTrans).then(function (data1) {
                if (data1.IsSuccess) {
                    $scope.showAlert('SUCCESS', 'info', 'PABX transfer codes saved');

                }
                else {
                    $scope.showAlert('Error', 'error', 'Error occurred while saving transfer codes');
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error occurred while saving transfer codes');
            });

        };

        $scope.onChipAdd = function (chip) {
            var eNum = {
                EmergencyNum: chip.text
            }
            pbxAdminApiHandler.addEmergencyNumber(eNum).then(function (data) {
                if (data.IsSuccess) {

                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while getting emergency numbers";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
            return chip;
        };

        $scope.onChipDelete = function (chip) {

            pbxAdminApiHandler.deleteEmergencyNumber(chip.text).then(function (data) {
                if (data.IsSuccess) {

                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while removing emergency number";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
            return chip;
        };


    };

    app.controller("pbxAdminCtrl", pbxAdminCtrl);
}());

