/**
 * Created by Rajinda on 12/31/2015.
 */

mainApp.factory("agentStatusService", function ($http, $log, baseUrls) {

    var getProfileDetails = function () {
        return $http({
            method: 'GET',
            url: baseUrls.ardsmonitoringBaseUrl + "MONITORING/resources",

        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });

        /*return $http({
         method: 'GET',
         url: baseUrls.resourceServiceBaseUrl + "Resources"

         }).then(function (response) {
         if (response.data && response.data.IsSuccess) {
         return response.data.Result;
         } else {
         return null;
         }
         });*/

        /* return $http.get(baseUrls.resourceServiceBaseUrl + "Resources").then(function (response) {
         if (response.data && response.data.IsSuccess) {
         return response.data.Result;
         } else {
         return {};
         }
         });*/

    };

    var getAvailableProfile = function () {

        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "Resources"

        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return null;
            }
        });

        /* return $http.get(baseUrls.resourceServiceBaseUrl + "Resources").then(function (response) {
         if (response.data && response.data.IsSuccess) {
         return response.data.Result;
         } else {
         return {};
         }
         });*/

    };

    var getAllAttributes = function () {
        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "Attributes",

        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }

        });
    };

    var getAllActiveCalls = function () {
        return $http({
            method: 'GET',
            url: baseUrls.monitorrestapi + "Calls",

        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var getProductivity = function () {

        return $http.get(baseUrls.resourceServiceBaseUrl + "Resources/Productivity").then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }
        });
    };

    var getProductivityWithLoginTime = function (startDate, endDate, bu) {

        return $http.get(baseUrls.resourceServiceBaseUrl + "Resources/Productivity?productivityStartDate="+startDate+"&productivityEndDate="+endDate+"&bu="+bu).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }
        });
    };


    return {
        GetAvailableProfile: getAvailableProfile,
        GetProfileDetails: getProfileDetails,
        GetAllAttributes: getAllAttributes,
        GetAllActiveCalls: getAllActiveCalls,
        GetProductivity: getProductivity,
        GetProductivityWithLoginTime: getProductivityWithLoginTime
    }

});
