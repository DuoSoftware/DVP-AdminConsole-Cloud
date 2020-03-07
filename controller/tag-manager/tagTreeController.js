/**
 * Created by Pawan on 8/24/2016.
 */
mainApp.controller('tagcontroller', function ($scope, $rootScope, $state, $uibModal, jwtHelper,  tagBackendService,
                                              loginService) {
    var tree, treedata_avm = [];

    $scope.my_data = [];
    $scope.newChildObject = {};
    $scope.tagCategories = [];
    $scope.currentCatID = "";
    $scope.isTagCatConfig = false;
    $scope.isTagConfig = false;
    $scope.tagList = [];
    $scope.isConfig = false;
    $scope.isTreeView = false;

    $scope.showTaggingConig = function () {
        $scope.isConfig = !$scope.isConfig;
        $scope.isTreeView = !$scope.isTreeView;
    }
    $scope.showTagCatConig = function () {
        $scope.isTagCatConfig = !$scope.isTagCatConfig;
    };
    $scope.showTagConig = function () {
        $scope.isTagConfig = !$scope.isTagConfig;
    };

    $scope.pickAllTags = function () {
        tagBackendService.getAllTags().then(function (response) {
            if (!response.data.IsSuccess) {

                console.info("Error in getting tag categories  " + response.data.Exception);

                //$scope.showAlert("Error",)
            }
            else {
                $scope.tagList = response.data.Result;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            console.info("Error in getting tag categories  " + err);
        });
    };

    $scope.pickAllTags();

    $scope.showAlert = function (tittle, content, type) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.loadTagDetails = function (tagData, callback) {
        if (tagData) {
            tagBackendService.getTagDetails(tagData._id).then(function (response) {

                if (!response.data.IsSuccess) {
                    callback(new Error("Error"), null);

                }
                else {
                    callback(null, response.data.Result);

                }
            }, function (err) {
                loginService.isCheckResponse(err);
                console.log("Tag detail picking error ", err);
                callback(err, null);
            });


        }
        else {
            callback(new Error("Invalid Tag"), null);
        }

    };

    $scope.childTreeGenerator = function (childTags, motherBranch) {


        for (var i = 0; i < childTags.length; i++) {
            $scope.loadTagDetails(childTags[i], function (error, tagResponse) {
                if (error) {
                    console.log(error);
                }
                else {

                    var newChild = $scope.try_adding_a_branch(motherBranch, tagResponse);

                    /* if (tagResponse.tags.length > 0) {
                         $scope.childTreeGenerator(tagResponse.tags, newChild)
                     }*/


                }
            });
        }
    }

    $scope.loadCategoryData = function () {
        tagBackendService.getTagCategories().then(function (response) {

            if (!response.data.IsSuccess) {

                console.info("Error in getting tag categories  " + response.data.Exception);

                //$scope.showAlert("Error",)
            }
            else {
                $scope.tagCategories = response.data.Result;
            }

        }, function (err) {

            loginService.isCheckResponse(err);
            console.info("Error in getting tag categories " + err);


        });


    };

    $scope.loadImmediateChildren = function ()
    {
        var selectedBranch;
        selectedBranch = tree.get_selected_branch();


        $scope.loadTagDetails(selectedBranch,function (errChild,resChild) {
            if(errChild)
            {
                console.info("Error in getting child tags  " + errChild);
            }
            else
            {
                if(resChild && resChild.tags)
                {
                    if( resChild.tags.length == 0)
                    {
                        $scope.showAlert("Info", "No children to load", "info");
                    }
                    else
                    {
                        $scope.childTreeGenerator(resChild.tags,selectedBranch);
                    }
                }
                else
                {
                    $scope.showAlert("Info", "Child Tags already loaded", "info");
                }


            }
        });



    }

    $scope.saveNewTagData = function (parentTag, newTagData) {

        var rootBranch = tree.get_first_branch();
        if (rootBranch == parentTag) {
            if (newTagData._id) {
                tagBackendService.attachTagToCategory(rootBranch._id, newTagData._id).then(function (response) {

                    if (response) {
                        if (!response.data.IsSuccess) {
                            console.log("New Tag adding failed");
                            $scope.showAlert("Error", "New tag adding failed", "error");
                        }
                        else {
                            console.log("New Tag adding succeeded");
                            $scope.showAlert("Success", "New Tag added successfully", "success");
                            $scope.try_adding_a_branch(parentTag, newTagData);
                        }
                    }
                    else {
                        console.log("New Tag adding failed");
                        $scope.showAlert("Error", "New tag adding failed", "error");

                    }


                }, function (err) {
                    loginService.isCheckResponse(err);
                    console.log("New Tag adding to category failed", err);
                    $scope.showAlert("Error", "New tag adding failed", "error");
                });
            }
            else {
                tagBackendService.saveAndAttachNewTagToCategory(rootBranch._id, newTagData).then(function (response) {

                    if (response) {
                        if (!response.data.IsSuccess) {
                            console.log("New Tag adding failed");
                            $scope.showAlert("Error", "New tag adding failed", "error");
                        }
                        else {
                            console.log("New Tag adding succeeded");
                            $scope.showAlert("Success", "New Tag added successfully", "success");
                            newTagData._id = response.data.Result._id;
                            $scope.try_adding_a_branch(parentTag, newTagData);
                        }
                    }
                    else {
                        console.log("New Tag adding failed");
                        $scope.showAlert("Error", "New tag adding failed", "error");

                    }


                }, function (err) {
                    loginService.isCheckResponse(err);
                    console.log("New Tag adding to category failed", err);
                    $scope.showAlert("Error", "New tag adding failed", "error");
                });
            }


        }
        else {
            if (newTagData._id) {
                tagBackendService.attachTagToTag(parentTag._id, newTagData._id).then(function (response) {

                    if (response) {
                        if (!response.data.IsSuccess) {
                            console.log("New Tag adding failed");
                            $scope.showAlert("Error", "New tag adding failed", "error");
                        }
                        else {
                            console.log("New Tag adding succeeded");
                            $scope.showAlert("Success", "New Tag added successfully", "success");
                            $scope.try_adding_a_branch(parentTag, newTagData);
                        }
                    }
                    else {
                        console.log("New Tag adding failed");
                        $scope.showAlert("Error", "New tag adding failed", "error");
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                    console.log("New Tag adding failed", err);
                    $scope.showAlert("Error", "New tag adding failed", "error");
                });
            }
            else {
                tagBackendService.saveAndAttachNewTag(parentTag._id, newTagData).then(function (response) {

                    if (response) {
                        if (!response.data.IsSuccess) {
                            console.log("New Tag adding failed");
                            $scope.showAlert("Error", "New tag adding failed", "error");
                        }
                        else {
                            console.log("New Tag adding succeeded");
                            $scope.showAlert("Success", "New Tag added successfully", "success");
                            newTagData._id = response.data.Result.newTagID;
                            $scope.try_adding_a_branch(parentTag, newTagData);
                        }
                    }
                    else {
                        console.log("New Tag adding failed");
                        $scope.showAlert("Error", "New tag adding failed", "error");
                    }


                }, function (error) {
                    loginService.isCheckResponse(error);
                    console.log("New Tag adding failed", error);
                    $scope.showAlert("Error", "New tag adding failed", "error");

                });
            }

        }


    };

    $scope.detachTag = function () {
        var selectedBranch;
        selectedBranch = tree.get_selected_branch();

        var rootBranch = tree.get_first_branch();

        var parent_ID = selectedBranch.parent_id;


        if (!parent_ID) {
            console.log("You cannot delete this Tag/Tag category");
        }
        else {
            if (parent_ID == rootBranch._id) {
                tagBackendService.detachTagFromCategory(parent_ID, selectedBranch._id).then(function (response) {
                    console.log("success");
                    $scope.showAlert("Success", "Tag detached from Category successfully", "success");
                    $scope.treeBuilder();
                }, function (error) {
                    loginService.isCheckResponse(error);
                    console.log("error");
                    $scope.showAlert("Error", "Tag detached from Category failed", "error");
                });
            }
            else {
                tagBackendService.detachTagFromTag(parent_ID, selectedBranch._id).then(function (response) {
                    console.log("success");
                    $scope.showAlert("Success", "Tag detached from Tag successfully", "success");
                    $scope.treeBuilder();
                }, function (error) {
                    loginService.isCheckResponse(error);
                    console.log("error");
                    $scope.showAlert("Error", "Tag detached from Tag failed", "error");
                });
            }
        }


    };
    $scope.deleteTag = function (tag) {
        tagBackendService.deleteTagFromDB(tag._id).then(function (response) {
            if (response) {
                if (!response.data.IsSuccess) {
                    console.log("Tag deletion failed");
                    $scope.showAlert("Error", "Tag deletion failed", "error");
                }
                else {
                    console.log("Tag deletion succeeded");
                    $scope.showAlert("Success", "Tag deletion succeeded", "success");

                    var index = $scope.tagList.indexOf(tag);
                    if (index != -1) {
                        $scope.tagList.splice(index, 1);
                    }

                }
            }
            else {
                console.log("Tag deletion failed");
                $scope.showAlert("Error", "Tag deletion failed", "error");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Tag deletion failed", error);
            $scope.showAlert("Error", "Tag deletion failed", "error");
        });
    };


    $scope.deleteCategory = function (tagCat) {
        tagBackendService.deleteTagCategoryFromDB(tagCat._id).then(function (response) {
            if (response) {
                if (!response.data.IsSuccess) {
                    console.log("Tag Category deletion failed");
                    $scope.showAlert("Error", "Tag Category deletion failed", "error");
                }
                else {
                    console.log("Tag Category deletion succeeded");
                    $scope.showAlert("Success", "Tag Category deletion succeeded", "success");

                    var index = $scope.tagCategories.indexOf(tagCat);
                    if (index != -1) {
                        $scope.tagCategories.splice(index, 1);
                    }

                }
            }
            else {
                console.log("Tag Category deletion failed");
                $scope.showAlert("Error", "Tag Category deletion failed", "error");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Tag deletion failed", error);
            $scope.showAlert("Error", "Tag Category deletion failed", "error");
        });
    }

    $scope.updateNewChange = function(tagData,isTag)
    {
        if(isTag)
        {
            $scope.tagList = $scope.tagList.map(function (item) {

                if(item._id == tagData._id)
                {
                    item.name=tagData.name;
                }
                return item;
            });
        }
        else
        {

            $scope.tagCategories = $scope.tagCategories.map(function (item) {

                if(item._id == tagData._id)
                {
                    item.name=tagData.name;
                }
                return item;
            });
        }
    }
    $scope.openCategoryUpdate = function (tagCat,isTag) {

        var tagState=true;
        if(!isTag)
        {
            tagState=false;
        }


        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/tag-manager/partials/updateTagModal.html',
            controller: 'UpdateTagController',
            size: 'sm',
            resolve: {
                selectedTag:function()
                {
                    return tagCat;
                },
                updateData:function()
                {
                    return $scope.updateNewChange;
                },
                isTag:function()
                {
                    return tagState;
                }

            }
        });


    }

    $scope.addNewTagObject = function (newTagData) {
        tagBackendService.addNewTagDetails(newTagData).then(function (response) {

            if (!response.data.IsSuccess) {
                console.log("Tag adding failed");
                $scope.showAlert("Error", "Tag adding failed", "error");
            }
            else {
                console.log("Tag adding succeeded");
                $scope.showAlert("Success", "Tag adding succeeded", "success");
                $scope.tagList.push(response.data.Result);

            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Tag adding failed", error);
            $scope.showAlert("Error", "Tag adding failed", "error");
        });
    };


    $scope.showModal = function (selectedBranch) {
        //modal show

        console.log(tree.get_closest_ancestor_next_sibling(parent));

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/tag-manager/partials/tagModal.html',
            controller: 'NewChildTagController',
            size: 'sm',
            resolve: {
                parentTag: function () {
                    return selectedBranch;
                },
                saveNewTagData: function () {
                    return $scope.saveNewTagData;
                }
            }
        });
    };

    $scope.saveNewTagCategoryData = function (tagCategory) {

        tagBackendService.addNewTagCategory(tagCategory).then(function (response) {
            if (!response.data.IsSuccess) {
                console.log("Tag Category adding failed");
                $scope.showAlert("Error", "Tag Category adding failed", "error");
            }
            else {
                console.log("Tag Category adding succeeded");
                $scope.showAlert("Success", "Tag Category adding succeeded", "success");
                $scope.tagCategories.push(response.data.Result);
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Tag Category adding failed");
            $scope.showAlert("Error", "Tag Category adding failed", "error");
        });
    };


    $scope.showNewCategoryModal = function () {
        //modal show
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/tag-manager/partials/tagCatModal.html',
            controller: 'NewTagCategoryController',
            size: 'sm',
            resolve: {
                saveNewTagCatData: function () {
                    return $scope.saveNewTagCategoryData;
                }
            }
        });
    };
    $scope.showNewTagModal = function () {
        //modal show
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/tag-manager/partials/newTagModal.html',
            controller: 'NewTagController',
            size: 'sm',
            resolve: {
                addNewTagData: function () {
                    return $scope.addNewTagObject;
                }
            }
        });
    };

    $scope.$watch('my_data', function () {

    });


    $scope.loadCategoryData();

    $scope.my_tree_handler = function (branch) {
        var _ref;
        $scope.output = "You selected: " + branch.label;
        if ((_ref = branch.data) != null ? _ref.description : void 0) {
            return $scope.output += '(' + branch.data.description + ')';
        }
    };

    $scope.my_data = treedata_avm;


    $scope.my_tree = tree = {};

    $scope.try_async_load = function () {
        $scope.my_data = [];
        $scope.doing_async = true;
        return $timeout(function () {
            if (Math.random() < 0.5) {
                $scope.my_data = treedata_avm;
            } else {
                $scope.my_data = treedata_geography;
            }
            $scope.doing_async = false;
            return tree.expand_all();
        }, 1000);
    };

    $scope.showNewChildModal = function () {
        var selectedBranch;
        selectedBranch = tree.get_selected_branch();

        var rootBranch = tree.get_first_branch();


        if (selectedBranch) {
            console.log(selectedBranch.label + " Selected");
            $scope.showModal(selectedBranch);
        }
        else {
            console.log("Branch selection error");
        }


    };

    $scope.treeBuilder = function () {

        $scope.isTagCatConfig = false;
        $scope.isTagConfig = false;
        $scope.isConfig = false;
        $scope.isTreeView = true;

        if (!$scope.currentCatID) {
            console.log("Invalid Category");
            $scope.showAlert("Error", "Invalid Category", "error");
        }
        else {
            $scope.my_data = [];
            $scope.newChildObject = {};
            treedata_avm = [];
            tagBackendService.getTagCategory($scope.currentCatID).then(function (response) {

                if (!response.data.IsSuccess) {

                    console.info("Error in adding new Application " + response.data.Exception);
                    $scope.showAlert("Error", "Invalid Category Data found", "error");

                    //$scope.showAlert("Error",)
                }
                else {
                    console.log("Success");
                    console.log(response.data.Result);

                    var rootData =
                        {
                            label: response.data.Result.name,
                            _id: response.data.Result._id,
                            children: []


                        }
                    var childTags = response.data.Result.tags;
                    treedata_avm.push(rootData);
                    console.log("Tree data found ", JSON.stringify(treedata_avm));
                    $scope.my_data = treedata_avm;
                    $scope.my_tree_handler(treedata_avm[0]);

                    $scope.childTreeGenerator(childTags, treedata_avm[0]);


                }

            }, function (error) {
                loginService.isCheckResponse(error);
                console.info("Error in adding new Application " + error);
                $scope.showAlert("Error", "Invalid Category", "error");
            });
        }

    };


    return $scope.try_adding_a_branch = function (currentBranch, childDetails) {

        var parentBranch = tree.get_selected_branch();


        return tree.add_branch(currentBranch, {
            label: childDetails.name,
            _id: childDetails._id,
            parent_id: currentBranch._id,
            children: []

        });
    };


});

