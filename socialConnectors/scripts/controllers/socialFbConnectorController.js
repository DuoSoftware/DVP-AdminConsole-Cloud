mainApp.controller('socialFbConnectorController', function FormBuilderCtrl($scope, $window, socialConnectorService, $anchorScroll) {
    $anchorScroll();

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $window.fbAsyncInit = function () {

        /*FB.init({
            appId      : '1339841416135058',
            cookie     : true,
            xfbml      : true,
            version    : 'v2.12'
        });

        FB.AppEvents.logPageView();*/

        
        FB.init({
            appId: '341368403128273',
            cookie: true,
            xfbml: true,
            version: 'v3.2'
        });

        FB.getLoginStatus(function(response) {
            console.log(response);
        });

        /* FB.init({
         appId: '825442624259571', // App ID
         channelUrl: '', // Channel File
         status: true, // check login status
         cookie: true, // enable cookies to allow the server to access the session
         xfbml: true,  // parse XFBML
         oAuth: true
         });*/


        FB.Event.subscribe('auth.authResponseChange', function (response) {
            if (response.status === 'connected') {
                document.getElementById("message").innerHTML = "Connected to Facebook";
                $scope.getUserPageList(response.authResponse);
                //SUCCESS

            }
            else if (response.status === 'not_authorized') {
                document.getElementById("message").innerHTML += "Failed to Connect";

                //FAILED
            } else {
                document.getElementById("message").innerHTML += "Logged Out";

                //UNKNOWN ERROR
            }
        });

    };

    $scope.Login = function () {
        document.getElementById("message").innerHTML = "Connecting.....";
        FB.login(function (response) {
            if (response.authResponse) {
                $scope.getUserPageList(response.authResponse);

            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'manage_pages,publish_pages,email'});

       /* FB.login(function(response) {
            if (response.authResponse) {
                $scope.getUserPageList(response.authResponse);
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'manage_pages,email,publish_pages '});*/

        //scope: 'public_profile,user_posts,email,manage_pages,publish_pages,read_page_mailboxes,read_page_mailboxes,pages_show_list,pages_manage_cta,pages_manage_instant_articles'
        //scope=manage_pages,publish_pages,publish_actions
    };

    $scope.fbPageList = [];
    $scope.auth = "";
    $scope.getUserPageList = function (auth) {
        FB.api('/me?fields=accounts{access_token,category,name,id,picture.type(large)},picture,email,name&access_token=', function (response) {//me/accounts?fields=id,picture,category,email,name&access_token=
            $scope.safeApply(function () {
                if(response.accounts && response.accounts.data && response.accounts.data.length>0)
                {
                    $scope.fbPageList = response.accounts.data.map(function (item, index) {
                        item.auth = auth;
                        item.email = response.email;
                        item.profileID = response.id;
                        item.profileName = response.name;
                        return item;
                    });
                }


            });
            $scope.auth = auth.accessToken;

            /*


             var str="<b>Name</b> : "+response.name+"<br>";
             str +="<b>Link: </b>"+response.link+"<br>";
             str +="<b>Username:</b> "+response.username+"<br>";
             str +="<b>id: </b>"+response.id+"<br>";
             str +="<b>Email:</b> "+response.email+"<br>";
             str +="<input type='button' value='Get Photo' ng-click='getPhoto();'/>";
             str +="<input type='button' value='Logout' ng-click='Logout();'/>";
             document.getElementById("status").innerHTML=str;*/

        });
    };

    $scope.getPhoto = function () {
        FB.api('/me/picture?type=normal', function (response) {

            var str = "<br/><b>Pic</b> : <img src='" + response.data.url + "'/>";
            document.getElementById("status").innerHTML += str;

        });

    };

    $scope.Logout = function () {
        FB.logout(function () {
            document.location.reload();
        });
    };

    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.addPageToSystem = function (page) {
        var data = {
            "id": page.id,
            "profileID": page.profileID,
            "profileName": page.profileName,
            "fb": {
                "access_token": page.auth.accessToken,
                "pageID": page.id,
                "pagePicture": page.picture.data.url,
                "firstName": page.name,
                "lastName": page.category,
                "email": page.email,
                "ticketToPost": true,
                "subscribe": true,
                "status": true,
                "auth": page.auth
            }
        };
        socialConnectorService.AddFacebookPageToSystem(data).then(function (response) {
            if (response) {
                $scope.showAlert("Add FB Page", 'success', "Successfully Added to System");
                //document.getElementById("status")
                $("#" + page.id + "").addClass("avoid-clicks");
                $scope.GetFacebookAccounts();
            }
            else {
                $scope.showAlert("Add FB Page", "error", "Fail To Add Selected Page to System.");
            }

        }, function (error) {
            $scope.showAlert("Add FB Page", "error", "Fail To Add Selected Page to System.");
            console.error("AddFacebookPageToSystem err");
        });
    };
    $scope.isLoading = true;
    $scope.GetFacebookAccounts = function () {
        $scope.isLoading = true;
        socialConnectorService.GetFacebookAccounts().then(function (response) {
            $scope.isLoading = false;
            $scope.exssitingPageList = response;
        }, function (error) {
            console.error("AddFacebookPageToSystem err");
            $scope.isLoading = false;
        });
    };
    $scope.GetFacebookAccounts();

    $scope.DeleteFacebookAccount = function (page) {
        socialConnectorService.DeleteFacebookAccount(page._id).then(function (response) {
            if (response) {
                $scope.GetFacebookAccounts();
                $scope.showAlert("Remove FB Page", 'success', "Successfully Remove Page from System.");
            }
            else {
                $scope.showAlert("Remove FB Page", 'error', "Fail To Remove Page.");
            }
        }, function (error) {
            console.error("AddFacebookPageToSystem err");
            $scope.isLoading = false;
        });


        /* var a = $scope.fbPageList.indexOf(page);
         $scope.fbPageList.splice(a, 1);*/
    };

    $scope.updatePicture = function (page) {
        FB.api('/' + page.id + '/picture?type=large', function (response) {//me/accounts?fields=id,picture,category,email,name&access_token=
            if (response) {
                socialConnectorService.UpdatePagePicture(page._id, {"picture": response.data.url}).then(function (response) {
                    if (response) {
                        $scope.GetFacebookAccounts();
                        $scope.showAlert("FB Page", 'success', "Successfully Update Profile Picture.");
                    }
                    else {
                        $scope.showAlert("FB Page", 'error', "Fail To Update.");
                    }
                }, function (error) {
                    console.error("AddFacebookPageToSystem err");
                    $scope.isLoading = false;
                });
            }
        });
    };

    $scope.ActivateFacebookAccount = function (page) {
        if (!$scope.auth) {
            $scope.showAlert("FB Page", 'error', "Please Login to Facebook.");
            return;
        }
        var data = {
            "id": page.id,
            "fb": {
                "access_token": $scope.auth
            }
        };
        socialConnectorService.ActivateFacebookAccount(page._id, data).then(function (response) {
            if (response) {
                $scope.GetFacebookAccounts();
                $scope.showAlert("FB Page", 'success', "Page Added Back To System.");
            }
            else {
                $scope.showAlert("FB Page", 'error', "Fail To Add.");
            }
        }, function (error) {
            console.error("AddFacebookPageToSystem err");
            $scope.isLoading = false;
            $scope.showAlert("FB Page", 'error', "Fail To Add.");
        });


        /* var a = $scope.fbPageList.indexOf(page);
         $scope.fbPageList.splice(a, 1);*/
    };

// Load the SDK asynchronously
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
});