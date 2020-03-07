/**
 * Created by dinusha on 6/12/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var cronScheduleCtrl = function ($scope, $location, $http, $anchorScroll, scheduleWorkerService, cdrApiHandler,
                                     userProfileApiAccess, loginService,$anchorScroll) {

        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.cronConfig = {
            allowMultiple: true,
            options: {
                allowMinute : true,
                allowHour : true,
                allowDay : true,
                allowWeek : true,
                allowMonth : true,
                allowYear : true
            }
        };
        $scope.cronList = [];

        $scope.newDropDownState = false;

        $scope.pressNewButton = function () {
            if (!$scope.newDropDownState) {
                $scope.newDropDownState = true;
            }
        };

        $scope.pressCancelButton = function () {
            $scope.newDropDownState = false;
        };

        var loadCrons = function()
        {
            $scope.cronList = [];
            scheduleWorkerService.getCrons().then(function (data)
            {
                if (data.IsSuccess)
                {
                    $scope.cronList = data.Result;
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
                var errMsg = "Error occurred while loading schedules";
                if (err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        loadCrons();

        var emptyArr = [];

        $scope.tzData = {
            timeZones : []
        };

        $scope.tz = {
            timezone: ''
        };

        var loadTimeZones = function()
        {
            cdrApiHandler.getTimeZones().then(function(data)
            {
                $scope.tzData.timeZones = data.Result;

            }).catch(function(ex)
            {
                $scope.tzData.timeZones = [];
            });
        };

        loadTimeZones();


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

        $scope.addNewCron = function()
        {
            scheduleWorkerService.addNewCronSchedule($scope.currentCron).then(function (data)
            {
                if (data.IsSuccess)
                {
                    $scope.showAlert('Success', 'success', 'Schedule added successfully');
                    $scope.currentCron = {};
                    $scope.currentCron.CronePattern = '* * * * *';
                    loadCrons();
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
                var errMsg = "Error occurred while saving schedule";
                if (err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.updateCron = function(updateCronInfo)
        {
            scheduleWorkerService.updateCronSchedule(updateCronInfo.UniqueId, updateCronInfo).then(function (data)
            {
                if (data.IsSuccess)
                {
                    $scope.showAlert('Success', 'success', 'Schedule updated successfully');
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
                var errMsg = "Error occurred while updating schedule";
                if (err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.removeCron = function(cron)
        {

            new PNotify({
                title: 'Confirm deletion',
                text: 'Are you sure you want to delete schedule ?',
                type: 'warn',
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
            }).get().on('pnotify.confirm', function () {
                    scheduleWorkerService.removeCron(cron.UniqueId).then(function (data)
                    {
                        if (data.IsSuccess)
                        {
                            $scope.showAlert('Success', 'success', 'Schedule removed successfully');
                            loadCrons();
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
                        var errMsg = "Error occurred while removing schedule";
                        if (err.statusText)
                        {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });
                }).on('pnotify.cancel', function () {

                });

        };

        $scope.cronEditMode = function(cron)
        {
            cron.OpenStatus = !cron.OpenStatus;
        };



    };


    app.controller("cronScheduleCtrl", cronScheduleCtrl);
}());
