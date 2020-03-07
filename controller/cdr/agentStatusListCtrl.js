/**
 * Created by dinusha on 9/6/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var agentStatusListCtrl = function ($scope, $filter, $q, cdrApiHandler, resourceService, companyConfigBackendService, loginService,$anchorScroll, filterDateRangeValidation) {

        $anchorScroll();
        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.moment = moment;


        $scope.agentStatuses = [
            {DisplayName: 'Register', Status: 'Register'},
            {DisplayName: 'Inbound', Status: 'Inbound'},
            {DisplayName: 'Outbound', Status: 'Outbound'},
            {DisplayName: 'ACW', Status: 'AfterWork'},
            {DisplayName: 'Offline', Status: 'Offline'},
            {DisplayName: 'Call', Status: 'CALL'},
            {DisplayName: 'Chat', Status: 'CHAT'}
            /*{DisplayName: 'Training Break', Status: 'TrainingBreak'},
             {DisplayName: 'Meal Break', Status: 'MealBreak'},
             {DisplayName: 'Tea Break', Status: 'TeaBreak'},
             {DisplayName: 'Official Break', Status: 'OfficialBreak'},
             {DisplayName: 'AUX Break', Status: 'AUXBreak'},
             {DisplayName: 'Process Related Break', Status: 'ProcessRelatedBreak'},
             {DisplayName: 'Meeting Break', Status: 'MeetingBreak'}*/
        ];



        $scope.getBreakTypes = function () {
            companyConfigBackendService.getAllActiveBreakTypes().then(function (response) {
                if(response.IsSuccess)
                {
                    response.Result.forEach(function(bType){
                        $scope.agentStatuses.push(
                            {
                                DisplayName: bType.BreakType,
                                Status: bType.BreakType
                            }
                        );
                    });
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Agent List', errMsg, 'error');
                }
            }, function(err){
                var errMsg = "Error occurred while receiving Break Types";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Agent List', errMsg, 'error');
            });
        };

        $scope.getBreakTypes();



        $scope.obj = {
            startDay: moment().format("YYYY-MM-DD"),
            endDay: moment().format("YYYY-MM-DD")
        };

        $scope.startTime = '12:00 AM';
        $scope.endTime = '12:00 AM';
        $scope.endDtTm='';

        $scope.timeEnabled = 'Date Only';
        $scope.timeEnabledStatus = false;

        $scope.changeTimeAvailability = function () {
            if ($scope.timeEnabled === 'Date Only') {
                $scope.timeEnabled = 'Date & Time';
                $scope.timeEnabledStatus = true;
            }
            else {
                $scope.timeEnabled = 'Date Only';
                $scope.timeEnabledStatus = false;
            }
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
                if ($scope.resList) {
                    return $scope.resList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.resList) {
                    var filteredArr = $scope.resList.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.ResourceName) {
                            return item.ResourceName.match(regEx);
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

        $scope.querySearchStatus = function (query) {
            if (query === "*" || query === "") {
                if ($scope.agentStatuses) {
                    return $scope.agentStatuses;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.agentStatuses) {
                    var filteredArr = $scope.agentStatuses.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.Status) {
                            return item.Status.match(regEx);
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

        $scope.loadAgentList = function () {
            resourceService.getResourcesWithoutPaging().then(function (resList) {
                $scope.resList = resList;

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Agent List', 'error', 'Failed to bind agent auto complete list');

            })
        };

        $scope.loadAgentList();




        $scope.getAgentStatusList = function () {
            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            $scope.obj.isTableLoading = 0;
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            if (!$scope.timeEnabledStatus) {
                startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
                endDate = $scope.obj.endDay + ' 23:59:59' + momentTz;
                $scope.endDtTm = moment($scope.obj.endDay + ' 23:59:59');
            }
            else
            {
                $scope.endDtTm = moment($scope.obj.endDay + ' ' + et + ':59');
            }


            try {

                var statusList = [];

                if($scope.statusFilter)
                {

                    $scope.statusFilter.forEach(function (item) {

                        statusList.push(item);
                        if(item.DisplayName=="Register" && item.Status=="Register")
                        {
                            statusList.push({DisplayName: "UnRegister", Status: "UnRegister"});
                        }
                        else if(item.DisplayName=="Un-Register" && item.Status=="UnRegister")
                        {
                            statusList.push({DisplayName: "Register", Status: "Register"});
                        }
                        else if(item.DisplayName.indexOf("Break")>=0 && item.Status.indexOf("Break")>=0)
                        {
                            statusList.push({DisplayName: "EndBreak", Status: "EndBreak"});

                        }

                        else
                        {

                            statusList.push({DisplayName: "end"+item.DisplayName, Status: "end"+item.Status});
                        }


                    });
                }




                cdrApiHandler.getAgentStatusRecords(startDate, endDate, statusList, $scope.agentFilter).then(function (agentListResp) {
                    $scope.agentStatusList = {};
                    if (agentListResp && agentListResp.Result) {
                        for (var resource in agentListResp.Result) {
                            if (agentListResp.Result[resource] && agentListResp.Result[resource].length > 0 && agentListResp.Result[resource][0].ResResource && agentListResp.Result[resource][0].ResResource.ResourceName) {
                                var caption = agentListResp.Result[resource][0].ResResource.ResourceName;

                                /*if(!$scope.agentStatusList[caption])
                                {
                                    $scope.agentStatusList[caption]=[];
                                }*/

                                /*$scope.agentStatusList[caption]=agentListResp.Result[resource];*/
                                if(!$scope.agentStatusList[caption])
                                {
                                    $scope.agentStatusList[caption]=[];
                                }

                                agentListResp.Result[resource].forEach(function (item) {
                                    $scope.agentStatusList[caption].push(item);
                                })


                            }

                        }


                    }

                    $scope.obj.isTableLoading = 1;

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
                    $scope.obj.isTableLoading = 1;
                });


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
                $scope.obj.isTableLoading = 1;
            }

        };

        /*$scope.getAgentStatusListCSV = function () {
         var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
         var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
         var momentTz = moment.parseZone(new Date()).format('Z');
         momentTz = momentTz.replace("+", "%2B");

         var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
         var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

         if (!$scope.timeEnabledStatus) {
         startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
         endDate = $scope.obj.endDay + ' 23:59:59' + momentTz;
         }

         $scope.DownloadFileName = 'AGENT_STATUS_LIST' + $scope.obj.startDay + '_' + $scope.obj.endDay;
         var deferred = $q.defer();
         var agentStatusList = [];

         try {
         cdrApiHandler.getAgentStatusList(startDate, endDate, $scope.statusFilter, $scope.agentFilter).then(function (agentListResp) {
         if (agentListResp && agentListResp.Result) {
         for (var resource in agentListResp.Result) {
         if (agentListResp.Result[resource] && agentListResp.Result[resource].length > 0 && agentListResp.Result[resource][0].ResResource && agentListResp.Result[resource][0].ResResource.ResourceName) {
         var caption = agentListResp.Result[resource][0].ResResource.ResourceName;
         agentListResp.Result[resource].forEach(function (evtItem) {
         evtItem.Agent = caption;
         evtItem.Date = moment(evtItem.createdAt).local().format("YYYY-MM-DD HH:mm:ss");
         agentStatusList.push(evtItem);
         });
         }

         }

         }

         deferred.resolve(agentStatusList);

         }).catch(function (err) {
         loginService.isCheckResponse(err);
         $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading agent status events');
         deferred.reject(agentStatusList);
         });


         }
         catch (ex) {
         $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading agent status events');
         deferred.reject(agentStatusList);
         }

         return deferred.promise;

         };*/

        $scope.agentStatusListCSV ={};
        $scope.statusData=[];
        $scope.isDowloading=false;
        $scope.getAgentStatusListCSV = function () {
			/** Kasun_Wijeratne_5_MARCH_2018
			 * ----------------------------------------*/
			if(filterDateRangeValidation.validateDateRange($scope.obj.startDay, $scope.obj.endDay) == false){
				$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
				return -1;
			}
			/** ----------------------------------------
			 * Kasun_Wijeratne_5_MARCH_2018*/
            $scope.isDowloading=true;
            $scope.agentStatusListCSV ={};
            $scope.statusData=[];
            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            if (!$scope.timeEnabledStatus) {
                startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
                endDate = $scope.obj.endDay + ' 23:59:59' + momentTz;
                $scope.endDtTm = moment($scope.obj.endDay + ' 23:59:59');
            }
            else
            {
                $scope.endDtTm = moment($scope.obj.endDay + ' ' + et + ':59');
            }

            $scope.DownloadFileName = 'AGENT_STATUS_LIST' + $scope.obj.startDay + '_' + $scope.obj.endDay;
            var deferred = $q.defer();


            try {

                var statusList = [];

                if($scope.statusFilter)
                {

                    $scope.statusFilter.forEach(function (item) {

                        statusList.push(item);
                        if(item.DisplayName=="Register" && item.Status=="Register")
                        {
                            statusList.push({DisplayName: "UnRegister", Status: "UnRegister"});
                        }
                        else if(item.DisplayName=="Un-Register" && item.Status=="UnRegister")
                        {
                            statusList.push({DisplayName: "Register", Status: "Register"});
                        }
                        else if(item.DisplayName.indexOf("Break")>=0 && item.Status.indexOf("Break")>=0)
                        {
                            statusList.push({DisplayName: "EndBreak", Status: "EndBreak"});

                        }

                        else
                        {

                            statusList.push({DisplayName: "end"+item.DisplayName, Status: "end"+item.Status});
                        }


                    });
                }

                cdrApiHandler.getAgentStatusRecords(startDate, endDate, $scope.statusFilter, $scope.agentFilter).then(function (agentListResp) {
                    if (agentListResp && agentListResp.Result) {
                        for (var resource in agentListResp.Result) {
                            if (agentListResp.Result[resource] && agentListResp.Result[resource].length > 0 && agentListResp.Result[resource][0].ResResource && agentListResp.Result[resource][0].ResResource.ResourceName) {
                                var caption = agentListResp.Result[resource][0].ResResource.ResourceName;
                                $scope.agentStatusListCSV [caption] = agentListResp.Result[resource];



                                /*agentListResp.Result[resource].forEach(function (evtItem) {
                                 evtItem.Agent = caption;
                                 evtItem.Date = moment(evtItem.createdAt).local().format("YYYY-MM-DD HH:mm:ss");
                                 agentStatusList.push(evtItem);
                                 });*/
                            }

                        }

                        if($scope.agentStatusListCSV)
                        {
                            for (var key in $scope.agentStatusListCSV)
                            {
                                $scope.recordMaker($scope.agentStatusListCSV[key]);
                            }
                            $scope.isDowloading=false;
                            deferred.resolve($scope.statusData);
                        }

                    }
                    /* if ($scope.agentStatusListCSV) {
                     var eventLength = Object.keys($scope.agentStatusListCSV).length;

                     while (eventLength > 0) {
                     $scope.recordMaker($scope.agentStatusListCSV[Object.keys($scope.agentStatusListCSV)[0]]);
                     eventLength = Object.keys($scope.agentStatusListCSV).length;
                     if(eventLength==0)
                     {
                     deferred.resolve($scope.statusData);
                     }

                     }

                     }*/





                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
                    deferred.reject($scope.statusData);
                });


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
                deferred.reject($scope.statusData);
            }

            return deferred.promise;

        };








        $scope.recordMaker = function (events) {


            try {
                var eventLength = events.length;

                while (eventLength > 0) {
                    var event = events[0];
                    var stEventName = event.Reason;
                    var endEventName = "";

                    var isACW = false;
                    var isCALL = false;
                    var isCHAT = false;
                    var isSlotEndEvent = false;

                    if (event.Reason == "Register") {
                        endEventName = "Un" + stEventName;

                    }
                    else if (event.Reason != "EndBreak" && event.Reason.indexOf("Break") >= 0) {
                        endEventName = "EndBreak";

                    }
                    else if (event.Reason == "AfterWork") {
                        if (event.Status == "Completed") {
                            isACW = true;
                        }
                        else
                        {
                            isSlotEndEvent=true;
                        }
                    }
                    else if (event.Reason == "CALL") {
                        if (event.Status == "Connected") {
                            isCALL = true;
                        }else
                        {
                            isSlotEndEvent=true;
                        }
                    }
                    else if (event.Reason == "CHAT") {
                        if (event.Status == "Connected") {
                            isCHAT = true;
                        }
                        else
                        {
                            isSlotEndEvent=true;
                        }
                    }
                    else {
                        endEventName = "end" + stEventName;
                    }


                    var index = -1;



                    if (isACW) {
                        isACW = false;

                        index = events.map(function (el) {
                            return el.Status;
                        }).indexOf("Available");


                    }
                    else if (isCALL) {



                        index = events.map(function (el) {
                            return el.Status;
                        }).indexOf("Completed");




                    }
                    else if (isCHAT) {



                        index = events.map(function (el) {
                            return el.Status;
                        }).indexOf("Completed");




                    }
                    else  {

                        if(!isSlotEndEvent)
                        {
                            index = events.map(function (el) {
                                return el.Reason;
                            }).indexOf(endEventName);
                        }



                    }



                    if (index >= 0) {

                        var eventObj = {

                            Agent: event.ResResource.ResourceName,
                            Event: stEventName,
                            From: moment(event.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
                            To: moment(events[index].createdAt).local().format("YYYY-MM-DD HH:mm:ss")

                        };


                        events.splice(index, 1);
                        events.splice(events.indexOf(event), 1);
                        $scope.statusData.push(eventObj);

                    }
                    else {


                        if(moment($scope.endDtTm).diff(moment())>=0)
                        {
                            $scope.endDtTm=moment();
                        }

                        if(stEventName=="Register")
                        {
                            var
                                eventObj = {
                                    Agent: event.ResResource.ResourceName,
                                    Event: stEventName,
                                    From: moment(event.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
                                    To:  moment($scope.endDtTm).local().format("YYYY-MM-DD HH:mm:ss")
                                }

                            $scope.statusData.push(eventObj);
                        }
                        else if(stEventName. indexOf ("end")==-1 && stEventName!="UnRegister")
                        {
                            if(!isSlotEndEvent)
                            {
                                var
                                    eventObj = {
                                        Agent: event.ResResource.ResourceName,
                                        Event: stEventName,
                                        From: moment(event.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
                                        To:  moment($scope.endDtTm).local().format("YYYY-MM-DD HH:mm:ss")
                                    };
                                $scope.statusData.push(eventObj);
                            }

                        }
                        events.splice(events.indexOf (event),1);

                    }
                    eventLength = events.length;

                    if (eventLength == 0) {
                        $scope.statusData;
                    }

                }
            } catch (e) {
                console.log("Error in Making CSV")
            }






        }


    };
    app.controller("agentStatusListCtrl", agentStatusListCtrl);

}());

mainApp.directive('statusgantt', function ($timeout) {
    return {

        restrict: 'EA',
        scope: {
            events: "=",
            endtime:"="
        },
        templateUrl: 'views/cdr/partials/agentStatusListGantt.html',
        link: function (scope, element, attributes) {


            scope.loadCount=0;
            scope.isLoading=-1;

            /*  scope.$watch(scope.events.isOpen,function () {
             if(scope.events.isOpen && scope.loadCount==0)
             {
             scope.chartMaker();
             scope.loadCount++;
             }
             })*/
            scope.loadChart = function () {
                if(scope.loadCount==0)
                {
                    scope.isLoading=1;
                    scope.loadCount++;
                    scope.chartMaker();

                }
            }

            scope.mode = "custom";
            scope.maxHeight = 0;
            scope.showWeekends = true;
            scope.showNonWorkHours = true;
            scope.eventArray=[];




            scope.options = {
                mode: 'custom',
                scale: 'day',
                sortMode: undefined,
                sideMode: 'Table',
                daily: false,
                maxHeight: false,
                width: true,
                zoom: 1,
                columns: ['model.name', 'from', 'to'],
                treeTableColumns: ['from', 'to'],
                columnsHeaders: {'model.name': 'Name', 'from': 'From', 'to': 'To'},
                columnsClasses: {'model.name': 'gantt-column-name', 'from': 'gantt-column-from', 'to': 'gantt-column-to'},
                filterTask: '',
                filterRow: '',
                columnsFormatters: {
                    'from': function (from) {
                        return from !== undefined ? from.format('lll') : undefined
                    },
                    'to': function (to) {
                        return to !== undefined ? to.format('lll') : undefined
                    }
                },
                treeHeaderContent: '<i class="fa fa-align-justify"></i> {{getHeader()}}',
                columnsHeaderContents: {
                    'model.name': '<i class="fa fa-align-justify"></i> {{getHeader()}}',
                    'from': '<i class="fa fa-calendar"></i> {{getHeader()}}',
                    'to': '<i class="fa fa-calendar"></i> {{getHeader()}}'
                },
                autoExpand: 'none',
                taskOutOfRange: 'truncate',
                fromDate: moment(null),
                toDate: undefined,
                rowContent: '<i class="fa fa-align-justify"></i> {{row.model.name}}',
                taskContent: '<i class="fa fa-tasks"></i> {{task.model.name}}',
                allowSideResizing: true,
                labelsEnabled: true,
                currentDate: 'line',
                currentDateValue: new Date(2013, 9, 23, 11, 20, 0),
                draw: false,
                readOnly: false,
                groupDisplayMode: 'group',
                filterTask: '',
                filterRow: '',
                timeFrames: {
                    'day': {
                        start: moment('8:00', 'HH:mm'),
                        end: moment('20:00', 'HH:mm'),
                        color: '#ACFFA3',
                        working: true,
                        default: true
                    },
                    'noon': {
                        start: moment('12:00', 'HH:mm'),
                        end: moment('13:30', 'HH:mm'),
                        working: false,
                        default: true
                    },
                    'closed': {
                        working: false,
                        default: true
                    },
                    'weekend': {
                        working: false
                    },
                    'holiday': {
                        working: false,
                        color: 'red',
                        classes: ['gantt-timeframe-holiday']
                    }
                },
                dateFrames: {
                    'weekend': {
                        evaluator: function (date) {
                            return date.isoWeekday() === 6 || date.isoWeekday() === 7
                        },
                        targets: ['weekend']
                    },
                    '11-november': {
                        evaluator: function (date) {
                            return date.month() === 10 && date.date() === 11
                        },
                        targets: ['holiday']
                    }
                },
                timeFramesWorkingMode: 'hidden',
                timeFramesNonWorkingMode: 'visible',
                columnMagnet: '15 minutes',
                timeFramesMagnet: true,
                dependencies: {
                    enabled: true,
                    conflictChecker: true
                },
                movable: {
                    allowRowSwitching: function (task, targetRow) {
                        return task.row.model.name !== 'Milestones' && targetRow.model.name !== 'Milestones'
                    }
                },
                corner: {
                    headersLabels: function (key) {
                        return key.charAt(0).toUpperCase() + key.slice(1)
                    },
                    headersLabelsTemplates: '{{getLabel(header)}} <i class="fa fa-calendar"></i>'
                },
                targetDataAddRowIndex: undefined,
                canDraw: function (event) {
                    var isLeftMouseButton = event.button === 0 || event.button === 1
                    return $scope.options.draw && !$scope.options.readOnly && isLeftMouseButton
                },
                drawTaskFactory: function () {
                    return {
                        id: ganttUtils.randomUuid(),  // Unique id of the task.
                        name: 'Drawn task', // Name shown on top of each task.
                        color: '#AA8833' // Color of the task in HEX format (Optional).
                    }
                },
                api: function (api) {
                    // API Object is used to control methods and events from angular-gantt.
                    scope.api = api

                    api.core.on.ready(scope, function () {
                        // Log various events to console
                        /* api.scroll.on.scroll(scope, logScrollEvent)
                         api.core.on.ready(scope, logReadyEvent);*/
                        api.core.on.rendered(scope,function () {

                            scope.isLoading=0;
                        });

                        /*api.data.on.remove(scope, addEventName('data.on.remove', logDataEvent))
                         api.data.on.load(scope, addEventName('data.on.load', logDataEvent))
                         api.data.on.clear(scope, addEventName('data.on.clear', logDataEvent))
                         api.data.on.change(scope, addEventName('data.on.change', logDataEvent))

                         api.tasks.on.add(scope, addEventName('tasks.on.add', logTaskEvent))
                         api.tasks.on.change(scope, addEventName('tasks.on.change', logTaskEvent))
                         api.tasks.on.rowChange(scope, addEventName('tasks.on.rowChange', logTaskEvent))
                         api.tasks.on.remove(scope, addEventName('tasks.on.remove', logTaskEvent))

                         if (api.tasks.on.moveBegin) {
                         api.tasks.on.moveBegin(scope, addEventName('tasks.on.moveBegin', logTaskEvent))
                         // api.tasks.on.move($scope, addEventName('tasks.on.move', logTaskEvent));
                         api.tasks.on.moveEnd(scope, addEventName('tasks.on.moveEnd', logTaskEvent))

                         api.tasks.on.resizeBegin(scope, addEventName('tasks.on.resizeBegin', logTaskEvent))
                         // api.tasks.on.resize($scope, addEventName('tasks.on.resize', logTaskEvent));
                         api.tasks.on.resizeEnd(scope, addEventName('tasks.on.resizeEnd', logTaskEvent))
                         }

                         if (api.tasks.on.drawBegin) {
                         api.tasks.on.drawBegin(scope, addEventName('tasks.on.drawBegin', logTaskEvent))
                         // api.tasks.on.draw($scope, addEventName('tasks.on.draw', logTaskEvent));
                         api.tasks.on.drawEnd(scope, addEventName('tasks.on.drawEnd', logTaskEvent))
                         }

                         api.rows.on.add(scope, addEventName('rows.on.add', logRowEvent))
                         api.rows.on.change(scope, addEventName('rows.on.change', logRowEvent))
                         api.rows.on.move(scope, addEventName('rows.on.move', logRowEvent))
                         api.rows.on.remove(scope, addEventName('rows.on.remove', logRowEvent))

                         api.side.on.resizeBegin(scope, addEventName('labels.on.resizeBegin', logLabelsEvent))
                         // api.side.on.resize($scope, addEventName('labels.on.resize', logLabelsEvent));
                         api.side.on.resizeEnd(scope, addEventName('labels.on.resizeEnd', logLabelsEvent))

                         api.timespans.on.add(scope, addEventName('timespans.on.add', logTimespanEvent))
                         api.columns.on.generate(scope, logColumnsGenerateEvent)

                         api.rows.on.filter(scope, logRowsFilterEvent)
                         api.tasks.on.filter(scope, logTasksFilterEvent)

                         api.data.on.change(scope, function (newData) {
                         if (dataToRemove === undefined) {
                         dataToRemove = [
                         {'id': newData[2].id}, // Remove Kickoff row
                         {
                         'id': newData[0].id, 'tasks': [
                         {'id': newData[0].tasks[0].id},
                         {'id': newData[0].tasks[3].id}
                         ]
                         }, // Remove some Milestones
                         {
                         'id': newData[7].id, 'tasks': [
                         {'id': newData[7].tasks[0].id}
                         ]
                         } // Remove order basket from Sprint 2
                         ]
                         }
                         })

                         // When gantt is ready, load data.
                         // `data` attribute could have been used too.
                         scope.load()

                         // Add some DOM events
                         api.directives.on.new(scope, function (directiveName, directiveScope, element) {
                         if (directiveName === 'ganttTask') {
                         element.bind('click', function (event) {
                         event.stopPropagation()
                         logTaskEvent('task-click', directiveScope.task)
                         })
                         element.bind('mousedown touchstart', function (event) {
                         event.stopPropagation()
                         scope.live.row = directiveScope.task.row.model
                         if (directiveScope.task.originalModel !== undefined) {
                         scope.live.task = directiveScope.task.originalModel
                         } else {
                         scope.live.task = directiveScope.task.model
                         }
                         scope.$digest()
                         })
                         } else if (directiveName === 'ganttRow') {
                         element.bind('click', function (event) {
                         event.stopPropagation()
                         logRowEvent('row-click', directiveScope.row)
                         })
                         element.bind('mousedown touchstart', function (event) {
                         event.stopPropagation()
                         scope.live.row = directiveScope.row.model
                         scope.$digest()
                         })
                         } else if (directiveName === 'ganttRowLabel') {
                         element.bind('click', function () {
                         logRowEvent('row-label-click', directiveScope.row)
                         })
                         element.bind('mousedown touchstart', function () {
                         scope.live.row = directiveScope.row.model
                         scope.$digest()
                         })
                         }
                         })

                         api.tasks.on.rowChange(scope, function (task) {
                         scope.live.row = task.row.model
                         })

                         objectModel = new GanttObjectModel(api)
                         */
                    });

                }
            }

            scope.statusData =[];

            scope.chartMaker = function () {

                if(scope.events)
                {
                    var eventLength = scope.events.length;

                    while (eventLength>0) {
                        scope.isLoading=true;
                        scope.makeGanttData(scope.events[0]);
                        eventLength = scope.events.length;
                        if(eventLength==0)
                        {
                            scope.isLoading=0;
                        }
                    }

                }
            };

            scope.makeGanttData = function (event) {

                try {
                    var stEventName = event.Reason;
                    var endEventName = "";
                    var statusColour = '#F1C232';
                    var isACW = false;
                    var isCALL = false;
                    var isCHAT = false;
                    var isSlotEndEvent=false;

                    if (event.Reason == "Register") {
                        endEventName = "Un" + stEventName;
                        statusColour = '#0CFF00';
                    }
                    else if (event.Reason != "EndBreak" && event.Reason.indexOf("Break") >= 0) {
                        endEventName = "EndBreak";
                        statusColour = '#7b1102';
                    }
                    else if (event.Reason == "AfterWork") {
                        if (event.Status == "Completed") {
                            isACW = true;
                            statusColour = '#000000';
                        }
                        else
                        {
                            isSlotEndEvent=true;
                        }
                    }
                    else if(event.Reason == "CALL")
                    {
                        if(event.Status=="Connected")
                        {
                            isCALL = true;
                            statusColour = '#7c7eff';

                        }
                        else
                        {
                            isSlotEndEvent=true;
                        }
                    }
                    else if(event.Reason == "CHAT")
                    {
                        if(event.Status=="Connected")
                        {
                            isCHAT = true;
                            statusColour = '#ff574d';
                        }
                        else {
                            isSlotEndEvent=true;
                        }

                    }
                    else {
                        endEventName = "end" + stEventName;
                    }

                    if (stEventName == "Inbound") {
                        statusColour = '#074DEE';
                    }
                    if (stEventName == "Outbound") {
                        statusColour = '#DF0AF1';
                    }
                    if (stEventName == "Offline") {
                        statusColour = '#F90422';
                    }


                    var index = -1;
                    var itemName;


                    if (isACW) {



                        index = scope.events.map(function (el) {
                            return el.Status;
                        }).indexOf("Available");


                    }
                    else if (isCALL) {



                        index = scope.events.map(function (el) {
                            return el.Status;
                        }).indexOf("Completed");




                    }
                    else if (isCHAT) {



                        index = scope.events.map(function (el) {
                            return el.Status;
                        }).indexOf("Completed");




                    }
                    else  {

                        if(!isSlotEndEvent)
                        {
                            index = scope.events.map(function (el) {
                                return el.Reason;
                            }).indexOf(endEventName);
                        }



                    }


                    if (index >= 0) {

                        var eventObj = {
                            name: stEventName, tasks: [
                                {
                                    name: stEventName,
                                    color: statusColour,
                                    /*from: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                                     to:  moment(scope.events[index].createdAt).format("YYYY-MM-DD HH:mm:ss")*/
                                    from:
                                        moment(event.createdAt),
                                    to:  moment(scope.events[index].createdAt)
                                }
                            ]};



                        scope.events. splice(index,1);
                        scope.events.splice(scope.events. indexOf(event),1);

                        scope.statusData.push(eventObj


                        );


                    }
                    else
                    {

                        if(moment(scope.endtime).diff(moment())>=0)
                        {
                            scope.endtime=moment();
                        }

                        if(stEventName=="Register")
                        {
                            var
                                eventObj = {name:
                                stEventName,
                                    tasks: [
                                        {
                                            name: stEventName,
                                            color: statusColour,
                                            from:  moment(event.createdAt),
                                            to: moment(scope.endtime)
                                        }
                                    ]};
                            scope.statusData.push(eventObj);
                        }
                        else if(stEventName. indexOf ("end")==-1 && stEventName!="UnRegister")
                        {
                            if(!isSlotEndEvent)
                            {
                                var
                                    eventObj = {name:
                                    stEventName,
                                        tasks: [
                                            {
                                                name: stEventName,
                                                color: statusColour,
                                                from:  moment(event.createdAt),
                                                to: moment(scope.endtime)
                                            }
                                        ]};
                                scope.statusData.push(eventObj);
                            }



                        }

                        scope.events.splice(scope.events.indexOf (event),1);
                    }


                } catch (e) {
                    console.log(e);
                }









            };
            /*scope.chartMaker();*/



            /* scope.makeGanttData();*/


            /*   scope.makechart = function () {

             var testData =
             [
             {"Reason":"UnRegister","createdAt":"2015-10-10 11:11:11"},
             {"Reason":"Register","createdAt":"2015-10-10 11:12:11"},
             {"Reason":"offline","createdAt":"2015-10-10 11:15:15"},
             {"Reason":"endoffline","createdAt":"2015-10-10 11:17:15"},
             {"Reason":"online","createdAt":"2015-10-10 11:17:15"},
             {"Reason":"endonline","createdAt":"2015-10-10 11:19:15"},
             {"Reason":"break","createdAt":"2015-10-10 11:19:15"},
             {"Reason":"endbreak","createdAt":"2015-10-10 11:20:15"},
             ]

             testData.forEach(function (item) {

             var stEventName = item.Reason;
             var endEventName="";

             if(item.Reason=="Register")
             {
             endEventName="Un"+stEventName;
             }
             else
             {
             endEventName="end"+stEventName;
             }


             var index = testData.map(function(el) {
             return el.Reason;
             }).indexOf(endEventName);


             if(index>=0)
             {

             var eventObj = {name: item.Reason, tasks: [
             {
             name: item.Reason,
             color: '#F1C232',
             from: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
             to:  moment(testData[index].createdAt).format("YYYY-MM-DD HH:mm:ss")
             }
             ]};


             console.log(eventObj.tasks[0].from);
             console.log(eventObj.tasks[0].to);

             testData.splice(index,1);

             scope.statusData.push(eventObj);

             }
             else
             {
             testData.splice(scope.events.indexOf(item),1);
             }



             });


             };
             scope.makechart();*/


            scope.labelEvent = function(event) {
                // A label has been clicked.
                console.log('Label event (by user: ' + event.userTriggered + '): ' + event.row.description + ' (Custom data: ' + event.row.data + ')');
            };

            scope.labelHeaderEvent = function(event) {
                // The label header has been clicked.
                console.log('Label header event. Mouse: ' + event.evt.clientX + '/' + event.evt.clientY);
            };

            scope.rowEvent = function(event) {
                // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
                console.log('Row event (by user: ' + event.userTriggered + '): ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
            };

            scope.scrollEvent = function(event) {
                if (angular.equals(event.direction, "left")) {
                    // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
                    console.log('Scroll event: Left');
                } else if (angular.equals(event.direction, "right")) {
                    // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
                    console.log('Scroll event: Right');
                }
            };

            scope.taskEvent = function(event) {
                // A task has been updated or clicked.
                console.log('Task event (by user: ' + event.userTriggered + '): ' + event.task.subject + ' (Custom data: ' + event.task.data + ')');
            };





            /*scope.makeGanttData();


             ]*/

        },


    }
});



