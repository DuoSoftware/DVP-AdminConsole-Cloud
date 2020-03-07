/**
 * Created by Rajinda on 12/31/2015.
 */
'use strict';
mainApp.factory("campaignService", function ($http, $log, $filter,  templateMakerBackendService, baseUrls) {

    var createCampaign = function (campaign) {

        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign",
            data: campaign
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };

    var getCampaign = function (campaignId) {

        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/"+campaignId
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return null;
            }
        });
    };

    var getCampaigns = function () {

        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaigns/0"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {

                return response.data.Result;


            } else {

                return [];
            }

        });
    };

    var getExtensions = function () {

        return $http({
            method: 'GET',
            url: baseUrls.sipUserendpoint +"SipUser/"  + "ExtensionsByCategory/CAMPAIGN"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {

                return response.data.Result;


            } else {

                return [];
            }

        });

    };

    var updateCampaign = function (id, campaign) {
        return $http({
            method: 'PUT',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + id,
            data: campaign
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
        });
    };

    var deleteCampaign = function (id) {
        return $http({
            method: 'DELETE',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + id
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }

        });
    };

    var deleteSchedule = function (campaignId, id) {
        return $http({
            method: 'DELETE',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Schedule/" + id
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }

        });
    };

    var getReasons = function () {

        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/Configuration/callback/Reasons"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var updateCallBack = function (id, callback) {

        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/Configuration/" + id + "/Callback",
            data: callback
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
        });

    };

    var createCampaignConfig = function (id, config) {
        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + id + "/Configuration",
            data: config
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var updateCampaignConfig = function (id, configId, config) {
        return $http({
            method: 'PUT',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + id + "/Configuration/" + configId,
            data: config
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getCampaignConfig = function (id) {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + id + "/Configurations"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {

                return response.data.Result;


            } else {

                return undefined;
            }

        });
    };

    var getCampaignById = function (id) {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + id
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {

                return response.data.Result;


            } else {

                return undefined;
            }

        });
    };


    var getCallBacks = function (id) {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/Configuration/" + id + "/Callbacks"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var setCallBack = function (id, callback) {
        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/Configuration/" + id + "/Callback",
            data: callback
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {

                return response.data.Result;


            } else {

                return undefined;
            }

        });
    };

    var deleteCallBack = function (cbId) {
        return $http({
            method: 'DELETE',
            url: baseUrls.campaignmanagerUrl + "Campaign/Configuration/Callback/" + cbId
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
        });
    };

    var getCategorys = function () {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "CampaignCategorys"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };


    var mapNumberToCampaign = function (campaignId, categoryId) {
        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Category/" + categoryId + "/map"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
        });
    };

    var mapScheduleToCampaign = function (campaignId, camScheduleId) {
        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Schedule/" + camScheduleId + "/map"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
        });
    };

    var mapNumberAndScheduleToCampaign = function (campaignId, categoryId, camScheduleId, scheduleName) {
        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Category/" + categoryId + "/Schedule/" + camScheduleId + "/map",
            data: {ScheduleName: scheduleName}
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
        });
    };

    var addScheduleToCampaign = function (campaignId, data) {
        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Schedule",
            data: data
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
        });
    };

    var getScheduleCampaign = function (campaignId) {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Schedule"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getAssignableScheduleCampaign = function (campaignId) {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Schedule/Assignable"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getOngoingCampaign = function () {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaigns/Operations/State/Ongoing"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var sendCommandToCampaign = function (campaignId, command) {
        return $http({
            method: 'PUT',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Operations/" + command
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });
    };

    var getCampaignByState = function (state) {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaigns/State/" + state + "/100"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var startCampaign = function (campaignId) {
        return $http({
            method: 'put',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/State/start"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getTotalConnectedCount = function (campaignId) {
        return $http({
            method: 'get',
            url: baseUrls.dialerAPIUrl + "GetTotalConnectedCount/0/0/" + campaignId
        }).then(function (response) {
            if (response.status == 200) {
                return response.data;
            } else {
                return 0;
            }
        });
    };

    var flushNumbers = function(campaignId){
        return $http({
            method: 'delete',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/RemoveNumbers"
        }).then(function (response) {
            if (response.status == 200) {
                return response.data;
            } else {
                return 0;
            }
        });

    }

    var getTotalDialCount = function (campaignId) {
        return $http({
            method: 'get',
            url: baseUrls.dialerAPIUrl + "GetTotalDialCount/0/0/" + campaignId
        }).then(function (response) {
            if (response.status == 200) {
                return response.data;
            } else {
                return 0;
            }
        });
    };

    var getAssignedCategory = function (campaignId) {
        return $http({
            method: 'get',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/NumberCategory"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getCampaignSummery = function (pageNo, rowCount, status) {

        var postData = [];
        /*postData['startDateTime'] = startTime;
         postData['endDateTime'] = endTime;*/
        postData['pageNo'] = pageNo;
        postData['rowCount'] = rowCount;

        postData['Status'] = status;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/summery",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var campaignSummeryReportCount = function (status) {
        var postData = [];
        postData['Status'] = status;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/summery/count",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var campaignDispositionReportCount = function (dispositionInfo) {
        var postData = [];
        postData['CampaignId'] = dispositionInfo.campaign.CampaignId;
        postData['TryCount'] = dispositionInfo.tryCount;
        postData['DialerStatus'] = dispositionInfo.dialerState;
        postData['Reason'] = dispositionInfo.callBackReason;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/disposition/count",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var campaignDispositionReport = function (pageNo, rowCount, dispositionInfo) {
        var postData = [];
        postData['pageNo'] = pageNo;
        postData['rowCount'] = rowCount;
        postData['CampaignId'] = dispositionInfo.campaign.CampaignId;
        postData['TryCount'] = dispositionInfo.tryCount;
        postData['DialerStatus'] = dispositionInfo.dialerState;
        postData['Reason'] = dispositionInfo.callBackReason;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/disposition",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var campaignCallbackReportCount = function (campaignId) {
        var postData = [];
        postData['CampaignId'] = campaignId;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/Callback/count",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var campaignCallbackReport = function (pageNo, rowCount, campaignId) {
        var postData = [];
        postData['pageNo'] = pageNo;
        postData['rowCount'] = rowCount;
        postData['CampaignId'] = campaignId;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/Callback",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getAllCallBackReasons = function () {

        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/Configuration/callback/Reasons"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var campaignAttemptReportCount = function (campaignId, filterInfo) {
        var postData = [];
        postData['CampaignId'] = campaignId;
        postData['DialNumber'] = filterInfo.dialNumber;
        postData['answeredCount'] = filterInfo.answeredCount;
        postData['tryCount'] = filterInfo.tryCount;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/Attempt/count",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var campaignAttemptReport = function (pageNo, rowCount, campaignId, filterInfo) {
        var postData = [];
        postData['pageNo'] = pageNo;
        postData['rowCount'] = rowCount;
        postData['CampaignId'] = campaignId;
        postData['DialNumber'] = filterInfo.dialNumber;
        postData['answeredCount'] = filterInfo.answeredCount;
        postData['tryCount'] = filterInfo.tryCount;
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Report/Attempt",
            params: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var createCampaignAdditionalData = function (campaignId, additionalData) {
        return $http({
            method: 'POST',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/AdditionalData",
            data: additionalData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var updateCampaignAdditionalData = function (campaignId, additionalData) {
        return $http({
            method: 'PUT',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/AdditionalData/" + additionalData.AdditionalDataId,
            data: additionalData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getCampaignAdditionalData = function (campaignId) {
        return $http({
            method: 'GET',
            url: baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/AdditionalData"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var deleteAdditionalDataByID = function (additionalDataId) {
        return $http({
            method: 'DELETE',
            url: baseUrls.campaignmanagerUrl + "Campaign/AdditionalData/" + additionalDataId
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });
    };

    var getTemplateList = function () {
        return $http({
            method: 'GET',
            url: baseUrls.templatesUrl + 'RenderService/Templates'
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getCampignCallList = function (campaignId) {
        return $http({
            method: 'GET',
            url: baseUrls.monitorrestapi + "Campaign/"+campaignId+"/Calls"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getOngoinCampignList = function (OperationalStatus) {
        return $http({
            method: 'GET',
            url: baseUrls.monitorrestapi + 'Campaigns?'+(OperationalStatus==="ALL"?"":("OperationalStatus="+OperationalStatus))
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };
    
    return {
        mechanisms: ["BLAST", "FIFO", "PREVIEW", "AGENT"],
        modes: ["IVR", "AGENT", "MESSAGE"],
        channels: ["SMS", "EMAIL", "CALL"],
        CreateCampaign: createCampaign,
        GetExtensions: getExtensions,
        GetCampaigns: getCampaigns,
        GetCampaign: getCampaign,
        UpdateCampaign: updateCampaign,
        DeleteCampaign: deleteCampaign,
        GetReasons: getReasons,
        UpdateCallBack: updateCallBack,
        CreateCampaignConfig: createCampaignConfig,
        UpdateCampaignConfig: updateCampaignConfig,
        GetCampaignConfig: getCampaignConfig,
        GetCallBacks: getCallBacks,
        SetCallBack: setCallBack,
        DeleteCallBack: deleteCallBack,
        FlushNumbers: flushNumbers,
        GetCategorys: getCategorys,
        MapNumberToCampaign: mapNumberToCampaign,
        MapScheduleToCampaign: mapScheduleToCampaign,
        MapNumberAndScheduleToCampaign: mapNumberAndScheduleToCampaign,
        AddScheduleToCampaign: addScheduleToCampaign,
        GetScheduleCampaign: getScheduleCampaign,
        GetAssignableScheduleCampaign: getAssignableScheduleCampaign,
        GetOngoingCampaign: getOngoingCampaign,
        GetCampaignByState: getCampaignByState,
        StartCampaign: startCampaign,
        SendCommandToCampaign: sendCommandToCampaign,
        GetTotalConnectedCount: getTotalConnectedCount,
        GetTotalDialCount: getTotalDialCount,
        GetAssignedCategory: getAssignedCategory,
        DeleteSchedule: deleteSchedule,
        GetCampaignSummery: getCampaignSummery,
        CampaignSummeryReportCount: campaignSummeryReportCount,
        CampaignDispositionReport: campaignDispositionReport,
        CampaignDispositionReportCount: campaignDispositionReportCount,
        CampaignCallbackReport: campaignCallbackReport,
        CampaignCallbackReportCount: campaignCallbackReportCount,
        GetAllCallBackReasons: getAllCallBackReasons,
        CampaignAttemptReportCount: campaignAttemptReportCount,
        CampaignAttemptReport: campaignAttemptReport,
        CreateCampaignAdditionalData: createCampaignAdditionalData,
        UpdateCampaignAdditionalData: updateCampaignAdditionalData,
        GetCampaignAdditionalData: getCampaignAdditionalData,
        DeleteAdditionalDataByID: deleteAdditionalDataByID,
        GetTemplateList: getTemplateList,
        GetCampaignById: getCampaignById,
        GetOngoinCampignList: getOngoinCampignList,
        GetCampignCallList: getCampignCallList
    }

});




