/**
 * Created by dinusha on 6/11/2016.
 */

(function() {

    var phnNumApiAccess = function($http, baseUrls)
    {
        //var authToken = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3YXJ1bmEiLCJqdGkiOiJhNmE4MzliMS1iYzYyLTQ4ZGEtOTA2OS01NzFiZWIzOWE4ZmIiLCJzdWIiOiJBY2Nlc3MgY2xpZW50IiwiZXhwIjoxNDY2NzYxMjkwLCJ0ZW5hbnQiOjEsImNvbXBhbnkiOjI0LCJhdWQiOiJteWFwcCIsImNvbnRleHQiOnt9LCJzY29wZSI6W3sicmVzb3VyY2UiOiJhcmRzcmVzb3VyY2UiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiYXJkc3JlcXVlc3QiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyUHJvZmlsZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJvcmdhbmlzYXRpb24iLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfSx7InJlc291cmNlIjoicmVzb3VyY2UiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6InBhY2thZ2UiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6ImNvbnNvbGUiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6InVzZXJTY29wZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyQXBwU2NvcGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlck1ldGEiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlckFwcE1ldGEiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiY2xpZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImNsaWVudFNjb3BlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InN5c21vbml0b3JpbmciLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6ImRhc2hib2FyZGV2ZW50IiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJkYXNoYm9hcmRncmFwaCIsImFjdGlvbnMiOlsicmVhZCJdfV0sImlhdCI6MTQ2NjE1NjQ5MH0.gpRVdXlv9ideKcCxZX4jUGEBXKS7ew_sHm0QSzVT7gI';
        var getMyNumbers = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumbers'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getTrunkIpAddresses = function(trunkId)
        {
            return $http({
                method: 'GET',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/Trunk/' + trunkId + '/IpAddresses'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getTrunks = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/Trunks'
            }).then(function(resp)
            {
                return resp.data;
            })
        };


        var getTranslations = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/Translations'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getTrunk = function(trunkId)
        {
            return $http({
                method: 'GET',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/Trunk/' + trunkId
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var addNewTrunk = function(trunkInfo)
        {
            var jsonStr = JSON.stringify(trunkInfo);

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/Trunk',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var updateTrunk = function(trunkId, trunkInfo)
        {
            var jsonStr = JSON.stringify(trunkInfo);

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/Trunk/' + trunkId,
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var addTrunkIpAddress = function(trunkId, ipAddressInfo)
        {
            var jsonStr = JSON.stringify(ipAddressInfo);

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/Trunk/' + trunkId + '/IpAddress',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var removeTrunkIpAddress = function(trunkId, ipAddressId)
        {
            return $http({
                method: 'DELETE',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/Trunk/' + trunkId + '/IpAddress/' + ipAddressId
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var removeTrunkNumber = function(phoneNumber)
        {
            return $http({
                method: 'DELETE',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumber/' + phoneNumber
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getLimits = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Limit/Info'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var savePhoneNumber = function(phnNumInfo)
        {
            if(!phnNumInfo.InboundLimitId)
            {
                phnNumInfo.InboundLimitId = null;
            }

            if(!phnNumInfo.OutboundLimitId)
            {
                phnNumInfo.OutboundLimitId = null;
            }

            if(!phnNumInfo.BothLimitId)
            {
                phnNumInfo.BothLimitId = null;
            }
            var jsonStr = JSON.stringify(phnNumInfo);

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumber',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var updatePhoneNumber = function(phnNumInfo)
        {
            if(!phnNumInfo.InboundLimitId)
            {
                phnNumInfo.InboundLimitId = null;
            }

            if(!phnNumInfo.OutboundLimitId)
            {
                phnNumInfo.OutboundLimitId = null;
            }

            if(!phnNumInfo.BothLimitId)
            {
                phnNumInfo.BothLimitId = null;
            }

            var jsonStr = JSON.stringify(phnNumInfo);

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumber/'+ phnNumInfo.PhoneNumber,
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var setInboundLimitToNumber = function(authToken, trunkNumber, limitId)
        {

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumber/' + trunkNumber + '/SetInboundLimit/' + limitId
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var setOutboundLimitToNumber = function(authToken, trunkNumber, limitId)
        {

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumber/' + trunkNumber + '/SetOutboundLimit/' + limitId
            }).then(function(resp)
            {
                return resp.data;
            })
        };


        var setBothLimitToNumber = function(authToken, trunkNumber, limitId)
        {

            return $http({
                method: 'POST',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumber/' + trunkNumber + '/SetBothLimit/' + limitId
            }).then(function(resp)
            {
                return resp.data;
            })
        };


        return {
            getMyNumbers: getMyNumbers,
            getLimits: getLimits,
            savePhoneNumber: savePhoneNumber,
            setInboundLimitToNumber: setInboundLimitToNumber,
            setOutboundLimitToNumber: setOutboundLimitToNumber,
            setBothLimitToNumber: setBothLimitToNumber,
            getTrunkIpAddresses: getTrunkIpAddresses,
            addTrunkIpAddress: addTrunkIpAddress,
            removeTrunkIpAddress: removeTrunkIpAddress,
            getTrunks: getTrunks,
            getTrunk: getTrunk,
            addNewTrunk: addNewTrunk,
            updateTrunk: updateTrunk,
            getTranslations: getTranslations,
            updatePhoneNumber: updatePhoneNumber,
            removeTrunkNumber: removeTrunkNumber
        };



    };



    var module = angular.module("veeryConsoleApp");
    module.factory("phnNumApiAccess", phnNumApiAccess);

}());
