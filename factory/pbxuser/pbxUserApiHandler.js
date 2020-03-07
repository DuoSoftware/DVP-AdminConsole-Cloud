/**
 * Created by dinusha on 12/30/2015.
 */
(function() {

  var pbxUserApiHandler = function($http, authService, baseUrls)
  {
    var getPABXUsers = function()
    {

      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUsers'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getSIPUsers = function()
    {
      return $http({
        method: 'GET',
        url: baseUrls.sipUserendpoint +"SipUser/"  + 'Users'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getPABXUserTemplates = function(userUuid)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/PBXUserTemplates'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var postPABXUserTemplate = function(userUuid, destNum, destType)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/PBXUserTemplate',
        data:{CallDivertNumber:destNum, ObjCategory: destType}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var saveFollowMeConfig = function(userUuid, fmList)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/FollowMeMulti',
        data:JSON.stringify(fmList)
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var saveForwardingConfig = function(userUuid, destNum, destType, disconReason, ringTOut)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/Forwarding',
        data:{DestinationNumber:destNum, ObjCategory: destType, RingTimeout: ringTOut, DisconnectReason: disconReason, IsActive: true}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var setAllowedNumbers = function(userUuid, allowedNumbers)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/AllowedNumbers',
        data:{AllowedNumbers:allowedNumbers}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var setDeniedNumbers = function(userUuid, deniedNumbers)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/DeniedNumbers',
        data:{DeniedNumbers:deniedNumbers}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var updatePABXUser = function(usrObj)
    {
      return $http({
        method: 'PUT',
        url: baseUrls.pbxUrl + 'PBXUser/' + usrObj.UserUuid,
        data:usrObj
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var savePABXUser = function(usrObj)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser',
        data:usrObj
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deletePABXTemplate = function(id)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'PBXUserTemplate/' + id
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deletePABXUser = function(userUuid)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getPABXUser = function(id)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + id
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getSchedules = function()
    {
      return $http({
        method: 'GET',
        url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedules/byCompany'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getGreetingFileMetadata = function(refId)
    {
      return $http({
        method: 'GET',
        url: baseUrls.fileServiceUrl + 'Files/' + refId + '/PABX/USER/GREETING'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getFollowMeConfigList = function(userUuid)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/FollowMe'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getForwardingConfigList = function(userUuid)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/Forwarding'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deleteFollowMe = function(fmId)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'FollowMe/' + fmId
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deleteForwarding = function(fwdId)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'Forwarding/' + fwdId
      }).then(function(resp)
      {
        return resp.data;
      })
    };

      var getSipUsersCount = function () {


          return $http({
              method: 'GET',
              url: baseUrls.sipUserendpoint +"SipUser/"  + "Users/Count"
          }).then(function (response) {
              if (response.data && response.data.IsSuccess) {
                  return response.data.Result;
              } else {
                  return 0;
              }
          });
      };
      var getSipUsersWithPaging = function (page,size) {


          return $http({
              method: 'GET',
              url: baseUrls.sipUserendpoint +"SipUser/"  + "Users?page="+page+"&size="+size
          }).then(function (response) {
              if (response.data && response.data.IsSuccess) {
                  return response.data.Result;
              } else {
                  return 0;
              }
          });
      };

    return {
      getPABXUsers: getPABXUsers,
      getPABXUserTemplates: getPABXUserTemplates,
      postPABXUserTemplate: postPABXUserTemplate,
      deletePABXTemplate: deletePABXTemplate,
      getPABXUser: getPABXUser,
      getGreetingFileMetadata: getGreetingFileMetadata,
      updatePABXUser: updatePABXUser,
      savePABXUser: savePABXUser,
      setAllowedNumbers: setAllowedNumbers,
      setDeniedNumbers: setDeniedNumbers,
      getSIPUsers: getSIPUsers,
      deletePABXUser: deletePABXUser,
      getFollowMeConfigList: getFollowMeConfigList,
      saveFollowMeConfig: saveFollowMeConfig,
      deleteFollowMe: deleteFollowMe,
      getForwardingConfigList: getForwardingConfigList,
      saveForwardingConfig: saveForwardingConfig,
      deleteForwarding: deleteForwarding,
      getSchedules: getSchedules,
        getSipUsersCount: getSipUsersCount,
        getSipUsersWithPaging: getSipUsersWithPaging

    };
  };

  var module = angular.module("veeryConsoleApp");
  module.factory("pbxUserApiHandler", pbxUserApiHandler);

}());
