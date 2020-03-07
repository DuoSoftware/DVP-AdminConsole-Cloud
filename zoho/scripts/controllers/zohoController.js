mainApp.controller('zohoController', function ($scope, $q, $anchorScroll, zohoService) {
    $anchorScroll();

    $scope.zohoProfile = {};
    $scope.isAddingPage = false;

    $scope.connectButton = function () {
        $scope.isAddingPage = true;
        zohoService.connectZoho().then(function (obj) {
            if (obj) {
                zohoService.CreateZohoAccount(obj.oauth_token).then(function (reponse) {
                    if (reponse) {
                        $scope.zohoProfile = obj;
                        $scope.zohoProfile.name = "Zoho Account";
                        $scope.zohoProfile.id = "Zoho Account";
                        //if the authorization is successful, hide the connect button and display the zohoProfile
                        $('#connectButton').fadeOut(function () {
                            $('#getTimelineButton, #signOut').fadeIn();
                        });
                    }else{
                        $scope.showAlert("Zoho", "error", "Fail To Add Selected Account to System.");
                    }
                    $scope.isAddingPage = false;
                }, function (error) {
                    $scope.showAlert("Zoho", "error", "Fail To Add Selected Account to System.");
                });

            }
        });
    };

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function () {
        zohoService.clearCache();
        $('#getTimelineButton, #signOut').fadeOut(function () {
            $('#connectButton').fadeIn();
            $scope.zohoProfile = {};
        });
    };

    //if the user is a returning user, hide the sign in button and display the zohoProfile
    if (zohoService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut').show();
        $scope.signOut();
    }

    $scope.addPageToSystem = function (page) {
        $scope.isAddingPage = true;
        zohoService.EnableZohoIntegration().then(function (response) {
            if (response) {
                $scope.GetZohoAccount();
                $scope.showAlert("Zoho", 'success', "Successfully Added To System");
                $("#" + page.id + "").addClass("avoid-clicks");
                $scope.isAddingPage = false;
            }
            else {
                $scope.showAlert("Zoho", "error", "Fail To Add Selected Account to System.");
            }
        }, function (error) {
            $scope.showAlert("Zoho", "error", "Fail To Add Selected Account to System.");
        });
    };

    $scope.exssitingZohoAccounts = [];
    $scope.isLoading = true;
    $scope.GetZohoAccount = function () {
        $scope.exssitingZohoAccounts = [];$scope.isLoading = true;
        zohoService.GetZohoAccount().then(function (response) {
            if (response) {
                $scope.exssitingZohoAccounts.push(response);
            }

            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Zoho", "error", "Fail To Get Zoho Account.");
        });


    };
    $scope.GetZohoAccount();

    $scope.DeleteZohoAccount = function (page) {
        $scope.isLoading = true;
        zohoService.DisableZohoIntegration().then(function (response) {
            if (response) {
                $scope.GetZohoAccount();
                $scope.showAlert("Zoho", 'success', "Successfully Remove Account From System.");
            }
            else {
                $scope.showAlert("Zoho", 'error', "Fail To Remove Account From System.");
            }
            $scope.isLoading = false;
        }, function (error) {
            console.error("AddTwitterPageToSystem err");
            $scope.isLoading = false;
            $scope.showAlert("Zoho", 'error', "Fail To Remove Account From System.");
        });


        /* var a = $scope.fbPageList.indexOf(page);
         $scope.fbPageList.splice(a, 1);*/
    };

});