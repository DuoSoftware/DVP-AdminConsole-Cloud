/**
 * Created by dinusha on 7/1/2016.
 */


(function () {
    var app = angular.module("veeryConsoleApp");

    var pbxNewUserCtrl = function ($scope, $rootScope, pbxUserApiHandler, loginService) {
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

        $scope.currentUserUuid = null;
        $scope.allowAdd = false;

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
            $scope.currentUserUuid = null;
        };

        $rootScope.$on('PABX_SetNewUserUuid', function (event, args) {
            $scope.currentUserUuid = args;

        });

        $scope.onUserSelect = function () {
            pbxUserApiHandler.getPABXUser($scope.currentUserUuid).then(function (data) {
                if (data.Result) {
                    $scope.showAlert('Warning', 'warn', 'User already added as a PABX user');
                    $scope.allowAdd = false;
                }
                else {
                    $scope.allowAdd = true;
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'User validation failed');
                $scope.allowAdd = false;

            });
        };


        var loadPABXBasicConf = function () {
            pbxUserApiHandler.getSIPUsers().then(function (data) {
                $scope.sipUserList = data.Result;

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error loading user list');

            });
        };


        $rootScope.$on('PABX_ResetForms', function (event, args) {
            resetForm();

        });


        $scope.SaveBasicConfig = function () {

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
            $scope.basicConfig.UserUuid = $scope.currentUserUuid;

            pbxUserApiHandler.savePABXUser($scope.basicConfig).then(function (data1) {
                if (data1.IsSuccess) {
                    $scope.showAlert('Success', 'info', 'User configuration saved');

                    $scope.$emit('PABX_ReloadUserList', null);

                    $("#pbxConfig").animate({
                        top: "-120%"
                    });
                    // $uibModalInstance.dismiss('cancel');

                }
                else {
                    $scope.showAlert('Error', 'error', 'Error saving user');
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error occurred while updating user');
            });

        };


        //loadPABXBasicConf();

        //update code damtih
        $scope.onClickLoadPBXconfig = function () {
            console.log('event fire');
            $("#pbxConfig").animate({
                left: "0"
            });
        }


    };

    app.controller("pbxNewUserCtrl", pbxNewUserCtrl);
}());

