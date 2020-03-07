/**
 * Created by Pawan on 6/13/2016.
 */
mainApp.factory('holdMusicBackendService', function ($http, authService,baseUrls) {

    return {
        getHoldMusic: function () {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.queuemusicServiceUrl+"QueueMusic/Profiles"
            }).then(function(response)
            {
                return response;
            });
        },

        getHoldMusicFiles: function () {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.fileServiceUrl+"Files?fileCategory=IVRCLIPS&fileFormat=audio/wav"
            }).then(function(response)
            {
                return response;
            });
        },
        saveHoldMusicFiles: function (resource) {
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url:  baseUrls.queuemusicServiceUrl+"QueueMusic/Profile",
                data:resource
            }).then(function(response)
            {
                return response;
            });
        },
        removeHoldMusicFiles: function (resource) {
            var authToken = authService.GetToken();
            return $http({
                method: 'DELETE',
                url:  baseUrls.queuemusicServiceUrl+"QueueMusic/Profile/"+resource.Name,
                data:resource
            }).then(function(response)
            {
                return response;
            });
        },
        updateHoldMusicFiles: function (resource) {
            var authToken = authService.GetToken();
            return $http({
                method: 'PUT',
                url:  baseUrls.queuemusicServiceUrl+"QueueMusic/Profile/"+resource.Name,
                data:resource
            }).then(function(response)
            {
                return response;
            });
        }

    }

});