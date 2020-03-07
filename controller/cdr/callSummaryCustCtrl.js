(function () {
    var app = angular.module("veeryConsoleApp");

    var callSummaryCustCtrl = function ($scope, $filter, $timeout, loginService, cdrApiHandler, ShareData, baseUrls,$anchorScroll) {

        $anchorScroll();
        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'asc']};


        $scope.obj = {
            dayCust: moment().format("YYYY-MM-DD"),
            hour: '00:00:00.000-00:59:59.999'
        };


        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';


        var checkFileReady = function (fileName) {
            console.log('METHOD CALL');
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
                                $scope.buttonClass = 'fa fa-file-text';
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


        var checkCSVGenerateAllowed = function () {

            return true;
            //try {
            //    var prevDay = moment().subtract(1, 'days');
            //
            //    var isAllowed = prevDay.isBefore($scope.obj.dayCust);
            //
            //    return !isAllowed;
            //}
            //catch (ex) {
            //    return false;
            //}

        };

        $scope.downloadPress = function () {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
            $scope.buttonClassDaily = 'fa fa-file-text';
        };


        $scope.getCallSummaryCustCSVDownload = function () {
            if (checkCSVGenerateAllowed()) {
                if ($scope.DownloadButtonName === 'CSV') {
                    $scope.cancelDownload = false;
                    $scope.buttonClass = 'fa fa-spinner fa-spin';
                }
                else {
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                }

                $scope.DownloadButtonName = 'PROCESSING';

                try {

                    var momentTz = moment.parseZone(new Date()).format('Z');
                    momentTz = momentTz.replace("+", "%2B");

                    var startDay = $scope.obj.dayCust + ' 00:00:00.000' + momentTz;
                    var endDay = $scope.obj.dayCust + ' 23:59:59.999' + momentTz;

                    var tempBUnit = null;

                    if(ShareData.BusinessUnit !== 'ALL' && ShareData.BusinessUnit != null)
                    {
                        tempBUnit = ShareData.BusinessUnit;
                    }

                    cdrApiHandler.getCallSummaryForCustDownload(startDay, endDay, 'csv', momentTz, tempBUnit).then(function (cdrResp) {
                        if (!cdrResp.Exception && cdrResp.IsSuccess && cdrResp.Result) {
                            var downloadFilename = cdrResp.Result;

                            checkFileReady(downloadFilename);

                        }
                        else {
                            $scope.showAlert('Error', 'error', 'Error occurred while loading summary list');
                            $scope.fileDownloadState = 'RESET';
                            $scope.DownloadButtonName = 'CSV';
                        }


                    }, function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading summary list');
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                    })
                }
                catch (ex) {
                    $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading summary list');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                }
            }
            else {
                $scope.showAlert('Warning', 'warn', 'Downloading is only allowed for previous dates');
            }

        };


        $scope.getCallSummary = function () {
            if (checkCSVGenerateAllowed()) {
                try {
                    $scope.isTableLoading = 0;

                    var momentTz = moment.parseZone(new Date()).format('Z');
                    momentTz = momentTz.replace("+", "%2B");

                    var splitHour = $scope.obj.hour.split('-');

                    var startDay = $scope.obj.dayCust + ' ' + splitHour[0] + momentTz;
                    var endDay = $scope.obj.dayCust + ' ' + splitHour[1] + momentTz;

                    var tempBUnit = null;

                    if(ShareData.BusinessUnit !== 'ALL' && ShareData.BusinessUnit != null)
                    {
                        tempBUnit = ShareData.BusinessUnit;
                    }

                    cdrApiHandler.getCallSummaryForCust(startDay, endDay, momentTz, tempBUnit).then(function (cdrResp) {
                        if (!cdrResp.Exception && cdrResp.IsSuccess && cdrResp.Result) {
                            $scope.callSummaryList = cdrResp.Result;
                            $scope.isTableLoading = 1;
                        }
                        else {
                            $scope.showAlert('Error', 'error', 'Error occurred while loading summary list');
                            $scope.isTableLoading = 1;
                        }


                    }, function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading summary list');
                        $scope.isTableLoading = 1;
                    })
                }
                catch (ex) {
                    $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading summary list');
                    $scope.isTableLoading = 1;
                }
            }
            else {
                $scope.showAlert('Warning', 'warn', 'Downloading is only allowed for previous dates');
            }

        };


    };
    app.controller("callSummaryCustCtrl", callSummaryCustCtrl);

}());


