/**
 * Created by dinusha on 6/11/2016.
 */

(function() {

    var scheduleWorkerService = function($http, baseUrls)
    {
        //var authToken = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3YXJ1bmEiLCJqdGkiOiJhNmE4MzliMS1iYzYyLTQ4ZGEtOTA2OS01NzFiZWIzOWE4ZmIiLCJzdWIiOiJBY2Nlc3MgY2xpZW50IiwiZXhwIjoxNDY2NzYxMjkwLCJ0ZW5hbnQiOjEsImNvbXBhbnkiOjI0LCJhdWQiOiJteWFwcCIsImNvbnRleHQiOnt9LCJzY29wZSI6W3sicmVzb3VyY2UiOiJhcmRzcmVzb3VyY2UiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiYXJkc3JlcXVlc3QiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyUHJvZmlsZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJvcmdhbmlzYXRpb24iLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfSx7InJlc291cmNlIjoicmVzb3VyY2UiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6InBhY2thZ2UiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6ImNvbnNvbGUiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6InVzZXJTY29wZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyQXBwU2NvcGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlck1ldGEiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlckFwcE1ldGEiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiY2xpZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImNsaWVudFNjb3BlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InN5c21vbml0b3JpbmciLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6ImRhc2hib2FyZGV2ZW50IiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJkYXNoYm9hcmRncmFwaCIsImFjdGlvbnMiOlsicmVhZCJdfV0sImlhdCI6MTQ2NjE1NjQ5MH0.gpRVdXlv9ideKcCxZX4jUGEBXKS7ew_sHm0QSzVT7gI';
        var getCrons = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.scheduleWorker + 'Crons'
            }).then(function(resp)
            {
                return resp.data;
            })
        };


        var addNewCronSchedule = function(cronInfo)
        {
            var jsonStr = JSON.stringify(cronInfo);

            return $http({
                method: 'POST',
                url: baseUrls.scheduleWorker + 'Cron',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var updateCronSchedule = function(uniqueId, cronInfo)
        {
            var jsonStr = JSON.stringify(cronInfo);

            return $http({
                method: 'PUT',
                url: baseUrls.scheduleWorker + 'Cron/' + uniqueId,
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };


        var removeCron = function(id)
        {
            return $http({
                method: 'DELETE',
                url: baseUrls.scheduleWorker + 'Cron/' + id
            }).then(function(resp)
            {
                return resp.data;
            })
        };




        return {
            getCrons: getCrons,
            addNewCronSchedule: addNewCronSchedule,
            removeCron: removeCron,
            updateCronSchedule: updateCronSchedule
        };



    };



    var module = angular.module("veeryConsoleApp");
    module.factory("scheduleWorkerService", scheduleWorkerService);

}());
