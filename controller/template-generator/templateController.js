/**
 * Created by Pawan on 8/10/2016.
 */
mainApp.controller("templateController", function ($scope, $state, templateMakerBackendService, loginService,$ngConfirm) {

    $scope.StyleList = [];
    $scope.StyleContentList = [];
    $scope.newTemplate={};
    $scope.StyleList.push({
        isFirst: true
    });
    $scope.Templates = [];
    $scope.searchCriteria = "";

    $scope.showConfirmation = function (title, contentData, okText, okFunc, closeFunc) {

        $ngConfirm({
            title: title,
            content: contentData, // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {
                // long hand button definition
                ok: {
                    text: okText,
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function (scope) {
                        okFunc();
                    }
                },
                // short hand button definition
                close: function (scope) {
                    closeFunc();
                }
            }
        });
    };
    $scope.showAlert = function (title, content, msgtype) {

        new PNotify({
            title: title,
            text: content,
            type: msgtype,
            styling: 'bootstrap3'
        });
    };

    $scope.addStyle = function (styleContent) {
        $scope.StyleList.push({isFirst: false});
        //$scope.StyleContentList.push(styleContent.itemContent);

        console.log("New css " + styleContent.value);

    };

    $scope.removeAssignedStyle = function (styleContent) {

        console.log("Removing css " + styleContent.value + "of " + styleContent.$$hashKey);

        /* $scope.StyleContentList.pop(styleContent.itemContent);
         //$scope.StyleContentList.splice(0, 0, styleContent.itemContent);
         console.log($scope.StyleContentList);
         */

        console.log(" Before Removed " + JSON.stringify($scope.StyleList));
        for (var i = 0; i < $scope.StyleList.length; i++) {

            if ($scope.StyleList[i].value == styleContent.value && styleContent.$$hashKey == $scope.StyleList[i].$$hashKey) {
                $scope.StyleList.splice(i, 1);

            }

        }

        console.log("After Removed " + JSON.stringify($scope.StyleList));


    };

    $scope.saveNewTemplate = function () {

        console.log("Style Data " + JSON.stringify($scope.StyleList));

        for (var i = 0; i < $scope.StyleList.length; i++) {
            if ($scope.StyleList[i].value && $scope.StyleList[i].value != null && $scope.StyleList[i].value != "") {
                $scope.StyleContentList.push($scope.StyleList[i].value);
            }

        }


        $scope.newTemplate.StyleFiles = $scope.StyleContentList;

        console.log($scope.newTemplate);

        templateMakerBackendService.saveTemplate($scope.newTemplate).then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in adding new Template " + response.data.Exception);
                $scope.showAlert("Error", "There is an error in saving Template ", "error");
                $scope.searchCriteria = "";
                $state.reload();
            }
            else {
                $scope.showAlert("Success", "New Application added sucessfully.", "success");
                $state.reload();
            }

        }, function (error) {
            //loginService.isCheckResponse(error);
            console.info("Error in adding new Template " + error);
            $scope.showAlert("Error", "There is an Exception in saving Template " + error, "error");
            $state.reload();

        });
    };

    $scope.pickAllTemplates = function () {

        templateMakerBackendService.pickTemplates().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking  Templates " + response.data.Exception);
                $scope.showAlert("Error", "There is an error in picking Templates ", "error");
                //$state.reload();
            }
            else {
                //$scope.showAlert("Success", "New Application added sucessfully.","success");
                $scope.Templates = response.data.Result;
                //$state.reload();
            }
        }, function (error) {
            //loginService.isCheckResponse(error);
            console.info("Error in picking Template " + error);
            $scope.showAlert("Error", "There is an Exception in picking Template " + error, "error");
        });
    };
    $scope.pickAllTemplates();

    $scope.ChatTemplates=[];
    $scope.newChatTemplate={};

    $scope.pickAllChatTemplates = function () {

        templateMakerBackendService.getAllChatTemplates().then(function (response) {

            $scope.ChatTemplates=response;
        }, function (error) {

            console.info("Error in picking Chat Template " + error);
            $scope.showAlert("Error", "There is an Exception in picking Chat Template " + error, "error");
        });
    };
    $scope.pickAllChatTemplates();

    $scope.addNewChatTemplate = function () {

        var chatTempObj =
            {
                content:$scope.newChatTemplate.content,
                isCommon:true
            }


        templateMakerBackendService.saveNewChatTemplate(chatTempObj).then(function (response) {

            $scope.ChatTemplates.push(response);
            $scope.newChatTemplate={};
            $scope.showAlert("Success", "New chat template added successfully", "success");


        }, function (error) {

            console.info("Error in adding new Chat Template " + error);
            $scope.showAlert("Error", "There is an Exception in saving new Chat Template " + error, "error");
            $state.reload();

        });
    };
    $scope.removeChatTemplate = function (tempID) {


        $scope.showConfirmation("Delete Chat Template","Do you want to delete this template","OK",function () {
            templateMakerBackendService.removeChatTemplate(tempID).then(function (response) {

                var index = $scope.ChatTemplates.map(function(el) {
                    return el._id;
                }).indexOf(tempID);
                $scope.ChatTemplates.splice(index,1);

                $scope.showAlert("Success", "Chat Template successfully removed", "success");


            }, function (error) {

                console.info("Error in deleting  Chat Template " + error);
                $scope.showAlert("Error", "There is an Exception in deleting Chat Template " + error, "error");


            });
        },function () {

        })


    };


    /* $scope.AppList=[];
     $scope.newApplication={};
     $scope.addNew = false;
     $scope.MasterAppList=[];
     $scope.IsDeveloper=false;
     $scope.Developers=[];

     $scope.showAlert = function (tittle,content,type) {

     new PNotify({
     title: tittle,
     text: content,
     type: type,
     styling: 'bootstrap3'
     });
     };



     $scope.saveAplication= function (resource) {


     resource.Availability=true;
     if(resource.ObjClass=="DEVELOPER")
     {
     resource.IsDeveloper=true;
     }
     appBackendService.saveNewApplication(resource).then(function (response) {

     if(!response.data.IsSuccess)
     {

     console.info("Error in adding new Application "+response.data.Exception);
     $scope.showAlert("Error", "There is an error in saving Application ","error");
     //$scope.showAlert("Error",)
     }
     else
     {
     $scope.addNew = !response.data.IsSuccess;
     $scope.showAlert("Success", "New Application added sucessfully.","success");

     $scope.AppList.splice(0, 0, response.data.Result);
     $scope.newApplication={};


     }
     $state.reload();
     }), function (error) {
     console.info("Error in adding new Application "+error);
     $scope.showAlert("Error", "There is an Exception in saving Application "+error,"error");
     $state.reload();
     }
     };


     $scope.addApplication = function () {
     $scope.addNew = !$scope.addNew;
     };
     $scope.removeDeleted = function (item) {

     var index = $scope.AppList.indexOf(item);
     if (index != -1) {
     $scope.AppList.splice(index, 1);
     }

     };
     $scope.reloadPage = function () {
     $state.reload();
     };

     $scope.GetApplications = function () {
     appBackendService.getApplications().then(function (response) {

     if(response.data.Exception)
     {
     console.info("Error in picking App list "+response.data.Exception);
     }
     else
     {
     $scope.AppList = response.data.Result;
     //$scope.MasterAppList = response.data.Result;
     }

     }), function (error) {
     console.info("Error in picking App service "+error);
     }
     };

     $scope.cancleEdit = function () {
     $scope.addNew=false;
     };



     $scope.GetApplications();*/

    $scope.reloadPage = function () {
        $state.reload();
    }

});

mainApp.directive("newstylecollection", function ($filter, $uibModal) {

    return {
        restrict: "EAA",
        scope: {
            styleitem: "=",
            'addNewStyle': '&',
            'removeAssignedStyle': '&'

        },

        templateUrl: 'views/template-generator/partials/newStyleCollection.html',

        link: function (scope) {


            scope.showAlert = function (title, content, msgtype) {

                new PNotify({
                    title: title,
                    text: content,
                    type: msgtype,
                    styling: 'bootstrap3'
                });
            };

            scope.isDeleted = true;
            scope.styleContent = '';


            scope.deleteStyle = function () {
                scope.isDeleted = false;
                scope.isAddstatus = false;
                //scope.styleitem.itemContent=scope.styleContent;
                scope.removeAssignedStyle(scope.styleitem);
            };
        }

    }
});