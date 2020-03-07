/**
 * Created by Pawan on 3/24/2017.
 */
mainApp.factory('attachmentBackendService', function ($http, baseUrls)
{
    return {



        saveNewAttachment: function (resource) {

            return $http({
                method: 'POST',
                url: baseUrls.ticketUrl + "Attachment",
                data:resource

            }).then(function(response)
            {
                return response.data;
            });
        }



    }
});
