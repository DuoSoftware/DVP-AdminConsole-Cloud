mainApp.controller('emailConnectorController', function FormBuilderCtrl($scope, $window,tagBackendService, socialConnectorService,$anchorScroll)
{
    $anchorScroll();
    $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};
    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.emailConfig = {
        ticket_priority:"",
        ticket_type:"",
        ticket_tags:[],
        name:"",
        domain: "",
        replytoOverwrite : "",
        create_engagement : false
    };
    $scope.ticket_tags=[];
    $scope.tagList=[];
    $scope.availableTags=[];
    $scope.availableTicketTypes=['question','complain','incident','action'];
    $scope.prioritys=['low','normal','high','urgent'];

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

    $scope.saveEmailConfiguration = function (emailConfig) {
        emailConfig.ticket_tags = $scope.ticket_tags.map(function (item) {
            return item.name;
        });

        socialConnectorService.CreateMailAccount(emailConfig).then(function (response) {
            if(response){
                $scope.showAlert("Email","success", "Save Configurations.");
                $scope.GetEmailAccounts();
            }
            else {
                $scope.showAlert("Email","error", "Fail To Save Configurations.");
            }
        }, function (err) {
            $scope.showAlert("Email","error", "Fail To Save Configurations.");
        });
    };

    $scope.emailAccounts = [];
    $scope.GetEmailAccounts = function () {
        socialConnectorService.GetEmailAccounts().then(function (response) {
            $scope.emailAccounts = response;
        }, function (err) {
            $scope.showAlert("Email","error", "Fail To Get Email List.");
        });
    };
    $scope.GetEmailAccounts();

    $scope.loadTags = function () {
        tagBackendService.getAllTags().then(function (response) {
            $scope.tagList = response.data.Result;
            $scope.availableTags = $scope.availableTags.concat($scope.tagList);
        }, function (err) {
            $scope.showAlert("Email","error", "Fail To Get Tag List.");
        });
    };
    $scope.loadTags();

    $scope.deactivateMail = function (mail) {


        console.log(mail);
        if (mail.active) {

            if (!$scope.disableSwitch) {

                $scope.safeApply(function () {
                    $scope.disableSwitch = true;
                });

                console.log("activate");

                new PNotify({
                    title: 'Confirm Reactivation',
                    text: 'Are You Sure You Want To Reactivate The Mail Configuration?',
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
                    var mailObj = {'status': true};
                    socialConnectorService.ChangeMailConfigStatus(mail._id, mailObj).then(function (data) {
                        if (data) {
                            $scope.showAlert('Success', 'info', 'Mail Configuration Reactivated');
                            $scope.safeApply(function () {
                                $scope.disableSwitch = false;
                            });
                        }
                        else {
                            $scope.safeApply(function () {
                                mail.active = false;
                                $scope.disableSwitch = false;
                            });

                            $scope.showAlert('Error', 'error', 'Error occurred while reactivating mail configuration');
                        }

                    }, function (err) {
                        $scope.safeApply(function () {
                            mail.active = false;
                            $scope.disableSwitch = false;
                        });
                        $scope.showAlert('Error', 'error', "Error occurred while reactivating mail configuration");
                    });
                }).on('pnotify.cancel', function () {
                    $scope.safeApply(function () {
                        mail.active = false;
                        $scope.disableSwitch = false;
                    });
                });
            }

        } else {
            console.log("deactivate");
            if (!$scope.disableSwitch) {

                $scope.safeApply(function () {
                    $scope.disableSwitch = true;
                });
                new PNotify({
                    title: 'Confirm Deletion',
                    text: 'Are You Sure You Want To Deactivate Mail Configuration ?',
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
                    var mailObj = {'status': false};
                    socialConnectorService.ChangeMailConfigStatus(mail._id, mailObj).then(function (data) {
                        if (data) {
                            $scope.showAlert('Success', 'info', 'Mail Configuration Deactivated');
                            $scope.safeApply(function () {
                                $scope.disableSwitch = false;
                            });
                        }
                        else {
                            $scope.safeApply(function () {
                                mail.active = true;
                                $scope.disableSwitch = false;
                            });

                            $scope.showAlert('Error', 'error', "Error occurred while deactivating mail configuration");
                        }

                    }, function (err) {
                        $scope.safeApply(function () {
                            mail.active = true;
                            $scope.disableSwitch = false;
                        });
                        var errMsg = "Error occurred while deactivating mail configuration";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });
                }).on('pnotify.cancel', function () {
                    $scope.safeApply(function () {
                        mail.active = true;
                        $scope.disableSwitch = false;
                    });
                });
            }
        }

    };


});