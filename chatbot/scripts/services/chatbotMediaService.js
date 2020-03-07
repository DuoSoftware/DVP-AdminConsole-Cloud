/**
 * Created by Divani on 01/26/2018.
 */

'use strict';
mainApp.factory("botMediaService", function ($http, $log, $filter,  baseUrls) {

    var getAllMediaFiles = function () {
        return $http({
            method: 'GET',
            url: baseUrls.getallMediaFilesAPIUrl
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    return {
        GetAllMediaFiles: getAllMediaFiles
    }
});
