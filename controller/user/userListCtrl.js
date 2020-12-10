/**
 * Created by dinusha on 6/12/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var userListCtrl = function ($scope, $q,$timeout, $http, $stateParams, $state, userProfileApiAccess, loginService, $anchorScroll,appAccessManageService, attributeService, companyConfigBackendService, resourceService, $rootScope,ShareData) {

		/** Kasun_Wijeratne_21_MARCH_2018
		 * --------------------------------------------------------------*/
        $scope.adminUserList=[];
    	$scope.newUserView = false;
        $scope.grpSkills = [];
    	$scope.toggleNewUserView = function () {
			$scope.newUserView = !$scope.newUserView;
		};
		$scope.runSIPUserSave = function () {
			$rootScope.$broadcast('SIPUserUploadOn');
		}
		$rootScope.$on('SIPUserSaveSuccess', function () {
			$scope.activeCreateUserTab = 0;
			$scope.newUserView = false;
		});
		/** --------------------------------------------------------------
		 * Kasun_Wijeratne_21_MARCH_2018*/

        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(group) {
                return (group.username.toLowerCase().indexOf(lowercaseQuery) != -1);
                ;
            };
        }


        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.adminUserList) {
                    return $scope.adminUserList;
                }
                else {
                    return [];
                }

            }
            else {
                var results = query ? $scope.adminUserList.filter(createFilterFor(query)) : [];
                return results;
            }

        };

        $scope.onChipDeleteAttr = function (chip) {

            console.log($scope.grpSkills);

            attributeService.removeAttributeFromUserGroup($scope.selectedGroup._id, chip.AttributeId).then(function (response) {
                if (response) {
                    console.info("AddAttributeToGroup : " + response);
                    $scope.showAlert("Info", "info", "Successfully removed " + chip.Attribute);
                    return true;
                }
                else {

                    $scope.showAlert("Error", "error", "Failed to save " + chip.Attribute);
                    return false;
                }
            }, function (error) {
                $scope.showError("Error", "error", "Failed to save " + chip.Attribute);
                return false;
            });
        };

        $scope.onChipAddAttr = function (chip) {

            var addObj = {
                GroupId: $scope.selectedGroup._id,
                GroupName: $scope.selectedGroup.name,
                AttributeId: chip.AttributeId,
                AttributeGroupId: chip.AttributeGroupId
            };
            attributeService.addAttributeToUserGroup(addObj).then(function (response) {
                if (response) {
                    console.info("AddAttributeToGroup : " + response);
                    $scope.showAlert("Info", "info", "Successfully added " + chip.Attribute);
                    return true;
                }
                else {

                    $scope.showAlert("Error", "error", "Failed to save " + chip.Attribute);
                    return false;
                }
            }, function (error) {
                $scope.showError("Error", "error", "Failed to save " + chip.Attribute);
                return false;
            });
        };

        $scope.onChipAdd = function (chip) {

            chip.isTemp = true;
            console.log("add attGroup " + $scope.attributeGroups);

        };

        $anchorScroll();


        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(group) {
                return (group.Attribute.toLowerCase().indexOf(lowercaseQuery) != -1);
                ;
            };
        }

        $scope.querySearchSkills = function (query) {
            if (query === "*" || query === "") {
                if ($scope.attribinfo) {
                    return $scope.attribinfo;
                }
                else {
                    return [];
                }

            }
            else {
                return results = query ? $scope.attribinfo.filter(createFilterFor(query)) : [];
            }

        };

        $scope.isEditing = false;
        $scope.businessUnits = [];
        $scope.newUser = {};
        $scope.newUserGroup = {};
        $scope.newUser.title = 'mr';
        $scope.NewUserLabel = "+";
        $scope.newGroupUsers = [];
        $scope.addMemRole = "user";
        $scope.isScrolled = false;
        $scope.attribinfo = [];

        $scope.searchCriteria = "";

        $scope.NewUserOpened = false;

        $scope.addUserPress = function () {
            $scope.NewUserOpened = !$scope.NewUserOpened;

            if ($scope.NewUserLabel === '+') {
                $scope.NewUserLabel = '-';
            }
            else if ($scope.NewUserLabel === '-') {
                $scope.NewUserLabel = '+';
            }


        };

        var resetForm = function () {
            $scope.newUser = {};
            $scope.NewUserLabel = "+";
            $scope.searchCriteria = "";
            $scope.NewUserOpened = false;
            $scope.newUserGroup = {};
        };

        $scope.viewProfile = function (username) {
            $state.go('console.userprofile', {'username': username});
        };

        $scope.viewPermissions = function (item) {
            $state.go('console.applicationAccessManager', {username: item.username, role: item.user_meta.role});
        };

        var getUserGrpGroup = function()
        {
            attributeService.getGroupByName('User Group').then(function(response)
            {
                if(!response.data || !response.data.IsSuccess)
                {
                    $scope.showAlert("Error", "error", "Error loading fixed group for user groups");

                }
                else
                {
                    if(response.data.Result)
                    {
                        attributeService.GetAttributeByGroupId(response.data.Result.GroupId).then(function (response) {
                            /*scope.attachedAttributes = response.ResAttribute;*/

                            response.forEach(res => {
                                if(res.ResAttribute)
                                {
                                    res.ResAttribute.AttributeGroupId = res.AttributeGroupId;
                                    $scope.attribinfo.push(res.ResAttribute)
                                }});

                            loadUserGroups();


                        }, function (error) {
                            $log.debug("GetAttributeByGroupId err");
                            $scope.showError("Error", "Error", "ok", "There is an error ");
                        });

                    }
                    else
                    {
                        $scope.attribinfo = [];
                    }

                }
            })
        };

        getUserGrpGroup();
        $scope.userList=[];
        $scope.agents=[];


        var loadUsers = function () {

            userProfileApiAccess.getUserCount('all').then(function (row_count) {
                var pagesize = 20;
                var pagecount = Math.ceil(row_count / pagesize);

                var method_list = [];

                for (var i = 1; i <= pagecount; i++) {
                    method_list.push(userProfileApiAccess.LoadUsersByPage('all',pagesize, i));
                }


                $q.all(method_list).then(function (resolveData) {
                    if (resolveData) {
                        resolveData.map(function (data) {
                            var Result= data.Result;
                            Result.map(function (item) {

                                $scope.userList.push(item);
                                $scope.agents.push(item);
                            });
                        });

                    }
                    $scope.getUsersFromActiveDirectory();


                }).catch(function (err) {
                    console.error(err);
                    loginService.isCheckResponse(err);
                    $scope.showAlert("Load Users", "error", "Fail To Get User List.");
                });



            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert("Load Users", "error", "Fail To Get User List.")
            });


            /*userProfileApiAccess.getUsers('all').then(function (data) {
                if (data.IsSuccess) {
                    $scope.userList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }


                $scope.getUsersFromActiveDirectory();

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });*/
        };

        var loadAdminUsers = function () {

            ShareData.getUsersCountByRole().then(function (row_count) {
                var pagesize = 20;
                var pagecount = Math.ceil(row_count / pagesize);

               /* var method_list = [];

                for (var i = 1; i <= pagecount; i++) {
                    method_list.push(ShareData.getUsersByRoleWithPaging(pagesize, i));
                }*/
                $scope.loadUserRec(1,pagecount);

             /*   $q.all(method_list).then(function (resolveData) {
                    if (resolveData) {

                        resolveData.map(function (data) {

                            data.map(function (item) {

                                $scope.adminUserList.push(item);
                            });
                        });

                    }
                    else
                    {
                        $scope.showAlert("Error","Error in loading Admin user details","error");
                    }



                }).catch(function (err) {
                    console.error(err);

                    $scope.showAlert("Error","Error in loading Admin user details","error");
                });*/



            }, function (err) {
                $scope.showAlert("Error","Error in loading Admin user details","error");
            });
            /*userProfileApiAccess.getUsersByRole().then(function (data) {
                if (data.IsSuccess) {
                    $scope.adminUserList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }
            }, function (err) {
                var errMsg = "Error occurred while loading users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            })*/
        };

        $scope.loadUserRec = function(i,pageCount)
        {
            var index=i;
            userProfileApiAccess.LoadUsersByPage('all',20, index).then(function(items)
            {

                items.map(function (item) {
                    $scope.adminUserList.push(item);
                });

                index++;
                if(index<=pageCount)
                {
                    $scope.loadUserRec(index,pageCount);
                }

            },function (err) {
                index++;
                if(index<=pageCount)
                {
                    $scope.loadUserRec(i,pageCount);
                }
            })
        }
        var loadUserGroups = function () {
            userProfileApiAccess.getUserGroups().then(function (data) {
                if (data.IsSuccess) {
                    $scope.userGroupList = data.Result;

                    if ($scope.userGroupList.length > 0) {
                        $scope.loadGroupMembers($scope.userGroupList[0]);
                    }
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
                var errMsg = "Error occurred while loading users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

		$scope.isUserSaving = false;
		$scope.addNewUser = function (isSIP, sipExt) {
			/** Kasun_Wijeratne_21_MARCH_2018
			 * This function has been modified to receive "isSIP" and "sipEct" parameters when creating a user with "Create SIP user" enabled.
			 * isSIP = bool
			 * siExt = SIP extension
			 * --------------------------------------------------------------*/
			if(isSIP) {
				$scope.newUser.veeryaccount = {
					"contact": sipExt+"@duo.media1.veery.cloud",
					"display": sipExt,
					"verified": true,
					"type": "sip"
				};
			}
			/**--------------------------------------------------------------
			 * Kasun_Wijeratne_21_MARCH_2018 - ENDs
			 */
			$scope.isUserSaving = true;
			$scope.sipUserFromUser = {
				SipUsername :"",
				mail :"",
				Password : ""
			};
			userProfileApiAccess.addUser($scope.newUser).then(function (data) {
                if (data.IsSuccess) {
				
				
					 //add scopes To User
                    if($scope.newUser.addScopes && data.Result && data.Result.username ){

                        var username = data.Result.username;

                        //assign navigation
                        appAccessManageService.AddConsoleToUser(username, "AGENT_CONSOLE").then(function (response) {
                            if (response) {

                                $scope.agentscopes = [];

                                $http.get('agentscopes.json')
                                    .success(function(data){
                                        $scope.agentscopes = data;
                                        console.log(data);

                                        // Creating an empty initial promise that always resolves itself
                                        var promise = $q.all([]);

                                        // Iterating list of items.
                                        angular.forEach($scope.agentscopes, function (item) {
                                            promise = promise.then(function () {
                                                return $timeout(function () {
                                                    var editedMenus = item;
                                                    console.log(editedMenus);

                                                    console.log('calling userservice');

                                                    appAccessManageService.AddSelectedNavigationToUser(username, "AGENT_CONSOLE", editedMenus).then(function (response) {

                                                        if (response.IsSuccess) {

                                                            $scope.showAlert("Info", "Info", "navigationData "+ item.menuItem +" Successfully Updated now.", "Updated now.");

                                                        }
                                                        else {
                                                            if (response.CustomMessage) {
                                                                $scope.showAlert('Error', 'error', errMsg);
                                                            }
                                                            else {
                                                                $scope.showAlert('Error', 'error', errMsg);
                                                            }

                                                        }

                                                    }, function (error) {
                                                        $rootScope.$emit('application_access_manager', false);
                                                        $scope.showAlert('Error', 'error', errMsg);
                                                    });


                                                }, 3000);
                                            });
                                        });

                                        promise.finally(function () {
                                            console.log('Adding scopes finished!');
                                        });



                                    })
                                    .error(function(data){
                                        console.log("Error getting data from agentscopes.json");
                                    });

                                    console.log($scope.agentscopes);

                            }else{
                                $scope.showAlert('Error', 'error', errMsg);
                            }
                        }, function (error) {
                            $scope.showAlert('Error', 'error', errMsg);
                        });

                    }


                    //Map Resource To User
                    if ($scope.newUser.mapToResource && data.Result && data.Result.username) {

                        resourceService.SaveResource({ResourceName: data.Result.username}).then(function (response) {
                            if (response.IsSuccess) {

                                resourceService.SetResourceToProfile(response.Result.ResourceName, response.Result.ResourceId).then(function (mappingStatus) {
                                    if (mappingStatus) {
                                        $scope.showAlert("Map To Resource", "info", "Resource " + response.Result.ResourceName + " Successfully Save.");
                                    }else {
                                        $scope.showAlert("Map To Resource", "warn", "Resource " + response.Result.ResourceName + " Save Successfully Without Mapping to Profile.");
                                    }
                                    $scope.showAlert('Success', 'info', 'User added');
									if(isSIP){
										$scope.activeCreateUserTab = 1;
										$scope.sipUserFromUser.SipUsername = $scope.newUser.firstname.toLowerCase();
										$scope.sipUserFromUser.Password = $scope.newUser.password;
									}
                                    resetForm();
                                    loadUsers();
									$scope.isUserSaving = false;
                                }, function (error) {
                                    $scope.showAlert("Map To Resource", "error", "Fail To Map Resource with Profile.");
                                    $scope.showAlert('Success', 'info', 'User added');
									if(isSIP){
										$scope.activeCreateUserTab = 1;
										$scope.sipUserFromUser.SipUsername = $scope.newUser.firstname.toLowerCase();
										$scope.sipUserFromUser.Password = $scope.newUser.password;
										$scope.sipUserFromUser.Email = $scope.newUser.mail;
									}
                                    resetForm();
                                    loadUsers();
									$scope.isUserSaving = false;
								});
                            }
                            else {
                                if (response.CustomMessage == "invalid Resource Name.") {
                                    $scope.showAlert("Map To Resource", "error", "Invalid Resource Name.");
                                }
                                $scope.showAlert('Success', 'info', 'User added');
								if(isSIP){
									$scope.activeCreateUserTab = 1;
									$scope.sipUserFromUser.SipUsername = $scope.newUser.firstname.toLowerCase();
									$scope.sipUserFromUser.Password = $scope.newUser.password;
									$scope.sipUserFromUser.Email = $scope.newUser.mail;
								}
                                resetForm();
                                loadUsers();
								$scope.isUserSaving = false;
                            }

                        }, function (error) {
                            $scope.showAlert('Map To Resource', 'error', 'Failed to map user to resource');
                            $scope.showAlert('Success', 'info', 'User added');
							if(isSIP){
								$scope.activeCreateUserTab = 1;
								$scope.sipUserFromUser.SipUsername = $scope.newUser.firstname.toLowerCase();
								$scope.sipUserFromUser.Password = $scope.newUser.password;
								$scope.sipUserFromUser.Email = $scope.newUser.mail;
							}
                            resetForm();
                            loadUsers();
							$scope.isUserSaving = false;
						});

                    } else {

                        $scope.showAlert('Success', 'info', 'User added');
						if(isSIP){
							$scope.activeCreateUserTab = 1;
							$scope.sipUserFromUser.SipUsername = $scope.newUser.firstname.toLowerCase();
							$scope.sipUserFromUser.Password = $scope.newUser.password;
							$scope.sipUserFromUser.Email = $scope.newUser.mail;
						}
                        resetForm();
                        loadUsers();
						$scope.isUserSaving = false;
					}


                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
					$scope.isUserSaving = false;
				}

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error adding user";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
				$scope.isUserSaving = false;
			});
        };

		$scope.activeCreateUserTab = 0;
        $scope.addNewSIPUser = function (direction) {
			direction == 'up' ? $scope.activeCreateUserTab++ : $scope.activeCreateUserTab--;
		}

        loadUsers();
        loadAdminUsers();


        $scope.removeUser = function (user) {


            console.log(user.Active);
            if (user.Active) {

                if (!$scope.disableSwitch) {

                    $scope.safeApply(function () {
                        $scope.disableSwitch = true;
                    });

                    console.log("activate");

                    new PNotify({
                        title: 'Confirm Reactivation',
                        text: 'Are You Sure You Want To Reactivate User ?',
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
                    }).get().on('pnotify.confirm', function () {
                        userProfileApiAccess.ReactivateUser(user.username).then(function (data) {
                            if (data.IsSuccess) {
                                $scope.showAlert('Success', 'info', 'User Reactivated');
                                $scope.safeApply(function () {
                                    $scope.disableSwitch = false;
                                });
                            }
                            else {
                                var errMsg = "";
                                $scope.safeApply(function () {
                                    user.Active = false;
                                    $scope.disableSwitch = false;
                                });


                                if (data.Exception) {
                                    errMsg = data.Exception.Message;
                                }

                                if (data.CustomMessage) {
                                    errMsg = data.CustomMessage;
                                }
                                $scope.showAlert('Error', 'error', errMsg);
                            }

                        }, function (err) {
                            $scope.safeApply(function () {
                                user.Active = false;
                                $scope.disableSwitch = false;
                            });
                            loginService.isCheckResponse(err);
                            var errMsg = "Error occurred while deleting contact";
                            if (err.statusText) {
                                errMsg = err.statusText;
                            }
                            $scope.showAlert('Error', 'error', errMsg);
                        });
                    }).on('pnotify.cancel', function () {
                        $scope.safeApply(function () {
                            user.Active = false;
                            $scope.disableSwitch = false;
                        });
                    });
                }

            } else {
                console.log("deactivate");
                if (!$scope.disableSwitch) {

                    $scope.safeApply(function () {
                        $scope.disableSwitch = true;
                    });
                    new PNotify({
                        title: 'Confirm Deletion',
                        text: 'Are You Sure You Want To Deactivate User ?',
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
                    }).get().on('pnotify.confirm', function () {
                        userProfileApiAccess.deleteUser(user.username).then(function (data) {
                            if (data.IsSuccess) {
                                $scope.showAlert('Success', 'info', 'User Deleted');
                                $scope.safeApply(function () {
                                    $scope.disableSwitch = false;
                                });
                            }
                            else {
                                var errMsg = "";
                                $scope.safeApply(function () {
                                    user.Active = true;
                                    $scope.disableSwitch = false;
                                });

                                if (data.Exception) {
                                    errMsg = data.Exception.Message;
                                }

                                if (data.CustomMessage) {
                                    errMsg = data.CustomMessage;
                                }
                                $scope.showAlert('Error', 'error', errMsg);
                            }

                        }, function (err) {
                            $scope.safeApply(function () {
                                user.Active = true;
                                $scope.disableSwitch = false;
                            });
                            loginService.isCheckResponse(err);
                            var errMsg = "Error occurred while deleting contact";
                            if (err.statusText) {
                                errMsg = err.statusText;
                            }
                            $scope.showAlert('Error', 'error', errMsg);
                        });
                    }).on('pnotify.cancel', function () {
                        $scope.safeApply(function () {
                            user.Active = true;
                            $scope.disableSwitch = false;
                        });
                    });
                }
            }

        };

        $scope.removeSupervisor = function (userId) {

            new PNotify({
                title: 'Confirmation Needed',
                text: 'Do you want to remove Supervisor from this Group',
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
                },
                addclass: 'stack-modal',
            }).get().on('pnotify.confirm', function () {
                $scope.selectedGroup.supervisors = $scope.selectedGroup.supervisors.filter(function (item) {

                    return item._id != userId;
                });

                var updateObj =
                    {
                        supervisors: $scope.selectedGroup.supervisors
                    };


                userProfileApiAccess.updateUserGroup($scope.selectedGroup._id, updateObj).then(function (resUpdate) {
                    if (resUpdate.IsSuccess) {
                        $scope.showAlert("Success", "success", "Supervisor removed successfully");
                    }
                    else {
                        $scope.showAlert("Error", "error", "Supervisor removing failed");
                    }
                }, function (errUpdate) {
                    $scope.showAlert("Error", "error", "Supervisor removing failed");
                });
            }).on('pnotify.cancel', function () {
                console.log('fire event cancel');
            });


        };


        $scope.addNewUserGroup = function () {
            userProfileApiAccess.addUserGroup($scope.newUserGroup).then(function (response) {

                if (response.IsSuccess) {
                    $scope.showAlert("New User group", "success", "New User Group Added Successfully");
                    resetForm();
                    loadUserGroups();
                }
                else {
                    $scope.showAlert("New User group", "error", "New User Group Adding Failed");
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert("New User group", "error", "Error In New User Group Adding");
            })
        };

        $scope.showMembers = false;


        /*update code damith*/
        $scope.groupMemberlist = [];
        $scope.isLoadingUsers = false;
        $scope.selectedGroup = null;
        var removeAllocatedAgents = function () {
            $scope.groupMemberlist.filter(function (member) {
                $scope.agents.filter(function (agent) {
                    if (agent._id == member._id) {
                        $scope.agents.splice($scope.agents.indexOf(agent), 1);
                    }
                })
            })
        };

        $scope.loadGroupMembers = function (group) {

            if (!$scope.isEditing) {
                $scope.grpSkills = [];
                $scope.groupMemberlist = [];
                $scope.isLoadingUsers = true;
                $scope.selectedGroup = group;

                attributeService.getSkillsForUserGroup(group._id).then(function(sRes)
                {
                    if(sRes.IsSuccess && sRes.Result && sRes.Result.length > 0)
                    {
                        if($scope.attribinfo && $scope.attribinfo.length > 0)
                        {
                            $scope.attribinfo.filter(attr => {
                                sRes.Result.forEach(sg => {
                                    if(sg.AttributeId === attr.AttributeId)
                                    {
                                        $scope.grpSkills.push(attr);
                                    }

                                })
                            });
                        }

                    }

                }).catch(function(err)
                {
                    $scope.showAlert("Error", "error", "Error loading user group skills");

                });

                userProfileApiAccess.getGroupMembers(group._id).then(function (response) {
                    if (response.IsSuccess) {
                        $scope.groupMemberlist = response.Result;
                        //removeAllocatedAgents()
                    }
                    else {
                        console.log("Error in loading Group member list");
                        //scope.showAlert("User removing from group", "error", "Error in removing user from group");
                    }
                    $scope.isLoadingUsers = false;
                }, function (err) {
                    console.log("Error in loading Group member list ", err);
                    //scope.showAlert("User removing from group", "error", "Error in removing user from group");
                });
            }

        };


        //remove group member
        $scope.removeGroupMember = function (userID) {
            //confirm box
            new PNotify({
                title: 'Confirmation Needed',
                text: 'Are you sure?',
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
                },
                addclass: 'stack-modal',
            }).get().on('pnotify.confirm', function () {
                userProfileApiAccess.removeUserFromGroup($scope.selectedGroup._id, userID).then(function (response) {
                    if (response.IsSuccess) {
                        $scope.groupMemberlist.filter(function (userObj) {
                            if (userObj._id == userID) {
                                $scope.groupMemberlist.splice($scope.groupMemberlist.indexOf(userObj), 1);
                                $scope.agents.push(userObj);
                                $scope.showAlert("User Removing From Group", "success", "User Removed From Group Successfully");
                            }
                        });
                    }
                    else {
                        $scope.showAlert("User Removing From Group", "error", "Error In Removing User From Group");
                    }
                }, function (error) {
                    $scope.showAlert("User Removing From Group", "error", "User Removing From Group Failed");
                });
            }).on('pnotify.cancel', function () {
                console.log('fire event cancel');
            });

        };


        //create new group
        $scope.createNewGroup = function () {
            $('#crateNewGroupWrapper').animate({
                top: "0"
            }, 500);
        };
        $scope.hiddenNewGroupDIV = function () {
            $('#crateNewGroupWrapper').animate({
                top: "-200px"
            }, 500);
        };


        $scope.addNewGroupMember = function (memState) {
            $anchorScroll();
            $scope.isOpen = true;
            $('#crateNewGroupMemberWrapper').animate({
                top: "0"
            }, 500);
            $('#fixedCreateNew').animate({
                opacity: 1,
                "z-index": 1
            }, 200);


            if (memState.toLowerCase() == 'member') {
                $scope.addingTitle = "Add Group Member";
                $scope.addMemRole = "member";
            }
            else {
                $scope.addingTitle = "Add Group Supervisor";
                $scope.addMemRole = "supervisor";
            }


        };

        $scope.hiddenNewGroupMember = function () {
            $('#crateNewGroupMemberWrapper').animate({
                top: "-200px"
            }, 500);

            $('#fixedCreateNew').animate({
                opacity: 0,
                "z-index": -1
            }, 200);

            $scope.isOpen = false;
        };

        $scope.showUnits = false;
        $scope.showIt = function () {
            $scope.showUnits = !$scope.showUnits
        }


        //add user to group

        //get all agents
        //onload
        $scope.loadAllAgents = function () {

            /*userProfileApiAccess.getUserCount('all').then(function (row_count) {
                var pagesize = 20;
                var pagecount = Math.ceil(row_count / pagesize);

                var method_list = [];

                for (var i = 1; i <= pagecount; i++) {
                    method_list.push(userProfileApiAccess.LoadUsersByPage('all',pagesize, i));
                }


                $q.all(method_list).then(function (resolveData) {
                    if (resolveData) {
                        resolveData.map(function (data) {
                            var Result= data.Result;
                            Result.map(function (item) {

                                $scope.agents.push(item);
                            });
                        });

                    }
                    removeAllocatedAgents();


                }).catch(function (err) {
                    $scope.showAlert("Loading Agent details", "error", "Error In Loading Agent Details");
                });



            }, function (err) {

                $scope.showAlert("Load Users", "error", "Fail To Get User List.")
            });*/
            removeAllocatedAgents();


           /*
            userProfileApiAccess.getUsers().then(function (data) {
                if (data.IsSuccess) {
                    $scope.agents = data.Result;
                    removeAllocatedAgents();
                }
            }, function (error) {
                $scope.showAlert("Loading Agent details", "error", "Error In Loading Agent Details");
            });*/
        };
        $scope.loadAllAgents();

        //add new member to current selected group
        $scope.addUserToGroup = function (userID) {
            userProfileApiAccess.addMemberToGroup($scope.selectedGroup._id, userID).then(function (response) {
                if (response.IsSuccess) {
                    $scope.agents.filter(function (userObj) {
                        if (userObj._id == userID) {
                            $scope.groupMemberlist.push(userObj);
                            $scope.showAlert("Member Added To Group", "success", "Member Added To Group Successfully");
                            removeAllocatedAgents();
                        }
                    })
                }
                else {
                    $scope.showAlert("Member Added To Group", "error", "Error In Member Adding To Group");
                }
            }, function (error) {
                $scope.showAlert("Member Added To Group", "error", "Member Added To Group Failed");
            })
        };

        $scope.showPasswordHints = function () {

            $scope.pwdBox = !$scope.pwdBox;
        };
        // $scope.$watch(function () {
        //
        //     if($scope.isOpenAdd)
        //     {
        //         $scope.hiddenNewGroupMember();
        //     }
        //
        // });


        $(document).bind('scroll', function () {

            if ($scope.isOpen) {
                $scope.hiddenNewGroupMember();
            }


        });

        //-------------------------Active Directory-------------------------------------

        $scope.activeDirectoryUsers = [];
        $scope.selectedADUsers = {agents: [], supervisors: []};

        $scope.adSearchCriteria = "";

        $scope.getUsersFromActiveDirectory = function () {
            $scope.activeDirectoryUsers = [];
            $scope.selectedADUsers = {agents: [], supervisors: []};

            function pushAdUser(ad_user, isProfileExists, userRole) {

                switch (userRole) {
                    case 'supervisor':
                        $scope.selectedADUsers.supervisors.push(ad_user);
                        break;
                    case 'agent':
                        $scope.selectedADUsers.agents.push(ad_user);
                        break;
                    default :
                        break;
                }


                ad_user.isProfileExists = isProfileExists;

                $scope.activeDirectoryUsers.push(ad_user);
            }

            companyConfigBackendService.getUsersFromActiveDirectory().then(function (response) {
                if (response.IsSuccess) {

                    response.Result.forEach(function (ad_user) {
                        var isExist = false;
                        for (var i = 0; i < $scope.userList.length; i++) {
                            var system_user = $scope.userList[i];
                            if (system_user.username && ad_user.userPrincipalName && system_user.username === ad_user.userPrincipalName) {
                                isExist = true;
                                pushAdUser(angular.copy(ad_user), true, system_user.user_meta.role);
                                break;
                            }
                        }

                        if (!isExist)
                            pushAdUser(angular.copy(ad_user), false, undefined);
                    });


                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    //$scope.showAlert('Active Directory', errMsg, 'error');
                    console.log('active directory error' + errMsg);
                }
            }, function (err) {
                var errMsg = "Error Occurred While Retrieving Active Directory Users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                //$scope.showAlert('Active Directory', errMsg, 'error');
                console.log('active directory error' + errMsg);
            });

        };

        $scope.createUserFromAD = function (adUser) {

            var userRole = ($scope.selectedADUsers.agents.indexOf(adUser) > -1) ? "agent" : undefined;
            if (!userRole) {
                userRole = ($scope.selectedADUsers.supervisors.indexOf(adUser) > -1) ? "supervisor" : undefined;
            }

            if (userRole) {
                if (adUser.sAMAccountName && adUser.mail && adUser.userPrincipalName) {
                    var newUser = {
                        firstname: adUser.givenName,
                        lastname: adUser.sn,
                        mail: adUser.mail,
                        name: adUser.sAMAccountName,
                        username: adUser.userPrincipalName,
                        role: userRole
                    };
                    userProfileApiAccess.addUserFromAD(newUser).then(function (data) {
                        if (data.IsSuccess) {
                            $scope.showAlert('Success', 'info', 'User added');
                            loadUsers();
                        }
                        else {
                            var errMsg = "";
                            if (data.Exception && data.Exception.Message) {
                                errMsg = data.Exception.Message;
                            }

                            if (data.CustomMessage) {
                                errMsg = data.CustomMessage;
                            }
                            $scope.showAlert('Error', 'error', errMsg);
                        }

                    }, function (err) {
                        loginService.isCheckResponse(err);
                        var errMsg = "Error adding user";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });
                } else {
                    $scope.showAlert('Error', 'error', "Insufficient Data To Create User");
                }
            } else {
                $scope.showAlert('Error', 'error', "Select User Role");
            }

        };

        $scope.userActiveCheck = false;

        $scope.checkEditing = function () {
            $scope.isEditing = !$scope.isEditing;
        }

        $scope.loadBusinessUnits = function () {

            if(ShareData.BusinessUnits && ShareData.BusinessUnits.length>0)
            {
                $scope.businessUnits = ShareData.BusinessUnits;
            }
            else {
                userProfileApiAccess.getBusinessUnits().then(function (resUnits) {
                    if (resUnits.IsSuccess) {
                        $scope.businessUnits = resUnits.Result;
                    }
                    else {
                        $scope.showAlert("Business Unit", "error", "No Business Units found");
                    }
                }, function (errUnits) {
                    $scope.showAlert("Business Unit", "error", "Error in searching Business Units");
                });
            }


        }
        $scope.loadBusinessUnits();

        $scope.addSupervisorsToGroup = function () {


            var updateObj =
                {
                    supervisors: $scope.selectedGroup.supervisors

                }


            userProfileApiAccess.updateUserGroup($scope.selectedGroup._id, updateObj).then(function (resUpdate) {
                if (resUpdate.IsSuccess) {
                    $scope.showAlert("Business Unit", "success", "Supervisors of Group updated successfully");
                    $scope.selectedGroup.supervisors.forEach(function (item) {

                        item.isTemp = false;
                    });


                }
                else {
                    $scope.showAlert("Business Unit", "error", "Error in updating Supervisors of Group");
                }
            }, function (errUpdate) {
                $scope.showAlert("Business Unit", "error", "Error in updating Supervisors of Group");
            });


        }


    };


    app.controller("userListCtrl", userListCtrl);
}());
