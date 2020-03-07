mainApp.controller("campaignCallSummaryController", function ($http, $scope, $filter, $location, $log, $q, $anchorScroll, sipUserApiHandler, campaignService, cdrApiHandler, filterDateRangeValidation) {

    $anchorScroll();


    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.initialLoad = true;

    $scope.SummaryDetails = [];

    $scope.campaignList = [];
    $scope.AnsweredCalls = 0;
    $scope.QueuedCalls = 0;
    $scope.isError = false;

    var getCampaigns = function()
    {
        campaignService.GetCampaigns().then(function (campaignList) {
            if (campaignList && campaignList.length > 0) {
                $scope.campaignList = campaignList;
            }


        }).catch(function (err) {
        });
    };

    var getUserList = function () {


        $scope.userList = [];

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

                            $scope.userList.push(item);

                        });


                    });

                }


            }).catch(function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while getting user list";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);


            });



        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while getting user list";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);



        });

        /*sipUserApiHandler.getSIPUsers().then(function (userList) {
            if (userList && userList.Result && userList.Result.length > 0) {
                $scope.userList = userList.Result;
            }


        }).catch(function (err) {
        });*/
    };

    getUserList();

    getCampaigns();

    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.BatchNames = [];
    $scope.AgentWiseSummary = [];


    $scope.StartDate = moment().format("YYYY-MM-DD");
    $scope.EndDate = moment().format("YYYY-MM-DD");

    $scope.DownloadCSV = function () {
		/** Kasun_Wijeratne_5_MARCH_2018
		 * ----------------------------------------*/
		if(filterDateRangeValidation.validateDateRange($scope.StartDate, $scope.EndDate) == false){
			$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
			return -1;
		}
		/** ----------------------------------------
		 * Kasun_Wijeratne_5_MARCH_2018*/

        $scope.DownloadFileName = 'CAMPAIGN_SUMMARY_' + $scope.StartDate + '_' + $scope.EndDate;
        var deferred = $q.defer();
        var emptyList = [];

        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");
        var startD = $scope.StartDate + ' 00:00:00' + momentTz;
        var endD  = $scope.EndDate + ' 23:59:59' + momentTz;

        if(moment($scope.StartDate).isBefore($scope.EndDate) || moment($scope.StartDate).isSame($scope.EndDate))
        {
            cdrApiHandler.getCampaignAgentSummary(startD, endD).then(function (response){

                if(response.Result)
                {
                    deferred.resolve(response.Result);
                }
                else
                {
                    deferred.reject(emptyList);
                }

            }, function (error) {
                deferred.reject(emptyList);
            });
        }
        else
        {
            deferred.reject(emptyList);
        }


        return deferred.promise;
    };


    $scope.getPageData = function () {

        $scope.isLoading = true;
        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");
        var startD = $scope.StartDate + ' 00:00:00' + momentTz;
        var endD  = $scope.EndDate + ' 23:59:59' + momentTz;

        cdrApiHandler.getCampaignAgentSummary(startD, endD).then(function (response)
        {
            if(response.Result)
            {
                $scope.SummaryDetails = response.Result;

                $scope.isError = false;
            }
            else
            {
                $scope.isError = true;
            }
            $scope.isLoading = false;
            $scope.initialLoad = false;
        }, function (error) {
            $scope.showAlert("Campaign Report", 'error', "Fail To Load Summery Report.");
            $scope.isLoading = false
            $scope.isError = true;
            $scope.initialLoad = false;
        });
    };
});
