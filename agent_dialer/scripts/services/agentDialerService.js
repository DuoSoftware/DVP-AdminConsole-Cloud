/**
 * Created by Rajinda on 05/17/2017.
 */

mainApp.factory("agentDialService", function($http, $log, baseUrls) {
  var assignNumber = function(postData) {
    return $http({
      method: "POST",
      url: baseUrls.agentDialerURL + "AssignNumbers",
      data: postData
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return undefined;
      }
    });
  };

  var saveDialInfo = function(resourceId, postData) {
    return $http({
      method: "POST",
      url: baseUrls.agentDialerURL + "Resource/" + resourceId + "/Dial",
      data: postData
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return undefined;
      }
    });
  };

  var checkJobStatus = function(jobId) {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "/Job/" + jobId
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.IsSuccess;
      } else {
        return false;
      }
    });
  };

  var pendingJob = function() {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "Job"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return [];
      }
    });
  };

  var getProfileDetails = function() {
    return $http({
      method: "GET",
      url: baseUrls.UserServiceBaseUrl + "Users"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return 0;
      }
    });
  };

  /*var headerDetails = function () {
        return $http({
            method: 'GET',
            url:  baseUrls.agentDialerURL+"HeaderDetails"
        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };*/

  var headerDetails = function() {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "HeaderDetails/all"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return undefined;
      }
    });
  };

  var dispositionSummeryReport = function(data) {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "Report/Disposition",
      params: data
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return undefined;
      }
    });
  };

  var dispositionSummeryAgentWiseReport = function(data) {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "Report/DispositionSummary",
      params: data
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return null;
      }
    });
  };

  var dispositionSummeryReportCount = function(data) {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "Report/Disposition/Count",
      params: data
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return undefined;
      }
    });
  };
  var dispositionDetailsReport = function(data) {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "Report/Details/Disposition",
      params: data
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return undefined;
      }
    });
  };

  var dispositionDetailsReportCount = function(data) {
    return $http({
      method: "GET",
      url: baseUrls.agentDialerURL + "Report/Details/Disposition/Count",
      params: data
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return undefined;
      }
    });
  };

  var getUserCount = function(activeState) {
    return $http({
      method: "GET",
      url: baseUrls.UserServiceBaseUrl + "UserCount?active=" + activeState
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return 0;
      }
    });
  };
  var LoadUsersByPage = function(pagesize, pageno) {
    var postData = [];
    postData["Page"] = pageno;
    postData["Size"] = pagesize;
    return $http({
      method: "GET",
      url: baseUrls.UserServiceBaseUrl + "Users",
      params: postData
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      } else {
        return 0;
      }
    });
  };

  return {
    GetProfileDetails: getProfileDetails,
    AssignNumber: assignNumber,
    SaveDialInfo: saveDialInfo,
    CheckJobStatus: checkJobStatus,
    PendingJob: pendingJob,
    HeaderDetails: headerDetails,
    DispositionSummeryReport: dispositionSummeryReport,
    DispositionSummeryReportCount: dispositionSummeryReportCount,
    DispositionDetailsReport: dispositionDetailsReport,
    DispositionDetailsReportCount: dispositionDetailsReportCount,
    DispositionSummeryAgentWiseReport: dispositionSummeryAgentWiseReport,
    LoadUsersByPage: LoadUsersByPage,
    getUserCount: getUserCount
  };
});
