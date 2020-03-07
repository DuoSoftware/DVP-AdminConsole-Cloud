/**
 * Created by dinusha on 9/6/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var tagWiseTicketSummaryCtrl = function ($scope, $filter, $q, ticketReportsService, loginService, filterDateRangeValidation, ShareData) {

        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.moment = moment;


        $scope.searchParams = {
            startDay: moment().format("YYYY-MM-DD"),
            endDay: moment().format("YYYY-MM-DD")
        };

		$scope.onDateChange = function () {

			if (moment($scope.searchParams.startDay, "YYYY-MM-DD").isValid() && moment($scope.searchParams.endDay, "YYYY-MM-DD").isValid()) {
				$scope.dateValid = true;
			}
			else {
				$scope.dateValid = false;
			}
		};

        $scope.tagSummaryDetails = [];

        $scope.tagList = [];

        $scope.querySearch = function (query)
        {
            var emptyArr = [];
            if (query === "*" || query === "") {
                if ($scope.tagList) {
                    return $scope.tagList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.tagList)
                {
                    return $scope.tagList.filter(function (item)
                    {
                        var regEx = "^(" + query + ")";

                        if (item.name)
                        {
                            return item.name.match(regEx);
                        }
                        else
                        {
                            return false;
                        }

                    });
                }
                else {
                    return emptyArr;
                }
            }

        };


        var getTagList = function () {
            $scope.tagList = [];
            ticketReportsService.getTagList().then(function (tagList) {

                if(tagList.IsSuccess)
                {
                    if (tagList && tagList.Result)
                    {
                        $scope.tagList.push.apply($scope.tagList, tagList.Result);

                    }

                    ticketReportsService.getCategoryList().then(function (categoryList)
                    {
                        if (categoryList && categoryList.Result)
                        {
                            $scope.tagList.push.apply($scope.tagList, categoryList.Result);
                        }


                    }).catch(function (err) {
                        loginService.isCheckResponse(err);

                    });
                }
                else
                {
                    $scope.showAlert('Tag Wise Ticket Summary', 'error', 'Error loading tags');
                }



            }).catch(function (err) {
                loginService.isCheckResponse(err);
            });
        };

        getTagList();


        $scope.getTicketTagSummary = function ()
        {
            $scope.tagSummaryDetails = [];
            $scope.searchParams.isTableLoading = true;
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.searchParams.startDay + ' 00:00:00' + momentTz;
            var tempEndDate = $scope.searchParams.endDay;

            var endDate = moment(tempEndDate).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00' + momentTz;

            if(moment($scope.searchParams.startDay).isBefore($scope.searchParams.endDay) || moment($scope.searchParams.startDay).isSame($scope.searchParams.endDay))
            {
                try
                {
                    var businessUnit = null;
                    if(ShareData.BusinessUnit != 'ALL' && ShareData.BusinessUnit != null)
                    {
                        businessUnit = ShareData.BusinessUnit;
                    }
                    ticketReportsService.getTicketSummaryTagWise(startDate, endDate, businessUnit).then(function (ticketSummaryResp)
                    {
                        if(ticketSummaryResp && ticketSummaryResp.IsSuccess)
                        {
                            if (ticketSummaryResp.Result && ticketSummaryResp.Result.length > 0)
                            {
                                if($scope.filteredTags && $scope.filteredTags.length > 0)
                                {
                                    for (var key in $scope.filteredTags)
                                    {
                                        var filterObj = _.find(ticketSummaryResp.Result, {'tag': $scope.filteredTags[key].name});

                                        if(filterObj)
                                        {
                                            $scope.tagSummaryDetails.push(filterObj);
                                        }

                                    }
                                }
                                else
                                {
                                    $scope.tagSummaryDetails = ticketSummaryResp.Result;
                                }

                            }
                            else
                            {
                                $scope.showAlert('Tag Wise Ticket Summary', 'warn', 'No data to load for given date range');
                                $scope.tagSummaryDetails = [];
                            }
                        }
                        else
                        {
                            $scope.showAlert('Tag Wise Ticket Summary', 'error', 'Error occurred while loading ticket summary');
                            $scope.tagSummaryDetails = [];
                        }


                        $scope.searchParams.isTableLoading = false;

                    }).catch(function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Tag Wise Ticket Summary', 'error', 'Error occurred while loading ticket summary');
                        $scope.searchParams.isTableLoading = false;
                        $scope.tagSummaryDetails = [];
                    });


                }
                catch (ex) {
                    $scope.showAlert('Tag Wise Ticket Summary', 'error', 'Error occurred while loading ticket summary');
                    $scope.searchParams.isTableLoading = false;
                    $scope.tagSummaryDetails = [];
                }
            }
            else
            {
                $scope.showAlert('Tag Wise Ticket Summary', 'warn', 'End date need to be same as start date or should occur after');
                $scope.tagSummaryDetails = [];
                $scope.searchParams.isTableLoading = false;
            }



        };

        $scope.getTicketTagSummaryCSV = function ()
        {
			/** Kasun_Wijeratne_5_MARCH_2018
			 * ----------------------------------------*/
			if(filterDateRangeValidation.validateDateRange($scope.searchParams.startDay, $scope.searchParams.endDay) == false){
				$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
				return -1;
			}
			/** ----------------------------------------
			 * Kasun_Wijeratne_5_MARCH_2018*/

            var tagSumCsvDetails = [];
            var deferred = $q.defer();
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.searchParams.startDay + ' 00:00:00' + momentTz;
            var tempEndDate = $scope.searchParams.endDay;

            var endDate = moment(tempEndDate).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00' + momentTz;

            $scope.DownloadFileName = 'TAG_WISE_TICKET_SUMMARY_' + $scope.searchParams.startDay + '_' + $scope.searchParams.endDay;

            if(moment($scope.searchParams.startDay).isBefore($scope.searchParams.endDay) || moment($scope.searchParams.startDay).isSame($scope.searchParams.endDay))
            {

                try
                {
                    var businessUnit = null;
                    if(ShareData.BusinessUnit != 'ALL' && ShareData.BusinessUnit != null)
                    {
                        businessUnit = ShareData.BusinessUnit;
                    }

                    ticketReportsService.getTicketSummaryTagWise(startDate, endDate, businessUnit).then(function (ticketSummaryResp)
                    {
                        if (ticketSummaryResp && ticketSummaryResp.IsSuccess)
                        {
                            if (ticketSummaryResp.Result && ticketSummaryResp.Result.length > 0)
                            {
                                if ($scope.filteredTags && $scope.filteredTags.length > 0)
                                {
                                    for (var key in $scope.filteredTags)
                                    {
                                        var filterObj = _.find(ticketSummaryResp.Result, {'tag': $scope.filteredTags[key].name});

                                        if (filterObj)
                                        {
                                            tagSumCsvDetails.push(filterObj);
                                        }

                                    }
                                }
                                else
                                {
                                    tagSumCsvDetails = ticketSummaryResp.Result;
                                }


                                deferred.resolve(tagSumCsvDetails);
                            }
                            else
                            {
                                $scope.showAlert('Tag Wise Ticket Summary', 'warn', 'No data to load for given date range');
                                deferred.reject(tagSumCsvDetails);

                            }
                        }
                        else
                        {
                            $scope.showAlert('Tag Wise Ticket Summary', 'error', 'Error occurred while loading ticket summary');
                            deferred.reject(tagSumCsvDetails);
                        }


                    }).catch(function (err)
                    {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Tag Wise Ticket Summary', 'error', 'Error occurred while loading ticket summary');
                        deferred.reject(tagSumCsvDetails);
                    });


                }
                catch (ex)
                {
                    $scope.showAlert('Tag Wise Ticket Summary', 'error', 'Error occurred while loading ticket summary');
                    deferred.reject(tagSumCsvDetails);
                }
            }
            else
            {
                $scope.showAlert('Tag Wise Ticket Summary', 'warn', 'End date need to be same as start date or should occur after');
                deferred.reject(tagSumCsvDetails);
            }

            return deferred.promise;

        };


    };
    app.controller("tagWiseTicketSummaryCtrl", tagWiseTicketSummaryCtrl);

}());


