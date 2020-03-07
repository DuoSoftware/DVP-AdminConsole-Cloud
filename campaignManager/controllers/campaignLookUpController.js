/**
 * Created by damith on 11/8/17.
 */


mainApp.controller("campaignLookUpController", function ($scope,
                                                         $anchorScroll, campaignNumberApiAccess,
                                                         loginService,scheduleBackendService, $q) {
    $anchorScroll();

    $scope.searchObj = {};
    $scope.categoryLookupObj = [];
    $scope.campaignNumberObj = {};


    $scope.gridOptions3 = {
        enableSorting: true,
        enableFiltering: true,
        treeRowHeaderAlwaysVisible: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi3 = gridApi;
        }
    };

    $scope.showAlert = function (title, content, type) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    var loadCampaignCategories = function () {
        campaignNumberApiAccess.GetNumberCategories().then(function (response) {
            if (response.IsSuccess) {
                $scope.campaignCategories = response.Result;
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Campaign Number Upload', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while loading number categories";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Campaign Number Upload', errMsg, 'error');
        });
    };
    loadCampaignCategories();


    var loadNewlyCreatedCampaigns = function () {
        $scope.newlyCreatedCampaigns = [];
        campaignNumberApiAccess.GetNewlyCreatedCampaigns().then(function (response) {
            if (response.IsSuccess) {
                var newCampaigns = response.Result;


                campaignNumberApiAccess.GetOngoingCampaigns().then(function (response) {
                    if (response.IsSuccess) {
                        $scope.newlyCreatedCampaigns = newCampaigns.concat(response.Result);

                    }
                    else {
                        $scope.newlyCreatedCampaigns = newCampaigns;
                    }
                }, function (err) {
                    $scope.newlyCreatedCampaigns = newCampaigns;
                });


            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Campaign Number Upload', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while loading campaigns";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Campaign Number Upload', errMsg, 'error');
        });
    };
    loadNewlyCreatedCampaigns();

    $scope.loadCampaignSchedules = function (campaignId) {
            $scope.campaignSchedules = [];
            $scope.enablePreviewData = false;
            if (campaignId) {
                var promiseFnList = [];
                for (var i = 0; i < $scope.newlyCreatedCampaigns.length; i++) {
                    var newCamp = $scope.newlyCreatedCampaigns[i];
                    if (newCamp.CampaignId.toString() === campaignId) {

                        $scope.selectedCampaign = newCamp;
                        newCamp.CampScheduleInfo.forEach(function (camSchedule) {
                            promiseFnList.push(scheduleBackendService.getSchedule(camSchedule.ScheduleId));
                        });


                        $q.all(promiseFnList).then(function (response) {
                            response.forEach(function (fnRes, k) {
                                if (fnRes.IsSuccess) {
                                    newCamp.CampScheduleInfo[k].ScheduleName = fnRes.Result[0].ScheduleName;
                                    $scope.campaignSchedules.push(newCamp.CampScheduleInfo[k]);

                                }

                            });


                            if (newCamp.CampaignChannel.toLowerCase() === 'call' && newCamp.DialoutMechanism.toLowerCase() === 'preview') {
                                $scope.enablePreviewData = true;
                            }

                            if (newCamp.CampaignChannel.toLowerCase() === 'sms' || newCamp.CampaignChannel.toLowerCase() === 'email') {
                                $scope.enablePreviewData = true;
                            }
                        });


                        //.then(function (response) {
                        //        if (response.IsSuccess) {
                        //            newCamp.CampScheduleInfo[0].ScheduleName = response.Result[0].ScheduleName;
                        //            $scope.campaignSchedules.push(newCamp.CampScheduleInfo[0]);
                        //            if(newCamp.CampaignChannel.toLowerCase() === 'call' && newCamp.DialoutMechanism.toLowerCase() === 'preview'){
                        //                $scope.enablePreviewData = true;
                        //            }
                        //        }
                        //        else {
                        //            $scope.showAlert('Campaign Number Upload', 'Fail To oad Schedules', 'error');
                        //        }
                        //    }, function (error) {
                        //        $scope.showAlert('Campaign Number Upload', 'Fail To oad Schedules', 'error');
                        //    });


                        break;
                    }
                }

                //campaignNumberApiAccess.GetCampaignSchedule(campaignId).then(function (response) {
                //    if (response.IsSuccess) {
                //        $scope.campaignSchedules = response.Result;
                //    }
                //    else {
                //        var errMsg = response.CustomMessage;
                //
                //        if (response.Exception) {
                //            errMsg = response.Exception.Message;
                //        }
                //        $scope.showAlert('Campaign Number Upload', errMsg, 'error');
                //    }
                //}, function (err) {
                //    loginService.isCheckResponse(err);
                //    var errMsg = "Error occurred while loading campaign schedules";
                //    if (err.statusText) {
                //        errMsg = err.statusText;
                //    }
                //    $scope.showAlert('Campaign Number Upload', errMsg, 'error');
                //});
            }
    };


    var searchOption = function () {

        return {
            searchNumbersByCampaign: function () {
                $scope.gridOptions3.data = [];
                $scope.gridOptions3.columnDefs = [];

                $scope.isLoadingLookUp = true;
                campaignNumberApiAccess.GetNumbersByCampaign($scope.searchObj.CampaignId).then(function (response) {
                    $scope.isLoadingLookUp = false;
                    if (response.IsSuccess) {
                        if (response.Result && response.Result.length > 0) {
                            $scope.gridOptions3.data = response.Result.map(function (contact) {
                                return {ContactId: contact.CampContactInfo.ContactId, ExtraData: contact.ExtraData};
                            });
                        }
                    }
                }, function (err) {
                    $scope.isLoadingLookUp = false;
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading numbers";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    //$scope.showAlert('Number Base', errMsg, 'error');
                });
            },
            searchNumbersByCampaignAndSchedule: function () {
                $scope.isLoadingLookUp = true;
                campaignNumberApiAccess.GetNumbersByCampaignAndSchedule($scope.searchObj.CampaignId, $scope.searchObj.CamScheduleId).then(function (response) {
                    $scope.isLoadingLookUp = false;
                    if (response.IsSuccess) {
                        if (response.Result && response.Result.length > 0) {
                            $scope.gridOptions3.data = response.Result.map(function (contact) {
                                return {ContactId: contact.CampContactInfo.ContactId, ExtraData: contact.ExtraData};
                            });
                        }
                    }

                }, function (err) {
                    $scope.isLoadingLookUp = false;
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading numbers";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Number Base', errMsg, 'error');
                });
            },
            searchNumbersByCategories: function () {
                $scope.gridOptions3.data = [];
                $scope.gridOptions3.columnDefs = [];
                $scope.isLoadingLookUp = true;
                campaignNumberApiAccess.GetNumbersByCategory($scope.searchObj.CategoryID).then(function (response) {
                    $scope.isLoadingLookUp = false;
                    if (response.IsSuccess) {
                        if (response.Result && response.Result.CampContactInfo && response.Result.CampContactInfo.length > 0) {
                            $scope.gridOptions3.data = response.Result.CampContactInfo.map(function (contact) {
                                return contact;
                            });
                        }
                    }
                }, function (err) {
                    $scope.isLoadingLookUp = false;
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading numbers";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Number Base', errMsg, 'error');
                });
            }
        }
    }();

    $scope.searchNumbers = function () {

        if ($scope.searchObj.CampaignId) {
            if ($scope.searchObj.CamScheduleId) {
                searchOption.searchNumbersByCampaignAndSchedule();
            }
            else {
                searchOption.searchNumbersByCampaign();
            }
        }
        else {
            searchOption.searchNumbersByCategories();
        }
    };

    $scope.clearSearch = function () {
        $scope.searchObj = {};
        $scope.categoryLookupObj = [];

        $scope.gridOptions3.data = [];
        $scope.gridOptions3.columnDefs = [];
        $scope.isTableLoading = 0;
    };
});