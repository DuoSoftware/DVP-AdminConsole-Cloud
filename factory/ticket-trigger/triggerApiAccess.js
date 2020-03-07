/**
 * Created by Heshan.i on 8/12/2016.
 */

(function() {
  var triggerApiAccess = function($http, $q, baseUrls) {
    //create ticket trigger
    var createTriggerConfiguration = function(trigger) {
      return $http({
        method: "POST",
        url: baseUrls.ticketUrl + "Trigger/Organisation/config",
        headers: {
          "Content-Type": "application/json"
        },
        data: trigger
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.IsSuccess;
        } else {
          return false;
        }
      });
    };

    var getTriggerConfiguration = function() {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "Trigger/Organisation/config",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return undefined;
        }
      });
    };

    var createTrigger = function(trigger) {
      return $http({
        method: "POST",
        url: baseUrls.ticketUrl + "Trigger",
        headers: {
          "Content-Type": "application/json"
        },
        data: trigger
      }).then(function(response) {
        return response.data;
      });
    };

    var updateTrigger = function(trigger) {
      return $http({
        method: "PUT",
        url: baseUrls.ticketUrl + "Trigger/" + trigger._id,
        headers: {
          "Content-Type": "application/json"
        },
        data: trigger
      }).then(function(response) {
        return response.data;
      });
    };

    var getTriggers = function() {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "Triggers"
      }).then(function(response) {
        return response.data;
      });
    };

    var getTrigger = function(triggerId) {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var deleteTrigger = function(triggerId) {
      return $http({
        method: "DELETE",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var addFilterAll = function(triggerId, filterAll) {
      return $http({
        method: "PUT",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Filter/All",
        headers: {
          "Content-Type": "application/json"
        },
        data: filterAll
      }).then(function(response) {
        return response.data;
      });
    };

    var getFiltersAll = function(triggerId) {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Filters/All",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var removeFilterAll = function(triggerId, filterId) {
      return $http({
        method: "DELETE",
        url:
          baseUrls.ticketUrl +
          "Trigger/" +
          triggerId +
          "/Filter/All/" +
          filterId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var addFilterAny = function(triggerId, filterAny) {
      return $http({
        method: "PUT",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Filter/Any",
        headers: {
          "Content-Type": "application/json"
        },
        data: filterAny
      }).then(function(response) {
        return response.data;
      });
    };

    var getFiltersAny = function(triggerId) {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Filters/Any",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var removeFilterAny = function(triggerId, filterId) {
      return $http({
        method: "DELETE",
        url:
          baseUrls.ticketUrl +
          "Trigger/" +
          triggerId +
          "/Filter/Any/" +
          filterId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var addAction = function(triggerId, action) {
      return $http({
        method: "PUT",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Action",
        headers: {
          "Content-Type": "application/json"
        },
        data: action
      }).then(function(response) {
        return response.data;
      });
    };

    var getActions = function(triggerId) {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Actions",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var removeAction = function(triggerId, actionId) {
      return $http({
        method: "DELETE",
        url:
          baseUrls.ticketUrl + "Trigger/" + triggerId + "/Action/" + actionId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var addOperations = function(triggerId, operation) {
      return $http({
        method: "PUT",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Operation",
        headers: {
          "Content-Type": "application/json"
        },
        data: operation
      }).then(function(response) {
        return response.data;
      });
    };

    var getOperations = function(triggerId) {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "Trigger/" + triggerId + "/Operations",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var removeOperations = function(triggerId, operationId) {
      return $http({
        method: "DELETE",
        url:
          baseUrls.ticketUrl +
          "Trigger/" +
          triggerId +
          "/Operation/" +
          operationId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var ticketSchema = function() {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "TicketSchema",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return [];
        }
      });
    };

    var ticketStatusNodes = function() {
      return $http({
        method: "GET",
        url: baseUrls.ticketUrl + "TicketStatusNodes",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return [];
        }
      });
    };

    var getInitialConfigData = function() {
      var promise1 = $http({
        method: "GET",
        url: baseUrls.ticketUrl + "TicketStatusNodes",
        headers: { "Content-Type": "application/json" }
      });
      var promise2 = $http({
        method: "GET",
        url: baseUrls.ticketUrl + "TicketTypes"
      });
      var promise3 = $http({
        method: "GET",
        url: baseUrls.ticketUrl + "TicketSchema",
        headers: { "Content-Type": "application/json" }
      });

      return $q.all([promise1, promise2, promise3]).then(function(data) {
        return data;
      });
    };

    return {
      createTrigger: createTrigger,
      updateTrigger: updateTrigger,
      getTriggers: getTriggers,
      getTrigger: getTrigger,
      deleteTrigger: deleteTrigger,
      addFilterAll: addFilterAll,
      getFiltersAll: getFiltersAll,
      removeFilterAll: removeFilterAll,
      addFilterAny: addFilterAny,
      getFiltersAny: getFiltersAny,
      removeFilterAny: removeFilterAny,
      addAction: addAction,
      getActions: getActions,
      removeAction: removeAction,
      addOperations: addOperations,
      getOperations: getOperations,
      removeOperations: removeOperations,
      TicketSchema: ticketSchema,
      TicketStatusNodes: ticketStatusNodes,
      CreateTriggerConfiguration: createTriggerConfiguration,
      GetTriggerConfiguration: getTriggerConfiguration,
      GetInitialConfigData: getInitialConfigData
    };
  };

  var triggerUserServiceAccess = function($http, baseUrls) {
    var getUsers = function() {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "Users"
      }).then(function(response) {
        return response.data;
      });
    };

    var getUserGroups = function() {
      return $http({
        method: "GET",
        url: baseUrls.userGroupServiceBaseUrl + "UserGroups"
      }).then(function(response) {
        return response.data;
      });
    };

    var getUserCount = function() {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "UserCount"
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
        return response.data;
      });
    };

    return {
      getUsers: getUsers,
      getUserGroups: getUserGroups,
      getUserCount: getUserCount,
      LoadUsersByPage: LoadUsersByPage
    };
  };

  var triggerTemplateServiceAccess = function($http, baseUrls) {
    var getTemplates = function() {
      return $http({
        method: "GET",
        url: baseUrls.templatesUrl + "RenderService/Templates"
      }).then(function(response) {
        return response.data;
      });
    };

    return {
      getTemplates: getTemplates
    };
  };

  var triggerArdsServiceAccess = function($http, baseUrls) {
    var getReqMetaData = function() {
      return $http({
        method: "GET",
        url:
          baseUrls.ardsLiteServiceUrl + "ARDS/requestmeta/TICKETSERVER/TICKET"
      }).then(function(response) {
        return response.data;
      });
    };

    return {
      getReqMetaData: getReqMetaData
    };
  };

  var module = angular.module("veeryConsoleApp");
  module.factory("triggerApiAccess", triggerApiAccess);
  module.factory("triggerUserServiceAccess", triggerUserServiceAccess);
  module.factory("triggerTemplateServiceAccess", triggerTemplateServiceAccess);
  module.factory("triggerArdsServiceAccess", triggerArdsServiceAccess);
})();
