/**
 * Created by Pawan on 8/5/2016.
 */

mainApp.factory('transBackendService', function ($http, baseUrls)
{
    return {

        getTranslations: function () {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceUrl+'CallRuleApi/Translations'
            }).then(function(response)
            {
                return response;
            });
        },

        saveTranslations: function (resource) {

            return $http({
                method: 'POST',
                url: baseUrls.ruleServiceUrl+'CallRuleApi/Translation',
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },

        updateTranslations: function (transId, translation) {

            return $http({
                method: 'PUT',
                url: baseUrls.ruleServiceUrl+'CallRuleApi/Translation/' + transId,
                data:translation

            }).then(function(response)
            {
                return response;
            });
        },

        deleteTranslation: function (translation) {

            return $http({
                method: 'DELETE',
                url: baseUrls.ruleServiceUrl+'CallRuleApi/Translation/'+translation.id

            }).then(function(response)
            {
                return response;
            });
        }

    }
});