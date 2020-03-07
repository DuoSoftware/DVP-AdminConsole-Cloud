/**
 * Created by Pawan on 6/17/2016.
 */
/**
 * Created by Pawan on 6/8/2016.
 */

mainApp.factory('extensionBackendService', function ($http, authService,baseUrls) {

    return {

        getExtensions: function () {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"Extensions"
            }).then(function(response)
            {
                return response;
            });
        },

        getExtensionsByCategory: function (category) {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"ExtensionsByCategory/"+category
            }).then(function(response)
            {
                return response;
            });
        },

        saveNewExtension: function (resource) {
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"Extension",
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },

        assignDodToExtension: function (ExtId,DodNum) {
            var dodData =
            {
                ExtId:ExtId, DodNumber:DodNum, DodActive:true
            }
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"DodNumber",
                data:dodData

            }).then(function(response)
            {
                return response;
            });
        },
        removeExtension: function (extension) {
            var authToken = authService.GetToken();
            return $http({
                method: 'DELETE',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"Extension/"+extension

            }).then(function(response)
            {
                return response;
            });
        },
        updateExtension: function (extension) {
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"Extension/"+extension.Extension,
                data:extension

            }).then(function(response)
            {
                return response;
            });
        }

    }
});