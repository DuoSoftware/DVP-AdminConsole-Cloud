/**
 * Created by Pawan on 6/18/2016.
 */
mainApp.controller("ardsController", function ($scope, $state, ardsBackendService, loginService,$anchorScroll) {

    $anchorScroll();
    $scope.addNew = false;
    $scope.ArdsList = [];
    $scope.tasks = [];
    $scope.groups = [];
    $scope.attributeGroups = [];
    $scope.attributeGroup;
    $scope.RequestServers = [];


    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(group) {
            return (group.GroupName.toLowerCase().indexOf(lowercaseQuery) != -1);
            ;
        };
    }

    /* $scope.querySearch = function(query) {
     var results = query ? $scope.groups.filter(createFilterFor(query)) : [];
     return results;
     };*/


    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.groups) {
                return $scope.groups;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.groups.filter(createFilterFor(query)) : [];
            return results;
        }

    };

    $scope.addNewArds = function (resource) {

        $scope.newArds.AttributeGroups = [];
        for (var i = 0; i < $scope.attributeGroups.length; i++) {
            $scope.newArds.AttributeGroups.push($scope.attributeGroups[i]);
        }

        ardsBackendService.saveArds($scope.newArds).then(function (response) {
            if (response.data.IsSuccess) {
                console.log("Successfully saved");
                $scope.showAlert("Success", "Saved successfully", "success");
                $state.reload();
            }
            else {
                $scope.showAlert("Error", "Error in saving", "error");
                console.log("Error in response")
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.showAlert("Error", "Error in saving", "error");
            console.log("Exception in request ", error);
        })

    };

    $scope.onChipAdd = function (chip) {

        $scope.attributeGroups.push(chip.GroupId);
        console.log("add attGroup " + $scope.attributeGroups);

    };
    $scope.onChipDelete = function (chip) {

        var index = $scope.attributeGroups.indexOf(chip.GroupId);
        console.log("index ", index);
        if (index > -1) {
            $scope.attributeGroups.splice(index, 1);
            console.log("rem attGroup " + $scope.attributeGroups);
        }


    };


    $scope.removeDeleted = function (item) {

        var index = $scope.AppList.indexOf(item);
        if (index != -1) {
            $scope.AppList.splice(index, 1);
            $scope.showAlert("Removed", "Removed successfully", "success");
        }
        else {
            $scope.showAlert("Error", "Error in removing", "error");
        }

    };
    $scope.reloadPage = function () {
        $state.reload();
    };

    $scope.GetARDSRecords = function () {
        ardsBackendService.getArdsRecords().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Ards list " + response.data.Exception);
            }
            else {
                $scope.ArdsList = response.data.Result;
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Ards service " + error);
        });

    };

    $scope.LoadTasks = function () {
        ardsBackendService.getTasks().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.tasks = response.data.Result;

            }
            else {
                console.log("Task loading failed");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Task loading error", error);
        });
    };
    $scope.LoadGroups = function () {
        ardsBackendService.getGroups().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.groups = response.data.Result;

            }
            else {
                console.log("group loading failed");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("group loading error", error);
        });
    };
    $scope.LoadServers = function () {
        ardsBackendService.getRequestServers().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.RequestServers = response.data.Result;

            }
            else {
                console.log("server loading failed");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("server loading error", error);
        });
    };

    $scope.cancleEdit = function () {
        $scope.addNew = false;
    };


    $scope.GetARDSRecords();
    $scope.LoadTasks();
    $scope.LoadGroups();
    $scope.LoadServers();

});