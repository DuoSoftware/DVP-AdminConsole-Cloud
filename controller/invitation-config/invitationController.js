/**
 * Created by Pawan on 1/16/2018.
 */
mainApp.controller("invitationController", function ($scope, $state, loginService,$ngConfirm,userProfileApiAccess,invitationApiAccess,$timeout) {


    $scope.searchCriteria = "";
    $scope.isRequested=false;
    $scope.invites = [];
    $scope.newInvite={
        role:"agent"
    };
    $scope.userList = [];
    $scope.requestableAccounts =[];
    $scope.notRegisteredUsers=[];
    $scope.commonUsers=[];
    $scope.requestUsers=[];
    $scope.tempUsrList = []

    $scope.onUserChipAdd = function(chip)
    {
        $scope.userList.push(chip.tag);
    }
    $scope.onUserChipDelete = function(chip)
    {
        $scope.userList.splice($scope.userList.indexOf(chip.tag),1);
    }

    $scope.showConfirmation = function (title, contentData,notRegSt, allText,registeredText, allFunc,regFunc ,closeFunc) {

        $ngConfirm({
            title: title,
            contentUrl: 'views/invitation-config/partials/confirmationDialogContent.html', // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            boxHeight: '100px',
            buttons: {
                // long hand button definition
                Registered: {
                    text: allText,
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    title:"Invitations will be sent to all users except users already registered with this company ",
                    action: function (scope) {
                        allFunc();
                    }
                },

                NotRegistered: {
                    text: registeredText,
                    btnClass: 'btn-primary',
                    disabled:notRegSt,
                    title:"Invitations will only be sent to users already registered with any company ",
                    action: function (scope) {
                        regFunc();
                    }
                },
                // short hand button definition
                close: function (scope) {
                    closeFunc();
                }
            }
        });
    };

    /* $scope.names = ["123","56","333"];
     var content = '<strong>{{name}}</strong><div><span>Valid Invitees</span><div ng-repeat="item in names"><span class="reqchip">{{item}}</span></div></div>';

     $scope.showConfirmation("Invitations",content,"all","reg",function () {

     },function () {

     },function () {

     })*/



    $scope.showAlert = function (title, content, msgtype) {

        new PNotify({
            title: title,
            text: content,
            type: msgtype,
            styling: 'bootstrap3'
        });
    };



    $scope.sendInvitation = function () {

        $scope.isRequested=true;
        var strNames="";

        angular.forEach($scope.userList,function (item,i) {

            strNames=strNames+"name="+item;
            if(i!=$scope.userList.length-1)
            {
                strNames= strNames+"&";
            }



        });

        if(strNames!="")
        {
            $scope.requestableAccounts=[];
            $scope.notRegisteredUsers=[];
            $scope.commonUsers=[];
            $scope.requestUsers=[];
            $scope.invitedUsers=[];

            invitationApiAccess.checkInvitable(strNames).then(function (resUsers) {
                $scope.isNotReg=true;

                var inviteObj = {
                    message:$scope.newInvite.message,
                    to:[],
                    role:$scope.newInvite.role
                }

                if(resUsers.data.IsSuccess && resUsers.data.Result)
                {
                    if(resUsers.data.Result.unavailableAccounts && resUsers.data.Result.unavailableAccounts.length>0)
                    {
                        $scope.requestableAccounts=resUsers.data.Result.unavailableAccounts;
                        $scope.isNotReg=false;
                    }
                    if(resUsers.data.Result.unavailableUsers && resUsers.data.Result.unavailableUsers.length>0)
                    {
                        $scope.notRegisteredUsers=resUsers.data.Result.unavailableUsers;

                    }
                    if(resUsers.data.Result.commonUsers && resUsers.data.Result.commonUsers.length>0)
                    {
                        $scope.commonUsers=resUsers.data.Result.commonUsers;
                    }
                    if(resUsers.data.Result.requestUsers && resUsers.data.Result.requestUsers.length>0)
                    {
                        $scope.requestUsers=resUsers.data.Result.requestUsers;
                    }
                    if(resUsers.data.Result.invitedUsers && resUsers.data.Result.invitedUsers.length>0)
                    {
                        $scope.invitedUsers=resUsers.data.Result.invitedUsers;
                    }

                    if($scope.notRegisteredUsers.length==0 && $scope.requestableAccounts.length==0)
                    {
                        $scope.showAlert("Registered Users Found","Users you trying to invite have been registered already with your Company","info");
                        $scope.isRequested=false;
                    }
                    else {
                        // var content = '<strong>{{name}}</strong><div><div><strong>New Users </strong><div><span class="reqchip" ng-repeat="item in notRegisteredUsers">{{item}}</span></div></div>' +
                        //     '<div><strong>Invitable Users (Already Registered with Other Company)<strong><span class="reqchip" ng-repeat="itemRqst in requestableAccounts"> {{itemRqst}} </span></div>' +
                        //     '<div><strong>Common Users (Already Registered with Company)<strong><span class="reqchip" ng-repeat="cmnUser in commonUsers"> {{cmnUser}} </span></div></div>';

                        $scope.showConfirmation("Invitations",null,$scope.isNotReg,"All","Registered Only",function () {

                            if($scope.requestableAccounts.length>0)
                            {
                                var inviteRegObj = {
                                    message:$scope.newInvite.message,
                                    to:[],
                                    role:$scope.newInvite.role
                                }
                                inviteRegObj.to=$scope.requestableAccounts;

                                invitationApiAccess.sendInvitations(inviteRegObj).then(function (resSend) {

                                    if(resSend.data.IsSuccess)
                                    {
                                        $scope.showAlert("Success","Invitation sent successfully","success");
                                        loadSentInvitations();

                                    }
                                    else
                                    {
                                        $scope.showAlert("Error","Invitation sending failed","error");
                                        $scope.isRequested=false;
                                    }
                                    $scope.isRequested=false;
                                },function (errSend) {
                                    $scope.showAlert("Error","Invitation sending failed","error");
                                    $scope.isRequested=false;
                                });
                            }

                            if($scope.notRegisteredUsers.length>0)
                            {
                                var inviteObj = {
                                    message:$scope.newInvite.message,
                                    to:[],
                                    role:$scope.newInvite.role
                                }
                                inviteObj.to=$scope.notRegisteredUsers;

                                invitationApiAccess.requestInvitations(inviteObj).then(function (resSend) {

                                    if(resSend.data.IsSuccess)
                                    {
                                        $scope.showAlert("Success","Invitation sent successfully","success");
                                        loadSentInvitations();
                                    }
                                    else
                                    {
                                        $scope.showAlert("Error","Invitation sending failed","error");
                                    }
                                    $scope.isRequested=false;
                                },function (errSend) {
                                    $scope.showAlert("Error","Invitation sending failed","error");
                                });
                            }
                        },function () {

                            if($scope.requestableAccounts.length>0)
                            {
                                var inviteRObj = {
                                    message:$scope.newInvite.message,
                                    to:[],
                                    role:$scope.newInvite.role
                                }

                                inviteRObj.to=$scope.requestableAccounts;

                                invitationApiAccess.sendInvitations(inviteRObj).then(function (resSend) {

                                    if(resSend.data.IsSuccess)
                                    {
                                        $scope.showAlert("Success","Invitation sent successfully","success");
                                        loadSentInvitations();
                                    }
                                    else
                                    {
                                        $scope.showAlert("Error","Invitation sending failed","error");
                                    }
                                },function (errSend) {
                                    $scope.showAlert("Error","Invitation sending failed","error");
                                    $scope.isRequested=false;
                                });
                            }



                        },function () {
                            $timeout(function (){$scope.isRequested=false;});

                        });

                    }


                    /*var content = '<strong>Invitees Identified as follows </strong>'+'<div style="padding-top: 10px">' +
                        '<div> <span>Direct Invitables</span>' +
                        '<div ng-repeat="account in requestableAccounts">' +
                        '<div class="chip">' +
                        '  <img src="img_avatar.jpg" alt="Person">' +
                        '  {{account}}' +
                        '</div>'+
                        '</div>'+
                        '</div></div>';*/






                }
                else
                {
                    $scope.showAlert("Error","Error in Validation requests","error");
                    $scope.isRequested=false;
                }


            },function (errUsers) {
                $scope.isRequested=false;
            })
        }
        else {
            $scope.isRequested=false;
            $scope.showAlert("Error","error","Add Users before send request");
        }



        //console.log(strName);







    };

    var loadSentInvitations = function () {
        $scope.newInvite={
            role:"agent"
        };

        invitationApiAccess.getSentInvitations().then(function (resInvitations) {
            if(resInvitations.data.IsSuccess)
            {
                if(resInvitations.data.Result.length>0)
                {
                    $scope.invites=resInvitations.data.Result;
                }
                else
                {
                    $scope.showAlert("Info","No sent invitations found","info");
                }

            }
            else
            {
                $scope.showAlert("Error","Error in Loading sent invitations","error");
            }


        },function (errInvitations) {

            $scope.showAlert("Error","Error in Loading sent invitations","error");
        } );
    };
    loadSentInvitations();


    $scope.reloadPage = function () {
        $state.reload();
    }

});