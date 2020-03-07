/**
 * Created by codemax on 02/03/20220.
 */

mainApp.service("packagingService", function(
  $http,
  $log,
  localStorageService,
  baseUrls
) {
  //get package details
  this.getAllPackages = function(callback) {
    $http
      .get(baseUrls.packagingServiceBaseUrl + "Packages")
      .success(function(data, status, headers, config) {
        callback(data.Result);
      })
      .error(function(data, status, headers, config) {
        callback(data.Result);
      });
  };

  //buy my package details
  this.buyMyPackage = function(packageName, callback) {
    $http
      .put(
        baseUrls.organizationServiceBaseUrl + "Organisation/Package/" + packageName,
        {}
      )
      .success(function(data, status, headers, config) {
        if (data && data.IsSuccess && data.IsSuccess == true) {
          callback(true, data.Result);
        } else {
          callback(false, data.Result);
        }
      })
      .error(function(data, status, headers, config) {
        callback(false, data.Result);
      });
  };

  //user login in to console
  //get current user navigation
  this.getUserNavigation = function(callback) {
    $http
      .get(
        baseUrls.UserServiceBaseUrl +
          "MyAppScopes/MyAppScopes/SUPERVISOR_CONSOLE"
      )
      .success(function(data, status, headers, config) {
        console.log(data);
        if (data.IsSuccess && data.Result && data.Result.length > 0) {
          //navigations = data.Result[0];

          localStorageService.set("@navigations", data.Result[0]);
          callback(true);
        } else {
          callback(false);
        }
      })
      .error(function(data, status, headers, config) {
        callback(false);
      });
  };

  //var navigations = [];
  var mynavigations = {};
  //check my navigation
  //is can access
  this.getNavigationAccess = function(callback) {
    mynavigations = {};
    $http
      .get(
        baseUrls.UserServiceBaseUrl +
          "MyAppScopes/MyAppScopes/SUPERVISOR_CONSOLE"
      )
      .success(function(data, status, headers, config) {
        if (data.IsSuccess && data.Result && data.Result.length > 0) {
          data.Result[0].menus.forEach(function(item) {
            mynavigations[item.menuItem] = true;
          });
        }
        callback(mynavigations);
      })
      .error(function(data, status, headers, config) {
        callback(mynavigations);
      });
  };
});
