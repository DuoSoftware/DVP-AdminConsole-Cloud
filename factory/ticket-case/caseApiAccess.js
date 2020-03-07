/**
 * Created by Heshan.i on 10/19/2016.
 */

(function(){

    var caseApiAccess = function($http, $q, baseUrls) {

        //----------------------------------Case Configuration----------------------------------------------------------------------

        var createCaseConfiguration = function(caseConfigInfo){
            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl+'CaseConfiguration',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: caseConfigInfo
            }).then(function(response){
                return response.data;
            });
        };

        var deleteCaseConfiguration = function(caseConfigId){
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+'CaseConfiguration/'+caseConfigId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getCaseConfigurations = function(){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'CaseConfiguration',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        //----------------------------------Case----------------------------------------------------------------------

        var createCase = function(caseInfo){
            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl+'Case',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: caseInfo
            }).then(function(response){
                return response.data;
            });
        };

        var getCases = function(){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'Cases',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getCase = function(caseId){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'Case/'+caseId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getTicketsForCase = function(tIds){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'TicketsByIds',
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {ids: tIds}
            }).then(function(response){
                return response.data;
            });
        };

        var addTicketToCase = function(caseId, ticketIds){
            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl+'Case/'+caseId+'/RelatedTickets',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "ticketid": ticketIds
                }
            }).then(function(response){
                return response.data;
            });
        };

        var removeTicketFromCase = function(caseId, ticketIds){
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+'Case/'+caseId+'/RelatedTickets',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "ticketid": ticketIds
                }
            }).then(function(response){
                return response.data;
            });
        };

        var bulkStatusChangeTickets = function(ticketIds, bulkAction, jobId, uploadStatus){
            var deferred = $q.defer();

            var sendObj = {TicketIds: ticketIds, Status: bulkAction.action, specificOperations: bulkAction.specificOperations};
            $http({
                method: 'PUT',
                url: baseUrls.ticketUrl+'Ticket/Status/Bulk',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: sendObj,
                params: {jobId: jobId, uploadStatus: uploadStatus}
            }).then(function(response){

                deferred.resolve(response.data);

            });

            return deferred.promise;
        };

        var deleteCase = function(caseId){
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+'Case/'+caseId,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                return response.data;
            });
        };

        var getAllTags = function () {
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+"Tags"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        };

        var getTagCategories = function () {
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+"TagCategories"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        };

        var getStatusFlowTypes = function () {
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+"TagCategories"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        };

        var getBulkOperationJobId = function (jobType, reference) {
            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl+"Ticket/BulkOperation/JobId",
                data: {JobType:jobType, JobReference: reference}
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        };

        var getBulkOperationByReference = function (jobReference) {
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+"Ticket/BulkOperation/JobIds/jobReference",
                params: {jobReference:jobReference}
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        };

        var removeBulkOperation = function (jobId) {
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl+"Ticket/BulkOperation/JobId/"+jobId
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        };

        return{
            createCaseConfiguration: createCaseConfiguration,
            deleteCaseConfiguration: deleteCaseConfiguration,
            getCaseConfigurations: getCaseConfigurations,
            createCase: createCase,
            getCases: getCases,
            getCase: getCase,
            getTicketsForCase: getTicketsForCase,
            addTicketToCase: addTicketToCase,
            removeTicketFromCase: removeTicketFromCase,
            bulkStatusChangeTickets: bulkStatusChangeTickets,
            deleteCase: deleteCase,
            getAllTags: getAllTags,
            getTagCategories:getTagCategories,
            getBulkOperationJobId: getBulkOperationJobId,
            getBulkOperationByReference: getBulkOperationByReference,
            removeBulkOperation: removeBulkOperation
        };
    };

    var module = angular.module('veeryConsoleApp');
    module.factory('caseApiAccess', caseApiAccess);

}());