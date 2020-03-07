mainApp.factory("interactionService", function($http, baseUrls){
    return {
        getEnagementSessions: function(filterData) {
            var url = baseUrls.interactionServiceURL + 'EngagementSessions';

            var config = {
                method: 'GET',
                url: url,
                params: filterData
            };

            return $http(config).then(function(resp) {
                return resp.data;
            })
        },

        getEnagementSessionsCount: function(filterData) {
            var url = baseUrls.interactionServiceURL + 'EngagementSessions/Count';

            var config = {
                method: 'GET',
                url: url,
                params: filterData
            };

            return $http(config).then(function(resp) {
                return resp.data;
            })
        }
    }
});
