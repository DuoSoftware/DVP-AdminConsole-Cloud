/**
 * Created by Divani on 01/26/2018.
 */

'use strict';
mainApp.factory("chatbotContextService", function ($http, $log, $filter,  baseUrls, $auth) {

    var createContext = function (context) {
        return $http({
            method: 'POST',
            url: baseUrls.chatbotContextAPIUrl,
            data: context
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var updateContext = function (context) {
        console.log(context);
        return $http({
            method: 'PUT',
            url: baseUrls.chatbotContextAPIUrl + "/" + context._id,
            data: context
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var deleteContext = function (context) {
        console.log(context);
        return $http({
            method: 'DELETE',
            url: baseUrls.chatbotContextAPIUrl + "/" + context._id,
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var getAllContext = function () {
        return $http({
            method: 'GET',
            url: baseUrls.chatbotContextAPIUrl + "s/"
        }).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    return {
        CreateContext: createContext,
        UpdateContext: updateContext,
        DeleteContext: deleteContext,
        GetAllContext: getAllContext
    }
});
