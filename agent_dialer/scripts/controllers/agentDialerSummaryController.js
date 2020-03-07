/**
 * Created by Rajinda on 05/17/2017.
 */

mainApp.controller("agentDialerSummaryController", function ($http, $scope, $filter, $location, $log, $q, $anchorScroll, resourceService, notifiSenderService, agentDialService) {

    $anchorScroll();

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
    $scope.BatchNames = [];
    $scope.DialerStates = [];

    $scope.HeaderDetails = function () {
        $scope.BatchNames = [];
        $scope.DialerStates = [];
        $scope.isLoading = true;
        agentDialService.HeaderDetails().then(function (response) {
            if (response) {
                $scope.BatchNames = response.BatchName;
                $scope.DialerStates = response.DialerState;
            }

            resourceService.getResourcesWithoutPaging().then(function (resList) {
                if (resList && resList.length > 0) {
                    $scope.ResourceList = resList;
                }
                $scope.isLoading = false;
            }, function (error) {
                $scope.showAlert("Agent Dialer", 'error', "Fail To Get Resource List");
                $scope.isLoading = false;
            });
        }, function (error) {
            $scope.showAlert("Agent Dialer", 'error', "Fail To Get Page Count.");
            $scope.isLoading = false;
        });
    };

    $scope.HeaderDetails();



    $scope.getPageData = function (Paging, page, pageSize, total) {
        $scope.isLoading = true;
        var data = {};
        if ($scope.dispositionInfo && $scope.dispositionInfo.BatchName) {
            data.BatchName = $scope.dispositionInfo.BatchName;
        }
        if ($scope.dispositionInfo && $scope.dispositionInfo.tryCount > 0) {
            data.TryCount = $scope.dispositionInfo.tryCount;
        }
        if ($scope.dispositionInfo && $scope.dispositionInfo.DialerState) {
            data.DialerState = $scope.dispositionInfo.DialerState;
        }
        if($scope.Resource)
        {
            data.Resource = $scope.Resource;
        }
        data.rowCount = pageSize;
        data.pageNo = page;
        agentDialService.DispositionSummeryReport(data).then(function (response) {
            $scope.campaignSummery = response;
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Summery Report.");
            $scope.isLoading = false;
        });
    };

    $scope.DispositionSummeryReportCount = function () {
        var data = {};
        if ($scope.dispositionInfo && $scope.dispositionInfo.BatchName) {
            data.BatchName = $scope.dispositionInfo.BatchName;
        }
        if ($scope.dispositionInfo && $scope.dispositionInfo.tryCount > 0) {
            data.TryCount = $scope.dispositionInfo.tryCount;
        }
        if ($scope.dispositionInfo && $scope.dispositionInfo.DialerState) {
            data.DialerState = $scope.dispositionInfo.DialerState;
        }
        if($scope.Resource)
        {
            data.Resource = $scope.Resource;
        }
        agentDialService.DispositionSummeryReportCount(data).then(function (response) {
            $scope.pageTotal = response;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Get Page Count.");
        });
    };

    $scope.GetCampaignSummery = function () {
        $scope.DispositionSummeryReportCount();
        $scope.getPageData("", $scope.currentPage, $scope.pageSize, $scope.pageTotal);
    };
});
