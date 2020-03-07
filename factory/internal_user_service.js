/**
 * Created by Rajinda Waruna on 12/06/2018.
 */

mainApp.factory("internal_user_service", function($http, baseUrls) {
  return {
    GetBusinessUnits: function(tenant, company) {
      return $http({
        method: "GET",
        url: baseUrls.use + "Organisation/Name/" + tenant + "/" + company
      }).then(function(response) {
        return response;
      });
    },
    getUserCount: function($query) {
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
    },
    LoadUsersByPage: function(pagesize, pageno) {
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
          return undefined;
        }
      });
    },
    LoadUser: function($query) {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "Users"
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return undefined;
        }
      });
    },
    getUserList: function() {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "Users"
      }).then(function(response) {
        return response;
      });
    },
    GetMyTicketConfig: function(callback) {
      $http
        .get(baseUrls.UserServiceBaseUrl + "MyAppMeta")
        .success(function(data, status, headers, config) {
          callback(true, data);
        })
        .error(function(data, status, headers, config) {
          //login error
          callback(false, data);
        });
    },
    SaveMyTicketConfig: function(param, callback) {
      $http
        .put(baseUrls.UserServiceBaseUrl + "MyAppMeta", param)
        .success(function(data, status, headers, config) {
          callback(true, data);
        })
        .error(function(data, status, headers, config) {
          //login error
          callback(false, data);
        });
    },
    UpdateMyPwd: function(param, callback) {
      $http
        .put(baseUrls.UserServiceBaseUrl + "Myprofile/Password", param)
        .success(function(data, status, headers, config) {
          callback(true, data);
        })
        .error(function(data, status, headers, config) {
          //login error
          callback(false, data);
        });
    },
    getUsers: function() {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "Users"
      }).then(function(resp) {
        return resp.data;
      });
    },
    addUser: function(userObj) {
      var jsonStr = JSON.stringify(userObj);
      return $http({
        method: "POST",
        url: baseUrls.UserServiceBaseUrl + "User",
        data: jsonStr
      }).then(function(resp) {
        return resp.data;
      });
    },
    deleteUser: function(username) {
      return $http({
        method: "DELETE",
        url: baseUrls.UserServiceBaseUrl + "User/" + username
      }).then(function(resp) {
        return resp.data;
      });
    },
    updateUserMeta: function(user, usermeta) {
      return $http({
        method: "PUT",
        url: baseUrls.UserServiceBaseUrl + "Users/" + user + "/UserMeta",
        data: usermeta
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.IsSuccess;
        } else {
          return false;
        }
      });
    },
    getMyReceivedInvitations: function() {
      return $http({
        method: "get",
        url: baseUrls.UserServiceBaseUrl + "ReceivedInvitations"
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return undefined;
        }
      });
    },
    acceptInvitation: function(invite) {
      return $http({
        method: "put",
        url:
          baseUrls.UserServiceBaseUrl +
          "Invitation/Accept/" +
          invite._id +
          "/company/" +
          invite.company +
          "/tenant/" +
          invite.tenant
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return undefined;
        }
      });
    },
    rejectInvitation: function(invite) {
      return $http({
        method: "put",
        url:
          baseUrls.UserServiceBaseUrl +
          "Invitation/Reject/" +
          invite._id +
          "/company/" +
          invite.company +
          "/tenant/" +
          invite.tenant
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return undefined;
        }
      });
    },
    cancelInvitation: function(invite) {
      return $http({
        method: "put",
        url: baseUrls.UserServiceBaseUrl + "Invitation/Cancel/" + invite._id
      }).then(function(response) {
        if (response.data && response.data.IsSuccess) {
          return response.data.Result;
        } else {
          return undefined;
        }
      });
    }
  };
});
