/**
* Created by Lakmini on 01/02/2018.
*/

'use strict';
mainApp.factory("botappconfigService", function ($http, $log, $filter,  baseUrls) {

    //Get All Bot apps
    var getallbotapps = function (bot) {

        return $http({
            method: 'GET',
            url: baseUrls.botAPIUrl + "BotApps",

        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };

    //save bot app
    var savenewbotapp = function (botapp) {
        return $http({
            method: 'POST',
            url: baseUrls.botAPIUrl + "BotApp",
            data: botapp
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    }


    //update bot app
    var updatebotapp = function (botapp, botID) {
        return $http({
            method: 'PUT',
            url: baseUrls.botAPIUrl + "BotApp/" + botID,
            data: botapp
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    }

    //update bot apps
    var updatebotapps = function (botapps) {
        return $http({
            method: 'PUT',
            url: baseUrls.botAPIUrl + "BotApps",
            data: botapps
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    }
    var deletebotapps = function (botID) {
        return $http({
            method: 'DELETE',
            url: baseUrls.botAPIUrl + "BotApp/" + botID
          
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    }
    return {
        GetAllBotApps: getallbotapps,
        SavenewBotApp: savenewbotapp,
        UpdateBotApp: updatebotapp,
        UpdateBotApps: updatebotapps,
        DeleteBotApp: deletebotapps


    }
});
