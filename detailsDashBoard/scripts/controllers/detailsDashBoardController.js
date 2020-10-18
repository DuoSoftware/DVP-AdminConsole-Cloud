/**
 * Created by Waruna on 9/27/2017.
 */

mainApp.controller("detailsDashBoardController", function (
  $http,
  $scope,
  $rootScope,
  $filter,
  $stateParams,
  $anchorScroll,
  $timeout,
  $q,
  $interval,
  uiGridConstants,
  queueMonitorService,
  subscribeServices,
  agentStatusService,
  contactService,
  cdrApiHandler,
  ShareData,
  notifiSenderService,
  dashboardService,
  authService,
  jwtHelper,
  $state
) {
  $anchorScroll();
  $scope.refreshTime = 10000;
  $rootScope.detailsDashboardState = $state.current.name;

  $scope.dtOptions = {
    paging: false,
    searching: false,
    info: false,
    order: [0, "desc"],
  };

  $scope.safeApply = function (fn) {
    if (this.$root) {
      var phase = this.$root.$$phase;
      if (phase == "$apply" || phase == "$digest") {
        if (fn && typeof fn === "function") {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    } else {
      this.$apply(fn);
    }
  };

  $scope.showAlert = function (tittle, type, content) {
    new PNotify({
      title: tittle,
      text: content,
      type: type,
      styling: "bootstrap3",
    });
  };

  /*------------------------ queue details ------------------------------------*/
  var statusTemplate =
    '<timer start-time="row.entity.MaxWaitingMS" interval="1000"> {{hhours}}:{{mminutes}}:{{sseconds}}</timer>';
  var maxWaitTimeTemplate =
    "<div>{{row.entity.MaxWaitTime| secondsToDateTime | date:'HH:mm:ss'}}</div>";

  $scope.gridQOptions = {
    enableFiltering: true,
    enableSorting: true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    multiSelect: false,
    modifierKeysToMultiSelect: false,
    noUnselect: false,
    columnDefs: [
      {
        enableSorting: true,
        enableFiltering: true,
        name: "QueueName",
        field: "QueueName",
        headerTooltip: "Queue Name",
        width: "15%",
        sort: {
          direction: uiGridConstants.ASC,
        },
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "Cur.Waiting",
        field: "CurrentWaiting",
        headerTooltip: "Current Waiting",
        cellClass: "table-number",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "Avg.Wait",
        field: "AverageWaitTime",
        headerTooltip: "Average Wait Time",
        cellFilter: " number : 2",
        cellClass: "table-time",
        cellTemplate:
          "<div>{{row.entity.AverageWaitTime|secondsToDateTime| date:'HH:mm:ss'}}</div>",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "Cur.MaxWait",
        field: "CurrentMaxWaitTime",
        headerTooltip: "Current MaxWait Time",
        cellTemplate: statusTemplate,
        cellClass: "table-time",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "MaxWait",
        field: "MaxWaitTime",
        headerTooltip: "Max Waiting Time",
        cellTemplate: maxWaitTimeTemplate,
        cellClass: "table-time",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "Q.Dropped",
        field: "QueueDropped",
        headerTooltip: "Queue Dropped",
        cellClass: "table-number",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "Answered",
        field: "TotalAnswered",
        headerTooltip: "Total Answered",
        cellClass: "table-number",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "Queued",
        field: "TotalQueued",
        headerTooltip: "Total Queued",
        cellClass: "table-number",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "presentage",
        field: "presentage",
        headerTooltip: "presentage",
        cellClass: "presentage",
      },
      {
        enableSorting: true,
        enableFiltering: false,
        name: "Time",
        field: "EventTime",
        headerTooltip: "Last Event Time",
        visible: false,
      },
    ],
    data: [],
    onRegisterApi: function (gridApi) {
      //$scope.grid1Api = gridApi;
    },
  };

  $scope.queues = { test: "dasdas" };

  subscribeServices.subscribe("queuedetail");
  //subscribe services
  subscribeServices.subscribeDashboard("detaildashboard", function (event) {
    console.debug(event);
    if (
      event &&
      event.Message &&
      event.Message.businessUnit &&
      ((ShareData.BusinessUnit.toLowerCase() === "all" &&
        (event.Message.businessUnit.toLowerCase() === "*" ||
          event.Message.businessUnit.toLowerCase() === "all")) ||
        event.Message.businessUnit.toLowerCase() ===
          ShareData.BusinessUnit.toLowerCase())
    ) {
      switch (event.roomName) {
        case "QUEUE:QueueDetail":
          if (event.Message) {
            var item = event.Message.queueDetail.QueueInfo;
            if (item.CurrentMaxWaitTime) {
              var d = moment(item.CurrentMaxWaitTime).valueOf();
              item.MaxWaitingMS = d;

              if (item.EventTime) {
                var serverTime = moment(item.EventTime).valueOf();
                tempMaxWaitingMS = serverTime - d;
                item.MaxWaitingMS = moment().valueOf() - tempMaxWaitingMS;
              }
            }

            //
            item.id = event.Message.queueDetail.QueueId;

            item.QueueName = event.Message.queueDetail.QueueName;
            item.AverageWaitTime = Math.round(item.AverageWaitTime * 100) / 100;

            if (item.TotalQueued > 0) {
              item.presentage = Math.round(
                (item.TotalAnswered / item.TotalQueued) * 100
              );
            }

            /*if (!$scope.queues[event.Message.queueDetail.QueueId]) {
                            $scope.queueList.push(item);
                        }*/
            $scope.safeApply(function () {
              item.CurrentMaxWaitTime =
                item.CurrentMaxWaitTime === 0
                  ? undefined
                  : item.CurrentMaxWaitTime;
              $scope.queues[event.Message.queueDetail.QueueId] = item;
            });

            var res = [];
            for (var x in $scope.queues) {
              $scope.queues.hasOwnProperty(x) && res.push($scope.queues[x]);
            }
            $scope.safeApply(function () {
              $scope.gridQOptions.data = res;
            });
          }
          break;
      }
    }
  });

  $scope.GetAllQueueStatistics = function () {
    queueMonitorService.GetAllQueueStats().then(function (response) {
      $scope.queues = {};
      angular.forEach(response, function (c) {
        // var value = $filter('filter')(updatedQueues, {id: item.id})[0];
        // if (!value) {
        //     $scope.queues.splice($scope.queues.indexOf(item), 1);
        // }

        var item = c.QueueInfo;
        item.id = c.QueueId;
        item.QueueName = c.QueueName;
        item.AverageWaitTime = Math.round(item.AverageWaitTime * 100) / 100;

        if (item.CurrentMaxWaitTime) {
          var d = moment(item.CurrentMaxWaitTime).valueOf();
          item.MaxWaitingMS = d;

          if (item.EventTime) {
            var serverTime = moment(item.EventTime).valueOf();
            tempMaxWaitingMS = serverTime - d;
            item.MaxWaitingMS = moment().valueOf() - tempMaxWaitingMS;
          }
        }

        if (item.TotalQueued > 0) {
          item.presentage = Math.round(
            (item.TotalAnswered / item.TotalQueued) * 100
          );
        }

        // if ($scope.checkQueueAvailability(item.id)) {
        item.CurrentMaxWaitTime =
          item.CurrentMaxWaitTime === 0 ? undefined : item.CurrentMaxWaitTime;
        $scope.queues[item.id] = item;
        var res = [];
        for (var x in $scope.queues) {
          $scope.queues.hasOwnProperty(x) && res.push($scope.queues[x]);
        }
        $scope.gridQOptions.data = res;
      });
    });
  };

  $scope.GetAllQueueStatistics();

  /*------------------------ queue details ------------------------------------*/

  /*------------------------ Agent Summary  ------------------------------------*/

  $scope.attributesList = [];
  $scope.GetAllAttributes = function () {
    agentStatusService.GetAllAttributes().then(
      function (response) {
        if (response) {
          $scope.attributesList = response.map(function (item) {
            return {
              AttributeId: item.AttributeId,
              Attribute: item.Attribute,
            };
          });
        }
        $scope.getProfileDetails();
      },
      function (error) {
        $log.debug("GetAllAttributes err");
        $scope.showAlert("Error", "error", "Fail To Get Attribute List.");
      }
    );
  };
  $scope.GetAllAttributes();

  var TimeFormatter = function (seconds) {
    var timeStr = "00:00:00";
    if (seconds > 0) {
      var durationObj = moment.duration(seconds * 1000);

      if (durationObj) {
        var tempDays = 0;
        if (durationObj._data.years > 0) {
          tempDays = tempDays + durationObj._data.years * 365;
        }
        if (durationObj._data.months > 0) {
          tempDays = tempDays + durationObj._data.months * 30;
        }
        if (durationObj._data.days > 0) {
          tempDays = tempDays + durationObj._data.days;
        }

        if (tempDays > 0) {
          timeStr =
            tempDays +
            "d " +
            ("00" + durationObj._data.hours).slice(-2) +
            ":" +
            ("00" + durationObj._data.minutes).slice(-2) +
            ":" +
            ("00" + durationObj._data.seconds).slice(-2);
        } else {
          timeStr =
            ("00" + durationObj._data.hours).slice(-2) +
            ":" +
            ("00" + durationObj._data.minutes).slice(-2) +
            ":" +
            ("00" + durationObj._data.seconds).slice(-2);
          //(durationObj._data.hours<=9)?('0'+durationObj._data.hours):durationObj._data.hours + ':' + (durationObj._data.minutes<=9)?('0'+durationObj._data.minutes):durationObj._data.minutes  + ':' + (durationObj._data.seconds<=9)?('0'+durationObj._data.seconds):durationObj._data.seconds;
        }
      }
    }
    return timeStr;
  };

  var emptyArr = [];
  $scope.querySearch = function (val) {
    var query = val.toString().toLowerCase();
    if (query === "*" || query === "") {
      if ($scope.attributesList) {
        return $scope.attributesList;
      } else {
        return emptyArr;
      }
    } else {
      if ($scope.attributesList) {
        var filteredArr = $scope.attributesList.filter(function (item) {
          if (item.Attribute) {
            return item.Attribute.toString().toLowerCase().match(query);
          } else {
            return false;
          }
        });

        return filteredArr;
      } else {
        return emptyArr;
      }
    }
  };

  $scope.Productivitys = { Loading: "Loading" };
  var calculateProductivity = function () {
    $scope.showCallDetails = false;
    if ($scope.onlineProfile) {
      angular.forEach($scope.onlineProfile, function (agent) {
        try {
          if (
            agent &&
            agent.BusinessUnit &&
            (agent.BusinessUnit.toLowerCase() ===
              ShareData.BusinessUnit.toLowerCase() ||
              ShareData.BusinessUnit.toLowerCase() === "all")
          ) {
            var ids = $filter("filter")(
              $scope.productivity,
              { ResourceId: agent.ResourceId.toString() },
              true
            ); //"ResourceId":"1"

            if (ids.length > 0) {
              var agentProductivity = {
                ResourceId: agent.ResourceId,
                ResourceName: agent.ResourceName,
                InboundCallTime: ids[0].InboundCallTime
                  ? ids[0].InboundCallTime
                  : 0,
                IncomingCallCount: ids[0].IncomingCallCount
                  ? ids[0].IncomingCallCount
                  : 0,
                OutgoingCallCount: ids[0].OutgoingCallCount
                  ? ids[0].OutgoingCallCount
                  : 0,
                OutboundCallTime: ids[0].OutboundCallTime
                  ? ids[0].OutboundCallTime
                  : 0,
                OutboundAnswerCount: ids[0].OutboundAnswerCount
                  ? ids[0].OutboundAnswerCount
                  : 0,
                MissCallCount: ids[0].MissCallCount ? ids[0].MissCallCount : 0,
                Chatid: agent.ResourceId,
                AcwTime: ids[0].AcwTime,
                BreakTime: ids[0].BreakTime,
                HoldTime: ids[0].HoldTime,
                TransferCallCount: ids[0].TransferCallCount,
                OnCallTime:
                  (ids[0].OnCallTime ? ids[0].OnCallTime : 0) +
                  (ids[0].OutboundCallTime ? ids[0].OutboundCallTime : 0),
                IdleTime: ids[0].IdleTime,
                StaffedTime: ids[0].StaffedTime,
                slotState: {},
                RemoveProductivity: false,
                data: [
                  {
                    value: ids[0].AcwTime ? ids[0].AcwTime : 0,
                    name: "After work",
                  },
                  {
                    value: ids[0].BreakTime ? ids[0].BreakTime : 0,
                    name: "Break",
                  },
                  {
                    value: ids[0].InboundCallTime ? ids[0].InboundCallTime : 0,
                    name: "Inbound",
                  },
                  {
                    value: ids[0].OutboundCallTime
                      ? ids[0].OutboundCallTime
                      : 0,
                    name: "Outbound",
                  },
                  {
                    value: ids[0].IdleTime ? ids[0].IdleTime : 0,
                    name: "Idle",
                  },
                  {
                    value: ids[0].HoldTime ? ids[0].HoldTime : 0,
                    name: "Hold",
                  },
                ],
              };
              var resonseStatus = null,
                resonseAvailability = null,
                resourceMode = null;
              var reservedDate = "";

              if (agent.ConcurrencyInfo && agent.ConcurrencyInfo.length > 0) {
                agent.ConcurrencyInfo.forEach(function (concurrency) {
                  if (
                    concurrency &&
                    concurrency.HandlingType === "CALL" &&
                    concurrency.SlotInfo &&
                    concurrency.SlotInfo.length > 0
                  ) {
                    // is user state Reason

                    if (agent.Status.Reason && agent.Status.State) {
                      resonseAvailability = agent.Status.State;
                      resonseStatus = agent.Status.Reason;
                      resourceMode = agent.Status.Mode;
                    }

                    if (concurrency.IsRejectCountExceeded) {
                      resonseAvailability = "NotAvailable";
                      resonseStatus = "Suspended";
                    }

                    agentProductivity.slotMode = resourceMode;

                    if (concurrency.SlotInfo[0]) {
                      reservedDate = concurrency.SlotInfo[0].StateChangeTime;
                    }

                    if (
                      resonseAvailability == "NotAvailable" &&
                      (resonseStatus == "Reject Count Exceeded" ||
                        resonseStatus == "Suspended")
                    ) {
                      agentProductivity.slotState = resonseStatus;
                      agentProductivity.other = "Reject";
                    } else if (
                      resonseAvailability == "NotAvailable" &&
                      resonseStatus.toLowerCase().indexOf("break") > -1
                    ) {
                      agentProductivity.slotState = resonseStatus;
                      agentProductivity.other = "Break";
                      reservedDate = agent.Status.StateChangeTime;
                    } else {
                      if (concurrency.SlotInfo[0]) {
                        agentProductivity.slotState =
                          concurrency.SlotInfo[0].State;
                      }
                    }

                    agentProductivity.LastReservedTimeT = moment(
                      reservedDate
                    ).format("DD/MM/YYYY HH:mm:ss");
                    agentProductivity.slotStateTime = TimeFormatter(
                      moment.utc(
                        moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(
                          moment(reservedDate),
                          "seconds"
                        )
                      )
                    );
                    if (reservedDate == "") {
                      agentProductivity.LastReservedTime = null;
                    } else {
                      agentProductivity.LastReservedTime = moment(
                        reservedDate
                      ).format("DD/MM/YYYY HH:mm:ss");
                      agentProductivity.slotStateTime = TimeFormatter(
                        moment.utc(
                          moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(
                            moment(reservedDate),
                            "seconds"
                          )
                        )
                      );
                    }
                  }
                });
              } else {
                resourceMode = agent.Status.Mode;
                resonseAvailability = agent.Status.State;
                resonseStatus = agent.Status.Reason;
                agentProductivity.slotState = "Offline";
                agentProductivity.slotMode = resourceMode;
                agentProductivity.other = "Offline";
                reservedDate = agent.Status.StateChangeTime;
                agentProductivity.LastReservedTimeT = moment(
                  reservedDate
                ).format("DD/MM/YYYY HH:mm:ss");
                agentProductivity.slotStateTime = TimeFormatter(
                  moment.utc(
                    moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(
                      moment(reservedDate),
                      "seconds"
                    )
                  )
                );

                if (
                  resonseAvailability == "NotAvailable" &&
                  resonseStatus.toLowerCase().indexOf("break") > -1
                ) {
                  agentProductivity.slotState = resonseStatus;
                  agentProductivity.other = "Break";
                }
              }

              /* Set Task Info*/
              agentProductivity.taskList = [];
              angular.forEach(agent.ResourceAttributeInfo, function (item) {
                try {
                  var task = {};
                  task.taskType = item.HandlingType;
                  task.percentage = item.Percentage;
                  task.AttributeId = parseInt(item.Attribute);
                  //$filter('filter')(array, expression, comparator, anyPropertyKey)
                  //var filteredData =  $filter('filter')($scope.gridUserData.data,{ Id: userid },true);
                  var data = $filter("filter")(
                    $scope.attributesList,
                    { AttributeId: parseInt(item.Attribute) },
                    true
                  );
                  if (data.length > 0) task.skill = data[0].Attribute;
                  agentProductivity.taskList.push(task);
                } catch (ex) {
                  console.info(ex);
                }
              });
              /* Set Task Info*/

              /* Set ConcurrencyInfo */
              var sessionIds = [];
              angular.forEach(agent.ConcurrencyInfo, function (item) {
                try {
                  var slotInfo = $filter("filter")(item.SlotInfo, {
                    State: "Connected",
                  });
                  if (slotInfo.length > 0) {
                    var sid = slotInfo[0].HandlingRequest;
                    sessionIds.push(sid);
                  }
                } catch (ex) {
                  console.info(ex);
                }
              });

              /*Get Call info base on sid*/
              agentProductivity.callInfos = [];
              angular.forEach($scope.activeCalls, function (item) {
                try {
                  var inboundCalls = $filter("filter")(item, {
                    "Call-Direction": "inbound",
                  });
                  angular.forEach(sessionIds, function (sid) {
                    try {
                      var callInfo = $filter("filter")(inboundCalls, {
                        "Unique-ID": sid,
                      });
                      if (callInfo.length > 0) {
                        agentProductivity.callInfos.push(callInfo[0]);
                        console.info(callInfo);
                        $scope.showCallDetails = true;
                      }
                    } catch (ex) {
                      console.info(ex);
                    }
                  });
                } catch (ex) {
                  console.info(ex);
                }
              });

              /* Set ConcurrencyInfo*/

              agentProductivity.profileName = agent.ResourceName;
              /*check skill filter*/
              if ($scope.selectedSkills.length > 0) {
                var array3 = [];
                var getIntersectionOfArray = function (array1, array2) {
                  angular.forEach(array1, function (value, index) {
                    angular.forEach(array2, function (object, index1) {
                      if (value.AttributeId == object.AttributeId) {
                        array3.push(value);
                      }
                    });
                  });
                };

                if (agentProductivity.taskList.length > 0) {
                  getIntersectionOfArray(
                    $scope.selectedSkills,
                    agentProductivity.taskList
                  );

                  if (angular.equals($scope.selectedSkills, array3)) {
                    $scope.Productivitys[agent.ResourceId] = agentProductivity;
                  }
                  /*angular.forEach(agentProductivity.taskList, function (item) {
                                        var data = $filter('filter')($scope.selectedSkills, {AttributeId: item.AttributeId}, true);
                                        if (data.length > 0) {
                                            $scope.Productivitys[agent.ResourceId] = agentProductivity;
                                        }
                                    })*/
                }
              } else {
                $scope.Productivitys[agent.ResourceId] = agentProductivity;
              }
            }
          }
        } catch (ex) {
          console.error(ex);
          //$scope.isLoading = false;
        }
      });
    } else {
    }
  };

  $scope.productivity = [];
  $scope.productivityData = [];

  $scope.GetProductivity = function () {
    $scope.Productivitys = {};
    var deferred = $q.defer();
    agentStatusService.GetProductivity().then(
      function (response) {
        $scope.productivity = response;
        deferred.resolve(true);
      },
      function (error) {
        $scope.showAlert("Error", "error", "Fail To Get productivity.");
        deferred.resolve(false);
      }
    );
    return deferred.promise;
  };
  $scope.GetProductivity();

  $scope.onlineProfile = [];

  $scope.getProfileDetails = function () {
    $scope.onlineProfile = [];
    var deferred = $q.defer();
    agentStatusService.GetProfileDetails().then(function (response) {
      if (response) {
        $scope.onlineProfile = response;
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    });
    return deferred.promise;
  };
  $scope.stopTimerFn = function (val) {
    $scope.stopTimer = val;
  };
  $scope.agentSummaryLoading = true;
  var getAllRealTime = function () {
    if ($scope.selectedAgent) {
      return;
    }
    $q.all([$scope.getProfileDetails(), $scope.GetProductivity()]).then(
      function (value) {
        $scope.agentSummaryLoading = false;
        calculateProductivity();

        var res = [];
        for (var x in $scope.Productivitys) {
          $scope.Productivitys.hasOwnProperty(x) &&
            res.push($scope.Productivitys[x]);
        }

        $scope.agentSummaryGridOptions.data = res;
      },
      function (reason) {}
    );
  };

  getAllRealTime();

  $scope.setRefreshTime = function (val) {
    $scope.refreshTime = val;
    $interval.cancel($scope.Timer);
    if (val != "stop" && angular.isDefined($scope.Timer)) {
      $scope.Timer = $interval(function () {
        getAllRealTime();
      }, $scope.refreshTime);
    }
  };

  //Initiate the Timer object.
  $scope.Timer = null;

  //Timer start function.
  $scope.StartTimer = function () {
    $scope.Timer = $interval(function () {
      getAllRealTime();
    }, $scope.refreshTime);
  };
  $scope.StartTimer();

  $scope.selectedSkills = [];
  $scope.skillChanged = function () {
    $scope.Productivitys = { Loading: "Loading" };
    $scope.StartTimer();
  };

  $scope.maxHeight = true;
  $scope.updateOVPanel = function () {
    $scope.maxHeight = !$scope.maxHeight;
  };
  $scope.BusinessUnitUsers = [];
  $scope.agentSummaryGridOptions = {
    enableFiltering: true,
    enableColumnResizing: true,
    enableRowSelection: true,
    enableRowHeaderSelection: true,
    multiSelect: false,
    modifierKeysToMultiSelect: false,
    noUnselect: false,
    enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
    columnDefs: [
      {
        name: "Name",
        field: "ResourceName",
        headerTooltip: "Resource Name",
        enableFiltering: true,
        enableCellEdit: false,
        enableSorting: true,
        width: "15%",
        sort: {
          direction: uiGridConstants.ASC,
        },
      },
      {
        name: "State",
        field: "slotState",
        headerTooltip: "Agent State",
        enableFiltering: true,
        enableCellEdit: false,
        enableSorting: true,
        width: "10%",
      },
      {
        name: "Mode",
        field: "slotMode",
        headerTooltip: "Agent Mode",
        enableFiltering: true,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
      },
      {
        name: "State Time",
        field: "slotStateTime",
        headerTooltip: "State Time",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-number",
      },
      {
        name: "Inc.CallCount",
        field: "IncomingCallCount",
        headerTooltip: "Incoming Call Count",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-number",
      },
      {
        name: "Out.CallCount",
        field: "OutgoingCallCount",
        headerTooltip: "Outgoing Call Count",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-number",
      },
      {
        name: "MissCallCount",
        field: "MissCallCount",
        headerTooltip: "MissCall Count",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-number",
      },
      {
        name: "Tran.CallCount",
        field: "TransferCallCount",
        headerTooltip: "Transfer Call Count",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-number",
      },
      {
        name: "AcwTime",
        field: "AcwTime",
        headerTooltip: "Acw Time",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-time",
        cellTemplate:
          "<div>{{row.entity.AcwTime| secondsToDateTime | date:'HH:mm:ss'}}</div>",
      },
      {
        name: "BreakTime",
        field: "BreakTime",
        headerTooltip: "Break Time",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-time",
        cellTemplate:
          "<div>{{row.entity.BreakTime| secondsToDateTime | date:'HH:mm:ss'}}</div>",
      },
      {
        name: "OnCallTime",
        field: "OnCallTime",
        headerTooltip: "OnCall Time",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-time",
        cellTemplate:
          "<div>{{row.entity.OnCallTime| secondsToDateTime | date:'HH:mm:ss'}}</div>",
      },
      {
        name: "HoldTime",
        field: "HoldTime",
        headerTooltip: "Hold Time",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-time",
        cellTemplate:
          "<div>{{row.entity.HoldTime| secondsToDateTime | date:'HH:mm:ss'}}</div>",
      },
      {
        name: "IdleTime",
        field: "IdleTime",
        headerTooltip: "Idle Time",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-time",
        cellTemplate:
          "<div>{{row.entity.IdleTime| secondsToDateTime | date:'HH:mm:ss'}}</div>",
      },
      {
        name: "StaffedTime",
        field: "StaffedTime",
        headerTooltip: "Staffed Time",
        enableFiltering: false,
        enableCellEdit: false,
        enableSorting: true,
        width: "*",
        cellClass: "table-time",
        cellTemplate:
          "<div>{{row.entity.StaffedTime| secondsToDateTime | date:'HH:mm:ss'}}</div>",
      },
    ],
    data: [{ test: "loading" }],
    onRegisterApi: function (gridApi) {
      $scope.grid1Api = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $scope.selectedAgent = undefined;

        if (row.isSelected) {
          $scope.callLogPage = 1;
          $scope.gridCalllogsOptions.data = [];
          $scope.gridCalllogsOptions.data.push({
            callType: "No Data",
            number: "No Data",
            time: "No Data",
          });
          $scope.selectedAgent = row.entity;
          $scope.GetCallLogs(1, row.entity.ResourceName);
          $scope.gridTaskOptions.data = $scope.selectedAgent.taskList;
          $scope.getAgentStatusList($scope.selectedAgent);

          var ids = $filter("filter")(
            $scope.BusinessUnitUsers,
            { resourceid: row.entity.ResourceId.toString() },
            true
          ); //"ResourceId":"1"
          if (ids.length > 0) {
            var temData = ids[0];
            $scope.selectedAgent.displayName =
              temData.firstname + " " + temData.lastname;
            $scope.selectedAgent.avatar = temData.avatar;
            if (temData.email)
              $scope.selectedAgent.Email = temData.email.contact;
          }

          /** Kasun_Wijeratne_19_JAN_2018 */
          /* This method checks the selected row's position and sets the Detsila panel below */
          var count = 0;
          var AInfoPanelSetup = $interval(function () {
            var selectedAgentRowPos = angular
              .element(".ui-grid-row-selected")
              .offset();
            var selectedAgentChartPos = angular
              .element(".agentSummery")
              .offset();

            // var tXpanels = $('.innerdash-t .x_panel');
            // var bXpanels = $('.innerdash-b .x_panel');
            // $.each(tXpanels, function (i, p) {
            // 	if(p.height)
            // })

            if (
              $(".agent-details-overhead") != undefined &&
              selectedAgentRowPos != undefined &&
              selectedAgentChartPos != undefined
            ) {
              var deductval = 0;
              $scope.maxHeight ? (deductval = 184) : (deductval = 82);
              $(".agent-details-overhead").css(
                "top",
                selectedAgentRowPos.top -
                  (selectedAgentChartPos.top - deductval)
              );
              window.scrollTo(0, selectedAgentRowPos.top - 90);
              count += 1;
            }

            if (count == 3) {
              $interval.cancel(AInfoPanelSetup);
              count = 0;
            }
          }, 100);
          /** Kasun_Wijeratne_19_JAN_2018 - END */
        } else {
          $scope.setRefreshTime($scope.refreshTime);
        }
      });
    },
  };

  /** Kasun_Wijeratne_26_JAN_2017 **/
  $scope.closeAgentInfo = function () {
    $scope.selectedAgent.isSelected = false;
    $scope.selectedAgent = undefined;
    $scope.setRefreshTime($scope.refreshTime);
  };
  /** Kasun_Wijeratne_26_JAN_2017 - ENDS**/

  $scope.$on("$destroy", function () {
    if (angular.isDefined($scope.Timer)) {
      $interval.cancel($scope.Timer);
    }

    subscribeServices.unSubscribeDashboard("detaildashboard");
  });

  $scope.reloadCallDetails = function () {
    /*$rootScope.$emit("load_calls");*/
  };

  $scope.selectedAgent = undefined;
  $scope.agentSelected = function (agent) {
    $scope.selectedAgent = agent;
  };

  /*------------------------ Agent Summary ------------------------------------*/

  /*------------------------ Agent info ------------------------------------*/

  $scope.gridTaskOptions = {
    enableSorting: true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    multiSelect: false,
    modifierKeysToMultiSelect: false,
    noUnselect: false,
    columnDefs: [
      { name: "Task Type", field: "taskType", headerTooltip: "Task Type" },
      { name: "Skill", field: "skill", headerTooltip: "Skill" },
      {
        name: "Percentage",
        field: "percentage",
        headerTooltip: "Percentage",
        cellClass: "presentage",
        sort: {
          direction: uiGridConstants.DESC,
        },
      },
    ],
    data: [],
    onRegisterApi: function (gridApi) {
      //$scope.grid1Api = gridApi;
    },
  };

  $scope.callLogPage = 0;
  $scope.gridCalllogsOptions = {
    enableSorting: true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    multiSelect: false,
    modifierKeysToMultiSelect: false,
    noUnselect: false,
    columnDefs: [
      { name: "callType", field: "callType", headerTooltip: "Call Type" },
      {
        name: "number",
        field: "number",
        headerTooltip: "Number",
        cellClass: "table-number",
      },
      {
        name: "time",
        field: "time",
        headerTooltip: "Time",
        cellClass: "table-number",
      },
    ],
    data: [
      {
        callType: "Loading",
        number: "Loading",
        time: "Loading",
      },
    ],
    onRegisterApi: function (gridApi) {
      /*gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {

             });*/
      gridApi.core.on.scrollEnd($scope, function (row) {
        if (row.y.percentage > 0) {
          $scope.callLogPage = $scope.callLogPage + 1;
          $scope.GetCallLogs(
            $scope.callLogPage,
            $scope.selectedAgent.ResourceName
          );
        }
      });
    },
  };

  $scope.callLog = [];
  $scope.agentProductivityLoadin = true;
  $scope.GetCallLogs = function (pageNumber, name) {
    contactService
      .GetCallLogs(pageNumber, new Date(), name)
      .then(function (response) {
        if (response && response.length != 0) {
          response.map(function (item) {
            if (item) {
              $scope.gridCalllogsOptions.data.push(item.data);
            }
          });
        }
        if (pageNumber === 1) $scope.gridCalllogsOptions.data.splice(0, 1);
      });
  };

  /*Productivity Chart Config*/
  var theme = {
    color: [
      "#db4114",
      "#f8b01d",
      "#2ba89c",
      "#114858",
      "#9B59B6",
      "#8abb6f",
      "#759c6a",
      "#bfd3b7",
    ],
    title: {
      itemGap: 8,
      textStyle: {
        color: "#408829",
        fontFamily: "Roboto",
        fontWeight: 300,
      },
    },

    dataRange: {
      color: ["#1f610a", "#97b58d"],
    },

    toolbox: {
      color: ["#408829", "#408829", "#408829", "#408829"],
    },

    tooltip: {
      backgroundColor: "rgba(0,0,0,0.5)",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "#408829",
          type: "dashed",
        },
        crossStyle: {
          color: "#408829",
        },
        shadowStyle: {
          color: "rgba(200,200,200,0.3)",
        },
      },
    },

    dataZoom: {
      dataBackgroundColor: "#eee",
      fillerColor: "rgba(64,136,41,0.2)",
      handleColor: "#408829",
    },
    grid: {
      borderWidth: 0,
    },

    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: "#408829",
        },
      },
      splitLine: {
        lineStyle: {
          color: ["#eee"],
        },
      },
    },

    valueAxis: {
      axisLine: {
        lineStyle: {
          color: "#408829",
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ["rgba(250,250,250,0.1)", "rgba(200,200,200,0.1)"],
        },
      },
      splitLine: {
        lineStyle: {
          color: ["#eee"],
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#408829",
      },
      controlStyle: {
        normal: { color: "#408829" },
        emphasis: { color: "#408829" },
      },
    },

    k: {
      itemStyle: {
        normal: {
          color: "#68a54a",
          color0: "#a9cba2",
          lineStyle: {
            width: 1,
            color: "#408829",
            color0: "#86b379",
          },
        },
      },
    },
    map: {
      itemStyle: {
        normal: {
          areaStyle: {
            color: "#ddd",
          },
          label: {
            textStyle: {
              color: "#c12e34",
            },
          },
        },
        emphasis: {
          areaStyle: {
            color: "#99d2dd",
          },
          label: {
            textStyle: {
              color: "#c12e34",
            },
          },
        },
      },
    },
    force: {
      itemStyle: {
        normal: {
          linkStyle: {
            strokeColor: "#408829",
          },
        },
      },
    },
    chord: {
      padding: 4,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 1,
            color: "rgba(128, 128, 128, 0.5)",
          },
          chordStyle: {
            lineStyle: {
              width: 1,
              color: "rgba(128, 128, 128, 0.5)",
            },
          },
        },
        emphasis: {
          lineStyle: {
            width: 1,
            color: "rgba(128, 128, 128, 0.5)",
          },
          chordStyle: {
            lineStyle: {
              width: 1,
              color: "rgba(128, 128, 128, 0.5)",
            },
          },
        },
      },
    },
    gauge: {
      startAngle: 225,
      endAngle: -45,
      axisLine: {
        show: true,
        lineStyle: {
          color: [
            [0.2, "#86b379"],
            [0.8, "#68a54a"],
            [1, "#408829"],
          ],
          width: 8,
        },
      },
      axisTick: {
        splitNumber: 10,
        length: 12,
        lineStyle: {
          color: "auto",
        },
      },
      axisLabel: {
        textStyle: {
          color: "auto",
        },
      },
      splitLine: {
        length: 18,
        lineStyle: {
          color: "auto",
        },
      },
      pointer: {
        length: "90%",
        color: "auto",
      },
      title: {
        textStyle: {
          color: "#333",
        },
      },
      detail: {
        textStyle: {
          color: "auto",
        },
      },
    },
    textStyle: {
      fontFamily: "Arial, Verdana, sans-serif",
    },
  };

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
    myObject[productivity.Chatid] = echarts.init(
      document.getElementById("productivityId"),
      theme
    );
    myObject[productivity.Chatid].setOption({
      title: {
        show: true,
        text: productivity.ResourceName,
        textStyle: {
          fontSize: 18,
          fontWeight: "bolder",
          color: "#333",
          fontFamily: "Ubuntu-Regular",
        },
      },
      tooltip: {
        trigger: "item",
        //formatter: "{a} <br/>{b} : {c} ({d}%)",
        formatter: function (params, ticket, callback) {
          var res =
            params.seriesName +
            " <br/>" +
            params.name +
            " " +
            secondsToTime(params.value) +
            " " +
            params.percent +
            "%";
          setTimeout(function () {
            callback(ticket, res);
          }, 100);
          return "loading";
        },
      },
      calculable: true,
      legend: {
        x: "center",
        y: "bottom",
        data: ["After work", "Break", "Inbound", "Outbound", "Idle", "Hold"],
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          //dataView : {show: true, readOnly: false},
          magicType: {
            show: true,
            type: ["pie", "funnel"],
            option: {
              funnel: {
                x: "10%",
                width: "50%",
                funnelAlign: "center",
                max: 1548,
              },
            },
          },
          restore: {
            show: false,
            title: "Restore",
          },
          saveAsImage: {
            show: true,
            title: "Save As Image",
          },
        },
      },
      series: [
        {
          name: "Productivity",
          type: "pie",
          radius: ["35%", "55%"],
          itemStyle: {
            normal: {
              label: {
                show: true,
              },
              labelLine: {
                show: true,
              },
            },
            emphasis: {
              label: {
                show: true,
                position: "center",
                textStyle: {
                  fontSize: "14",
                  fontWeight: "normal",
                },
              },
            },
          },
          data: productivity.data,
        },
      ],
    });
  };

  /*------------------------ Agent info ------------------------------------*/

  /*------------------------ getAgentStatusList ------------------------------------*/
  $scope.endDtTm = moment();
  $scope.getAgentStatusList = function (selectedAgent, element) {
    var tempthis = this;
    $scope.agentProductivityLoadin = true;
    var momentTz = moment.parseZone(new Date()).format("Z");
    momentTz = momentTz.replace("+", "%2B");
    var d = moment().format("YYYY-MM-DD");
    var startDate = d + " 00:00:00" + momentTz;
    var endDate = d + " 23:59:59" + momentTz;
    $scope.endDtTm = endDate;
    var agentFilter = [];
    agentFilter.push(selectedAgent);
    try {
      cdrApiHandler
        .getAgentStatusRecords(startDate, endDate, [], agentFilter)
        .then(function (agentListResp) {
          $scope.agentProductivityLoadin = false;
          $scope.echartDonutSetOption(selectedAgent);
          /*$scope.agentStatusList = {};var caption = "";
                 if (agentListResp && agentListResp.Result) {
                 for (var resource in agentListResp.Result) {
                 if (agentListResp.Result[resource] && agentListResp.Result[resource].length > 0 && agentListResp.Result[resource][0].ResResource && agentListResp.Result[resource][0].ResResource.ResourceName) {
                 caption = agentListResp.Result[resource][0].ResResource.ResourceName;
                 $scope.agentStatusList[caption] = agentListResp.Result[resource];
                 }
                 }
                 gearaltGanttChartData($scope.agentStatusList[caption]);
                 }*/

          gearaltGanttChartData(
            agentListResp.Result[Object.keys(agentListResp.Result)[0]],
            element
          );
        })
        .catch(function (err) {
          $scope.showAlert(
            "Error",
            "error",
            "Error occurred while loading agent status events"
          );
        });
    } catch (ex) {
      $scope.showAlert(
        "Error",
        "error",
        "Error occurred while loading agent status events"
      );
    }
  };

  /*configuring Gantt Chart*/
  $scope.statusData = [];

  $scope.ganttChartOptions = {
    mode: "custom",
    scale: "minute",
    sortMode: undefined,
    sideMode: "Table",
    columns: ["model.name", "from", "to"],
    treeTableColumns: ["from", "to"],
    columnsHeaders: { "model.name": "Name", from: "From", to: "To" },
    columnsClasses: {
      "model.name": "gantt-column-name",
      from: "gantt-column-from",
      to: "gantt-column-to",
    },
    columnsFormatters: {
      from: function (from) {
        /*return from !== undefined ? moment(from).format("HH:mm:ss") : undefined*/
        return from !== undefined ? moment(from).format("HH:mm:ss") : undefined;
      },
      to: function (to) {
        return to !== undefined ? moment(to).format("HH:mm:ss") : undefined;
      },
    },
    columnsHeaderContents: {
      "model.name": '<i class="fa fa-align-justify"></i> {{getHeader()}}',
      from: '<i class="fa fa-calendar"></i> {{getHeader()}}',
      to: '<i class="fa fa-calendar"></i> {{getHeader()}}',
    },
  };

  var gearaltGanttChartData = function (events, element) {
    $scope.statusData = [];
    if (events) {
      var eventLength = events.length;

      while (eventLength > 0) {
        var event = events[0];
        try {
          var stEventName = event.Reason;
          var endEventName = "";
          var statusColour = "#F1C232";
          var isACW = false;
          var isCALL = false;
          var isCHAT = false;
          var isSlotEndEvent = false;

          if (event.Reason == "Register") {
            endEventName = "Un" + stEventName;
            statusColour = "#0CFF00";
          } else if (
            event.Reason != "EndBreak" &&
            event.Reason.indexOf("Break") >= 0
          ) {
            endEventName = "EndBreak";
            statusColour = "#7b1102";
          } else if (event.Reason == "AfterWork") {
            if (event.Status == "Completed") {
              isACW = true;
              statusColour = "#000000";
            } else {
              isSlotEndEvent = true;
            }
          } else if (event.Reason == "CALL") {
            if (event.Status == "Connected") {
              isCALL = true;
              statusColour = "#7c7eff";
            } else {
              isSlotEndEvent = true;
            }
          } else if (event.Reason == "CHAT") {
            if (event.Status == "Connected") {
              isCHAT = true;
              statusColour = "#ff574d";
            } else {
              isSlotEndEvent = true;
            }
          } else {
            endEventName = "end" + stEventName;
          }

          if (stEventName == "Inbound") {
            statusColour = "#074DEE";
          }
          if (stEventName == "Outbound") {
            statusColour = "#DF0AF1";
          }
          if (stEventName == "Offline") {
            statusColour = "#F90422";
          }

          var index = -1;
          var itemName;

          if (isACW) {
            index = events
              .map(function (el) {
                return el.Status;
              })
              .indexOf("Available");
          } else if (isCALL) {
            index = events
              .map(function (el) {
                return el.Status;
              })
              .indexOf("Completed");
          } else if (isCHAT) {
            index = events
              .map(function (el) {
                return el.Status;
              })
              .indexOf("Completed");
          } else {
            if (!isSlotEndEvent) {
              index = events
                .map(function (el) {
                  return el.Reason;
                })
                .indexOf(endEventName);
            }
          }

          if (index >= 0) {
            var eventObj = {
              name: stEventName,
              tasks: [
                {
                  name: stEventName,
                  color: statusColour,
                  /*from: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                                     to:  moment(events[index].createdAt).format("YYYY-MM-DD HH:mm:ss")*/
                  from: moment(event.createdAt),
                  to: moment(events[index].createdAt),
                },
              ],
            };

            events.splice(index, 1);
            events.splice(events.indexOf(event), 1);

            $scope.statusData.push(eventObj);
          } else {
            if (moment($scope.endtime).diff(moment()) >= 0) {
              $scope.endtime = moment();
            }

            if (stEventName == "Register") {
              var eventObj = {
                name: stEventName,
                tasks: [
                  {
                    name: stEventName,
                    color: statusColour,
                    from: moment(event.createdAt),
                    to: moment($scope.endtime),
                  },
                ],
              };
              $scope.statusData.push(eventObj);
            } else if (
              stEventName.indexOf("end") == -1 &&
              stEventName != "UnRegister"
            ) {
              if (!isSlotEndEvent) {
                var eventObj = {
                  name: stEventName,
                  tasks: [
                    {
                      name: stEventName,
                      color: statusColour,
                      from: moment(event.createdAt),
                      to: moment($scope.endtime),
                    },
                  ],
                };
                $scope.statusData.push(eventObj);
              }
            }

            events.splice(events.indexOf(event), 1);
          }
        } catch (e) {
          console.log(e);
        }
        eventLength = events.length;
      }
    }
  };

  /*configuring Gantt Chart - end*/
  /*------------------------ getAgentStatusList ------------------------------------*/

  /*send notification*/
  $scope.notificationMsg = {
    To: "",
    From: "",
    Message: "",
    isPersist: true,
    eventlevel: "low",
    Direction: "STATELESS",
  };

  $scope.sendNotification = function () {
    $scope.notificationMsg.To = $scope.selectedAgent.ResourceName;
    $scope.notificationMsg.From = $scope.userName;
    notifiSenderService
      .sendNotification(
        $scope.notificationMsg,
        "message",
        "",
        $scope.notificationMsg.eventlevel
      )
      .then(
        function (response) {
          $scope.notificationMsg = {
            To: "",
            From: "",
            Message: "",
            isPersist: true,
            eventlevel: "low",
            Direction: "STATELESS",
          };
        },
        function (err) {
          $scope.showAlert("Notification", "error", "Send Notification Failed");
        }
      );
  };

  $scope.forcedLogff = function (selectedAgent) {
    var authToken = authService.GetToken();
    var decodeData = jwtHelper.decodeToken(authToken);
    // console.log("selectedAgent : " + JSON.stringify(selectedAgent) + ' :: ' + JSON.stringify(decodeData));
    var tenant = decodeData.tenant;
    var company = decodeData.company;

    authService.ForcedLogoff({
      username: selectedAgent.profileName,
      console: 'AGENT_CONSOLE',
      tenant: tenant,
      orgId: company
    }, function (issuccess) {
      if (issuccess) {
        $scope.showAlert("Forced Logoff", "success", 'Forced Logoff of ' + selectedAgent.profileName + ' Success');
        $scope.closeAgentInfo();
      } else {
        $scope.showAlert("Forced Logoff", "error", 'Forced Logoff of ' + selectedAgent.profileName + ' Failed');
      }
    });
  };

    $scope.selecctedActiveLoginType = 'SUPERVISOR_CONSOLE';
    $scope.activeLogins = [];
    $scope.onClickLoadActiveLogins = function (consoleType) {
        $scope.selecctedActiveLoginType = consoleType;
        var authToken = authService.GetToken();
        var decodeData = jwtHelper.decodeToken(authToken);
        var tenant = decodeData.tenant;
        var company = decodeData.company;
        authService.ListActiveLogins({
            console: $scope.selecctedActiveLoginType,
            tenant: tenant,
            orgId: company
        }, function (res) {
            if (res.IsSuccess) {
                console.log("ListActiveLogins data : " + JSON.stringify(res));
                $scope.activeLogins = [];
                var data = JSON.parse(res.CustomMessage);
                for (var property in data) {
                    var userData = JSON.parse(data[property]);
                    var timestamp = userData["time"];
                    var newDate = new Date();
                    newDate.setTime(timestamp);
                    $scope.activeLogins.push({
                        'id': property,
                        'username': userData["username"],
                        'time': newDate.toLocaleString()
                    });
                }
                console.log("ListActiveLogins data : " + JSON.stringify($scope.activeLogins));
            }
        });
    };
    $scope.activeLogins = $scope.onClickLoadActiveLogins($scope.selecctedActiveLoginType);

    // Force logoff for users of all console type
    $scope.forcedLogffForAllConsoles = function (userId, userName, console) {
        var authToken = authService.GetToken();
        var decodeData = jwtHelper.decodeToken(authToken);
        // console.log("selectedAgent : " + JSON.stringify(selectedAgent) + ' :: ' + JSON.stringify(decodeData));
        var tenant = decodeData.tenant;
        var company = decodeData.company;

        authService.ForcedLogoffById({
            userId: userId,
            username: userName,
            console: console,
            tenant: tenant,
            orgId: company
        }, function (issuccess) {
            if (issuccess) {
                $scope.showAlert("Forced Logoff", "success", 'Forced Logoff of ' + userName + ' Success');
                $scope.onClickLoadActiveLogins($scope.selecctedActiveLoginType);  // Reload data list
            } else {
                $scope.showAlert("Forced Logoff", "error", 'Forced Logoff of ' + userName + ' Failed');
            }
        });
    };


  var GetUserByBusinessUnit = function () {
    ShareData.getUserCountByBusinessUnit().then(
      function (row_count) {
        var pagesize = 20;
        var pagecount = Math.ceil(row_count / pagesize);

        var method_list = [];

        for (var i = 1; i <= pagecount; i++) {
          method_list.push(ShareData.getUserByBusinessUnit(pagesize, i));
        }

        $q.all(method_list)
          .then(function (resolveData) {
            if (resolveData) {
              $scope.BusinessUnitUsers = resolveData;
            }
          })
          .catch(function (err) {
            $scope.showAlert(
              "Agent List",
              "error",
              "Failed to load agent list"
            );
          });
      },
      function (err) {
        $scope.showAlert("Agent List", "error", "Failed to load agent list");
      }
    );

    /*ShareData.GetUserByBusinessUnit().then(function (respond) {
            $scope.BusinessUnitUsers = respond;
        }, function (error) {

        });*/
  };
  GetUserByBusinessUnit();
  $scope.statusData = [];
  /*Listing For Business Unit Change*/
  $scope.$watch(
    function () {
      return ShareData.BusinessUnit;
    },
    function (newValue, oldValue) {
      if (
        newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()
      ) {
        $scope.selectedAgent = null;
        $scope.GetAllQueueStatistics();
        getAllRealTime();
        GetUserByBusinessUnit();
        console.log(
          "Reload Dashboard ****************************************"
        );
      }
    }
  );
});
