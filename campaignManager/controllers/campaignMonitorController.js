mainApp.controller("campaignMonitorController", function ($scope, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService) {

    $anchorScroll();
    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };
    $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};
    $scope.isProgress = false;
    $scope.ongoingCampaign =[];
    $scope.GetOngoingCampaign = function() {
        $scope.isProgress =true;
        campaignService.GetOngoingCampaign().then(function (response) {
            if(response) {
                $scope.ongoingCampaign = response;
            }else{
                $scope.showAlert("Campaign", 'error',"Fail To Load Campaign List.");
            }
            $scope.isProgress =false;
        }, function (error) {
            $scope.showAlert("Campaign", 'error',"Fail To Load Campaign List.");
            $scope.isProgress =false;
        });
    };
    $scope.GetOngoingCampaign();

    $scope.pendingCampaign =[];
    $scope.GetCampaignByState = function() {
        $scope.scheduleList = true;


        campaignService.GetCampaignByState("create").then(function (response) {
            if(response) {
                $scope.pendingCampaign = response;
            }else{
                $scope.showAlert("Campaign", 'error',"Fail To Load Campaign List.");
            }
            $scope.scheduleList = false;
        }, function (error) {
            $scope.scheduleList = false;
            $scope.showAlert("Campaign", 'error',"Fail To Load Campaign List.");
        });


    };
    $scope.GetCampaignByState();

    $scope.ResetCampaignList = function() {

        $scope.GetOngoingCampaign();
        $scope.GetCampaignByState();
    };

});
