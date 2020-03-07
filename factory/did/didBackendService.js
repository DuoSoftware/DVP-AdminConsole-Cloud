/**
 * Created by Pawan on 6/30/2016.
 */


mainApp.factory('didBackendService', function ($http, baseUrls) {

    return {

        getDidRecords: function () {
            
            return $http({
                method: 'GET',
                url:baseUrls.sipUserendpoint +"SipUser/" + 'DidNumbers'})
                .then(function(response){
                    return response;
                });
        },
        deleteDidRecords: function (id) {
            
            return $http({
                method: 'DELETE',
                url: baseUrls.sipUserendpoint +"SipUser/" + 'DidNumber/'+id})
                .then(function(response){
                    return response;
                });
        },
        pickExtensionRecords: function () {
            
            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/" + 'Extensions'})
                .then(function(response){
                    return response;
                });
        },
        updateDidExtension: function (didNum,extension) {
            
            return $http({
                method: 'POST',
                url: baseUrls.sipUserendpoint +"SipUser/" + 'DidNumber/'+didNum+'/AssignToExt/'+extension})
                .then(function(response){
                    return response;
                });
        },
        addNewDidNumber: function (didData) {
            console.log("Did Data "+JSON.stringify(didData));
            
            return $http({
                method: 'POST',
                url: baseUrls.sipUserendpoint +"SipUser/" + 'DidNumber',
                data:didData

            }).then(function(response)
            {
                return response;
            });
        },
        pickPhoneNumbers: function () {

            
            return $http({
                method: 'GET',
                url: baseUrls.TrunkServiceURL+"PhoneNumberTrunkApi/TrunkNumbers"

            }).then(function(response)
            {
                return response;
            });
        },

        pickAllocatedDIDNumbers: function () {

            
            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/" +"DidNumbers"

            }).then(function(response)
            {
                return response;
            });
        }


    }
});