/**
 * Created by dinusha on 9/6/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var queueSummaryHourlyCtrl = function ($scope, $filter, $timeout, loginService, cdrApiHandler, resourceService, baseUrls,$anchorScroll,ShareData) {

        $anchorScroll();
        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'asc']};

        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.moment = moment;

        $scope.summaryArr = [];

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';

        var convertToMMSS = function (sec) {
            var minutes = Math.floor(sec / 60);

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            var seconds = sec - minutes * 60;

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        };


        $scope.obj = {
            day: moment().format("YYYY-MM-DD")
        };

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
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };


        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        var emptyArr = [];

        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.qList) {
                    return $scope.qList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.qList) {
                    var filteredArr = $scope.qList.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.Attribute) {
                            return item.Attribute.match(regEx);
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

        $scope.checkTagCount = function () {
            if (!$scope.skillFilter || $scope.skillFilter.length < 5) {
                return true;
            }
            else {
                return false;
            }
        };


        /*$scope.loadAttrList = function () {
            cdrApiHandler.getAttributeList().then(function (attrList) {
                if (attrList && attrList.Result) {
                    $scope.attrList = attrList.Result;
                }
                else {
                    $scope.attrList = [];
                }


            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Queue wise summary', 'error', 'Failed to bind agent auto complete list');

            })
        };

        $scope.loadAttrList();*/

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

        var tempQueueArr = {};
        var curCount = 0;
