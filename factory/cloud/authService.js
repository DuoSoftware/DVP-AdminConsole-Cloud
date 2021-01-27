/**
 * Created by codemax on 02/03/20220.
 */

mainApp.service("authService", function(
  $http,
  $log,
  $auth,
  baseUrls,
  localStorageService,
  jwtHelper
) {
  this.GetToken = function() {
    var token = $auth.getToken();
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        return "bearer " + token;
      }
    }
    return undefined;
  };

  this.TokenWithoutBearer = function() {
    var token = $auth.getToken();
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        return token;
      }
    }
    return undefined;
  };

  //remove cookie
  this.clearCookie = function(key) {
    $auth.removeToken();
  };

  //check is owner
  this.isOwner = function(appname) {
    var token = $auth.getToken();
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        var decoded = jwtHelper.decodeToken(token);
        if (decoded && decoded.user_meta) return decoded.user_meta.role;
        else return undefined;
      }
    }
    return undefined;
  };

  //get token decode
  this.getTokenDecode = function() {
    var token = $auth.getToken();
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        return jwtHelper.decodeToken(token);
      }
    }
    return undefined;
  };

  this.checkNavigation = function(appname) {
    try {
      var navigations = localStorageService.get("@navigations");
      if (navigations && navigations.menus && navigations.menus.length > 0) {
        var obj = navigations.menus.filter(function(item, index) {
          return item.menuItem == appname;
        });

        if (obj && obj.length > 0) {
          return true;
        }
      } else {
        if (!navigations) {
          $state.go("login");
          return;
        } else {
          return false;
        }
      }
      return false;
    } catch (ex) {
      return false;
    }
  };

  //logoff
  this.Logoff = function(parm, callback) {
    var decodeToken = this.getTokenDecode();
    $http
      .delete(
        baseUrls.authServiceBaseUrl + "oauth/token/revoke/" + decodeToken.jti
      )
      .success(function(data, status, headers, config) {
        localStorageService.remove("@navigations");
        $auth.removeToken();
        callback(true);
      })
      .error(function(data, status, headers, config) {
        //login error
        callback(false);
      });
  };

  // forced logoff
  this.ForcedLogoff = function(parm, callback) {
    var username = parm.username;
    var console = parm.console;
    var tenant = parm.tenant;
    var orgId = parm.orgId;
    $http
        .delete(
            baseUrls.authServiceBaseUrl + "oauth/token/forcedLogoff/" + username + '?console=' + console + '&tenant=' + tenant + '&orgId=' + orgId
        )
        .success(function(data, status, headers, config) {
          callback(true);
        })
        .error(function(data, status, headers, config) {
          callback(false);
        });
  };

  // forced logoff
  this.ForcedLogoffById = function(parm, callback) {
    var userId = parm.userId;
    var username = parm.username;
    var console = parm.console;
    var tenant = parm.tenant;
    var orgId = parm.orgId;
    $http
        .delete(
            baseUrls.authServiceBaseUrl + "oauth/token/forcedLogoffById/" + userId + '?console=' + console + '&tenant=' + tenant + '&orgId=' + orgId + '&username=' + username
        )
        .success(function(data, status, headers, config) {
          callback(true);
        })
        .error(function(data, status, headers, config) {
          callback(false);
        });
  };

  // List Active Logins
  this.ListActiveLogins = function(parm, callback) {
    var console = parm.console;
    var tenant = parm.tenant;
    var orgId = parm.orgId;
    $http

        .get(

            baseUrls.authServiceBaseUrl + 'auth/listActiveLogins?console=' + console + '&tenant=' + tenant + '&orgId=' + orgId
        )
        .success(function (data, status, headers, config) {
          callback(data);
        })
        .error(function (data, status, headers, config) {
          callback([]);
        });
  };

  // user login
  this.Login = function(parm, callback) {
    $http
      .post(
        baseUrls.authServiceBaseUrl + "/oauth/token",
        {
          grant_type: "password",
          username: parm.userName,
          password: parm.password,
          scope: "all_all profile_veeryaccount"
        },
        {
          headers: {
            Authorization: "Basic " + parm.clientID
          }
        }
      )
      .success(function(data, status, headers, config) {
        localStorageService.remove("@navigations");
        $auth.removeToken();
        $auth.setToken(data);
        callback(true);
      })
      .error(function(data, status, headers, config) {
        //login error
        callback(false);
      });
  };

  this.invitationSignup = function(user, callback) {
    $http
      .post(baseUrls.authServiceBaseUrl + "auth/inviteSignup", user)
      .success(function(data, status, headers, config) {
        if (status && status == 200) {
          callback(true, status);
        } else {
          callback(false, status);
        }
      })
      .error(function(data, status, headers, config) {
        callback(false);
      });
  };

  //is check user exists
  this.CheckUniqueOwner = function(ownerName, callback) {
    $http
      .get(baseUrls.authServiceBaseUrl + "Owner/" + ownerName + "/exists")
      .success(function(data, status, headers, config) {
        callback(data.IsSuccess);
      })
      .error(function(data, status, headers, config) {
        callback(false);
      });
  };

  this.GetResourceId = function() {
    var decodeData = jwtHelper.decodeToken(this.TokenWithoutBearer());
    console.log("Dec Data " + decodeData.context);
    return decodeData.context.resourceid;
  };

  return this;
});
