/**
 * Created by Heshan.i on 9/14/2016.
 */

(function(){
    var slaApiAccess = function($http, baseUrls){
//create ticket trigger
        var createSla = function(sla){
            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl+'SLA',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: sla
            }).then(function(response){
                return response.data;
            });
        };

        var updateSla = function(sla){
            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl+'SLA/'+sla._id,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: sla
            }).then(function(response){
                return response.data;
            });
        };

        var getAllSla = function(){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'SLAs'
            }).then(function(response){
                return response.data;
            });
        };

        var getSla = function(slaId){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'SLA/'+slaId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var deleteSla = function(slaId){
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+'SLA/'+slaId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var addFilterAll = function(slaId, filterAll){
            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Filter/All',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: filterAll
            }).then(function(response){
                return response.data;
            });
        };

        var getFiltersAll = function(slaId){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Filters/All',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var removeFilterAll = function(slaId, filterId){
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Filter/All/'+filterId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var addFilterAny = function(slaId, filterAny){
            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Filter/Any',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: filterAny
            }).then(function(response){
                return response.data;
            });
        };

        var getFiltersAny = function(slaId){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Filters/Any',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var removeFilterAny = function(slaId, filterId){
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Filter/Any/'+filterId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var addMatrix = function(slaId, matrix){
            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Matrix',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: matrix
            }).then(function(response){
                return response.data;
            });
        };

        var getMatrices = function(slaId){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Matrixs',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var removeMatrix = function(slaId, matrixId){
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+'SLA/'+slaId+'/Matrix/'+matrixId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        return{
            createSla: createSla,
            updateSla: updateSla,
            getAllSla: getAllSla,
            getSla: getSla,
            deleteSla: deleteSla,
            addFilterAll: addFilterAll,
            getFiltersAll: getFiltersAll,
            removeFilterAll: removeFilterAll,
            addFilterAny: addFilterAny,
            getFiltersAny: getFiltersAny,
            removeFilterAny: removeFilterAny,
            addMatrix: addMatrix,
            getMatrices: getMatrices,
            removeMatrix: removeMatrix
        };
    };

    var module = angular.module('veeryConsoleApp');
    module.factory('slaApiAccess', slaApiAccess);
}());