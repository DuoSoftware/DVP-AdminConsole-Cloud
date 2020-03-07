mainApp.controller('socialTwitterConnectorController',  function($scope, $q, twitterService,$anchorScroll)
{
    $anchorScroll();

    $scope.tweetProfile = {};
    twitterService.initialize();

    $scope.isAddingPage = false;
    //using the OAuth authorization result get the latest 20 tweetProfile from twitter for the user
    $scope.refreshTimeline = function(obj) {

        twitterService.getLatestTweets(obj).then(function(response) {
            /*$scope.tweetProfile = data;*/


            if(response.data.IsSuccess){
                $scope.GetTwitterAccounts();
                $scope.showAlert("Twitter", 'success',"Successfully Added to System");
                //document.getElementById("status")
                //$("#"+page.id+"").addClass("avoid-clicks");
            }
            else{
                $scope.showAlert("Twitter", "error", "Fail To Add Selected Page to System.");
            }
            $scope.isAddingPage = false;
        });
    };

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function() {
        $scope.isAddingPage = true;
        twitterService.connectTwitter().then(function(obj) {
            if (obj) {
                //if the authorization is successful, hide the connect button and display the tweetProfile
                $('#connectButton').fadeOut(function(){
                    $('#getTimelineButton, #signOut').fadeIn();
                    $scope.refreshTimeline(obj);
                });
            }
        });
    };

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function() {
        twitterService.clearCache();
        $('#getTimelineButton, #signOut').fadeOut(function(){
            $('#connectButton').fadeIn();
            $scope.tweetProfile= {};
        });
    };

    //if the user is a returning user, hide the sign in button and display the tweetProfile
    if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut').show();
        $scope.signOut();
    }

    $scope.addPageToSystem = function (page) {
        var data = {
            id: page.id,
            avatar: page.avatar,
            name: page.name,
            screen_name: page.name,
            access_token_key: '*',
            access_token_secret: '*',
            ticket_type: 'question',
            ticket_tags: [],
            ticket_priority: 'normal'
        };
        twitterService.addTwitterAccountToSystem(data).then(function (response) {
            if(response){
                $scope.GetTwitterAccounts();
                $scope.showAlert("Twitter", 'success',"Successfully Added to System");
                //document.getElementById("status")
                $("#"+page.id+"").addClass("avoid-clicks");
            }
            else{
                $scope.showAlert("Twitter", "error", "Fail To Add Selected Page to System.");
            }

        }, function (error) {
            $scope.showAlert("Twitter", "error", "Fail To Add Selected Page to System.");
            console.error("AddTwitterPageToSystem err");
        });
    };

    $scope.exssitingPageList = [];
    $scope.isLoading = true;
    $scope.GetTwitterAccounts = function () {
        $scope.isLoading = true;
        twitterService.getTwitterAccounts().then(function (response) {
            $scope.isLoading = false;
            $scope.exssitingPageList = response;
        }, function (error) {
            console.error("GetTwitterAccounts err");
            $scope.isLoading = false;
        });
    };
    $scope.GetTwitterAccounts();

    $scope.DeleteTwitterAccount = function (page) {
        twitterService.deleteTwitterAccount(page._id).then(function (response) {
            if(response){
                $scope.GetTwitterAccounts();
                $scope.showAlert("Twitter", 'success',"Successfully Remove Page from System.");
            }
            else{
                $scope.showAlert("Twitter", 'error',"Fail To Remove Page.");
            }
        }, function (error) {
            console.error("AddTwitterPageToSystem err");
            $scope.isLoading = false;
        });


        /* var a = $scope.fbPageList.indexOf(page);
         $scope.fbPageList.splice(a, 1);*/
    };

    $scope.updatePicture = function (page) {
        twitterService.updateTwitterAccountPicture(page._id,{"avatar":page.avatar}).then(function (response) {
            if(response){
                $scope.GetTwitterAccounts();
                $scope.showAlert("Twitter", 'success',"Successfully Update Profile Picture.");
            }
            else{
                $scope.showAlert("Twitter", 'error',"Fail To Update.");
            }
        }, function (error) {
            console.error("AddTwitterPageToSystem err");
            $scope.isLoading = false;
        });
    };

    $scope.ActivateTwitterAccount = function (page) {

        twitterService.activateTwitterAccount(page._id).then(function (response) {
            if(response){
                $scope.GetTwitterAccounts();
                $scope.showAlert("Twitter", 'success',"Page Added Back To System.");
            }
            else{
                $scope.showAlert("Twitter", 'error',"Fail To Add.");
            }
        }, function (error) {
            console.error("AddTwitterPageToSystem err");
            $scope.isLoading = false;
            $scope.showAlert("Twitter", 'error',"Fail To Add.");
        });


        /* var a = $scope.fbPageList.indexOf(page);
         $scope.fbPageList.splice(a, 1);*/
    };

    $scope.StartCronJob = function (page) {
        $scope.isLoading = true;
        twitterService.startCronJob(page._id).then(function (response) {
            if(response){
                $scope.GetTwitterAccounts();
                $scope.showAlert("Twitter", 'success',"Start Cron Job.");
            }
            else{
                $scope.showAlert("Twitter", 'error',"Fail Start Cron Job.");
            }
            $scope.isLoading = false;
        }, function (error) {
            console.error("StartCronJob err");
            $scope.isLoading = false;
            $scope.showAlert("Twitter", 'error',"Fail Start Cron Job.");
        });

    };
});