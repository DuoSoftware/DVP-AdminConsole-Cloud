/**
 * Created by Pawan on 6/15/2016.
 */

mainApp.factory('queueSummaryBackendService', function ($http, baseUrls,ShareData) {



    return {


        getQueueSummary: function (fromDate, toDate,businessUnit) {
            var postData = [];
            postData['businessUnit'] = businessUnit;
            return $http({
                method: 'GET',
                url: baseUrls.ardsmonitoringBaseUrl + 'MONITORING/QUEUE/Summary/from/' + fromDate + '/to/' + toDate,
                params: postData
            }).then(function (response) {
                return response;
            });
        },

        getQueueSlaBreakDown: function (qDate) {
            return $http({
                method: 'GET',
                url: baseUrls.ardsmonitoringBaseUrl + 'MONITORING/QUEUE/SlaBreakDown/date/' + qDate+"?bUnit="+ShareData.BusinessUnit
            }).then(function (response) {
                return response;
            });
        },

        getQueueHourlySlaBreakDown: function (qDate) {
            return $http({
                method: 'GET',
                url: baseUrls.ardsmonitoringBaseUrl + 'MONITORING/QUEUE/SlaHourlyBreakDown/date/' + qDate+"?bUnit="+ShareData.BusinessUnit
            }).then(function (response) {
                return response;
            });
        },
        getQueueDailySlaBreakDown: function (qDate) {
            return $http({
                method: 'GET',
                url: baseUrls.ardsmonitoringBaseUrl + 'MONITORING/QUEUE/SlaBreakDown/date/' + qDate+"?bUnit="+ShareData.BusinessUnit
            }).then(function (response) {
                return response;
            });
        }
    }
});