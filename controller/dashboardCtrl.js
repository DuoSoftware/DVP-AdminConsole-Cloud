/**
 * Created by Damith on 5/29/2016.
 */

mainApp.controller('dashboardCtrl', function ($scope, $state, $timeout, $q,
                                              loginService, $filter,
                                              dashboardService, moment, userImageList, $interval, queueMonitorService, subscribeServices, ShareData) {


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

    $scope.StatusList = {
        ReservedProfile: [],
        AvailableProfile: [],
        ConnectedProfile: [],
        AfterWorkProfile: [],
        OutboundProfile: [],
        SuspendedProfile: [],
        BreakProfile: [],
        profile: []
    };

    $scope.agentCurrentState = 'inbound';

    $scope.owlCarouselAgent = $scope.StatusList.AvailableProfile;
    var setAgentCurrentState = function (index) {
        $scope.safeApply(function () {
            switch (index) {
                case 0:
                    $scope.agentCurrentState = "inbound";
                    $scope.owlCarouselAgent = $scope.StatusList.AvailableProfile;
                    break;
                case 1:
                    $scope.agentCurrentState = "reserved";
                    $scope.owlCarouselAgent = $scope.StatusList.ReservedProfile;
                    break;
                case 2:
                    $scope.agentCurrentState = "connected";
                    $scope.owlCarouselAgent = $scope.StatusList.ConnectedProfile;
                    break;
                case 3:
                    $scope.agentCurrentState = "afterwork";
                    $scope.owlCarouselAgent = $scope.StatusList.AfterWorkProfile;
                    break;

                case 4:
                    $scope.agentCurrentState = "break";
                    $scope.owlCarouselAgent = $scope.StatusList.BreakProfile;
                    break;
                case 5:
                    $scope.agentCurrentState = "outbound";
                    $scope.owlCarouselAgent = $scope.StatusList.OutboundProfile;
                    break;
                case 6:
                    $scope.agentCurrentState = "suspended";
                    $scope.owlCarouselAgent = $scope.StatusList.SuspendedProfile;
                    break;
                case 7:
                    $scope.agentCurrentState = "other";
                    $scope.owlCarouselAgent = $scope.StatusList.profile;
                    break;
                default:

            }
        });


    };

    var owl = $('.owl-carousel');
    owl.on('changed.owl.carousel', function (e) {

        //var elementAttr = this.$element.attr('data');
        // console.log(elementAttr);
        var index = e.item.index;
        setAgentCurrentState(index - 4);
    });

    var carouselAutoplay = true;
    $scope.stoppedState = false;
    $scope.currItem = -1;


    $scope.carouselAutoplay = function (itemNo) {

        carouselAutoplay = !carouselAutoplay;

        var owlCarousel = $('.owl-carousel');
        owlCarousel.trigger('to.owl.carousel', itemNo);
        owlCarousel.trigger('to.owl.carousel', itemNo);


        if (carouselAutoplay) {
            owlCarousel.trigger('play.owl.autoplay', 1000);

        } else {

            owlCarousel.trigger('stop.owl.autoplay');

        }
        $scope.stoppedState = !carouselAutoplay;
        setAgentCurrentState(itemNo);
        $scope.currItem = itemNo;


    };

    var reload_dashboard_data = function () {
        $scope.StatusList = {
            ReservedProfile: [],
            AvailableProfile: [],
            ConnectedProfile: [],
            AfterWorkProfile: [],
            OutboundProfile: [],
            SuspendedProfile: [],
            BreakProfile: [],
            profile: []
        };

        ServerHandler.callAllServices();
        ServerHandler.getAllNumTotal();
        ServerHandler.updateRelaTimeFuntion();
        GetD1AllQueueStatistics();
        $scope.getProfileDetails();
        console.log("Reload Dashboard ****************************************");
    };

    subscribeServices.SubscribeConnection('dashboard_socket', function (isConnected) {
        if (isConnected) {
            $('#dashbooad_info').removeClass('blur-filter');
            $('#dashbooad_info_error').addClass('display-none');
            reload_dashboard_data();
        } else {
            $('#dashbooad_info').addClass('blur-filter');
            $('#dashbooad_info_error').removeClass('display-none');
        }

    });

    subscribeServices.subscribeDashboard('dashboard', function (event) {
        if (event && event.Message && event.Message.businessUnit
            && ((ShareData.BusinessUnit.toLowerCase() === 'all' && event.Message.businessUnit.toLowerCase() === '*') || (ShareData.BusinessUnit.toLowerCase() === 'all' && event.From === "ArdsMonitoringService") || (event.Message.businessUnit.toLowerCase() === ShareData.BusinessUnit.toLowerCase()))) {
            switch (event.roomName) {
                case 'ARDS:ResourceStatus':
                    if (event.Message) {

                        userImageList.getAvatarByUserName(event.Message.userName, function (res) {
                            event.Message.avatar = res ? res : "assets/images/defaultProfile.png";
                        });

                        if (event.Message.task === 'CALL' || !event.Message.task) {
                            removeExistingResourceData(event.Message);
                            setResourceData(event.Message);
                        }

                    }
                    break;

                case 'ARDS:RemoveResourceTask':
                    if (event.Message) {

                        userImageList.getAvatarByUserName(event.Message.userName, function (res) {
                            event.Message.avatar = res ? res : "assets/images/defaultProfile.png";
                        });

                        if (event.Message.task && event.Message.task === 'CALL') {
                            removeExistingResourceData(event.Message);
                            setResourceData(event.Message);
                        }

                    }
                    break;

                case 'ARDS:RemoveResource':
                    if (event.Message) {

                        removeExistingResourceData(event.Message);

                    }
                    break;
                case 'QUEUE:QueueDetail':
                    //Queue Detail
                    if (event.Message) {
                        // //
                        // if (event.Message.QueueInfo.CurrentMaxWaitTime) {
                        //     var d = moment(event.Message.QueueInfo.CurrentMaxWaitTime).valueOf();
                        //     event.Message.QueueInfo.MaxWaitingMS = d;
                        // }

                        var item = event.Message.queueDetail.QueueInfo;
                        item.id = event.Message.queueDetail.QueueId;
                        item.queuename = event.Message.queueDetail.QueueName;
                        item.AverageWaitTime = Math.round(item.AverageWaitTime * 100) / 100;

                        if (event.Message.queueDetail.QueueInfo.TotalQueued > 0) {
                            item.presentage = Math.round((event.Message.queueDetail.QueueInfo.TotalAnswered / event.Message.queueDetail.QueueInfo.TotalQueued) * 100);
                        }


                        if (item.CurrentMaxWaitTime) {
                            var d = moment(item.CurrentMaxWaitTime).valueOf();
                            item.MaxWaitingMS = d;

                            if (item.EventTime) {

                                var serverTime = moment(item.EventTime).valueOf();
                                tempMaxWaitingMS = serverTime - d;
                                item.MaxWaitingMS = moment().valueOf() - tempMaxWaitingMS;

                            }

                        }


                        var queueIDData = item.id.split('-');

                        var queueID = "";
                        queueIDData.forEach(function (qItem, i) {

                            if (i != queueIDData.length - 1) {
                                if (i == queueIDData.length - 2) {
                                    queueID = queueID + qItem;
                                }
                                else {
                                    queueID = queueID.concat(qItem, ":");
                                }

                            }

                        });

                        if (!$scope.queues[item.id]) {
                            // $scope.queueList.push(item);
                            dashboardService.getQueueRecordDetails(queueID).then(function (resQueue) {

                                if (resQueue.data && resQueue.data.IsSuccess && resQueue.data.Result) {
                                    item.queueDetails = resQueue.data.Result;
                                    $scope.safeApply(function () {

                                        $scope.queues[item.id] = item;
                                    });
                                }
                                else {
                                    item.queueDetails = undefined;
                                    $scope.safeApply(function () {

                                        $scope.queues[item.id] = item;
                                    });
                                }
                                $scope.queuesLength = Object.keys($scope.queues).length > 0;
                            }, function (errQueue) {
                                console.log(errQueue);
                                item.queueDetails = undefined;
                                $scope.safeApply(function () {

                                    $scope.queues[item.id] = item;
                                });
                            });
                        }
                        else {

                            item.queueDetails = $scope.queues[item.id].queueDetails;
                            $scope.safeApply(function () {

                                $scope.queues[item.id] = item;
                            });
                        }

                        $scope.queuesLength = Object.keys($scope.queues).length > 0;
                    }
                    break;

                case 'QUEUE:CurrentCount':
                    //Current waiting
                    if (event.Message) {
                        $scope.total.waiting = event.Message.CurrentCountWindow;
                    }
                    break;
                case 'CALLS:TotalCount':
                    //TOTAL CALL
                    //Inblound/Outbound
                    if (event.Message) {

                        if (event.Message.param1 == "inbound") {
                            $scope.total.callsInb = event.Message.TotalCountParam1;
                        } else if (event.Message.param1 == "outbound") {
                            $scope.total.callsOutb = event.Message.TotalCountParam1;
                        }
                    }
                    break;
                case 'QUEUEANSWERED:TotalCount':
                    //Total queued answered
                    if (event.Message) {
                        $scope.total.queueAnswered = event.Message.TotalCountWindow;
                    }
                    break;
                case 'QUEUE:TotalCount':
                    //Total queued
                    if (event.Message) {
                        $scope.total.queued = event.Message.TotalCountWindow;
                    }
                    break;

                case 'QUEUEDROPPED:TotalCount':
                    //Total queued dropped
                    if (event.Message) {
                        $scope.total.queueDropped = event.Message.TotalCountWindow;
                    }
                    break;
                case 'BRIDGE:CurrentCount':
                    //ONGOING
                    //Inblound/Outbound
                    if (event.Message) {
                        if (event.Message.param2 == "inbound") {
                            $scope.total.onGoingInb = event.Message.CurrentCountParam2;
                        } else if (event.Message.param2 == "outbound") {
                            $scope.total.onGoingOutb = event.Message.CurrentCountParam2;
                        }
                    }
                    break;
                case 'ARDS:break_exceeded':
                    if (event.Message) {
                        var agent = $filter('filter')($scope.StatusList.BreakProfile, {'resourceId': event.Message.ResourceId});
                        if (agent && agent.length > 0) {
                            agent[0].breakExceeded = true;
                        }
                    }

                    break;
                case 'ARDS:freeze_exceeded':
                    if (event.Message) {
                        var agent = $filter('filter')($scope.StatusList.AfterWorkProfile, {'resourceId': event.Message.ResourceId});
                        if (agent && agent.length > 0) {
                            agent[0].freezeExceeded = true;
                        }
                    }
                    break;
                    case 'DASHBOARD:RESETALL':

                        reload_dashboard_data();

                    break;

                default:
                    //console.log(event);
                    break;

            }
        } else {
            console.info("Subscribe Dashboard Event Receive For Invalid Business Unit");
        }
    });


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
                var deferred = $q.defer();
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

                    deferred.resolve(true);
                }).catch(function (err) {
                    deferred.resolve(true);
                });
                return deferred.promise;
            }, getAllQueued: function () {
                var deferred = $q.defer();
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
                    deferred.resolve(true);
                }, function (err) {
                    loginService.isCheckResponse(err);
                    deferred.resolve(true);
                });
                return deferred.promise;
            }, getAllBriged: function () {
                var deferred = $q.defer();
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
                    deferred.resolve(true);
                }, function (err) {
                    loginService.isCheckResponse(err);
                    deferred.resolve(true);
                });
                return deferred.promise;
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
                var deferred = $q.defer();
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
                    deferred.resolve(true);
                }, function (err) {
                    loginService.isCheckResponse(err);
                    deferred.resolve(true);
                });

                return deferred.promise;
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
                dashboardService.getCurrentBridgedCalls('inbound').then(function (response) {
                    $scope.total.onGoingInb = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });

                dashboardService.getCurrentBridgedCalls('outbound').then(function (response) {
                    $scope.total.onGoingOutb = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            },
            callAllServices: function () {

                var deferred = $q.defer();
                var arr = [];

                arr.push(ServerHandler.getDataAll());
                arr.push(ServerHandler.getAllQueued());
                arr.push(ServerHandler.getAllBriged());
                arr.push(ServerHandler.getTotalQueueHit());

                $q.all(arr).then(function (resolveData) {
                    deferred.resolve(true);
                }).catch(function (err) {
                    deferred.resolve(true);
                });

                return deferred.promise;

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
        ServerHandler.callAllServices().then(function (resp) {
            countAllCallServicesTimer = $timeout(countAllCallServices, 30000);
        }).catch(function (err) {
            countAllCallServicesTimer = $timeout(countAllCallServices, 30000);
        });

    };

    var getAllNumTotal = function () {
        ServerHandler.getAllNumTotal();
        // getAllNumTotalTimer = $timeout(getAllNumTotal, 60000);
    };

    //var getAllRealTime = function () {
    //    //ServerHandler.updateRelaTimeFuntion();
    //    $scope.getProfileDetails();
    //    // GetD1AllQueueStatistics();
    //    getAllRealTimeTimer = $timeout(getAllRealTime, 1000);
    //};


    ServerHandler.callAllServices();
    ServerHandler.getAllNumTotal();
    ServerHandler.updateRelaTimeFuntion();


    var countAllCallServicesTimer = $timeout(countAllCallServices, 2000);
    // var getAllNumTotalTimer = $timeout(getAllNumTotal, 2000);
    //var getAllRealTimeTimer = $timeout(getAllRealTime, 1000);


    $scope.$on("$destroy", function () {
        if (countAllCallServicesTimer) {
            $timeout.cancel(countAllCallServicesTimer);
        }
        //
        // if (getAllNumTotalTimer) {
        //     $timeout.cancel(getAllNumTotalTimer);
        // }


        // if (getAllRealTimeTimer) {
        //     $timeout.cancel(getAllRealTimeTimer);
        // }

        //subscribeServices.unsubscribe('dashoboard');
        subscribeServices.unSubscribeDashboard('dashboard');
        subscribeServices.UnSubscribeConnection('dashboard_socket');

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
    $scope.queues = {};
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
        size: 50
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

    $scope.queuesLength = false;
    //get all queued
    var GetD1AllQueueStatistics = function () {
        $scope.queues = {};
        queueMonitorService.GetAllQueueStats().then(function (response) {

            if (response) {
                response.forEach(function (c) {
                    var item = {};

                    for (var key in c.QueueInfo) {

                        if (!c.QueueInfo.hasOwnProperty(key)) continue;

                        item[key] = c.QueueInfo[key];


                    }

                    //item.MaxWaitingMS = 0;
                    item.id = c.QueueId;
                    item.queuename = c.QueueName;
                    item.AverageWaitTime = Math.round(item.AverageWaitTime * 100) / 100;

                    if (item.TotalQueued > 0) {
                        item.presentage = Math.round((item.TotalAnswered / item.TotalQueued) * 100);
                    }

                    if (item.CurrentMaxWaitTime) {
                        var d = moment(item.CurrentMaxWaitTime).valueOf();
                        item.MaxWaitingMS = d;

                        if (item.EventTime) {

                            var serverTime = moment(item.EventTime).valueOf();
                            tempMaxWaitingMS = serverTime - d;
                            item.MaxWaitingMS = moment().valueOf() - tempMaxWaitingMS;

                        }

                    }

                    var queueIDData = item.id.split('-');

                    var queueID = "";
                    queueIDData.forEach(function (qItem, i) {

                        if (i != queueIDData.length - 1) {
                            if (i == queueIDData.length - 2) {
                                queueID = queueID + qItem;
                            }
                            else {
                                queueID = queueID.concat(qItem, ":");
                            }

                        }

                    });

                    if (!$scope.queues[item.id]) {
                        //      $scope.queueList.push(item);
                        dashboardService.getQueueRecordDetails(queueID).then(function (resQueue) {

                            if (resQueue.data && resQueue.data.IsSuccess && resQueue.data.Result) {
                                item.queueDetails = resQueue.data.Result;
                                //$scope.safeApply(function () {

                                $scope.queues[item.id] = item;
                                //});
                            }
                            else {
                                item.queueDetails = undefined;
                                // $scope.safeApply(function () {

                                $scope.queues[item.id] = item;
                                // });
                            }
                            $scope.queuesLength = Object.keys($scope.queues).length > 0;
                        }, function (errQueue) {
                            /// console.log(errQueue);
                            item.queueDetails = undefined;
                            //$scope.safeApply(function () {

                            $scope.queues[item.id] = item;
                            // });
                        });
                    }
                    else {

                        item.queueDetails = $scope.queues[item.id].queueDetails;
                        //$scope.safeApply(function () {

                        $scope.queues[item.id] = item;
                        //});
                    }


                    /*$scope.queues[item.id] = item;*/

                    //console.log( item.MaxWaitingMS);
                });

                $scope.queuesLength = Object.keys($scope.queues).length > 0;
            }


            // if (response.length == updatedQueues.length) {
            //     //$scope.queues=$scope.updatedQueues;
            //     angular.forEach($scope.queues, function (item) {
            //         var value = $filter('filter')(updatedQueues, {id: item.id})[0];
            //         if (!value) {
            //             $scope.queues.splice($scope.queues.indexOf(item), 1);
            //         }
            //     });
            // }
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


    $scope.getProfileDetails = function () {
        dashboardService.GetProfileDetails().then(function (response) {
            $scope.StatusList = {
                ReservedProfile: [],
                AvailableProfile: [],
                ConnectedProfile: [],
                AfterWorkProfile: [],
                OutboundProfile: [],
                SuspendedProfile: [],
                BreakProfile: [],
                profile: []
            };
            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    //agent.BusinessUnit.toLowerCase() === ShareData.BusinessUnit.toLowerCase() || ShareData.BusinessUnit.toLowerCase() === "all")
                    if ((response[i] && response[i].BusinessUnit && response[i].BusinessUnit.toLowerCase()) === ShareData.BusinessUnit.toLowerCase() || ShareData.BusinessUnit.toLowerCase() === "all") {
                        var profile = {
                            name: '',
                            slotState: null,
                            slotMode: null,
                            LastReservedTime: 0,
                            LastReservedTimeT: 0,
                            other: null
                        };

                        profile.resourceName = response[i].ResourceName;
                        //get current user profile image
                        userImageList.getAvatarByUserName(profile.resourceName, function (res) {
                            profile.avatar = res ? res : "assets/images/defaultProfile.png";
                        });

                        var resonseStatus = null, resonseAvailability = null, resourceMode = null;
                        var reservedDate = "";

                        if (response[i].ConcurrencyInfo && response[i].ConcurrencyInfo.length > 0) {

                            response[i].ConcurrencyInfo.forEach(function (concurrency) {
                                if (concurrency && concurrency.HandlingType === 'CALL' && concurrency.SlotInfo && concurrency.SlotInfo.length > 0) {

                                    // is user state Reason

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


                                    if (concurrency.SlotInfo[0]) {

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

                        } else {
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
                            $scope.StatusList.ReservedProfile.push(profile);
                        }
                        else if (profile.other == 'Break') {
                            $scope.StatusList.BreakProfile.push(profile);
                        }
                        else if (profile.slotState == 'Connected') {
                            $scope.StatusList.ConnectedProfile.push(profile);
                        } else if (profile.slotState == 'AfterWork') {
                            $scope.StatusList.AfterWorkProfile.push(profile);
                        } else if (profile.slotMode == 'Outbound' && profile.other == null) {
                            $scope.StatusList.OutboundProfile.push(profile);
                        } else if (profile.slotState == 'Suspended') {
                            $scope.StatusList.SuspendedProfile.push(profile);
                        } else if (profile.slotState == 'Available') {
                            $scope.StatusList.AvailableProfile.push(profile);
                            $scope.owlCarouselAgent = $scope.StatusList.AvailableProfile;
                        } else {
                            $scope.StatusList.profile.push(profile);
                            //$scope.BreakProfile.push(profile);
                        }
                    }
                }
            }
        });
    };
    $scope.getProfileDetails();


    var setResourceData = function (profile) {
        if (profile.slotState == 'Reserved') {
            $scope.StatusList.ReservedProfile.push(profile);
        } else if (profile.other == 'Break') {
            $scope.StatusList.BreakProfile.push(profile);
        }
        else if (profile.slotState == 'Connected') {
            $scope.StatusList.ConnectedProfile.push(profile);
        } else if (profile.slotState == 'AfterWork') {
            $scope.StatusList.AfterWorkProfile.push(profile);
        } else if (profile.slotMode == 'Outbound' && profile.other == null) {
            $scope.StatusList.OutboundProfile.push(profile);
        } else if (profile.slotState == 'Suspended') {
            $scope.StatusList.SuspendedProfile.push(profile);
        } else if (profile.slotState == 'Available') {
            $scope.StatusList.AvailableProfile.push(profile);
        } else {
            $scope.StatusList.profile.push(profile);
        }
    };

    var removeExistingResourceData = function (profile) {

        $scope.StatusList.ReservedProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.ReservedProfile.splice(i, 1);
            }
        });

        $scope.StatusList.AvailableProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.AvailableProfile.splice(i, 1);
            }
        });

        $scope.StatusList.ConnectedProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.ConnectedProfile.splice(i, 1);
            }
        });

        $scope.StatusList.AfterWorkProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.AfterWorkProfile.splice(i, 1);
            }
        });

        $scope.StatusList.OutboundProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.OutboundProfile.splice(i, 1);
            }
        });

        $scope.StatusList.SuspendedProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.SuspendedProfile.splice(i, 1);
            }
        });

        $scope.StatusList.BreakProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.BreakProfile.splice(i, 1);
            }
        });

        $scope.StatusList.profile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.profile.splice(i, 1);
            }
        });

    };


    $scope.$watch(function () {
        return ShareData.BusinessUnit;
    }, function (newValue, oldValue) {
        if (newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()) {
            reload_dashboard_data();
        }

    });
});


