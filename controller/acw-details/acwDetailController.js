/**
 * Created by Heshan.i on 1/13/2017.
 */

(function(){

    var app =angular.module('veeryConsoleApp');

    var acwDetailController = function($scope, $state, $timeout, acwDetailApiAccess, resourceService, cdrApiHandler, loginService,authService, filterDateRangeValidation, ShareData,$q) {

        $scope.resourceDetails=[];
        $scope.pagination = {
            currentPage : 1
        };

        $scope.obj = {
            startDay: moment().format("YYYY-MM-DD"),
            endDay: moment().format("YYYY-MM-DD")
        };

        $scope.querySearch = function (query) {
            var emptyArr = [];
            var result =[];
            if(query)
            {
                query = query.toLowerCase();
            }
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
                    /*return $scope.resourceDetails.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.ResourceName) {
                            return item.ResourceName.match(regEx);
                        }
                        else {
                            return false;
                        }

                    });*/

                    angular.forEach($scope.resourceDetails, function(item){

                        if(item.ResourceName.toLowerCase().indexOf(query)!==-1){
                            result.push(item);
                        }

                    });

                    return result;
                }
                else {
                    return emptyArr;
                }
            }

        };

		$scope.onDateChange = function () {

			if (moment($scope.obj.startDay, "YYYY-MM-DD").isValid() && moment($scope.obj.endDay, "YYYY-MM-DD").isValid()) {
				$scope.dateValid = true;
			}
			else {
				$scope.dateValid = false;
			}
		};

        $scope.startTime = '12:00 AM';
        $scope.endTime = '11:59 PM';

        $scope.qList = [];

        $scope.showTable = false;

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

            $scope.DownloadButtonName = 'PROCESSING';

            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.getAllAcwRecords($scope.obj.resourceId.ResourceId, startDate, endDate, $scope.skillFilter,ShareData.BusinessUnit).then(function(response){
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


        var getQueueList = function () {

            resourceService.getQueueSettings().then(function (qList) {
                if (qList && qList.length > 0) {
                    var tempQList = qList.filter(function(q)
                    {
                        return !!(q.ServerType === 'CALLSERVER' && q.RequestType === 'CALL');
                    });

                    $scope.qList = tempQList;
                }
                else
                {
                    $scope.qList = [];
                }


            }).catch(function (err) {
                $scope.qList = [];
                loginService.isCheckResponse(err);
            });
        };
        getQueueList();

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

                    $scope.showAlert("Error","Error in loading Agent details","error");
                });



            }, function (err) {
                console.log("Error in Agent details picking " + err);
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
                    $scope.showAlert('ACW Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading resource details";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('ACW Details', errMsg, 'error');
            });*/
        };

        $scope.getAcwSummery = function(){
            $scope.showTable = false;
            $scope.totalAcwSessions = 0;
            $scope.totalAcwTime = 0;
            $scope.averageAcwTime = 0;

            $scope.showPaging = false;

            $scope.pageSize = 20;


            $scope.obj.isTableLoading = 0;

            $scope.allAcwRecords = [];


            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            $scope.obj.isTableLoading = 0;
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.GetAcwSummeryDetails($scope.obj.resourceId.ResourceId, startDate, endDate, $scope.skillFilter,ShareData.BusinessUnit).then(function(response){
                if(response.IsSuccess)
                {
                    if(response.Result) {
                        $scope.totalAcwSessions = response.Result.TotalAcwSessions?response.Result.TotalAcwSessions:0;
                        $scope.totalAcwTime = response.Result.TotalAcwTime?parseInt(response.Result.TotalAcwTime):0;
                        $scope.averageAcwTime = response.Result.AverageAcwTime?parseFloat(response.Result.AverageAcwTime).toFixed(2):0;

                        var durationObj = moment.duration($scope.totalAcwTime*1000);
                        if(durationObj._data.days>0){
                            $scope.timeStr = durationObj._data.days+'d '+durationObj._data.hours+'h:'+durationObj._data.minutes+'m:'+durationObj._data.seconds+'s';
                        }else{
                            $scope.timeStr = durationObj._data.hours+'h:'+durationObj._data.minutes+'m:'+durationObj._data.seconds+'s';
                        }
                        $scope.getAcwRecords();
                    }

                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('ACW Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading ACW records";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('ACW Details', errMsg, 'error');
            });
        };

        $scope.getAcwRecords = function(){
            //$scope.currentPage = pageNo + 1;
            $scope.showTable = false;
            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.GetAcwRecords($scope.obj.resourceId.ResourceId, $scope.pagination.currentPage, $scope.pageSize, startDate, endDate, $scope.skillFilter, ShareData.BusinessUnit).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.showTable = true;
                    $scope.allAcwRecords = response.Result;
                    /*$scope.acwRecords = response.Result;*/
                    var sessionIds = [];
                    $scope.obj.isTableLoading = 1;


                    if($scope.allAcwRecords && $scope.allAcwRecords.length > 0){


                        // $scope.allAcwRecords.forEach(function(record){
                        //
                        //     if($scope.resourceDetails) {
                        //         var resourceObj = $scope.resourceDetails.filter(function(resource){
                        //             return resource.ResourceId == record.ResourceId;
                        //         })
                        //
                        //         if(Array.isArray(resourceObj) && resourceObj.length > 0){
                        //
                        //             record.ResourceName = resourceObj[0].ResourceName;
                        //
                        //         }
                        //     }
                        //
                        //
                        //
                        // });


                        if($scope.allAcwRecords.length < $scope.pageSize){
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
                    $scope.showAlert('ACW Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading ACW records";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('ACW Details', errMsg, 'error');
            });
        };


        $scope.getResourceDetails();

    };

    app.controller('acwDetailController', acwDetailController);
}());
