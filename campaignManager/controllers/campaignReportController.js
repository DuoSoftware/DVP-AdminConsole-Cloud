mainApp.controller("campaignReportController", function ($scope, $q, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService) {

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
    $scope.pageSizRange = [10, 500, 1000, 5000, 10000];
    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = 100;

    $scope.isLoading = false;
    $scope.campaignSummery = [];

    $scope.CampaignSummeryReportCount = function () {
        campaignService.CampaignSummeryReportCount($scope.Status).then(function (response) {
            $scope.pageTotal = response;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Page Count.");
        });
    };


    $scope.getPageData = function (Paging, page, pageSize, total) {
        $scope.isLoading = true;
        campaignService.GetCampaignSummery(page, pageSize,$scope.Status).then(function (response) {
            $scope.campaignSummery = response;
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Summery Report.");
            $scope.isLoading = false;
        });
    };


    $scope.GetCampaignSummery =function () {
        $scope.CampaignSummeryReportCount();
        $scope.getPageData("", $scope.currentPage, $scope.pageSize, $scope.pageTotal);
    };

    $scope.Status = [];
    $scope.summeryCondition = {
        Create:false,
        Ongoing:false,
        Offline:false,
        Start:false,
        Pause:false,
        Stop:false,
        Done:false,
        All:false,
    };

    $scope.addConditions = function (status) {
        if(status==='All'){
            $scope.summeryCondition = {
                Create:!$scope.summeryCondition.All,
                Ongoing:!$scope.summeryCondition.All,
                Offline:!$scope.summeryCondition.All,
                Start:!$scope.summeryCondition.All,
                Pause:!$scope.summeryCondition.All,
                Stop:!$scope.summeryCondition.All,
                Done:!$scope.summeryCondition.All,
                All:$scope.summeryCondition.All
            };
            $scope.Status = [];
            if(!$scope.summeryCondition.All){
                $scope.Status.push(status);
            }
            return;
        }
        var index = $scope.Status.indexOf(status);
        if (index > -1) {
            $scope.Status.splice(index, 1);
        }
        else{
            $scope.Status.push(status);
        }

    }

    $scope.doughnutObj = {labels: [], data: [], node: []};
    $scope.options = {
        type: 'doughnut',
        responsive: false,
        legend: {
            display: true,
            position: 'bottom',
            padding: 5,
            labels: {
                fontColor: 'rgb(130, 152, 174)',
                fontSize: 10,
                boxWidth: 10
            }
        },
        title: {
            display: true
        }
    };
    $scope.showDoughnut = false;
    $scope.showGraph = function (event,selectedData) {
        $scope.doughnutObj = {labels: [], data: [], node: []};
        $scope.doughnutObj.labels.push('Channel Answered');
        $scope.doughnutObj.labels.push('Dial Success');
        $scope.doughnutObj.labels.push('Dial Failed');
        $scope.doughnutObj.data.push(selectedData.channel_answered);
        $scope.doughnutObj.data.push(selectedData.dial_success);
        $scope.doughnutObj.data.push(selectedData.dial_failed);
        $scope.showDoughnut = true;

        $("#doughnut").css( {position:"absolute", top:event.pageY, left: event.pageX});

        var d = document.getElementById('doughnut');
        d.style.position = "absolute";
        d.style.left = x_pos+'px';
        d.style.top = y_pos+'px';

    };

    $scope.hideGraph = function () {
        $scope.showDoughnut = false;
    }

});

