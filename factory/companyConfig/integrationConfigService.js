/**
 * Created by Waruna on 7/3/2017.
 * */

mainApp.factory("integrationConfigService", function ($http, authService,baseUrls) {
    return {

        saveIntegrationAPIDetails: function (postData) {
            return $http({
                method: 'POST',
                url:baseUrls.integrationapi +"IntegrationInfo",
                data:postData
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        getIntegrationAPIDetails: function () {
            return $http({
                method: 'GET',
                url: baseUrls.integrationapi +"IntegrationInfo"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        deleteIntegrationAPIDetails: function (id) {
            return $http({
                method: 'DELETE',
                url: baseUrls.integrationapi +"IntegrationInfo/"+id
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },

        getAppDetails: function () {
            return $http({
                method: 'GET',
                url: baseUrls.integrationapi +'AppInfo'
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        deleteAppDetails: function (id) {
            return $http({
                method: 'DELETE',
                url: baseUrls.integrationapi +"AppInfo/"+id
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },

        deleteAppAction: function (appId, action) {
            return $http({
                method: 'DELETE',
                url: baseUrls.integrationapi +"AppInfo/" + appId + "/action/" + action._id
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },

        saveAppDetails: function (appData) {
            return $http({
                method: 'POST',
                url:baseUrls.integrationapi +'AppInfo',
                data:appData
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        updateAppDetails: function (appData) {

            return $http({
                method: 'PUT',
                url: baseUrls.integrationapi + 'AppInfo/' + appData._id,
                data: appData
            }).then(function (resp) {
                return resp.data;
            })
        },

        createAction: function (appId, action) {

            return $http({
                method: 'PUT',
                url: baseUrls.integrationapi + 'AppInfo/' + appId + '/action',
                data: action
            }).then(function (resp) {
                return resp.data;
            })
        },

        updateAction: function (appId, action) {

            return $http({
                method: 'PUT',
                url: baseUrls.integrationapi + 'AppInfo/' + appId + '/action/' + action._id,
                data: action
            }).then(function (resp) {
                return resp.data;
            })
        },

        addDefaultIntegration: function(appId, integrationData){
            return $http({
                method: 'POST',
                url: baseUrls.integrationapi + 'AppInfo/' + appId +'/defaultIntegration',
                data: integrationData
            }).then(function (resp) {
                return resp.data;
            })
        },

        updateDefaultIntegration: function(appId, integrationData){
            return $http({
                method: 'PUT',
                url: baseUrls.integrationapi + 'AppInfo/' + appId +'/defaultIntegration/' + integrationData._id ,
                data: integrationData
            }).then(function (resp) {
                return resp.data;
            })
        },
        getAppById: function (appId) {
            return $http({
                method: 'GET',
                url: baseUrls.integrationapi + 'AppInfo/' + appId
            }).then(function (resp) {
                return resp.data;
            });
        },

        getWebhooks: function () {
            return $http({
                method: 'GET',
                url: baseUrls.integrationapi +'Webhooks'
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        saveWebhook: function (webhookData) {
            return $http({
                method: 'POST',
                url: baseUrls.integrationapi +'Webhooks',
                data: webhookData
            }).then(function(response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        updateWebhook: function (webhookData) {
            return $http({
                method: 'PUT',
                url: baseUrls.integrationapi + 'Webhooks/' + webhookData._id,
                data: webhookData
            }).then(function (resp) {
                return resp.data;
            })
        },

        updateWebhookStatus: function (id, enabledStatus) {
            return $http({
                method: 'PUT',
                url: baseUrls.integrationapi + 'Webhooks/' + id + '/status',
                data: {
                    enabledStatus: enabledStatus
                }
            }).then(function (resp) {
                return resp.data;
            })
        },

        deleteWebhook: function (id) {
            return $http({
                method: 'DELETE',
                url: baseUrls.integrationapi + 'Webhooks/' +id
            }).then(function(response) {
                if (response.data && response.data.IsSuccess) {
                    return true;
                } else {
                    return false;
                }
            });
        },
    }
});
