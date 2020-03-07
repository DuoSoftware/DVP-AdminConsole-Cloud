/**
 * Created by Pawan on 3/22/2017.
 */
mainApp.factory('noticeBackendService', function ($http, authService,baseUrls)
{
    return {

        getNotices: function () {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.notification + "DVP/API/1.0.0.0/NotificationService/SubmittedNotices"
            }).then(function(response)
            {
                return response;
            });
        },

        removeNotice: function (id) {
            var authToken = authService.GetToken();

            return $http({
                method: 'DELETE',
                url:baseUrls.notification + "DVP/API/1.0.0.0/NotificationService/Notice/"+id


            }).then(function(response)
            {
                return response.data;
            });
        },

        sendNotice: function (noticeObj) {
            var authToken = authService.GetToken();

            return $http({
                method: 'POST',
                url: baseUrls.notification + "DVP/API/1.0.0.0/NotificationService/Notice",
                data:noticeObj

            }).then(function(response)
            {
                return response.data;
            });
        },

        updateApplication: function (resource) {
            var authToken = authService.GetToken();

            return $http({
                method: 'PUT',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+resource.id,
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },

        deleteApplication: function (resource) {

            var authToken = authService.GetToken();
            return $http({
                method: 'DELETE',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+resource.id

            }).then(function(response)
            {
                return response;
            });
        },
        getUnassignedFiles: function () {

            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.fileServiceUrl+"Files?fileCategory=IVRCLIPS&fileFormat=audio/wav&assignedState=false"

            }).then(function(response)
            {
                return response;
            });
        },
        getFilesOfApplication: function (appID) {

            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.fileServiceUrl+"Files/Info/"+appID

            }).then(function(response)
            {
                return response;
            });
        },

        attachFilesWithApplication: function (appID,fileID) {

            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.fileServiceUrl+"File/"+fileID+"/AssignToApplication/"+appID

            }).then(function(response)
            {
                return response;
            });
        } ,
        detachFilesFromApplication: function (fileID) {

            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.fileServiceUrl+"File/"+fileID+"/DetachFromApplication"

            }).then(function(response)
            {
                return response;
            });
        },
        getDevelopers: function () {

            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Developers"

            }).then(function(response)
            {
                return response;
            });
        },
        ApplicationAssignToDeveloper: function (appId,devId) {

            var authToken = authService.GetToken();

            return $http({
                method: 'POST',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+appId+"/AssignToDeveloper/"+devId

            }).then(function(response)
            {
                return response;
            });
        }

    }
});