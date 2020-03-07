/**
 * Created by Rajinda on 6/30/2016.
 */

mainApp.factory("conferenceService", function ($http, $log,  baseUrls) {

    var getSipUsers = function () {


        return $http({
            method: 'GET',
            url: baseUrls.sipUserendpoint +"SipUser/"  + "Users"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };


    var getDomains = function () {
        return $http({
            method: 'GET',
            url: baseUrls.clusterconfigUrl + "CloudEndUsers"
        }).then(function (resp) {
            return resp.data;
        })
    };

    var getExtensions = function () {
        return $http({
            method: 'GET',
            /*url: baseUrls.sipUserendpoint +"SipUser/"  + "ExtensionsByCategory/CONFERENCE",*/
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/Conference/AvailableExtensions"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }
        });
    };

    var getExtensionsByConfRoom = function (conferenceName) {
        return $http({
            method: 'GET',
            /*url: baseUrls.sipUserendpoint +"SipUser/"  + "ExtensionsByCategory/CONFERENCE",*/
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/Conference/"+conferenceName+"/AvailableExtensions"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var createExtensions = function (resource) {
        return $http({
            method: 'POST',
            url: baseUrls.sipUserendpoint +"SipUser/"  + "Extension",
            data: resource
        }).then(function (response) {
            return response;
        });
    };

    var getConferenceTemplate = function (resource) {

        return $http({
            method: 'GET',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/Templates",
            data: resource
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var createConference = function (conference) {
        return $http({
            method: 'POST',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceRoom",
            data: conference
        }).then(function (response) {
            return response.data;
        });

    };

    var updateConference = function (conference) {

        return $http({
            method: 'PUT',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceRoom/" + conference.ConferenceName,
            data: conference
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {

                return response.data.Result;


            } else {

                return false;
            }

        });
    };

    var getConferences = function (rowCount,pageNo) {

        return $http({
            method: 'GET',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceRooms/Page/"+rowCount+"/"+pageNo
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {

                return response.data.Result;


            } else {

                return {};
            }

        });

    };

    var deleteConference = function (name) {

        return $http({
            method: 'DELETE',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceRoom/" + name
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var addUserToConference = function (conferenceName, user) {
        return $http({
            method: 'POST',
            /*url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceUser/" + user.id + "/AddToRoom/" + conferenceName,*/
            url: baseUrls.conferenceUrl + "Conference/"+conferenceName+"/user",
            data: user
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getConferenceUsers = function (name) {


        return $http({
            method: 'GET',
            url: baseUrls.conferenceUrl + "Conference/" + name + "/users"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }
        });
    };

    var deleteConferenceUser = function (userID) {
        return $http({
            method: 'DELETE',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceUser/" + userID
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });

    };

    var updateConferenceUser = function (userID, user) {
        return $http({
            method: 'PUT',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceUser/" + userID,
            data: user
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }

        });
    };

    var updateConferenceUserModes = function (userID, user) {
        return $http({
            method: 'POST',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceUser/" + userID + "/Mode",
            data: user
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }

        });

    };


    var userOperations = function (conferenceName,user,operation) {//Mute-UnMute-Deaf-UnDeaf-Kick
        return $http({
            method: 'post',
            url: baseUrls.conferenceUrl + "ConferenceOperations/"+conferenceName+"/ConferenceUser/"+user+"/Action/"+operation
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });
    };

    var getRoomsCount = function () {
        return $http({
            method: 'get',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ConferenceRooms/PageCount"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var getActiveConference = function () {
        return $http({
            method: 'get',
            url: baseUrls.conferenceUrl + "ConferenceConfiguration/ActiveConferenceRooms"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getActiveConferenceUserCount = function (conferenceName) {
        return $http({
            method: 'get',
            url: baseUrls.monitorrestapi + "Conference/"+conferenceName+"/Calls/Count"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var getConferenceActiveUsers = function (conferenceName) {
        return $http({
            method: 'get',
            url: baseUrls.monitorrestapi + "Conference/"+conferenceName+"/RealTimeUsers"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    var getSipUsersCount = function () {


        return $http({
            method: 'GET',
            url: baseUrls.sipUserendpoint +"SipUser/"  + "Users/Count"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };
    var getSipUsersWithPaging = function (page,size) {


        return $http({
            method: 'GET',
            url: baseUrls.sipUserendpoint +"SipUser/"  + "Users?page="+page+"&size="+size
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };

    return {
        GetSipUsers: getSipUsers,
        getDomains: getDomains,
        GetExtensions: getExtensions,
        GetExtensionsByConfRoom:getExtensionsByConfRoom,
        CreateExtensions: createExtensions,
        GetConferenceTemplate: getConferenceTemplate,
        CreateConference: createConference,
        UpdateConference: updateConference,
        GetConferences: getConferences,
        DeleteConference: deleteConference,
        UpdateConferenceUserModes: updateConferenceUserModes,
        UpdateConferenceUser: updateConferenceUser,
        DeleteConferenceUser: deleteConferenceUser,
        GetConferenceUsers: getConferenceUsers,
        AddUserToConference: addUserToConference,
        GetConferenceActiveUsers:getConferenceActiveUsers,
        GetActiveConference:getActiveConference,
        GetActiveConferenceUserCount:getActiveConferenceUserCount,
        UserOperations:userOperations,
        GetRoomsCount:getRoomsCount,
        getSipUsersCount:getSipUsersCount,
        getSipUsersWithPaging:getSipUsersWithPaging


    }

});
