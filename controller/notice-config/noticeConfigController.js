/**
 * Created by Pawan on 3/22/2017.
 */
mainApp.controller("noticeConfigController", function ($scope, $state, noticeBackendService, loginService,$anchorScroll,notifiSenderService,FileUploader,fileService,attachmentBackendService,$q) {


    $anchorScroll();
    $scope.NoticeList = [];
    $scope.searchCriteria = "";
    $scope.userList = [];
    $scope.userObjects=[];
    $scope.groupObjects=[];
    $scope.Rsvrtype="Users";
    $scope.collectionTitle="Add Users here";
    $scope.isSaveEnabled=true;
    $scope.toUser=[];
    $scope.toGroup=[];
    $scope.file = {};
    $scope.file.Category = "NOTICE_ATTACHMENTS";

    var uploader = $scope.uploader = new FileUploader({
        url: fileService.UploadUrl,
        headers: fileService.Headers
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });


    $scope.uploadingItemIndex=0;
    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
        $scope.uploadingItemIndex=uploader.getIndexOfItem(fileItem);
        //uploader.clearQueue();
       // uploader.addToQueue(fileItem);



    };
    uploader.onAfterAddingAll = function (addedFileItems) {

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
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        if (response.IsSuccess) {


            var attchmentData =
            {
                file: fileItem._file.name,
                //url: baseUrls.fileService + "InternalFileService/File/Download/" + scope.userCompanyData.tenant + "/" + scope.userCompanyData.company + "/" + response.Result + "/SampleAttachment",
                url: response.Result,
                type: fileItem._file.type,
                size: fileItem._file.size
            }


            if(!attchmentData.type)
            {
                attchmentData.type='application/text';
            }
            attachmentBackendService.saveNewAttachment(attchmentData).then(function (response) {

                if(response.IsSuccess && response.Result)
                {
                    $scope.newNotice.attachments=[];
                    /*var attachmentObj = {
                        id:response.Result._id/!*,
                        file_type:response.Result.type*!/
                    }*/
                    $scope.newNotice.attachments.push(response.Result._id);
                    //$scope.showAlert("Notice","Attachment saved successfully","success");
                    console.log("Notice attchment uploaded");
                    $scope.noticeHandler();


                }
                else
                {
                    $scope.showAlert("Notice","Attachment saving failed","error");
                    $scope.noticeHandler();
                }


            }, function (error) {
                $scope.showAlert("Notice","Attachment saving failed","error");
                $scope.noticeHandler();
            })
        }

    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');


    };




    $scope.showAlert = function (tittle, content, type) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.removeDeleted = function (item) {

        var index = $scope.NoticeList.indexOf(item);
        if (index != -1) {
            $scope.NoticeList.splice(index, 1);
        }

    };
    $scope.reloadPage = function () {
        $scope.GetSavedNotices();
    };

    $scope.GetSavedNotices = function () {
        noticeBackendService.getNotices().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Notices " + response.data.Exception);
            }
            else {
                $scope.NoticeList = response.data.Result;
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Notices " + error);
        })
    };

    $scope.cancleEdit = function () {
        $scope.addNew = false;
    };


    $scope.GetSavedNotices();
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(user) {
            if(user.username)
            {
                return (user.username.toLowerCase().indexOf(lowercaseQuery) != -1);
            }
            else
            {
                return (user.username.toLowerCase().indexOf(lowercaseQuery) != -1);
            }


        };
    }

    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.userList) {
                return $scope.userList;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.userList.filter(createFilterFor(query)) : [];
            return results;
        }

    };


    $scope.onChipAdd = function (chip) {

        if($scope.Rsvrtype=="Users" && $scope.toUser.indexOf(chip)==-1)
        {
            $scope.toUser.push(chip.username);
        }
        else
        {
            if($scope.toGroup.indexOf(chip)==-1)
            {
                $scope.toGroup.push(chip.username);
            }

        }


    };
    $scope.onChipDelete = function (chip) {
        var index=-1;
        if($scope.Rsvrtype=="Users")
        {
            index = $scope.toUser.indexOf(chip.username);
            console.log("index ", index);
            if (index > -1) {
                $scope.toUser.splice(index, 1);
                console.log("rem user " + $scope.toUser);
            }
        }
        else
        {
            index = $scope.toGroup.indexOf(chip.username);
            console.log("index ", index);
            if (index > -1) {
                $scope.toGroup.splice(index, 1);
                console.log("rem Group " + $scope.toGroup);
            }
        }





    };


    $scope.loadUserGroups = function () {

        notifiSenderService.getUserGroupList().then(function (response) {
            if(response.data.IsSuccess)
            {
                $scope.groupObjects=response.data.Result;
            }

        }, function (error) {
            console.log("Getting usergroups failed");
        })
    };

    $scope.attributeGroup;
    $scope.loadUsers = function () {


        $scope.userList = [];
        $scope.userObjects=[];

        notifiSenderService.getUserCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(notifiSenderService.LoadUsersByPage(pagesize, i));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {
                    resolveData.map(function (data) {
                        data.map(function (item) {
                            item.status = 'offline';
                            item.callstatus = 'offline';
                            item.callstatusstyle = 'call-status-offline';
                            $scope.userObjects.push(item);

                        });
                    });

                }

                $scope.userList=$scope.userObjects;

            }).catch(function (err) {
                console.error(err);
                $scope.showAlert("Load Users", "error", "Fail To Get User List.");
            });



        }, function (err) {

            $scope.showAlert("Load Users", "error", "Fail To Get User List.")
        });



        /*notifiSenderService.getUserList().then(function (response) {
            if(response)
            {
                $scope.userObjects=response;
                $scope.userList=$scope.userObjects;
            }

        }, function (error) {
            console.log("Getting user groups failed");
        })*/
    };

    $scope.loadUserGroups();
    $scope.loadUsers();

    $scope.setUserList = function () {

        $scope.toUser=[];
        $scope.toGroup=[];

        if($scope.Rsvrtype=="Users")
        {
            $scope.userList=$scope.userObjects;
            $scope.attributeGroup=null;
            $scope.collectionTitle="Add Users here";
        }
        else
        {
            $scope.userList=[];
            $scope.userList=$scope.groupObjects.map(function (group) {
                group.username=group.name;
                return group;
            });
            $scope.attributeGroup=null;
            $scope.collectionTitle="Add Groups here";
        }
    }

    $scope.noticeHandler = function () {
        noticeBackendService.sendNotice($scope.newNotice).then(function (response) {
            console.log("Notice sent");
            $scope.newNotice={};
            $scope.Rsvrtype="Users";
            /*$scope.newNotice.toUser=null;
            $scope.newNotice.toGroup=null;*/
            $scope.toUser=[];
            $scope.toGroup=[];
            $scope.attributeGroup=null;
            $scope.isSaveEnabled=true;



            $scope.GetSavedNotices();
            uploader.clearQueue();


            $scope.showAlert("Notice","Notice sent","success");


        }, function (error) {
            console.log("Send failed");
            $scope.isSaveEnabled=true;
            $scope.showAlert("Notice","Notice sending failed","error");
        });
    }

    $scope.sendNoticeData = function () {



        $scope.isSaveEnabled=false;

        if($scope.Rsvrtype=="Users" )
        {
            $scope.newNotice.toUser=$scope.toUser;
            $scope.newNotice.toGroup=[];
        }
        else
        {
            $scope.newNotice.toGroup=$scope.toGroup;
            $scope.newNotice.toUser=[];
        }

        if(uploader.getNotUploadedItems().length>0)
        {
            uploader.uploadItem($scope.uploadingItemIndex);
        }
        else
        {
            $scope.noticeHandler();
        }



    }



});

