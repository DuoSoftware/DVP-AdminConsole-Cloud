/**
 * Created by Rajinda on 5/28/2016.
 */

'use strict';

mainApp.factory("dashboardService", function ($http, baseUrls, authService,ShareData) {

    var getAllCalls = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/Calls/"+businessUnit+"/5"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {
                return {};
            }
        });
    };
    var getAllQueued = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/Queued/"+businessUnit+"/5"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });
    };
    var getAllBriged = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/Bridge/"+businessUnit+"/5"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {
                return {};
            }
        });
    };
    var getAllChannels = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/Channels/"+businessUnit+"/5"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });
    };


    var getTotalCalls = function (param1, param2) {

        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        var tempParam1 = '*';

        if (param1) {
            tempParam1 = param1;
        }

        var tempParam2 = '*';

        if (param2) {
            tempParam2 = param2;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/CALLS/" + tempParam1 + "/" + tempParam2
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

    };

    var getNewTicketCountViaChenal = function (chenal) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/NEWTICKET/via_" + chenal + "/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

    };

    var getTotalQueued = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/QUEUE/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };
    var getTotalQueueHit = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/AllConcurrentQueued/"+businessUnit+"/5"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });
    };
    var getTotalQueueAnswered = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/QUEUEANSWERED/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getTotalQueueDropped = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/QUEUEDROPPED/*/*"

        }).then(function (response) {
            if (response.data) {


                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }


            } else {

                return 0;
            }

        });


    };

    var getCurrentWaiting = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/CurrentCount/"+businessUnit+"/QUEUE/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });
    };

    var getTotalBriged = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/BRIDGE/*/*"
        }).then(function (response) {
            if (response.data) {


                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }


            } else {

                return 0;
            }

        });


    };

    var getCurrentBridgedCalls = function (param) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/CurrentCount/"+businessUnit+"/BRIDGE/*/" + param
        }).then(function (response) {
            if (response.data) {


                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }


            } else {

                return 0;
            }

        });


    };

    var getTotalOnGoing = function (callDirection) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        var url = baseUrls.monitorrestapi + "Calls/Count";

        if (callDirection) {
            url = url + '?direction=' + callDirection;
        }
        return $http({
            method: 'GET',
            url: url
        }).then(function (response) {
            if (response.data && response.data.IsSuccess && response.data.Result
                && response.data.Result.length > 0) {
                return response.data.Result;
            } else {
                return [];
            }

        });


    };

    var getProfileDetails = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.ardsmonitoringBaseUrl + "MONITORING/resources"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }

        });


    };


    var getCompanyTasks = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "Tasks"
        }).then(function (response) {
            if (response.data) {
                return response.data;
            } else {
                return 0;
            }
        });


    };


    /*ticket*/
    var getTicketCount = function (status) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/CurrentCount/"+businessUnit+"/" + status + "/total/total"
        }).then(function (response) {
            if (response.status === 200) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

    };

    var getTotalTicketCount = function (status) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/" + status + "/total/total"
        }).then(function (response) {
            if (response.status === 200) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

    };

    var getTotalTicketAvg = function (status) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/AverageTime/"+businessUnit+"/" + status + "/total/total"
        }).then(function (response) {
            if (response.status === 200) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

    };

    /*var getTotalTicketCount = function (status) {
     return $http({
     method: 'GET',
     url: baseUrls.dashBordUrl+"DashboardEvent/TotalCount/SLAVIOLATED/total/total",
     headers: {
     'authorization': authService.GetToken()
     }
     }).then(function (response) {
     if (response.status===200) {
     return response.data;
     } else {
     return 0;
     }
     });

     };

     var getTotalTicketCount = function (status) {
     return $http({
     method: 'GET',
     url: baseUrls.dashBordUrl+"DashboardEvent/TotalCount/FIRSTCALLRESOLUTION/total/total",
     headers: {
     'authorization': authService.GetToken()
     }
     }).then(function (response) {
     if (response.status===200) {
     return response.data;
     } else {
     return 0;
     }
     });

     };*/

    var getCreatedTicketSeries = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/NewTicket/"+businessUnit+"/30"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });

    };


    var getResolvedTicketSeries = function (status) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/ClosedTicket/"+businessUnit+"/30"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result &&response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });

    };

    var getDeferenceResolvedTicketSeries = function (status) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/ClosedVsOpenTicket/"+businessUnit+"/30"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result &&response.data.Result[0]&& response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });

    };

    /*ticket*/

    //-----Call Center Performance------------

    var getTotalTalkTimeInbound = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalTime/"+businessUnit+"/CONNECTED/*/CALLinbound"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getTotalTalkTimeOutbound = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalTime/"+businessUnit+"/CONNECTED/*/CALLoutbound"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getTotalBreakTime = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalTime/"+businessUnit+"/BREAK/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getTotalHoldTime = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalTime/"+businessUnit+"/AGENTHOLD/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getTotalStaffTime = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalTimeWithCurrentSessions/"+businessUnit+"/LOGIN/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getTotalAcwTime = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalTime/"+businessUnit+"/AFTERWORK/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getAverageStaffTime = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/AverageTimePerKeyWithCurrentSessions/"+businessUnit+"/LOGIN/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getAverageAcwTime = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/AverageTime/"+businessUnit+"/AFTERWORK/*/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getAverageInboundCallsPerAgent = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/AverageCountPerKey/"+businessUnit+"/count/CONNECTED/*/CALLinbound/key/CONNECTED/*/CALLinbound"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getAverageOutboundCallsPerAgent = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/AverageCountPerKey/"+businessUnit+"/count/CALLS/outbound/*/key/CONNECTED/*/CALLoutbound"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };

    var getCallCenterPerformanceHistory = function (startDate, endDate, requestType) {

        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.ardsmonitoringBaseUrl + "MONITORING/callCenter/from/" + startDate + "/to/" + endDate + "?reqType=" + requestType,
            params: {
                businessUnit:businessUnit
            }
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        });


    };

    var getTotalLoginAgentCount = function () {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/CountPerKey/"+businessUnit+"/LOGIN/*/Register"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });


    };
    var getQueueRecordDetails = function (qID) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "/QueueSetting/" + qID
        }).then(function (response) {
            return response
        });


    };

    var productivityByResourceId = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + id + "/Productivity"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };


    var getTotalCampaignCount = function (window_name,cam_id,param2) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }


        var cam = '*';
        if(cam_id){
            cam = cam_id;
        }
        var para = '*';
        if(param2){
            para = param2;
        }
        var url = baseUrls.dashBordUrl + "DashboardEvent/TotalCount/"+businessUnit+"/"+window_name+"/"+cam+"/"+para;

        return $http({
            method: 'GET',
            url: url

        }).then(function (response) {
            if (response.data) {


                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }


            } else {

                return 0;
            }

        });


    };

    var getCurrentCampaignCount = function (window_name,cam_id,param2) {
        var businessUnit = "*";
        if (ShareData.BusinessUnit.toLowerCase() != "all") {
            businessUnit = ShareData.BusinessUnit;
        }

        var cam = '*';
        if(cam_id){
            cam = cam_id;
        }
        var para = '*';
        if(param2){
            para = param2;
        }
        var url = baseUrls.dashBordUrl + "DashboardEvent/CurrentCount/"+businessUnit+"/"+window_name+"/"+cam+"/"+para;


        return $http({
            method: 'GET',
            url: url
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });
    };
    return {

        GetAll: getAllCalls,
        GetAllQueued: getAllQueued,
        GetAllBriged: getAllBriged,
        GetAllChannels: getAllChannels,
        GetTotalCalls: getTotalCalls,
        GetTotalQueued: getTotalQueued,
        GetTotalQueueHit: getTotalQueueHit,
        GetTotalQueueAnswered: getTotalQueueAnswered,
        GetTotalQueueDropped: getTotalQueueDropped,
        GetCurrentWaiting: getCurrentWaiting,
        GetTotalBriged: getTotalBriged,
        GetTotalOnGoing: getTotalOnGoing,
        GetProfileDetails: getProfileDetails,
        getCompanyTasks: getCompanyTasks,
        GetTicketCount: getTicketCount,
        GetCreatedTicketSeries: getCreatedTicketSeries,
        GetResolvedTicketSeries: getResolvedTicketSeries,
        GetDeferenceResolvedTicketSeries: getDeferenceResolvedTicketSeries,
        GetTotalTicketCount: getTotalTicketCount,
        GetTotalTicketAvg: getTotalTicketAvg,
        GetNewTicketCountViaChannel: getNewTicketCountViaChenal,
        GetTotalTalkTimeInbound: getTotalTalkTimeInbound,
        GetTotalTalkTimeOutbound: getTotalTalkTimeOutbound,
        GetTotalStaffTime: getTotalStaffTime,
        GetTotalAcwTime: getTotalAcwTime,
        GetAverageStaffTime: getAverageStaffTime,
        GetAverageAcwTime: getAverageAcwTime,
        GetAverageInboundCallsPerAgent: getAverageInboundCallsPerAgent,
        GetAverageOutboundCallsPerAgent: getAverageOutboundCallsPerAgent,
        GetCallCenterPerformanceHistory: getCallCenterPerformanceHistory,
        GetTotalLoginAgentCount: getTotalLoginAgentCount,
        getCurrentBridgedCalls: getCurrentBridgedCalls,
        GetTotalBreakTime: getTotalBreakTime,
        GetTotalHoldTime: getTotalHoldTime,
        getQueueRecordDetails: getQueueRecordDetails,
        ProductivityByResourceId:productivityByResourceId,
        GetTotalCampaignCount:getTotalCampaignCount,
        getCurrentCampaignCount:getCurrentCampaignCount
    }
});
