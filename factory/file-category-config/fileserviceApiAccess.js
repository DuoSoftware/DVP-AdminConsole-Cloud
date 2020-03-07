/**
 * Created by Pawan on 2/14/2018.
 */


(function () {

    var fileServiceApiAccess = function ($http, authService, baseUrls) {

        var addNewFileCategory = function (obj) {

            return $http({
                method: 'POST',
                url: baseUrls.fileServiceUrl + 'FileCategory',
                data:obj

            }).then(function (resp) {
                return resp.data;
            })
        };

        var getAllFileCategories= function () {

            return $http({
                method: 'GET',
                url: baseUrls.fileServiceUrl + 'FileCategories?All=true'

            }).then(function (resp) {
                return resp.data;
            })
        };

        var updateFileCategory = function (catId,obj) {
            return $http({
                method: 'PUT',
                url: baseUrls.fileServiceUrl + 'FileCategory/'+catId,
                data:obj

            }).then(function (resp) {
                return resp.data;
            })
        };

        var getDefaultFileStorageOption = function () {

            return $http({
                method: 'GET',
                url: baseUrls.fileServiceUrl + 'DefaultStorage'

            }).then(function (resp) {
                return resp.data;
            })
        };





        return {
            addNewFileCategory: addNewFileCategory,
            getAllFileCategories: getAllFileCategories,
            updateFileCategory: updateFileCategory,
            getDefaultFileStorageOption: getDefaultFileStorageOption

        };
    };


    var module = angular.module("veeryConsoleApp");
    module.factory("fileServiceApiAccess", fileServiceApiAccess);

}());
