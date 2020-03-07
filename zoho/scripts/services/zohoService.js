mainApp.factory('zohoService', function ($q, $http, $window,$interval,baseUrls) {


    var getParameterByName  =function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    return {
        isReady: function () {
            return false;
        },
        clearCache: function () {
            return false;
        },
        connectZoho: function() {
            var q = $q.defer();
            var uri = "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.crmphonebridge.CREATE,ZohoCRM.crmphonebridge.READ&client_id=1000.9CA76T07V09456782NDROVGLVH8D16&redirect_uri=console.veery.cloud/zoho/crm&state=veery &response_type=code&access_type=offline&prompt=consent";

            var popup = $window.open(uri, '', "top=100,left=100,width=500,height=500");

            var popupChecker = $interval(function () {

                console.log(popup);
                var url = undefined;
                if(popup && popup.document && popup.document.URL){
                    url = popup.document.URL;
                }

                var oauth_token =  getParameterByName("code", url);
                var oauth_verifier =  getParameterByName("state", url);

                if (oauth_token != undefined && oauth_verifier != undefined) {
                    //The popup put returned a user! Resolve!
                    q.resolve({oauth_token: oauth_token,
                        oauth_verifier: oauth_verifier});
                    $interval.cancel(popupChecker);
                    popup.close();

                    //Save and apply user locally
                    //$rootScope.setCurrentUser(window.oAuthUser);
                    //Cleanup
                    //window.oAuthUser = undefined;
                } else if (popup.closed) {
                    $interval.cancel(popupChecker);
                    console.log("Error logging in.");
                    q.reject();
                }
                console.log('tick');
            }, 5000)
            return q.promise;
        },
        ImportZohoUsers:function () {
            return $http({
                method: 'PUT',
                url: baseUrls.zohoAPIUrl+"Zoho/Integration/Users/Import"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });

        },GetUsers:function () {
            return $http({
                method: 'GET',
                url: baseUrls.zohoAPIUrl+"Zoho/Integration/Users"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        EnableZohoUserCallControl:function (user) {
            return $http({
                method: 'PUT',
                url: baseUrls.zohoAPIUrl+"Zoho/Integration/User/"+user._id+"/CallController"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        EnableZohoUsersCallControl:function (users) {

            return $http({
                method: 'PUT',
                url: baseUrls.zohoAPIUrl+"CRM/Integration/Users/CallController",
                data:{userids:users}
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        DisableZohoUserCallControl:function (user) {
            return $http({
                method: 'DELETE',
                url: baseUrls.zohoAPIUrl+"Zoho/Integration/User/"+user._id+"/CallController"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        CreateZohoAccount:function (code) {
            return $http({
                method: 'POST',
                url: baseUrls.zohoAPIUrl+"Zoho/Account/"+code
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        EnableZohoIntegration: function () {
            return $http({
                method: 'PUT',
                url: baseUrls.zohoAPIUrl + "Zoho/Integration/Event"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        DisableZohoIntegration: function () {
            return $http({
                method: 'DELETE',
                url: baseUrls.zohoAPIUrl + "Zoho/Integration/Event"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        GetZohoAccount: function () {
            return $http({
                method: 'GET',
                url: baseUrls.zohoAPIUrl + "Zoho/Integration/Account"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        }
    }

});