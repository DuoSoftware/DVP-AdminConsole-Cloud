/**
 * Created by Damith on 5/29/2016.
 */

mainApp.controller('dashboardCtrl1_1', function ($scope, $state, $timeout,
                                                 loginService, $filter,
                                                 dashboardService, moment, userImageList, $interval, queueMonitorService) {


    //#services call handler
    $scope.total = {
        callsInb: 0,
        callsOutb: 0,
        queued: 0,
        queueAnswered: 0,
        queueDropped: 0,
        waiting: 0,
        briged: 0,
        onGoingInb: 0,
        onGoingOutb: 0
    };

    //#profile object
    $scope.AvailableTask = [];
    $scope.ResourceTask = {CALL: [], CHAT: [], SMS: [], SOCIAL: [], TICKET: [], OFFLINE: []};
    $scope.profile = [];


    $scope.LoadCompanyTasks = function () {
        dashboardService.getCompanyTasks().then(function (response) {
            if (response.IsSuccess) {
                if (response.Result && response.Result.length > 0) {
                    for (var i = 0; i < response.Result.length; i++) {
                        var TaskType = response.Result[i].ResTaskInfo.TaskType;
                        $scope.AvailableTask.push(TaskType);
                    }
                }
            }
            else {
                $scope.AvailableTask = ["CALL", "CHAT", "SMS", "SOCIAL", "TICKET"];
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.AvailableTask = ["CALL", "CHAT", "SMS", "SOCIAL", "TICKET"];
        });
    };
    $scope.LoadCompanyTasks();

    $scope.chartymax = {
        calls: 1,
        briged: 1,
        queued: 1,
        channels: 1

    };


    var ServerHandler = (function () {
        $scope.data = [];
        $scope.dataSetAll = [{
            data: [],
            lines: {
                fill: true,
                lineWidth: 2
            }
        }];
        $scope.dataSetQueued = [{
            data: [],
            lines: {
                fill: false,
                tension: 0.5,
                lineWidth: 2
            }
        }];
        $scope.dataSetBriged = [{
            data: [], lines: {
                fill: false,
                lineWidth: 2
            }
        }];
        $scope.dataSetChannels = [{
            data: [], lines: {
                fill: false,
                lineWidth: 2
            }
        }];
        return {
            getDataAll: function () {
                dashboardService.GetAll().then(function (response) {
                    if (response && response.length > 0) {
                        response.pop();
                        var max = 0;
                        $scope.dataSetAll[0].data = response.map(function (c, index) {
                            var item = [];
                            item[0] = c[1];
                            item[1] = c[0];


                            if (c[0] > max) {

                                max = c[0];
                            }

                            return item;
                        });

                        if (max == 0) {
                            max = 1;
                        }

                        if ($scope.chartymax.calls != Math.ceil(max)) {

                            $scope.chartymax.calls = Math.ceil(max);
                            $scope.myChartOptions.yaxis.max = $scope.chartymax.calls;
                        }
                    }
                });
            }, getAllQueued: function () {
                dashboardService.GetAllQueued().then(function (response) {
                    if (response && response.length > 0) {
                        response.pop();
                        var max = 0;
                        $scope.dataSetQueued[0].data = response.map(function (c, index) {
                            var item = [];
                            item[0] = c[1];
                            item[1] = c[0];
                            if (c[0] > max) {

                                max = c[0];
                            }


                            return item;
                        });


                        if (max == 0) {
                            max = 1;
                        }

                        if ($scope.chartymax.queued != Math.ceil(max)) {

                            $scope.chartymax.queued = Math.ceil(max);
                            $scope.myChartOptions2.yaxis.max = $scope.chartymax.queued;
                        }
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            }, getAllBriged: function () {
                dashboardService.GetAllBriged().then(function (response) {
                    if (response && response.length > 0) {
                        response.pop();

                        var max = 0;
                        $scope.dataSetBriged[0].data = response.map(function (c, index) {
                            var item = [];
                            item[0] = c[1];
                            item[1] = c[0];

                            if (c[0] > max) {

                                max = c[0];
                            }

                            return item;
                        });


                        if (max == 0) {
                            max = 1;
                        }

                        if ($scope.chartymax.briged != Math.ceil(max)) {

                            $scope.chartymax.briged = Math.ceil(max);
                            $scope.myChartOptions3.yaxis.max = $scope.chartymax.briged;
                        }
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            }, getAllChannels: function () {
                /*dashboardService.GetAllChannels().then(function (response) {
                 if(response && response.length >0) {
                 response.pop();
                 var max = 0;
                 $scope.dataSetChannels[0].data = response.map(function (c, index) {
                 var item = [];
                 item[0] = c[1];
                 item[1] = c[0];

                 if (c[0] > max) {
                 max = c[0];
                 }
                 return item;
                 });

                 if (max == 0) {
                 max = 1;
                 }

                 if ($scope.chartymax.channels != Math.ceil(max)) {
                 $scope.chartymax.channels = Math.ceil(max);
                 $scope.myChartOptions4.yaxis.max = $scope.chartymax.channels;
                 }
                 }
                 });*/
            },
            getTotalQueueHit: function () {
                dashboardService.GetTotalQueueHit().then(function (response) {
                    if (response && response.length > 0) {
                        response.pop();
                        var max = 0;
                        $scope.dataSetChannels[0].data = response.map(function (c, index) {
                            var item = [];
                            item[0] = c[1];
                            item[1] = c[0];

                            if (c[0] > max) {
                                max = c[0];
                            }
                            return item;
                        });

                        if (max == 0) {
                            max = 1;
                        }

                        if ($scope.chartymax.channels != Math.ceil(max)) {
                            $scope.chartymax.channels = Math.ceil(max);
                            $scope.myChartOptions4.yaxis.max = $scope.chartymax.channels;
                        }
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            getTotalCall: function () {
                dashboardService.GetTotalCalls('inbound', null).then(function (responseInb) {

                    if (responseInb && responseInb > 0) {
                        $scope.total.callsInb = responseInb;
                    }
                    else {
                        $scope.total.callsInb = 0;
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                });

                dashboardService.GetTotalCalls('outbound', null).then(function (responseOutb) {

                    if (responseOutb && responseOutb > 0) {
                        $scope.total.callsOutb = responseOutb;
                    }
                    else {
                        $scope.total.callsOutb = 0;
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            getTotalQueued: function () {
                dashboardService.GetTotalQueued().then(function (response) {
                    $scope.total.queued = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            getTotalQueueAnswered: function () {
                dashboardService.GetTotalQueueAnswered().then(function (response) {
                    $scope.total.queueAnswered = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            getCurrentWaiting: function () {
                dashboardService.GetCurrentWaiting().then(function (response) {
                    $scope.total.waiting = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            getTotalQueueDropped: function () {
                dashboardService.GetTotalQueueDropped().then(function (response) {
                    $scope.total.queueDropped = response;
                });
            },
            getTotalBriged: function () {
                dashboardService.GetTotalBriged().then(function (response) {
                    $scope.total.briged = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            getTotalOnGoing: function () {
                dashboardService.GetTotalOnGoing('inbound').then(function (response) {
                    $scope.total.onGoingInb = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });

                dashboardService.GetTotalOnGoing('outbound').then(function (response) {
                    $scope.total.onGoingOutb = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            getProfileDetails: function () {
                dashboardService.GetProfileDetails().then(function (response) {
                    //$scope.profile = [];
                    $scope.ResourceTask = {CALL: [], CHAT: [], SMS: [], SOCIAL: [], TICKET: [], OFFLINE: []};
                    if (response.length > 0) {
                        for (var i = 0; i < response.length; i++) {


                            var profile = {
                                name: '',
                                avatar: '',
                                slotInfo: []
                            };
                            profile.name = response[i].ResourceName;

                            //get current user profile image
                            userImageList.getAvatarByUserName(profile.name, function (res) {
                                profile.avatar = res;
                            });

                            if (response[i].Status.Reason && response[i].Status.State) {
                                resonseAvailability = response[i].Status.State;
                                resonseStatus = response[i].Status.Reason;
                                resourceMode = response[i].Status.Mode;
                            }


                            if (response[i].ConcurrencyInfo && response[i].ConcurrencyInfo.length > 0) {

                                for (var j = 0; j < response[i].ConcurrencyInfo.length; j++) {
                                    var resourceTask = response[i].ConcurrencyInfo[j].HandlingType;


                                    if (response[i].ConcurrencyInfo[j].SlotInfo.length > 0) {
                                        for (var k = 0; k < response[i].ConcurrencyInfo[j].SlotInfo.length; k++) {
                                            var resonseStatus = null, resonseAvailability = null;

                                            if (response[i].ConcurrencyInfo[j].IsRejectCountExceeded) {
                                                resonseAvailability = "NotAvailable";
                                                resonseStatus = "Suspended";
                                            }


                                            var reservedDate ="";
                                            if(response[i].ConcurrencyInfo[j].SlotInfo[k]) {
                                                reservedDate = response[i].ConcurrencyInfo[j].SlotInfo[k].StateChangeTime;
                                            }
                                            var slotInfo = {
                                                slotState: null,
                                                LastReservedTime: 0,
                                                other: null,
                                                slotMode: resourceMode
                                            };

                                            if (resonseAvailability == "NotAvailable" && (resonseStatus == "Reject Count Exceeded" || resonseStatus == "Suspended")) {
                                                slotInfo.slotState = resonseStatus;
                                                slotInfo.other = "Reject";
                                            } else if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {
                                                slotInfo.slotState = resonseStatus;
                                                slotInfo.other = "Break";
                                                reservedDate = response[i].Status.StateChangeTime;
                                            } else {
                                                if(response[i].ConcurrencyInfo[j].SlotInfo[k]) {
                                                    slotInfo.slotState = response[i].ConcurrencyInfo[j].SlotInfo[k].State;


                                                    if (response[i].ConcurrencyInfo[j].SlotInfo[k].State == "Available") {

                                                        var slotStateTime = moment(reservedDate);
                                                        var resourceStateTime = moment(response[i].Status.StateChangeTime);
                                                        if (slotStateTime.isBefore(resourceStateTime)) {
                                                            reservedDate = response[i].Status.StateChangeTime;
                                                        }
                                                    }
                                                }
                                            }


                                            if (reservedDate == "") {
                                                slotInfo.LastReservedTime = null;
                                                //slotInfo.unixTime = 0;
                                            } else {
                                                slotInfo.LastReservedTime = moment(reservedDate).format("h:mm a");
                                                //slotInfo.unixTime = moment(reservedDate).unix();
                                            }

                                            profile.slotInfo.push(slotInfo);
                                            $scope.ResourceTask[resourceTask].push(profile);
                                            //$scope.profile.push(profile);
                                        }
                                    }
                                }

                                // is user state Reason

                            } else {

                                reservedDate = response[i].Status.StateChangeTime;
                                var slotInfoOffline = {
                                    slotState: "Other",
                                    LastReservedTime: moment(reservedDate).format("h:mm a"),
                                    other: "Offline",
                                    slotMode: resourceMode
                                };

                                if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {


                                    slotInfoOffline.slotState = resonseStatus;
                                    slotInfoOffline.other = "Break";

                                }

                                profile.slotInfo.push(slotInfoOffline);
                                $scope.ResourceTask['OFFLINE'].push(profile);
                            }
                        }
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            callAllServices: function () {
                ServerHandler.getDataAll();
                ServerHandler.getAllQueued();
                ServerHandler.getAllBriged();
                ServerHandler.getTotalQueueHit();//ServerHandler.getAllChannels();

            },
            getAllNumTotal: function () {
                ServerHandler.getTotalCall();
                ServerHandler.getTotalQueueAnswered();
                ServerHandler.getTotalQueued();
                ServerHandler.getTotalQueueDropped();
            },
            updateRelaTimeFuntion: function () {
                ServerHandler.getTotalOnGoing();
                ServerHandler.getCurrentWaiting();
            },
            getProfiles: function () {
                //ServerHandler.getProfileDetails();
            }
        }
    })();
    ServerHandler.callAllServices();
    ServerHandler.getAllNumTotal();
    ServerHandler.updateRelaTimeFuntion();
    //ServerHandler.getProfiles();


    //loop request
    // var t = $interval(function updateRandom() {
    //     ServerHandler.callAllServices();
    // }, 30000);
    // var tt = $interval(function updateRandom() {
    //     ServerHandler.getAllNumTotal();
    // }, 60000);
    // var t = $interval(function updateRandom() {
    //     ServerHandler.updateRelaTimeFuntion();
    //     // ServerHandler.getProfiles();
    // }, 1000);


    var countAllCallServices = function () {
        ServerHandler.callAllServices();
        countAllCallServicesTimer = $timeout(countAllCallServices, 30000);
    };

    var getAllNumTotal = function () {
        ServerHandler.getAllNumTotal();
        getAllNumTotalTimer = $timeout(getAllNumTotal, 60000);
        GetD1AllQueueStatistics();
    };

    var getAllRealTime = function () {
        ServerHandler.updateRelaTimeFuntion();
        $scope.getProfileDetails();
        //GetD1AllQueueStatistics();
        getAllRealTimeTimer = $timeout(getAllRealTime, 1000);
    };


    ServerHandler.callAllServices();
    ServerHandler.getAllNumTotal();
    ServerHandler.updateRelaTimeFuntion();


    var countAllCallServicesTimer = $timeout(countAllCallServices, 2000);
    var getAllNumTotalTimer = $timeout(getAllNumTotal, 2000);
    var getAllRealTimeTimer = $timeout(getAllRealTime, 1000);


    $scope.$on("$destroy", function () {
        if (countAllCallServicesTimer) {
            $timeout.cancel(countAllCallServicesTimer);
        }

        if (getAllNumTotalTimer) {
            $timeout.cancel(getAllNumTotalTimer);
        }


        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }


    });


    $scope.myChartOptions = {
        grid: {
            show: true,
            hoverable: true,
            clickable: true,
            borderColor: '#F7F7F7',
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 1,
                left: 1
            }
        },
        points: {
            show: true,
            radius: 3,
            fillColor: "#2BC9E2"
        },
        series: {
            shadowSize: 0, color: "#2BC9E2",
            lines: {show: true},
            points: {show: true},
            curvedLines: {active: true}
        },
        color: {color: '#2BC9E2'},
        legend: {
            container: '#legend',
            show: true,
            backgroundColor: "#2BC9E2",
            backgroundOpacity: '0.5'
        },
        yaxis: {
            min: 0,
            max: $scope.chartymax.calls,
            tickColor: "#eceaea"
        },
        xaxis: {
            tickFormatter: function (val, axis) {
                return moment.unix(val).minute() + ":" + moment.unix(val).second();
            },
            tickLength: 0
        }
    };


    $scope.myChartOptions2 = {
        grid: {
            borderWidth: 1,
            borderColor: '#fff',
            show: true
        },
        series: {shadowSize: 0, color: "#63a5a2"},
        color: {color: '#63a5a2'},
        legend: {
            container: '#legend',
            show: true
        },
        yaxis: {
            min: 0,
            max: $scope.chartymax.queued,
        }, xaxis: {
            tickFormatter: function (val, axis) {
                return moment.unix(val).minute() + ":" + moment.unix(val).second();
            }
        },
    };

    $scope.myChartOptions3 = {
        grid: {
            borderColor: '#fff',
            show: true
        },
        series: {shadowSize: 0, color: "#114858"},
        color: {color: '#63a5a2'},
        legend: {
            container: '#legend',
            show: true
        },
        yaxis: {
            min: 0,
            max: $scope.chartymax.briged
        }, xaxis: {
            tickFormatter: function (val, axis) {
                return moment.unix(val).minute() + ":" + moment.unix(val).second();
            }
        }
    };

    $scope.myChartOptions4 = {
        grid: {
            borderColor: '#fff',
            show: true
        },
        series: {shadowSize: 0, color: "#f8b01d"},
        color: {color: '#63a5a2'},
        legend: {
            container: '#legend',
            show: true
        },
        yaxis: {
            min: 0,
            max: $scope.chartymax.channels

        }, xaxis: {
            tickFormatter: function (val, axis) {
                return moment.unix(val).minute() + ":" + moment.unix(val).second();
            }
        }
    };
    //chart js

    //update code damith
    //QUEUED
    $scope.queues = [];
    $scope.val = "0";

    $scope.presentage = 50;
    $scope.pieoption = {
        animate: {
            duration: 1000,
            enabled: true
        },
        barColor: '#2B82BE',
        scaleColor: false,
        lineWidth: 5,
        lineCap: 'circle',
        size: 55
    };

    var checkQueueAvailability = function (itemID) {
        var value = $filter('filter')($scope.queues, {id: itemID})[0];
        if (value) {
            return false;
        }
        else {
            return true;
        }
    };


    //get all queued
    var GetD1AllQueueStatistics = function () {
        queueMonitorService.GetAllQueueStats().then(function (response) {
            var updatedQueues = [];
            updatedQueues = response.map(function (c, index) {
                var item = c.QueueInfo;
                item.id = c.QueueId;
                item.queuename = c.QueueName;
                item.AverageWaitTime = Math.round(item.AverageWaitTime * 100) / 100;

                if (c.QueueInfo.TotalQueued > 0) {
                    item.presentage = Math.round((c.QueueInfo.TotalAnswered / c.QueueInfo.TotalQueued) * 100);
                }

                if (checkQueueAvailability(item.id)) {
                    $scope.queues.push(item);
                }
                return item;
            });
            if (response.length == updatedQueues.length) {
                //$scope.queues=$scope.updatedQueues;
                angular.forEach($scope.queues, function (item) {
                    var value = $filter('filter')(updatedQueues, {id: item.id})[0];
                    if (!value) {
                        $scope.queues.splice($scope.queues.indexOf(item), 1);
                    }
                });
            }
        });
    };
    GetD1AllQueueStatistics();

    /********** AGENT SUMMARY DETAILS ***************/
    // var getAllRealTime = function () {
    //     $scope.getProfileDetails();
    //     GetD1AllQueueStatistics();
    //     getAllRealTimeTimerQueue = $timeout(getAllRealTime, $scope.refreshTime);
    // };
    //
    // var getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);

    // $scope.$on("$destroy", function () {
    //     if (getAllRealTimeTimer) {
    //         $timeout.cancel(getAllRealTimeTimer);
    //     }
    //});
    $scope.refreshTime = 1000;





    $scope.ReservedProfile = [];
    $scope.AvailableProfile = [];
    $scope.ConnectedProfile = [];
    $scope.AfterWorkProfile = [];
    $scope.OutboundProfile = [];
    $scope.SuspendedProfile = [];
    $scope.BreakProfile = [];
    $scope.profile = [];
    $scope.getProfileDetails = function () {
        dashboardService.GetProfileDetails().then(function (response) {
            $scope.ReservedProfile = [];
            $scope.AvailableProfile = [];
            $scope.ConnectedProfile = [];
            $scope.AfterWorkProfile = [];
            $scope.OutboundProfile = [];
            $scope.SuspendedProfile = [];
            $scope.BreakProfile = [];
            $scope.profile = [];
            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    var profile = {
                        name: '',
                        slotState: null,
                        slotMode: null,
                        LastReservedTime: 0,
                        LastReservedTimeT: 0,
                        other: null
                    };

                    profile.name = response[i].ResourceName;
                    //get current user profile image
                    userImageList.getAvatarByUserName(profile.name, function (res) {
                        profile.avatar = res;
                    });










                    if (response[i].ConcurrencyInfo && response[i].ConcurrencyInfo.length > 0) {

                        response[i].ConcurrencyInfo.forEach(function (concurrency) {
                            if(concurrency && concurrency.HandlingType === 'CALL' && concurrency.SlotInfo && concurrency.SlotInfo.length >0){

                                // is user state Reason
                                var resonseStatus = null, resonseAvailability = null, resourceMode = null;
                                if (response[i].Status.Reason && response[i].Status.State) {
                                    resonseAvailability = response[i].Status.State;
                                    resonseStatus = response[i].Status.Reason;
                                    resourceMode = response[i].Status.Mode;
                                }


                                if (concurrency.IsRejectCountExceeded) {
                                    resonseAvailability = "NotAvailable";
                                    resonseStatus = "Suspended";
                                }

                                profile.slotMode = resourceMode;

                                var reservedDate ="";
                                if(concurrency.SlotInfo[0]) {

                                    reservedDate = concurrency.SlotInfo[0].StateChangeTime;
                                }


                                if (resonseAvailability == "NotAvailable" && (resonseStatus == "Reject Count Exceeded" || resonseStatus == "Suspended")) {
                                    profile.slotState = resonseStatus;
                                    profile.other = "Reject";
                                } else if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {
                                    profile.slotState = resonseStatus;
                                    profile.other = "Break";
                                    reservedDate = response[i].Status.StateChangeTime;
                                } else {

                                    if (concurrency.SlotInfo[0]) {
                                        profile.slotState = concurrency.SlotInfo[0].State;
                                    }

                                    /*if (response[i].ConcurrencyInfo[0].SlotInfo[0].State == "Available") {

                                     reservedDate = response[i].Status.StateChangeTime;
                                     }*/
                                }

                                profile.LastReservedTimeT = reservedDate;
                                if (reservedDate == "") {
                                    profile.LastReservedTime = null;
                                } else {
                                    profile.LastReservedTime = moment(reservedDate).format("h:mm a");
                                }




                            }
                        });


                        // else if (profile.slotState == 'Break' ||profile.slotState == 'MeetingBreak' ||
                        //         profile.slotState == 'MealBreak' || profile.slotState == 'TrainingBreak' ||
                        //         profile.slotState == 'TeaBreak' || profile.slotState == 'OfficialBreak' ||
                        //         profile.slotState == 'AUXBreak' ||
                        //         profile.slotState == 'ProcessRelatedBreak') {
                        //         $scope.BreakProfile.push(profile);
                        //     }

                    }else{
                        resourceMode = response[i].Status.Mode;
                        resonseAvailability = response[i].Status.State;
                        resonseStatus = response[i].Status.Reason;
                        profile.slotState = "Other";
                        profile.slotMode = resourceMode;
                        profile.other = "Offline";
                        reservedDate = response[i].Status.StateChangeTime;
                        profile.LastReservedTimeT = reservedDate;

                        if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {
                            profile.slotState = resonseStatus;
                            profile.other = "Break";
                        }
                    }


                    if (profile.slotState == 'Reserved') {
                        $scope.ReservedProfile.push(profile);
                    }
                    else if (profile.other == 'Break') {
                        $scope.BreakProfile.push(profile);
                    }
                    else if (profile.slotState == 'Connected') {
                        $scope.ConnectedProfile.push(profile);
                    } else if (profile.slotState == 'AfterWork') {
                        $scope.AfterWorkProfile.push(profile);
                    } else if (profile.slotMode == 'Outbound' && profile.other == null) {
                        $scope.OutboundProfile.push(profile);
                    } else if (profile.slotState == 'Suspended') {
                        $scope.SuspendedProfile.push(profile);
                    } else if (profile.slotState == 'Available') {
                        $scope.AvailableProfile.push(profile);
                    } else {
                        $scope.profile.push(profile);
                        //$scope.BreakProfile.push(profile);
                    }
                }
            }
        });
    };
    $scope.getProfileDetails();
    $scope.agentCurrentState = 'available';

    var owl = $('.owl-carousel');
    owl.on('changed.owl.carousel', function (e) {

        //var elementAttr = this.$element.attr('data');
        // console.log(elementAttr);
        var current = e.item;

        //console.log(e.item.index);
        //  console.log(e);
        if (current.index == 11) {
            $scope.agentCurrentState = 'other';
        }
        else if (current.index == 3) {
            $scope.agentCurrentState = 'other';
        }
        else if (current.index == 4) {
            $scope.agentCurrentState = 'available';
        }
        else if (current.index == 5) {
            $scope.agentCurrentState = 'connected';
        }
        else if (current.index == 6) {
            $scope.agentCurrentState = 'afterwork';
        }
        else if (current.index == 7) {
            $scope.agentCurrentState = 'reserved';
        }
        else if (current.index == 8) {
            $scope.agentCurrentState = 'break';

        }
        else if (current.index == 9) {
            $scope.agentCurrentState = 'outbound';
        }
        else if (current.index == 10) {
            $scope.agentCurrentState = 'suspended';
        }

    });
});


mainApp.directive('d1queued', function (queueMonitorService, $timeout, loginService) {
    return {

        restrict: 'EA',
        scope: {
            name: "@",
            queueoption: "=",
            pieoption: "=",
            viewmode: "="
        },
        templateUrl: 'template/dashboard/d1-queued-temp.html',
        link: function (scope, element, attributes) {


            //console.log(scope.queueoption)
            // console.log(scope.pieoption)
            // scope.skillList=scope.name.match(/attribute_[0-9]*/g);
            scope.tempSkills = scope.name.match(/attribute_([^\-]+)/g);

            scope.skillList = scope.tempSkills.map(function (item) {
                return item.split('_')[1].toString();
            });

            scope.que = {};
            scope.options = {};
            scope.que.CurrentWaiting = 0;
            scope.que.CurrentMaxWaitTime = 0;
            scope.que.presentage = 0;
            scope.maxy = 10;
            scope.val = "0";

            console.log(scope.que);

            scope.dataSet = [{
                data: [],
                lines: {
                    fill: true,
                    lineWidth: 2
                }
            }];


            scope.queueoption = {
                grid: {
                    borderColor: '#f8f6f6',
                    show: true
                },
                series: {shadowSize: 0, color: "#f8b01d"},
                color: {color: '#63a5a2'},
                legend: {
                    container: '#legend',
                    show: true
                },
                yaxis: {
                    min: 0,
                    max: scope.maxy
                },
                xaxis: {
                    tickFormatter: function (val, axis) {
                        return moment.unix(val).minute() + ":" + moment.unix(val).second();
                    }
                }
            };


            var qData = function () {

                queueMonitorService.GetSingleQueueStats(scope.name).then(function (response) {
                    scope.que = response.QueueInfo;
                    scope.que.id = response.QueueId;

                    scope.val = response.QueueName;
                    scope.que.AverageWaitTime = Math.round(scope.que.AverageWaitTime * 100) / 100;

                    if (scope.que.TotalQueued > 0) {
                        scope.que.presentage = Math.round((scope.que.TotalAnswered / scope.que.TotalQueued) * 100);
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            };
            var skilledResources = function () {

                var skillObj = {
                    skills: scope.skillList
                }

                queueMonitorService.getAvailableResourcesToSkill(skillObj).then(function (response) {
                    scope.agentCount = response.length;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            };


            var qStats = function () {

                //GetSingleQueueStats
                queueMonitorService.GetSingleQueueGraph(scope.name).then(function (response) {
                    response.pop();
                    var max = 0;
                    scope.dataSet[0].data = response.map(function (c, index) {
                        var item = [];
                        item[0] = c[1];
                        item[1] = c[0];


                        if (c[0] > max) {

                            max = c[0];
                        }

                        return item;
                    });

                    if (max == 0) {
                        max = 1;
                    }

                    if (scope.maxy != Math.ceil(max)) {

                        scope.maxy = Math.ceil(max);
                        scope.queueoption.yaxis.max = scope.maxy + 1;
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });

            }


            qData();
            qStats();
            skilledResources();


            var updateRealtime = function () {

                qData();
                qStats();
                skilledResources();

                updatetimer = $timeout(updateRealtime, 60000);

            };

            var updatetimer = $timeout(updateRealtime, 2000);

            //updateRealtime();


            scope.$on("$destroy", function () {
                if (updatetimer) {
                    $timeout.cancel(updatetimer);
                }
            });


            /*

             $interval(function updateRandom() {
             qData();
             qStats();


             }, 10000);

             */


        },


    }
});
