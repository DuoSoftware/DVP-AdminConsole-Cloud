mainApp.controller("articleFolderController", function ($scope,$state, $filter, $stateParams,$anchorScroll, articleBackendService,ShareData,notifiSenderService) {



    $anchorScroll();

    $scope.folderList=[];
    $scope.newFolder={};
    $scope.userGroups=ShareData.UserGroups;
    $scope.newFolderView=false;
    $scope.savebtn="Save";
    $scope.isUpdating=false;
    $scope.isSaving=false;






    var loadUserGroups = function () {
        notifiSenderService.getUserGroupList().then(function (response) {
            if (response.data && response.data.IsSuccess) {
                for (var j = 0; j < response.data.Result.length; j++) {
                    var userGroup = response.data.Result[j];
                    userGroup.listType = "Group";
                }
                $scope.userGroups = response.data.Result;
                ShareData.UserGroups=$scope.userGroups;
            }
        }, function (err) {

            $scope.showAlert("Load User Groups", "error", "Fail To Get User Groups.")
        });
    };
    if(ShareData.UserGroups.length==0)
    {
        loadUserGroups();
    }


    var loadFolderListOfCategory = function ()
    {

        articleBackendService.getFoldersOfCategory($stateParams.catId).then(function (resp) {
            if(resp && resp.folders)
            {
                $scope.folderList=resp.folders;
            }
            else
            {
                $scope.folderList=[];
            }


        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Article Folders")
        });
    }
    var loadAllFolderList = function () {

        articleBackendService.getAllFolders().then(function (resp) {
            $scope.folderList=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Article Folders")
        });
    }

    if($stateParams.editmode =="true")
    {
        $scope.newFolderView=true;
    }

    if($stateParams.catId && $stateParams.catName)
    {
        loadFolderListOfCategory();
        $scope.foldername=$stateParams.catName;
    }
    else
    {
        loadAllFolderList();
    }

    $scope.showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.toggleNewFolderView = function () {
        $scope.newFolderView = !$scope.newFolderView;
        $scope.newFolder={};
        $scope.savebtn="Save";
        $scope.isUpdating=false;
    };



    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(bu) {
            return (bu.unitName.toLowerCase().indexOf(lowercaseQuery) != -1);

        };
    }


    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.userGroups) {
                return $scope.userGroups;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.userGroups.filter(createFilterFor(query)) : [];
            return results;
        }

    };

    $scope.saveNewFolder = function () {

        $scope.isSaving=true;
        if($scope.savebtn=="Save")
        {

            $scope.newFolder.businessUnit=ShareData.BusinessUnit;
            articleBackendService.saveNewArticleFolder($scope.newFolder).then(function (resp) {
                $scope.isSaving=false;
                if(!$scope.folderList)
                {
                    $scope.folderList=[];
                }
                $scope.folderList.unshift(resp);
                $scope.newFolder={};
                $scope.toggleNewFolderView();
                if($stateParams.catId)
                {
                    articleBackendService.attachFolderToCategory($stateParams.catId,resp._id).then(function (resAttach) {
                        $scope.showAlert("Success","success","Folder Saved  Successfully");
                    },function (errAttach) {
                        $scope.showAlert("Error","error","Folder Attaching to Category failed");
                    })
                }
                else
                {
                    $scope.showAlert("Success","success","Folder Saved  Successfully");
                }

            },function (err) {
                $scope.showAlert("Error","error","Folder Saving failed");
            })
        }
        else
        {
            articleBackendService.updateFolder($scope.newFolder._id,$scope.newFolder).then(function (resp) {
                $scope.isSaving=false;
                $scope.isUpdating=false;

                $scope.folderList =  $scope.folderList.filter(function (item) {
                    return item._id!=resp._id;
                });
                $scope.folderList.unshift(resp);



                $scope.newFolder={};
                $scope.toggleNewFolderView();
                $scope.showAlert("Success","success","Folder Updating Succeeded");

            },function (err) {
                $scope.showAlert("Error","error","Folder Updating failed");
            })
        }




    };

    $scope.goToArticles = function (item,title) {
        $state.go('console.articles', {fId:item,editmode:true,fname:title});
    };
    $scope.goToArticlesWithoutNew = function (item,title) {
        $state.go('console.articles', {fId:item,editmode:false,fname:title});
    };




    var loadFullFolder = function (fId) {
        articleBackendService.getFullFolder(fId).then(function (resp) {

            $scope.newFolderView=true;
            $scope.newFolder =resp;



        });
    };

    $scope.openForEditing = function (fId) {

        $anchorScroll();
        loadFullFolder(fId);
        $scope.savebtn="Update";
        $scope.isUpdating=true;


    };



    $scope.onChipAdd = function (chip) {

        if($scope.isUpdating)
        {
            articleBackendService.attachUserGroupToArticle(chip._id,$scope.newFolder._id).then(function (resp) {

            });
        }


    };
    $scope.onChipDelete = function (chip) {


        if($scope.isUpdating)
        {
            articleBackendService.detachUserGroupToArticle(chip._id,$scope.newFolder._id).then(function (resp) {

            });
        }


    };
    $scope.setEnable = function (fId,state) {
        articleBackendService.updateEnablityOfFolder(fId,state).then(function (resp) {

            $scope.showAlert("Success","success","State changed of Category");
        });

    }
    $scope.toolTipGenerator = function (state) {

        if(state)
        {
            return "UnPublish";
        }
        else
        {
            return "Publish";
        }
    }

});


