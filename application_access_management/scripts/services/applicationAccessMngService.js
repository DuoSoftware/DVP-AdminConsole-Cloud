/**
 * Created by Rajinda on 12/31/2015.
 */

mainApp.factory("appAccessManageService", function(
  $http,
  $log,
  authService,
  baseUrls,
  jwtHelper
) {
  var getUserList = function() {
    return $http
      .get(baseUrls.UserServiceBaseUrl + "Users")
      .then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return {};
        }
      });
  };

  var addSelectedNavigationToUser = function(
    userName,
    consoleName,
    navigationData
  ) {
    ///User/:username/Console/:consoleName/Navigation
    return $http({
      method: "put",
      url:
        baseUrls.UserServiceBaseUrl +
        "User/" +
        userName +
        "/Console/" +
        consoleName +
        "/Navigation",
      headers: {
        "Content-Type": "application/json"
      },
      data: navigationData
    }).then(function(response) {
      return response.data;
    });
  };

  var addConsoleToUser = function(username, consoleName) {
    return $http({
      method: "put",
      url:
        baseUrls.UserServiceBaseUrl +
        "User/" +
        username +
        "/Console/" +
        consoleName,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      return response.data.IsSuccess;
    });
  };

  var deleteConsoleFrmUser = function(username, consoleName) {
    return $http({
      method: "delete",
      url:
        baseUrls.UserServiceBaseUrl +
        "User/" +
        username +
        "/Console/" +
        consoleName,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      return response.data.IsSuccess;
    });
  };

  var DeleteSelectedNavigationFrmUser = function(
    userName,
    consoleName,
    navigation
  ) {
    //User/:username/Console/:consoleName/Navigation/:navigation
    return $http({
      method: "delete",
      url:
        baseUrls.UserServiceBaseUrl +
        "User/" +
        userName +
        "/Console/" +
        consoleName +
        "/Navigation/" +
        navigation,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      return response.data;
    });
  };

  var getNavigationAssignToUser = function(userName) {
    //http://localhost:3636/DVP/API/1.0.0.0/User/John
    return $http({
      method: "get",
      url: baseUrls.UserServiceBaseUrl + "User/" + userName,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      return response.data;
    });
  };

  var getAssignableNavigations = function(userRole) {
    //http://localhost:3636/DVP/API/1.0.0.0/Consoles/admin
    return $http({
      method: "get",
      url: baseUrls.packagingServiceBaseUrl + "Consoles/" + userRole
    }).then(function(response) {
      return response.data.Result;
    });
  };

  var getUserAssignableScope = function() {
    return jwtHelper.decodeToken(authService.TokenWithoutBearer()).scope;
  };

  var getUserAssignedScope = function(assignedUser) {
    return $http({
      method: "get",
      url: baseUrls.UserServiceBaseUrl + "Users/" + assignedUser + "/Scope"
    }).then(function(response) {
      var scopes = [];

      angular.forEach(response.data.Result, function(item) {
        var scope = { resource: "", read: false, write: false, delete: false };
        try {
          scope.resource = item.scope;
        } catch (ex) {}
        try {
          scope.read = item.read;
        } catch (ex) {}
        try {
          scope.write = item.write;
        } catch (ex) {}
        try {
          scope.delete = item.delete;
        } catch (ex) {}
        scopes.push(scope);
      });
      return scopes;
    });
  };

  var assignScopeToUser = function(assignedUser, item) {
    var scope = { scop: "", read: false, write: false, delete: false };
    try {
      scope.scop = item.resource;
    } catch (ex) {}
    try {
      scope.read = item.read;
    } catch (ex) {}
    try {
      scope.write = item.write;
    } catch (ex) {}
    try {
      scope.delete = item.delete;
    } catch (ex) {}

    return $http({
      method: "put",
      url: baseUrls.UserServiceBaseUrl + "Users/" + assignedUser + "/Scope",
      data: scop
    }).then(function(response) {
      return response.data.IsSuccess;
    });
  };

  var removeAssignedScope = function(assignedUser, scope) {
    return $http({
      method: "delete",
      url:
        baseUrls.UserServiceBaseUrl +
        "User/" +
        assignedUser +
        "/Scope/" +
        scope.resource
    }).then(function(response) {
      return response.data.IsSuccess;
    });
  };

  var getUserCount = function(state) {
    var urlString = baseUrls.UserServiceBaseUrl + "UserCount";
    if (state) {
      urlString = baseUrls.UserServiceBaseUrl + "UserCount?active=" + state;
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
        return {};
      }
    });
  };

  return {
    GetUserList: getUserList,
    AddConsoleToUser: addConsoleToUser,
    DeleteConsoleFrmUser: deleteConsoleFrmUser,
    AddSelectedNavigationToUser: addSelectedNavigationToUser,
    DeleteSelectedNavigationFrmUser: DeleteSelectedNavigationFrmUser, //
    GetNavigationAssignToUser: getNavigationAssignToUser,
    GetAssignableNavigations: getAssignableNavigations,
    GetUserAssignableScope: getUserAssignableScope,
    GetUserAssignedScope: getUserAssignedScope,
    AssignScopeToUser: assignScopeToUser,
    RemoveAssignedScope: removeAssignedScope,
    getUserCount: getUserCount,
    LoadUsersByPage: LoadUsersByPage
  };
});
