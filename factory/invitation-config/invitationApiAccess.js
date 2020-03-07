/**
 * Created by Pawan on 1/17/2018.
 */

mainApp.factory("invitationApiAccess", function($http, baseUrls) {
  return {
    sendInvitations: function(invObj) {
      return $http({
        method: "POST",
        url: baseUrls.UserServiceBaseUrl + "Invitations",
        data: invObj
      }).then(function(response) {
        return response;
      });
    },
    requestInvitations: function(invObj) {
      return $http({
        method: "POST",
        url: baseUrls.UserServiceBaseUrl + "RequestInvitations",
        data: invObj
      }).then(function(response) {
        return response;
      });
    },
    getSentInvitations: function() {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "SendInvitations"
      }).then(function(response) {
        return response;
      });
    },
    cancelSentInvitation: function(id) {
      return $http({
        method: "PUT",
        url: baseUrls.UserServiceBaseUrl + "Invitation/Cancel/" + id
      }).then(function(response) {
        return response;
      });
    },
    checkInvitable: function(names) {
      return $http({
        method: "GET",
        url: baseUrls.UserServiceBaseUrl + "Users/invitable?" + names
      }).then(function(response) {
        return response;
      });
    },
    resendInvitation: function(id) {
      return $http({
        method: "PUT",
        url: baseUrls.UserServiceBaseUrl + "Invitation/Resend/" + id
      }).then(function(response) {
        return response;
      });
    }
  };
});
