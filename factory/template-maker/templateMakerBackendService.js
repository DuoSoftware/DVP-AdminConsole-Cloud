/**
 * Created by Pawan on 8/11/2016.
 */

mainApp.factory('templateMakerBackendService', function ($http, baseUrls)
{
    return {

        saveTemplate: function (resource) {
            return $http({
                method: 'POST',
                url: baseUrls.templatesUrl+'RenderService/Template',
                data:resource
            }).then(function(response)
            {
                return response;
            });
        },

        pickTemplates: function () {

            return $http({
                method: 'GET',
                url: baseUrls.templatesUrl+'RenderService/Templates'

            }).then(function(response)
            {
                return response;
            });
        },

        renderTemplate: function (templateName,paramData) {

            return $http({
                method: 'POST',
                url: baseUrls.templatesUrl+'RenderService/RenderTemplate/'+templateName,
                data:paramData

            }).then(function(response)
            {
                return response;
            });
        },

        deleteTemplates : function (templateName) {

            return $http({
                method: 'DELETE',
                url: baseUrls.templatesUrl+'RenderService/Template/'+templateName,

            }).then(function(response)
            {
                return response;
            });
        },
        deleteStylesOfTemplate : function (templateId,styleId) {

            return $http({
                method: 'DELETE',
                url: baseUrls.templatesUrl+'RenderService/Template/'+templateId+'/Style/'+styleId

            }).then(function(response)
            {
                return response;
            });
        },

        updateTemplateContentData: function (templateId,resource) {

            return $http({
                method: 'PUT',
                url: baseUrls.templatesUrl+'RenderService/Template/'+templateId,
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        updateTemplateAssignedStyles: function (templateId,resource) {

            return $http({
                method: 'PUT',
                url: baseUrls.templatesUrl+'RenderService/Template/'+templateId+'/AllStyles',
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        addTemplateNewStyles: function (templateId,resource) {

            return $http({
                method: 'POST',
                url: baseUrls.templatesUrl+'RenderService/Template/'+templateId+'/Styles',
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        getAllChatTemplates: function () {

            return $http({
                method: 'GET',
                url: baseUrls.templatesUrl+'TemplateService/MyChatTemplates'

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        saveNewChatTemplate: function (resource) {
            return $http({
                method: 'POST',
                url: baseUrls.templatesUrl+'TemplateService/ChatTemplate',
                data:resource
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        removeChatTemplate: function (tempID) {
            return $http({
                method: 'DELETE',
                url: baseUrls.templatesUrl+'TemplateService/ChatTemplate/'+tempID

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        }

    }
});