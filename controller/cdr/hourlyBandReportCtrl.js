/**
 * Created by marlon on 9/6/2016.
 */

(function () {
    var app = angular.module("veeryConsoleApp");

    var hourlyBandReportCtrl = function ($scope, $filter, $timeout, loginService, authService,cdrApiHandler, resourceService, baseUrls,$anchorScroll,ShareData, uiGridConstants, uiGridGroupingConstants) {

        $scope.dateValid = true;
        $scope.gridApi;

        $scope.hourlyBandGridOptions = {
            enableFiltering: true,
            enableExpandable: true,
            enableColumnResizing: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            noUnselect: false, enableHorizontalScrollbar: true,
            columnDefs: [
                {
                    name: 'Date',
                    field: 'date',
                    headerTooltip: 'Date',
                    enableFiltering: true,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: '10%',
                    grouping: { groupPriority: 0 },
                    sort: {
                        priority: 0,
                        direction: uiGridConstants.ASC
                    }
                },
                {
                    name: 'Hour',
                    field: 'hour',
                    headerTooltip: 'Hour',
                    enableFiltering: true,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: '5%', cellClass: 'table-number',
                    grouping: { groupPriority: 1 },
                    sort: {
                        priority: 1,
                        direction: uiGridConstants.ASC
                    }
                },
                {
                    name: 'Agent Skill',
                    field: 'agentskill',
                    headerTooltip: 'Agent Skill',
                    enableFiltering: true,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: '10%',
                    sort: {
                        priority: 2,
                        direction: uiGridConstants.ASC
                    }
                },

                {
                    name: 'IVR Calls (Count)',
                    field: 'IVRCallsCount',
                    headerTooltip: 'IVR Calls (Count)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*" , cellClass: 'table-number',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    }
                    },
                {
                    name: 'Queued Calls (Count)',
                    field: 'QueuedCallsCount',
                    headerTooltip: 'Queued Calls (Count)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*", cellClass: 'table-number',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    }
                },
                {
                    name: 'Abandoned Calls (Count)',
                    field: 'AbandonCallsCount',
                    headerTooltip: 'Abandoned Calls (Count)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*", cellClass: 'table-number',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    }
                },
                {
                    name: 'Abandoned Calls (%)',
                    field: 'AbandonPercentage',
                    headerTooltip: 'Abandoned Percentage',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*", cellClass: 'table-number'
                },
                {
                    name: 'Abandoned Queue Time (Avg)',
                    field: 'AbandonedQueueAvg',
                    headerTooltip: 'Abandoned Queue Time (Avg)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "6%", cellClass: 'table-time'
                },
                {
                    name: 'Dropped Calls (Count)',
                    field: 'DropCallsCount',
                    headerTooltip: 'Dropped Calls (Count)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*", cellClass: 'table-number',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    }
                },
                {
                    name: 'Dropped Calls (%)',
                    field: 'DropPercentage',
                    headerTooltip: 'Dropped Calls (%)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*", cellClass: 'table-number'
                },
                {
                    name: 'Hold Time (Avg)',
                    field: 'HoldAverage',
                    headerTooltip: 'Hold Time (Avg)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "6%", cellClass: 'table-time'
                },
                {
                    name: 'IVR Time (Avg)',
                    field: 'IvrAverage',
                    headerTooltip: 'IVR Time (Avg)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "6%", cellClass: 'table-time'
                },
                {
                    name: 'Queue Time (Avg)',
                    field: 'QueueAverage',
                    headerTooltip: 'Queue Time (Avg)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "6%", cellClass: 'table-time'
                },
                {
                    name: 'Answer Speed (Avg)',
                    field: 'RingAverage',
                    headerTooltip: 'Answer Speed (Avg)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "6%", cellClass: 'table-time'
                },
                {
                    name: 'Talk Time (Avg)',
                    field: 'TalkAverage',
                    headerTooltip: 'Talk Time (Avg)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "6%", cellClass: 'table-time'
                },
                {
                    name: 'Answered Calls (Count)',
                    field: 'AnswerCount',
                    headerTooltip: 'Answered Calls (Count)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*", cellClass: 'table-time',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    }
                },
                {
                    name: 'Answer Percentage (%)',
                    field: 'AnswerPercentage',
                    headerTooltip: 'Answer Percentage (%)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'Answer Queue Time (Avg)',
                    field: 'AnsweredQueueAvg',
                    headerTooltip: 'Answer Queue Time (Avg)',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    groupingShowAggregationMenu: false,
                    width: "6%", cellClass: 'table-time'
                }

            ],
            data: [{test: "loading"}],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $anchorScroll();

        $scope.getTableHeight = function() {
            var rowHeight = 30;
            var headerHeight = 50; // your header height
            var height = 300 + headerHeight;
            if ($scope.gridApi.core.getVisibleRows().length * rowHeight > 200){
                height = $scope.gridApi.core.getVisibleRows().length * rowHeight + headerHeight;
            }
            return "height:" + height + "px !important;"
        };



        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'asc']};

        $scope.onDateChange = function () {
            if (moment($scope.obj.fromdate, "YYYY-MM-DD").isValid() && moment($scope.obj.todate, "YYYY-MM-DD").isValid()) {
                $scope.dateValid = true;
            }
            else {
                $scope.dateValid = false;
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

        $scope.moment = moment;

        $scope.summaryArr = [];

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';



        $scope.obj = {
            fromdate: moment().format("YYYY-MM-DD"),
            todate: moment().format("YYYY-MM-DD"),
            fromhour: parseInt(moment().format("H")),
            tohour: parseInt(moment().format("H"))
        };

        var checkFileReady = function (fileName) {

            if ($scope.cancelDownload) {
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
            }
            else {
                cdrApiHandler.getFileMetaData(fileName).then(function (fileStatus) {
                    if (fileStatus && fileStatus.Result) {
                        if (fileStatus.Result.Status === 'PROCESSING') {
                            $timeout(checkFileReady(fileName), 10000);
                        }
                        else {


                            var decodedToken = authService.getTokenDecode();

                            if (decodedToken && decodedToken.company && decodedToken.tenant) {
                                $scope.currentCSVFilename = fileName;
                                $scope.DownloadCSVFileUrl = baseUrls.fileServiceInternalUrl + 'File/DownloadLatest/' + decodedToken.tenant + '/' + decodedToken.company + '/' + fileName;
                                $scope.fileDownloadState = 'READY';
                                $scope.DownloadButtonName = 'CSV';
                                $scope.cancelDownload = true;
                                $scope.buttonClass = 'fa fa-spinner fa-spin';
                            }
                            else {
                                $scope.fileDownloadState = 'RESET';
                                $scope.DownloadButtonName = 'CSV';
                            }


                        }
                    }
                    else {
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                    }

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                });
            }

        };

        $scope.downloadPress = function () {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };


        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        var emptyArr = [];

        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.qList) {
                    return $scope.qList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.qList) {
                    var filteredArr = $scope.qList.filter(function (item) {
                        //var regEx = "^(" + query + ")";

                        if (item.Attribute) {
                            return item.Attribute.match(query);
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
            }

        };

        $scope.checkTagCount = function () {
            if (!$scope.skillFilter || $scope.skillFilter.length < 5) {
                return true;
            }
            else {
                return false;
            }
        };


        var getQueueList = function () {

            resourceService.getQueueSettings().then(function (qList) {
                if (qList && qList.length > 0) {

                    var tempQList = qList.filter(function(q)
                    {
                        return !!(q.ServerType === 'CALLSERVER' && q.RequestType === 'CALL');
                    });

                    $scope.qList = tempQList;
                }
                else
                {
                    $scope.qList = [];
                }


            }).catch(function (err) {
                $scope.qList = [];
                loginService.isCheckResponse(err);
            });
        };
        getQueueList();

        var tempQueueArr = {};
        var curCount = 0;
//---
        var buildSummaryListByHr = function (fromdate, todate, fromhour, tohour, attributes, recId, momentTz, callback)
        {
            cdrApiHandler.getCallSummaryForQueueByHr(fromdate, todate, fromhour, tohour, attributes, momentTz,ShareData.BusinessUnit).then(function (sumResp)
            {
                if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result)
                {

                    tempQueueArr = sumResp.Result;
                    callback(null, true);

                }
                else
                {
                    callback(null, false);
                }


            }, function (err) {
                loginService.isCheckResponse(err);
                callback(err, false);
            })
        };


        $scope.getCallSummaryByHr = function () {

            try
            {
                $scope.summaryArr = [];
                $scope.hourlyBandGridOptions.data = {};
                $scope.progressSumVal = 0;
                curCount = 0;

                var momentTz = moment.parseZone(new Date()).format('Z');

                $scope.obj.isTableLoadingHr = 0;

                if($scope.skillFilter && $scope.skillFilter.length > 0)
                {

                    if((moment($scope.obj.fromdate).isBefore($scope.obj.todate) || moment($scope.obj.fromdate).isSame($scope.obj.todate)) && $scope.obj.fromhour <= $scope.obj.tohour) {

                        var duration = moment($scope.obj.todate, 'YYYY-MM-DD').diff(moment($scope.obj.fromdate, 'YYYY-MM-DD'), 'days');

                        if (duration <= applicationConfig.repMaxDateRangeHourlyBand) {
                            var skillArr = [];
                            for (var i = 0; i < $scope.skillFilter.length; i++) {
                                skillArr.push($scope.skillFilter[i].QueueName)
                            }

                            var skillString = skillArr.join(',');

                            buildSummaryListByHr($scope.obj.fromdate, $scope.obj.todate, $scope.obj.fromhour, $scope.obj.tohour, skillString, $scope.skillFilter[0].RecordID, momentTz, function (err, processDoneResp) {
                                if (err) {
                                    $scope.showAlert('Hourly Band Report', 'error', 'Error occurred');
                                }
                                $scope.hourlyBandGridOptions.data = tempQueueArr;
                                $scope.obj.isTableLoadingHr = 1;

                            });
                        }
                        else {
                            $scope.showAlert('Hourly Band Report', 'error', 'Maximum date range of ' + applicationConfig.repMaxDateRangeHourlyBand + ' days exceeded');
                            $scope.obj.isTableLoadingHr = 1;
                        }
                    }
                    else{
                        $scope.showAlert('Hourly Band Report', 'error', 'To date and hour need to be same as From date and hour or should occur after');
                        $scope.obj.isTableLoadingHr = 1;
                    }
                }
                else
                {
                    $scope.showAlert('Hourly Band Report', 'error', 'No queues added');
                    $scope.obj.isTableLoadingHr = 1;
                }


            }
            catch (ex) {
                $scope.showAlert('Hourly Band Report', 'error', 'Error occurred while loading hourly summary');
                $scope.obj.isTableLoadingHr = 1;
            }

        };

        $scope.getCallSummaryDownload = function () {

            try {
                $scope.summaryArr = [];

                var attribArray = $scope.skillFilter.map(function (item) {
                    return item.QueueName;
                });

                if ($scope.DownloadButtonName === 'CSV') {
                    $scope.cancelDownload = false;
                    $scope.buttonClass = 'fa fa-spinner fa-spin';
                }
                else {
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                }
                var duration = moment($scope.obj.todate, 'YYYY-MM-DD').diff(moment($scope.obj.fromdate, 'YYYY-MM-DD'), 'days');

                if (duration <= applicationConfig.repMaxDateRangeHourlyBand) {

                    $scope.DownloadButtonName = 'PROCESSING...';

                    var momentTz = moment.parseZone(new Date()).format('Z');
                    //momentTz = momentTz.replace("+", "%2B");

                    var skillString = attribArray.join(',');

                    cdrApiHandler.getCallSummaryForQueueHrDownload($scope.obj.fromdate, $scope.obj.todate, $scope.obj.fromhour, $scope.obj.tohour, skillString, momentTz, 'csv', ShareData.BusinessUnit).then(function (sumResp) {
                        if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result) {
                            var downloadFilename = sumResp.Result;

                            checkFileReady(downloadFilename);

                        }
                        else {
                            $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                            $scope.fileDownloadState = 'RESET';
                            $scope.DownloadButtonName = 'CSV';
                        }


                    }, function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                    });
            }
                else {
                    $scope.showAlert('Hourly Band Report', 'error', 'Maximum date range of ' + applicationConfig.repMaxDateRangeHourlyBand + ' days exceeded');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.buttonClass = 'fa fa-file-text';
                    $scope.cancelDownload = true;
                }


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
            }

        };


    };
    app.controller("hourlyBandReportCtrl", hourlyBandReportCtrl);

}());


