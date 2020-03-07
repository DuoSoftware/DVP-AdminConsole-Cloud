/**
 * Created by Rajinda on 08/17/2017.
 */
'use strict';
mainApp.factory("reportQueryFilterService", function ($http, baseUrls) {

    return {

        SaveReportQueryFilter: function (reportName, filterData) {
            var reportFilter = {
                "ReportFilter": filterData
            };
            return $http({
                method: 'POST',
                url: baseUrls.reportQueryFilterUrl + reportName,
                data: reportFilter
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return false;
                }

            });
        },

        GetReportQueryFilter: function (reportName) {

            return $http({
                method: 'GET',
                url: baseUrls.reportQueryFilterUrl + reportName
            }).then(function (response) {
                if (response.data && response.data.IsSuccess && response.data.Result) {
                    return response.data.Result.reportFilter;
                } else {
                    return null;
                }
            });
        }
    }

});




