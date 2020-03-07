/**
* Created by Lakmini on 13/02/2018.
*/

'use strict';
mainApp.factory("whitelistconfigService", function ($http, $log, $filter,  baseUrls) {

    //Get All Bot apps
    var getallwhitelist = function (botid) {

        return $http({
            method: 'GET',
            url: baseUrls.botplatformUrl + "facebook/bot/" + botid + "/whitelist-url",

        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };

    //save bot app
    var addwhitelist = function (url, botid) {
        return $http({
            method: 'POST',
            url: baseUrls.botplatformUrl + "facebook/bot/" + botid + "/whitelist-url",
            data: url
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    }

    return {
        GetAllWhitelist: getallwhitelist,
        AddWhitelist: addwhitelist
    }
})
