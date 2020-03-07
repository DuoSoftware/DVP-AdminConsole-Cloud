/**
 * Created by dinusha on 6/8/2016.
 */


(function () {
    var app = angular.module("veeryConsoleApp");

    var pbxCtrl = function ($scope, $rootScope, $uibModal, pbxUserApiHandler, loginService,$anchorScroll,$q,$log) {
        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.searchCriteria = "";

        $scope.PABX_OnEditMode = false;

        $scope.pabxUserSelected = {};

        $rootScope.$on('SetCurrentPABXUserStatus', function (event, args) {
            $scope.pabxUserSelected.UserStatus = args.UserStatus;
            $scope.pabxUserSelected.AdvancedRouteMethod = args.AdvancedRouteMethod;
        });

        $rootScope.$on('PABX_ReloadUserList', function (event, args) {
            $scope.reloadUserList();
        });

        $scope.loadBasicConfig = function (pbxUsr) {
            $scope.PABX_OnEditMode = true;

            $scope.pabxUserSelected = pbxUsr;

            $scope.$emit('PABX_LoadUserData', pbxUsr);
            $("#pbxEditWrapper").animate({
                right: "0%"
            });


        };

        var loadPABXBasicConf = function () {


            $scope.sipUserList = [];

            pbxUserApiHandler.getSipUsersCount().then(function (row_count) {
                var pagesize = 20;
                var pagecount = Math.ceil(row_count / pagesize);

                var method_list = [];

                for (var i = 1; i <= pagecount; i++) {
                    method_list.push(pbxUserApiHandler.getSipUsersWithPaging(i,pagesize));
                }


                $q.all(method_list).then(function (resolveData) {
                    if (resolveData) {
                        resolveData.map(function (response) {

                            response.map(function (item) {

                                $scope.sipUserList.push(item);

                            });


                        });

                    }


                }).catch(function (err) {
                    $log.debug("Get Sip user count  err");
                    loginService.isCheckResponse(err);
                    $scope.showError("Error", "Error in loading sip users");

                });



            }, function (err) {
                $log.debug("Get Sip user count  err");
                loginService.isCheckResponse(err);
                $scope.showError("Error", "Error in loading sip users");


            });


           /* pbxUserApiHandler.getSIPUsers().then(function (data) {
                $scope.sipUserList = data.Result;

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error loading user list');

            });*/
        };

        loadPABXBasicConf();

        $scope.onUserSelect = function () {

            pbxUserApiHandler.getPABXUser($scope.currentUserUuid).then(function (data) {
                if (data.Result) {
                    $scope.showAlert('Warning', 'warn', 'User already added as a PABX user');
                    $scope.allowAdd = false;
                }
                else {
                    $scope.allowAdd = true;
                    $scope.$emit('PABX_SetNewUserUuid', $scope.currentUserUuid);
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'User validation failed');
                $scope.allowAdd = false;

            });

        };

        //$scope.newUser = function()
        //{
        //
        //    $scope.$emit('PABX_ResetForms', null);
        //    var modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: 'views/pbxuser/pabxNewUserView.html',
        //        controller: 'pbxNewUserCtrl',
        //        size: 'lg',
        //        resolve: {
        //            items: function () {
        //                return $scope.items;
        //            }
        //        }
        //    });
        //}


        $scope.updateStatus = function (selectedStatus, pbxUsr) {
            $scope.PABX_OnEditMode = false;
            $scope.$emit('PABX_ResetForms', null);

            if (selectedStatus === 'DND') {
                pbxUsr.UserStatus = 'DND';
                pbxUsr.AdvancedRouteMethod = 'NONE';
            }
            else if (selectedStatus === 'CALL_DIVERT') {
                pbxUsr.UserStatus = 'CALL_DIVERT';
                pbxUsr.AdvancedRouteMethod = 'NONE';
            }
            else if (selectedStatus === 'AVAILABLE') {
                pbxUsr.UserStatus = 'AVAILABLE';
                pbxUsr.AdvancedRouteMethod = 'NONE';
            }
            else if (selectedStatus === 'FOLLOW_ME') {
                pbxUsr.UserStatus = 'AVAILABLE';
                pbxUsr.AdvancedRouteMethod = 'FOLLOW_ME';
            }
            else if (selectedStatus === 'FORWARD') {
                pbxUsr.UserStatus = 'AVAILABLE';
                pbxUsr.AdvancedRouteMethod = 'FORWARD';
            }
            else {
                pbxUsr.UserStatus = 'AVAILABLE';
                pbxUsr.AdvancedRouteMethod = 'NONE';
            }

            pbxUserApiHandler.updatePABXUser(pbxUsr).then(function (data1) {
                if (data1.IsSuccess) {
                    $scope.CurrentSelectedUser = {}
                    pbxUsr.StatusEditMode = false;
                }
                else {
                    var errMsg = data1.CustomMessage;

                    if (data1.Exception) {
                        errMsg = data1.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Communication Error Occurred');
            });

        }

        $scope.openStatusEdit = function (pbxUsr) {
            if (pbxUsr.UserStatus === 'DND') {
                $scope.pabxUserSelected.Status = 'DND';
            }
            else if (pbxUsr.UserStatus === 'CALL_DIVERT') {
                $scope.pabxUserSelected.Status = 'CALL_DIVERT';
            }
            else if (pbxUsr.UserStatus === 'AVAILABLE' && pbxUsr.AdvancedRouteMethod == 'NONE') {
                $scope.pabxUserSelected.Status = 'AVAILABLE';
            }
            else if (pbxUsr.UserStatus === 'AVAILABLE' && pbxUsr.AdvancedRouteMethod == 'FOLLOW_ME') {
                $scope.pabxUserSelected.Status = 'FOLLOW_ME';
            }
            else if (pbxUsr.UserStatus === 'AVAILABLE' && pbxUsr.AdvancedRouteMethod == 'FORWARD') {
                $scope.pabxUserSelected.Status = 'FORWARD';
            }
            else {
                $scope.pabxUserSelected.Status = 'AVAILABLE';
            }


            if (!$scope.CurrentSelectedUser) {
                $scope.CurrentSelectedUser = pbxUsr;
            }

            if ($scope.CurrentSelectedUser.UserName != pbxUsr.UserName) {
                $scope.CurrentSelectedUser.StatusEditMode = false;
            }


            if (pbxUsr.StatusEditMode === undefined) {
                pbxUsr.StatusEditMode = false;
            }

            pbxUsr.StatusEditMode = !pbxUsr.StatusEditMode;

            $scope.CurrentSelectedUser = pbxUsr;
        };


        $scope.deleteUser = function (userUuid) {
            pbxUserApiHandler.deletePABXUser(userUuid)
                .then(function (data) {
                    if (data.IsSuccess) {
                        $scope.reloadUserList();
                        $scope.$emit('PABX_ResetForms', null);
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
                    $scope.showAlert('Error', 'error', 'Communication error occurred while deleting');

                });

        };

        $scope.editPABXUser = function (usrUuid) {
            $scope.IsEdit = true;
            $scope.reloadDivertNumbers(usrUuid);
        };

        $scope.reloadUserList = function () {
            $scope.searchCriteria = "";
            var onGetPABXUserListSuccess = function (data) {
                if (data.IsSuccess) {
                    $scope.pabxUsrList = data.Result;
                    $scope.total = data.Result.length;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }

                    $scope.showAlert('Error', 'error', errMsg);

                }

                $scope.dataReady = true;

            };

            var onGetPABXUserListError = function (err) {
                var errMsg = "Error occurred while getting pabx user list";
                if (err.statusText) {
                    errMsg = err.statusText;
                }

                $scope.showAlert('Error', 'error', errMsg);
                $scope.dataReady = true;
            };


            pbxUserApiHandler.getPABXUsers().then(onGetPABXUserListSuccess, onGetPABXUserListError);
        };

        $scope.reloadUserList();


        //update code damtih
        $scope.onClickLoadPBXconfig = function () {

            if ($scope.allowAdd) {
                $("#pbxConfig").animate({
                    top: "0"
                });
            }
            else {
                $scope.showAlert('Warning', 'warn', 'User already added as a PABX user');
            }

        };

        $scope.onClickPBXclose = function () {
            $("#pbxConfig").animate({
                top: "-120%"
            });
        };

        $scope.onClickPBXEditUserClose = function () {
            $("#pbxEditWrapper").animate({
                right: "-200%"
            });
        };


    };

    app.controller("pbxCtrl", pbxCtrl);
}());
