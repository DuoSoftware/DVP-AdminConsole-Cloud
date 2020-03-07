/**
 * Created by dinusha on 7/2/2016.
 */

/**
 * Created by dinusha on 7/1/2016.
 */


(function () {
    var app = angular.module("veeryConsoleApp");

    var pbxFollowMeCtrl = function ($scope, $rootScope, $filter, pbxUserApiHandler, loginService) {

        $scope.list = [];

        $scope.deleteFm = function (index, item) {
            console.log(JSON.stringify($scope.list));
            $scope.list.splice(index, 1);
        };

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


        var resetForm = function () {
            $scope.destinationNumber = null;
            $scope.numberType = 'USER';
            currentUserUuid = null;
            $scope.CurUserName = '';
            $scope.pabxTemplList = [];
            $scope.dataReady = false;
        };


        var reloadFMList = function (uuid) {
            pbxUserApiHandler.getFollowMeConfigList(uuid).then(function (data) {
                $scope.list = $filter('orderBy')(data.Result, 'Priority');
                $scope.dataReady = true;
            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.dataReady = true;
                $scope.showAlert('ERROR', 'error', 'Error loading follow me configurations');
            });
        };

        $scope.addToList = function () {
            var newRecord =
            {
                PBXUserUuid: currentUserUuid,
                ObjCategory: $scope.numberType,
                DestinationNumber: $scope.destinationNumber,
                RingTimeout: $scope.ringTimeout
            };
            $scope.list.push(newRecord);

            $scope.numberType = "USER";
            $scope.destinationNumber = "";
            $scope.ringTimeout = "";

        }

        $scope.saveFMConfig = function () {
            if ($scope.list && $scope.list.length > 6) {
                $scope.showAlert('ERROR', 'error', 'Only 6 configurations are allowed for one user - Please remove and try again');
            }
            else {
                for (i = 0; i < $scope.list.length; i++) {
                    $scope.list[i].Priority = i + 1;
                }
                pbxUserApiHandler.saveFollowMeConfig(currentUserUuid, $scope.list)
                    .then(function (data) {
                        $scope.showAlert('SUCCESS', 'info', 'FollowMe configuration saved successfully');

                    }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('ERROR', 'error', 'Error occurred while saving');

                });
            }

        }


        $rootScope.$on('PABX_LoadUserData', function (event, args) {
            currentUserUuid = args.UserUuid;
            $scope.CurUserName = args.UserName;
            reloadFMList(currentUserUuid);
        });

        $rootScope.$on('PABX_ResetForms', function (event, args) {
            resetForm();

        });


    };

    app.controller("pbxFollowMeCtrl", pbxFollowMeCtrl);
}());


