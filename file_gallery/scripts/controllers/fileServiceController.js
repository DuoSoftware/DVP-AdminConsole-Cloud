var app = angular.module("veeryConsoleApp");

app.controller('FileEditController', function ($scope, $filter,$q, FileUploader, fileService,userProfileApiAccess,$anchorScroll,ShareData)
{
    $anchorScroll();
    $scope.file = {};
    var uploader = $scope.uploader = new FileUploader({
        url: fileService.UploadUrl,
        headers: fileService.Headers
    });

    // FILTERS

    $scope.allowed_file_downLoad = ShareData.allowed_to_download();
    /*var allowed_to_download = function () {

        try {
            var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
            var res = $filter('filter')(decodeData.scope, {resource: "FileDownLoad"}, true);
            if (res.length > 0 && res[0].actions.length > 0) {
                $scope.allowed_file_downLoad = true;
            }
        } catch (ex) {
            console.error(ex);
        }
    };
    allowed_to_download();*/

    $scope.showError = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'error',
            styling: 'bootstrap3'
        });
    };
    $scope.showInfo = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'info',
            styling: 'bootstrap3'
        });
    };

    $scope.availableKb=0;
    $scope.usedSize=0;
    $scope.allocatedSpace=0;
    $scope.usedPtg=0;

    /*function bytesToSize(kbs) {

     var bytes = parseInt(kbs)*1024;
     var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
     if (bytes == 0) return 'n/a';
     var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
     if (i == 0) return bytes + ' ' + sizes[i];
     return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
     };

     function setToKbs(size,type) {

     var kbSize=0;

     switch(type)
     {
     case "MB" : kbSize = size*1024; break;
     case "GB" : kbSize = size*Math.pow(1024,2); break;
     case "TB" : kbSize = size*Math.pow(1024,3); break;
     default : size*1024; break;
     }

     return kbSize;

     };*/

    function getUsedSpaceInAllocatedStorageFormat(size,type) {

        var usdSize=0;

        switch(type)
        {
            case "MB" : usdSize = size/1024; break;
            case "GB" : usdSize = size/Math.pow(1024,2); break;
            case "TB" : usdSize = size/Math.pow(1024,3); break;
            default : size/1024; break;
        }

        return usdSize.toFixed(2);

    }


    $scope.loadFileStorageDetails = function () {

        fileService.getStorageDetails().then(function (resStore) {

            if(resStore.spaceLimit && resStore.spaceUnit && resStore.currTotal)
            {
                $scope.allocatedSpace=resStore.spaceLimit +" "+ resStore.spaceUnit;
                /*$scope.limitInKb = setToKbs(resStore.spaceLimit,resStore.spaceUnit);*/
                $scope.usedSize=getUsedSpaceInAllocatedStorageFormat(resStore.currTotal,resStore.spaceUnit);
                $scope.usedSizeWithType=$scope.usedSize+" "+resStore.spaceUnit;
                $scope.usedPtg  =(($scope.usedSize/resStore.spaceLimit)*100).toFixed(1);
                /* parseInt((parseInt(resStore.currTotal)/$scope.limitInKb)*100);*/

                $('#storage-bar').css('width', $scope.usedPtg+'%').attr('aria-valuenow', $scope.usedPtg);
                /*$('.progress-bar').addClass('progress-bar-striped bg-success progress-bar-animated');*/
                /*usedSize = bytesToSize(parseInt(resStore.currTotal));
                 availableSize = bytesToSize(limitInKb - parseInt(resStore.currTotal));*/

            }


        },function (errStore) {
            $scope.showInfo("Info","Storage details not found");
        })
    };




    $scope.loadFileStorageDetails();

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    $scope.UploadSize=0;
    $scope.getUploadSize = function () {
        fileService.getUploadSize().then(function (resSize) {
            $scope.UploadSize=resSize;
        },function (errRes) {

        });
    }
    $scope.getUploadSize();
    //uploader.formData.push({'DuoType' : 'fax'});

    // CALLBACKS

    $scope.disblUpload = false;

    $scope.checkReadyToUploadAll = function () {

        if(uploader.queue.filter(function( obj ) {return obj.readyToUpload == false;}).length>0)
        {
            $scope.disblUpload = true;
        }
        else {
            $scope.disblUpload = false;
        }



    };

    $scope.removeItemFromQueue = function (item) {
        uploader.queue = uploader.queue.filter(function( obj ) {return obj != item;});
        $scope.checkReadyToUploadAll();

    }

    $scope.disbleAllUpload=false;
    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
        if($scope.UploadSize !=0 && $scope.UploadSize<(parseInt(fileItem.file.size)/1024))
        {
            fileItem.readyToUpload=false;
            $scope.disbleAllUpload=true;
        }
        else
        {
            fileItem.readyToUpload=true;
        }

        $scope.checkReadyToUploadAll();


    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        if (!$scope.file.Category) {
            uploader.clearQueue();
            new PNotify({
                title: 'File Upload!',
                text: 'Please Select File Category.',
                type: 'error',
                styling: 'bootstrap3'
            });
            return;
        }
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        item.formData.push({'fileCategory': $scope.file.Category});
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
        if(response && response.Exception)
        {
            $scope.showError("Error in uploading file",response.Exception.Message);
        }

    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);

    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
        $scope.loadFileStorageDetails();
    };

    console.info('uploader', uploader);

    $scope.file = {};
    $scope.file.Category = undefined;
    $scope.loadFileService = function () {

        $scope.Categorys=[];
        userProfileApiAccess.getMyProfile().then(function (resProf) {
            if(resProf)
            {
                $scope.allowedCatagories=resProf.Result.allowed_file_categories;
                fileService.GetCatagories().then(function (response) {

                    angular.forEach(response,function (item) {

                        angular.forEach($scope.allowedCatagories,function (allowItem) {
                            if(item.Category === allowItem)
                            {
                                $scope.Categorys.push(item);
                            }
                        });


                    });



                }, function (error) {
                    console.info("GetCatagories err" + error);
                });



            }
        },function (errProf) {

        });



        /*fileService.GetCatagories().then(function (response) {

         $scope.Categorys = $filter('filter')(response, {Owner: "user"});
         if ($scope.Categorys) {
         if ($scope.Categorys.length > 0) {
         $scope.file.Category = $scope.Categorys[0].Category;
         }
         }
         }, function (error) {
         console.info("GetCatagories err" + error);

         });*/
    };

    $scope.loadFileService();


});

