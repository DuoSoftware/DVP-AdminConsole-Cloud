mainApp.controller('companynameCtrl', function ($rootScope, $scope, $state, $http,
                                                loginService,authService,organizationService,packagingService,
                                                config, $base64, $auth,$q) {


    $scope.companyName="";
    $scope.isExsists=true;
    var para = {
        userName: null,
        password: null,
        clientID: $base64.encode(config.client_Id_secret)

    };
    //$scope.loginFrm.$invalid=true;
    $scope.CheckLogin = function () {
        if ($auth.isAuthenticated()) {

            packagingService.getUserNavigation(function (isnavigation) {
                if (isnavigation) {
                    $state.go('console');
                }
            })

        }
    };
    $scope.CheckLogin();

    $scope.checkCompanyNameAvailability = function(form,isSignUp)
    {
        var deferred = $q.defer();

        try {
            organizationService.getOrganizationExsistance($scope.companyName).then(function (res) {

                if(res)
                {
                    //showAlert("Info","error","Company Name is Already Taken");
                    $scope.isExsists=true;

                    form.companyName.$invalid=true;

                    if(!isSignUp)
                    {
                        $state.go('login',{company:$scope.companyName});
                    }


                    deferred.reject(true);


                }
                else {

                    if(!isSignUp)
                    {
                        showAlert("Info","info","Company Name You Have Entered is Not Registered , Please Add a Valid Company Name or Create a new Company ");
                    }

                    $scope.isExsists=false;

                    form.companyName.$invalid=false;


                    deferred.resolve(true);

                }
            },function (err) {
                showAlert("Error","error","Error in validating Company Name ");
                $scope.isExsists=true;

                form.companyName.$invalid=true;


                deferred.reject(false);
            });
        }
        catch (e) {
            deferred.reject(e);
        }

        return deferred.promise;

        /*return new Promise(function (resolve,reject) {
            loginService.getOrganizationExsistance($scope.companyName).then(function (res) {

                if(res)
                {
                    //showAlert("Info","error","Company Name is Already Taken");
                    $scope.isExsists=true;

                    form.companyName.$invalid=true;

                    if(!isSignUp)
                    {
                        $state.go('login',{company:$scope.companyName});
                    }


                    reject(true);


                }
                else {

                    if(!isSignUp)
                    {
                        showAlert("Error","error","Invalid Company Name ");
                    }

                    $scope.isExsists=false;

                    form.companyName.$invalid=false;


                    resolve(true);

                }
            },function (err) {
                showAlert("Error","error","Error in validating Company Name ");
                $scope.isExsists=true;

                form.companyName.$invalid=true;


                reject(false);
            });
        })*/

    }

    $rootScope.copyrightYear = new Date().getFullYear();


    var showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3',
            animate: {
                animate: true,
                in_class: "bounceIn",
                out_class: "bounceOut"
            }
        });
    };



    $scope.onClickSignUp = function (form) {
        if($scope.companyName.length>0)
        {

            $scope.checkCompanyNameAvailability(form,true).then(function (res) {
                $state.go('signUp',{company:$scope.companyName});
            },function (err) {

            });
        }
        else
        {
            showAlert("Choose a Company Name","info","Before SignUp Please choose a Name for your Company");
        }


    };

    $scope.authenticate = function (provider) {

        if($scope.companyName.length==0)
        {
            showAlert("Choose a Company Name","info","Before Login Please choose a Name for your Company");
        }
        else
        {
            para.companyname=$scope.companyName;
            para.scope = ["all_all", "profile_veeryaccount", "write_ardsresource", "write_notification", "read_myUserProfile", "read_productivity", "profile_veeryaccount", "resourceid"];

            $scope.isSocialMedia = true;
            $auth.authenticate(provider, para)
                .then(function () {
                    //toastr.success('You have successfully signed in with ' + provider + '!');
                    organizationService.getMyPackages(function (result, status) {
                        if (status == 200) {
                            if (result) {
                                packagingService.getUserNavigation(function (isnavigation) {
                                    $scope.isSocialMedia = false;
                                    $state.go('console');

                                })
                            } else {
                                $scope.isSocialMedia = false;
                                $state.go('console');
                            }
                        } else {

                            packagingService.getUserNavigation(function (isnavigation) {
                                if(isnavigation) {
                                    $scope.isSocialMedia = false;
                                    $state.go('console');
                                }else{
                                    showAlert('Error', 'error', "Get console navigation failed, please contact administrator");
                                    $scope.isLogin = false;
                                    $scope.loginFrm.$invalid = false;
                                }
                            })
                        }
                    });
                })
                .catch(function (error) {
                    $scope.isSocialMedia = false;
                    if (error.message) {
                        authService.clearCookie();
                        if(error.message=="The popup window was closed")
                        {
                            showAlert('Info', 'info', error.message);
                        }
                        else
                        {
                            showAlert('Error', 'error', error.message);
                        }

                    } else if (error.data && error.data.message) {
                        authService.clearCookie();
                        if(error.data.message=="The popup window was closed")
                        {
                            showAlert('Info', 'info', error.data.message);
                        }
                        else
                        {
                            showAlert('Error', 'error', error.data.message);
                        }

                    } else {
                        authService.clearCookie();
                        showAlert('Error', 'error', 'Please check login details...');
                    }
                });
        }

    };


});
