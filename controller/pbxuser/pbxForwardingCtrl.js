/**
 * Created by dinusha on 7/1/2016.
 */


(function () {
    var app = angular.module("veeryConsoleApp");

    var pbxForwardingCtrl = function ($scope, $rootScope, pbxUserApiHandler, loginService) {

        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        var currentUserUuid = null;
        $scope.numberType = 'USER';
        $scope.disconReason = 'BUSY';


        var resetForm = function () {
            $scope.destinationNumber = null;
            $scope.disconReason = 'BUSY';
            $scope.ringTimeout = null;
            $scope.numberType = 'USER';
            currentUserUuid = null;
            $scope.CurUserName = '';
            $scope.fwdList = [];
            $scope.dataReady = false;
        };


        $scope.deleteFWD = function (fwdRecId) {

            pbxUserApiHandler.deleteForwarding(fwdRecId)
                .then(function (data) {
                        if (data.IsSuccess) {
                            $scope.showAlert('Success', 'info', 'Forwarding configuration deleted');
                            reloadFWDList(currentUserUuid);
                        }
                        else {
                            $scope.showAlert('Error', 'error', 'Forwarding configuration deletion failed');
                        }

                    },
                    function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Error', 'error', 'Forwarding configuration deletion failed');

                    })


        };

        $scope.saveFWD = function () {
            pbxUserApiHandler.saveForwardingConfig(currentUserUuid, $scope.destinationNumber, $scope.numberType, $scope.disconReason, $scope.ringTimeout)
                .then(function (data) {
                    if (data.IsSuccess) {
                        $scope.showAlert('Success', 'info', 'Forwarding added successfully');

                        reloadFWDList(currentUserUuid);

                    }
                    else {
                        $scope.showAlert('Error', 'error', 'Forwarding failed to add');
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Forwarding failed to add');

                });

            $scope.destinationNumber = null;
            $scope.disconReason = 'BUSY';
            $scope.ringTimeout = null;
            $scope.numberType = 'USER';
        };

        var reloadFWDList = function (uuid) {
            pbxUserApiHandler.getForwardingConfigList(uuid).then(function (data) {
                $scope.fwdList = data.Result;
                $scope.dataReady = true;
            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Failed to load forwarding list');
            });
        };

        $rootScope.$on('PABX_LoadUserData', function (event, args) {
            currentUserUuid = args.UserUuid;
            $scope.CurUserName = args.UserName;
            reloadFWDList(currentUserUuid);
        });

        $rootScope.$on('PABX_ResetForms', function (event, args) {
            resetForm();

        });


    };

    app.controller("pbxForwardingCtrl", pbxForwardingCtrl);
}());