app.controller("FileListController", function ($scope, $location, $log, $filter, $http, $state, $uibModal, $anchorScroll,$q, fileService, jwtHelper, authService, baseUrls,userProfileApiAccess) {

    $anchorScroll();
    $scope.countByCategory = [];
    $scope.categoryId = 0;
    $scope.showPaging = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = "50";
    $scope.isLoading = true;
    $scope.noDataToshow = false;
    $scope.getPageData = function (Paging, page, pageSize, total) {
        $scope.files = [];
        $scope.noDataToshow = false;
        if ($scope.categoryId) {

            if($scope.searchFiles){
                fileService.searchFilesWithCategories($scope.fileSerach.StartTime, $scope.fileSerach.EndTime,$scope.searchCatObj,pageSize, page).then(function (response) {
                    $scope.files = response;
                    $scope.noDataToshow = response ? (response.length == 0) : true;
                }, function (err) {
                    $scope.showError("Error", "Error occurred while Loading Data.");
                    console.error(err);
                });
            }
            else {
                fileService.GetFilesCategoryID($scope.categoryId, pageSize, page).then(function (response) {
                 $scope.files = response;
                 $scope.noDataToshow = response ? (response.length == 0) : true;
             }, function (err) {
                    $scope.showError("Error", "Error occurred while Loading Data.");
                    console.error(err);
             });
            }
        }
        else {
            $scope.loadFileList(pageSize, page);
        }
    };


    $scope.internalUrl = baseUrls.fileServiceInternalUrl;
    $scope.isImage = function (source) {
        Utils.isImage(source).then(function (result) {
            $log.debug("isImage" + result);
            return result;
        });
    };

    $scope.isImageExtension = function (ext) {

        if(ext)
        {
            if(ext.split("/")[0]=="image")
            {
                return true
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }

    }

    $scope.Catagories = [];
    $scope.allowedCatagories=[];
    $scope.loadCatagories = function () {
        $scope.Catagories = [];

        userProfileApiAccess.getMyProfile().then(function (resProf) {
            if(resProf)
            {
                $scope.allowedCatagories=resProf.Result.allowed_file_categories;
                $scope.loadFileList($scope.pageSize, 1);
                fileService.GetCatagories().then(function (response) {

                    angular.forEach(response,function (item) {

                        angular.forEach($scope.allowedCatagories,function (allowItem) {
                            if(item.Category === allowItem)
                            {
                                $scope.Catagories.push(item);
                            }
                        });


                    });



                }, function (error) {
                    console.info("GetCatagories err" + error);
                });



            }
        },function (errProf) {

        });

        /* fileService.GetCatagories().then(function (response) {
         $scope.Catagories = $filter('filter')(response, {Owner: "user"});

         /!*angular.forEach($scope.Catagories, function (item) {
         fileService.GetFileCountCategoryID(item.id).then(function (counts) {
         if (counts) {
         $scope.countByCategory.push(counts);
         }
         }, function (error) {
         console.info("GetFileCountCategoryID err" + error);
         });
         });*!/

         }, function (error) {
         console.info("GetCatagories err" + error);
         });*/
    };
    $scope.loadCatagories();

    //get all file - page load
    $scope.files = [];
    var categoryObj = {
        categoryList:[]
    };


    $scope.availableKb=0;
    $scope.usedSize=0;
    $scope.allocatedSpace=0;
    $scope.usedPtg=0;

    /*function bytesToSize(kbs) {

        var bytes = parseInt(kbs)*1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };

    function setToKbs(size,type) {

        var kbSize=0;

        switch(type)
        {
            case "MB" : kbSize = size*1024; break;
            case "GB" : kbSize = size*Math.pow(1024,2); break;
            case "TB" : kbSize = size*Math.pow(1024,3); break;
            default : size*1024; break;
        }

        return kbSize;

    };*/

    function getUsedSpaceInAllocatedStorageFormat(size,type) {

        var usdSize=0;

        switch(type)
        {
            case "MB" : usdSize = size/1024; break;
            case "GB" : usdSize = size/Math.pow(1024,2); break;
            case "TB" : usdSize = size/Math.pow(1024,3); break;
            default : size/1024; break;
        }

        return usdSize.toFixed(2);

    }

    $scope.showInfo = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'info',
            styling: 'bootstrap3'
        });
    };


    $scope.loadFileStorageDetails = function () {

        fileService.getStorageDetails().then(function (resStore) {

            if(resStore.spaceLimit && resStore.spaceUnit && resStore.currTotal)
            {
                $scope.allocatedSpace=resStore.spaceLimit +" "+ resStore.spaceUnit;
                /*$scope.limitInKb = setToKbs(resStore.spaceLimit,resStore.spaceUnit);*/
                $scope.usedSize=getUsedSpaceInAllocatedStorageFormat(resStore.currTotal,resStore.spaceUnit);
                $scope.usedSizeWithType=$scope.usedSize+" "+resStore.spaceUnit;
                $scope.usedPtg  =(($scope.usedSize/resStore.spaceLimit)*100).toFixed(1);
                /* parseInt((parseInt(resStore.currTotal)/$scope.limitInKb)*100);*/

                $('.progress-bar').css('width', $scope.usedPtg+'%').attr('aria-valuenow', $scope.usedPtg);
                /*$('.progress-bar').addClass('progress-bar-striped bg-success progress-bar-animated');*/
                /*usedSize = bytesToSize(parseInt(resStore.currTotal));
                availableSize = bytesToSize(limitInKb - parseInt(resStore.currTotal));*/

            }


        },function (errStore) {
            $scope.showInfo("Info","No storage details found");
        })
    };




    $scope.loadFileStorageDetails();


    $scope.loadFileList = function (pageSize, currentPage) {
        $scope.files = [];
        $scope.noDataToshow = false;



        $scope.allowedCatagories.forEach(function (item) {
            categoryObj.categoryList.push(item);
        });


        fileService.getAvailableCategoryFiles(pageSize, currentPage,categoryObj).then(function (response) {
            $scope.files = response;
            $scope.noDataToshow = response ? (response.length == 0) : true;
            $scope.isLoading = false;
        }, function (err) {
            $scope.isLoading = false;
        });

        /*fileService.GetFiles(pageSize, currentPage).then(function (response) {
         $scope.files = response;
         $scope.noDataToshow = response ? (response.length == 0) : true;
         $scope.isLoading = false;
         }, function (err) {
         $scope.isLoading = false;
         });*/


    };

    $scope.loadFileList($scope.pageSize, 1);

    $scope.reloadPage = function () {
        $scope.fileToDelete = [];
        $scope.loadCatagories();
        $scope.getPageData("Paging", 1, $scope.pageSize, $scope.pageTotal);
    };

    $scope.loadFilesByCat = function (cat) {
        $scope.searchFiles = false;
        $scope.searchCatObj.categoryList.push(cat.Category);
        $scope.getFilesCategoryID(cat, 1);
    };

    $scope.getFilesCategoryID = function (category, currentPage) {
        $scope.isLoading = true;
        $scope.noDataToshow = false;
        $scope.pageSize = "50";
        $scope.pageTotal = category.fileCount.Count;
        $scope.currentPage = currentPage;
        $scope.categoryId = category.id;
        $scope.showPaging = false;
        fileService.GetFilesCategoryID(category.id, $scope.pageSize, currentPage).then(function (response) {
            $scope.files = response;
            $scope.showPaging = true;
            $scope.isLoading = false;
            $scope.noDataToshow = response ? (response.length == 0) : true;

        }, function (err) {
        });

        angular.forEach($scope.Catagories, function (item) {
            var videoLocal = document.getElementById(item.id);
            if (category.id === item.id) {
                videoLocal.classList.add("title-stats-gallery-active");
            }
            else {
                videoLocal.classList.remove("title-stats-gallery-active");
            }
        });

    };

    $scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

        (new PNotify({
            title: tittle,
            text: content,
            icon: 'glyphicon glyphicon-question-sign',
            hide: false,
            confirm: {
                confirm: true
            },
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            }
        })).get().on('pnotify.confirm', function () {
            OkCallback("confirm");
        }).on('pnotify.cancel', function () {

        });

    };

    $scope.showAlert = function (tittle, label, button, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'success',
            styling: 'bootstrap3'
        });
    };

    $scope.showAlert = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'info',
            styling: 'bootstrap3'
        });
    };

    $scope.showError = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'error',
            styling: 'bootstrap3'
        });
    };
    $scope.deleteFile = function (file) {
        if(file&&file.FileCategory&&file.FileCategory.Category === "CONVERSATION"){
            $scope.showError("File Delete","Not Allowed To Delete Conversation Files");
            return;
        }

        $scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " + file.Filename, function (obj) {

            fileService.DeleteFile(file).then(function (response) {
                if (response) {

                    $scope.loadFileList($scope.pageSize, 1);
                    $scope.showAlert("Deleted", "Deleted", "ok", "File " + file.Filename + " Deleted successfully");
                }
                else
                    $scope.showError("Error", "Error", "ok", "There is an error ");
            }, function (error) {
                $scope.showError("Error", "Error occurred while deleting file ");
            });

        }, function () {

        }, file)
    };

    $scope.deleteMultipleFiles = function () {

        $scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete Selected[" + $scope.fileToDelete.length + "] Files.", function () {

            var delCount = 0;
            angular.forEach($scope.fileToDelete, function (file) {

                if(file&&file.FileCategory&&file.FileCategory.Category === "CONVERSATION"){
                    $scope.showError("File Delete","Not Allowed To Delete Conversation Files");
                }
                else{
                    fileService.DeleteFile(file).then(function (response) {
                        delCount++;
                        if ($scope.fileToDelete.length === delCount) {
                            $scope.reloadPage();
                            $scope.showAlert("Deleted", "Deleted", "ok", "Delete Process Complete.");
                        }
                    }, function (error) {
                        delCount++;
                        if ($scope.fileToDelete.length === delCount) {
                            $scope.reloadPage();
                            $scope.showAlert("Deleted", "Deleted", "ok", "Delete Process Complete.");
                        }
                    });
                }

            });


        }, function () {

        }, undefined)
    };

    $scope.downloadFile = function (file) {
        if(!$scope.allowed_file_downLoad){
            console.log("feature is disabled----------------------");
            $scope.showError("File Gallery", "feature is disabled.");
            return;
        }
        fileService.downloadInternalFile(file);
    };

    $scope.GetToken = function () {
        fileService.Headers = {'Authorization': fileService.GetToken};
    };
    $scope.GetToken();

    $scope.tenant = 0;
    $scope.company = 0;
    $scope.getCompanyTenant = function () {
        var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
        console.info(decodeData);
        $scope.company = decodeData.company;
        $scope.tenant = decodeData.tenant;
    };
    $scope.getCompanyTenant();


    /* Video Modal*/
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.playVideo = function (file) {

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'file_gallery/view/myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                file: function () {
                    return file;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    /* Video Modal*/

    $scope.showDeleteSelection = false;
    $scope.showDelete = function () {
        $scope.showDeleteSelection = !$scope.showDeleteSelection;
    };

    $scope.fileToDelete = [];
    $scope.addToDelete = function (file) {
        if (file.delete) {
            $scope.fileToDelete.push(file);
        }
        else {
            var index = $scope.fileToDelete.indexOf(file);
            if (index > 0)
                $scope.fileToDelete.splice(index, 1);
        }
    };


    // search
    $scope.StartTime = {
        date: new Date()
    };
    $scope.EndTime = {
        date: new Date()
    };
    $scope.openCalendar = function (name) {
        if (name == 'StartTime') {
            $scope.StartTime.open = true;
        }
        else {
            $scope.EndTime.open = true;
        }

    };
    $scope.fileSerach = {};
    $scope.fileSerach.StartTime = new Date();
    $scope.fileSerach.EndTime = new Date();

    $scope.searchCatObj={
        categoryList:[]
    };

    $scope.searchFiles = false;
    $scope.SearchFiles = function () {
        $scope.searchFiles = true;
        $scope.currentPage = "1";
        $scope.files = [];
        $scope.searchCatObj={
            categoryList:[]
        };
        $scope.noDataToshow = false;
        if ($scope.categoryId <= 0) {
            $scope.categoryId = -1;
            $scope.searchCatObj=categoryObj;

        }
        else
        {
            var catName= $scope.Catagories.filter(function (item) {

                return item.id==$scope.categoryId;
            });

            if(catName.length>0 && catName[0].Category)
            {
                $scope.searchCatObj.categoryList.push(catName[0].Category);
            }
        }

        if ($scope.fileSerach.StartTime >= $scope.fileSerach.EndTime) {
            $scope.showError("File Search","End Time Should Be Greater Than Start Time.");
            return
        }


        var promiseSet = [];
        promiseSet.push(fileService.GetFileCountByCategory($scope.searchCatObj,$scope.fileSerach.StartTime, $scope.fileSerach.EndTime));
        promiseSet.push(fileService.searchFilesWithCategories( $scope.fileSerach.StartTime, $scope.fileSerach.EndTime,$scope.searchCatObj,50,1));

        $q.all(promiseSet).then(function (data) {

            $scope.pageTotal = data[0];
            $scope.files = data[1];
            $scope.noDataToshow = $scope.files ? ($scope.files.length == 0) : true;
            $scope.isLoading = false;
            $scope.showPaging = true;
        }).catch(function (e) {
            $scope.showAlert("File Search", 'error', "Fail To Load File Details.");
            $scope.isLoading = false;
        });


        /*fileService.searchFilesWithCategories( $scope.fileSerach.StartTime, $scope.fileSerach.EndTime,searchCatObj).then(function (response) {
            $scope.files = response;
            $scope.noDataToshow = response ? (response.length == 0) : true;
            $scope.isLoading = false;
            $scope.showPaging = true;
            //$scope.pageSize = "50";
        }, function (err) {
            $scope.isLoading = false;
        });*/
    };


});



