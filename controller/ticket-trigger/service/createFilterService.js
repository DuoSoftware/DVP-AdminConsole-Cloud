/**
 * Created by Damith on 9/29/2016.
 */
mainApp.factory('ticketFilterService', function ($http,  baseUrls) {
    return {
        getMainFiledList: function () {
            return $http({
                method: 'get',
                url: baseUrls.ticketUrl + 'TicketSchema'
            }).then(function (response) {
                return response.data.Result;
            });
        },
        getAllTicketViews: function () {
            return $http({
                method: 'get',
                url: baseUrls.ticketUrl + 'TicketViews'
            }).then(function (response) {
                return response.data.Result;
            });
        },
        addTicketView: function (ticketViewObj) {
            return $http({
                method: 'post',
                url: baseUrls.ticketUrl + 'TicketView',
                data: JSON.stringify(ticketViewObj)
            }).then(function (response) {
                return response.data;
            });
        },
        getTicketViewById: function (id) {
            return $http({
                method: 'get',
                url: baseUrls.ticketUrl + 'TicketView/' + id
            }).then(function (response) {
                return response.data;
            });
        },
        updateTicketViewById: function (id, ticketViewObj) {
            return $http({
                method: 'put',
                url: baseUrls.ticketUrl + 'TicketView/' + id,
                data: JSON.stringify(ticketViewObj)
            }).then(function (response) {
                return response.data;
            });
        }
    }
});

