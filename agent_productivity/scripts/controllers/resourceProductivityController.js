var app = angular.module("veeryConsoleApp");

app.controller("resourceProductivityController", function ($scope, $filter, $location, $log, $anchorScroll,$q,$interval, resourceProductivityService, reportQueryFilterService, ShareData) {

    $anchorScroll();
    $scope.reloadPage = function () {
        $scope.OnlineAgents = [];
        $scope.productivity = [];
        $scope.GetOnlineAgents();
        $scope.GetReportQueryFilter();

    };

    $scope.BusinessUnit = ShareData.BusinessUnit;
    $scope.showFilter = true;
    $scope.isLoading = true;
    $scope.productivity = [];
    $scope.getProductivity = function () {
        resourceProductivityService.GetProductivity().then(function (response) {
            $log.debug("GetCallServers: response" + response);
            $scope.productivity = response;
            calculateProductivity();
        }, function (error) {
            $log.debug("GetCallServers err "+error);
            $scope.showError("Error", "Error in Loading productivity");
            $scope.isLoading = false;
        });
        $scope.SaveReportQueryFilter();

    };

    $scope.SaveReportQueryFilter = function () {
        reportQueryFilterService.SaveReportQueryFilter("AGENTPRODUCTIVITY"+ShareData.BusinessUnit, $scope.OnlineAgents);
    };

    $scope.AvailableAgents = [];
    $scope.OnlineAgents = [];
    $scope.GetOnlineAgents = function () {
        $scope.AvailableAgents = [];

        ShareData.getUserCountByBusinessUnit().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(ShareData.getUserByBusinessUnit(pagesize, i));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {
                    resolveData.map(function (response) {

                        response.map(function (item) {
                            if(item&&item.resourceid){
                                $scope.AvailableAgents.push({
                                    ResourceName: item.username,
                                    ResourceId: item.resourceid
                                });
                            }
                        });

                        $scope.showFilter = !($scope.AvailableAgents.length > 0);
                        if ($scope.OnlineAgents.length === $scope.AvailableAgents.length) {
                            $scope.agentSelectingType = "ALL";
                        }
                    });

                }

                $scope.OnlineAgents = $scope.AvailableAgents.map(function (item) {
                    return {
                        ResourceName: item.ResourceName,
                        ResourceId: item.ResourceId
                    }
                })
                $scope.isLoading = false;


            }).catch(function (err) {
                $log.debug("GetOnlineAgents err");
                $scope.showError("Error", "Error", "ok", "Error in loading Agent details ");
                $scope.isLoading = false;
            });



        }, function (err) {
            $log.debug("GetOnlineAgents err");
            $scope.showError("Error", "Error", "ok", "Error in loading Agent details ");
            $scope.isLoading = false;
        });



           /* ShareData.GetUserByBusinessUnit().then(function (response) {
                if (response) {

                   response.map(function (item) {
                       if(item&&item.resourceid){
                           $scope.AvailableAgents.push({
                               ResourceName: item.username,
                               ResourceId: item.resourceid
                           });
                       }
                    });

                    $scope.showFilter = !($scope.AvailableAgents.length > 0);
                    if ($scope.OnlineAgents.length === $scope.AvailableAgents.length) {
                        $scope.agentSelectingType = "ALL";
                    }
                }
                $scope.isLoading = false;
            }, function (error) {
                $log.debug("GetOnlineAgents err");
                $scope.showError("Error", "Error", "ok", "There is an error ");
                $scope.isLoading = false;
            });*/
    };

    $scope.GetOnlineAgents();
    $scope.agentSelectingType = "ALL";
    $scope.GetReportQueryFilter = function () {
        $q.all([
            //ShareData.GetUserByBusinessUnit(),
            reportQueryFilterService.GetReportQueryFilter("AGENTPRODUCTIVITY"+ShareData.BusinessUnit)
        ]).then(function (value) {
           // $scope.OnlineAgents = [];
            if (value[0]) {
                if(value[0].length===0){
                    /*$scope.OnlineAgents = $scope.AvailableAgents.map(function (item) {
                        return {
                            ResourceName: item.username,
                            ResourceId: item.resourceid
                        }
                    })*/
                }
                else{
                    $scope.OnlineAgents = [];
                    value[0].map(function (item) {
                        if(item&&item.ResourceId){
                            var ids = $filter('filter')(value[0], {resourceid: item.ResourceId.toString()}, true);
                            if(ids.length>0){
                                $scope.OnlineAgents.push(item);
                            }
                        }
                    });
                }

                $scope.getProductivity();
                if ($scope.OnlineAgents.length != $scope.AvailableAgents.length) {
                    $scope.agentSelectingType = "USER";
                }
            }
        }, function (reason) {

        });



       /* reportQueryFilterService.GetReportQueryFilter("AGENTPRODUCTIVITY").then(function (response) {
            $scope.agentSelectingType = "ALL";
            if (response) {
                $scope.OnlineAgents = response;
                $scope.getProductivity();
                if ($scope.OnlineAgents.length != $scope.AvailableAgents.length) {
                    $scope.agentSelectingType = "USER";
                }
            }
        }, function (error) {
            $scope.getProductivity();
            $log.debug("GetOnlineAgents err");
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });*/

    };
    $scope.GetReportQueryFilter();


    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.AvailableAgents) {
                return $scope.AvailableAgents;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.AvailableAgents) {
                var filteredArr = $scope.AvailableAgents.filter(function (item) {


                    if (item.ResourceName) {
                        return item.ResourceName.match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };

    $scope.onSelectionChanged = function () {
        if ($scope.agentSelectingType == "ALL" || $scope.OnlineAgents.length == 0) {
            angular.copy($scope.AvailableAgents, $scope.OnlineAgents);
        }
        else {
            $scope.OnlineAgents = [];
        }
        $scope.getProductivity();
    };

    $scope.AgentAdded = function () {
        $scope.getProductivity();
    };


    $scope.Productivitys = [];

    var calculateProductivity = function () {
        if ($scope.OnlineAgents) {
            $scope.Productivitys = [];
            angular.forEach($scope.OnlineAgents, function (agent) {
                try {
                    var agentProductivity = {
                        "data": [{
                            value: 0,
                            name: 'Offline'
                        }],
                        "ResourceId": 0,
                        "ResourceName": 0,
                        "IncomingCallCount": 0,
                        "MissCallCount": 0,
                        "Chatid": 0
                    };
                    if (agent) {
                        agent.onlineStatus = true;
                        agentProductivity.ResourceId = agent.ResourceId;
                        agentProductivity.ResourceName = agent.ResourceName;
                        agentProductivity.Chatid = agent.ResourceId;

                        var ids = $filter('filter')($scope.productivity, {ResourceId: agent.ResourceId.toString()}, true);//"ResourceId":"1"

                        if (ids[0]) {
                            agent.onlineStatus = false;
                            agentProductivity = {
                                "data": [{
                                    value: ids[0].AcwTime ? ids[0].AcwTime : 0,
                                    name: 'After work'
                                }, {
                                    value: ids[0].BreakTime ? ids[0].BreakTime : 0,
                                    name: 'Break'
                                }, {
                                    value: ids[0].InboundCallTime ? ids[0].InboundCallTime : 0,
                                    name: 'Inbound'
                                }, {
                                    value: ids[0].OutboundCallTime ? ids[0].OutboundCallTime : 0,
                                    name: 'Outbound'
                                }, {
                                    value: ids[0].IdleTime ? ids[0].IdleTime : 0,
                                    name: 'Idle'
                                }, {
                                    value: ids[0].HoldTime ? ids[0].HoldTime : 0,
                                    name: 'Hold'
                                }],
                                "InboundAcwTime":ids[0].InboundAcwTime ? ids[0].InboundAcwTime : 0,
                                "OutboundAcwTime":ids[0].OutboundAcwTime ? ids[0].OutboundAcwTime : 0,
                                'Break':ids[0].BreakTime ? ids[0].BreakTime : 0,
                                'InboundCallTime': ids[0].InboundCallTime ? ids[0].InboundCallTime : 0,
                                'OutboundCallTime': ids[0].OutboundCallTime ? ids[0].OutboundCallTime : 0,
                                'Idle': ids[0].IdleTime ? ids[0].IdleTime : 0,
                                'InboundHoldTime': ids[0].InboundHoldTime ? ids[0].InboundHoldTime : 0,
                                'OutboundHoldTime': ids[0].OutboundHoldTime ? ids[0].OutboundHoldTime : 0,
                                "ResourceId": agent.ResourceId,
                                "ResourceName": agent.ResourceName,
                                "IncomingCallCount": ids[0].IncomingCallCount ? ids[0].IncomingCallCount : 0,
                                "MissCallCount": ids[0].MissCallCount ? ids[0].MissCallCount : 0,
                                "OutgoingCallCount": ids[0].OutgoingCallCount ? ids[0].OutgoingCallCount : 0,
                                "OutboundAnswerCount": ids[0].OutboundAnswerCount ? ids[0].OutboundAnswerCount : 0,
                                "TransferCallCount": ids[0].TransferCallCount ? ids[0].TransferCallCount : 0,
                                "OnCallTime": ids[0].OnCallTime ? ids[0].OnCallTime : 0,
                                "StaffedTime": ids[0].StaffedTime ? ids[0].StaffedTime : 0,
                                "Chatid": agent.ResourceId
                            };


                        }
                        $scope.Productivitys.push(agentProductivity);
                        $scope.echartDonutSetOption(agentProductivity);
                    }
                    $scope.isLoading = false;
                } catch (ex) {
                    $scope.Productivitys.push(agentProductivity);
                    $scope.echartDonutSetOption(agentProductivity);
                    $scope.isLoading = false;
                }
            });


        }
    };

    /* $scope.labels = ["After work", "Break", "On Call", "Idle"];
     $scope.data = [300, 500, 100, 100];*/
    $scope.showError = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'error',
            styling: 'bootstrap3'
        });
    };

    $scope.showAlert = function (tittle, label, button, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'success',
            styling: 'bootstrap3'
        });
    };


    var theme = {
        color: [
            '#db4114', '#f8b01d', '#2ba89c', '#114858',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],
        title: {
            itemGap: 8,
            textStyle: {
                color: '#408829',
                fontFamily: 'Roboto',
                fontWeight: 300
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: {color: '#408829'},
                emphasis: {color: '#408829'}
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };

    //-----------------------------------------------

    function secondsToTime(secs) {
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        return hours + ":" + minutes + ":" + seconds;
    }

    $scope.echartDonutSetOption = function (productivity) {
        var myObject = {};
        myObject[productivity.Chatid] = echarts.init(document.getElementById(productivity.ResourceId), theme);
        myObject[productivity.Chatid].setOption({
            title: {
                show: true,
                text: productivity.ResourceName,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bolder',
                    color: '#333',
                    fontFamily: 'Ubuntu-Regular'
                }
            },
            tooltip: {
                trigger: 'item',
                //formatter: "{a} <br/>{b} : {c} ({d}%)",
                formatter: function (params, ticket, callback) {
                    var res = params.seriesName + ' <br/>' + params.name + ' ' + secondsToTime(params.value) + ' ' + params.percent + '%';
                    setTimeout(function () {
                        callback(ticket, res);
                    }, 100);
                    return 'loading';
                }
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['After work', 'Break', 'Inbound', 'Outbound', 'Idle', 'Hold']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    //dataView : {show: true, readOnly: false},
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '10%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: false,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save As Image"
                    }
                }
            },
            series: [{
                name: 'Productivity',
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: productivity.data
            }]
        });
    };

    $scope.$watch(function () {
        return ShareData.BusinessUnit;
    }, function (newValue, oldValue) {
        if (newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()) {
            $scope.reloadPage();
            console.log("Reload Productivity ****************************************");
        }
    });


    //------------------------- table view ------------------------------

    $scope.gridOptions = {
        enableColumnResizing: true,
        enableGridMenu: false,
        enableSorting: true,
        columnDefs: [],
        data: 'Productivitys',

        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            // call resize every 500 ms for 5 s after modal finishes opening - usually only necessary on a bootstrap modal
            $interval(function () {
                $scope.gridApi.core.handleWindowResize();
            }, 500, 10);


        }
    };

    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 50; // your header height
        return {
            height: (($scope.gridOptions.data.length+2) * rowHeight + headerHeight) + "px"
        };
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'ResourceName',
            displayName: 'Agent Name',
            headerTooltip: 'Agent Name',
            sort: {direction: 'asc', priority: 0}
        },
        {
            name: 'InboundAcwTime',
            displayName: 'Inbound Acw Time',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.InboundAcwTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Inbound Acw Time'
        },{
            name: 'OutboundAcwTime',
            displayName: 'Outbound Acw Time',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.OutboundAcwTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Outbound Acw Time'
        },
        {
            name: 'Break',
            displayName: 'Break',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.Break|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Break'
        },
        {
            name: 'InboundCallTime',
            displayName: 'Inbound Call Time',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.InboundCallTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Inbound Call Time'
        },

        {
            name: 'OutboundCallTime',
            displayName: 'Outbound Call Time',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.OutboundCallTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Outbound Call Time'
        },
        {
            name: 'InboundHoldTime',
            displayName: 'Inbound Hold Time',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.InboundHoldTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Inbound Hold Time'
        },{
            name: 'OutboundHoldTime',
            displayName: 'Outbound Hold Time',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.OutboundHoldTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Outbound Hold Time'
        },{
            name: 'OnCallTime',
            displayName: 'Total Call Time',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.OnCallTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Total Call Time'
        },{
            name: 'IncomingCallCount',
            displayName: 'Incoming Call Count',
            cellClass: 'table-time',
             headerTooltip: 'Incoming Call Count'
        },{
            name: 'OutgoingCallCount',
            displayName: 'Outgoing Call Count',
            cellClass: 'table-time',
             headerTooltip: 'Outgoing Call Count'
        },{
            name: 'OutboundAnswerCount',
            displayName: 'Outbound Answer Count',
            cellClass: 'table-time',
             headerTooltip: 'Outbound Answer Count'
        },{
            name: 'MissCallCount',
            displayName: 'Missed Call Count',
            cellClass: 'table-time',
             headerTooltip: 'Missed Call Count'
        },{
            name: 'TransferCallCount',
            displayName: 'Transfer Call Count',
            cellClass: 'table-time',
             headerTooltip: 'Transfer Call Count'
        },{
            name: 'Idle',
            displayName: 'Idle',
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.Idle|secondsToDateTime| date:'HH:mm:ss'}}</div>",
             headerTooltip: 'Idle'
        },{
            name: 'StaffedTime',
            displayName: 'Staffed Time',
            cellTemplate: "<div>{{row.entity.StaffedTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
            cellClass: 'table-time',
             headerTooltip: 'Staffed Time'
        }

    ];
});

app.controller("resourceEditController", function ($scope, $routeParams, $location, $log, $filter, clusterService) {


});
