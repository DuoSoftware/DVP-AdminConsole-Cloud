/**
 * Created by dinusha on 6/11/2016.
 */

(function() {
  var myUserProfileApiAccess = function($http, baseUrls) {
    var getMyProfile = function() {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "Myprofile"
      }).then(function(resp) {
        return resp.data;
      });
    };

    var addContactToMyProfile = function(contact, type) {
      return $http({
        method: "PUT",
        url: baseUrls.UserServiceBaseUrl + "Myprofile/contact/" + contact,
        data: {
          type: type
        }
      }).then(function(resp) {
        return resp.data;
      });
    };

    var updateMyProfile = function(profileInfo) {
      profileInfo.birthday =
        profileInfo.dob.year +
        "-" +
        profileInfo.dob.month +
        "-" +
        profileInfo.dob.day;
      var jsonStr = JSON.stringify(profileInfo);

      return $http({
        method: "PUT",
        url: baseUrls.UserServiceBaseUrl + "Myprofile",
        data: jsonStr
      }).then(function(resp) {
        return resp.data;
      });
    };

    var deleteContactFromMyProfile = function(contact) {
      return $http({
        method: "DELETE",
        url: baseUrls.UserServiceBaseUrl + "Myprofile/contact/" + contact
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getMyOrganization = function() {
      return $http({
        method: "GET",
        url: baseUrls.organizationServiceBaseUrl + "Organisation"
      }).then(function(resp) {
        return resp.data;
      });
    };

    return {
      addContactToProfile: addContactToMyProfile,
      deleteContactFromMyProfile: deleteContactFromMyProfile,
      updateMyProfile: updateMyProfile,
      getMyProfile: getMyProfile,
      getMyOrganization: getMyOrganization
    };
  };

  var module = angular.module("veeryConsoleApp");
  module.factory("myUserProfileApiAccess", myUserProfileApiAccess);
})();
