/**
 * Created by Pawan on 3/9/2017.
 */
mainApp.controller("securityLevelManagementController", function ($scope, $filter, $stateParams,$anchorScroll, appAccessManageService,authService, jwtHelper,userProfileApiAccess,$location) {


    $anchorScroll();
    $scope.active = true;



    $scope.showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.availableUsers = [];
    $scope.assignedLevel1=[];
    $scope.assignedLevel2=[];
    $scope.assignedLevel3=[];
    $scope.assignedLevel4=[];
    $scope.assignedLevel5=[];
    $scope.assignedLevel6=[];
    $scope.assignedLevel7=[];
    $scope.assignedLevel8=[];
    $scope.assignedLevel9=[];
    $scope.assignedLevel10=[];




    var loadUsers = function () {
        userProfileApiAccess.getUsers().then(function (data) {
            if (data.IsSuccess) {
                var allUsers = data.Result;

                $scope.availableUsers=allUsers.filter(function (user) {

                    if(user.security_level) {

                        var level=user.security_level;

                        switch (level)
                        {
                            case 1 : $scope.assignedLevel1.push(user);
                                break;
                            case 2 : $scope.assignedLevel2.push(user);
                                break;
                            case 3 : $scope.assignedLevel3.push(user);
                                break;
                            case 4 : $scope.assignedLevel4.push(user);
                                break;
                            case 5 : $scope.assignedLevel5.push(user);
                                break;
                            case 6 : $scope.assignedLevel6.push(user);
                                break;
                            case 7 : $scope.assignedLevel7.push(user);
                                break;
                            case 8 : $scope.assignedLevel8.push(user);
                                break;
                            case 9 : $scope.assignedLevel9.push(user);
                                break;
                            case 10 : $scope.assignedLevel10.push(user);
                                break;

                        }


                    }
                    else
                    {
                        return user;
                    }
                });

            }
            else {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = data.Exception.Message;
                }
                //$scope.showAlert('Error',errMsg, 'error' );

            }

        }, function (err) {

            var errMsg = "Error occurred while loading users";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            //$scope.showAlert('Error', errMsg,'error');
        });
    };


    loadUsers();

    $scope.DragObject = {};
    $scope.setCurrentDragItem = function (item) {
        $scope.DragObject = item;

    };

    $scope.onErrorAction = function (user,newLevel) {

        switch (newLevel)
        {
            case 1 : $scope.assignedLevel1.splice($scope.assignedLevel1.indexOf(user),1);
                break;
            case 2 : $scope.assignedLevel2.splice($scope.assignedLevel2.indexOf(user),1);
                break;
            case 3 : $scope.assignedLevel3.splice($scope.assignedLevel3.indexOf(user),1);
                break;
            case 4 : $scope.assignedLevel4.splice($scope.assignedLevel4.indexOf(user),1);
                break;
            case 5 : $scope.assignedLevel5.splice($scope.assignedLevel5.indexOf(user),1);
                break;
            case 6 : $scope.assignedLevel6.splice($scope.assignedLevel6.indexOf(user),1);
                break;
            case 7 : $scope.assignedLevel7.splice($scope.assignedLevel7.indexOf(user),1);
                break;
            case 8 : $scope.assignedLevel8.splice($scope.assignedLevel8.indexOf(user),1);
                break;
            case 9 : $scope.assignedLevel9.splice($scope.assignedLevel9.indexOf(user),1);
                break;
            case 10 : $scope.assignedLevel10.splice($scope.assignedLevel10.indexOf(user),1);
                break;
            default : $scope.availableUsers.splice($scope.availableUsers.indexOf($scope.DragObject),1);
                break;

        }



        switch (user.security_level)
        {
            case 1 : $scope.assignedLevel1.push(user);
                break;
            case 2 : $scope.assignedLevel2.push(user);
                break;
            case 3 : $scope.assignedLevel3.push(user);
                break;
            case 4 : $scope.assignedLevel4.push(user);
                break;
            case 5 : $scope.assignedLevel5.push(user);
                break;
            case 6 : $scope.assignedLevel6.push(user);
                break;
            case 7 : $scope.assignedLevel7.push(user);
                break;
            case 8 : $scope.assignedLevel8.push(user);
                break;
            case 9 : $scope.assignedLevel9.push(user);
                break;
            case 10 : $scope.assignedLevel10.push(user);
                break;
            default : $scope.availableUsers.push(user);
                break;

        }



    };





    $scope.assignNavigation = function (event,ui,level) {

        var secObj =
        {
            security_level:level.level
        }

        userProfileApiAccess.updateUserSecurityLevel($scope.DragObject.username,secObj).then(function (response) {

            if(response.IsSuccess)
            {
                $scope.showAlert("Security level updation","success","Security level updated to "+level.level+" of "+$scope.DragObject.username);
            }
            else
            {
                $scope.onErrorAction($scope.DragObject,secObj.security_level);
                $scope.showAlert("Security level updation","error","Security level fail to update of  "+$scope.DragObject.username);
            }
        }, function (error) {

            $scope.onErrorAction($scope.DragObject,secObj.security_level);
            $scope.showAlert("Security level updation","error","Security level fail to update of  "+$scope.DragObject.username);
        });
    };

    $scope.removeNavigation = function () {

        var secObj =
        {
            security_level:null
        }

        userProfileApiAccess.updateUserSecurityLevel($scope.DragObject.username,secObj).then(function (response) {

            if(response.IsSuccess)
            {
                $scope.showAlert("Security level updation","success","Security level removed successfully of  "+$scope.DragObject.username);
            }
            else
            {
                $scope.onErrorAction($scope.DragObject,null);
                $scope.showAlert("Security level updation","error","Security level removing failed of  "+$scope.DragObject.username);
            }
        }, function (error) {
            $scope.onErrorAction($scope.DragObject,null);
            $scope.showAlert("Security level updation","error","Security level removing failed of  "+$scope.DragObject.username);
        });

    };



});


