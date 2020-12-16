/**
 * Created by Pawan on 6/15/2016.
 */
/**
 * Created by Pawan on 6/15/2016.
 */

mainApp.controller("agentSummaryController", function ($scope, $filter, $state, $q, agentSummaryBackendService, loginService, $anchorScroll,uiGridConstants, filterDateRangeValidation,ShareData ) {

    $anchorScroll();
    $scope.startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
    $scope.endDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
    $scope.dateValid = true;
    $scope.agentSummaryList = [];
    $scope.Agents = [];

	$scope.onDateChange = function () {

		if (moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid()) {
			$scope.dateValid = true;
		}
		else {
			$scope.dateValid = false;
		}
	};

     $(function () {
         $("#startDate").datepicker({maxDate: "-1D", dateFormat:"yy-mm-dd" });
     });

     $(function () {
         $("#endDate").datepicker({maxDate: "-1D", dateFormat:"yy-mm-dd"  });
     });

    var resetTotals = function() {

        $scope.total = {
            StaffTime: 0,
            InboundTime: 0,
            OutboundTime: 0,
            InboundIdleTime: 0,
            OutboundIdleTime: 0,
            OfflineIdleTime: 0,
            InboundAfterWorkTime: 0,
            OutboundAfterWorkTime: 0,
            InboundAverageHandlingTime: '00:00:00',
            OutboundAverageHandlingTime: '00:00:00',
            InboundAverageTalkTime: '00:00:00',
            OutboundAverageTalkTime: '00:00:00',
            InboundTalkTime: 0,
            OutboundTalkTime: 0,
            InboundHoldTime: 0,
            OutboundHoldTime: 0,
            BreakTime: 0,
            Answered: 0,
            InboundCalls: 0,
            OutboundCalls: 0,
            OutboundAnswered: 0,
            InboundAnswered: 0,
            InboundHold: 0,
            OutboundHold: 0,
            InboundAverageHoldTime: '00:00:00',
            OutboundAverageHoldTime: '00:00:00'
        };
    };

    $scope.querySearch = function (query) {
        var emptyArr = [];
        if (query === "*" || query === "") {
            if ($scope.Agents) {
                return $scope.Agents;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.Agents) {
                var filteredArr = $scope.Agents.filter(function (item) {

                    if (item.ResourceName) {
                        return item.ResourceName.toString().toLowerCase().match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return emptyArr;
            }


           /* if ($scope.Agents) {
                return $scope.Agents.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.ResourceName) {
                        return item.ResourceName.match(regEx);
                    }
                    else {
                        return false;
                    }

                });
            }
            else {
                return emptyArr;
            }*/
        }

    };

    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 50; // your header height
        return {
            height: (($scope.gridQOptions.data.length+2) * rowHeight + headerHeight) + "px"
        };
    };

    $scope.gridQOptions = {
        enableSorting: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false,
        columnDefs: [
            {
                width: '150',name: 'Agent ID', field: 'AgentName', headerTooltip: 'Agent Name',  sort: {
                direction: uiGridConstants.ASC
            }
            },
            {width: '80',name: 'Date', field: 'Date', headerTooltip: 'Date',cellFilter: 'date:\'yyyy-MM-dd\'', cellClass: 'table-time'},
            {width: '150',name: 'LoginTime', field: 'LoginTime', headerTooltip: 'Login Time', cellClass: 'table-time'},
            {width: '80',name : 'StaffTime', field: 'StaffTime', headerTooltip: 'Staff Time', cellClass: 'table-time'},
            {width: '60',name: 'TotalAnswered', field: 'TotalAnswered', headerTooltip: 'Total Answered(Inbound & Outbound)', cellClass: 'table-number'},
            {width: '60',name: 'TotalAnsweredInbound', field: 'TotalAnsweredInbound', headerTooltip: 'Total Inbound Answered', cellClass: 'table-number'},
            {width: '60',name: 'TotalAnsweredOutbound', field: 'TotalAnsweredOutbound', headerTooltip: 'Total Outbound Answered', cellClass: 'table-number'},
            {width: '80',name : 'InboundTime', field: 'InboundTime', headerTooltip: 'Inbound Time', cellClass: 'table-time'},
            {width: '80',name : 'OutboundTime', field: 'OutboundTime', headerTooltip: 'Outbound Time', cellClass: 'table-time'},
            {width: '80',name : 'IdleTimeInbound', field: 'IdleTimeInbound', headerTooltip: 'Idle Time(inbound)', cellClass: 'table-time'},
            {width: '80',name : 'IdleTimeOutbound', field: 'IdleTimeOutbound', headerTooltip: 'Idle Time(outbound)', cellClass: 'table-time'},
            {width: '80',name : 'IdleTimeOffline', field: 'IdleTimeOffline', headerTooltip: 'Idle Time(offline)', cellClass: 'table-time'},
            {width: '80',name : 'TalkTimeInbound', field: 'TalkTimeInbound', headerTooltip: 'Talk Time(inbound)', cellClass: 'table-time'},
            {width: '80',name : 'TalkTimeOutbound', field: 'TalkTimeOutbound', headerTooltip: 'Talk Time(outbound)', cellClass: 'table-time'},
            //{width: '60',name : 'MissedCallCount', field: 'MissCallCount', headerTooltip: 'MissedCallCount', cellClass: 'table-number'},
            {width: '80',name : 'TotalHoldTimeInbound', field: 'TotalHoldTimeInbound', headerTooltip: 'Hold Time(inbound)', cellClass: 'table-time'},
            {width: '80',name : 'TotalHoldTimeOutbound', field: 'TotalHoldTimeOutbound', headerTooltip: 'Hold Time(outbound)', cellClass: 'table-time'},
            {width: '80',name : 'AfterWorkTimeInbound', field: 'AfterWorkTimeInbound', headerTooltip: 'After Work Time(inbound)', cellClass: 'table-time'},
            {width: '80',name : 'AfterWorkTimeOutbound', field: 'AfterWorkTimeOutbound', headerTooltip: 'After Work Time(outbound)', cellClass: 'table-time'},
            {width: '80',name : 'BreakTime', field: 'BreakTime', headerTooltip: 'Break Time', cellClass: 'table-time'},
            {width: '80',name : 'AverageHandlingTimeInbound', field: 'AverageHandlingTimeInbound', headerTooltip: 'Average Handling Time(inbound)', cellClass: 'table-time'},
            {width: '80',name : 'AverageHandlingTimeOutbound', field: 'AverageHandlingTimeOutbound', headerTooltip: 'Average Handling Time(outbound)', cellClass: 'table-time'},
            {width: '80',name : 'AvgTalkTimeInbound', field: 'AvgTalkTimeInbound', headerTooltip: 'Average Talk Time(inbound)', cellClass: 'table-time'},
            {width: '80',name : 'AvgTalkTimeOutbound', field: 'AvgTalkTimeOutbound', headerTooltip: 'Average Talk Time(outbound)', cellClass: 'table-time'},
            {width: '80',name : 'AvgHoldTimeInbound', field: 'AvgHoldTimeInbound', headerTooltip: 'Average Hold Time(inbound)', cellClass: 'table-time'},
            {width: '80',name : 'AvgHoldTimeOutbound', field: 'AvgHoldTimeOutbound', headerTooltip: 'Average Hold Time(outbound)', cellClass: 'table-time'}
        ],
        data: $scope.agentSummaryList,
        onRegisterApi: function (gridApi) {
            //$scope.grid1Api = gridApi;
        }
    };


//    $scope.dtOptions = {paging: false, searching: false, info: false, order: [2, 'asc']};

    $scope.getAgentSummary = function () {
        $scope.isTableLoading = 0;
        $scope.agentSummaryList = [];
        $scope.gridQOptions.data = [];
        var resId = null;
        var duration = moment($scope.endDate, 'YYYY-MM-DD').diff(moment($scope.startDate, 'YYYY-MM-DD'), 'days');
        console.log("duration : "+ duration);
        if (duration <= applicationConfig.repMaxDateRangeAgentProd && duration >= 0) {

            // if ($scope.agentFilter) {
                if ($scope.agentFilter) {
                    resId = $scope.agentFilter.ResourceId;
                }

                var momentTz = moment.parseZone(new Date()).format('Z');
                momentTz = momentTz.replace("+", "%2B");

                var queryStartDate = $scope.startDate + ' 00:00:00' + momentTz;
                var queryEndDate = $scope.endDate + ' 23:59:59' + momentTz;

                agentSummaryBackendService.getAgentSummary(queryStartDate, queryEndDate, resId, ShareData.BusinessUnit).then(function (response) {


                    if (!response.data.IsSuccess) {
                        console.log("Agent Summary loading failed ", response.data.Exception);
                        $scope.isTableLoading = 1;
                    } else {
                        resetTotals();
                        var summaryData = response.data.Result;

                        $scope.total.StaffTime = summaryData[0].totalStaffTime;
                        $scope.total.InboundIdleTime = summaryData[0].totalInboundIdleTime;
                        $scope.total.OutboundIdleTime = summaryData[0].totalOutboundIdleTime;
                        $scope.total.OfflineIdleTime = summaryData[0].totalOfflineIdleTime;
                        $scope.total.InboundAfterWorkTime = summaryData[0].totalInboundAfterWorkTime;
                        $scope.total.OutboundAfterWorkTime = summaryData[0].totalOutboundAfterWorkTime;
                        $scope.total.InboundAverageHandlingTime = summaryData[0].avgInboundHandlingTime;
                        $scope.total.OutboundAverageHandlingTime = summaryData[0].avgOutboundHandlingTime;
                        $scope.total.InboundTalkTime = summaryData[0].totalInboundTalkTime;
                        $scope.total.OutboundTalkTime = summaryData[0].totalOutboundTalkTime;
                        $scope.total.InboundHoldTime = summaryData[0].totalInboundHoldTime;
                        $scope.total.OutboundHoldTime = summaryData[0].totalOutboundHoldTime;
                        $scope.total.BreakTime = summaryData[0].totalBreakTime;
                        $scope.total.Answered = summaryData[0].totalInboundAnswered + summaryData[0].totalOutboundAnswered;
                        $scope.total.InboundCalls = summaryData[0].totalCallsInb;
                        $scope.total.OutboundCalls = summaryData[0].totalCallsOut;
                        // $scope.total.MissCallCount = MissCallCount;
                        $scope.total.OutboundAnswered = summaryData[0].totalOutboundAnswered;
                        $scope.total.InboundAnswered = summaryData[0].totalInboundAnswered;
                        $scope.agentSummaryList = summaryData;

                        for (var k = 0; k < $scope.agentSummaryList.length; k++) {
                            for (var l = 0; l < $scope.Agents.length; l++) {
                                if ($scope.Agents[l].ResourceId == $scope.agentSummaryList[k].Agent) {
                                    $scope.agentSummaryList[k].AgentName = $scope.Agents[l].ResourceName;

                                }
                            }
                        }

                        $scope.gridQOptions.data = $scope.agentSummaryList;
                        $scope.isTableLoading = 1;

                    }

                }, function (error) {
                    loginService.isCheckResponse(error);
                    console.log("Error in Agent Summary loading ", error);
                    $scope.isTableLoading = 1;
                });
            // } else {
            //     resetTotals();
            //     $scope.showAlert("Agent Productivity Summary", 'info', "Please select one or more agent");
            //     $scope.isTableLoading = 1;
            // }
        }
        else{
            $scope.showAlert('Agent Productivity Summary', 'error', 'Date range should be between 0 and ' + applicationConfig.repMaxDateRangeAgentProd );
            $scope.isTableLoading = 1;
        }
    };

    $scope.disableDownload = false;

    $scope.getAgentSummaryCSV = function () {
		/** Kasun_Wijeratne_5_MARCH_2018
		 * ----------------------------------------*/
		if(filterDateRangeValidation.validateDateRange($scope.startDate, $scope.endDate) == false){
			$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
			return -1;
		}
        var duration = moment($scope.endDate, 'YYYY-MM-DD').diff(moment($scope.startDate, 'YYYY-MM-DD'), 'days');
        console.log("duration : "+ duration);
		/** ----------------------------------------
		 * Kasun_Wijeratne_5_MARCH_2018*/
        $scope.disableDownload = true;
        $scope.DownloadFileName = 'AGENT_PRODUCTIVITY_SUMMARY_' + $scope.startDate + '_' + $scope.endDate;
        var deferred = $q.defer();
        var agentSummaryList = [];
        var resId = null;
        if ($scope.agentFilter) {
            resId = $scope.agentFilter.ResourceId;
        }

        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var queryStartDate = $scope.startDate + ' 00:00:00' + momentTz;
        var queryEndDate = $scope.endDate + ' 23:59:59' + momentTz;

        agentSummaryBackendService.getAgentSummary(queryStartDate, queryEndDate, resId, ShareData.BusinessUnit).then(function (response) {

            $scope.disableDownload = false;

            if (!response.data.IsSuccess) {
                console.log("Queue Summary loading failed ", response.data.Exception);
                deferred.reject(agentSummaryList);
            }
            else {
                var summaryData = response.data.Result;

                agentSummaryList = summaryData;

                for (var k = 0; k < agentSummaryList.length; k++) {
                    var d = new Date(agentSummaryList[k].LoginTime);
                    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
                        d.getHours() + ":" + d.getMinutes();
                    agentSummaryList[k].LoginTime = datestring;
                    console.log("Login Time : " + agentSummaryList[k].LoginTime);
                    for (var l = 0; l < $scope.Agents.length; l++) {
                        if ($scope.Agents[l].ResourceId == agentSummaryList[k].Agent) {
                            agentSummaryList[k].AgentName = $scope.Agents[l].ResourceName;
                        }
                    }
                }
                console.log("ResID : "+ resId);
                if(resId == null && duration === 0){
                    var total =
                        {
                            AgentName: 'Total',
                            Date: 'N/A',
                            LoginTime: 'N/A',
                            StaffTime: summaryData[0].totalStaffTime,
                            InboundTime: summaryData[0].totalInboundTime,
                            OutboundTime: summaryData[0].totalOutboundTime,
                            IdleTimeInbound: summaryData[0].totalInboundIdleTime,
                            IdleTimeOutbound: summaryData[0].totalOutboundIdleTime,
                            IdleTimeOffline: summaryData[0].totalOfflineIdleTime,
                            AfterWorkTimeInbound: summaryData[0].totalInboundAfterWorkTime,
                            AfterWorkTimeOutbound: summaryData[0].totalOutboundAfterWorkTime,
                            AverageHandlingTimeInbound: summaryData[0].avgInboundHandlingTime,
                            AverageHandlingTimeOutbound: summaryData[0].avgOutboundHandlingTime,
                            AvgTalkTimeInbound: summaryData[0].avgInboundTalkTime,
                            AvgTalkTimeOutbound: summaryData[0].avgOutboundTalkTime,
                            TalkTimeInbound: summaryData[0].totalInboundTalkTime,
                            TalkTimeOutbound: summaryData[0].totalOutboundTalkTime,
                            TotalHoldTimeInbound: summaryData[0].totalInboundHoldTime,
                            TotalHoldTimeOutbound: summaryData[0].totalOutboundHoldTime,
                            BreakTime: summaryData[0].totalBreakTime,
                            TotalAnswered: summaryData[0].totalInboundAnswered + summaryData[0].totalOutboundAnswered,
                            TotalCallsInbound: summaryData[0].totalCallsInb,
                            TotalCallsOutbound: summaryData[0].totalCallsOut,
                            //MissCallCount: MissCallCount,
                            TotalAnsweredOutbound: summaryData[0].totalOutboundAnswered,
                            TotalHoldInbound: summaryData[0].totalInboundHoldCount,
                            TotalHoldOutbound: summaryData[0].totalOutboundHoldCount,
                            AvgHoldTimeInbound: summaryData[0].avgInboundHoldTime,
                            AvgHoldTimeOutbound: summaryData[0].avgOutboundHoldTime
                        };

                    agentSummaryList.push(total);
                }
                deferred.resolve(agentSummaryList);


            }

        }, function (error) {
            $scope.disableDownload = false;
            loginService.isCheckResponse(error);
            console.log("Error in Queue Summary loading ", error);
            deferred.reject(agentSummaryList);
        });

        return deferred.promise;
    };

    $scope.getAgents = function () {

        ShareData.getAgentDetailsCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(ShareData.getAgentDetailsWithPaging(pagesize, i));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {

                    resolveData.map(function (data) {

                        data.map(function (item) {

                            $scope.Agents.push(item);
                        });
                    });

                }
                else
                {
                    $scope.showAlert("Error","Error in loading agent details","error");
                }



            }).catch(function (err) {
                console.log("Error in Agent details picking " + err);

                $scope.showAlert("Error","Error in loading Agent details","error");
            });



        }, function (err) {
            console.log("Error in Agent details picking " + err);
            $scope.showAlert("Error","Error in loading Agent details","error");
        });



        /*agentSummaryBackendService.getAgentDetails().then(function (response) {
            if (response.data.IsSuccess) {

                console.log(response.data.Result.length + " Agent records found");
                $scope.Agents = response.data.Result;
            }
            else {
                console.log("Error in Agent details picking");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Agent details picking " + error);
        });*/
    };

    $scope.getAgents();

});