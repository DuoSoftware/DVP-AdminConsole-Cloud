/**
 * Created by dinusha on 7/1/2016.
 */


(function () {
    var app = angular.module("veeryConsoleApp");

    var pbxBasicCtrl = function ($scope, $rootScope, pbxUserApiHandler, loginService) {
        $scope.timeZones = [{Offset: "-12:00", TZName: "-12:00"},
            {Offset: "-11:00", TZName: "-11:00"},
            {Offset: "-10:00", TZName: "-10:00"},
            {Offset: "-09:00", TZName: "-09:00"},
            {Offset: "-08:00", TZName: "-08:00"},
            {Offset: "-07:00", TZName: "-07:00"},
            {Offset: "-06:00", TZName: "-06:00"},
            {Offset: "-05:00", TZName: "-05:00"},
            {Offset: "-04:30", TZName: "-04:30"},
            {Offset: "-04:00", TZName: "-04:00"},
            {Offset: "-03:30", TZName: "-03:30"},
            {Offset: "-03:00", TZName: "-03:00"},
            {Offset: "-02:00", TZName: "-02:00"},
            {Offset: "-01:00", TZName: "-01:00"},
            {Offset: "00:00", TZName: "00:00"},
            {Offset: "+01:00", TZName: "+01:00"},
            {Offset: "+02:00", TZName: "+02:00"},
            {Offset: "+03:00", TZName: "+03:00"},
            {Offset: "+04:00", TZName: "+04:00"},
            {Offset: "+05:00", TZName: "+05:00"},
            {Offset: "+05:30", TZName: "+05:30"},
            {Offset: "+06:00", TZName: "+06:00"},
            {Offset: "+07:00", TZName: "+07:00"},
            {Offset: "+08:00", TZName: "+08:00"},
            {Offset: "+09:00", TZName: "+09:00"},
            {Offset: "+10:00", TZName: "+10:00"},
            {Offset: "+11:00", TZName: "+11:00"},
            {Offset: "+12:00", TZName: "+12:00"}];

        var currentUserUuid = null;

        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };


        var resetForm = function () {
            $scope.basicConfig = {}
            $scope.CurUserName = '';
            currentUserUuid = null;
        };


        var loadPABXBasicConf = function (uuid) {
            pbxUserApiHandler.getPABXUser(uuid).then(function (data) {
                if (data.Result) {
                    if (data.Result.UserStatus === 'DND') {
                        data.Result.Status = 'DND';
                    }
                    else if (data.Result.UserStatus === 'CALL_DIVERT') {
                        data.Result.Status = 'CALL_DIVERT';
                    }
                    else if (data.Result.UserStatus === 'AVAILABLE' && data.Result.AdvancedRouteMethod == 'NONE') {
                        data.Result.Status = 'AVAILABLE';
                    }
                    else if (data.Result.UserStatus === 'AVAILABLE' && data.Result.AdvancedRouteMethod == 'FOLLOW_ME') {
                        data.Result.Status = 'FOLLOW_ME';
                    }
                    else if (data.Result.UserStatus === 'AVAILABLE' && data.Result.AdvancedRouteMethod == 'FORWARD') {
                        data.Result.Status = 'FORWARD';
                    }
                    else {
                        data.Result.Status = 'AVAILABLE';
                    }

                    data.Result.AllowedNumBind = data.Result.AllowedNumbers;
                    data.Result.DeniedNumBind = data.Result.DeniedNumbers;
                    if (data.Result.ActiveTemplate) {
                        data.Result.ActiveTemplate = data.Result.ActiveTemplate.toString();
                    }
                    $scope.basicConfig = data.Result;

                }
                else {
                    $scope.showAlert('ERROR', 'error', 'Invalid PABX user');
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = 'Error occurred while retrieving user';

                if (err.Message) {
                    errMsg = 'Error occurred while retrieving user : ' + err.Message;
                }

                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $rootScope.$on('PABX_LoadUserData', function (event, args) {
            currentUserUuid = args.UserUuid;
            $scope.CurUserName = args.UserName;
            loadPABXBasicConf(currentUserUuid);
            reloadDivertNumbers(currentUserUuid);

        });

        $rootScope.$on('PABX_LoadDivertNumbers', function (event, args) {
            reloadDivertNumbers(currentUserUuid);

        });

        $rootScope.$on('PABX_ResetForms', function (event, args) {
            resetForm();

        });


        $scope.UpdateBasicConfig = function () {
            var allowedNumArr = [];
            var deniedNumArr = [];

            if ($scope.basicConfig.AllowedNumBind) {
                for (i = 0; i < $scope.basicConfig.AllowedNumBind.length; i++) {
                    allowedNumArr.push($scope.basicConfig.AllowedNumBind[i].text)
                }
            }

            if ($scope.basicConfig.DeniedNumBind) {
                for (i = 0; i < $scope.basicConfig.DeniedNumBind.length; i++) {
                    deniedNumArr.push($scope.basicConfig.DeniedNumBind[i].text)
                }
            }


            $scope.basicConfig.AllowedNumbers = JSON.stringify(allowedNumArr);
            $scope.basicConfig.DeniedNumbers = JSON.stringify(deniedNumArr);

            if ($scope.basicConfig.Status === 'DND') {
                $scope.basicConfig.UserStatus = 'DND';
                $scope.basicConfig.AdvancedRouteMethod = 'NONE'
            }
            else if ($scope.basicConfig.Status === 'CALL_DIVERT') {
                $scope.basicConfig.UserStatus = 'CALL_DIVERT';
                $scope.basicConfig.AdvancedRouteMethod = 'NONE'
            }
            else if ($scope.basicConfig.Status === 'AVAILABLE') {
                $scope.basicConfig.UserStatus = 'AVAILABLE';
                $scope.basicConfig.AdvancedRouteMethod = 'NONE'
            }
            else if ($scope.basicConfig.Status === 'FOLLOW_ME') {
                $scope.basicConfig.UserStatus = 'AVAILABLE';
                $scope.basicConfig.AdvancedRouteMethod = 'FOLLOW_ME'
            }
            else if ($scope.basicConfig.Status === 'FORWARD') {
                $scope.basicConfig.UserStatus = 'AVAILABLE';
                $scope.basicConfig.AdvancedRouteMethod = 'FORWARD'
            }
            else {
                $scope.basicConfig.UserStatus = 'AVAILABLE';
                $scope.basicConfig.AdvancedRouteMethod = 'NONE'
            }

            $scope.basicConfig.FollowMeMechanism = 'SEQUENTIAL';

            pbxUserApiHandler.updatePABXUser($scope.basicConfig).then(function (data1) {
                if (data1.IsSuccess) {
                    $scope.showAlert('Success', 'info', 'User configuration updated');

                    $rootScope.$emit('SetCurrentPABXUserStatus', {
                        UserStatus: $scope.basicConfig.UserStatus,
                        AdvancedRouteMethod: $scope.basicConfig.AdvancedRouteMethod
                    });

                }
                else {
                    var errMsg = data1.CustomMessage;

                    if (!errMsg) {
                        if (data1.Exception) {
                            errMsg = data1.Exception.Message;
                        }
                    }


                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error occurred while updating user');
            });

        };

        var reloadDivertNumbers = function (uuid) {

            pbxUserApiHandler.getPABXUserTemplates(uuid).then(function (data) {
                $scope.pabxTemplList = data.Result;
            }, function (err) {
                $scope.showAlert('ERROR', 'error', 'Error loading divert numbers');
            });

        };


    };

    app.controller("pbxBasicCtrl", pbxBasicCtrl);
}());

