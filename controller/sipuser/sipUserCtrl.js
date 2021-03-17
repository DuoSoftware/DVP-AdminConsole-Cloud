/**
 * Created by dinusha on 6/2/2016.
 */

(function () {
    var app = angular.module("veeryConsoleApp");


    var sipUserCtrl = function ($scope, sipUserApiHandler, loginService, $rootScope,$q) {

		$rootScope.$on('SIPUserUploadOn', function () {
			$scope.onSavePressed();
		});

        //User List Operations
        $scope.viewDivState = -1;

        $scope.canCancelNewUser = false;

        $scope.FormState = 'New';
        $scope.SipUsernameDisplay = '';

        //0 view | 1 edit | 2 new

        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.searchCriteria = "";

        $scope.reloadUserList = function () {
            $scope.sipUsrList = [];
            // Sanura Wijayarathne - 2020/08/26
            // $scope.searchCriteria = "";
            if($scope.searchCriteria == null || $scope.searchCriteria === ""){
                sipUserApiHandler.getSipUsersCount().then(function (row_count) {
                    var pagesize = 20;
                    var pagecount = Math.ceil(row_count / pagesize);
                    var method_list = [];

                    for (var i = 1; i <= pagecount; i++) {
                        method_list.push(sipUserApiHandler.getSipUsersWithPaging(i,pagesize));
                    }
                    $q.all(method_list).then(function (resolveData) {
                        if (resolveData) {
                            resolveData.map(function (response) {

                                response.map(function (item) {

                                    $scope.sipUsrList.push(item);

                                });
                            });
                        }
                        if ($scope.sipUsrList.length > 0) {
                            $scope.FormState = 'New';
                            $scope.SipUsernameDisplay = $scope.sipUsrList[0].SipUsername;
                            //$scope.onEditPressed($scope.sipUsrList[0].SipUsername);
                        }
                        if ($scope.sipUsrList.length == 0) {
                            $scope.FormState = 'Cancel';
                            $scope.SipUsernameDisplay = 'NEW SIP USER';
                        }
                        $scope.total = $scope.sipUsrList.length;
                    }).catch(function (err) {
                        loginService.isCheckResponse(err);
                        var errMsg = "Error occurred while getting user list";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                        $scope.dataReady = true;
                    });
                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while getting user list";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                    $scope.dataReady = true;
                });
            }

            else{
                sipUserApiHandler.getSIPUsers().then(function (data) {
                    if (data.IsSuccess) {
                        $scope.sipUsrList = data.Result;
                        if ($scope.sipUsrList.length > 0) {
                            $scope.FormState = 'New';
                            $scope.SipUsernameDisplay = $scope.sipUsrList[0].SipUsername;
                            //$scope.onEditPressed($scope.sipUsrList[0].SipUsername);
                        }
                        if ($scope.sipUsrList.length == 0) {
                            $scope.FormState = 'Cancel';
                            $scope.SipUsernameDisplay = 'NEW SIP USER';
                        }
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
                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while getting user list";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                    $scope.dataReady = true;
                });
            }




            /*sipUserApiHandler.getSIPUsers().then(function (data) {
                if (data.IsSuccess) {
                    $scope.sipUsrList = data.Result;
                    if ($scope.sipUsrList.length > 0) {
                        $scope.FormState = 'New';
                        $scope.SipUsernameDisplay = $scope.sipUsrList[0].SipUsername;
                        //$scope.onEditPressed($scope.sipUsrList[0].SipUsername);
                    }

                    if ($scope.sipUsrList.length == 0) {
                        $scope.FormState = 'Cancel';
                        $scope.SipUsernameDisplay = 'NEW SIP USER';
                    }
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

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while getting user list";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
                $scope.dataReady = true;
            });*/
        };

        $scope.onDeleteUser = function (username) {
            var usrObj = {SipUsername: username, Enabled: false};

            sipUserApiHandler.deleteSipUser(usrObj)
                .then(function (data) {
                        if (data.IsSuccess) {
                            $scope.reloadUserList();
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Error', 'error', errMsg);
                            $scope.dataReady = true;

                        }

                    },
                    function (err) {
                        var errMsg = "Error occurred while deleting user";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);

                    })

        };

        $scope.onEditPressed = function (username) {

            $scope.IsEdit = true;
            $scope.EditState = 'Edit User';
            $scope.viewDivState = 0;

            sipUserApiHandler.getSIPUser(username).then(function (data) {
                if (data.IsSuccess) {
                    if (data.Result.CloudEndUserId) {
                        data.Result.CloudEndUserId = data.Result.CloudEndUserId.toString();
                    }
                    $scope.basicConfig = data.Result;
                    if (data.Result) {
                        $scope.SipUsernameDisplay = data.Result.SipUsername;
                    }


                    if (data.Result && data.Result.Extension) {
                        $scope.basicConfig.Extension = data.Result.Extension.Extension;
                    }

                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = 'Get sip user error : ' + data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while getting sip user";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);


            });
        };

        $scope.reloadUserList();


        //User Configuration Operations

        $scope.IsEdit = false;
        $scope.EditState = 'New User';

        $scope.clearFormOnSave = function () {
            $scope.basicConfig = {};
            $scope.IsEdit = false;
            $scope.EditState = 'New User';

            $scope.basicConfig.UsePublic = false;
            $scope.basicConfig.TransInternalEnable = false;
            $scope.basicConfig.TransExternalEnable = false;
            $scope.basicConfig.TransConferenceEnable = false;
            $scope.basicConfig.TransGroupEnable = false;
            $scope.basicConfig.DenyOutboundFor = 'NONE';
            $scope.basicConfig.RecordingEnabled = false;
        };

        $scope.onSavePressed = function () {
            if ($scope.IsEdit) {
                sipUserApiHandler.updateUser($scope.basicConfig).then(function (data1) {
                    if (data1.IsSuccess) {
                        $scope.showAlert('Success', 'success', 'User updated successfully');
                        $scope.reloadUserList();

                        if ($scope.basicConfig.UsePublic) {
                            $scope.basicConfig.Domain = '';
                            sipUserApiHandler.setPublicUser($scope.basicConfig).then(function (data2) {

                            })
                        }

						$rootScope.$broadcast('SIPUserSaveSuccess');
                    }
                    else {
                        $scope.showAlert('Error', 'error', 'Error updating user');
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error updating user";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                });
            }
            else {
                //Save

                sipUserApiHandler.validateUsername($scope.basicConfig.SipUsername).then(function (checkUsrData) {
                    if (checkUsrData.IsSuccess) {
                        if (checkUsrData.Result) {
                            $scope.showAlert('Warning', 'warn', 'Sip Username in use, please try another');
                        }
                        else {
                            sipUserApiHandler.validateExtension($scope.basicConfig.Extension).then(function (checkExtData) {
                                if (checkExtData.IsSuccess) {
                                    if (checkExtData.Result) {
                                        $scope.showAlert('Warning', 'warn', 'Extension in use, please try another');
                                    }
                                    else {
                                        $scope.basicConfig.Enabled = true;
                                        sipUserApiHandler.saveSIPUser($scope.basicConfig).then(function (data1) {
                                            if (data1.IsSuccess) {


                                                var extObj = {
                                                    Extension: $scope.basicConfig.Extension,
                                                    ExtensionName: $scope.basicConfig.SipUsername,
                                                    ExtraData: "",
                                                    AddUser: "",
                                                    UpdateUser: "",
                                                    Enabled: true,
                                                    ExtRefId: $scope.basicConfig.SipUsername,
                                                    ObjCategory: "USER"
                                                };

                                                sipUserApiHandler.addNewExtension(extObj).then(function (data2) {
                                                    if (data2.IsSuccess) {
                                                        sipUserApiHandler.assignExtensionToUser(extObj.Extension, data1.Result.id).then(function (data3) {
                                                            if (data3.IsSuccess) {
                                                                $scope.clearFormOnSave();
                                                                $scope.reloadUserList();
                                                                $scope.showAlert('Success', 'success', 'Sip User Saved Successfully');
                                                            }
                                                            else {
                                                                var errMsg = data3.CustomMessage;

                                                                if (data3.Exception) {
                                                                    errMsg = 'Assign user to extension error : ' + data3.Exception.Message;
                                                                }
                                                                $scope.clearFormOnSave();
                                                                $scope.reloadUserList();

                                                                $scope.showAlert('Saved with errors', 'error', errMsg);
                                                            }
                                                        }, function (err) {
                                                            loginService.isCheckResponse(err);
                                                            $scope.clearFormOnSave();
                                                            $scope.reloadUserList();
                                                            $scope.showAlert('Saved with errors', 'error', 'Communication error occurred - while assigning extension');

                                                        })
                                                    }
                                                    else {
                                                        var errMsg = data2.CustomMessage;

                                                        if (data2.Exception) {
                                                            errMsg = 'Create extension error : ' + data2.Exception.Message;
                                                        }

                                                        $scope.clearFormOnSave();
                                                        $scope.reloadUserList();

                                                        $scope.showAlert('Saved with errors', 'error', errMsg);
                                                    }
                                                }, function (err) {
                                                    loginService.isCheckResponse(err);
                                                    $scope.clearFormOnSave();
                                                    $scope.reloadUserList();
                                                    $scope.showAlert('Saved with errors', 'error', 'Communication error occurred - while creating extension');
                                                })

                                            }
                                            else {
                                                var errMsg = data1.CustomMessage;

                                                if (data1.Exception) {
                                                    errMsg = 'Get context Error : ' + data1.Exception.Message;
                                                }

                                                $scope.showAlert('Error', 'error', errMsg);
                                            }

                                        }, function (err) {
                                            loginService.isCheckResponse(err);
                                            $scope.showAlert('Error', 'error', 'Communication error occurred - user not saved');
                                        });
                                    }
                                }
                                else {
                                    $scope.showAlert('Error', 'error', 'Error occurred while validating extension');
                                }

                            }).catch(function (err) {
                                loginService.isCheckResponse(err);
                                $scope.showAlert('Error', 'error', 'Error occurred while validating extension');
                            });
                        }
                    }
                    else {
                        $scope.showAlert('Error', 'error', 'Error occurred while validating Sip User');
                    }

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Error occurred while validating Sip User');
                });


            }

        };


        sipUserApiHandler.getContexts().then(function (data) {
            if (data.IsSuccess) {
                $scope.contextList = data.Result;
            }
            else {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = 'Get context Error : ' + data.Exception.Message;
                }
                $scope.showAlert('Error', 'error', errMsg);
            }

        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while getting context list";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);


        });


        sipUserApiHandler.getDomains().then(function (data) {
            if (data.IsSuccess) {
                $scope.endUserList = data.Result;
            }
            else {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = 'Get enduser Error : ' + data.Exception.Message;
                }
                $scope.showAlert('Error', 'error', errMsg);
            }

        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while getting end user list";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);


        });

        //update code damith
        //load view mode then change other view
        $scope.viewBtnClick = function (viewState) {
            // 0 view mode || 1 edit mode || 2 new mode

            if ($scope.FormState === 'New') {
                $scope.clearFormOnSave();
                $scope.FormState = 'Cancel';
                $scope.SipUsernameDisplay = 'NEW SIP USER';
            }
            else {
                if ($scope.sipUsrList && $scope.sipUsrList.length > 0) {
                    $scope.FormState = 'New';
                    $scope.SipUsernameDisplay = $scope.sipUsrList[0].SipUsername;
                    $scope.onEditPressed($scope.sipUsrList[0].SipUsername);
                }

                if ($scope.sipUsrList && $scope.sipUsrList.length == 0) {
                    $scope.FormState = 'Cancel';
                    $scope.SipUsernameDisplay = 'NEW SIP USER';
                }
            }
            $scope.viewDivState = viewState;
            if (viewState == 2) {
                $scope.basicConfig = {};
                $scope.IsEdit = false;
            }

            if (viewState == 0) {
                $scope.onEditPressed($scope.sipUsrList[0].SipUsername);
            }
        };


    };


    app.controller("sipUserCtrl", sipUserCtrl);
}());
