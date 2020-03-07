/**
 * Created by dinusha on 6/12/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var emailReportCtrl = function ($scope, $location, $anchorScroll, cdrApiHandler, userProfileApiAccess,
                                    templateMakerBackendService, loginService, $anchorScroll,$q) {

        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.reportType = {
            reportType: ''
        };

        $scope.selectedTemplate = {
            selectedTemplate: ''
        };

        $scope.userList = [];
        $scope.templateList = [];

        var loadTemplates = function()
        {
            templateMakerBackendService.pickTemplates().then(function (response)
            {
                var data = response.data;
                if(data)
                {
                    if (data.IsSuccess)
                    {
                        var filterTemplates = _.filter(data.Result, function(templ){
                            return (templ.name != undefined && templ.name != null);
                        });
                        $scope.templateList = filterTemplates;
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        $scope.showAlert('Error', 'error', errMsg);

                    }
                }


            }, function (err)
            {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading templates";
                if (err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var loadUserList = function ()
        {
            $scope.userList=[];
            userProfileApiAccess.getUserCount().then(function (row_count) {
                var pagesize = 20;
                var pagecount = Math.ceil(row_count / pagesize);

                var method_list = [];

                for (var i = 1; i <= pagecount; i++) {
                    method_list.push(userProfileApiAccess.LoadUsersByPage(null,pagesize, i));
                }


                $q.all(method_list).then(function (resolveData) {
                    if (resolveData) {
                        resolveData.map(function (data) {
                            var Result= data.Result;
                            Result.map(function (item) {

                                $scope.userList.push(item);
                            });
                        });

                    }



                }).catch(function (err) {
                    console.error(err);

                    $scope.showAlert("Load Users", "error", "Fail To Get User List.");
                    loginService.isCheckResponse(err);
                });



            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert("Load Users", "error", "Fail To Get User List.")
            });









            /*userProfileApiAccess.getUsers().then(function (data)
            {
                if (data.IsSuccess)
                {
                    $scope.userList = data.Result;
                }
                else
                {
                    var errMsg = data.CustomMessage;

                    if (data.Exception)
                    {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err)
            {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading users";
                if (err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });*/
        };

        loadUserList();
        loadTemplates();

        var emptyArr = [];


        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.userList) {
                    return $scope.userList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.userList) {
                    var filteredArr = $scope.userList.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.username) {
                            return item.username.match(regEx);
                        }
                        else {
                            return false;
                        }

                    });

                    return filteredArr;
                }
                else {
                    return emptyArr;
                }
            }

        };

        $scope.saveRecipients = function()
        {
            var arrMap = $scope.reportUsers.map(function(item)
            {
                return item._id;
            });

            cdrApiHandler.saveRecipients($scope.reportType.reportType, $scope.selectedTemplate.selectedTemplate, arrMap).then(function (data)
            {
                if (data.IsSuccess && data.Result && data.Result.users)
                {
                    $scope.showAlert('Success', 'success', 'recipients added successfully');
                }
                else
                {
                    var errMsg = data.CustomMessage;

                    if (data.Exception)
                    {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err)
            {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading recipients";
                if (err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadRecipients = function()
        {
            $scope.reportUsers = [];

            cdrApiHandler.getEmailRecipientsForReport($scope.reportType.reportType).then(function (data)
            {
                if (data.IsSuccess && data.Result && data.Result.users)
                {
                    $scope.selectedTemplate.selectedTemplate = data.Result.template;
                    $scope.reportUsers = data.Result.users;
                }
                else
                {
                    if(!data.IsSuccess)
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    }


                }

            }, function (err)
            {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading recipients";
                if (err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        }

    };


    app.controller("emailReportCtrl", emailReportCtrl);
}());
