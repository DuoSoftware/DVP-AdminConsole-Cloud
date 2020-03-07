/**
 * Created by codemax on 02/03/20220.
 */

mainApp.service("loginService", function($http, $log, baseUrls) {
  this.forgetPassword = function(email, callback) {
    $http
      .post(baseUrls.authServiceBaseUrl + "auth/forget", { email: email })
      .success(function(data, status, headers, config) {
        callback(data.IsSuccess);
      })
      .error(function(data, status, headers, config) {
        callback(data.IsSuccess);
      });
  };

  this.resetPassword = function(token, password, callback) {
    $http
      .post(baseUrls.authServiceBaseUrl + "auth/reset/" + token, {
        password: password
      })
      .success(function(data, status, headers, config) {
        callback(data.IsSuccess);
      })
      .error(function(data, status, headers, config) {
        callback(data.IsSuccess);
      });
  };

  this.tokenExsistes = function(token, callback) {
    $http
      .get(baseUrls.authServiceBaseUrl + "auth/token/" + token + "/exists")
      .success(function(data, status, headers, config) {
        callback(data.IsSuccess);
      })
      .error(function(data, status, headers, config) {
        callback(data.IsSuccess);
      });
  };

  this.activateAccount = function(token, callback) {
    $http
      .get(baseUrls.authServiceBaseUrl + "auth/activate/" + token)
      .success(function(data, status, headers, config) {
        callback(data.IsSuccess);
      })
      .error(function(data, status, headers, config) {
        callback(data.IsSuccess);
      });
  };

  this.isCheckResponse = function(response) {
    if (response) {
      if (response.status != "200") {
        if (response.data) {
          if (
            response.data.message == "missing_secret" ||
            response.data.message == "No authorization token was found"
          ) {
            $auth.removeToken();
            $location.path("/login");
            return false;
          }
        }
      }
    }
  };
});
