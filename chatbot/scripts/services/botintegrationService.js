/**
 * Created by Divani on 01/26/2018.
 */

'use strict';
mainApp.factory("botintegrationService", function ($http, $log, $filter,  baseUrls) {

    var createIntegration = function (template) {
        return $http({
            method: 'POST',
            url: baseUrls.integrationAPIUrl + "Integration/",
            data: template
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var updateIntegration = function (template) {
        console.log(template);
        return $http({
            method: 'PUT',
            url: baseUrls.integrationAPIUrl + "Integration/"+ template._id,
            data: template
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var deleteIntegration = function (template) {
        console.log(template);
        return $http({
            method: 'DELETE',
            url: baseUrls.integrationAPIUrl + "Integration/"+ template._id,
            data: template
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var getAllIntegrations = function () {
        return $http({
            method: 'GET',
            url: baseUrls.integrationAPIUrl + "Integrations/"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    return {
        CreateIntegration: createIntegration,
        UpdateIntegration: updateIntegration,
        DeleteIntegration: deleteIntegration,
        GetAllIntegrations: getAllIntegrations
    }
});
