(function() {

    var smsReportsService = function($http, authService, baseUrls)
    {

        var getSMSDetailsNoPaging = function(filterData)
        {

            var postData = {};
            var url = baseUrls.ticketUrl + 'SMSDetailReport/data' + '?from=' + filterData.sdate + '&to=' + filterData.edate;

            if(filterData.channel_from)
            {
                postData.channel_from = filterData.channel_from;
            }

            if(filterData.channel_to)
            {
                postData.channel_to = filterData.channel_to;
            }

            if(filterData.direction)
            {
                postData.direction = filterData.direction;
            }

            if(filterData.tz)
            {
                postData.tz = filterData.tz;
            }

            var httpHeaders = {
                method: 'POST',
                url: url
            };

            if(filterData.tz || filterData.channel_from || filterData.channel_to || filterData.direction)
            {
                httpHeaders.data = JSON.stringify(postData);
            }

            return $http(httpHeaders).then(function(resp)
            {
                return resp.data;
            })
        };

        var getSMSDetails = function(filterData)
        {
            var postData = {};
            var url = baseUrls.ticketUrl + 'SMSDetailReport/data/' + filterData.skipCount + '/' + filterData.limitCount + '?from=' + filterData.sdate + '&to=' + filterData.edate;

            if(filterData.channel_from)
            {
                postData.channel_from = filterData.channel_from;
            }

            if(filterData.channel_to)
            {
                postData.channel_to = filterData.channel_to;
            }

            if(filterData.direction)
            {
                postData.direction = filterData.direction;
            }

            var httpHeaders = {
                method: 'POST',
                url: url
            };

            if(filterData.channel_from || filterData.channel_to || filterData.direction)
            {
                httpHeaders.data = JSON.stringify(postData);
            }

            return $http(httpHeaders).then(function(resp)
            {
                return resp.data;
            })
        };

        var getSMSDetailsCount = function(filterData)
        {
            var postData = {};
            var url = baseUrls.ticketUrl + 'SMSDetailReport/count' + '?from=' + filterData.sdate + '&to=' + filterData.edate;

            if(filterData.channel_from)
            {
                postData.channel_from = filterData.channel_from;
            }

            if(filterData.channel_to)
            {
                postData.channel_to = filterData.channel_to;
            }

            if(filterData.direction)
            {
                postData.direction = filterData.direction;
            }

            var httpHeaders = {
                method: 'POST',
                url: url
            };

            if(filterData.channel_from || filterData.channel_to || filterData.direction)
            {
                httpHeaders.data = JSON.stringify(postData);
            }

            return $http(httpHeaders).then(function(resp)
            {
                return resp.data;
            })
        };

        return {
            getSMSDetailsNoPaging: getSMSDetailsNoPaging,
            getSMSDetails: getSMSDetails,
            getSMSDetailsCount: getSMSDetailsCount
        };
    };

    var module = angular.module("veeryConsoleApp");
    module.factory("smsReportsService", smsReportsService);

}());
