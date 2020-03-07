/**
 * Created by Rajinda on 12/31/2015.
 */

mainApp.factory("ivrNodeCountService", function ($http, download,authService,baseUrls) {

    var getApplicationList = function () {
        return $http({
            method: 'GET',
            url: baseUrls.appregistryServiceUrl+ "APPRegistry/Applications"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getIvrNodeCount = function (appId,startDate,endDate,nodes) {
        return $http({
            method: 'POST',
            url: baseUrls.eventserviceUrl+ "EventService/Events/App/"+appId+"/Type/COMMAND/NodeCount?start="+startDate+"&end="+endDate,
            data:nodes
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };


    var getEventByNodes = function (appId,startDate,endDate,page,pgSize,nodes) {
        return $http({
            method: 'POST',
            url: baseUrls.eventserviceUrl+ "EventService/EventsByNodes/App/"+appId+"/Type/COMMAND?page="+page+"&pgSize="+pgSize+"&startDate="+startDate+"&endDate="+endDate,
            data:nodes
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getEventByNodesCount = function (appId,startDate,endDate,page,pgSize,nodes) {
        return $http({
            method: 'POST',
            url: baseUrls.eventserviceUrl+ "EventService/EventsByNodes/App/"+appId+"/Type/COMMAND/Count?page="+page+"&pgSize="+pgSize+"&startDate="+startDate+"&endDate="+endDate,
            data:nodes
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getNodesType = function (appId,startDate,endDate,page,pgSize,nodes) {
        return $http({
            method: 'GET',
            url: baseUrls.eventserviceUrl+ "EventService/Events/NodeTypes",
            data:nodes
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

  return {
      GetApplicationList: getApplicationList,
      GetIvrNodeCount:getIvrNodeCount,
      GetEventByNodes:getEventByNodes,
      GetNodesType:getNodesType,
      GetEventByNodesCount:getEventByNodesCount
  }

});

