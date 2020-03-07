/**
 * Created by Rajinda on 5/30/2016.
 */
mainApp.directive("editcampaign", function ($filter, $uibModal, campaignService, scheduleBackendService) {

    return {
        restrict: "EAA",
        scope: {
            campaigns: "=",
            campaign: "=",
            extensions: "=",
            reasons: "=",
            ardsAttributes: "=",
            'reloadCampaign': '&'
        },

        templateUrl: 'campaignManager/template/campaign.html',

        link: function (scope, element, attributes) {


            scope.showAlert = function (tittle, type, content) {
                new PNotify({
                    title: tittle,
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
                        CancelCallBack();
                    });

            };

            scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};
            scope.mechanisms = campaignService.mechanisms;
            scope.modes = campaignService.modes;
            scope.channels = campaignService.channels;
            scope.editMode = 'view';
            scope.updateConfig = false;
            scope.updateEdit = false;
            scope.deleteConfig = false;
            scope.editMapSchedule = false;
            scope.editMapNumberSchedule = false;
            scope.addScheduleToCampaign = false;
            scope.mapnumberScheduleToCam = false;
            scope.scheduleList = false;
            scope.editCampaign = function () {
                scope.editMode = scope.editMode === 'edit' ? 'view' : 'edit';
            };

            scope.configCampaign = function () {
                scope.editMode = scope.editMode === 'config' ? 'view' : 'config';
            };

            scope.scheduleCampaign = function () {
                scope.editMode = scope.editMode === 'schedule' ? 'view' : 'schedule';
                if (scope.editMode === 'schedule' && scope.ScheduleList.length === 0) {
                    scope.GetSchedules();
                    scope.GetScheduleCampaign();
                    //scope.GetAssignableScheduleCampaign();
                }
            };

            scope.additionalData = {
                Class: "PREVIEW",
                Type: "ARDS",
                Category: "ATTRIBUTE",
                TenantId: scope.campaign.TenantId,
                CompanyId: scope.campaign.CompanyId,
                CampaignId: scope.campaign.CampaignId,
                AdditionalData: ""
            };

            scope.isLoadingData = false;
            scope.GetCampaignAdditionalData = function () {
                scope.isLoadingData = true;
                scope.campaignAdditionalData = [];
                campaignService.GetTemplateList().then(function (response) {
                    if (response) {
                        scope.Templates = response;
                    }
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Load Template Data");
                });

                campaignService.GetCampaignAdditionalData(scope.campaign.CampaignId).then(function (response) {
                    if (response) {

                        scope.campaignAdditionalData = response;
                        if (scope.campaign.DialoutMechanism === "PREVIEW") {
                            if(response.length > 0) {
                                scope.campAttribute = [];
                                scope.AdditionalDataRecordId = response[0].AdditionalDataId;
                                scope.campaignAttributes = JSON.parse(response[0].AdditionalData);
                                scope.campaignAttributes.forEach(function (item) {
                                    for (var i = 0; i < scope.ardsAttributes.length; i++) {
                                        var ardsAttribute = scope.ardsAttributes[i];
                                        if (ardsAttribute && ardsAttribute.Id === item) {
                                            scope.campAttribute.push(ardsAttribute);
                                        }
                                    }
                                });
                            }else{
                                scope.campaignAttributes = [];
                                scope.campAttribute = [];
                                scope.AdditionalDataRecordId = undefined;
                            }
                        }
                        //response.map(function (item) {
                        //if (item.AdditionalData) {
                        //    var t = angular.fromJson(item.AdditionalData);
                        //    t.name = scope.getTemplateNameById(t.Template);
                        //    t.AdditionalDataId = item.AdditionalDataId;
                        //    scope.campaignAdditionalData.push(t);
                        //}
                        //});
                    }
                    scope.isLoadingData = false;
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Create Additional Data");
                    scope.isLoadingData = false;
                });
            };

            scope.DeleteAdditionalDataByID = function (id) {
                campaignService.DeleteAdditionalDataByID(id).then(function (response) {
                    if (response) {
                        scope.GetCampaignAdditionalData();
                        scope.showAlert("Campaign", 'success', "Successfully Deleted.");
                    }
                    else {
                        scope.showAlert("Campaign", 'error', "Fail To Delete Additional Data");
                    }
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Delete Additional Data");
                });
            };

            scope.additionalDataCampaign = function () {
                scope.editMode = scope.editMode === 'additionalData' ? 'view' : 'additionalData';
                if (scope.editMode === 'additionalData') {
                    scope.GetCampaignAdditionalData()
                }
            };

            scope.showCallback = false;
            scope.callback = {AllowCallBack: 'false'};

            scope.setCallback = function (value) {
                scope.showCallback = value === 'true';
            };

            scope.SaveCallBack = function (id, callback) {
                scope.updateConfig = true;

                if (angular.isArray(callback)) {

                    var i = 0;
                    var failToSave = [];

                    function showmsg() {
                        if (i === callback.length) {

                            if (failToSave.length === 0) {
                                scope.showAlert("Campaign", 'success', "Configurations  Updated successfully ");
                            }
                            else {
                                scope.showAlert("Campaign", 'warning', "Configurations  saved successfully but fail to save same callback configurations.");
                            }
                            scope.updateConfig = false;
                        }
                    }

                    angular.forEach(callback, function (item) {
                        callback.ReasonId = item.CampCallBackReasons.ReasonId;
                        campaignService.SetCallBack(id, item).then(function (response) {
                            if (!response) {
                                item.Status = false;
                                failToSave.push(item);
                            }
                            else {
                                var items = $filter('filter')(scope.callbacks, {ReasonId: parseInt(item.ReasonId)}, true);
                                if (items) {
                                    var index = scope.callbacks.indexOf(items[0]);
                                    if (index > -1) {
                                        scope.callbacks.splice(index, 1);
                                    }
                                }
                                item.Status = true;
                                item.CallBackConfId = response.CallBackConfId;
                                scope.callbacks.push(item);
                            }
                            i++;
                            showmsg();
                        }, function (error) {
                            item.Status = false;
                            failToSave.push(item);
                            i++;
                            showmsg();
                        });


                    });


                }
                else {
                    callback.ReasonId = callback.CampCallBackReasons.ReasonId;
                    campaignService.SetCallBack(id, callback).then(function (response) {
                        if (!response) {
                            scope.showAlert("Campaign", 'error', "Fail To Set Callback");
                        }
                        else {
                            callback.Status = true;
                            callback.CallBackConfId = response.CallBackConfId;

                            var items = $filter('filter')(scope.callbacks, {CallBackConfId: parseInt(response.CallBackConfId)}, true);
                            if (items) {
                                var index = scope.callbacks.indexOf(items[0]);
                                if (index === -1) {
                                    var tempCallback = {};
                                    angular.copy(callback, tempCallback);
                                    scope.callbacks.push(tempCallback);
                                }
                            }

                        }
                        scope.updateConfig = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Set Callback");
                        scope.updateConfig = false;
                    });
                }
            };

            scope.callbacks = [];
            scope.AddCallBack = function (callback) {

                if (callback.CampCallBackReasons.ReasonId) {
                    if (callback.ConfigureId && callback.ConfigureId > 0) {
                        scope.SaveCallBack(callback.ConfigureId, callback);
                    }
                    else {
                        var item = $filter('filter')(scope.callbacks, {ReasonId: parseInt(callback.CampCallBackReasons.ReasonId)}, true)[0];
                        if (!item) {
                            var data = {};
                            angular.copy(callback, data);
                            data.ReasonId = callback.CampCallBackReasons.ReasonId;
                            data.Status = true;
                            scope.callbacks.push(data);
                        }

                    }
                }


            };

            scope.deleteReason = function (callback) {
                scope.updateConfig = true;
                scope.showConfirm("Delete Callback Reason", "Delete", "ok", "cancel", "Do you want to delete " + callback.CampCallBackReasons.Reason, function (obj) {

                    function showMsg() {
                        var items = $filter('filter')(scope.callbacks, {ReasonId: parseInt(callback.ReasonId)}, true);
                        if (items) {
                            var index = scope.callbacks.indexOf(items[0]);
                            if (index > -1) {
                                scope.callbacks.splice(index, 1);
                            }
                        }
                        scope.updateConfig = false;
                    }

                    if (callback.CallBackConfId && callback.CallBackConfId > 0) {
                        campaignService.DeleteCallBack(callback.CallBackConfId).then(function (response) {
                            if (response) {
                                showMsg();
                                scope.showAlert("Campaign", 'success', "Configurations  Deleted successfully ");
                            } else {
                                scope.showAlert("Campaign", 'error', "Fail To Deleted Configurations");
                                scope.updateConfig = false;
                            }
                        }, function (error) {
                            scope.showAlert("Campaign", 'error', "Fail To Deleted Configurations");
                            scope.updateConfig = false;
                        });
                    }
                    else {
                        showMsg();
                    }

                }, function () {
                    scope.safeApply(function () {
                        scope.updateConfig = false;
                    });


                }, callback)

            };

            scope.updateCampaign = function (campaignx) {
                scope.updateEdit = true;
                var updateCam = {};
                angular.copy(campaignx, updateCam);
                updateCam.CampConfigurations = undefined;
                updateCam.CampContactSchedule = undefined;

                campaignService.UpdateCampaign(scope.campaign.CampaignId, updateCam).then(function (response) {
                    if (response) {
                        scope.showAlert("Campaign", 'success', "Campaign Updated successfully ");
                    } else {
                        scope.showAlert("Campaign", 'error', "Fail To Update Campaign");
                    }
                    scope.updateEdit = false;
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Update Campaign");
                    scope.updateEdit = false;
                });
            };

            scope.deleteCampaign = function (campaign) {
                scope.deleteConfig = true;
                scope.showConfirm("Delete Campaign", "Delete", "ok", "cancel", "Do you want to delete " + campaign.CampaignName, function (obj) {

                    campaignService.DeleteCampaign(scope.campaign.CampaignId).then(function (response) {
                        if (response) {
                            scope.reloadCampaign();
                            scope.showAlert("Campaign", 'success', "Deleted Successfully ");

                        } else {
                            scope.showAlert("Campaign", 'error', "Fail To Delete Campaign");
                        }
                        scope.deleteConfig = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Delete Campaign");
                        scope.deleteConfig = false;
                    });

                }, function () {
                    scope.safeApply(function () {
                        scope.deleteConfig = false;
                    });
                }, campaign)
            };

            scope.GetCampaignConfig = function () {
                campaignService.GetCampaignConfig(scope.campaign.CampaignId).then(function (response) {
                    if (response) {

                        scope.callback = response;
                        scope.callback.AllowCallBack = response.AllowCallBack === false ? 'false' : 'true';
                        scope.showCallback = response.AllowCallBack;
                        scope.GetCallBacks();
                    }
                    else {
                        scope.callback = {AllowCallBack: 'false'};
                    }
                }, function (error) {

                });
            };

            scope.GetCampaignConfig();

            scope.GetCallBacks = function () {
                campaignService.GetCallBacks(scope.callback.ConfigureId).then(function (response) {
                    scope.callbacks = response;
                    /*scope.callbacks = response.map(function (t) {
                     t.CampCallBackReasons = t.CampCallBackReasons
                     return t
                     });*/
                    /*if(response){
                     scope.callbacks = response.map(function (t) {
                     t.CampCallBackReasons = t.CampCallBackReasons
                     return t
                     });
                     }else{
                     scope.callbacks = response;
                     }*/
                }, function (error) {
                    console.log(error);
                });
            };

            scope.updateCampaignConfig = function (callback) {
                if (callback.ChannelConcurrency === undefined || callback.ChannelConcurrency < 1) {
                    scope.showAlert("Campaign", 'error', "Please Set Channel Concurrency.");
                    return;
                }
                scope.updateConfig = true;
                if (callback.ConfigureId > 0) {
                    /*update config id, configId, config*/
                    campaignService.UpdateCampaignConfig(scope.campaign.CampaignId, callback.ConfigureId, callback).then(function (response) {
                        if (response) {
                            scope.showAlert("Campaign", 'success', "Configurations  Updated successfully ");
                        } else {
                            scope.showAlert("Campaign", 'error', "Fail To Update Configurations");
                        }
                        scope.updateConfig = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Update Configurations");
                        scope.updateConfig = false;
                    });
                }
                else {
                    /*save config*/
                    campaignService.CreateCampaignConfig(scope.campaign.CampaignId, callback).then(function (response) {
                        if (response) {
                            scope.callback.ConfigureId = response.ConfigureId;
                            scope.SaveCallBack(response.ConfigureId, scope.callbacks);
                            // scope.showAlert("Campaign", 'success', "Configurations  Updated successfully ");
                        } else {
                            scope.showAlert("Campaign", 'error', "Fail To Update Configurations");
                        }
                        scope.updateConfig = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Update Configurations");
                        scope.updateConfig = false;
                    });
                }
            };

            scope.ScheduleList = [];
            scope.GetSchedules = function () {
                scope.editMapSchedule = true;
                scope.scheduleList = true;
                scheduleBackendService.getSchedules().then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.ScheduleList = response.data.Result;
                        scope.GetScheduleCampaign();
                    }
                    else {
                        console.info("Error in GetSchedules " + response.data.Exception);
                        scope.showAlert("Campaign", 'error', "Fail To Get Schedules");
                    }
                    scope.editMapSchedule = false;
                    scope.scheduleList = false;
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Get Schedules");
                    scope.editMapSchedule = false;
                    scope.scheduleList = false;
                });
            };

            scope.camSchedule = [];
            scope.addedSchedule = [];
            scope.availableSchedule = [];
            scope.GetScheduleCampaign = function () {
                scope.scheduleList = true;
                campaignService.GetScheduleCampaign(scope.campaign.CampaignId).then(function (response) {
                    scope.camSchedule = [];
                    scope.addedSchedule = [];
                    if (response && response.length > 0) {
                        scope.ScheduleList.map(function (t) {
                            var items = $filter('filter')(response, {ScheduleId: parseInt(t.id)}, true);
                            if (items && items.length === 0) {
                                scope.camSchedule.push(t);
                            }
                            else {
                                t.camSchedule = items[0];
                                scope.addedSchedule.push(t);
                            }
                        });
                        scope.availableSchedule = scope.camSchedule;
                    }
                    else {
                        scope.availableSchedule = scope.ScheduleList;
                    }
                    scope.scheduleList = false;
                }, function (error) {
                    console.log("Error in GetScheduleCampaign " + error);
                    scope.scheduleList = false;
                });
            };

            /*scope.assignableSchedule = [];
             scope.GetAssignableScheduleCampaign = function () {
             campaignService.GetAssignableScheduleCampaign(scope.campaign.CampaignId).then(function (response) {
             scope.assignableSchedule = response;
             }, function (error) {
             console.log("Error in GetScheduleCampaign " + error);
             });
             };*/

            scope.Categorys = [];
            scope.GetCategorys = function () {
                campaignService.GetCategorys().then(function (response) {
                    scope.Categorys = response;
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Load Categories");
                });
            };
            scope.GetCategorys();

            scope.mapNumberToCampaign = function (mapnumber) {
                scope.editMapNumberSchedule = true;


                scope.showConfirm("Map Numbers To Campaign", "Map Numbers", "ok", "cancel", "You Are Not Allowed To Revert This Process. Do You Really Want To Continue?", function (obj) {

                    campaignService.MapNumberToCampaign(scope.campaign.CampaignId, mapnumber.CategoryID).then(function (response) {
                        if (response) {

                            scope.showAlert("Campaign", 'success', "Successfully Map Numbers To Campaign.");
                        } else {
                            scope.showAlert("Campaign", 'error', "Fail To Map");
                        }
                        scope.editMapNumberSchedule = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Map");
                        scope.editMapNumberSchedule = false;
                    });

                }, function () {
                    scope.safeApply(function () {
                        scope.editMapNumberSchedule = false;
                    });
                }, mapnumber)

            };

            scope.MapScheduleToCampaign = function (mapSchedule) {
                scope.editMapSchedule = true;
                campaignService.MapScheduleToCampaign(scope.campaign.CampaignId, mapSchedule.ScheduleId).then(function (response) {
                    if (response) {
                        scope.showAlert("Campaign", 'success', "Successfully Map Schedule To Campaign.");
                    } else {
                        scope.showAlert("Campaign", 'error', "Fail To Map");
                    }
                    scope.editMapSchedule = false;
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Map");
                    scope.editMapSchedule = false;
                });
            };

            scope.MapNumberAndScheduleToCampaign = function (mapnumberschedue) {
                scope.mapnumberScheduleToCam = true;

                scope.showConfirm("Map Numbers and Schedule To Campaign", "Map Numbers", "ok", "cancel", "You Are Not Allowed To Revert This Process. Do You Really Want To Continue?", function (obj) {

                    campaignService.MapNumberAndScheduleToCampaign(scope.campaign.CampaignId, mapnumberschedue.CategoryID, mapnumberschedue.Schedule.id, mapnumberschedue.Schedule.ScheduleName).then(function (response) {
                        if (response) {
                            scope.GetAssignedCategory();
                            scope.showAlert("Campaign", 'success', "Successfully Map To Campaign.");
                        } else {
                            scope.showAlert("Campaign", 'error', "Fail To Map");
                        }
                        scope.mapnumberScheduleToCam = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Map");
                        scope.mapnumberScheduleToCam = false;
                    });

                }, function () {
                    scope.safeApply(function () {
                        scope.mapnumberScheduleToCam
                            = false;
                    });
                }, mapnumberschedue)


            };

            scope.AddScheduleToCampaign = function (data) {
                scope.addScheduleToCampaign = true;
                campaignService.AddScheduleToCampaign(scope.campaign.CampaignId, data).then(function (response) {
                    if (response) {
                        scope.GetScheduleCampaign();
                        //scope.GetAssignableScheduleCampaign();
                        scope.showAlert("Campaign", 'success', "Successfully Add To Campaign.");
                    } else {
                        scope.showAlert("Campaign", 'error', "Fail To Add");
                    }
                    scope.addScheduleToCampaign = false;
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Add");
                    scope.addScheduleToCampaign = false;
                });
            };

            scope.AssignedCategory = [];
            scope.AvailableCategory = [];
            scope.GetAssignedCategory = function () {
                scope.AssignedCategory = [];
                scope.AvailableCategory = [];
                campaignService.GetAssignedCategory(scope.campaign.CampaignId).then(function (response) {
                    if (response) {
                        scope.AssignedCategory = response;

                        /*var tempCategory = response.map(function (item) {
                         return item.CampContactCategory;
                         });
                         if (tempCategory && tempCategory.length > 0) {
                         scope.Categorys.map(function (t) {
                         var items = $filter('filter')(tempCategory, {CategoryID: parseInt(t.CategoryID)}, true);
                         if (items && items.length === 0) {
                         scope.AvailableCategory.push(t);
                         }
                         else {
                         scope.AssignedCategory.push(t);
                         }
                         });
                         }
                         else {
                         scope.AvailableCategory = scope.Categorys;
                         }*/
                    }
                }, function (error) {
                    scope.AvailableCategory = scope.Categorys;
                });
            };
            scope.GetAssignedCategory();

            scope.deleteSchedule = function (schedule) {

                scope.showConfirm("Delete Schedule", "Delete", "ok", "cancel", "Do you want to delete " + schedule.ScheduleName, function (obj) {

                    campaignService.DeleteSchedule(scope.campaign.CampaignId, schedule.camSchedule.CamScheduleId).then(function (response) {
                        if (response) {
                            scope.GetScheduleCampaign();
                            scope.showAlert("Delete Schedule", 'success', "Successfully Delete.");
                        }
                        else
                            scope.showAlert("Delete Schedule", 'error', "Fail To Delete Schedule");
                    }, function (error) {
                        scope.showAlert("Delete Schedule", 'error', "Fail To Delete Schedule");
                    });

                }, function () {

                }, schedule);


            };


            //------------------Campaign AdditionalData--------------------------------------------

            scope.showAdditionalDataPanel = false;
            scope.campaignAttributes = [];
            scope.campaignAdditionalData = [];
            scope.Templates = [];

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(attribute) {
                    return (attribute.Name.toLowerCase().indexOf(lowercaseQuery) != -1);

                };
            }

            scope.querySearch = function (query) {
                if (query === "*" || query === "") {
                    if (scope.ardsAttributes) {
                        return scope.ardsAttributes;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    if (scope.ardsAttributes) {
                        return query ? scope.ardsAttributes.filter(createFilterFor(query)) : [];

                    } else {
                        return [];
                    }
                }

            };

            scope.campAttribute;
            scope.onChipAdd = function (chip) {

                scope.campaignAttributes.push(chip.Id);

            };
            scope.onChipDelete = function (chip) {

                var index = scope.campaignAttributes.indexOf(chip.Id);
                if (index > -1) {
                    scope.campaignAttributes.splice(index, 1);
                }


            };

            scope.addCampaignAdditionalDataAttribute = function () {


                if (scope.campaignAttributes && scope.campaignAttributes.length > 0) {

                    var additionalData = {
                        Class: "PREVIEW",
                        Type: "ARDS",
                        Category: "ATTRIBUTE",
                        TenantId: scope.campaign.TenantId,
                        CompanyId: scope.campaign.CompanyId,
                        CampaignId: scope.campaign.CampaignId,
                        AdditionalData: JSON.stringify(scope.campaignAttributes)
                    };
                    campaignService.CreateCampaignAdditionalData(scope.campaign.CampaignId, additionalData).then(function (response) {
                        if (response) {
                            scope.GetCampaignAdditionalData();
                            scope.showAlert("Campaign", 'success', "Additional Data Added");
                        }
                        scope.isLoading = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Create Additional Data");
                        scope.isLoading = false;
                    });
                }
            };

            scope.getTemplateNameById = function (id) {
                var items = $filter('filter')(scope.Templates, {_id: id});
                if (items) {
                    var index = scope.Templates.indexOf(items[0]);
                    if (index > -1) {
                        var temptask = scope.Templates[index];
                        return temptask.name
                    }
                }
            };


            scope.isLoading = false;

            scope.createCampaignAdditionalData = function (data) {
                var additionalDataSet = [];
                if (data && data.Template) {
                    var additionalDataTemplate = {
                        Class: "BLAST",
                        Type: scope.campaign.CampaignChannel,
                        Category: "TEMPLATE",
                        TenantId: scope.campaign.TenantId,
                        CompanyId: scope.campaign.CompanyId,
                        CampaignId: scope.campaign.CampaignId,
                        AdditionalData: data.Template
                    };

                    additionalDataSet.push(additionalDataTemplate);
                }
                if (data && data.FileName) {
                    var additionalDataAttachment = {
                        Class: "BLAST",
                        Type: scope.campaign.CampaignChannel,
                        Category: "ATTACHMENT",
                        TenantId: scope.campaign.TenantId,
                        CompanyId: scope.campaign.CompanyId,
                        CampaignId: scope.campaign.CampaignId,
                        AdditionalData: data.FileName
                    };
                    additionalDataSet.push(additionalDataAttachment);
                }

                scope.isLoading = true;

                additionalDataSet.forEach(function (additional_data) {
                    campaignService.CreateCampaignAdditionalData(scope.campaign.CampaignId, additional_data).then(function (response) {
                        if (response && response.AdditionalData) {
                            //var t = angular.fromJson(response.AdditionalData);
                            //t.name = scope.getTemplateNameById(t.Template);
                            //t.AdditionalDataId = response.AdditionalDataId;
                            scope.campaignAdditionalData.push(response);
                        }
                        scope.isLoading = false;
                    }, function (error) {
                        scope.showAlert("Campaign", 'error', "Fail To Create Additional Data");
                        scope.isLoading = false;
                    });
                });

            };

            scope.updateCampaignAdditionalData = function () {
                scope.additionalData.AdditionalData = JSON.stringify(scope.campaignAttributes);
                campaignService.UpdateCampaignAdditionalData(scope.campaign.CampaignId, scope.additionalData).then(function (response) {
                    if (response) {

                        scope.campaignAdditionalData.push(response);
                    }
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Update Additional Data");
                });
            };

            function load() {
                if ((scope.campaign.DialoutMechanism && (scope.campaign.DialoutMechanism === "PREVIEW" || scope.campaign.DialoutMechanism === "AGENT")) || (scope.campaign.CampaignChannel && (scope.campaign.CampaignChannel.toLowerCase() === "sms" || scope.campaign.CampaignChannel.toLowerCase() === "email"))) {
                    scope.showAdditionalDataPanel = true;
                }
            }

            load();
        }
    }
});