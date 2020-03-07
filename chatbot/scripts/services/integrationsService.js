/**
 * Created by Lakmini on 01/29/2018.
 */
'use strict';
mainApp.factory("integrationsService", function ($http, $log, $filter,  baseUrls) {
    var configapp = function (configdetails,appmodule) {
        var url = "";
        if (appmodule == "FaceBook") {
            url = baseUrls.botAPIUrl + "channel/facebook"
        } else if (appmodule == "Slack") {
            url = baseUrls.botAPIUrl + "channel/slack"
        }
        return $http({
            method: 'POST',
            url: url,            
            data: configdetails
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };
    return {
        ConfigApp: configapp

    }
})
