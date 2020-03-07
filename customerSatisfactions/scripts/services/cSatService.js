/**
 * Created by Rajinda on 12/31/2015.
 */

mainApp.factory("cSatService", function ($http, download,baseUrls) {

    var getSatisfactionRequest = function (page,size,start,end,satisfaction,agentFilter) {

        var squr = "&satisfaction="+satisfaction;
        if(satisfaction===undefined ||satisfaction==="all"){
            squr = "";
        }

        var body = {};

        if(agentFilter && agentFilter.length > 0)
        {
            body.agentFilter = agentFilter;
        }
        return $http({
            method: 'POST',
            url: baseUrls.cSatUrl+ "CustomerSatisfactions/Request/"+page+"/"+size+"?start="+start+"&end="+end+squr,
            data: JSON.stringify(body)
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getSatisfactionRequestDownload = function (start,end,satisfaction,agentFilter,zone) {

        var squr = "&satisfaction="+satisfaction;
        if(satisfaction===undefined ||satisfaction==="all"){
            squr = "";
        }

        var body = {};

        if(agentFilter && agentFilter.length > 0)
        {
            body.agentFilter = agentFilter;
        }
        return $http({
            method: 'POST',
            url: baseUrls.cSatUrl+ "CustomerSatisfactions/Request/Download?start="+start+"&end="+end+squr+"&tz="+zone,
            data: JSON.stringify(body)
        }).then(function (response) {
            return response.data;
        });
    };

    var getSatisfactionRequestCount = function (start,end,satisfaction,agentFilter) {

        var squr = "&satisfaction="+satisfaction;
        if(satisfaction===undefined ||satisfaction==="all"){
            squr = "";
        }
        var body = {};

        if(agentFilter && agentFilter.length > 0)
        {
            body.agentFilter = agentFilter;
        }
        return $http({
            method: 'POST',
            url: baseUrls.cSatUrl+ "CustomerSatisfactions/Count?start="+start+"&end="+end+squr,
            data: JSON.stringify(body)
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var getSatisfactionRequestReport = function (start,end,agentFilter) {

        var body = {};

        if(agentFilter && agentFilter.length > 0)
        {
            body.agentFilter = agentFilter;
        }

        return $http({
            method: 'POST',
            url: baseUrls.cSatUrl+ "CustomerSatisfactions/Report?start="+start+"&end="+end,
            data: JSON.stringify(body)
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

  return {
      GetSatisfactionRequest: getSatisfactionRequest,
      GetSatisfactionRequestCount:getSatisfactionRequestCount,
      GetSatisfactionRequestReport:getSatisfactionRequestReport,
      getSatisfactionRequestDownload:getSatisfactionRequestDownload
  }

});

