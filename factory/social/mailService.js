mainApp.factory("mailService", function($http, baseUrls){
    return {
        getEmails: function(filterData) {
            var url = baseUrls.mailSenderUrl + 'Emails/Report';

            var config = {
                method: 'GET',
                url: url,
                params: filterData
            };

            return $http(config).then(function(resp) {
                return resp.data;
            })
        },

        getChatMessages: function(engagementId) {
            var url = baseUrls.mailSenderUrl + 'Chat/Conversation/' + engagementId;

            var config = {
                method: 'GET',
                url: url
            };

            return $http(config).then(function(resp) {
                return resp.data;
            })
        }
    }
});
