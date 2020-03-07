mainApp.controller("chatReportCtrl", function ($scope, $uibModal, interactionService, mailService, loginService, $q, ShareData) {

    $scope.showAlert = function (tittle, type, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.dtOptions = {paging: false, searching: false, info: false, order: [3, 'desc']};

    $scope.moment = moment;

    $scope.pagination = {
        currentPage: 1,
        maxSize: 5,
        totalItems: 0,
        itemsPerPage: 10
    };

    $scope.filters = {
        startdate: moment().format("YYYY-MM-DD"),
        enddate: moment().format("YYYY-MM-DD"),
        from: undefined,
        to: undefined,
        channel: 'chat',
        skip: 0,
        limit: '10'
    };

    $scope.Agents = [];
    $scope.chatSessions = [];

    $scope.search = function () {
        $scope.pagination.currentPage = 1;
        $scope.pagination.itemsPerPage = parseInt($scope.filters.limit);
        $scope.filters.skip = 0;
        $scope.getChatSessions();
    };

    $scope.pageChanged = function () {
        $scope.filters.skip = ($scope.pagination.currentPage - 1) * $scope.filters.limit;
        $scope.getChatSessions();
    };

    $scope.limitUpdate = function(){
        $scope.pagination.itemsPerPage = $scope.filters.limit;
    }

    $scope.getChatSessions = function(){
        $scope.isTableLoading = 0;
        
        var filters = angular.copy($scope.filters);
        var momentTz = moment.parseZone(new Date()).format('Z');

        filters.startdate = $scope.filters.startdate + ' 00:00:00' + momentTz;
        filters.enddate = $scope.filters.enddate + ' 23:59:59' + momentTz;

        interactionService.getEnagementSessionsCount(filters).then(function (response) {
            if (response && response.IsSuccess) {
                $scope.pagination.totalItems = response.Result;

                if(response.Result > 0) {
                    interactionService.getEnagementSessions(filters).then(function (resp) {          
                        if(resp && resp.IsSuccess && resp.Result){
                            $scope.chatSessions = resp.Result;
                            $scope.isTableLoading = 1;
                        } else {
                            $scope.showAlert('Email Report', 'error', 'Error occurred while loading chat sessions');
                            $scope.isTableLoading = -1;
                        }
            
                    }).catch(function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Chat Report', 'error', 'Error occurred while loading chat sessions');
                        $scope.isTableLoading = -1;
                        $scope.chatSessions = [];
                    });

                } else {
                    $scope.showAlert('Chat Report', 'info', 'No data found for given filters');
                    $scope.isTableLoading = -1;
                    $scope.chatSessions = [];
                }

            } else {
                var customMessage = '';

                if(response.CustomMessage)
                    customMessage = response.CustomMessage;
                    
                $scope.showAlert('Chat Report', 'error', 'Error loading chat sessions. ' + customMessage);
                $scope.isTableLoading = -1;
                $scope.chatSessions = [];
            }

        }).catch(function (err) {
            loginService.isCheckResponse(err);
            $scope.showAlert('Chat Report', 'error', 'Error occurred while loading chat sessions');
            $scope.isTableLoading = -1;
            $scope.chatSessions = [];
        });
    };

    $scope.showConversation = function (engagementId) {

        $scope.chatConversation = undefined;

        mailService.getChatMessages(engagementId).then(function (resp) {

            if(resp && resp.IsSuccess){
                if(resp.Result && resp.Result.length > 0){

                    $scope.chatConversation = resp.Result;

                    // modal show
                    $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title-top',
                        ariaDescribedBy: 'modal-body-top',
                        templateUrl: "chatTemplate.html",
                        size: 'sm',
                        scope: $scope
                    });
                }else{
                    $scope.showAlert('Chat Report', 'error', 'No messages to display!');
                }
            } else {
                $scope.showAlert('Chat Report', 'error', 'Error occurred while loading messages.');
            }

        }).catch(function (err) {
            $scope.showAlert('Chat Report', 'error', 'Error occurred while loading messages');
        });
    };

    // following code block taken from agent summary control.
    $scope.getAgents = function () {

        ShareData.getAgentDetailsCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(ShareData.getAgentDetailsWithPaging(pagesize, i));
            }

            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {
                    resolveData.map(function (data) {
                        data.map(function (item) {
                            $scope.Agents.push(item);
                        });
                    });
                } else {
                    $scope.showAlert("Error","Error in loading agent details","error");
                }
            }).catch(function (err) {
                console.log("Error in Agent details picking " + err);

                $scope.showAlert("Error","Error in loading Agent details","error");
            });
        }, function (err) {
            console.log("Error in Agent details picking " + err);
            $scope.showAlert("Error","Error in loading Agent details","error");
        });
    };

    $scope.getAgents();

    $scope.querySearch = function (query) {
        var emptyArr = [];
        if (query === "*" || query === "") {
            if ($scope.Agents) {
                return $scope.Agents;
            } else {
                return emptyArr;
            }

        } else {
            if ($scope.Agents) {
                var filteredArr = $scope.Agents.filter(function (item) {

                    if (item.ResourceName) {
                        return item.ResourceName.toString().toLowerCase().match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            } else {
                return emptyArr;
            }
        }

    };
});