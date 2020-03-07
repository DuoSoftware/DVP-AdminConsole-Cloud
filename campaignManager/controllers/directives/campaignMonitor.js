/**
 * Created by Rajinda on 5/30/2016.
 */
mainApp.directive("campaignmonitor", function ($filter, $uibModal, campaignService) {

    return {
        restrict: "EAA",
        scope: {
            campaign: "=",
            'reloadCampaign': '&'
        },

        template: '<ng-include src="getTemplateUrl()"/>',

        /*templateUrl: 'campaignManager/template/campaignView.html',*/

        link: function (scope, element, attributes) {

            scope.getTemplateUrl = function () {
                //basic handling
                if (scope.campaign.CampCampaignInfo)
                    return "campaignManager/template/ongoingcampaignView.html";
                else
                    return "campaignManager/template/campaignView.html";
            };

            scope.showAlert = function (tittle, type, content) {
                new PNotify({
                    title: tittle,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.StartCampaign = function (cam) {
                campaignService.StartCampaign(cam.CampaignId).then(function (response) {
                    if (response) {
                        scope.reloadCampaign();
                        scope.showAlert("Campaign", 'success', "Successfully Start Campaign.");

                    } else {
                        scope.showAlert("Campaign", 'error', "Fail To Start Campaign.");
                    }
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Start Campaign.");
                });
            };

            scope.SendCommandToCampaign = function (cam, command) {
                campaignService.SendCommandToCampaign(cam.CampaignId, command).then(function (response) {
                    if (response) {
                        scope.showAlert("Campaign", 'success', "Operation Execute Successfully.");
                        scope.campaign.CampaignState = command == "resume" ? "start" : command;
                        if(command==="end")
                            scope.reloadCampaign();
                    } else {
                        scope.showAlert("Campaign", 'error', "Fail To Execute Command.");
                    }
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Execute Command.");
                });
            };

            scope.totalDialCount = 0;
            scope.GetTotalDialCount = function () {
                campaignService.GetTotalDialCount(scope.campaign.CampaignId).then(function (response) {
                    scope.totalDialCount = response
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Get Dial Call Count.");
                });
            };
            scope.GetTotalDialCount();

            scope.totalConnectedCount = 0;
            scope.GetTotalConnectedCount = function () {
                campaignService.GetTotalConnectedCount(scope.campaign.CampaignId).then(function (response) {
                    scope.totalConnectedCount = response;
                    scope.isLoading = false;
                }, function (error) {
                    scope.showAlert("Campaign", 'error', "Fail To Get Connected Call Count.");
                    scope.isLoading = false;
                });
            };
            scope.GetTotalConnectedCount();

            scope.Reload = function () {
                scope.isLoading = true;
                scope.GetTotalDialCount();
                scope.GetTotalConnectedCount();
                //scope.reloadCampaign();
            };
        }
    }
});


