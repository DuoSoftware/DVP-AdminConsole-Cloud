mainApp.controller("emailDetailReportCtrl", function ($scope, $uibModal, mailService, loginService) {

    $scope.showAlert = function (tittle, type, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.dtOptions = {paging: false, searching: false, info: false, order: [4, 'desc']};

    $scope.moment = moment;

    $scope.pagination = {
        currentPage: 1,
        maxSize: 5,
        totalItems: 0,
        itemsPerPage: 10
    };

    $scope.filters = {
        from_date: moment().format("YYYY-MM-DD"),
        to_date: moment().format("YYYY-MM-DD"),
        from_email: undefined,
        to_email: undefined,
        direction: '',
        page: 1,
        limit: '10'
    };

    $scope.search = function () {
        $scope.pagination.currentPage = 1;
        $scope.pagination.itemsPerPage = parseInt($scope.filters.limit);
        $scope.filters.page = 1;
        $scope.getEmailReport();
    };

    $scope.pageChanged = function () {
        $scope.filters.page = $scope.pagination.currentPage;
        $scope.getEmailReport();
    };

    $scope.limitUpdate = function(){
        $scope.pagination.itemsPerPage = $scope.filters.limit;
    }

    $scope.getEmailReport = function(){
        $scope.isTableLoading = 0;

        var filters = angular.copy($scope.filters);
        var momentTz = moment.parseZone(new Date()).format('Z');

        filters.from_date = $scope.filters.from_date + ' 00:00:00' + momentTz;
        filters.to_date = $scope.filters.to_date + ' 23:59:59' + momentTz;

        mailService.getEmails(filters).then(function (resp) {

            if(resp && resp.IsSuccess){
                if(resp.Result && resp.Result.count > 0){
                    $scope.emailList = resp.Result.data;
                    $scope.isTableLoading = 1;
                }else{
                    $scope.showAlert('Email Report', 'error', 'No data');
                    $scope.isTableLoading = -1;
                }
                $scope.pagination.totalItems = resp.Result.count;
            } else {
                $scope.showAlert('Email Report', 'error', 'Error occurred while loading email details');
                $scope.isTableLoading = -1;
            }

        }).catch(function (err) {
            loginService.isCheckResponse(err);
            $scope.showAlert('Email Report', 'error', 'Error occurred while loading email summary');
            $scope.isTableLoading = -1;
            $scope.smsList = [];
        });
    };

    $scope.showEmail= function (email) {

        $scope.emailPreview = email;
        //modal show
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: "emailTemplate.html",
            size: 'sm',
            scope: $scope
        });
    };
    
});