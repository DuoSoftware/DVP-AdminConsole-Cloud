/**
 * Created by dinusha on 6/5/2016.
 */

(function () {
    var app = angular.module("veeryConsoleApp");

    var ringGroupCtrl = function ($scope, $filter, sipUserApiHandler, loginService,$anchorScroll,$q) {


        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.currentGroupUsers = [];
        $scope.searchText = null;
        $scope.selectedItem = null;
        $scope.IsEdit = false;
        $scope.EditState = 'New Group';
        $scope.dataLoaded = false;
        var emptyArr = [];

        var clearFormOnSave = function () {
            $scope.basicConfig = {};
            $scope.currentGroupUsers = [];
        };

        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.sipUsrList) {
                    return $scope.sipUsrList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.sipUsrList) {
                    var filteredArr = $scope.sipUsrList.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.SipUsername) {
                            return item.SipUsername.match(regEx);
                        }
                        else {
                            return false;
                        }

                    });

                    return filteredArr;
                }
                else {
                    return emptyArr;
                }
            }

        };

        $scope.reloadUserList = function () {


            $scope.sipUsrList = [];

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

                                var tempUsr =
                                    {
                                        SipUsername: item.SipUsername,
                                        id: item.id
                                    };

                                $scope.sipUsrList.push(tempUsr);



                            });


                        });

                    }
                    $scope.dataReady = true;

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', err);
                    $scope.dataReady = true;
                });



            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', err);
                $scope.dataReady = true;


            });



           /* sipUserApiHandler.getSIPUsers().then(function (data) {
                if (data.IsSuccess) {
                    $scope.sipUsrList = data.Result.map(function (item) {
                        var tempUsr =
                        {
                            SipUsername: item.SipUsername,
                            id: item.id
                        };

                        return tempUsr;
                    });
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
                var errMsg = "Error occurred while getting pabx user list";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
                $scope.dataReady = true;
            });*/
        };

        $scope.reloadGroupList = function () {
            sipUserApiHandler.getGroups().then(function (data) {
                if (data.IsSuccess) {
                    $scope.groupList = data.Result;
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
                var errMsg = "Error occurred while getting group list";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
                $scope.dataReady = true;
            });
        };

        $scope.onChipAdd = function (chip) {
            $scope.dataLoaded = false;
            sipUserApiHandler.addUserToGroup(chip.id, $scope.basicConfig.id).then(function (data) {
                if (data.IsSuccess) {
                    reloadUsersInGroup($scope.basicConfig.id);
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
                var errMsg = "Error occurred while getting users for group";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
            return chip;
        };

        $scope.onChipDelete = function (chip) {
            $scope.dataLoaded = false;
            sipUserApiHandler.removeUserFromGroup(chip.id, $scope.basicConfig.id).then(function (data) {
                if (data.IsSuccess) {
                    reloadUsersInGroup($scope.basicConfig.id);
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
                var errMsg = "Error occurred while getting users for group";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
            return chip;
        };

        $scope.onNewPressed = function () {
            $scope.IsEdit = false;
            $scope.EditState = 'New Group';
            $scope.dataLoaded = false;
            clearFormOnSave();
        };

        $scope.onSavePressed = function () {
            if ($scope.IsEdit) {
                //update

                sipUserApiHandler.updateGroup($scope.basicConfig).then(function (data) {
                    if (data.IsSuccess) {
                        $scope.showAlert('SUCCESS', 'info', 'Group updated successfully');
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
                    var errMsg = "Error occurred while updating group";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }

                    $scope.showAlert('Error', 'error', errMsg);
                });
            }
            else {
                //save
                sipUserApiHandler.saveGroup($scope.basicConfig).then(function (data) {
                    if (data.IsSuccess) {
                        var extObj = {
                            Extension: $scope.basicConfig.Extension.Extension,
                            ExtensionName: $scope.basicConfig.GroupName,
                            ExtraData: "",
                            AddUser: "",
                            UpdateUser: "",
                            Enabled: true,
                            ExtRefId: $scope.basicConfig.GroupName,
                            ObjCategory: "GROUP"
                        };

                        sipUserApiHandler.addNewExtension(extObj).then(function (data2) {
                            if (data2.IsSuccess) {

                                sipUserApiHandler.assignExtensionToGroup(extObj.Extension, data.Result.id).then(function (data3) {
                                    if (data3.IsSuccess) {
                                        clearFormOnSave();
                                        $scope.reloadGroupList();
                                        $scope.showAlert('Success', 'info', 'Group Saved Successfully');
                                    }
                                    else {
                                        var errMsg = data3.CustomMessage;

                                        if (data3.Exception) {
                                            errMsg = 'Assign group to extension error : ' + data3.Exception.Message;
                                        }
                                        clearFormOnSave();
                                        $scope.reloadGroupList();

                                        $scope.showAlert('Saved with errors', 'error', errMsg);
                                    }
                                }, function (err) {
                                    loginService.isCheckResponse(err);
                                    clearFormOnSave();
                                    $scope.reloadGroupList();
                                    $scope.showAlert('Saved with errors', 'error', 'Communication error occurred - while assigning extension');

                                })
                            }
                            else {
                                var errMsg = data2.CustomMessage;

                                if (data2.Exception) {
                                    errMsg = 'Create extension error : ' + data2.Exception.Message;
                                }

                                clearFormOnSave();
                                $scope.reloadGroupList();

                                $scope.showAlert('Saved with errors', 'error', errMsg);
                            }
                        }, function (err) {
                            loginService.isCheckResponse(err);
                            clearFormOnSave();
                            $scope.reloadGroupList();
                            $scope.showAlert('Saved with errors', 'error', 'Communication error occurred - while creating extension');
                        })


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
                    var errMsg = "Error occurred while saving group";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }

                    $scope.showAlert('Error', 'error', errMsg);
                });

            }
        }

        $scope.onDeletePressed = function (grpId, extension) {
            sipUserApiHandler.deleteGroup(grpId).then(function (data) {
                if (data.IsSuccess) {
                    if (extension) {
                        sipUserApiHandler.deleteExtension(extension).then(function (data2) {
                            if (data2.IsSuccess) {
                                $scope.showAlert('SUCCESS', 'info', 'Group deleted successfully');
                                clearFormOnSave();
                                $scope.reloadGroupList();
                            }
                            else {
                                $scope.showAlert('SUCCESS', 'notify', 'Group deleted successfully - Unable to remove extension, please remove it manually');
                                clearFormOnSave();
                                $scope.reloadGroupList();
                            }

                        });
                    }
                    else {
                        $scope.showAlert('SUCCESS', 'info', 'Group deleted successfully');
                        clearFormOnSave();
                        $scope.reloadGroupList();
                    }


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
                var errMsg = "Error occurred while deleting group";
                if (err.statusText) {
                    errMsg = err.statusText;
                }

                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var reloadUsersInGroup = function (grpId) {
            $scope.dataLoaded = false;
            sipUserApiHandler.getUsersForGroup(grpId).then(function (data) {
                $scope.dataLoaded = true;
                if (data.IsSuccess) {
                    if (data.Result && data.Result.SipUACEndpoint) {
                        $scope.currentGroupUsers = data.Result.SipUACEndpoint.map(function (item) {
                            var tempUsr =
                            {
                                SipUsername: item.SipUsername,
                                id: item.id
                            };

                            return tempUsr;
                        });

                    }

                }
                else {
                    $scope.dataLoaded = true;
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.dataLoaded = true;
                var errMsg = "Error occurred while getting users for group";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        }

        $scope.onGroupChange = function (grpId) {
            reloadUsersInGroup(grpId);


            sipUserApiHandler.getGroup(grpId).then(function (data) {
                if (data.IsSuccess) {
                    $scope.IsEdit = true;
                    $scope.EditState = 'Edit Group';
                    $scope.basicConfig = data.Result;
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
                var errMsg = "Error occurred while getting group list";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

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

        $scope.reloadUserList();
        $scope.reloadGroupList();

    }

    app.controller("ringGroupCtrl", ringGroupCtrl);
}())
