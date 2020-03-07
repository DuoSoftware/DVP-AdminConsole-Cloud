/**
 * Created by Rajinda on 12/31/2015.
 */

var clusterModule = angular.module("resourceProductivityServiceModule", []);

clusterModule.factory("resourceProductivityService", function(
  $http,
  $log,
  baseUrls,
  ShareData
) {
  var getProductivity = function() {
    var postData = [];
    postData["bu"] = ShareData.BusinessUnit;
    if (ShareData.BusinessUnit.toLowerCase() === "all") {
      postData = [];
    }
    return $http({
      method: "get",
      url: baseUrls.resourceServiceBaseUrl + "Resources/Productivity",
      params: postData
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return {};
      }
    });
  };

  var getOnlineAgents = function() {
    /*return $http.get(baseUrls.ardsmonitoringBaseUrl + "MONITORING/resources").then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return {};
                }
            });*/

    return $http
      .get(baseUrls.resourceServiceBaseUrl + "Resources")
      .then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return {};
        }
      });
  };

  var getUserCountByBusinessUnit = function(BusinessUnit) {
    return $http({
      method: "GET",
      url:
        baseUrls.organizationServiceBaseUrl +
        "BusinessUnit/" +
        BusinessUnit +
        "/UserCount"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      }
      return [];
    });
  };

  var getUserByBusinessUnit = function(BusinessUnit, pagesize, page) {
    return $http({
      method: "GET",
      url:
        baseUrls.organizationServiceBaseUrl +
        "BusinessUnit/" +
        BusinessUnit +
        "/Users?Page=" +
        page +
        "&Size=" +
        pagesize
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      }
      return [];
    });
  };

  return {
    GetProductivity: getProductivity,
    GetOnlineAgents: getOnlineAgents,
    getUserByBusinessUnit: getUserByBusinessUnit,
    getUserCountByBusinessUnit: getUserCountByBusinessUnit
  };
});