//---
        var buildSummaryListByHr = function (day, attributes, recId, momentTz, callback)
        {
            cdrApiHandler.getCallSummaryForQueueByHr(day, undefined, undefined, undefined, attributes, momentTz,ShareData.BusinessUnit).then(function (sumResp)
            {
                if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result)
                {

                    tempQueueArr = sumResp.Result;
                    callback(null, true);

                }
                else
                {
                    callback(null, false);
                }


            }, function (err) {
                loginService.isCheckResponse(err);
                callback(err, false);
            })
        };

        // -----

        // var buildSummaryListByHr = function (day, hr, attribute, recId, momentTz, callback)
        // {
        //     cdrApiHandler.getCallSummaryForQueueByHr(day, attribute, hr, momentTz,ShareData.BusinessUnit).then(function (sumResp)
        //     {
        //         if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result)
        //         {
        //             if (typeof sumResp.Result.IvrAverage === "number") {
        //                 sumResp.Result.IvrAverage = convertToMMSS(sumResp.Result.IvrAverage);
        //             }
        //
        //             if (typeof sumResp.Result.HoldAverage === "number") {
        //                 sumResp.Result.HoldAverage = convertToMMSS(sumResp.Result.HoldAverage);
        //             }
        //
        //             if (typeof sumResp.Result.RingAverage === "number") {
        //                 sumResp.Result.RingAverage = convertToMMSS(sumResp.Result.RingAverage);
        //             }
        //
        //             if (typeof sumResp.Result.TalkAverage === "number") {
        //                 sumResp.Result.TalkAverage = convertToMMSS(sumResp.Result.TalkAverage);
        //             }
        //
        //             if(tempQueueArr[attribute])
        //             {
        //                 tempQueueArr[attribute].push(sumResp.Result);
        //             }
        //             else
        //             {
        //                 tempQueueArr[attribute] = [];
        //                 tempQueueArr[attribute].push(sumResp.Result);
        //             }
        //
        //             var maxCount = $scope.skillFilter.length * 24;
        //             curCount++;
        //
        //             $scope.progressSumVal = ((curCount/maxCount)*100).toFixed(2);
        //
        //             var newHr = hr + 1;
        //
        //             if(newHr < 25)
        //             {
        //                 buildSummaryListByHr(day, newHr, attribute, recId, momentTz, function(err, resp)
        //                 {
        //                     callback(null, true);
        //                 });
        //             }
        //             else
        //             {
        //                 var curSkillIndex = _.findIndex($scope.skillFilter, {RecordID: recId});
        //
        //                 if($scope.skillFilter.length > curSkillIndex + 1)
        //                 {
        //                     buildSummaryListByHr(day, 1, $scope.skillFilter[curSkillIndex+1].QueueName, $scope.skillFilter[curSkillIndex+1].RecordID, momentTz, function(err, resp)
        //                     {
        //                         callback(null, true);
        //                     });
        //                 }
        //                 else
        //                 {
        //                     callback(null, true);
        //                 }
        //
        //             }
        //
        //         }
        //         else
        //         {
        //             callback(null, false);
        //         }
        //
        //
        //     }, function (err) {
        //         loginService.isCheckResponse(err);
        //         callback(err, false);
        //     })
        // };

        var buildSummaryList = function (day, attribute, momentTz, summaryArrItem, callback) {
            cdrApiHandler.getCallSummaryForQueueHr(day, attribute, momentTz).then(function (sumResp) {
                if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result) {
                    if (!isEmpty(sumResp.Result)) {
                        var newSummary = sumResp.Result.map(function (sumr) {

                            if (typeof sumr.IvrAverage === "number") {
                                sumr.IvrAverage = convertToMMSS(sumr.IvrAverage);
                            }

                            if (typeof sumr.HoldAverage === "number") {
                                sumr.HoldAverage = convertToMMSS(sumr.HoldAverage);
                            }

                            if (typeof sumr.RingAverage === "number") {
                                sumr.RingAverage = convertToMMSS(sumr.RingAverage);
                            }

                            if (typeof sumr.TalkAverage === "number") {
                                sumr.TalkAverage = convertToMMSS(sumr.TalkAverage);
                            }

                            return sumr;
                        });

                        summaryArrItem.Data = newSummary;
                    }

                    callback(null, true);


                }
                else {
                    callback(null, true);
                }


            }, function (err) {
                loginService.isCheckResponse(err);
                callback(err, false);
            })
        };

        $scope.getCallSummaryByHr = function () {

            try
            {
                $scope.summaryArr = [];
                tempQueueArr = {};
                $scope.progressSumVal = 0;
                curCount = 0;

                var momentTz = moment.parseZone(new Date()).format('Z');
                //momentTz = momentTz.replace("+", "%2B");

                $scope.obj.isTableLoadingHr = 0;

                if($scope.skillFilter && $scope.skillFilter.length > 0)
                {
                    var skillArr = [];
                    for (var i=0; i<$scope.skillFilter.length; i++){
                        skillArr.push($scope.skillFilter[i].QueueName)
                    }

                    var skillString = skillArr.join(',');

                    buildSummaryListByHr($scope.obj.day, skillString, $scope.skillFilter[0].RecordID, momentTz, function (err, processDoneResp)
                    {
                        if(err)
                        {
                            $scope.showAlert('Queue wise summary', 'error', 'Error occurred');
                        }
                        $scope.summaryArr = tempQueueArr;
                        $scope.obj.isTableLoadingHr = 1;

                    });
                }
                else
                {
                    $scope.showAlert('Queue wise summary', 'error', 'No queues added');
                    $scope.obj.isTableLoadingHr = 1;
                }


            }
            catch (ex) {
                $scope.showAlert('Queue wise summary', 'error', 'Error occurred while loading call summary');
                $scope.obj.isTableLoadingHr = 1;
            }

        };

        $scope.getCallSummary = function () {

            try {
                $scope.summaryArr = [];

                var momentTz = moment.parseZone(new Date()).format('Z');
                momentTz = momentTz.replace("+", "%2B");

                $scope.obj.isTableLoadingHr = 0;

                $scope.skillFilter.forEach(function (skill) {
                    var arrayItem = {Skill: skill.Attribute, Data: []};
                    $scope.summaryArr.push(arrayItem);

                    buildSummaryList($scope.obj.day, skill.Attribute, momentTz, arrayItem, function (err, processDoneResp) {
                        $scope.obj.isTableLoadingHr = 1;

                    });
                });


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading call summary');
                $scope.obj.isTableLoadingHr = 1;
            }

        };

        $scope.getCallSummaryDownload = function () {

            try {
                $scope.summaryArr = [];

                var attribArray = $scope.skillFilter.map(function (item) {
                    return item.QueueName;
                });

                if ($scope.DownloadButtonName === 'CSV') {
                    $scope.cancelDownload = false;
                    $scope.buttonClass = 'fa fa-spinner fa-spin';
                }
                else {
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                }

                $scope.DownloadButtonName = 'PROCESSING...';


                var momentTz = moment.parseZone(new Date()).format('Z');
                //momentTz = momentTz.replace("+", "%2B");

                var skillString = attribArray.join(',');

                cdrApiHandler.getCallSummaryForQueueHrDownload($scope.obj.day, undefined, undefined, undefined, skillString, momentTz, 'csv',ShareData.BusinessUnit).then(function (sumResp) {
                    if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result) {
                        var downloadFilename = sumResp.Result;

                        checkFileReady(downloadFilename);

                    }
                    else {
                        $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                    }


                }, function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                });


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
            }

        };


    };
    app.controller("queueSummaryHourlyCtrl", queueSummaryHourlyCtrl);

}());


