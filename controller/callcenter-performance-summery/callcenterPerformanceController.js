/**
 * Created by Heshan.i on 3/14/2017.
 */


(function () {

    mainApp.controller("callcenterPerformanceController", function ($scope, $q, $timeout, dashboardService, loginService, $anchorScroll, subscribeServices,ShareData) {
        $scope.isLoading = -1;
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
        $anchorScroll();
        $scope.disableCurrent = true;
        $scope.startDate = moment().format("YYYY-MM-DD");
        $scope.endDate = moment().format("YYYY-MM-DD");

        $scope.callCenterPerformance = {
            totalInbound: 0,
            totalOutbound: 0,
            totalQueued: 0,
            totalQueueAnswered: 0,
            totalQueueDropped: 0,
            totalStaffTime: 0,
            totalAcwTime: 0,
            AverageStaffTime: 0,
            AverageAcwTime: 0,
            AverageInboundCallsPerAgent: 0,
            AverageOutboundCallsPerAgent: 0,
            TotalLoginAgents: 0,
            totalTalkTimeInbound: 0,
            totalTalkTimeOutbound: 0,
            totalBreakTime: 0,
            totalHoldTime: 0,
            totalIdleTime: 0,
            AverageTalkTimeInbound: 0,
            AverageTalkTimeOutbound: 0,
            TotalInboundAgentCount: 0,
            TotalOutboundAgentCount: 0,
            TotalInboundAnswerCount: 0,
            totalStaffTimeValue: 0,
            totalAcwTimeValue: 0,
            totalTalkTimeInboundValue: 0,
            totalTalkTimeOutboundValue: 0,
            totalBreakTimeValue: 0,
            totalHoldTimeValue: 0
        };

        $scope.onDateChange = function () {
            if (moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid()) {
                $scope.dateValid = true;
            }
            else {
                $scope.dateValid = false;
            }
        };

        $scope.callCenterPerformanceChartConfig = {
            type: 'bar',

            data: {
                labels: ["Inbound", "Outbound", "Queued", "Q-answered", "Q-dropped"],
                datasets: [
                    {
                        label: "Total Count",
                        backgroundColor: [
                            'rgba(43, 201, 226, 1)',
                            'rgba(231, 133, 94, 1)',
                            'rgba(93, 121, 152, 1)',
                            'rgba(174, 231, 118, 1)',
                            'rgba(251, 206, 139, 1)',
                            'rgba(34, 52, 72, 1)'
                        ],
                        data: [0, 0, 0, 0, 0]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: true
                },
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            min: 0,
                            stepSize: 100
                        },
                        gridLines: {
                            show: true,
                            color: "#F3F3F3"
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            show: true,
                            color: "#F3F3F3"
                        }
                    }]
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: '#485465',
                        FontFamily: "Ubuntu-Regular'"
                    }
                },
                grid: {
                    borderWidth: 1,
                    borderColor: '#fff',
                    show: false
                }
            }
        };

        var callCenterPerformanceChart = document.getElementById("callCenterPerformanceCanvas").getContext("2d");
        window.callCenterPerformanceChart = new Chart(callCenterPerformanceChart, $scope.callCenterPerformanceChartConfig);

        //update bar chart >> chart.js
        // $scope.labels = ["inbound", "outbound", "queued", "Q-answered", "Q-dropped"];
        //$scope.data = $scope.callCenterPerformanceChartConfig.data.datasets[0].data;

        var TimeFormatter = function (seconds) {

            var timeStr = '0:0:0';
            if (seconds > 0) {
                var durationObj = moment.duration(seconds * 1000);

                if (durationObj) {
                    var tempHrs = 0;
                    if (durationObj._data.years > 0) {
                        tempHrs = tempHrs + durationObj._data.years * 365 * 24;
                    }
                    if (durationObj._data.months > 0) {
                        tempHrs = tempHrs + durationObj._data.months * 30 * 24;
                    }
                    if (durationObj._data.days > 0) {
                        tempHrs = tempHrs + durationObj._data.days * 24;
                    }

                    tempHrs = tempHrs + durationObj._data.hours;
                    timeStr = tempHrs + ':' + durationObj._data.minutes + ':' + durationObj._data.seconds;
                }
            }
            return timeStr;
        };


        var getTotalInboundCalls = function () {
            var deferred = $q.defer();

            dashboardService.GetTotalCalls('inbound', null).then(function (response) {

                if (response && response > 0) {
                    $scope.callCenterPerformance.totalInbound = response;
                } else {
                    $scope.callCenterPerformance.totalInbound = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });

            return deferred.promise;
        };

        var getTotalOutboundCalls = function () {
            var deferred = $q.defer();

            dashboardService.GetTotalCalls('outbound', null).then(function (response) {

                if (response && response > 0) {
                    $scope.callCenterPerformance.totalOutbound = response;
                } else {
                    $scope.callCenterPerformance.totalOutbound = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });

            return deferred.promise;
        };

        var getTotalQueued = function () {
            var deferred = $q.defer();

            dashboardService.GetTotalQueued().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalQueued = response;
                } else {
                    $scope.callCenterPerformance.totalQueued = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });

            return deferred.promise;
        };

        var getTotalQueueAnswered = function () {
            var deferred = $q.defer();

            dashboardService.GetTotalQueueAnswered().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalQueueAnswered = response;
                } else {
                    $scope.callCenterPerformance.totalQueueAnswered = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });

            return deferred.promise;
        };

        var getTotalQueueDropped = function () {
            var deferred = $q.defer();

            dashboardService.GetTotalQueueDropped().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalQueueDropped = response;
                } else {
                    $scope.callCenterPerformance.totalQueueDropped = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });

            return deferred.promise;
        };

        var getTotalTalkTimeInbound = function () {
            var deferred = $q.defer();
            dashboardService.GetTotalTalkTimeInbound().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalTalkTimeInbound = TimeFormatter(response);
                    $scope.callCenterPerformance.totalTalkTimeInboundValue = response;
                } else {
                    $scope.callCenterPerformance.totalTalkTimeInbound = TimeFormatter(0);
                    $scope.callCenterPerformance.totalTalkTimeInboundValue = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getTotalTalkTimeOutbound = function () {
            var deferred = $q.defer();
            dashboardService.GetTotalTalkTimeOutbound().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalTalkTimeOutbound = TimeFormatter(response);
                    $scope.callCenterPerformance.totalTalkTimeOutboundValue = response;
                } else {
                    $scope.callCenterPerformance.totalTalkTimeOutbound = TimeFormatter(0);
                    $scope.callCenterPerformance.totalTalkTimeOutboundValue = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getTotalBreakTime = function () {
            var deferred = $q.defer();
            dashboardService.GetTotalBreakTime().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalBreakTime = TimeFormatter(response);
                    $scope.callCenterPerformance.totalBreakTimeValue = response;
                } else {
                    $scope.callCenterPerformance.totalBreakTime = TimeFormatter(0);
                    $scope.callCenterPerformance.totalBreakTimeValue = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getTotalHoldTime = function () {
            var deferred = $q.defer();
            dashboardService.GetTotalHoldTime().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalHoldTime = TimeFormatter(response);
                    $scope.callCenterPerformance.totalHoldTimeValue = response;
                } else {
                    $scope.callCenterPerformance.totalHoldTime = TimeFormatter(0);
                    $scope.callCenterPerformance.totalHoldTimeValue = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getTotalStaffTime = function () {
            var deferred = $q.defer();
            dashboardService.GetTotalStaffTime().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalStaffTime = TimeFormatter(response);
                    $scope.callCenterPerformance.totalStaffTimeValue = response;
                } else {
                    $scope.callCenterPerformance.totalStaffTime = TimeFormatter(0);
                    $scope.callCenterPerformance.totalStaffTimeValue = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getTotalAcwTime = function () {
            var deferred = $q.defer();
            dashboardService.GetTotalAcwTime().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.totalAcwTime = TimeFormatter(response);
                    $scope.callCenterPerformance.totalAcwTimeValue = response;
                } else {
                    $scope.callCenterPerformance.totalAcwTime = TimeFormatter(0);
                    $scope.callCenterPerformance.totalAcwTimeValue = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getAverageStaffTime = function () {
            var deferred = $q.defer();
            dashboardService.GetAverageStaffTime().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.AverageStaffTime = TimeFormatter(response);
                } else {
                    $scope.callCenterPerformance.AverageStaffTime = TimeFormatter(0);
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getAverageAcwTime = function () {
            var deferred = $q.defer();
            dashboardService.GetAverageAcwTime().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.AverageAcwTime = TimeFormatter(response);
                } else {
                    $scope.callCenterPerformance.AverageAcwTime = TimeFormatter(0);
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getAverageInboundCallsPerAgent = function () {
            var deferred = $q.defer();
            dashboardService.GetAverageInboundCallsPerAgent().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.AverageInboundCallsPerAgent = response.toFixed(2);
                } else {
                    $scope.callCenterPerformance.AverageInboundCallsPerAgent = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getAverageOutboundCallsPerAgent = function () {
            var deferred = $q.defer();
            dashboardService.GetAverageOutboundCallsPerAgent().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.AverageOutboundCallsPerAgent = response.toFixed(2);
                } else {
                    $scope.callCenterPerformance.AverageOutboundCallsPerAgent = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        var getTotalLoginAgentCount = function () {
            var deferred = $q.defer();
            dashboardService.GetTotalLoginAgentCount().then(function (response) {
                if (response && response > 0) {
                    $scope.callCenterPerformance.TotalLoginAgents = response;
                } else {
                    $scope.callCenterPerformance.TotalLoginAgents = 0;
                }
                deferred.resolve('done');
            }, function (err) {
                loginService.isCheckResponse(err);
                deferred.resolve('done');
            });
            return deferred.promise;
        };

        //$scope.getCallCenterPerformanceHistory = function () {
        //    if (getCountTimer) {
        //        $timeout.cancel(getCountTimer);
        //    }
        //
        //    if (getTimesTimer) {
        //        $timeout.cancel(getTimesTimer);
        //    }
        //
        //    dashboardService.GetCallCenterPerformanceHistory($scope.startDate, $scope.endDate).then(function (response) {
        //        if (response) {
        //            $scope.safeApply(function() {
        //                $scope.disableCurrent = false;
        //                $scope.callCenterPerformance = {
        //                    totalInbound: response.totalInbound,
        //                    totalOutbound: response.totalOutbound,
        //                    totalQueued: response.totalQueued,
        //                    totalQueueAnswered: response.totalQueueAnswered,
        //                    totalQueueDropped: response.totalQueueDropped,
        //                    totalTalkTime: TimeFormatter(response.totalTalkTime),
        //                    totalStaffTime: TimeFormatter(response.totalStaffTime),
        //                    totalAcwTime: TimeFormatter(response.totalAcwTime),
        //                    AverageStaffTime: TimeFormatter(response.AverageStaffTime),
        //                    AverageAcwTime: TimeFormatter(response.AverageAcwTime),
        //                    AverageInboundCallsPerAgent: response.AverageInboundCallsPerAgent.toFixed(2),
        //                    AverageOutboundCallsPerAgent: response.AverageOutboundCallsPerAgent.toFixed(2),
        //                    TotalLoginAgents: response.TotalStaffCount
        //                };
        //
        //                $scope.callCenterPerformanceChartConfig.data.datasets[0].data = [
        //                    $scope.callCenterPerformance.totalInbound,
        //                    $scope.callCenterPerformance.totalOutbound,
        //                    $scope.callCenterPerformance.totalQueued,
        //                    $scope.callCenterPerformance.totalQueueAnswered,
        //                    $scope.callCenterPerformance.totalQueueDropped
        //                ];
        //                window.callCenterPerformanceChart.update();
        //            });
        //
        //        }
        //    }, function (err) {
        //        loginService.isCheckResponse(err);
        //    });
        //};


        var getCounts = function () {

            $scope.isLoading = 0;
            $q.all([
                getTotalInboundCalls(),
                getTotalOutboundCalls(),
                getTotalQueued(),
                getTotalQueueAnswered(),
                getTotalQueueDropped(),
                getAverageInboundCallsPerAgent(),
                getAverageOutboundCallsPerAgent(),
                getTotalLoginAgentCount()
            ]).then(function (response) {
                $scope.callCenterPerformanceChartConfig.data.datasets[0].data = [
                    $scope.callCenterPerformance.totalInbound,
                    $scope.callCenterPerformance.totalOutbound,
                    $scope.callCenterPerformance.totalQueued,
                    $scope.callCenterPerformance.totalQueueAnswered,
                    $scope.callCenterPerformance.totalQueueDropped
                ];
                window.callCenterPerformanceChart.update();
                $scope.isLoading++
            });

            //getCountTimer = $timeout(getCounts, 60000);
        };

        var getTimes = function () {
            $q.all([
                getTotalInboundCalls(),
                getTotalOutboundCalls(),
                getTotalTalkTimeInbound(),
                getTotalTalkTimeOutbound(),
                getTotalStaffTime(),
                getTotalAcwTime(),
                getAverageStaffTime(),
                getAverageAcwTime(),
                getTotalBreakTime(),
                getTotalHoldTime()
            ]).then(function (response) {
                var averageTalkTimeInbound = $scope.callCenterPerformance.totalInbound ? ($scope.callCenterPerformance.totalTalkTimeInboundValue / $scope.callCenterPerformance.totalInbound).toFixed(2) : 0;
                var averageTalkTimeOutbound = $scope.callCenterPerformance.totalOutbound ? ($scope.callCenterPerformance.totalTalkTimeOutboundValue / $scope.callCenterPerformance.totalOutbound).toFixed(2) : 0;

                $scope.callCenterPerformance.totalIdleTime = TimeFormatter($scope.callCenterPerformance.totalStaffTimeValue - ($scope.callCenterPerformance.totalTalkTimeOutboundValue + $scope.callCenterPerformance.totalTalkTimeInboundValue + $scope.callCenterPerformance.totalBreakTimeValue + $scope.callCenterPerformance.totalHoldTimeValue + $scope.callCenterPerformance.totalAcwTimeValue));
                $scope.callCenterPerformance.AverageTalkTimeInbound = TimeFormatter(averageTalkTimeInbound);
                $scope.callCenterPerformance.AverageTalkTimeOutbound = TimeFormatter(averageTalkTimeOutbound);
                $scope.isLoading++
            });

            //getTimesTimer = $timeout(getTimes, 30000);
        };

        var getStaffTime = function () {
            getTotalStaffTime().then(function (response) {
                $scope.safeApply(function () {
                    $scope.callCenterPerformance.totalIdleTime = TimeFormatter($scope.callCenterPerformance.totalStaffTimeValue - ($scope.callCenterPerformance.totalTalkTimeOutboundValue + $scope.callCenterPerformance.totalTalkTimeInboundValue + $scope.callCenterPerformance.totalBreakTimeValue + $scope.callCenterPerformance.totalHoldTimeValue + $scope.callCenterPerformance.totalAcwTimeValue));
                });
            });

            getTimesTimer = $timeout(getStaffTime, 300000);
        };

        getCounts();
        getTimes();
        //var getCountTimer = $timeout(getCounts, 1000);
        var getTimesTimer = $timeout(getStaffTime, 1000);

        $scope.loadCurrentCounts = function () {
            $scope.disableCurrent = true;
            //var getCountTimer = $timeout(getCounts, 1000);
            //var getTimesTimer = $timeout(getTimes, 1000);
        };


        $scope.$on("$destroy", function () {
            //if (getCountTimer) {
            //    $timeout.cancel(getCountTimer);
            //}
            //
            if (getTimesTimer) {
                $timeout.cancel(getTimesTimer);
            }

            subscribeServices.unSubscribeDashboard('ccperformance');
        });


        subscribeServices.subscribeDashboard('ccperformance',function (event) {
            if (event && event.Message && event.Message.businessUnit
                && ((ShareData.BusinessUnit.toLowerCase() === 'all' && event.Message.businessUnit.toLowerCase() === '*') || (ShareData.BusinessUnit.toLowerCase() === 'all' && event.From === "ArdsMonitoringService") || (event.Message.businessUnit.toLowerCase() === ShareData.BusinessUnit.toLowerCase()))) {

                switch (event.roomName) {
                    case 'CALLS:TotalCount':
                        if (event.Message) {
                            if (event.Message.window === 'CALLS' && event.Message.param1 === 'inbound') {
                                $scope.callCenterPerformance.totalInbound = event.Message.TotalCountParam1;
                                $scope.callCenterPerformanceChartConfig.data.datasets[0].data[0] = $scope.callCenterPerformance.totalInbound;
                                $scope.callCenterPerformance.AverageTalkTimeInbound = TimeFormatter($scope.callCenterPerformance.totalInbound ? ($scope.callCenterPerformance.totalTalkTimeInboundValue / $scope.callCenterPerformance.totalInbound).toFixed(2) : 0);
                            } else if (event.Message.window === 'CALLS' && event.Message.param1 === 'outbound') {
                                $scope.callCenterPerformance.totalOutbound = event.Message.TotalCountParam1;
                                $scope.callCenterPerformanceChartConfig.data.datasets[0].data[1] = $scope.callCenterPerformance.totalOutbound;
                                $scope.callCenterPerformance.AverageOutboundCallsPerAgent = $scope.callCenterPerformance.TotalOutboundAgentCount ? ($scope.callCenterPerformance.totalOutbound / $scope.callCenterPerformance.TotalOutboundAgentCount).toFixed(2) : 0;
                                $scope.callCenterPerformance.AverageTalkTimeOutbound = TimeFormatter($scope.callCenterPerformance.totalOutbound ? ($scope.callCenterPerformance.totalTalkTimeOutboundValue / $scope.callCenterPerformance.totalOutbound).toFixed(2) : 0);
                            }

                            window.callCenterPerformanceChart.update();
                        }
                        break;

                    case 'QUEUE:TotalCount':
                        if (event.Message) {
                            if (event.Message.window === 'QUEUE') {
                                $scope.callCenterPerformance.totalQueued = event.Message.TotalCountWindow;
                                $scope.callCenterPerformanceChartConfig.data.datasets[0].data[2] = $scope.callCenterPerformance.totalQueued;
                            }
                        }
                        break;

                    case 'QUEUEANSWERED:TotalCount':
                        if (event.Message) {
                            if (event.Message.window === 'QUEUEANSWERED') {
                                $scope.callCenterPerformance.totalQueueAnswered = event.Message.TotalCountWindow;
                                $scope.callCenterPerformanceChartConfig.data.datasets[0].data[3] = $scope.callCenterPerformance.totalQueueAnswered;
                            }
                        }
                        break;

                    case 'QUEUEDROPPED:TotalCount':
                        if (event.Message) {
                            if (event.Message.window === 'QUEUEDROPPED') {
                                $scope.callCenterPerformance.totalQueueDropped = event.Message.TotalCountWindow;
                                $scope.callCenterPerformanceChartConfig.data.datasets[0].data[4] = $scope.callCenterPerformance.totalQueueDropped;
                            }
                        }
                        break;

                    case 'AFTERWORK:TotalTime':
                        if (event.Message) {
                            if (event.Message.window === 'AFTERWORK') {
                                $scope.safeApply(function () {
                                    $scope.callCenterPerformance.totalAcwTime = TimeFormatter(event.Message.TotalTimeWindow);
                                    $scope.callCenterPerformance.totalAcwTimeValue = event.Message.TotalTimeWindow;
                                    $scope.callCenterPerformance.AverageAcwTime = TimeFormatter($scope.callCenterPerformance.TotalLoginAgents ? ($scope.callCenterPerformance.totalAcwTimeValue / $scope.callCenterPerformance.TotalLoginAgents).toFixed(2) : 0);
                                    $scope.callCenterPerformance.totalIdleTime = TimeFormatter($scope.callCenterPerformance.totalStaffTimeValue - ($scope.callCenterPerformance.totalTalkTimeOutboundValue + $scope.callCenterPerformance.totalTalkTimeInboundValue + $scope.callCenterPerformance.totalBreakTimeValue + $scope.callCenterPerformance.totalHoldTimeValue + $scope.callCenterPerformance.totalAcwTimeValue));
                                });
                            }
                        }
                        break;

                    case 'LOGIN:TotalTimeWithCurrentSession':
                        if (event.Message) {

                            if (event.Message.window === 'LOGIN' && event.Message.param2 === 'Register') {
                                $scope.callCenterPerformance.totalStaffTime = TimeFormatter(event.Message.TotalTimeParam2);
                                $scope.callCenterPerformance.totalStaffTimeValue = event.Message.TotalTimeParam2;
                                $scope.callCenterPerformance.AverageStaffTime = TimeFormatter($scope.callCenterPerformance.TotalLoginAgents ? ($scope.callCenterPerformance.totalStaffTimeValue / $scope.callCenterPerformance.TotalLoginAgents).toFixed(2) : 0);
                                $scope.callCenterPerformance.totalIdleTime = TimeFormatter($scope.callCenterPerformance.totalStaffTimeValue - ($scope.callCenterPerformance.totalTalkTimeOutboundValue + $scope.callCenterPerformance.totalTalkTimeInboundValue + $scope.callCenterPerformance.totalBreakTimeValue + $scope.callCenterPerformance.totalHoldTimeValue + $scope.callCenterPerformance.totalAcwTimeValue));
                            }
                        }
                        break;

                    case 'LOGIN:TotalKeyCount':
                        if (event.Message) {

                            if (event.Message.window === 'LOGIN' && event.Message.param2 === 'Register') {
                                $scope.callCenterPerformance.TotalLoginAgents = event.Message.TotalCountParam2;
                                $scope.callCenterPerformance.AverageStaffTime = TimeFormatter($scope.callCenterPerformance.TotalLoginAgents ? ($scope.callCenterPerformance.totalStaffTimeValue / $scope.callCenterPerformance.TotalLoginAgents).toFixed(2) : 0);
                                $scope.callCenterPerformance.AverageAcwTime = TimeFormatter($scope.callCenterPerformance.TotalLoginAgents ? ($scope.callCenterPerformance.totalAcwTimeValue / $scope.callCenterPerformance.TotalLoginAgents).toFixed(2) : 0);
                            }
                        }
                        break;

                    case 'CONNECTED:TotalKeyCount':
                        if (event.Message) {

                            if (event.Message.window === 'CONNECTED' && event.Message.param2 === 'CALLoutbound') {

                                $scope.callCenterPerformance.TotalOutboundAgentCount = event.Message.TotalCountParam2;
                                $scope.callCenterPerformance.AverageOutboundCallsPerAgent = $scope.callCenterPerformance.TotalOutboundAgentCount ? ($scope.callCenterPerformance.totalOutbound / $scope.callCenterPerformance.TotalOutboundAgentCount).toFixed(2) : 0;

                            } else if (event.Message.window === 'CONNECTED' && event.Message.param2 === 'CALLinbound') {

                                $scope.callCenterPerformance.TotalInboundAgentCount = event.Message.TotalCountParam2;
                                $scope.callCenterPerformance.AverageInboundCallsPerAgent = $scope.callCenterPerformance.TotalInboundAgentCount ? ($scope.callCenterPerformance.TotalInboundAnswerCount / $scope.callCenterPerformance.TotalInboundAgentCount).toFixed(2) : 0;

                            }
                        }
                        break;

                    case 'CONNECTED:TotalCount':
                        if (event.Message) {

                            if (event.Message.window === 'CONNECTED' && event.Message.param2 === 'CALLinbound') {
                                $scope.callCenterPerformance.TotalInboundAnswerCount = event.Message.TotalCountParam2;
                                $scope.callCenterPerformance.AverageInboundCallsPerAgent = $scope.callCenterPerformance.TotalInboundAgentCount ? ($scope.callCenterPerformance.TotalInboundAnswerCount / $scope.callCenterPerformance.TotalInboundAgentCount).toFixed(2) : 0;
                            }
                        }
                        break;

                    case 'CONNECTED:TotalTime':
                        if (event.Message) {
                            if (event.Message.window === 'CONNECTED' && event.Message.param2 === 'CALLinbound') {
                                $scope.callCenterPerformance.totalTalkTimeInbound = TimeFormatter(event.Message.TotalTimeParam2);
                                $scope.callCenterPerformance.totalTalkTimeInboundValue = event.Message.TotalTimeParam2;
                                $scope.callCenterPerformance.AverageTalkTimeInbound = TimeFormatter($scope.callCenterPerformance.totalInbound ? ($scope.callCenterPerformance.totalTalkTimeInboundValue / $scope.callCenterPerformance.totalInbound).toFixed(2) : 0);
                            } else if (event.Message.window === 'CONNECTED' && event.Message.param2 === 'CALLoutbound') {
                                $scope.callCenterPerformance.totalTalkTimeOutbound = TimeFormatter(event.Message.TotalTimeParam2);
                                $scope.callCenterPerformance.totalTalkTimeOutboundValue = event.Message.TotalTimeParam2;
                                $scope.callCenterPerformance.AverageTalkTimeOutbound = TimeFormatter($scope.callCenterPerformance.totalOutbound ? ($scope.callCenterPerformance.totalTalkTimeOutboundValue / $scope.callCenterPerformance.totalOutbound).toFixed(2) : 0);
                            }
                            $scope.callCenterPerformance.totalIdleTime = TimeFormatter($scope.callCenterPerformance.totalStaffTimeValue - ($scope.callCenterPerformance.totalTalkTimeOutboundValue + $scope.callCenterPerformance.totalTalkTimeInboundValue + $scope.callCenterPerformance.totalBreakTimeValue + $scope.callCenterPerformance.totalHoldTimeValue + $scope.callCenterPerformance.totalAcwTimeValue));
                        }
                        break;

                    case 'BREAK:TotalTime':
                        if (event.Message) {
                            if (event.Message.window === 'BREAK') {
                                $scope.callCenterPerformance.totalBreakTime = TimeFormatter(event.Message.TotalTimeWindow);
                                $scope.callCenterPerformance.totalBreakTimeValue = event.Message.TotalTimeWindow;
                                $scope.callCenterPerformance.totalIdleTime = TimeFormatter($scope.callCenterPerformance.totalStaffTimeValue - ($scope.callCenterPerformance.totalTalkTimeOutboundValue + $scope.callCenterPerformance.totalTalkTimeInboundValue + $scope.callCenterPerformance.totalBreakTimeValue + $scope.callCenterPerformance.totalHoldTimeValue + $scope.callCenterPerformance.totalAcwTimeValue));
                            }
                        }
                        break;

                    case 'AGENTHOLD:TotalTime':
                        if (event.Message) {
                            if (event.Message.window === 'AGENTHOLD') {
                                $scope.callCenterPerformance.totalHoldTime = TimeFormatter(event.Message.TotalTimeWindow);
                                $scope.callCenterPerformance.totalHoldTimeValue = event.Message.TotalTimeWindow;
                                $scope.callCenterPerformance.totalIdleTime = TimeFormatter($scope.callCenterPerformance.totalStaffTimeValue - ($scope.callCenterPerformance.totalTalkTimeOutboundValue + $scope.callCenterPerformance.totalTalkTimeInboundValue + $scope.callCenterPerformance.totalBreakTimeValue + $scope.callCenterPerformance.totalHoldTimeValue + $scope.callCenterPerformance.totalAcwTimeValue));
                            }
                        }
                        break;
                    default:
                        //console.log(event);
                        break;

                }
            }
            else {
                console.info("Subscribe Dashboard Event Receive For Invalid Business Unit");
            }
        });


        $scope.$watch(function () {
            return ShareData.BusinessUnit;
        }, function (newValue, oldValue) {
            if (newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()) {
                getCounts();
                getTimes();

            }
        });
    });

}());