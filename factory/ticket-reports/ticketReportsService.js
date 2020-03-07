(function() {
  var ticketReportsService = function($http, authService, baseUrls) {
    var getTicketSummary = function(
      sdate,
      edate,
      tag,
      channel,
      priority,
      type,
      businessUnit
    ) {
      var postData = {};
      var url =
        baseUrls.ticketUrl + "TicketReport?from=" + sdate + "&to=" + edate;

      if (businessUnit) {
        url = url + "&businessunit=" + businessUnit;
      }

      if (tag) {
        postData.tag = tag;
      }

      if (channel) {
        postData.channel = channel;
      }

      if (priority) {
        postData.priority = priority;
      }

      if (type) {
        postData.type = type;
      }

      var httpHeaders = {
        method: "POST",
        url: url
      };

      if (tag || channel || priority || type) {
        httpHeaders.data = JSON.stringify(postData);
      }

      return $http(httpHeaders).then(function(resp) {
        return resp.data;
      });
    };

    var getTicketSummaryTagWise = function(sdate, edate, businessUnit) {
      var url =
        baseUrls.ticketUrl +
        "TicketReportTagBased?from=" +
        sdate +
        "&to=" +
        edate;

      if (businessUnit) {
        url = url + "&businessunit=" + businessUnit;
      }

      var httpHeaders = {
        method: "GET",
        url: url
      };

      return $http(httpHeaders).then(function(resp) {
        return resp.data;
      });
    };

    var getTicketDetailsNoPaging = function(filterData) {
      var postData = {};
      var url =
        baseUrls.ticketUrl +
        "TicketDetailReport/data" +
        "?from=" +
        filterData.sdate +
        "&to=" +
        filterData.edate;

      if (filterData.businessUnit) {
        url = url + "&businessunit=" + filterData.businessUnit;
      }

      if (filterData.tag) {
        postData.tag = filterData.tag;
      }

      if (filterData.channel) {
        postData.channel = filterData.channel;
      }

      if (filterData.priority) {
        postData.priority = filterData.priority;
      }

      if (filterData.type) {
        postData.type = filterData.type;
      }

      if (filterData.status) {
        postData.status = filterData.status;
      }

      if (filterData.assignee) {
        postData.assignee = filterData.assignee;
      }

      if (filterData.requester) {
        postData.requester = filterData.requester;
      }

      if (filterData.submitter) {
        postData.submitter = filterData.submitter;
      }

      if (filterData.tz) {
        postData.tz = filterData.tz;
      }

      if (filterData.slaViolated === true || filterData.slaViolated === false) {
        postData.sla_violated = filterData.slaViolated;
      }

      postData.tagCount = filterData.tagCount;

      var httpHeaders = {
        method: "POST",
        url: url
      };

      if (
        filterData.tag ||
        filterData.tz ||
        filterData.channel ||
        filterData.assignee ||
        filterData.submitter ||
        filterData.requester ||
        filterData.priority ||
        filterData.type ||
        filterData.status ||
        filterData.slaViolated === true ||
        filterData.slaViolated === false
      ) {
        httpHeaders.data = JSON.stringify(postData);
      }

      return $http(httpHeaders).then(function(resp) {
        return resp.data;
      });
    };

    var getTicketDetails = function(filterData) {
      var postData = {};
      var url =
        baseUrls.ticketUrl +
        "TicketDetailReport/data/" +
        filterData.skipCount +
        "/" +
        filterData.limitCount +
        "?from=" +
        filterData.sdate +
        "&to=" +
        filterData.edate;

      if (filterData.businessUnit) {
        url = url + "&businessunit=" + filterData.businessUnit;
      }

      if (filterData.tag) {
        postData.tag = filterData.tag;
      }

      if (filterData.channel) {
        postData.channel = filterData.channel;
      }

      if (filterData.priority) {
        postData.priority = filterData.priority;
      }

      if (filterData.type) {
        postData.type = filterData.type;
      }

      if (filterData.status) {
        postData.status = filterData.status;
      }

      if (filterData.assignee) {
        postData.assignee = filterData.assignee;
      }

      if (filterData.requester) {
        postData.requester = filterData.requester;
      }

      if (filterData.submitter) {
        postData.submitter = filterData.submitter;
      }

      if (filterData.slaViolated === true || filterData.slaViolated === false) {
        postData.sla_violated = filterData.slaViolated;
      }

      var httpHeaders = {
        method: "POST",
        url: url
      };

      if (
        filterData.tag ||
        filterData.channel ||
        filterData.assignee ||
        filterData.submitter ||
        filterData.requester ||
        filterData.priority ||
        filterData.type ||
        filterData.status ||
        filterData.slaViolated === true ||
        filterData.slaViolated === false
      ) {
        httpHeaders.data = JSON.stringify(postData);
      }

      return $http(httpHeaders).then(function(resp) {
        return resp.data;
      });
    };

    var getTicketDetailsCount = function(filterData) {
      var postData = {};
      var url =
        baseUrls.ticketUrl +
        "TicketDetailReport/count" +
        "?from=" +
        filterData.sdate +
        "&to=" +
        filterData.edate;

      if (filterData.businessUnit) {
        url = url + "&businessunit=" + filterData.businessUnit;
      }

      if (filterData.tag) {
        postData.tag = filterData.tag;
      }

      if (filterData.channel) {
        postData.channel = filterData.channel;
      }

      if (filterData.priority) {
        postData.priority = filterData.priority;
      }

      if (filterData.type) {
        postData.type = filterData.type;
      }

      if (filterData.status) {
        postData.status = filterData.status;
      }

      if (filterData.assignee) {
        postData.assignee = filterData.assignee;
      }

      if (filterData.requester) {
        postData.requester = filterData.requester;
      }

      if (filterData.submitter) {
        postData.submitter = filterData.submitter;
      }

      if (filterData.slaViolated === true || filterData.slaViolated === false) {
        postData.sla_violated = filterData.slaViolated;
      }

      var httpHeaders = {
        method: "POST",
        url: url
      };

      if (
        filterData.tag ||
        filterData.channel ||
        filterData.assignee ||
        filterData.submitter ||
        filterData.requester ||
        filterData.priority ||
        filterData.type ||
        filterData.status ||
        filterData.slaViolated === true ||
        filterData.slaViolated === false
      ) {
        httpHeaders.data = JSON.stringify(postData);
      }

      return $http(httpHeaders).then(function(resp) {
        return resp.data;
      });
    };

    var getExternalUsers = function() {
      var url = baseUrls.externalUserServiceBaseUrl + "ExternalUsers";

      return $http({
        method: "GET",
        url: url
      }).then(function(resp) {
        return resp.data;
      });
    };
    var getExternalUsersByHint = function(hint) {
      var url = baseUrls.externalUserServiceBaseUrl + "ExternalUsersByHint/" + hint;

      return $http({
        method: "GET",
        url: url
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getUsers = function() {
      var url = baseUrls.UserServiceBaseUrl + "Users";

      return $http({
        method: "GET",
        url: url
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getTagList = function() {
      var url = baseUrls.ticketUrl + "Tags";

      return $http({
        method: "GET",
        url: url
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getCategoryList = function() {
      var url = baseUrls.ticketUrl + "TagCategories";

      return $http({
        method: "GET",
        url: url
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getTicketTypeList = function() {
      var url = baseUrls.ticketUrl + "TicketTypes";

      return $http({
        method: "GET",
        url: url
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getTicketStatusList = function() {
      var url = baseUrls.ticketUrl + "TicketStatusNodes";

      return $http({
        method: "GET",
        url: url
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getUserCount = function(activeState) {
      var urlString = baseUrls.UserServiceBaseUrl + "UserCount";
      if (activeState) {
        urlString =
          baseUrls.UserServiceBaseUrl + "UserCount?active=" + activeState;
      }

      return $http({
        method: "GET",
        url: urlString
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return 0;
        }
      });
    };
    var LoadUsersByPage = function(activeState, pagesize, pageno) {
      var postData = [];
      postData["Page"] = pageno;
      postData["Size"] = pagesize;

      var urlString = baseUrls.UserServiceBaseUrl + "Users";
      if (activeState) {
        urlString = baseUrls.UserServiceBaseUrl + "Users?active=" + activeState;
      }

      return $http({
        method: "GET",
        url: urlString,
        params: postData
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data;
        } else {
          return undefined;
        }
      });
    };

    return {
      getTicketSummary: getTicketSummary,
      getTicketDetails: getTicketDetails,
      getTicketDetailsCount: getTicketDetailsCount,
      getCategoryList: getCategoryList,
      getTagList: getTagList,
      getExternalUsers: getExternalUsers,
      getUsers: getUsers,
      getTicketDetailsNoPaging: getTicketDetailsNoPaging,
      getTicketTypeList: getTicketTypeList,
      getTicketStatusList: getTicketStatusList,
      getTicketSummaryTagWise: getTicketSummaryTagWise,
      getUserCount: getUserCount,
      LoadUsersByPage: LoadUsersByPage,
      getExternalUsersByHint: getExternalUsersByHint
    };
  };

  var module = angular.module("veeryConsoleApp");
  module.factory("ticketReportsService", ticketReportsService);
})();
