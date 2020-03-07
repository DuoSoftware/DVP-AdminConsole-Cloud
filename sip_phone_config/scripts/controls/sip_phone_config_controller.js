mainApp.controller("sip_phone_config_controller", function ($scope, $rootScope, $filter, $stateParams, $anchorScroll, $q, sipUserService, sipUserApiHandler,$log) {
    $anchorScroll();

    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.isTableLoading = false;
    $scope.ip_phones = [];
    var getPhoneConfigs = function () {
        return sipUserService.getPhoneConfigs().then(function (response) {
            return response;
        }, function (error) {
            console.error(error);
            $scope.showAlert("SIP Phone", 'error', 'Fail To Get Phone List.');
            $scope.isTableLoading = false;
            return null;
        })
    };


    $scope.sipUsrList = [];
    var loadSipUsers = function () {

        $scope.sipUsrList = [];

        sipUserApiHandler.getSipUsersCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(sipUserApiHandler.getSipUsersWithPaging(i,pagesize));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {
                    resolveData.map(function (response) {

                        response.map(function (item) {

                            $scope.sipUsrList.push(item);

                        });


                    });

                }


            }).catch(function (err) {
                $log.debug("Get Sip user count  err");
                $scope.showError("Error", "Error in loading sip users");
                return null;
            });



        }, function (err) {
           $log.debug("Get Sip user count  err");
           $scope.showError("Error", "Error in loading sip users");
            return null;

        });




        /*return sipUserApiHandler.getSIPUsers().then(function (data) {
            return data;
        }, function (err) {
            console.error(err);
            $scope.showAlert('Error', 'error', 'Fail To Load Sip User List');
            return null;
        });*/
    };

    $scope.isLoadingCompany = false;
    $scope.loadData = function () {
        $scope.isLoadingCompany = true;
        $scope.ip_phones = [];
        $scope.sipUsrList = [];
        loadSipUsers();
        $q.all([
            getPhoneConfigs(),
            //loadSipUsers()
        ]).then(function (value) {
            $scope.ip_phones = value[0];
            /*var data = value[1];
            if (data && data.IsSuccess) {
                $scope.sipUsrList = data.Result;
                /!*if ($scope.sipUsrList.length > 0) {
                    $scope.FormState = 'New';
                    $scope.SipUsernameDisplay = $scope.sipUsrList[0].SipUsername;
                    //$scope.onEditPressed($scope.sipUsrList[0].SipUsername);
                }

                if ($scope.sipUsrList.length == 0) {
                    $scope.FormState = 'Cancel';
                    $scope.SipUsernameDisplay = 'NEW SIP USER';
                }
                $scope.total = data.Result.length;*!/
            }*/
            $scope.isLoadingCompany = false;
        }, function (err) {
            console.log(err);
            $scope.isLoadingCompany = false;
        });
    };
    $scope.loadData();
});