app.controller('SidebarController', function ($scope, sidebar) {
        $scope.sidebar = sidebar;
    }
);

app.controller('VideoController', function ($sce, $scope) {
        $scope.playVideo = function (file) {
            $scope.sources = [
                {
                    src: $sce.trustAsResourceUrl("http://0.s3.envato.com/h264-video-previews/80fad324-9db4-11e3-bf3d-0050569255a8/490527.mp4"),
                    type: "video/mp4"
                }
            ];
        };

        this.config = {
            preload: "none",
            sources: [
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                    type: "video/mp4"
                }
            ]
        };
    }
);

app.directive('onErrorSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.onErrorSrc) {
                    attrs.$set('src', attrs.onErrorSrc);
                }
            });
        }
    }
});


app.controller('ModalInstanceCtrl', function ($scope, $http, $sce, $uibModalInstance, baseUrls, file,$auth,authService) {

    $scope.selectedFile = file;

    $scope.ok = function () {
        $uibModalInstance.close($scope.selectedFile.Filename);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    var urlTemp = baseUrls.fileServiceUrl + "File/Download/"+ file.UniqueId + "/" + file.Filename;
    var urlTempWithAuth = baseUrls.fileServiceUrl + "File/Download/"+ file.UniqueId + "/" + file.Filename+"?Authorization="+authService.TokenWithoutBearer();

    if(file.ObjCategory === 'CONVERSATION')
    {
        $http({
            method: 'GET',
            url: urlTemp,
            responseType: 'blob'
        }).then(function successCallback(response)
        {
            if(response.data)
            {
                var url = URL.createObjectURL(response.data);
                $scope.config = {
                    preload: "auto",
                    sources: [
                        {
                            src: $sce.trustAsResourceUrl(url),
                            type: file.FileStructure
                        }
                    ],
                    tracks: [
                        {
                            src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                            kind: "subtitles",
                            srclang: "en",
                            label: "English",
                            default: ""
                        }
                    ],
                    theme: {
                        url: "bower_components/videogular-themes-default/videogular.css"
                    },
                    "analytics": {
                        "category": "Videogular",
                        "label": "Main",
                        "events": {
                            "ready": true,
                            "play": true,
                            "pause": true,
                            "stop": true,
                            "complete": true,
                            "progress": 10
                        }
                    }
                };
            }
        }, function errorCallback(response) {

            $scope.showAlert('CDR Player', 'error', 'Error occurred while playing file');

        });

    }
    else
    {
        $scope.config = {
            preload: "auto",
            sources: [
                {
                    src: $sce.trustAsResourceUrl(urlTempWithAuth),
                    type: file.FileStructure
                }
            ],
            tracks: [
                {
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }
            ],
            theme: {
                url: "bower_components/videogular-themes-default/videogular.css"
            },
            "analytics": {
                "category": "Videogular",
                "label": "Main",
                "events": {
                    "ready": true,
                    "play": true,
                    "pause": true,
                    "stop": true,
                    "complete": true,
                    "progress": 10
                }
            }
        };
    }





});

