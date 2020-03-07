mainApp.factory('twitterService', function ($q, $http, $window,$interval,baseUrls) {

    var authorizationResult = false;

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
        initialize: function () {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('mLdYPWjwkq8lAsaGtPfopq039Uk', {cache: true});
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create('twitter');
        },
        isReady: function () {
            return (authorizationResult);
        },
        //connectTwitter: function () {
        //    var deferred = $q.defer();
        //    OAuth.popup('twitter', {cache: true}, function (error, result) { //cache means to execute the callback if the tokens are already present
        //        if (!error) {
        //            authorizationResult = result;
        //            deferred.resolve();
        //        } else {
        //            //do something if there's an error
        //        }
        //    });
        //    return deferred.promise;
        //},






        connectTwitter: function() {
            var q = $q.defer();
            //Open popup


            $http({
                method: 'POST',
                url: baseUrls.socialConnectorUrl + "TwitterToken",
                data: {}
            }).then(function (response) {

                if (response.data && response.data.IsSuccess) {
                    var uri = "https://api.twitter.com/oauth/authenticate"
                        + '?oauth_token=' + response.data.Result.oauth_token;

                    var popup = $window.open(uri, '', "top=100,left=100,width=500,height=500");

                    var popupChecker = $interval(function () {

                        var oauth_token =  getParameterByName("oauth_token", popup.document.URL);
                        var oauth_verifier =  getParameterByName("oauth_verifier", popup.document.URL);

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
                    }, 1000)
                } else {
                    return false;
                }



            });

            return q.promise;
        },




        getAuth: function () {
            return authorizationResult;
        },
        clearCache: function () {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },
        getLatestTweets: function (obj) {


            //create a deferred object using Angular's $q service
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: baseUrls.socialConnectorUrl + "Profile",
                data: obj
            }).then(function (response) {

                deferred.resolve(response)
            });


            //return the promise of the deferred object
            return deferred.promise;
        },
        addTwitterAccountToSystem: function (postData) {
            postData.access_token_key = authorizationResult.oauth_token;
            postData.access_token_secret = authorizationResult.oauth_token_secret;

            return $http({
                method: 'POST',
                url: baseUrls.socialConnectorUrl + "Twitter",
                data: postData
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return false;
                }
            });
        },

        getTwitterAccounts: function () {
            return $http({
                method: 'GET',
                url: baseUrls.socialConnectorUrl + "Twitters"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },

        deleteTwitterAccount: function (id) {
            return $http({
                method: 'DELETE',
                url: baseUrls.socialConnectorUrl + "Twitter/" + id
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },

        activateTwitterAccount: function (id) {
            var postData = {
                access_token_key: authorizationResult.oauth_token,
                access_token_secret: authorizationResult.oauth_token_secret
            };
            return $http({
                method: 'PUT',
                url: baseUrls.socialConnectorUrl + "Twitter/" + id+"/activate",
                data: postData
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },
        startCronJob: function (id) {

            return $http({
                method: 'POST',
                url: baseUrls.scheduleWorker + "Cron/Reference/"+id+"/Action/start" ///Cron/Reference/:id/Action/:action
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },

        updateTwitterAccountPicture: function (id, postData) {
            return $http({
                method: 'PUT',
                url: baseUrls.socialConnectorUrl + "Twitter/" + id + "/picture",
                data: postData
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        }
    }

});