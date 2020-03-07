/**
 * Created by Pawan on 6/17/2016.
 */

mainApp.controller("extensionController", function ($scope, $state, extensionBackendService, ruleconfigservice, loginService,$anchorScroll) {


    $anchorScroll();
    $scope.Extensions = [];
    $scope.AppList = [];
    $scope.newApplication = {};
    $scope.addNew = false;
    $scope.MasterAppList = [];
    $scope.IsDeveloper = false;
    $scope.Developers = [];
    $scope.searchCriteria = "";


    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.removeDeleted = function (item) {

        var index = $scope.Extensions.indexOf(item);
        if (index != -1) {
            $scope.Extensions.splice(index, 1);
        }

    };
    $scope.reloadPage = function () {
        $state.reload();
    };


    $scope.cancleEdit = function () {
        $scope.addNew = false;
    };

    $scope.applications = [];

    var loadApplications = function(){
        ruleconfigservice.loadApps()
            .then(function(appList)
            {
                $scope.applications = [];
                if(appList.data)
                {
                    var arr = appList.data.Result.map(function(app){
                        app.id = app.id.toString();
                        return app;
                    });
                    $scope.applications = arr;
                }

            }).catch(function(err)
            {
                $scope.showAlert("Error", "Extension saving error ", "error");
            })
    };

    loadApplications();


    // $scope.GetApplications();

    $scope.addNewExtension = function (resource) {

        $scope.extension = resource;
        $scope.extension.Enabled = true;
        $scope.extension.DodActive = true;
        extensionBackendService.saveNewExtension(resource).then(function (response) {
            if (response.data.IsSuccess) {
                console.log("Extension added successfully");
                extensionBackendService.assignDodToExtension(response.data.Result.id, resource.DodNumber).then(function (response) {

                    if (response.data.IsSuccess) {
                        console.log("Dod assigned to Extension");
                        $scope.showAlert("Success", "Extension saved successfully", "success");
                        $scope.searchCriteria = "";
                        $scope.reloadPage();
                    }
                    else {
                        console.log("Error in assigning DOD to Extension ", response.data.Exception.Message);
                        $scope.showAlert("Error", "Extension saving failed ", "error");
                        $scope.reloadPage();
                    }
                }, function (error) {
                    loginService.isCheckResponse(error);
                    console.log("Extension in assigning DOD to Extension ", error);
                    $scope.showAlert("Error", "Extension saving error ", "error");
                    $scope.reloadPage();
                });
            }
            else {
                $scope.showAlert("Error", "Extension saving error ", "error");
                console.log("Extension saving error ", response.data.Exception.Message);
                $scope.reloadPage();
            }


        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.showAlert("Error", "Extension saving error ", "error");
            $scope.reloadPage();
        });
    };


    $scope.GetExtensions = function () {
        extensionBackendService.getExtensions().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking limit list " + response.data.Exception.Message);
            }
            else {
                $scope.Extensions = response.data.Result;

                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking App service " + error);
        });
    };
    $scope.GetExtensions();


});