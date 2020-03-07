/**
 * Created by Pawan on 8/1/2016.
 * */



mainApp.factory('companyConfigBackendService', function ($http, authService,baseUrls) {
    return {

        getCloudEndUser: function () {
            
            return $http({
                method: 'GET',
                url:baseUrls.clusterconfigUrl +"CloudEndUsers"
            }).then(function(response)
            {
                return response;
            });
        },

        getAuditTrails: function (startTime, endTime, application, property, author, pageSize, pageNo) {

            var url = baseUrls.clusterconfigUrl + 'AuditTrailsPaging' + '?startTime=' + startTime + '&endTime=' + endTime;

            if(application)
            {
                url = url + '&application=' + application;
            }

            if(property)
            {
                url = url + '&property=' + property;
            }

            if(author)
            {
                url = url + '&author=' + author;
            }

            if(pageSize > 0)
            {
                url = url + '&pageSize=' + pageSize;
            }

            if(pageNo > 0)
            {
                url = url + '&pageNo=' + pageNo;
            }

            return $http({
                method: 'GET',
                url:url
            }).then(function(response)
            {
                return response.data;
            });
        },

        getAuditTrailsCount: function (startTime, endTime, application, property, author) {

            var url = baseUrls.clusterconfigUrl + 'AuditTrails/Count' + '?startTime=' + startTime + '&endTime=' + endTime;

            if(application)
            {
                url = url + '&application=' + application;
            }

            if(property)
            {
                url = url + '&property=' + property;
            }

            if(author)
            {
                url = url + '&author=' + author;
            }

            return $http({
                method: 'GET',
                url:url
            }).then(function(response)
            {
                return response.data;
            });
        },

        saveNewEndUser: function (resource) {
            

            return $http({
                method: 'POST',
                url: baseUrls.clusterconfigUrl +"CloudEndUser",
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },

        updateEndUser: function (resource) {
            

            return $http({
                method: 'PUT',
                url: baseUrls.clusterconfigUrl +"CloudEndUser/"+resource.id,
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        getClusters: function () {
            
            return $http({
                method: 'GET',
                url: baseUrls.clusterconfigUrl +"Clouds"
            }).then(function(response)
            {
                return response;
            });
        },
        getContexts: function () {
            
            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"Contexts"
            }).then(function(response)
            {
                return response;
            });
        },
        saveNewContext: function (resource) {
            

            return $http({
                method: 'POST',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"Context",
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        updateContext: function (resource) {

            return $http({
                method: 'PUT',
                url: baseUrls.sipUserendpoint +"SipUser/"  + "Context/" + resource.Context,
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },
        deleteContext: function (resource) {
            

            return $http({
                method: 'DELETE',
                url: baseUrls.sipUserendpoint +"SipUser/"  +"Context/"+resource.Context

            }).then(function(response)
            {
                return response;
            });
        },
        activateTicketTypes: function () {


            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl +"TicketTypes",
                data:{}

            }).then(function(response)
            {
                return response;
            });
        },
        getTicketTypes: function () {


            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl +"TicketTypes"

            }).then(function(response)
            {
                return response.data;
            });
        },
        updateTicketTypes: function (ticketType) {


            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl +"TicketTypes/"+ticketType._id.toString(),
                data: ticketType

            }).then(function(response)
            {
                return response.data;
            });
        },
        addCustomTicketTypes: function (ticketTypeId, customType) {


            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl +"TicketTypes/"+ticketTypeId+"/"+customType

            }).then(function(response)
            {
                return response.data;
            });
        },
        removeCustomTicketTypes: function (ticketTypeId, customType) {


            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl +"TicketTypes/"+ticketTypeId+"/"+customType

            }).then(function(response)
            {
                return response.data;
            });
        },
        addCustomTicketStatus: function (ticketStatus) {
            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl +"TicketStatusNode",
                data: ticketStatus

            }).then(function(response)
            {
                return response.data;
            });
        },
        updateCustomTicketStatus: function (ticketStatus) {
            return $http({
                method: 'PUT',
                url: baseUrls.ticketUrl +"TicketStatusNode/"+ticketStatus._id.toString(),
                data: ticketStatus

            }).then(function(response)
            {
                return response.data;
            });
        },
        getCustomTicketStatus: function () {
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl +"TicketStatusNodes"

            }).then(function(response)
            {
                return response.data;
            });
        },
        removeCustomTicketStatus: function (ticketStatusId) {
            return $http({
                method: 'DELETE',
                url: baseUrls.ticketUrl +"TicketStatusNode/"+ticketStatusId

            }).then(function(response)
            {
                return response.data;
            });
        },

        getTicketPrefixList: function () {

            return $http({
                method: 'GET',
                url:baseUrls.ticketUrl +"TicketPrefixes"
            }).then(function(response)
            {
                return response;
            });
        },
        makeAsDefaultPrefix: function (prefix) {

            return $http({
                method: 'PUT',
                url:baseUrls.ticketUrl +"/TicketPrefix/"+prefix+"/Available"
            }).then(function(response)
            {
                return response;
            });
        },
        checkPrefixAvailability: function (prefix) {

            return $http({
                method: 'GET',
                url:baseUrls.ticketUrl +"TicketPrefix/"+prefix+"/Availability"
            }).then(function(response)
            {
                return response;
            });
        },
        saveNewPrefix: function (prefix) {

            return $http({
                method: 'POST',
                url:baseUrls.ticketUrl +"/TicketPrefix",
                data: prefix
            }).then(function(response)
            {
                return response;
            });
        },
        createChatConfig: function (config) {
            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl +"Chat/Config",
                data: config
            }).then(function(response)
            {
                if (response.data) {
                    return response.data;
                } else {
                    return false;
                }
            });
        },
        getChatConfig: function (config) {
            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl +"Chat/Config",
                data: config
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        createPhoneConfig: function (config) {
            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl +"Phone/Config",
                data: config
            }).then(function(response)
            {
                if (response.data) {
                    return response.data;
                } else {
                    return false;
                }
            });
        },
        getPhoneConfig : function () {
            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl+"Phone/Config"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        updatePhoneConfig : function (config) {
            return $http({
                method: 'put',
                url: baseUrls.UserServiceBaseUrl +"Phone/"+config._id+"/Config",
                data: config
            }).then(function(response)
            {
                if (response.data) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        deletePhoneConfig : function (config) {
            return $http({
                method: 'DELETE',
                url: baseUrls.UserServiceBaseUrl +"Phone/"+config._id+"/Config"
            }).then(function(response)
            {
                if (response.data) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        saveNewUserTag: function (tag) {

            return $http({
                method: 'POST',
                url:baseUrls.UserServiceBaseUrl +"CustomerTag",
                data: tag
            }).then(function(response)
            {
                return response;
            });
        },

        removeUserTag : function (tagName) {
            return $http({
                method: 'DELETE',
                url:baseUrls.UserServiceBaseUrl +"CustomerTag/"+tagName

            }).then(function(response)
            {
                return response;
            });
        },
        getUserTagList: function () {

            return $http({
                method: 'GET',
                url:baseUrls.UserServiceBaseUrl +"CustomerTags"
            }).then(function(response)
            {
                return response;
            });
        },

        createBreakType: function(breakObj){
            return $http({
                method: 'POST',
                url: baseUrls.resourceServiceBaseUrl +"BreakTypes",
                data: breakObj

            }).then(function(response)
            {
                return response.data;
            });
        },
        updateBreakType: function(breakObj){
            return $http({
                method: 'PUT',
                url: baseUrls.resourceServiceBaseUrl +"BreakType/"+breakObj.BreakType,
                data: breakObj

            }).then(function(response)
            {
                return response.data;
            });
        },
        deleteBreakType: function(breakName){
            return $http({
                method: 'DELETE',
                url: baseUrls.resourceServiceBaseUrl +"BreakType/"+breakName

            }).then(function(response)
            {
                return response.data;
            });
        },
        getAllBreakTypes: function(){
            return $http({
                method: 'GET',
                url: baseUrls.resourceServiceBaseUrl +"BreakTypes"

            }).then(function(response)
            {
                return response.data;
            });
        },
        getAllActiveBreakTypes: function(){
            return $http({
                method: 'GET',
                url: baseUrls.resourceServiceBaseUrl +"BreakTypes/Active"

            }).then(function(response)
            {
                return response.data;
            });
        },

        getOrganizationDetail: function () {
            return $http({
                method: 'GET',
                url: baseUrls.organizationServiceBaseUrl +"Organisation"

            }).then(function(response)
            {
                return response.data;
            });
        },
        getConsoleAccessLimits: function () {
            return $http({
                method: 'GET',
                url: baseUrls.organizationServiceBaseUrl +"Organisation/ConsoleAccessLimits"

            }).then(function(response)
            {
                return response.data;
            });
        },
        updateOrganizationDetail: function(companyDetail){
            return $http({
                method: 'PUT',
                url: baseUrls.organizationServiceBaseUrl +"Organisation",
                data: companyDetail

            }).then(function(response)
            {
                return response.data;
            });
        },

        configActiveDirectoryDetail: function(activeDirectoryDetail){
            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl +"ActiveDirectory",
                data: activeDirectoryDetail

            }).then(function(response)
            {
                return response.data;
            });
        },
        updateAbandonCallRedialConfig: function(abandonRedialConfig){
            return $http({
                method: 'POST',
                url: baseUrls.organizationServiceBaseUrl +"Organisation/AbandonCallRedialConfig",
                data: abandonRedialConfig

            }).then(function(response)
            {
                return response.data;
            });
        },
        getAbandonCallRedialConfig: function(){
            return $http({
                method: 'GET',
                url: baseUrls.organizationServiceBaseUrl +"Organisation/AbandonCallRedialConfig"

            }).then(function(response)
            {
                return response.data;
            });
        },
        updateActiveDirectoryDetail: function(activeDirectoryDetail){
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl +"ActiveDirectory/"+activeDirectoryDetail._id,
                data: activeDirectoryDetail

            }).then(function(response)
            {
                return response.data;
            });
        },
        resetActiveDirectoryPassword: function(activeDirectoryId, passwordDetails){
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl +"ActiveDirectory/"+activeDirectoryId+"/ResetPassword",
                data: passwordDetails

            }).then(function(response)
            {
                return response.data;
            });
        },
        removeActiveDirectory: function(activeDirectoryId){
            return $http({
                method: 'DELETE',
                url: baseUrls.UserServiceBaseUrl +"ActiveDirectory/"+activeDirectoryId

            }).then(function(response)
            {
                return response.data;
            });
        },
        getActiveDirectoryDetail: function(){
            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl +"ActiveDirectory"

            }).then(function(response)
            {
                return response.data;
            });
        },
        getUsersFromActiveDirectory: function(){
            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl +"ActiveDirectory/Group/Users"

            }).then(function(response)
            {
                return response.data;
            });
        }

    }
});
