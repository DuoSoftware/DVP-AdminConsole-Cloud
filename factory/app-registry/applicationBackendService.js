/**
 * Created by Pawan on 6/8/2016.
 */

mainApp.factory('appBackendService', function ($http, authService,baseUrls)
{
    return {

        getApplications: function () {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Applications"
            }).then(function(response)
            {
                return response;
            });
        },

        saveNewApplication: function (resource) {
            var authToken = authService.GetToken();

            return $http({
                method: 'POST',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application",
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },

        assignMasterApplication: function (masterId,childId) {
            var authToken = authService.GetToken();

            return $http({
                method: 'POST',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+childId+"/SetAsMasterApp/"+masterId

            }).then(function(response)
            {
                return response;
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