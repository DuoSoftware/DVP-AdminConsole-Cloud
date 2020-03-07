/**
 * Created by dinusha on 12/30/2015.
 */
(function() {

  var pbxAdminApiHandler = function($http, authService, baseUrls)
  {
    var getPABXMasterData = function()
    {

      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXMasterData'
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getFeatureCodes = function()
    {

      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'FeatureCodes'
      }).then(function(resp)
      {
        return resp.data;
      })
    };



    var savePBXMasterData = function(masterData)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXMasterData',
        data:JSON.stringify(masterData)
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var saveFeatureCodes = function(fcData)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'FeatureCodeTemplate',
        data:JSON.stringify(fcData)
      }).then(function(resp)
      {
        return resp.data;
      })
    };


    var getEmergencyNumbers = function()
    {
      return $http({
        method: 'GET',
        url: baseUrls.sipUserendpoint +"SipUser/"  + 'EmergencyNumbers',
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getTransferCodes = function()
    {
      return $http({
        method: 'GET',
        url: baseUrls.sipUserendpoint +"SipUser/"  + 'TransferCode',
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var saveTransferCodes = function(transCodes)
    {
      return $http({
        method: 'POST',
        url: baseUrls.sipUserendpoint +"SipUser/"  + 'TransferCode',
        data:JSON.stringify(transCodes)
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deleteEmergencyNumber = function(emergencyNum)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.sipUserendpoint +"SipUser/"  + 'EmergencyNumber/' + emergencyNum,
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var addEmergencyNumber = function(emNum)
    {
      return $http({
        method: 'POST',
        url: baseUrls.sipUserendpoint +"SipUser/"  + 'EmergencyNumber',
        data:JSON.stringify(emNum)
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    return {
      getPABXMasterData: getPABXMasterData,
      savePBXMasterData: savePBXMasterData,
      getFeatureCodes: getFeatureCodes,
      saveFeatureCodes: saveFeatureCodes,
      getEmergencyNumbers: getEmergencyNumbers,
      deleteEmergencyNumber: deleteEmergencyNumber,
      addEmergencyNumber: addEmergencyNumber,
      getTransferCodes: getTransferCodes,
      saveTransferCodes: saveTransferCodes

    };
  };

  var module = angular.module("veeryConsoleApp");
  module.factory("pbxAdminApiHandler", pbxAdminApiHandler);

}());
