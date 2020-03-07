/**
 * Created by Rajinda on 5/30/2016.
 */
mainApp.directive("conferenceitem", function ($filter, $uibModal, $log, conferenceService,$q) {

    return {
        restrict: "EA",
        scope: {
            endUsers: "=",
            sipUsrs: "=",
            conferenceData: "=",
            templatesList: "=",
            reloadPageAfterDelete: '&'
        },
        templateUrl: 'conference_app/views/conferenceItem.html',
        link: function (scope, element, attributes) {
            //angular.copy(scope.sipUsrs, scope.sipUsers);
            scope.sipUsers =[];
            scope.showError = function (tittle, content) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: 'error',
                    styling: 'bootstrap3'
                });
            };
            scope.isLoading = false;
            scope.reloadPage = function () {
                scope.isLoading = true;
                scope.editMode = false;
                scope.addUserMode = false;
                scope.LoadConferenceUsers();
                scope.LoadSipUsers();
                scope.LoadExtentions();
            };

            scope.LoadExtentions = function () {
                conferenceService.GetExtensionsByConfRoom(scope.conferenceData.ConferenceName).then(function (response) {
                    scope.extensionList = response;
                    var items = $filter('filter')(response, {id: scope.conferenceData.ExtensionId});
                    if (items.length > 0) {
                        scope.conferenceData.Extension = items[0].Extension;
                    }

                }, function (error) {
                    scope.showAlert('Error', 'error', "Fail To Get Extentions.");
                });
            };
            scope.LoadExtentions();

            /*conference User*/
            scope.LoadConferenceUsers = function () {
                conferenceService.GetConferenceUsers(scope.conferenceData.ConferenceName).then(function (response) {
                    scope.conferenceExistingUsers = response;
                    scope.removeExistingUsers();
                    scope.isLoading = false;
                }, function (error) {
                    scope.isLoading = false;
                    scope.showAlert("Error", "error", "Fail To Get Conference " + scope.conferenceData.ConferenceName + " User List");
                });

            };
            scope.LoadConferenceUsers();


            scope.sipUserDetailsToMapWithExsiting = [];

            scope.LoadSipUsers = function () {

                //scope.sipUsers = scope.sipUsrs;
                angular.copy(scope.sipUsrs, scope.sipUsers);
                angular.copy(scope.sipUsers, scope.sipUserDetailsToMapWithExsiting);
                if(scope.sipUsers)
                {
                    scope.removeExistingUsers();
                }

                //scope.sipUsers = [];

               /* conferenceService.getSipUsersCount().then(function (row_count) {
                    var pagesize = 20;
                    var pagecount = Math.ceil(row_count / pagesize);

                    var method_list = [];

                    for (var i = 1; i <= pagecount; i++) {
                        method_list.push(conferenceService.getSipUsersWithPaging(i,pagesize));
                    }


                    $q.all(method_list).then(function (resolveData) {
                        if (resolveData) {
                            resolveData.map(function (response) {

                                response.map(function (item) {

                                        scope.sipUsers.push(item);

                                });


                            });

                        }

                        angular.copy(scope.sipUsers, scope.sipUserDetailsToMapWithExsiting);
                        scope.removeExistingUsers();

                    }).catch(function (err) {
                        $log.debug("GetUserByBusinessUnit err");
                        scope.showError("Error", "Error in loading users");
                    });



                }, function (err) {
                    $log.debug("Get Sip user count  err");
                    scope.showError("Error", "Error in loading sip users");
                });*/


                /*conferenceService.GetSipUsers().then(function (response) {
                    scope.sipUsers = response;
                    angular.copy(scope.sipUsers, scope.sipUserDetailsToMapWithExsiting);
                    scope.removeExistingUsers();
                }, function (error) {
                    scope.showAlert("Error", "error", "Fail To Get User List.");
                });*/
            };
           //scope.LoadSipUsers();

            /*scope.newSipUsers = [];
             scope.handleClick = function (confirmed, user) {
             if (confirmed) {
             scope.newSipUsers.push(user);
             } else {

             var index = scope.newSipUsers.indexOf(user);
             scope.newSipUsers.splice(index, 1);
             }
             };*/

            scope.addDestination = function (user) {
                scope.AddUserToConference(user);
            };

            scope.addNewUsers = function (user) {
                user.SipUACEndpointId = user.id;
                scope.AddUserToConference(user);
            };

            scope.AddUserToConference = function (user) {
                conferenceService.AddUserToConference(scope.conferenceData.ConferenceName, user).then(function (response) {
                    if (response) {
                        scope.LoadConferenceUsers();
                        var index = scope.sipUsers.indexOf(user);
                        if (index > -1) {
                            scope.sipUsers.splice(index, 1);
                        }
                        scope.showAlert("Add User", "success", "User Added Successfully");
                        scope.user.Destination = "";
                    } else {
                        scope.showAlert("Add User", "error", "Fail To Add User To Conference.");
                    }
                }, function (error) {
                    scope.showAlert("Add User", "error", "Fail To Add User To Conference.");
                });
            };

            scope.removeExistingUsers = function () {

                if(scope.sipUsers && !scope.sipUsers.length==0)
                {
                    angular.forEach(scope.conferenceExistingUsers, function (item) {
                        var items = $filter('filter')(scope.sipUserDetailsToMapWithExsiting, {id: item.SipUACEndpointId});
                        item.sipUser = items[0];
                        var sipItem = $filter('filter')(scope.sipUsers, {id: item.SipUACEndpointId});
                        var index = scope.sipUsers.indexOf(sipItem[0]);
                        if (index > -1) {
                            scope.sipUsers.splice(index, 1);
                        }
                    })
                }

            };

            scope.UpdateConferenceUserModes = function (user) {
                var modes = {};
                modes.Def = user.Def;
                modes.Mute = user.Mute;
                modes.Mod = user.Mod;

                conferenceService.UpdateConferenceUserModes(user.id, modes).then(function (response) {
                    if (response) {
                        scope.showAlert("Add user", "success", "User " + user.sipUser.SipUsername + " Mode Update successfully");
                    } else {
                        scope.showAlert("Error", "error", "Fail To Update User " + user.sipUser.SipUsername + " Mode.");
                    }
                }, function (error) {
                    scope.showAlert("Error", "error", "Fail To Update User " + user.sipUser.SipUsername + " Mode.");
                });


            };

            scope.DeleteConferenceUser = function (user) {
                conferenceService.DeleteConferenceUser(user.id).then(function (response) {
                    if (response) {
                        scope.LoadSipUsers();
                        scope.LoadConferenceUsers();
                        scope.showAlert("Delete User", "success", "User " + user.sipUser.SipUsername + " Delete successfully");
                    } else {
                        scope.showAlert("Error", "error", "Fail To Remove User " + user.sipUser.SipUsername + " From Chat Room");
                    }

                }, function (error) {
                    scope.showAlert("Error", "error", "Fail To Delete User " + user.sipUser.SipUsername);
                });
            };


            /*conference User*/

            scope.conferenceData.Pin = parseInt(scope.conferenceData.Pin);

            scope.StartTime = {
                date: new Date(scope.conferenceData.StartTime)
            };
            scope.EndTime = {
                date: new Date(scope.conferenceData.EndTime)
            };

            scope.conferenceData.StartTime = scope.StartTime.date;
            scope.conferenceData.EndTime = scope.EndTime.date;


            scope.openCalendar = function (name) {
                if (name == 'StartTime') {
                    scope.StartTime.open = true;
                }
                else {
                    scope.EndTime.open = true;
                }

            };

            scope.conferenceData.Template = scope.conferenceData.ActiveTemplate;

            scope.previewTemplate = function (template) {

                var items = $filter('filter')(scope.templatesList, {TemplateName: template});
                if (items) {
                    var index = scope.templatesList.indexOf(items[0]);
                    if (index > -1) {
                        if (!scope.conferenceData.MaxUser)
                            scope.conferenceData.MaxUser = 0;

                        var template = items[0];
                        if (template.MaxUsers < scope.conferenceData.MaxUser) {
                            scope.showAlert('Error', 'error', "Template Only Support " + template.MaxUsers + " Users. Please Change User Count or Select Different Template.");
                            return;
                        }

                        var modalInstance = $uibModal.open({
                            animation: false,
                            templateUrl: 'conference_app/views/conTemplateModal.html',
                            controller: 'confModalInstanceCtrl',
                            size: 'sm',
                            resolve: {
                                template: function () {
                                    return template;
                                }
                            }
                        });

                        modalInstance.result.then(function (selectedItem) {
                            scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });

                    }
                }


            };


            scope.editMode = false;
            scope.editConference = function (confData) {
                if (confData.StartTime <= new Date()) {
                    scope.showAlert("Edit Conference", "notify", "Running or Past Conference[" + confData.ConferenceName + "], Cannot update.");
                    return;
                }

                scope.editMode = !scope.editMode;
                scope.addUserMode = false;
                //scope.LoadSipUsers();


            };

            scope.addUserMode = false;
            scope.addUserToConference = function (confData) {
                if (confData.EndTime <= new Date()) {
                    scope.showAlert("Edit Conference", "notify", "Cannot Modify Past Conference[" + confData.ConferenceName + "]");
                    return;
                }
                scope.addUserMode = !scope.addUserMode;
                scope.editMode = false;
                scope.LoadSipUsers();
            };

            scope.updateConference = function (conference) {
                var items = $filter('filter')(scope.templatesList, {TemplateName: conference.ActiveTemplate});
                if (items) {
                    var index = scope.templatesList.indexOf(items[0]);
                    if (index > -1) {
                        if (!scope.conferenceData.MaxUser)
                            scope.conferenceData.MaxUser = 0;

                        var template = items[0];
                        if (template.MaxUsers < scope.conferenceData.MaxUser) {
                            scope.showAlert('Error', 'error', "Template Only Support " + template.MaxUsers + " Users. Please Change User Count or Select Different Template.");
                            return;
                        }

                        conferenceService.UpdateConference(conference).then(function (response) {
                            if (response) {
                                scope.editMode = false;
                                scope.showAlert("Update Conference", "success", "Conference " + conference.ConferenceName + " Update Successfully.");
                            } else {
                                scope.showAlert("Update Conference", "error", "Fail To Update Conference " + conference.ConferenceName);
                            }
                        }, function (error) {
                            scope.showAlert("Update Conference", "Error", "There is an error Update Conference");
                        });
                    } else {
                        scope.showAlert("Update Conference", "Error", "There is an error Update Conference");
                    }
                }
                else {
                    scope.showAlert("Update Conference", "Error", "There is an error Update Conference");
                }
            };

            scope.deleteConf = function (conf) {

                scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " + conf.ConferenceName, function (obj) {

                    conferenceService.DeleteConference(conf.ConferenceName).then(function (response) {
                        if (response) {
                            scope.reloadPageAfterDelete();
                            scope.showAlert("Deleted", "success", "Conference " + conf.ConferenceName + " Deleted successfully");
                        }
                        else
                            scope.showAlert("Error", "error", "There is an error ");
                    }, function (error) {
                        scope.showAlert("Error", "error", "There is an error ");
                    });

                }, function () {

                }, conf)
            };

            scope.showAlert = function (title, type, content) {
                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

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


            var endUsr = $filter('filter')(scope.endUsers, {id: scope.conferenceData.CloudEndUserId});
            if (endUsr.length > 0) {
                scope.conferenceData.Domain = endUsr[0].Domain;
            }
        }
    }
});