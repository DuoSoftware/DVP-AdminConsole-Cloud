mainApp.controller("appAccessManageController", function ($scope, $filter, $stateParams,$anchorScroll, appAccessManageService,authService, jwtHelper,ShareData) {


    $anchorScroll();
    $scope.active = true;
    /*Load Application list*/
    $scope.showAlert = function (tittle, label, button, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'success',
            styling: 'bootstrap3'
        });
    };
    $scope.showError = function (tittle,content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'error',
            styling: 'bootstrap3'
        });
    };

    $scope.consoleAppList = [];
    $scope.loadUserData = function () {
        var str = '{"_id":"575a60bbbb7565600a9e8bfb","consoleName":"ADMIN","created_at":"2016-06-10T06:39:55.693Z","updated_at":"2016-06-11T14:18:12.179Z","__v":0,"consoleNavigation":[{"_id":"575c1da37f1f1d7c171b2736","updated_at":"2016-06-11T14:18:11.503Z","created_at":"2016-06-11T14:18:11.503Z","navigationStatus":true,"navigationName":"ARDS_CONFIGURATION","scopes":[{"scopeName":"requestmeta","feature":"ards configuration access","_id":"575c1da37f1f1d7c171b2738","actions":["read","write","delete"]}]}],"consoleUserRoles":["admin","supervisor"]}';
        $scope.consoleAppList = JSON.parse(str);
    };
    $scope.loadUserData();

    $scope.userList = [];
    $scope.GetUserList = function () {
        $scope.userList=[];

        appAccessManageService.getUserCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(appAccessManageService.LoadUsersByPage(pagesize, i));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {
                    resolveData.map(function (data) {

                        data.map(function (item) {

                            $scope.userList.push(item);
                        });
                    });

                }



            }).catch(function (err) {
                console.error(err);
                loginService.isCheckResponse(err);
                $scope.showAlert("Load Users", "error", "Fail To Get User List.");
            });



        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.")
        });




        /*appAccessManageService.GetUserList().then(function (response) {
            $scope.userList = response;
        }, function (error) {
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });*/

    };
    // $scope.GetUserList();


    $scope.AddClientNavigationToUser = function () {

        var data = {
            "menuItem": navigationData.menuItem,
            "menuAction": {
                "Navigatione": navigationData.Navigatione,
                "read": true,
                "write": true,
                "delete": true,
            }
        };

        appAccessManageService.AddSelectedNavigationToUser().then(function (response) {


        }, function (error) {
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });

    };

    $scope.DeleteSelectedNavigationFrmUser = function () {

        appAccessManageService.DeleteSelectedNavigationFrmUser().then(function (response) {

        }, function (error) {
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });

    };

    $scope.assignableNavigations = [];


    $scope.GetAssignableNavigations = function (username, role) {
        appAccessManageService.GetAssignableNavigations(role).then(function (response) {
            $scope.assignableNavigations = response;
            //$scope.GetMyNavigations();
            $scope.GetNavigationAssignToUser(username);
        }, function (error) {
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });

    };



    $scope.assignedNavigations = [];
    $scope.GetNavigationAssignToUser = function (userName) {
        appAccessManageService.GetNavigationAssignToUser(userName).then(function (response) {
            if (response.IsSuccess) {

                angular.forEach(response.Result.client_scopes, function (item) {
                    var items = $filter('filter')($scope.assignableNavigations, {consoleName: item.consoleName},true);
                    if (items) {
                        var index = $scope.assignableNavigations.indexOf(items[0]);
                        if (index > -1) {
                            var temptask = $scope.assignableNavigations[index];
                            temptask.consoleNavigation.saveItem = {};
                            temptask.consoleNavigation.saveItem = item.menus;
                            $scope.assignedNavigations.push(temptask);
                            $scope.assignableNavigations.splice(index, 1);
                        }
                    }
                });
                $scope.active = true;
                $scope.GetMyNavigations();
            }

        }, function (error) {
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });
    };



    $scope.GetMyNavigations = function()
    {
        $scope.availableNav=[];
        if(ShareData && !ShareData.MyProfile)
        {
            myUserProfileApiAccess.getMyProfile().then(function (resMyProf) {
                if (resMyProf.IsSuccess && resMyProf.Result) {
                    ShareData.MyProfile = resMyProf.Result;
                }
                else
                {
                    console.log("Error in loading My profile")
                }
            })
        }

        /*filterNavigationData();*/

        if($scope.assignedNavigations && $scope.assignedNavigations.length==0)
        {
            filterNavigationData($scope.assignableNavigations);
        }
        else {
            /*angular.forEach(ShareData.MyProfile.client_scopes,function (item) {
                var items = $filter('filter')($scope.assignedNavigations, {consoleName: item.consoleName},true);
                if (items) {
                    var index = $scope.assignedNavigations.indexOf(items[0]);
                    console.log($scope.assignedNavigations[index]);
                    if (index > -1) {
                        //consoles ex- Agent console

                        angular.forEach(item.menus, function (menu) {
                            // Menus ex- AGENT_WIDGET
                            var menuItem = menu.menuItem;
                            var navItems = $filter('filter')($scope.assignedNavigations[index].consoleNavigation, {navigationName: menuItem},true);

                            var navIndex= $scope.assignedNavigations[index].consoleNavigation.indexOf(navItems[0]);
                            if(navIndex > -1)
                            {
                                angular.forEach(menu.menuAction,function (menuAction) {
                                    //ACTIONS ex- Read , Write, Delete
                                    var scope= menuAction.scope;

                                    var objActions =Object.keys(menuAction).filter(function (act) {
                                        return (act !="scope"&& act !="feature") && menuAction[act];

                                    });

                                    var actItems = $filter('filter')($scope.assignedNavigations[index].consoleNavigation[navIndex].resources, {scopeName: scope},true);

                                    var actIndex = $scope.assignedNavigations[index].consoleNavigation[navIndex].resources.indexOf(actItems[0]);

                                    if(actIndex > -1)
                                    {
                                        $scope.assignedNavigations[index].consoleNavigation[navIndex].resources[actIndex].actions=objActions;

                                    }

                                    /!*$scope.availableNav = $scope.assignedNavigations[index].consoleNavigation.filter(function (navigation) {
                                        if(menuItem == navigation.navigationName)
                                        {
                                            return angular.forEach(navigation.resources,function (resource) {

                                                if(resource.scopeName == scope )
                                                {
                                                    resource.actions = objActions;
                                                    return resource;
                                                }

                                            })
                                        }


                                    })  ;

                                    console.log("Available Nav -------------------"+$scope.availableNav);*!/
                                });

                                $scope.availableNav.push($scope.assignedNavigations[index].consoleNavigation[navIndex]);
                            }

                        });
                        var saveItems = $scope.assignedNavigations[index].consoleNavigation.saveItem;
                        $scope.assignedNavigations[index].consoleNavigation = $scope.availableNav;
                        $scope.assignedNavigations[index].consoleNavigation.saveItem = saveItems;
                        $scope.availableNav=[];
                    }


                }


            });*/
            filterNavigationData($scope.assignedNavigations);
        }






    }



    var filterNavigationData = function(navArray)
    {
        var tempAssignableNav =[];
        angular.forEach(ShareData.MyProfile.client_scopes,function (item) {
            var items = $filter('filter')(navArray, {consoleName: item.consoleName},true);



            if (items) {
                var index = navArray.indexOf(items[0]);
                console.log(navArray[index]);
                if (index > -1) {
                    //consoles ex- Agent console

                    angular.forEach(item.menus, function (menu) {
                        // Menus ex- AGENT_WIDGET
                        var menuItem = menu.menuItem;
                        var navItems = $filter('filter')(navArray[index].consoleNavigation, {navigationName: menuItem},true);

                        var navIndex= navArray[index].consoleNavigation.indexOf(navItems[0]);
                        if(navIndex > -1)
                        {
                            angular.forEach(menu.menuAction,function (menuAction) {
                                //ACTIONS ex- Read , Write, Delete
                                var scope= menuAction.scope;

                                var objActions =Object.keys(menuAction).filter(function (act) {
                                    return (act !="scope"&& act !="feature") && menuAction[act];

                                });

                                var actItems = $filter('filter')(navArray[index].consoleNavigation[navIndex].resources, {scopeName: scope},true);

                                var actIndex = navArray[index].consoleNavigation[navIndex].resources.indexOf(actItems[0]);

                                if(actIndex > -1)
                                {
                                    navArray[index].consoleNavigation[navIndex].resources[actIndex].actions=objActions;

                                }

                                /*$scope.availableNav = $scope.assignedNavigations[index].consoleNavigation.filter(function (navigation) {
                                    if(menuItem == navigation.navigationName)
                                    {
                                        return angular.forEach(navigation.resources,function (resource) {

                                            if(resource.scopeName == scope )
                                            {
                                                resource.actions = objActions;
                                                return resource;
                                            }

                                        })
                                    }


                                })  ;

                                console.log("Available Nav -------------------"+$scope.availableNav);*/
                            });

                            $scope.availableNav.push(navArray[index].consoleNavigation[navIndex]);
                        }

                    });
                    var saveItems = navArray[index].consoleNavigation.saveItem;
                    navArray[index].consoleNavigation = $scope.availableNav;
                    navArray[index].consoleNavigation.saveItem = saveItems;
                    $scope.availableNav=[];
                }


            }
            var assignItems = $filter('filter')($scope.assignableNavigations, {consoleName: item.consoleName},true);


            var assIndex = $scope.assignableNavigations.indexOf(assignItems[0]);
            if(assIndex > -1)
            {
                tempAssignableNav.push($scope.assignableNavigations[assIndex]);
            }

        });

        $scope.assignableNavigations=tempAssignableNav;
    }

    $scope.assignNavigation = function () {
        appAccessManageService.AddConsoleToUser($scope.selectedUser, $scope.DragObject.consoleName).then(function (response) {
            if (!response) {
                var index = $scope.assignedNavigations.indexOf($scope.DragObject);
                if (index != -1) {
                    $scope.assignedNavigations.splice(index, 1);
                    $scope.assignableNavigations.push($scope.DragObject);
                }
            }
        }, function (error) {
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });
    };

    $scope.removeNavigation = function () {
        appAccessManageService.DeleteConsoleFrmUser($scope.selectedUser, $scope.DragObject.consoleName).then(function (response) {
            if (!response) {
                var index = $scope.assignableNavigations.indexOf($scope.DragObject);
                if (index != -1) {
                    $scope.assignableNavigations.splice(index, 1);
                    $scope.assignedNavigations.push($scope.DragObject);
                }

            }
        }, function (error) {
            $scope.showError("Error", "Error", "ok", "There is an error ");
        });
    };

    $scope.DragObject = {};
    $scope.setCurrentDrag = function (item) {
        $scope.DragObject = item;
        $scope.showEditWindow = false;
    };

    $scope.showEditWindow = false;
    $scope.selectedConsole = {};
    $scope.showEditView = function (item) {
        $scope.selectedConsole={};
        $scope.selectedConsole = item;
        $scope.showEditWindow = true;
    };

    $scope.selectedUser = {};
    $scope.selectUser = function (user, role) {
        $scope.active = false;
        $scope.assignedNavigations = [];
        $scope.selectedUser = user;
        $scope.selectedUserRole = role;
        $scope.showEditWindow = false;
        $scope.GetAssignableNavigations(user, role);

    };
    $scope.selectUser($stateParams.username, $stateParams.role);


    /* Scope Assign*/
    $scope.assignableScope = [];
    $scope.assignedScope = [];
    $scope.setCurrentDragScope = {};
    $scope.GetUserAssignableScope = function () {
        $scope.assignableScope = appAccessManageService.GetUserAssignableScope();
    };
    $scope.GetUserAssignableScope();

    $scope.GetUserAssignedScope = function () {
        appAccessManageService.GetUserAssignedScope($stateParams.username).then(function (response) {


            angular.forEach(response, function (item) {
                var items = $filter('filter')($scope.assignableScope, {resource: item.resource},true);
                if (items) {
                    var index = $scope.assignableScope.indexOf(items[0]);
                    if (index > -1) {
                        var temptask = $scope.assignableScope[index];
                        $scope.assignedScope.push(temptask);
                        $scope.assignableScope.splice(index, 1);
                    }
                }
            });

        }, function (error) {
            $scope.showError("Error", "Error", "ok", "Unable To Receive User Scope.");
        });
    };
    $scope.GetUserAssignedScope();

    $scope.assignScopeToUser = function () {
        appAccessManageService.AssignScopeToUser($stateParams.username, $scope.setCurrentDragScopeObj).then(function (response) {
            if (!response) {
                $scope.showError("Error", "Error", "ok", "Fail To Assign Scope To User.");
            }
        }, function (error) {
            $scope.showError("Error", "Error", "ok", "Fail To Assign Scope To User.");
        });
    };

    $scope.removeAssignedScope = function () {
        appAccessManageService.RemoveAssignedScope($stateParams.username, $scope.setCurrentDragScopeObj).then(function (response) {
            if (!response) {
                $scope.showError("Error", "Error", "ok", "Fail To Delete Scope.");
            }
        }, function (error) {
            $scope.showError("Error", "Error", "ok", "Fail To Delete Scope.");
        });
    };

    $scope.setCurrentDragScopeObj = {}
    $scope.setCurrentDragScope = function (item) {
        $scope.setCurrentDragScopeObj = item;
    };

    $scope.ownerName="Verry";
    $scope.getOwnerName = function () {
        var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
        console.info(decodeData);
        $scope.ownerName = decodeData.iss;
    };
    $scope.getOwnerName();
    $scope.userName = $stateParams.username;
});


