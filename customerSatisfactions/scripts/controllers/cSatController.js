mainApp.controller('cSatController', function ($scope, $filter, $anchorScroll, $q, $timeout, cSatService, ticketReportsService, authService,cdrApiHandler, loginService, filterDateRangeValidation) {
    $anchorScroll();



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



    $scope.csatSerach = {};
    var d = new Date();
    d.setDate(d.getDate() - 1);
    $scope.csatSerach.StartTime = moment().format("YYYY-MM-DD");
    $scope.csatSerach.EndTime = moment().format("YYYY-MM-DD");

	$scope.onDateChange = function () {
		// $scope.startDate = moment($scope.startDate).format("YYYY-MM-DD");
		// $scope.endDate = moment($scope.endDate).format("YYYY-MM-DD");

		if (moment($scope.csatSerach.StartTime, "YYYY-MM-DD").isValid() && moment($scope.csatSerach.EndTime, "YYYY-MM-DD").isValid()) {
			$scope.dateValid = true;
		}
		else {
			$scope.dateValid = false;
		}
	};
    // search end

    $scope.enableSearchButton = true;
    $scope.dtOptions = {paging: false, searching: false, info: false, order: [6, 'desc']};
    $scope.pageSizRange = [100, 500, 1000, 5000, 10000];
    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.disableTiles = true;
    $scope.disableTileCSS = 'csatdisabled';
    $scope.showPaging = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.selectedUsers = [];
    $scope.pageSize = 100;
    $scope.noDataToshow = false;
    $scope.satisfactionRequest = [];

    $scope.cancelDownload = true;
    $scope.buttonClass = 'fa fa-file-text';
    $scope.fileDownloadState = 'RESET';
    $scope.currentCSVFilename = '';
    $scope.DownloadButtonName = 'CSV';

    $scope.downloadPress = function () {
        $scope.fileDownloadState = 'RESET';
        $scope.DownloadButtonName = 'CSV';
        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
    };

    var checkFileReady = function (fileName) {
        if ($scope.cancelDownload) {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.buttonClass = 'fa fa-file-text';
        }
        else {
            cdrApiHandler.getFileMetaData(fileName).then(function (fileStatus) {
                if (fileStatus && fileStatus.Result) {
                    if (fileStatus.Result.Status === 'PROCESSING') {
                        $timeout(checkFileReady(fileName), 10000);
                    }
                    else {


                        var decodedToken = authService.getTokenDecode();

                        if (decodedToken && decodedToken.company && decodedToken.tenant) {
                            $scope.currentCSVFilename = fileName;
                            $scope.DownloadCSVFileUrl = baseUrls.fileServiceInternalUrl + 'File/DownloadLatest/' + decodedToken.tenant + '/' + decodedToken.company + '/' + fileName;
                            $scope.fileDownloadState = 'READY';
                            $scope.DownloadButtonName = 'CSV';
                            $scope.cancelDownload = true;
                            $scope.buttonClass = 'fa fa-file-text';
                        }
                        else {
                            $scope.fileDownloadState = 'RESET';
                            $scope.DownloadButtonName = 'CSV';
                            $scope.cancelDownload = true;
                            $scope.buttonClass = 'fa fa-file-text';
                        }


                    }
                }
                else {
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                    $scope.showAlert('CDR Download', 'warn', 'No CDR Records found for downloading');
                }

            }).catch(function (err) {
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
                $scope.cancelDownload = true;
                $scope.buttonClass = 'fa fa-file-text';
                $scope.showAlert('CDR Download', 'error', 'Error occurred while preparing file');
            });
        }

    };

    $scope.processDownloadRequest = function()
    {
		/** Kasun_Wijeratne_5_MARCH_2018
		 * ----------------------------------------*/
		if(filterDateRangeValidation.validateDateRange($scope.csatSerach.StartTime, $scope.csatSerach.EndTime) == false){
			$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
			return -1;
		}
		/** ----------------------------------------
		 * Kasun_Wijeratne_5_MARCH_2018*/
        if ($scope.DownloadButtonName === 'CSV') {
            $scope.cancelDownload = false;
            $scope.buttonClass = 'fa fa-spinner fa-spin';
        }
        else {
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        }

        $scope.DownloadButtonName = 'PROCESSING';

        var selectedAgentList = $scope.selectedUsers.map(function(usrObj)
        {
            return usrObj._id;
        });

        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        cSatService.getSatisfactionRequestDownload($scope.csatSerach.StartTime, $scope.csatSerach.EndTime, $scope.satisfaction, selectedAgentList, momentTz).then(function (response) {
            if(response.IsSuccess)
            {
                var downloadFilename = response.Result;

                checkFileReady(downloadFilename);
            }
            else
            {
                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr records');
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
                $scope.cancelDownload = true;
                $scope.buttonClass = 'fa fa-file-text';
            }
        }, function(err){
            loginService.isCheckResponse(err);
            $scope.showAlert('Error', 'error', 'Error occurred while loading cdr records');
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        });
    };


    $scope.getPageData = function (Paging, page, pageSize, total) {
        $scope.isLoading = true;

        var selectedAgentList = $scope.selectedUsers.map(function(usrObj)
        {
            return usrObj._id;
        });
        cSatService.GetSatisfactionRequest(page, pageSize, $scope.csatSerach.StartTime, $scope.csatSerach.EndTime, $scope.satisfaction, selectedAgentList).then(function (response) {
            if (response) {
                $scope.satisfactionRequest = response;
                $scope.showPaging = true;
            }
            $scope.satisfaction = "all";
            $scope.isLoading = false;
        }, function (err) {
            $scope.satisfaction = "all";
            showAlert("IVR", "error", "Fail To Get Satisfaction Details.");
        });
    };

    var getUserList = function () {
        $scope.userList=[];

        ticketReportsService.getUserCount('all').then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(ticketReportsService.LoadUsersByPage('all',pagesize, i));
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
                loginService.isCheckResponse(err);
                //$scope.showAlert("Loading Agent details", "error", "Error In Loading Agent Details");
            });



        }, function (err) {
            loginService.isCheckResponse(err);
           // $scope.showAlert("Load Users", "error", "Fail To Get User List.")
        });


       /* ticketReportsService.getUsers().then(function (userList) {
            if (userList && userList.Result && userList.Result.length > 0) {
                $scope.userList = userList.Result;

                /!*$scope.userList = userList.Result.map(function (obj) {
                    var rObj = {
                        UniqueId: obj._id,
                        Display: obj.name
                    };

                    return rObj;
                });*!/
            }


        }).catch(function (err) {
            loginService.isCheckResponse(err);
        });*/
    };

    getUserList();

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

    //$scope.getPageData(0, $scope.currentPage, $scope.pageSize, $scope.pageTotal);

    $scope.doughnutObj = {labels: [], data: []};
    $scope.options = {
        type: 'doughnut',
        responsive: false,
        legend: {
            display: true,
            position: 'bottom',
            padding: 5,
            labels: {
                fontColor: 'rgb(130, 152, 174)',
                fontSize: 10,
                boxWidth: 10
            }
        },
        title: {
            display: true
        }
    };

    var showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.responseRate = 0;
    $scope.goodRate = 0;
    var calculateReating = function () {
        var curRes = ($scope.pageTotal - $scope.offered);
        $scope.responseRate = ((curRes / $scope.pageTotal) * 100);
        if ($scope.responseRate <= 100) {
            if ($scope.responseRate < 0) {
                $scope.responseRate = 0;
            }
            else
                $scope.responseRate = $scope.responseRate.toFixed(2);
        }
        else {
            $scope.responseRate = 0;
        }

        $scope.goodRate = (($scope.good / curRes) * 100);
        if ($scope.goodRate <= 100) {
            if ($scope.goodRate < 0) {
                $scope.goodRate = 0;
            }
            else
                $scope.goodRate = $scope.goodRate.toFixed(2);
        }
        else {
            $scope.goodRate = 0;
        }
    };

    $scope.satisfactionReport = {};
    $scope.offered = 0;
    var GetSatisfactionRequestReport = function () {
        $scope.doughnutObj = {labels: [], data: []};
        $scope.isLoading = true;
        $scope.offered = 0;
        $scope.good = 0;
        var selectedAgentList = $scope.selectedUsers.map(function(usrObj)
        {
            return usrObj._id;
        });

        cSatService.GetSatisfactionRequestReport($scope.csatSerach.StartTime, $scope.csatSerach.EndTime, selectedAgentList).then(function (response) {
            if (response) {
                $scope.satisfactionReport = response;
                angular.forEach(response, function (item) {
                    if (item) {
                        $scope.doughnutObj.labels.push(item._id);
                        $scope.doughnutObj.data.push(item.satisfactions);
                        if (item._id === 'offered')
                            $scope.offered = item.satisfactions;
                        if (item._id === 'good')
                            $scope.good = item.satisfactions;
                    }
                });
            }
            else {
                $scope.noDataToshow = true;
            }
            $scope.isLoading = false;
            calculateReating();
        }, function (err) {
            $scope.isLoading = false;
            showAlert("IVR", "error", "Fail To Get Satisfaction Report.");
        });
    };
    //GetSatisfactionRequestReport();

    $scope.pageTotal = 0;
    var GetSatisfactionRequestCount = function () {
        $scope.pageTotal = 0;
        var selectedAgentList = $scope.selectedUsers.map(function(usrObj)
        {
            return usrObj._id;
        });
        cSatService.GetSatisfactionRequestCount($scope.csatSerach.StartTime, $scope.csatSerach.EndTime, $scope.satisfaction, selectedAgentList).then(function (response) {
            if (response) {
                $scope.pageTotal = response;
            }
            else {
                $scope.pageTotal = 0;
            }
            calculateReating();
        }, function (err) {
            showAlert("IVR", "error", "Fail To Get Total Satisfaction Count.");
        });
    };
    //GetSatisfactionRequestCount();

    $scope.searchData = function () {
        if ($scope.csatSerach.StartTime >= $scope.csatSerach.EndTime) {
            showAlert("Search", "error", "End Time Should Be Greater Than Start Time.");
            return
        }

        GetSatisfactionRequestCount();
        $scope.getPageData(0, $scope.currentPage, $scope.pageSize, $scope.pageTotal);
        GetSatisfactionRequestReport();

        $scope.disableTiles = false;
        $scope.disableTileCSS = 'csatenabled';
    };

    $scope.uiParamsChanged = function()
    {
        $scope.disableTiles = true;
        $scope.disableTileCSS = 'csatdisabled';
    };

    $scope.satisfaction = "all";
    $scope.searchDataBySatisfaction = function (satisfaction) {

        if(!$scope.disableTiles)
        {
            $('.widget-dy-wrp').removeClass('active');
            $('#' + satisfaction).addClass('active');
            $scope.satisfaction = satisfaction;
            $scope.getPageData(0, $scope.currentPage, $scope.pageSize, $scope.pageTotal);
        }


    };


});
