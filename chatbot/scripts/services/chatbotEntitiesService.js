/**
 * Created by Divani on 01/26/2018.
 */

'use strict';
mainApp.factory("chatbotEntitesService", function ($http, $log, $filter,  baseUrls, $auth) {

    var createEntity = function (entity) {
        return $http({
            method: 'POST',
            url: baseUrls.botentitiesAPIUrl,
            data: entity
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var updateEntity = function (entity) {
        console.log(entity);
        return $http({
            method: 'PUT',
            url: baseUrls.botentitiesAPIUrl + "/" + entity._id,
            data: entity
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var deleteEntity = function (entity) {
        console.log(entity);
        return $http({
            method: 'DELETE',
            url: baseUrls.botentitiesAPIUrl + "/" + entity._id,
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var getAllEntity = function () {
        return $http({
            method: 'GET',
            url: baseUrls.botentitiesAPIUrl + "s/"
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
        CreateEntity: createEntity,
        UpdateEntity: updateEntity,
        DeleteEntity: deleteEntity,
        GetAllEntity: getAllEntity
    }
});
