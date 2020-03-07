/**
 * Created by codemax on 02/03/20220.
 */

mainApp.service("organizationService", function($http, $log, baseUrls) {
  this.LoadBusinessUnits = function(id) {
    return $http({
      method: "GET",
      url: baseUrls.organizationServiceBaseUrl + "Supervisor/" + id + "/BusinessUnits"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      }
      return [];
    });
  };

  this.LoadBusinessUnitsWithPaging = function(bu, page, size) {
    return $http({
      method: "GET",
      url:
        baseUrls.organizationServiceBaseUrl +
        "BusinessUnitFull/" +
        bu +
        "/Users?Page=" +
        page +
        "&Size=" +
        size
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      }
      return [];
    });
  };

  this.loadUserByBusinessUnit = function(id) {
    return $http({
      method: "GET",
      url: baseUrls.organizationServiceBaseUrl + "BusinessUnit/" + id + "/Users"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.Result;
      }
      return [];
    });
  };

  this.getOrganizationExsistance = function(company) {
    /* return $http({
      method: "GET",
      url: baseUrls.organizationServiceBaseUrl + "Organization/" + company + "/exists"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.IsSuccess;
      }
      return false;
    }); */

    return $http({
      method: "GET",
      url: baseUrls.organizationServiceBaseUrl + "Organization/" + company + "/exists"
    }).then(function(response) {
      if (response.data && response.data.IsSuccess) {
        return response.data.IsSuccess;
      }
      return false;
    });
  };

  //create new user
  this.createNewUser = function(param, callback) {
    $http
      .post(baseUrls.organizationServiceBaseUrl + "Organisation/Owner", param)
      .success(function(data, status, headers, config) {
        callback(true);
      })
      .error(function(data, status, headers, config) {
        callback(false);
      });
  };

  //create Organisation
  this.createOrganisation = function(param, callback) {
    $http
      .post(baseUrls.organizationServiceBaseUrl + "Organisation", param)
      .success(function(data, status, headers, config) {
        callback(true);
      })
      .error(function(data, status, headers, config) {
        callback(false);
      });
  };

  //is check Organisation name
  this.CheckUniqueOrganization = function(orgName, callback) {
    $http
      .get(baseUrls.organizationServiceBaseUrl + "Organization/" + orgName + "/exists")
      .success(function(data, status, headers, config) {
        callback(data.IsSuccess);
      })
      .error(function(data, status, headers, config) {
        callback(false);
      });
  };

  //get my packages
  this.getMyPackages = function(callback) {
    $http
      .get(baseUrls.organizationServiceBaseUrl + "MyOrganization/mypackages", {
        headers: {
          "content-type": "application/json "
        }
      })
      .success(function(data, status, headers, config) {
        if (data && data.Result && data.Result.length > 0) {
          callback(true, status, data);
        } else {
          callback(false, status, data);
        }
      })
      .error(function(data, status, headers, config) {
        callback(false, status);
      });
  };
});
