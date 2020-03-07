/**
 * Created by Pawan on 2/14/2018.
 */

mainApp.controller("filecategoryController", function ($scope, $state, ardsBackendService,fileServiceApiAccess, loginService,$anchorScroll) {

    $anchorScroll();
    $scope.addNew = false;



    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };
    $scope.regex = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./1-9]*$/;


    $(document).on('change','textarea[id$=textCat]', function () {
        if (this.value.match(/[^a-zA-Z0-9 ]/g)) {
            this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '');
        }
    });



    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(group) {
            return (group.GroupName.toLowerCase().indexOf(lowercaseQuery) != -1);
            ;
        };
    }




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

    $scope.newFileCat={};
    $scope.newFileCat.Visible=true;
    $scope.newFileCat.Encripted=false;

    $scope.addFileCategory = function (resource) {


        $scope.newFileCat.Category=document.getElementById("textCat").value;

        if($scope.newFileCat.Category)
        {
            fileServiceApiAccess.addNewFileCategory(resource).then(function (resAdd) {
                $scope.showAlert("Success", "File Category Saved successfully", "success");
                $state.reload();
            },function (errAdd) {
                $scope.showAlert("Error", "Error in saving new file category", "error");
                console.log("Exception in request ", errAdd);
            });
        }
        else {
            $scope.showAlert("Error", "File Category name required", "error");
        }



    };

    $scope.reloadPage = function () {
        $state.reload();
    };

    $scope.GetFileCategories = function () {
        fileServiceApiAccess.getAllFileCategories().then(function (response) {

            if (!response.IsSuccess) {
                console.info("Error in picking File category list " + response.Exception);
                $scope.showAlert("Error", "Error in loading file categories", "error");
            }
            else {
                $scope.fCategoryList = response.Result;
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {

            console.info("Error in picking File category list " + error);
            $scope.showAlert("Error", "Error in loading file categories", "error");
        });

    };

    $scope.GetDefaultStorageOption = function () {
        fileServiceApiAccess.getDefaultFileStorageOption().then(function (resDef) {

            if(resDef)
            {
                $scope.defaultStorage=resDef.Result;
            }

        },function (errDef) {

        });
    };


    $scope.cancleEdit = function () {
        $scope.addNew = false;
    };


    $scope.GetFileCategories();
    $scope.GetDefaultStorageOption();

});

mainApp.directive('myEnterTag', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (e) {
            var k = e.keyCode;
            return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8   || (k >= 48 && k <= 57));
        });
    };
});