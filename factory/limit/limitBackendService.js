/**
 * Created by Pawan on 6/14/2016.
 */

mainApp.factory('limitBackendService', function ($http, baseUrls) {

    return {

        getLimits: function () {
            return $http({
                method: 'GET',
                url: baseUrls.limitHandlerUrl+'LimitAPI/Limit/Info'
            })
                .then(function(response){
                    return response;
                });
        },
        saveNewLimit: function (limitInfo) {
            return $http({
                method: 'POST',
                url: baseUrls.limitHandlerUrl+'LimitAPI/Limit',
                data: limitInfo
            })
                .then(function(response){
                    return response;
                });
        }
        ,
        updateMaxLimit: function (limitId,maxLimit) {
            return $http({
                method: 'PUT',
                url: baseUrls.limitHandlerUrl+'LimitAPI/Limit/'+limitId+'/Max/'+maxLimit
            })
                .then(function(response){
                    return response;
                });
        },
        setLimitStatus: function (limitId,status) {
            return $http({
                method: 'PUT',
                url: baseUrls.limitHandlerUrl+'LimitAPI/Limit/'+limitId+'/Activate/'+status
            })
                .then(function(response){
                    return response;
                });
        }

    }
});