/**
 * Created by Rajinda on 6/29/2016.
 */

mainApp.controller("conferenceController", function ($scope, $rootScope, $compile, $uibModal, $filter, $location, $log, $anchorScroll, $timeout, conferenceService,$q) {


    $anchorScroll();
    $scope.isLoading = true;
    $scope.isProgress = false;
    $scope.isMonitorApp = false;
    $scope.conference = {};
    $scope.searchCriteria = "";

    $scope.showError = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'error',
            styling: 'bootstrap3'
        });
    };

    $scope.switchApps = function (appName) {
        $scope.isLoading = true;
        if (appName === "monitor") {
            $scope.isMonitorApp = true;
            $scope.loadActiveConferences();
            $scope.showPaging = false;
        }
        else {
            $scope.isMonitorApp = false;
            $scope.reloadPage();
            $scope.showPaging = true;
        }
    };

    $scope.reloadPage = function () {
        $scope.isMonitorApp = false;
        $scope.isLoading = true;
        $scope.addNewConference = false;
        $scope.loadConferences();
        $scope.LoadExtentions();
        $scope.LoadEnduserList();
        $scope.GetRoomsCount();
        $scope.LoadSipUsers();
    };

    $scope.addNewConference = false;
    $scope.showNewConference = function () {
        $scope.addNewConference = !$scope.addNewConference;
    };

    $scope.addNewExt = false;
    $scope.showNewExt = function () {
        $scope.addNewExt = !$scope.addNewExt;
    };

    $scope.ext = {};
    $scope.StartTime = {
        date: new Date()
    };
    $scope.EndTime = {
        date: new Date()
    };
    $scope.conference.StartTime = $scope.StartTime.date;
    $scope.conference.EndTime = $scope.EndTime.date;

    $scope.openCalendar = function (name) {
        if (name == 'StartTime') {
            $scope.StartTime.open = true;
        }
        else {
            $scope.EndTime.open = true;
        }

    };

    $scope.addNewExtension = function (dta) {

        dta.ObjCategory = "CONFERENCE";
        conferenceService.CreateExtensions(dta).then(function (response) {

            if (response.data && response.data.IsSuccess) {
                if (response.data.IsSuccess) {
                    $scope.LoadExtentions();
                    $scope.addNewExt = false;
                    $scope.ext = {};
                }
                else {
                    $scope.showAlert('Error', 'error', "dfsdfsd");
                }
            } else {
                $scope.showAlert('Error', 'error', response.data.Exception.Message);
            }

        }, function (err) {
            var errMsg = "Error occurred while Add New Extension";
            $scope.showAlert('Error', 'error', errMsg);

        });
    };

    $scope.showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.endUserList = [];
    $scope.LoadEnduserList = function () {
        conferenceService.getDomains().then(function (data) {
            if (data.IsSuccess) {
                $scope.endUserList = data.Result;
                if ($scope.endUserList) {
                    if ($scope.endUserList.length > 0) {
                        $scope.conference.CloudEndUserId = $scope.endUserList[0].CloudEndUserId;
                    }
                }
            }
            else {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = 'Get enduser Error : ' + data.Exception.Message;
                }
                $scope.showAlert('Error', 'error', errMsg);
            }

        }, function (err) {
            var errMsg = "Error occurred while getting end user list";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);
        });
    };
    $scope.LoadEnduserList();

    $scope.LoadExtentions = function () {
        conferenceService.GetExtensions().then(function (response) {
            $scope.extensions = response;
            if ($scope.extensions) {
                if ($scope.extensions.length > 0) {
                    $scope.conference.Extension = $scope.extensions[0].Extension;
                }
            }
        }, function (error) {
            $scope.showAlert('Error', 'error', "Fail To Get Extentions.");
        });
    };
    $scope.LoadExtentions();

    $scope.GetConferenceTemplate = function () {
        conferenceService.GetConferenceTemplate().then(function (response) {
            $scope.Templates = response;
        }, function (error) {
            $scope.showAlert('Error', 'error', "Fail To Get Conference Template");
        });
    };
    $scope.GetConferenceTemplate();


    $scope.previewTemplate = function (template) {
        if (!$scope.conference.MaxUser)
            $scope.conference.MaxUser = 0;

        if (template.MaxUsers < $scope.conference.MaxUser) {
            $scope.showAlert('Error', 'error', "Template Only Support " + template.MaxUsers + " Users. Please Change User Count or Select Different Template.");
            return;
        }

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'conference_app/views/conTemplateModal.html',
            controller: 'confModalInstanceCtrl',
            size: 'sm',
            resolve: {
                template: function () {
                    return template;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.userForm = {};
    $scope.createConference = function (conference) {

        if (!$scope.conference.MaxUser)
            $scope.conference.MaxUser = 0;

        if (conference.Template.MaxUsers < $scope.conference.MaxUser) {
            $scope.showAlert('Error', 'error', "Template Only Support " + conference.Template.MaxUsers + " Users. Please Change User Count or Select Different Template.");
            return;
        }

        if (conference.StartTime <= new Date()) {
            $scope.showAlert("New Conference", "notify", "Start Time Should Be Greater Than To Current Date Time.");
            return;
        }

        if (conference.StartTime >= conference.EndTime) {
            $scope.showAlert('New Conference', 'error', "End Time Should Be Greater Than Start Time.");
            return;
        }
        $scope.isProgress = true;
        conference.ActiveTemplate = conference.Template.TemplateName;
        conferenceService.CreateConference(conference).then(function (response) {
            $scope.isProgress = false;

            if (response && response.IsSuccess) {
                $scope.searchCriteria = "";
                $scope.addNewConference = false;
                $scope.showAlert("Conference Created", "success", "Conference " + response.ConferenceName + " Created Successfully.");
                $scope.reloadPage();

                $scope.conference = {};
                $scope.userForm.$setPristine();//userForm.ConferenceName
                $scope.userForm.$setUntouched();
            } else {
                var msg = "Fail To Create Conference."
                if (response.Exception) {
                    msg = msg + response.Exception.Message;
                }
                $scope.showAlert("Error", "error", msg);
            }
        }, function (error) {
            $scope.showAlert("Error", "error", "There is an error createConference");
            $scope.isProgress = false;
        });
    };

    $scope.sipUsers = [];
    $scope.LoadSipUsers = function () {

        $scope.sipUsers = [];

        conferenceService.getSipUsersCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(conferenceService.getSipUsersWithPaging(i,pagesize));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {
                    resolveData.map(function (response) {

                        response.map(function (item) {

                            $scope.sipUsers.push(item);

                        });


                    });

                }


            }).catch(function (err) {
                $log.debug("GetUserByBusinessUnit err");
                $scope.showError("Error", "Error in loading users");
            });



        }, function (err) {
            $log.debug("Get Sip user count  err");
            $scope.showError("Error", "Error in loading sip users");
        });


        /*conferenceService.GetSipUsers().then(function (response) {
            scope.sipUsers = response;
            angular.copy(scope.sipUsers, scope.sipUserDetailsToMapWithExsiting);
            scope.removeExistingUsers();
        }, function (error) {
            scope.showAlert("Error", "error", "Fail To Get User List.");
        });*/
    };

    $scope.LoadSipUsers();
    $scope.showPaging = true;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = "50";

    $scope.loadConferences = function () {
        conferenceService.GetConferences($scope.pageSize, 1).then(function (response) {
            $scope.isLoading = false;
            $scope.conferences = response;
        }, function (error) {
            $scope.isLoading = false;
            $scope.showAlert("Error", "error", "Fail To Get Conference List.");
        });

    };
    $scope.loadConferences();

    $scope.getPageData = function (Paging, page, pageSize, total) {
        $scope.isLoading = true;
        conferenceService.GetConferences(pageSize, page).then(function (response) {
            $scope.isLoading = false;
            $scope.conferences = response;
        }, function (err) {
            $scope.showAlert("Error", "Error", "There is an error createConference");
            $scope.isLoading = false;
        });
    };


    $scope.GetRoomsCount = function () {
        conferenceService.GetRoomsCount().then(function (response) {
            $scope.pageTotal = response;
        }, function (error) {

        });
    };
    $scope.GetRoomsCount();


    /*Conference Monitor*/

    $scope.activeConferenceList = [];
    $scope.loadActiveConferences = function () {
        conferenceService.GetActiveConference().then(function (response) {
            $scope.isLoading = false;
            $scope.activeConferenceList = response;
        }, function (error) {
            $scope.isLoading = false;
            $scope.showAlert("Error", "error", "Fail To Get Active Conference List.");
        });
    };


    var getAllRealTime = function () {
        if ($scope.isMonitorApp) {
            try {
                $rootScope.$broadcast('getActiveConfUserCount', {});
            }
            catch (ex) {
            }
        }
        getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);
    };

    // getAllRealTime();
    var getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);

    $scope.$on("$destroy", function () {
        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }
    });

    $scope.refreshTime = 10000;
    /*Conference Monitor*/


});

app.controller('confModalInstanceCtrl', function ($scope, $sce, $uibModalInstance, baseUrls, template) {

    $scope.TemplateUrl = "assets/images/conference_template/" + template.TemplateName.trim() + ".png";
    $scope.TemplateName = template.TemplateName.trim();
    $scope.TemplateDecryption = template.Description.trim();
    $scope.ok = function () {
        $uibModalInstance.close($scope.TemplateUrl);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});