mainApp.controller("campaignDispositionReportController", function ($scope, $q, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService) {

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
    $scope.pageSizRange = [10, 500, 1000, 5000, 10000];
    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = 100;

    $scope.isLoading = false;
    $scope.dispositionInfo = {
        /*campaign:{},
        dialerState:{},
        callBackReason:{},*/
        //
        // tryCount:{}
    };
    $scope.campaigns = [];
    $scope.callBackReasons = [];
    $scope.dialerStates = ["dial_failed","dial_success","channel_answered"];

    /*$scope.GetCampaigns = function () {
        $scope.isLoading = true;
        campaignService.GetCampaigns().then(function (response) {
            $scope.campaigns = response;

            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Campaigns.");
            $scope.isLoading = false;
        });
    };

    $scope.GetAllCallBackReasons = function () {
        campaignService.GetAllCallBackReasons().then(function (response) {
            $scope.callBackReasons = response;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get CallBack Reasons.");
        });
    };*/

    var getInitialConfigData = function () {
        $scope.isLoading = true;
        var promise1 = campaignService.GetCampaigns();
        var promise2 = campaignService.GetAllCallBackReasons();

        return  $q.all([promise1, promise2]).then(function (data) {
            if(data){
                $scope.campaigns = data[0];
                //$scope.callBackReasons
                if(data[1])
                {
                    data[1].map(function (item) {
                        if(item&&item.HangupCause){
                            $scope.callBackReasons = $scope.callBackReasons.concat(item.HangupCause)
                        }
                    });
                }
            }
            $scope.isLoading = false;
        });


    };
    getInitialConfigData();

    $scope.CampaignDispositionReportCount = function () {
        campaignService.CampaignDispositionReportCount($scope.dispositionInfo).then(function (response) {
            $scope.pageTotal = response;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Page Count.");
        });
    };


    $scope.getPageData = function (Paging, page, pageSize, total) {
        if ($scope.dispositionInfo.campaign.CampaignId <= 0) {
            $scope.showAlert("Campaign Report", 'error', "Please Select Campaign.");
            return;
        }
        $scope.isLoading = true;
        campaignService.CampaignDispositionReport(page, pageSize, $scope.dispositionInfo).then(function (response) {
            $scope.campaignSummery = response;
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Summery Report.");
            $scope.isLoading = false;
        });
    };

    $scope.loadData = function () {
        $scope.CampaignDispositionReportCount();
        $scope.getPageData("", $scope.currentPage, $scope.pageSize, $scope.pageTotal);

    };


});

mainApp.controller("campaignCallbackReportController", function ($scope, $q, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService) {

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
    $scope.pageSizRange = [10, 500, 1000, 5000, 10000];
    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = 100;

    $scope.isLoading = false;
    $scope.campaign = {};
    $scope.campaigns = [];

    $scope.GetCampaigns = function () {
        $scope.isLoading = true;
        campaignService.GetCampaigns().then(function (response) {
            $scope.campaigns = response;

            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Campaigns.");
            $scope.isLoading = false;
        });
    };
    $scope.GetCampaigns();

    $scope.CampaignCallbackReportCount = function () {
        campaignService.CampaignCallbackReportCount($scope.campaign.CampaignId).then(function (response) {
            $scope.pageTotal = response;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Page Count.");
        });
    };


    $scope.getPageData = function (Paging, page, pageSize, total) {
        if ($scope.campaign.CampaignId <= 0) {
            $scope.showAlert("Campaign Report", 'error', "Please Select Campaign.");
            return;
        }
        $scope.isLoading = true;
        campaignService.CampaignCallbackReport(page, pageSize, $scope.campaign.CampaignId).then(function (response) {
            $scope.campaignSummery = response;
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Summery Report.");
            $scope.isLoading = false;
        });
    };

    $scope.loadData = function () {
        $scope.CampaignCallbackReportCount();
        $scope.getPageData("", $scope.currentPage, $scope.pageSize, $scope.pageTotal);
    };


});

mainApp.controller("campaignAttemptReportController", function ($scope, $q, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService) {

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
    $scope.pageSizRange = [10, 500, 1000, 5000, 10000];
    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = 100;

    $scope.isLoading = false;
    $scope.filterInfo = {};
    $scope.campaign = {};
    $scope.campaigns = [];

    $scope.GetCampaigns = function () {
        $scope.isLoading = true;
        campaignService.GetCampaigns().then(function (response) {
            $scope.campaigns = response;

            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Campaigns.");
            $scope.isLoading = false;
        });
    };
    $scope.GetCampaigns();

    $scope.CampaignAttemptReportCount = function () {
        campaignService.CampaignAttemptReportCount($scope.campaign.CampaignId,$scope.filterInfo).then(function (response) {
            $scope.pageTotal = response;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Page Count.");
        });
    };


    $scope.getPageData = function (Paging, page, pageSize, total) {
        if ($scope.campaign.CampaignId <= 0) {
            $scope.showAlert("Campaign Report", 'error', "Please Select Campaign.");
            return;
        }
        $scope.isLoading = true;
        campaignService.CampaignAttemptReport(page, pageSize, $scope.campaign.CampaignId,$scope.filterInfo).then(function (response) {
            $scope.campaignSummery = response;
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Attempt Report.");
            $scope.isLoading = false;
        });
    };

    $scope.loadData = function () {
        $scope.CampaignAttemptReportCount();
        $scope.getPageData("", $scope.currentPage, $scope.pageSize, $scope.pageTotal);
    };


});