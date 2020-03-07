/**
 * Created by Pawan on 6/18/2016.
 */
/**
 * Created by Pawan on 6/8/2016.
 */

mainApp.factory('ardsBackendService', function ($http, baseUrls) {

    return {

        getArdsRecords: function () {


            return $http({
                method: 'GET',
                url: baseUrls.ardsLiteServiceUrl+"ARDS/requestmeta"
            }).then(function(response)
            {
                return response;
            });
        },

        getTasks: function () {

            return $http({
                method: 'GET',
                url: baseUrls.resourceServiceBaseUrl+"Tasks"

            }).then(function(response)
            {
                return response;
            });
        },

        getGroups: function () {

            return $http({
                method: 'GET',
                url: baseUrls.resourceServiceBaseUrl+"Groups"

            }).then(function(response)
            {
                return response;
            });
        },

        saveArds: function (resource) {

            return $http({
                method: 'post',
                url: baseUrls.ardsLiteServiceUrl+"ARDS/requestmeta",
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },

        updateArds: function (resource) {

            return $http({
                method: 'PUT',
                url: baseUrls.ardsLiteServiceUrl+"ARDS/requestmeta",
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        deleteArds: function (serverType,requestType) {

            return $http({
                method: 'DELETE',
                url: baseUrls.ardsLiteServiceUrl+'ARDS/requestmeta/'+serverType+'/'+requestType

            }).then(function(response)
            {
                return response;
            });
        },

        getRequestServers: function () {


            return $http({
                method: 'GET',
                url: baseUrls.ardsLiteServiceUrl+"ARDS/requestservers/*/*"
            }).then(function(response)
            {
                return response;
            });
        },

        getRequestMetaByType: function (serverType, requestType) {
            return $http({
                method: 'GET',
                url: baseUrls.ardsLiteServiceUrl+"ARDS/requestmeta/"+serverType+"/"+requestType
            }).then(function(response)
            {
                return response;
            });
        }



    }
});