mainApp.controller("NewChildTagController", function ($scope, $rootScope, $uibModalInstance, parentTag, saveNewTagData,
                                                      loginService,
                                                      tagBackendService) {


    $scope.showModal = true;
    $scope.showNewForm = false;
    $scope.tagList = [];

    $scope.ok = function () {
        var childTag =
            {
                name: $scope.tagNameData,
                description: $scope.tagDesc
            }
        saveNewTagData(parentTag, childTag);
        $scope.showModal = false;
        $uibModalInstance.close();

    };

    $scope.saveNewTag = function () {
        var childTag = {};
        if ($scope.showNewForm) {
            childTag =
                {
                    name: $scope.tagNameData,
                    descricption: $scope.tagDesc
                }

        }
        else {
            childTag = JSON.parse($scope.tagData);
        }

        saveNewTagData(parentTag, childTag);
        $scope.showModal = false;
        $uibModalInstance.close();


    };



    $scope.closeModal = function () {
        saveNewTagData(parentTag, null);
        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        saveNewTagData(parentTag, null);
        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.showNewTagForm = function () {
        $scope.showNewForm = !$scope.showNewForm;

    }

    $scope.loadTags = function () {
        tagBackendService.getAllTags().then(function (response) {

            if (!response.data.IsSuccess) {

                console.info("Error in picking tags " + response.data.Exception);

                //$scope.showAlert("Error",)
            }
            else {
                $scope.tagList = response.data.Result;
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking tags " + error);
        });
    };

    $scope.loadTags();


});
mainApp.controller("NewTagCategoryController", function ($scope, $rootScope, $uibModalInstance, saveNewTagCatData) {


    $scope.showModal = true;

    $scope.ok = function () {

        var tagCategoryData =
            {
                name: $scope.tagCatNameData

            }


        saveNewTagCatData(tagCategoryData);
        $scope.showModal = false;
        $uibModalInstance.close();
    };

    $scope.saveNewTagCategory = function () {
        var tagCategory = {};

        tagCategoryData =
            {
                name: $scope.tagCatNameData

            }


        saveNewTagCatData(tagCategoryData);
        $scope.showModal = false;
        $uibModalInstance.close();


    };

    $scope.closeModal = function () {

        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        saveNewTagCatData(parentTag, null);
        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };


});
mainApp.controller("NewTagController", function ($scope, $rootScope, $uibModalInstance, addNewTagData) {


    $scope.showModal = true;

    $scope.ok = function () {
        var tagData = {};

        tagData =
            {
                name: $scope.tagNameData,
                description: $scope.tagDesc

            }


        addNewTagData(tagData);
        $scope.showModal = false;
        $uibModalInstance.close();
    };

    /*$("#tagname").on("keypress", function(evt) {
        var keycode = evt.charCode || evt.keyCode;
        if (keycode == 46) {
            return false;
        }
    });*/

    /*document.querySelector("tagname").addEventListener("keypress", function (evt) {
        if (evt.which < 48 || evt.which > 57)
        {
            evt.preventDefault();
        }
    });*/







    $scope.addNewTag = function () {
        var tagData = {};

        tagData =
            {
                name: $scope.tagNameData,
                description: $scope.tagDesc

            }


        addNewTagData(tagData);
        $scope.showModal = false;
        $uibModalInstance.close();

    };

    $scope.closeModal = function () {
        saveNewTagData(parentTag, null);
        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        saveNewTagCatData(parentTag, null);
        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };


});
mainApp.controller("UpdateTagController", function ($scope, $rootScope, $uibModalInstance, selectedTag,updateData,tagBackendService,isTag) {


    $scope.showModal = true;
    $scope.selectedTag=selectedTag;
    $scope.newName=$scope.selectedTag.name;
    $scope.val ="";

    if(!isTag)
    {
        $scope.val ="Category";
    }

    $scope.showAlert = function (tittle, content, type) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.UpdateTagCategory = function()
    {
        if(isTag)
        {
            tagBackendService.updateTagName($scope.selectedTag._id,$scope.newName).then(function (res) {

                if(res.data.IsSuccess)
                {
                    res.data.Result.name=$scope.newName;
                    $scope.showAlert("Success","Updating Tag name succeeded","success");
                    updateData(res.data.Result,isTag);
                    $scope.showModal = false;
                    $uibModalInstance.close();
                }
                else
                {
                    $scope.showAlert("Error","Error in updating Tag name","error");
                }


            });
        }
        else
        {

            tagBackendService.updateTagCategoryName($scope.selectedTag._id,$scope.newName).then(function (res) {

                if(res.data.IsSuccess)
                {
                    res.data.Result.name=$scope.newName;
                    $scope.showAlert("Success","Updating Tag Category name succeeded","success");
                    updateData(res.data.Result,isTag);
                    $scope.showModal = false;
                    $uibModalInstance.close();
                }
                else
                {
                    $scope.showAlert("Error","Error in updating Tag Category name","error");
                }


            });
        }

    }



    $scope.closeModal = function () {

        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');

    };

    $scope.cancel = function () {

        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };


});

mainApp.directive('myEnterTag', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (e) {
            var k = e.keyCode;
            return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8   || (k >= 48 && k <= 57));
        });
    };
});
