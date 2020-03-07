var app = angular.module("veeryConsoleApp");

app.controller("zohoUsersController", function ($scope, $location, $log, $filter, $http, $state, $uibModal, $anchorScroll, zohoService, jwtHelper, authService, baseUrls) {

    $anchorScroll();

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
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
            CancelCallBack();
        });

    };

    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = 100;
    $scope.userList = [];
    $scope.getPageData = function (Paging, page, pageSize, total) {
        $scope.isLoading = true;
        $scope.currentPage = page;
        zohoService.GetUsers(page, pageSize).then(function (response) {
            $scope.userList = response;
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Zoho User", 'error', "Fail To Load Attempt Report.");
            $scope.isLoading = false;
        });
    };


    $scope.isImage = function (source) {
        Utils.isImage(source).then(function (result) {
            $log.debug("isImage" + result);
            return result;
        });
    };

    $scope.isImageExtension = function (ext) {
        console.log(ext);
        if (ext) {
            return ext.split("/")[0] == "image";
        }
        else {
            return false;
        }

    };

    $scope.reloadPage = function () {
        $scope.isLoading = true;
        zohoService.ImportZohoUsers().then(function (response) {
            $scope.getPageData("Paging", $scope.currentPage, $scope.pageSize, $scope.pageTotal);
        }, function (error) {
            $scope.getPageData("Paging", $scope.currentPage, $scope.pageSize, $scope.pageTotal);
        });
    };
    $scope.reloadPage();

    $scope.addUser = function (user) {
        $scope.isLoading = true;
        zohoService.EnableZohoUserCallControl(user).then(function (response) {
            if(response){
                user.integrated = true;
                $scope.showAlert("Zoho User","success", "Call Control Functionalities Successfully Added.");
            }else {
                $scope.showAlert("Zoho User", 'error', "Fail To Add Call Control Functionalities.");
            }
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Zoho User", 'error', "Fail To Add Call Control Functionalities.");
            $scope.isLoading = false;
        });
    };

    $scope.removeUser = function (user) {
        $scope.isLoading = true;
        zohoService.DisableZohoUserCallControl(user).then(function (response) {
            if(response){
                user.integrated = false;
                $scope.showAlert("Zoho User","success", "Call Control Functionalities Have Been Disabled.");
            }else {
                $scope.showAlert("Zoho User", 'error', "Fail To Disable Call Control Functionalities.");
            }
            $scope.isLoading = false;
        }, function (error) {
            $scope.showAlert("Zoho User", 'error', "Fail To Disable Call Control Functionalities.");
            $scope.isLoading = false;
        });
    };

    $scope.addAll = function () {

        $scope.isLoading = true;
        $scope.showConfirm("Activate Users", "Activate", "ok", "cancel", "Do You Want To Activate Call Control Functionalities To All Users", function (obj) {
            var items = $filter('filter')($scope.userList, {integrated: false}, true);
            if (angular.isArray(items)) {
                var userids = items.map(function (item) {
                    return item._id;
                });
                zohoService.EnableZohoUsersCallControl(userids).then(function (response) {
                    if(response){
                        $scope.reloadPage();
                        $scope.showAlert("Zoho User","success", "Call Control Functionalities Successfully Added.");
                    }else {
                        $scope.showAlert("Zoho User", 'error', "Fail To Add Call Control Functionalities.");
                        $scope.isLoading = false;
                    }

                }, function (error) {
                    $scope.showAlert("Zoho User", 'error', "Fail To Add Call Control Functionalities.");
                    $scope.isLoading = false;
                });
            }

        }, function () {
            $scope.safeApply(function () {
                $scope.isLoading = false;
            });
        }, undefined)





    };
});



