mainApp.controller("articleManagerController", function ($scope, $filter, $stateParams,$anchorScroll, articleBackendService,ShareData) {



    $anchorScroll();

    $scope.articleList=[];
    $scope.articleTags=[];
    $scope.newArticle={};
    $scope.folderId="";
    $scope.isEditable=false;
    $scope.newArticleView=false;
    $scope.newTags=[];
    $scope.isSaving=false;
    $scope.isUpdating=false;
    $scope.savebtn="Save";
    $scope.newSearchTags=[];
    $scope.newSearchTagsList=[];
    $scope.currentArticle={};
    $scope.emptyScope = function() {
        // console.log($scope.autoSongs);
        $scope.newSearchTagsList = [];
    };
    $scope.edittitle="Create New Article";
    $scope.isDemo= false;
    $scope.sectionOfCurrentArticle=[];
    $scope.allSections=[];


    $scope.goBack = function () {
        $window.history.back();
    }


    var loadArticlesOfFolder = function () {

        articleBackendService.getArticlesOfFolders($stateParams.fId).then(function (resp) {
            $scope.articleList=resp.articles;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    };
    var loadArticleTags = function () {

        articleBackendService.getArticlesTags().then(function (resp) {
            $scope.articleTags=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    };
    var loadAllArticles = function () {

        articleBackendService.getAllArticles().then(function (resp) {
            $scope.articleList=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    };
    var loadFullArticle = function (aId,isView) {

        $scope.emptyScope();
        articleBackendService.getArticle(aId).then(function (resp) {


            if(isView)
            {
                $scope.currentArticle = resp;
                $scope.isDemo=true;
            }
            else
            {
                $scope.isDemo=false;
                $scope.newArticleView=true;


                $scope.newArticle =resp;


                $scope.newTags = resp.tags;



                resp.tags.forEach(function (item) {
                    $scope.newArticle.tags=[];
                    $scope.newArticle.tags.push(item.tag) ;
                });



                if($scope.newArticle.search )
                {
                    //$scope.newSearchTags$scope.newArticle.search.keywords;
                    //$scope.newSearchTags = $scope.newSearchTags.concat($scope.newArticle.search.keywords)

                    if($scope.newArticle.search.keywords)
                    {
                        $scope.newArticle.search.keywords.forEach(function(item){
                            if($scope.newSearchTagsList.indexOf(item)==-1)
                            {
                                $scope.newSearchTagsList.push({tag:item});
                            }

                        })
                    }
                    if($scope.newArticle.search.meta)
                    {
                        $scope.newArticle.searchmeta=$scope.newArticle.search.meta;
                    }



                }
            }



        });
    };
    var loadSectionsOfArticle = function (aId) {
        articleBackendService.getSectionsOfArticle(aId).then(function (resp) {
            $scope.sectionOfCurrentArticle=resp;

        });
    };
    var loadAllSections = function () {
        articleBackendService.getAllFolders().then(function (resAll) {
            $scope.allSections=resAll;
        })
    }





    if($stateParams.editmode =="true")
    {
        $scope.newArticleView=$stateParams.editmode;

    }

    if($stateParams.fId && $stateParams.fname)
    {
        $scope.folderId=$stateParams.fId;
        $scope.articlename=$stateParams.fname;
        loadArticlesOfFolder();

        $scope.allSections.forEach(function (item) {
            if(item._id==$stateParams.fId)
            {
                $scope.sectionOfCurrentArticle.push(item);
            }
        })

    }
    else
    {
        loadAllArticles();
    }

    $scope.showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    loadArticleTags();
    loadAllSections();

    $scope.toggleNewArticleView = function () {
        $scope.newArticle={};
        $scope.newTags=[];
        $scope.newArticleView = !$scope.newArticleView;
        $scope.savebtn="Save";
        $scope.isUpdating=false;
        $scope.newSearchTags=[];
        $scope.edittitle="Create New Article";
        $scope.isDemo=false;

    };

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(tag) {
            return (tag.tag.toLowerCase().indexOf(lowercaseQuery) != -1);

        };
    }
    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.articleTags) {
                return $scope.articleTags;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.articleTags.filter(createFilterFor(query)) : [];
            return results;
        }

    };


    function createFilterForSection(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(section) {
            return (section.title.toLowerCase().indexOf(lowercaseQuery) != -1);

        };
    }
    $scope.querySearchSection = function (query) {
        if (query === "*" || query === "") {
            if ($scope.allSections) {
                return $scope.allSections;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.allSections.filter(createFilterForSection(query)) : [];
            return results;
        }

    };

    $scope.onChipAdd = function (chip) {

        if(!$scope.newArticle.tags)
        {
            $scope.newArticle.tags=[];
        }
        $scope.newArticle.tags.push(chip.tag);
        if($scope.isUpdating)
        {
            articleBackendService.attachTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {

            });
        }


    };
    $scope.onChipDelete = function (chip) {


        if($scope.isUpdating)
        {
            articleBackendService.detachTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {
                console.log(resp);
            });
        }


    };

    $scope.onChipAddSection = function (chip) {

        if($scope.savebtn!=="Save")
        {
            articleBackendService.AddArticleToFolder($scope.newArticle._id,chip._id).then(function (resp) {

            })
        }


    };
    $scope.onChipDeleteSection = function (chip) {

        if($scope.savebtn!=="Save") {
            articleBackendService.RemoveArticleFromFolder($scope.newArticle._id, chip._id).then(function (resp) {

            })
        }
    };

    $scope.saveNewArticle = function () {

        $scope.isSaving=true;
        if($scope.savebtn=="Save")
        {
            $scope.newArticle.businessUnit=ShareData.BusinessUnit;
            /*$scope.newArticle.folder=$scope.folderId;*/
            $scope.newArticle.folder=$scope.sectionOfCurrentArticle.map(function (item) {
                return item._id;
            });

            articleBackendService.saveNewArticle($scope.newArticle,$scope.folderId).then(function (resp) {

                if(resp)
                {
                    $scope.isSaving=false;

                    $scope.articleList.unshift(resp);

                    $scope.newAddedTags =[];


                    loadArticleTags();



                    if($scope.newArticle.searchTags)
                    {
                        articleBackendService.attachSearchTagToArticle($scope.newArticle.searchTags,resp._id).then(function (resp) {

                        });
                    }
                    if($scope.newArticle.searchmeta)
                    {
                        articleBackendService.attachSearchMetaToArticle($scope.newArticle.searchmeta,resp._id).then(function (resp) {

                        });
                    }



                    $scope.newArticle={};
                    $scope.newTags=[];
                    $scope.toggleNewArticleView();


                    $scope.showAlert("Success","success","Article Saving Succeeded");
                }
                else
                {
                    $scope.showAlert("Error","error","New Article Adding Failed");
                    $scope.isSaving=false;
                }



            },function (err) {
                $scope.showAlert("Error","error","Article Saving failed");
                $scope.isSaving=false;
            })
        }
        else
        {

            delete $scope.newArticle.tags;
            delete $scope.newArticle.folder;


            articleBackendService.updateArticle($scope.newArticle._id,$scope.newArticle).then(function (resp) {
                $scope.isSaving=false;
                $scope.isUpdating=false;

                $scope.articleList =  $scope.articleList.filter(function (item) {
                    return item._id!=resp._id;
                });
                $scope.articleList.unshift(resp);

                resp.tags.forEach(function (item) {

                    index = $scope.articleTags.findIndex(function (i) {
                        i._id===item._id;
                    });
                    if(index==-1)
                    {
                        $scope.articleTags.push(item);
                    }

                });
                if($scope.newArticle.searchmeta)
                {
                    articleBackendService.attachSearchMetaToArticle($scope.newArticle.searchmeta,$scope.newArticle._id).then(function (resp) {

                    });
                }


                $scope.newArticle={};
                $scope.newTags=[];
                $scope.newSearchTags=[];
                $scope.toggleNewArticleView();
                $scope.showAlert("Success","success","Article Updating Succeeded");

            },function (err) {
                $scope.showAlert("Error","error","Article Updating failed");
            })
        }



    };

    $scope.openForEditing = function (aId) {

        $anchorScroll();
        loadFullArticle(aId,false);
        $scope.savebtn="Update";
        $scope.isUpdating=true;
        $scope.edittitle="Update Article";
        loadSectionsOfArticle(aId);


    };

    $scope.openForView = function (aId) {

        $anchorScroll();
        $scope.isDemo=true;
        loadFullArticle(aId,true);
        $scope.edittitle="Create New Article";


    }

    $scope.closeView = function()
    {
        $scope.isDemo=false;
    }

    $scope.setEnable = function (aId,state) {
        articleBackendService.updateEnablityOfArticle(aId,state).then(function (resp) {

            $scope.showAlert("Success","success","State changed of Article");
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

    $scope.voteFilter = function (votes,state) {

        if(votes)
        {
            return  voteList = votes.filter(function (vote) {
                return vote.vote==state;
            });
        }
        else
        {
            return [];
        }


    }

    /*$scope.onSearchChipAdd = function (chip) {

        if($scope.isUpdating)
        {
            articleBackendService.attachSearchTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {

            });
        }


    };
    $scope.onSearchChipDelete = function (chip) {


        if($scope.isUpdating)
        {
            articleBackendService.detachSearchTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {
                console.log(resp);
            });
        }


    };*/
    $scope.onSearchChipAdd = function (chip) {

        if($scope.isUpdating)
        {
            articleBackendService.attachSearchTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {

            });
        }
        else
        {
            if(!$scope.newArticle.searchTags)
            {
                $scope.newArticle.searchTags=[];
            }
            $scope.newArticle.searchTags.push(chip.tag);
        }


    };
    $scope.onSearchChipDelete = function (chip) {


        if($scope.isUpdating)
        {
            articleBackendService.detachSearchTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {
                console.log(resp);
            });
        }
        else {
            if(!$scope.newArticle.searchTags)
            {
                $scope.newArticle.searchTags=[];
            }
            $scope.newArticle.searchTags.splice($scope.newSearchTags.searchTags.indexOf(chip.tag),1);
        }


    };

});


