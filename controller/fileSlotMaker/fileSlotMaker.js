/**
 * Created by Pawan on 11/15/2016.
 */


mainApp.controller("fileSlotController", function ($scope, $state, $filter,tagBackendService,fileSlotService,$anchorScroll) {

    $anchorScroll();
    $scope.tagList=[];
    $scope.tagCategoryList=[];
    $scope.availableTags=[];
    $scope.fileSlotArrays=[];


    $scope.showAlert = function (title,content,type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.loadFileSlotArrays = function () {
        fileSlotService.getFileSlotArrays().then(function (response) {
            $scope.fileSlotArrays = response.data.Result;

        }, function (err) {
            $scope.showAlert("Load file slots", "Error in loading fileslots", "error");
        });
    };
    $scope.loadFileSlotArrays();



    $scope.loadTags = function () {
        tagBackendService.getAllTags().then(function (response) {
            $scope.tagList = response.data.Result;
            $scope.availableTags = $scope.availableTags.concat($scope.tagList);

        }, function (err) {
            $scope.showAlert("Load Tags", "Fail To Get Tag List.","error");
        });
    };
    $scope.loadTags();


    $scope.loadTagCategories = function () {
        tagBackendService.getTagCategories().then(function (response) {
            $scope.tagCategoryList = response.data.Result;
            $scope.availableTags = $scope.availableTags.concat($scope.tagCategoryList);

        }, function (err) {
            //$scope.showAlert("Load Tags", "error", "Fail To Get Tag List.")
        });
    };
    $scope.loadTagCategories();

    $scope.refreshTags= function () {
        $scope.tagList=[];
        $scope.tagCategoryList=[];
        $scope.availableTags=[];
        $scope.loadTags();
        $scope.loadTagCategories();
    }

    function createTagFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(group) {
            return (group.name.toLowerCase().indexOf(lowercaseQuery) != -1);
        };
    }

    $scope.queryTagSearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.availableTags) {
                return $scope.availableTags;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.availableTags.filter(createTagFilterFor(query)) : [];
            return results;
        }

    };

    /*$scope.tagSelectRoot = 'root';
     $scope.onChipAddTag = function (chip) {
     if (!chip.tags || (chip.tags.length === 0)) {
     setToDefault();
     return;
     }
     if ($scope.tagSelectRoot === 'root') {
     $scope.tagSelectRoot = 'sub';
     $scope.availableTags = chip.tags;
     }
     else if ($scope.tagSelectRoot === 'sub') {

     var tempTags = [];
     angular.forEach(chip.tags, function (item) {
     var tags = $filter('filter')($scope.tagList, {_id: item}, true);
     tempTags = tempTags.concat(tags);
     });
     $scope.availableTags = tempTags;
     $scope.tagSelectRoot = 'child';

     }
     else {
     if (chip.tags) {
     if (chip.tags.length > 0) {
     $scope.availableTags = chip.tags;
     return;
     }
     }
     setToDefault();
     }

     };

     $scope.loadPostTags = function (query) {
     return $scope.postTags;
     };
     */
    /*var removeDuplicate = function (arr) {
     var newArr = [];
     angular.forEach(arr, function (value, key) {
     var exists = false;
     angular.forEach(newArr, function (val2, key) {
     if (angular.equals(value.name, val2.name)) {
     exists = true
     }
     ;
     });
     if (exists == false && value.name != "") {
     newArr.push(value);
     }
     });
     return newArr;
     };
     */
    $scope.newAddTags = [];
    $scope.postTags = [];

    /* var setToDefault = function () {
     var ticTag = undefined;
     angular.forEach($scope.newAddTags, function (item) {
     if (ticTag) {
     ticTag = ticTag + "." + item.name;
     } else {
     ticTag = item.name;
     }

     });
     if (ticTag) {
     $scope.postTags.push({name: ticTag});
     $scope.postTags = removeDuplicate($scope.postTags);
     }

     $scope.newAddTags = [];
     $scope.availableTags = $scope.tagCategoryList;
     $scope.tagSelectRoot = 'root';
     };

     $scope.onChipDeleteTag = function (chip) {
     setToDefault();
     //attributeService.DeleteOneAttribute($scope.groupinfo.GroupId, chip.AttributeId).then(function (response) {
     //    if (response) {
     //        console.info("AddAttributeToGroup : " + response);
     //        $scope.showAlert("Info", "Info", "ok", "Successfully Delete " + chip.Attribute);
     //    }
     //    else {
     //        $scope.resetAfterDeleteFail(chip);
     //        $scope.showError("Error", "Fail To Delete " + chip.Attribute);
     //    }
     //}, function (error) {
     //    $scope.showError("Error", "Fail To Delete " + chip.Attribute);
     //    $scope.resetAfterDeleteFail(chip);
     //});

     };*/

    $scope.newSlot = {};
    $scope.saveFileSlotArray = function () {

        //fileSlotService.saveFileSlot(newSlot)
        if ($scope.newAddTags) {
            $scope.newSlot.tags = $scope.newAddTags.map(function (obj) {
                return obj.name;
            });
        }


        fileSlotService.saveFileSlotArray($scope.newSlot).then(function (resSave) {
            if(resSave.data.IsSuccess)
            {
                //alert("Success");
                $scope.fileSlotArrays.push(resSave.data.Result);
                $scope.newSlot={};
                $scope.newAddTags=[];
                $scope.showAlert("New SlotArray","New SlotArray added successfully","success");
            }
            else{
                $scope.showAlert("New SlotArray","New SlotArray adding failed","error");
            }
        }), function (errSave) {
            $scope.showAlert("New SlotArray","New SlotArray adding failed","error");
        }

    }





});



