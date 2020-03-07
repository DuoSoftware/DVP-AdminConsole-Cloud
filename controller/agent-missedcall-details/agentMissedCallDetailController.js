/**
 * Created by Heshan.i on 2/2/2017.
 */
(function(){

    var app =angular.module('veeryConsoleApp');

    var agentMissedCallDetailController = function($scope, $q, $timeout, $state, $uibModal, acwDetailApiAccess, cdrApiHandler, loginService,authService, baseUrls, $anchorScroll, filterDateRangeValidation, ShareData) {

        $anchorScroll();
        $scope.resourceDetails =[];
        $scope.pageSize = 10;
        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.fileDownloadEnabled = false;
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';

        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'asc']};
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

        $scope.querySearch = function (query) {
            var emptyArr = [];
            if (query === "*" || query === "") {
                if ($scope.resourceDetails) {
                    return $scope.resourceDetails;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.resourceDetails) {
                    return $scope.resourceDetails.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.ResourceName) {
                            return item.ResourceName.match(regEx);
                        }
                        else {
                            return false;
                        }

                    });
                }
                else {
                    return emptyArr;
                }
            }

        };

        $scope.startTime = '12:00 AM';
        $scope.endTime = '11:59 PM';

        var convertToMMSS = function (sec) {

            if(typeof sec === 'number'){
                var minutes = Math.floor(sec / 60);

                if (minutes < 10) {
                    minutes = '0' + minutes;
                }

                var seconds = sec - minutes * 60;

                if (seconds < 10) {
                    seconds = '0' + seconds;
                }

                return minutes + ':' + seconds;
            }else{
                return sec;
            }

        };

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
                                $scope.fileDownloadEnabled = false;
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
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                });
            }

        };


        $scope.downloadPress = function () {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };

        $scope.showMessage= function (causes) {

            $scope.missedCallCauses = causes;
            //modal show
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: "views/agent-missedcall-details/reasonTemplate.html",
                size: 'sm',
                scope: $scope
            });
        };


        $scope.getProcessedCDRCSVDownload = function () {
			/** Kasun_Wijeratne_5_MARCH_2018
			 * ----------------------------------------*/
			if(filterDateRangeValidation.validateDateRange($scope.obj.startDay, $scope.obj.endDay) == false){
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

                $scope.fileDownloadEnabled = true;
                $scope.DownloadButtonName = 'PROCESSING';
                $scope.DownloadFileName = 'MissedCallReport_' + $scope.obj.resourceId.ResourceId+'.csv';

                var deferred = $q.defer();

                var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
                var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
                var momentTz = moment.parseZone(new Date()).format('Z');
                momentTz = momentTz.replace("+", "%2B");

                var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
                var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

                acwDetailApiAccess.PrepareDownloadDetails($scope.obj.resourceId.ResourceId, startDate, endDate, ShareData.BusinessUnit).then(function(response){
                    if(response.IsSuccess){

                        var downloadFilename = response.Result;
                        checkFileReady(downloadFilename);
                    }
                    else {
                        $scope.showAlert('Error', 'error', 'Error occurred while loading missed call records');
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                        $scope.fileDownloadEnabled = false;
                    }

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Error occurred while loading missed call records');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.fileDownloadEnabled = false;
                });

        };

        $scope.getResourceDetails = function(){

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

                                $scope.resourceDetails.push(item);
                            });
                        });

                    }
                    else
                    {
                        $scope.showAlert("Error","Error in loading agent details","error");
                    }



                }).catch(function (err) {
                    console.log("Error in Agent details picking " + err);
                    loginService.isCheckResponse(err);

                    $scope.showAlert("Error","Error in loading Agent details","error");
                });



            }, function (err) {
                console.log("Error in Agent details picking " + err);
                loginService.isCheckResponse(err);
                $scope.showAlert("Error","Error in loading Agent details","error");
            });




            /*acwDetailApiAccess.GetResourceDetails().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.resourceDetails = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Missed Call Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading resource details";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Missed Call Details', errMsg, 'error');
            });*/
        };

        $scope.getRejectedSummery = function(){
            $scope.rejectedSessionCount = 0;

            $scope.showPaging = false;
            $scope.currentPage = 1;


            $scope.obj.isTableLoading = 0;

            $scope.allMissedCallRecords = [];


            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            $scope.obj.isTableLoading = 0;
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.GetRejectedSessionCount($scope.obj.resourceId.ResourceId, startDate, endDate, ShareData.BusinessUnit).then(function(response){
                if(response.IsSuccess)
                {
                    if(response.Result) {
                        $scope.rejectedSessionCount = response.Result?response.Result:0;
                        $scope.getMissedCallDetails($scope.currentPage);
                    }else{
                        $scope.obj.isTableLoading = 2;
                    }

                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Missed Call Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading Missed Call records";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Missed Call Details', errMsg, 'error');
            });
        };

        $scope.getMissedCallDetails = function(pageNo){
            $scope.currentPage = pageNo;
            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.GetRejectedSessionDetails($scope.obj.resourceId.ResourceId, $scope.currentPage, $scope.pageSize, startDate, endDate, ShareData.BusinessUnit).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.missedCallRecords = response.Result;
                    var sessionIds = [];
                    if($scope.missedCallRecords && $scope.missedCallRecords.length > 0){
                        sessionIds = $scope.missedCallRecords.map(function (record) {
                            return record.SessionId
                        });

                        $scope.getCdrRecords(sessionIds);

                        if($scope.missedCallRecords.length < $scope.pageSize){
                            $scope.showPaging = false;
                        }else{
                            $scope.showPaging = true;
                        }
                    }else{
                        $scope.obj.isTableLoading = 1;
                        $scope.showPaging = false;
                    }
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Missed Call Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading Missed Call records";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Missed Call Details', errMsg, 'error');
            });
        };

        $scope.getCdrRecords = function(sessionIds){
            acwDetailApiAccess.GetCdrBySessions(sessionIds).then(function(response){
                if(response.IsSuccess)
                {

                    $scope.missedCallRecords.forEach(function (missedCallRecord) {
                        if(response.Result) {
                            for (var i = 0; i < response.Result.length; i++) {
                                var cdrRecord = response.Result[i];
                                if (cdrRecord.Uuid === missedCallRecord.SessionId) {
                                    cdrRecord.QueueSec = convertToMMSS(cdrRecord.QueueSec);
                                    if (cdrRecord.DVPCallDirection === "outbound") {
                                        var oriFrom = angular.copy(cdrRecord.SipFromUser);
                                        var oriTo = angular.copy(cdrRecord.SipToUser);
                                        cdrRecord.SipFromUser = oriTo;
                                        cdrRecord.SipToUser = oriFrom;
                                    }
                                    missedCallRecord.cdrInfo = cdrRecord;
                                    break;
                                }
                            }
                        }
                    });
                    $scope.obj.isTableLoading = 1;
                    $scope.allMissedCallRecords = $scope.missedCallRecords;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Missed Call Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading CDR details";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Missed Call Details', errMsg, 'error');
            });
        };

        $scope.getResourceDetails();

    };

    app.controller('agentMissedCallDetailController', agentMissedCallDetailController);
}());
