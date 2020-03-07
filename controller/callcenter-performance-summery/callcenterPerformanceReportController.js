/**
 * Created by Heshan.i on 5/19/2017.
 */

(function () {

    mainApp.controller('callcenterPerformanceReportController', function ($scope, $anchorScroll, $timeout, loginService,authService, dashboardService, cdrApiHandler, baseUrls, filterDateRangeValidation) {

        $anchorScroll();

        $scope.startDate = moment().format("YYYY-MM-DD");
        $scope.endDate = moment().format("YYYY-MM-DD");
        $scope.dateValid = true;

        $scope.reportData = [];
        $scope.isTableLoading = -1;

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';


        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};

        var showAlert = function (title,content,type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        var TimeFormatter = function (seconds) {

            var timeStr = '00:00:00';
            if (seconds > 0) {
                var durationObj = moment.duration(seconds * 1000);

                if (durationObj) {
                    var tempDays = 0;
                    if (durationObj._data.years > 0) {
                        tempDays = tempDays + durationObj._data.years * 365;
                    }
                    if (durationObj._data.months > 0) {
                        tempDays = tempDays + durationObj._data.months * 30;
                    }
                    if (durationObj._data.days > 0) {
                        tempDays = tempDays + durationObj._data.days;
                    }

                    if (tempDays > 0) {

                        timeStr = tempDays + 'd ' + ("00" + durationObj._data.hours).slice(-2) + ':' + ("00" + durationObj._data.minutes).slice(-2) + ':' + ("00" + durationObj._data.seconds).slice(-2);
                    } else {

                        timeStr = ("00" + durationObj._data.hours).slice(-2) + ':' + ("00" + durationObj._data.minutes).slice(-2) + ':' + ("00" + durationObj._data.seconds).slice(-2);
                        //(durationObj._data.hours<=9)?('0'+durationObj._data.hours):durationObj._data.hours + ':' + (durationObj._data.minutes<=9)?('0'+durationObj._data.minutes):durationObj._data.minutes  + ':' + (durationObj._data.seconds<=9)?('0'+durationObj._data.seconds):durationObj._data.seconds;
                    }
                }
            }
            return timeStr;
        };

       /* var TimeFormatter = function (seconds) {

            var timeStr = '0:0:0';
            if(seconds > 0) {
                var durationObj = moment.duration(seconds * 1000);

                if (durationObj) {
                    var tempHrs = 0;
                    if (durationObj._data.years > 0) {
                        tempHrs = tempHrs + durationObj._data.years * 365 * 24;
                    }
                    if (durationObj._data.months > 0) {
                        tempHrs = tempHrs + durationObj._data.months * 30 * 24;
                    }
                    if (durationObj._data.days > 0) {
                        tempHrs = tempHrs + durationObj._data.days * 24;
                    }

                    tempHrs = tempHrs + durationObj._data.hours;
                    timeStr = tempHrs + ':' + durationObj._data.minutes + ':' + durationObj._data.seconds;
                }
            }
            return timeStr;
        };*/

        var checkFileReady = function (fileName) {

            if ($scope.cancelDownload) {
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
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
                                $scope.buttonClass = 'fa fa-spinner fa-spin';
                            }
                            else {
                                $scope.fileDownloadState = 'RESET';
                                $scope.DownloadButtonName = 'CSV';
                            }


                        }
                    }
                    else {
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                    }

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                });
            }

        };


        $scope.downloadPress = function () {
			/** Kasun_Wijeratne_5_MARCH_2018
			 * ----------------------------------------*/
			if(filterDateRangeValidation.validateDateRange($scope.startDate, $scope.endDate) == false){
				$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
				return -1;
			}
			/** ----------------------------------------
			 * Kasun_Wijeratne_5_MARCH_2018*/
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };

        $scope.onDateChange = function () {
        	if(moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid()) {
				$scope.dateValid = true;
			}else{
				$scope.dateValid = false;
			}
        };

        $scope.prepareToDownload = function () {
			/** Kasun_Wijeratne_5_MARCH_2018
			 * ----------------------------------------*/
			if(filterDateRangeValidation.validateDateRange($scope.startDate, $scope.endDate) == false){
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

            $scope.DownloadButtonName = 'PROCESSING...';
            var endDate = moment($scope.endDate).add(1, 'days').format('YYYY-MM-DD');
            dashboardService.GetCallCenterPerformanceHistory($scope.startDate, endDate, 'download').then(function (response) {
                if (response) {
                    checkFileReady(response);
                }else{
                    showAlert('Call Center Performance', 'No Records Found', 'error');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
            });

        };

        $scope.loadReportData = function () {
            $scope.reportData = [];
            $scope.isTableLoading = 0;
            var endDate = moment($scope.endDate).add(1, 'days').format('YYYY-MM-DD');
            dashboardService.GetCallCenterPerformanceHistory($scope.startDate, endDate, 'report').then(function (response) {
                if (response && response.length > 0) {
                    $scope.reportData = response.map(function (record) {

                        record.Date = moment(record.Date).format("YYYY-MM-DD");
                        record.totalStaffTime = TimeFormatter(record.totalStaffTime);
                        record.totalAcwTime = TimeFormatter(record.totalAcwTime);
                        record.AverageStaffTime = TimeFormatter(record.AverageStaffTime);
                        record.AverageAcwTime = TimeFormatter(record.AverageAcwTime);
                        record.totalTalkTimeInbound = TimeFormatter(record.totalTalkTimeInbound);
                        record.totalTalkTimeOutbound = TimeFormatter(record.totalTalkTimeOutbound);
                        record.totalBreakTime = TimeFormatter(record.totalBreakTime);
                        record.totalHoldTime = TimeFormatter(record.totalHoldTime);
                        record.totalIdleTime = TimeFormatter(record.totalIdleTime);
                        record.AverageTalkTimeInbound = TimeFormatter(record.AverageTalkTimeInbound);
                        record.AverageTalkTimeOutbound = TimeFormatter(record.AverageTalkTimeOutbound);

                        return record;
                    });

                    $scope.isTableLoading = 1;
                }else{
                    $scope.isTableLoading = 2;
                    showAlert('Call Center Performance', 'No Records Found', 'error')
                }
            }, function (err) {
                loginService.isCheckResponse(err);
            });

        };



    });

}());
