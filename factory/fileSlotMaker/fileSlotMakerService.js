/**
 * Created by Pawan on 11/15/2016.
 */
mainApp.factory('fileSlotService', function ($http, authService,baseUrls)
{
    return {

        getFileSlotArrays: function () {

            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl + "SlotArrays"
            }).then(function(response)
            {
                return response;
            });
        },
        getFileSlotArray: function (slotName) {

            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl + "SlotArray/"+slotName
            }).then(function(response)
            {
                return response;
            });
        },

        saveFileSlotArray: function (resource) {


            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl + "SlotArray",
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        addSlotToArray: function (resource) {


            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl + "SlotArray/"+resource.name+"/slot",
                data:resource.newSlot

            }).then(function(response)
            {
                return response;
            });
        },
        removeSlotArray: function (arrayName) {


            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl + "SlotArray/"+arrayName

            }).then(function(response)
            {
                return response;
            });
        },
        removeSlotFromArray: function (arrayName,slotName) {


            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl + "SlotArray/"+arrayName+"/slot/"+slotName

            }).then(function(response)
            {
                return response;
            });
        },


    }
});