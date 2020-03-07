/**
 * Created by Heshan.i on 1/13/2017.
 */
(function(){

    var acwDetailApiAccess = function($http, baseUrls) {

        var getCdrBySessions = function(sessionIds){
            return $http({
                method: 'POST',
                url: baseUrls.cdrProcessor+'GetCallDetailsBySessions',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: sessionIds
            }).then(function(response){
                return response.data;
            });
        };

        var getAcwRecords = function(resourceId, pageNo, rowCount, startDate, endData, skill, bu){

            var url = baseUrls.ardsmonitoringBaseUrl+'MONITORING/acw/resource/'+resourceId+'/'+pageNo+'/'+rowCount+'?startDate='+startDate+'&endDate='+endData;

            if(skill)
            {
                url = url + '&skill='+skill;
            }

            if(bu){

                url = url + '&bu='+bu;

            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getAllAcwRecords = function(resourceId, startDate, endData, skill, bu){

            var url = baseUrls.ardsmonitoringBaseUrl+'MONITORING/acw/resource/'+resourceId+'/download?startDate='+startDate+'&endDate='+endData;

            if(skill)
            {
                url = url + '&skill='+skill;
            }

            if(bu)
            {
                url = url + '&bu='+bu;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getResourceDetails = function(){
            return $http({
                method: 'GET',
                url: baseUrls.resourceServiceBaseUrl+'Resources',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getAcwSummeryDetails = function(resourceId, startDate, endData, skill, bu){

            var url = baseUrls.ardsmonitoringBaseUrl+'MONITORING/acw/summery/resource/'+resourceId+'?startDate='+startDate+'&endDate='+endData;

            if(skill)
            {
                url = url + '&skill='+skill;
            }

            if(bu){

                url = url + '&bu='+bu;

            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getRejectedSessionCount = function(resourceId, startDate, endData, bu){

            var url = baseUrls.ardsmonitoringBaseUrl+'MONITORING/resource/'+resourceId+'/task/rejectCount?startDate='+startDate+'&endDate='+endData;
            if(bu){

                url = url + '&bu='+bu;

            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getRejectedSessionDetails = function(resourceId, pageNo, rowCount, startDate, endData, bu){

            var url = baseUrls.ardsmonitoringBaseUrl+'MONITORING/resource/'+resourceId+'/task/reject/'+pageNo+'/'+rowCount+'?startDate='+startDate+'&endDate='+endData;
            if(bu){
                url = url + '&bu='+bu;
            }
            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var prepareDownloadDetails = function(resourceId, startDate, endData, bu){
            var url = baseUrls.ardsmonitoringBaseUrl+'MONITORING/resource/'+resourceId+'/task/reject/prepareForDownload?startDate='+startDate+'&endDate='+endData;
            if(bu){
                url = url + '&bu='+bu;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };


        var getAgentBreakDetails = function (fromDate,toDate) {
            return $http({
                method: 'GET',
                url: baseUrls.ardsmonitoringBaseUrl+ 'MONITORING/resource/break/details?startDate='+fromDate+'&endDate='+toDate
            }).then(function(response)
            {
                return response;
            });
        };

        return{
            GetAcwRecords: getAcwRecords,
            GetCdrBySessions: getCdrBySessions,
            GetResourceDetails: getResourceDetails,
            GetAcwSummeryDetails: getAcwSummeryDetails,
            GetRejectedSessionCount: getRejectedSessionCount,
            GetRejectedSessionDetails: getRejectedSessionDetails,
            PrepareDownloadDetails: prepareDownloadDetails,
            getAllAcwRecords: getAllAcwRecords,
            getAgentBreakDetails: getAgentBreakDetails
        };
    };

    var module = angular.module('veeryConsoleApp');
    module.factory('acwDetailApiAccess', acwDetailApiAccess);
}());