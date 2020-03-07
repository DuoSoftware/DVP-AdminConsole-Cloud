mainApp.controller("agentDialerAgentSummaryController", function ($http, $scope, $filter, $location, $log, $q, $anchorScroll, notifiSenderService, agentDialService) {

    $anchorScroll();


    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.isLoading = false;
    $scope.noDataToshow = false;


    $scope.isLoading = false;
    $scope.BatchNames = [];
    $scope.AgentWiseSummary = [];


    $scope.StartDate = moment().format("YYYY-MM-DD");
    $scope.EndDate = moment().format("YYYY-MM-DD");

    $scope.HeaderDetails = function () {
        $scope.BatchNames = [];
        $scope.DialerStates = [];
        $scope.isLoading = true;
        agentDialService.HeaderDetails().then(function (response) {
            if (response) {
                $scope.BatchNames = response.BatchName;
                $scope.DialerStates = response.DialerState;
            }
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Agent Dialer", 'error', "Fail To Get Page Count.");
            $scope.isLoading = false;
        });
    };

    $scope.HeaderDetails();



    $scope.getPageData = function () {
        $scope.isLoading = true;
        var data = {};
        if ($scope.BatchName) {
            data.BatchName = $scope.BatchName;
        }
        var momentTz = moment.parseZone(new Date()).format('Z');
        data.StartDate = $scope.StartDate + ' 00:00:00' + momentTz;
        data.EndDate = $scope.EndDate + ' 23:59:59' + momentTz;
        agentDialService.DispositionSummeryAgentWiseReport(data).then(function (response)
        {
            $scope.AgentWiseSummary = response;
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Summery Report.");
            $scope.isLoading = false;
        });
    };
});
