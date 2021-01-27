/**
 * Created by dinusha on 9/6/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var smsDetailReportCtrl = function ($scope, $filter, $q, $uibModal, $timeout, smsReportsService, cdrApiHandler, loginService,authService, filterDateRangeValidation) {

        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};

        $scope.moment = moment;

        $scope.pagination = {
            currentPage: 1,
            maxSize: 5,
            totalItems: 0,
            itemsPerPage: 10
        };

        $scope.recLimit = '10';

        $scope.direction = '';


        $scope.obj = {
            startDay: moment().format("YYYY-MM-DD"),
            endDay: moment().format("YYYY-MM-DD")
        };

		$scope.onDateChange = function () {

			if (moment($scope.obj.startDay, "YYYY-MM-DD").isValid() && moment($scope.obj.endDay, "YYYY-MM-DD").isValid()) {
				$scope.dateValid = true;
			}
			else {
				$scope.dateValid = false;
			}
		};

        $scope.smsList = [];

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';

        $scope.pageChanged = function () {
            $scope.getSMSSummary();
        };

        $scope.searchWithNewFilter = function () {
            $scope.pagination.currentPage = 1;
            $scope.FilterData = null;
            $scope.getSMSSummary();
        };

        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        $scope.$on("$destroy", function(){
            $scope.cancelDownload = true;
        });

        var checkFileReady = function (fileName) {
            if ($scope.cancelDownload) {
                $scope.obj.isTableLoading = -1;
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
                $scope.buttonClass = 'fa fa-file-text';
            }
            else {
                cdrApiHandler.getFileMetaData(fileName).then(function (fileStatus) {
                    if (fileStatus && fileStatus.Result)
                    {
                        if (fileStatus.Result.Status === 'PROCESSING') {
                            $timeout(checkFileReady(fileName), 10000);
                        }
                        else {

                            $scope.obj.isTableLoading = -1;

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
                    else
                    {
                        $scope.obj.isTableLoading = -1;
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                        $scope.cancelDownload = true;
                        $scope.buttonClass = 'fa fa-file-text';
                    }

                }).catch(function (err)
                {
                    $scope.obj.isTableLoading = -1;
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                });
            }

        };

        $scope.downloadPress = function () {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };


        $scope.getSMSSummary = function ()
        {
            $scope.obj.isTableLoading = 0;

            if (!$scope.FilterData)
            {
                var momentTz = moment.parseZone(new Date()).format('Z');
                momentTz = momentTz.replace("+", "%2B");

                var startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
                var tempEndDate = $scope.obj.endDay;

                var endDate = moment(tempEndDate).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00' + momentTz;

                var limit = parseInt($scope.recLimit);

                $scope.pagination.itemsPerPage = limit;

                $scope.FilterData = {
                    sdate: startDate,
                    edate: endDate,
                    limitCount: limit,
                    skipCount: 0,
                    channel_from: $scope.fromNumber,
                    channel_to: $scope.toNumber,
                    direction: $scope.direction

                }
            }
            else
            {
                $scope.FilterData.skipCount = ($scope.pagination.currentPage - 1) * $scope.FilterData.limitCount;
            }


            try
            {

                smsReportsService.getSMSDetailsCount($scope.FilterData).then(function (smsCount) {
                    if (smsCount && smsCount.IsSuccess)
                    {
                        $scope.pagination.totalItems = smsCount.Result;

                        if(smsCount.Result > 0)
                        {
                            smsReportsService.getSMSDetails($scope.FilterData).then(function (smsDetailsResp)
                            {
                                if (smsDetailsResp && smsDetailsResp.Result && smsDetailsResp.Result.length > 0)
                                {
                                    $scope.smsList = smsDetailsResp.Result;
                                    $scope.obj.isTableLoading = 1;

                                }
                                else
                                {
                                    $scope.showAlert('SMS Detail Report', 'info', 'No data found for given filters');
                                    $scope.obj.isTableLoading = -1;
                                    $scope.smsList = [];
                                }


                            }).catch(function (err) {
                                loginService.isCheckResponse(err);
                                $scope.showAlert('Error', 'error', 'Error occurred while loading sms summary');
                                $scope.obj.isTableLoading = -1;
                                $scope.smsList = [];
                            });
                        }
                        else
                        {
                            $scope.showAlert('SMS Detail Report', 'info', 'No data found for given filters');
                            $scope.obj.isTableLoading = -1;
                            $scope.smsList = [];
                        }


                    }
                    else
                    {
                        var errMsg = 'Error occurred while loading sms details';

                        if(smsCount.Exception && smsCount.Exception.Message)
                        {
                            errMsg = smsCount.Exception.Message;
                        }
                        $scope.showAlert('SMS Detail Report', 'error', errMsg);
                        $scope.obj.isTableLoading = -1;
                        $scope.smsList = [];
                    }




                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('SMS Detail Report', 'error', 'Error occurred while loading sms summary');
                    $scope.obj.isTableLoading = -1;
                    $scope.smsList = [];
                });


            }
            catch (ex) {
                $scope.showAlert('SMS Detail Report', 'error', 'Error occurred while loading sms summary');
                $scope.obj.isTableLoading = -1;
                $scope.smsList = [];
            }

        };

        $scope.getSMSSummaryCSVPrepare = function ()
        {
			/** Kasun_Wijeratne_5_MARCH_2018
			 * ----------------------------------------*/
			if(filterDateRangeValidation.validateDateRange($scope.obj.startDay, $scope.obj.endDay) == false){
				$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
				return -1;
			}
			/** ----------------------------------------
			 * Kasun_Wijeratne_5_MARCH_2018*/

            $scope.obj.isTableLoading = 0;
            if ($scope.DownloadButtonName === 'CSV') {
                $scope.cancelDownload = false;
                $scope.buttonClass = 'fa fa-spinner fa-spin';
            }
            else {
                $scope.cancelDownload = true;
                $scope.buttonClass = 'fa fa-file-text';
            }

            $scope.DownloadButtonName = 'PROCESSING';
            $scope.DownloadFileName = 'SMS_' + $scope.obj.startDay + '_' + $scope.obj.endDay;

            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
            var tempEndDate = $scope.obj.endDay;

            var endDate = moment(tempEndDate).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00' + momentTz;

            $scope.FilterData = {
                sdate: startDate,
                edate: endDate,
                channel_from: $scope.fromNumber,
                channel_to: $scope.toNumber,
                direction: $scope.direction,
                tz: momentTz
            };


            try {

                smsReportsService.getSMSDetailsNoPaging($scope.FilterData).then(function (smsDetailsResp) {
                    if (smsDetailsResp && smsDetailsResp.Result)
                    {
                        var downloadFilename = smsDetailsResp.Result;

                        checkFileReady(downloadFilename);

                    }
                    else
                    {
                        $scope.obj.isTableLoading = -1;
                        $scope.showAlert('Error', 'error', 'Error occurred while loading sms records');
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                        $scope.cancelDownload = true;
                        $scope.buttonClass = 'fa fa-file-text';
                    }


                }).catch(function (err)
                {
                    $scope.obj.isTableLoading = -1;
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Error occurred while loading sms records');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                });


            }
            catch (ex)
            {
                $scope.obj.isTableLoading = -1;
                $scope.showAlert('Error', 'error', 'Error occurred');
            }

        };

        $scope.showMessage= function (sms) {

            $scope.curSMS = sms;
            //modal show
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: "views/sms/smsMessageTemplate.html",
                size: 'sm',
                scope: $scope
            });
        };


    };
    app.controller("smsDetailReportCtrl", smsDetailReportCtrl);

}());


