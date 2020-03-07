/**
 * Created by dinusha on 5/28/2016.
 */

(function () {
    var app = angular.module("veeryConsoleApp");


    var cdrCampaignCtrl = function ($scope, $filter, $q, $sce, $timeout, $http, cdrApiHandler, campaignService, resourceService, sipUserApiHandler, ngAudio,
                            loginService, baseUrls,$anchorScroll,$auth,fileService, filterDateRangeValidation) {

        $anchorScroll();
        $scope.dtOptions = {paging: false, searching: false, info: false, order: [6, 'desc']};

        $scope.config = {
            preload: "auto",
            tracks: [
                {
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }
            ],
            theme: {
                url: "bower_components/videogular-themes-default/videogular.css"
            },
            "analytics": {
                "category": "Videogular",
                "label": "Main",
                "events": {
                    "ready": true,
                    "play": true,
                    "pause": true,
                    "stop": true,
                    "complete": true,
                    "progress": 10
                }
            }
        };

        $scope.moment = moment;


        $scope.enableSearchButton = true;

        $scope.campaignList = [];


        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.convertToMMSS = function (sec) {
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

        $scope.pagination = {
            currentPage: 1,
            maxSize: 5,
            totalItems: 0,
            itemsPerPage: 10
        };

        $scope.startTimeNow = '12:00 AM';
        $scope.endTimeNow = '12:00 AM';

        $scope.timeEnabled = 'Date Only';
        $scope.timeEnabledStatus = false;

        $scope.changeTimeAvailability = function () {
            if ($scope.timeEnabled === 'Date Only') {
                $scope.timeEnabled = 'Date & Time';
                $scope.timeEnabledStatus = true;
            }
            else {
                $scope.timeEnabled = 'Date Only';
                $scope.timeEnabledStatus = false;
            }
        };

        $scope.dateValid = function () {
            if ($scope.timeEnabled === 'Date Only') {
                $scope.timeEnabled = 'Date & Time';
                $scope.timeEnabledStatus = true;
            }
            else {
                $scope.timeEnabled = 'Date Only';
                $scope.timeEnabledStatus = false;
            }
        };

        var getCampaigns = function()
        {
            campaignService.GetCampaigns().then(function (campaignList) {
                if (campaignList && campaignList.length > 0) {
                    $scope.campaignList = campaignList;
                }


            }).catch(function (err) {
                loginService.isCheckResponse(err);
            });
        };

        getCampaigns();


        $scope.onDateChange = function () {
            if (moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid()) {
				$scope.dateValid = true;
			}
            else {
                $scope.dateValid = false;
            }
        };

        $scope.currentPlayingFile = null;

        $scope.hstep = 1;
        $scope.mstep = 15;

        var videogularAPI = null;


        $scope.SetDownloadPath = function (cdrInf) {
            var decodedToken = authService.getTokenDecode();

            if (decodedToken && decodedToken.company && decodedToken.tenant) {
                //$scope.DownloadFileUrl = baseUrls.fileServiceUrl + 'File/DownloadLatest/' + uuid + '.mp3?Authorization='+$auth.getToken();

                var fileType = '.mp3';
                if(cdrInf.ObjType === 'FAX_INBOUND')
                {
                    fileType = '.tif';
                }

                var saveAs = null;


                if(cdrInf.DVPCallDirection === 'inbound')
                {
                    if(cdrInf.SipFromUser)
                    {
                        saveAs = cdrInf.SipFromUser;
                    }

                    if(cdrInf.RecievedBy)
                    {
                        if(saveAs)
                        {
                            saveAs = saveAs + '-' + cdrInf.RecievedBy;
                        }
                        else
                        {
                            saveAs = cdrInf.RecievedBy;
                        }

                    }

                }
                else
                {
                    if(cdrInf.RecievedBy)
                    {
                        saveAs = cdrInf.RecievedBy;
                    }

                    if(cdrInf.SipFromUser)
                    {
                        if(saveAs)
                        {
                            saveAs = saveAs + '-' + cdrInf.SipFromUser;
                        }
                        else
                        {
                            saveAs = cdrInf.SipFromUser;
                        }
                    }
                }

                if(saveAs)
                {
                    saveAs = saveAs + '-' + cdrInf.CreatedTime;
                }
                else
                {
                    saveAs = cdrInf.CreatedTime;
                }

                fileService.downloadLatestFile(cdrInf.RecordingUuid + fileType, saveAs + fileType);

            }

        };

        $scope.onPlayerReady = function (API) {
            videogularAPI = API;

        };

        $scope.playStopFile = function (uuid) {
            if (videogularAPI)
            {
                if(videogularAPI.currentState === 'play')
                {
                    videogularAPI.stop();
                }
                var decodedToken = authService.getTokenDecode();

                if (decodedToken && decodedToken.company && decodedToken.tenant) {
                    var fileToPlay = baseUrls.fileServiceUrl + 'File/DownloadLatest/'+uuid+'.mp3';

                    $http({
                        method: 'GET',
                        url: fileToPlay,
                        responseType: 'blob'
                    }).then(function successCallback(response)
                    {
                        if(response.data)
                        {
                            var url = URL.createObjectURL(response.data);
                            var arr = [
                                {
                                    src: $sce.trustAsResourceUrl(url),
                                    type: 'audio/mp3'
                                }
                            ];

                            $scope.config.sources = arr;


                            videogularAPI.play();
                        }
                    }, function errorCallback(response) {

                        $scope.showAlert('CDR Player', 'error', 'Error occurred while playing file');

                    });


                }
            }


        };

        //set loagin option
        $scope.isTableLoading = 3;
        $scope.cdrList = [];
        $scope.userList = [];
        $scope.qList = [];


        $scope.searchCriteria = "";

        $scope.recLimit = "10";


        $scope.startDate = moment().format("YYYY-MM-DD");
        $scope.endDate = moment().format("YYYY-MM-DD");
        $scope.dateValid = true;

        $scope.offset = 0;

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';

        $scope.pageChanged = function () {
            var skipCount = ($scope.pagination.currentPage - 1) * parseInt($scope.recLimit);
            $scope.getProcessedCDR(skipCount, false);
        };

        $scope.searchWithNewFilter = function () {
            $scope.pagination.currentPage = 1;
            $scope.getProcessedCDR(0, true);
        };

        /*$scope.loadNextPage = function () {
            var pageInfo = {
                top: $scope.top,
                bottom: $scope.bottom
            };
            pageStack.push(pageInfo);
            $scope.getProcessedCDR(pageInfo.bottom, false);

        };

        $scope.loadPreviousPage = function () {
            var prevPage = pageStack.pop();

            $scope.getProcessedCDR(prevPage.bottom + 1, false);

        };*/

        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        var checkCSVGenerateAllowed = function () {
            try {
                var prevDay = moment().subtract(1, 'days');

                var isAllowed = prevDay.isBetween($scope.startDate, $scope.endDate) || prevDay.isBefore($scope.startDate) || prevDay.isBefore($scope.endDate);

                return !isAllowed;
            }
            catch (ex) {
                return false;
            }

        };

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

        $scope.$on("$destroy", function(){
            $scope.cancelDownload = true;
        });

        var checkFileReady = function (fileName) {
            console.log('METHOD CALL');
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

        $scope.downloadPress = function () {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };

        var getUserList = function () {

            $scope.userList = [];

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

                                $scope.userList.push(item);

                            });


                        });

                    }


                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while getting user list";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);


                });



            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while getting user list";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);



            });




           /* sipUserApiHandler.getSIPUsers().then(function (userList) {
                if (userList && userList.Result && userList.Result.length > 0) {
                    $scope.userList = userList.Result;
                }


            }).catch(function (err) {
                loginService.isCheckResponse(err);
            });*/
        };

        var getQueueList = function () {

            resourceService.getQueueSettings().then(function (qList) {
                if (qList && qList.length > 0) {
                    var tempQList = qList.filter(function(q)
                    {
                        return !!(q.ServerType === 'DIALER' && q.RequestType === 'CALL');
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

        getUserList();
        getQueueList();


        $scope.getProcessedCDRCSVDownload = function () {
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

            $scope.DownloadButtonName = 'PROCESSING';
            $scope.DownloadFileName = 'CAMPAIGNCDR_' + $scope.startDate + ' ' + $scope.startTimeNow + '_' + $scope.endDate + ' ' + $scope.endTimeNow;

            var deferred = $q.defer();

            var cdrListForCSV = [];

            var momentTz = moment.parseZone(new Date()).format('Z');
            //var encodedTz = encodeURI(momentTz);
            momentTz = momentTz.replace("+", "%2B");

            var st = moment($scope.startTimeNow, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTimeNow, ["h:mm A"]).format("HH:mm");

            var startDate = $scope.startDate + ' ' + st + ':00' + momentTz;
            var endDate = $scope.endDate + ' ' + et + ':59' + momentTz;

            if (!$scope.timeEnabledStatus) {
                startDate = $scope.startDate + ' 00:00:00' + momentTz;
                endDate = $scope.endDate + ' 23:59:59' + momentTz;
            }

            cdrApiHandler.prepareDownloadCampaignCDRByType(startDate, endDate, $scope.agentFilter, $scope.skillFilter, $scope.recFilter, $scope.custFilter, $scope.campaignFilter, 'csv', momentTz).then(function (cdrResp)
                //cdrApiHandler.getProcessedCDRByFilter(startDate, endDate, $scope.agentFilter, $scope.skillFilter, $scope.directionFilter, $scope.recFilter, $scope.custFilter).then(function (cdrResp)
            {
                if (!cdrResp.Exception && cdrResp.IsSuccess && cdrResp.Result) {
                    /*cdrResp.Result.forEach(function(cdr)
                     {

                     var cdrCsv =
                     {
                     DVPCallDirection: cdr.DVPCallDirection,
                     SipFromUser: cdr.SipFromUser,
                     SipToUser: cdr.SipToUser,
                     RecievedBy: cdr.RecievedBy,
                     AgentSkill: cdr.AgentSkill,
                     IsAnswered: cdr.IsAnswered,
                     CreatedTime: moment(cdr.CreatedTime).local().format("YYYY-MM-DD HH:mm:ss"),
                     Duration: convertToMMSS(cdr.Duration),
                     BillSec: convertToMMSS(cdr.BillSec),
                     AnswerSec: convertToMMSS(cdr.AnswerSec),
                     QueueSec: convertToMMSS(cdr.QueueSec),
                     HoldSec: convertToMMSS(cdr.HoldSec),
                     ObjType: cdr.ObjType,
                     ObjCategory: cdr.ObjCategory,
                     HangupParty: cdr.HangupParty,
                     TransferredParties: cdr.TransferredParties
                     };


                     cdrListForCSV.push(cdrCsv);
                     });*/

                    var downloadFilename = cdrResp.Result;

                    checkFileReady(downloadFilename);
                }
                else
                {
                    var errMsg = null;

                    if(cdrResp.Exception && cdrResp.Exception.Message)
                    {
                        errMsg = cdrResp.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr records');
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
                $scope.cancelDownload = true;
                $scope.buttonClass = 'fa fa-file-text';
            });

        };


        $scope.getProcessedCDRForCSV = function () {

            $scope.DownloadFileName = 'CAMPAIGNCDR_' + $scope.startDate + ' ' + $scope.startTimeNow + '_' + $scope.endDate + ' ' + $scope.endTimeNow;

            var deferred = $q.defer();

            var cdrListForCSV = [];

            try {

                var momentTz = moment.parseZone(new Date()).format('Z');
                //var encodedTz = encodeURI(momentTz);
                momentTz = momentTz.replace("+", "%2B");

                var st = moment($scope.startTimeNow, ["h:mm A"]).format("HH:mm");
                var et = moment($scope.endTimeNow, ["h:mm A"]).format("HH:mm");

                var startDate = $scope.startDate + ' ' + st + ':00' + momentTz;
                var endDate = $scope.endDate + ' ' + et + ':59' + momentTz;

                if (!$scope.timeEnabledStatus) {
                    startDate = $scope.startDate + ' 00:00:00' + momentTz;
                    endDate = $scope.endDate + ' 23:59:59' + momentTz;
                }


                cdrApiHandler.getCDRForTimeRange(startDate, endDate, 0, 0, $scope.agentFilter, $scope.skillFilter, $scope.directionFilter, $scope.recFilter, $scope.custFilter).then(function (cdrResp) {
                    if (!cdrResp.Exception && cdrResp.IsSuccess && cdrResp.Result) {
                        if (!isEmpty(cdrResp.Result)) {
                            var count = 0;
                            var cdrLen = Object.keys(cdrResp.Result).length;

                            for (cdr in cdrResp.Result) {
                                count++;
                                var cdrAppendObj = {};
                                var outLegProcessed = false;
                                var curCdr = cdrResp.Result[cdr];
                                var isInboundHTTAPI = false;
                                var outLegAnswered = false;

                                var callHangupDirectionA = '';
                                var callHangupDirectionB = '';

                                var len = curCdr.length;


                                //Need to filter out inbound and outbound legs before processing

                                var filteredInb = curCdr.filter(function (item) {
                                    if (item.Direction === 'inbound') {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }

                                });

                                var filteredOutb = curCdr.filter(function (item) {
                                    if (item.Direction === 'outbound') {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }

                                });


                                //process inbound legs first

                                for (i = 0; i < filteredInb.length; i++) {
                                    var curProcessingLeg = filteredInb[i];

                                    if (curProcessingLeg.DVPCallDirection) {
                                        callHangupDirectionA = curProcessingLeg.HangupDisposition;
                                    }


                                    cdrAppendObj.Uuid = curProcessingLeg.Uuid;
                                    cdrAppendObj.SipFromUser = curProcessingLeg.SipFromUser;
                                    cdrAppendObj.SipToUser = curProcessingLeg.SipToUser;
                                    cdrAppendObj.IsAnswered = false;

                                    cdrAppendObj.HangupCause = curProcessingLeg.HangupCause;

                                    var localTime = moment(curProcessingLeg.CreatedTime).local().format("YYYY-MM-DD HH:mm:ss");

                                    cdrAppendObj.CreatedTime = localTime;
                                    cdrAppendObj.Duration = curProcessingLeg.Duration;
                                    cdrAppendObj.BillSec = 0;
                                    cdrAppendObj.HoldSec = 0;

                                    cdrAppendObj.DVPCallDirection = curProcessingLeg.DVPCallDirection;

                                    if (cdrAppendObj.DVPCallDirection === 'inbound') {
                                        var holdSecTemp = curProcessingLeg.HoldSec + curProcessingLeg.WaitSec;
                                        cdrAppendObj.HoldSec = holdSecTemp;
                                    }


                                    cdrAppendObj.QueueSec = curProcessingLeg.QueueSec;
                                    cdrAppendObj.AgentSkill = curProcessingLeg.AgentSkill;


                                    cdrAppendObj.AnswerSec = curProcessingLeg.AnswerSec;


                                    if (curProcessingLeg.ObjType === 'HTTAPI') {
                                        isInboundHTTAPI = true;
                                    }

                                    if (len === 1) {
                                        cdrAppendObj.ObjType = curProcessingLeg.ObjType;
                                        cdrAppendObj.ObjCategory = curProcessingLeg.ObjCategory;
                                    }


                                }

                                //process outbound legs next

                                var transferredParties = '';

                                var transferCallOriginalCallLeg = null;

                                var transferLegB = filteredOutb.filter(function (item) {
                                    if ((item.ObjType === 'ATT_XFER_USER' || item.ObjType === 'ATT_XFER_GATEWAY') && !item.IsTransferredParty) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }

                                });

                                var actualTransferLegs = filteredOutb.filter(function (item) {
                                    if (item.IsTransferredParty) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }

                                });

                                if (transferLegB && transferLegB.length > 0) {
                                    transferCallOriginalCallLeg = transferLegB[0];
                                }


                                if (transferCallOriginalCallLeg) {
                                    cdrAppendObj.SipFromUser = transferCallOriginalCallLeg.SipFromUser;
                                    cdrAppendObj.RecievedBy = transferCallOriginalCallLeg.SipToUser;
                                    callHangupDirectionB = transferCallOriginalCallLeg.HangupDisposition;

                                    cdrAppendObj.AnswerSec = transferCallOriginalCallLeg.AnswerSec;

                                    cdrAppendObj.BillSec = transferCallOriginalCallLeg.BillSec;

                                    if (!cdrAppendObj.ObjType) {
                                        cdrAppendObj.ObjType = transferCallOriginalCallLeg.ObjType;
                                    }

                                    if (!cdrAppendObj.ObjCategory) {
                                        cdrAppendObj.ObjCategory = transferCallOriginalCallLeg.ObjCategory;
                                    }

                                    outLegProcessed = true;

                                    if (!outLegAnswered) {
                                        if (curProcessingLeg.BillSec > 0) {
                                            outLegAnswered = true;
                                        }
                                    }

                                    for (k = 0; k < actualTransferLegs.length; k++) {
                                        transferredParties = transferredParties + actualTransferLegs[k].SipToUser + ',';
                                    }
                                }
                                else {
                                    var connectedLegs = filteredOutb.filter(function (item) {
                                        if (item.IsAnswered) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }

                                    });

                                    var curProcessingLeg = null;

                                    if (connectedLegs && connectedLegs.length > 0) {
                                        curProcessingLeg = connectedLegs[0];

                                    }
                                    else {
                                        if (filteredOutb && filteredOutb.length > 0) {
                                            curProcessingLeg = filteredOutb[0];
                                        }

                                    }

                                    if (curProcessingLeg) {
                                        callHangupDirectionB = curProcessingLeg.HangupDisposition;

                                        cdrAppendObj.RecievedBy = curProcessingLeg.SipToUser;

                                        cdrAppendObj.AnswerSec = curProcessingLeg.AnswerSec;


                                        if (cdrAppendObj.DVPCallDirection === 'outbound') {
                                            var holdSecTemp = curProcessingLeg.HoldSec;
                                            cdrAppendObj.HoldSec = holdSecTemp;
                                        }

                                        cdrAppendObj.BillSec = curProcessingLeg.BillSec;

                                        if (!cdrAppendObj.ObjType) {
                                            cdrAppendObj.ObjType = curProcessingLeg.ObjType;
                                        }

                                        if (!cdrAppendObj.ObjCategory) {
                                            cdrAppendObj.ObjCategory = curProcessingLeg.ObjCategory;
                                        }

                                        outLegProcessed = true;

                                        if (!outLegAnswered) {
                                            if (curProcessingLeg.BillSec > 0) {
                                                outLegAnswered = true;
                                            }
                                        }
                                    }

                                }

                                if (callHangupDirectionA === 'recv_bye') {
                                    cdrAppendObj.HangupParty = 'CALLER';
                                }
                                else if (callHangupDirectionB === 'recv_bye') {
                                    cdrAppendObj.HangupParty = 'CALLEE';
                                }
                                else {
                                    cdrAppendObj.HangupParty = 'SYSTEM';
                                }


                                cdrAppendObj.IsAnswered = outLegAnswered;

                                if (outLegProcessed && cdrAppendObj.BillSec) {
                                    cdrAppendObj.ShowButton = true;
                                }

                                if (transferredParties) {
                                    transferredParties = transferredParties.slice(0, -1);
                                    cdrAppendObj.TransferredParties = transferredParties;
                                }

                                cdrAppendObj.BillSec = convertToMMSS(cdrAppendObj.BillSec);
                                cdrAppendObj.Duration = convertToMMSS(cdrAppendObj.Duration);
                                cdrAppendObj.AnswerSec = convertToMMSS(cdrAppendObj.AnswerSec);
                                cdrAppendObj.QueueSec = convertToMMSS(cdrAppendObj.QueueSec);
                                cdrAppendObj.HoldSec = convertToMMSS(cdrAppendObj.HoldSec);


                                var cdrCsv =
                                {
                                    DVPCallDirection: cdrAppendObj.DVPCallDirection,
                                    SipFromUser: cdrAppendObj.SipFromUser,
                                    SipToUser: cdrAppendObj.SipToUser,
                                    RecievedBy: cdrAppendObj.RecievedBy,
                                    AgentSkill: cdrAppendObj.AgentSkill,
                                    IsAnswered: cdrAppendObj.IsAnswered,
                                    CreatedTime: cdrAppendObj.CreatedTime,
                                    Duration: cdrAppendObj.Duration,
                                    BillSec: cdrAppendObj.BillSec,
                                    AnswerSec: cdrAppendObj.AnswerSec,
                                    QueueSec: cdrAppendObj.QueueSec,
                                    HoldSec: cdrAppendObj.HoldSec,
                                    ObjType: cdrAppendObj.ObjType,
                                    ObjCategory: cdrAppendObj.ObjCategory,
                                    HangupParty: cdrAppendObj.HangupParty,
                                    TransferredParties: cdrAppendObj.TransferredParties
                                };


                                cdrListForCSV.push(cdrCsv);
                            }


                        }
                        else {
                            $scope.showAlert('Info', 'info', 'No records to load');

                            if (pageStack.length > 0) {
                                $scope.isPreviousDisabled = false;
                                $scope.isNextDisabled = true;
                            }
                            $scope.isNextDisabled = true;
                            $scope.isTableLoading = 1;
                        }


                    }
                    else {
                        $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                        $scope.isTableLoading = 1;
                    }


                    deferred.resolve(cdrListForCSV);


                }, function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                    deferred.resolve(cdrListForCSV);
                })
            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list')
                deferred.resolve(cdrListForCSV);
            }

            return deferred.promise;
        };


        $scope.getProcessedCDR = function (offset)
        {
            $scope.enableSearchButton = false;

            try
            {
                var momentTz = moment.parseZone(new Date()).format('Z');
                //var encodedTz = encodeURI(momentTz);
                momentTz = momentTz.replace("+", "%2B");

                var st = moment($scope.startTimeNow, ["h:mm A"]).format("HH:mm");
                var et = moment($scope.endTimeNow, ["h:mm A"]).format("HH:mm");

                var startDate = $scope.startDate + ' ' + st + ':00' + momentTz;
                var endDate = $scope.endDate + ' ' + et + ':59' + momentTz;

                if (!$scope.timeEnabledStatus) {
                    startDate = $scope.startDate + ' 00:00:00' + momentTz;
                    endDate = $scope.endDate + ' 23:59:59' + momentTz;
                }


                var lim = parseInt($scope.recLimit);

                $scope.pagination.itemsPerPage = lim;
                $scope.isTableLoading = 0;

                cdrApiHandler.getCampaignCDRForTimeRangeCount(startDate, endDate, $scope.agentFilter, $scope.skillFilter, $scope.recFilter, $scope.custFilter, $scope.campaignFilter).then(function(cdrCntRsp)
                {
                    if (cdrCntRsp && cdrCntRsp.IsSuccess) {
                        $scope.pagination.totalItems = cdrCntRsp.Result;

                        cdrApiHandler.getCampaignCDRForTimeRange(startDate, endDate, lim, offset, $scope.agentFilter, $scope.skillFilter, $scope.recFilter, $scope.custFilter, $scope.campaignFilter).then(function (cdrResp) {
                            if (!cdrResp.Exception && cdrResp.IsSuccess && cdrResp.Result) {
                                if (!isEmpty(cdrResp.Result)) {

                                    $scope.cdrList = cdrResp.Result;

                                    /*var count = 0;

                                    for (cdr in cdrResp.Result)
                                    {
                                        count++;
                                        var cdrAppendObj = {};
                                        var curCdr = cdrResp.Result[cdr];

                                        var callHangupDirectionA = '';
                                        var callHangupDirectionB = '';
                                        var isOutboundTransferCall = false;
                                        var holdSecTemp = 0;

                                        var len = curCdr.length;

                                        var callCategory = '';

                                        var firstLegAnswered = false;


                                        //Need to filter out inbound and outbound legs before processing

                                        var firstLeg = curCdr.find(function (item) {
                                            if (item.ObjCategory === 'DIALER') {
                                                return true;
                                            }
                                            else {
                                                return false;
                                            }

                                        });

                                        if(firstLeg)
                                        {
                                            //Process First Leg
                                            callCategory = firstLeg.ObjCategory;
                                            callHangupDirectionA = firstLeg.HangupDisposition;



                                            if(firstLeg.ObjType === 'ATT_XFER_USER' || firstLeg.ObjType === 'ATT_XFER_GATEWAY')
                                            {
                                                isOutboundTransferCall = true;
                                            }


                                            //use the counts in inbound leg


                                            cdrAppendObj.Uuid = firstLeg.Uuid;
                                            cdrAppendObj.SipFromUser = firstLeg.SipFromUser;
                                            cdrAppendObj.SipToUser = firstLeg.SipToUser;
                                            cdrAppendObj.RecievedBy = firstLeg.SipToUser;
                                            cdrAppendObj.IsAnswered = false;
                                            cdrAppendObj.HangupCause = firstLeg.HangupCause;
                                            cdrAppendObj.CampaignName = firstLeg.CampaignName;
                                            cdrAppendObj.AgentSkill = firstLeg.AgentSkill;

                                            cdrAppendObj.CreatedTime = moment(firstLeg.CreatedTime).local().format("YYYY-MM-DD HH:mm:ss");
                                            cdrAppendObj.Duration = firstLeg.Duration;
                                            cdrAppendObj.BillSec = 0;
                                            cdrAppendObj.HoldSec = 0;
                                            cdrAppendObj.QueueSec = 0;
                                            cdrAppendObj.AnswerSec = 0;

                                            if(firstLeg.ObjType === 'BLAST' || firstLeg.ObjType === 'DIRECT' || firstLeg.ObjType === 'IVRCALLBACK')
                                            {
                                                cdrAppendObj.BillSec = firstLeg.BillSec;
                                                cdrAppendObj.AnswerSec = firstLeg.AnswerSec;
                                                callHangupDirectionB = firstLeg.HangupDisposition;
                                                cdrAppendObj.IsAnswered = firstLeg.IsAnswered;
                                            }

                                            if(firstLeg.QueueSec)
                                            {
                                                cdrAppendObj.QueueSec = firstLeg.QueueSec;
                                            }

                                            cdrAppendObj.DVPCallDirection = 'outbound';


                                            holdSecTemp = holdSecTemp + firstLeg.HoldSec;


                                            cdrAppendObj.ObjType = firstLeg.ObjType;
                                            cdrAppendObj.ObjCategory = firstLeg.ObjCategory;
                                        }

                                        //process other legs

                                        var otherLegs = curCdr.filter(function (item) {
                                            if (item.ObjCategory !== 'DIALER') {
                                                return true;
                                            }
                                            else {
                                                return false;
                                            }

                                        });

                                        if(otherLegs && otherLegs.length > 0)
                                        {
                                            var customerLeg = otherLegs.find(function (item) {
                                                if (item.ObjType === 'CUSTOMER') {
                                                    return true;
                                                }
                                                else {
                                                    return false;
                                                }

                                            });

                                            var agentLeg = otherLegs.find(function (item) {
                                                if (item.ObjType === 'AGENT' || item.ObjType === 'PRIVATE_USER') {
                                                    return true;
                                                }
                                                else {
                                                    return false;
                                                }

                                            });

                                            if(customerLeg)
                                            {
                                                cdrAppendObj.BillSec = customerLeg.BillSec;
                                                cdrAppendObj.AnswerSec = customerLeg.AnswerSec;

                                                holdSecTemp = holdSecTemp + customerLeg.HoldSec;

                                                callHangupDirectionB = customerLeg.HangupDisposition;

                                                cdrAppendObj.IsAnswered = customerLeg.IsAnswered;
                                                cdrAppendObj.RecordingUuid = customerLeg.Uuid;

                                            }

                                            if(agentLeg)
                                            {
                                                holdSecTemp = holdSecTemp + agentLeg.HoldSec;
                                                callHangupDirectionB = agentLeg.HangupDisposition;
                                                cdrAppendObj.RecievedBy = agentLeg.SipToUser;
                                            }

                                        }

                                        cdrAppendObj.HoldSec = holdSecTemp;


                                        if (callHangupDirectionA === 'recv_bye') {
                                            cdrAppendObj.HangupParty = 'CALLER';
                                        }
                                        else if (callHangupDirectionB === 'recv_bye') {
                                            cdrAppendObj.HangupParty = 'CALLEE';
                                        }
                                        else {
                                            cdrAppendObj.HangupParty = 'SYSTEM';
                                        }


                                        if (cdrAppendObj.BillSec) {
                                            cdrAppendObj.ShowButton = true;
                                        }

                                        /!*if (transferredParties) {
                                            transferredParties = transferredParties.slice(0, -1);
                                            cdrAppendObj.TransferredParties = transferredParties;
                                        }*!/

                                        /!*if(cdrAppendObj.ObjType === 'FAX_INBOUND')
                                        {
                                            cdrAppendObj.IsAnswered = inLegAnswered;

                                            if(inLegAnswered)
                                            {
                                                cdrAppendObj.ShowButton = true;
                                            }
                                        }*!/

                                        if(!cdrAppendObj.IsAnswered)
                                        {
                                            cdrAppendObj.AnswerSec = cdrAppendObj.Duration;
                                        }


                                        cdrAppendObj.BillSec = convertToMMSS(cdrAppendObj.BillSec);
                                        cdrAppendObj.Duration = convertToMMSS(cdrAppendObj.Duration);
                                        cdrAppendObj.AnswerSec = convertToMMSS(cdrAppendObj.AnswerSec);
                                        cdrAppendObj.QueueSec = convertToMMSS(cdrAppendObj.QueueSec);
                                        cdrAppendObj.HoldSec = convertToMMSS(cdrAppendObj.HoldSec);


                                        $scope.cdrList.push(cdrAppendObj);
                                    }*/
                                    $scope.isTableLoading = 1;


                                }
                                else
                                {
                                    $scope.showAlert('Info', 'info', 'No CDR Records to load');
                                    $scope.cdrList = [];
                                    $scope.isTableLoading = 1;
                                }


                            }
                            else {
                                $scope.cdrList = [];
                                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                                $scope.isTableLoading = 1;
                            }

                            $scope.enableSearchButton = true;


                        }, function (err) {
                            loginService.isCheckResponse(err);
                            $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                            $scope.isTableLoading = 1;
                            $scope.enableSearchButton = true;
                            $scope.cdrList = [];
                        })
                    }
                    else
                    {
                        $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                        $scope.isTableLoading = 1;
                        $scope.cdrList = [];
                    }



                }).catch(function(err)
                {
                    $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                    $scope.isTableLoading = 1;
                    $scope.cdrList = [];
                });

            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                $scope.isTableLoading = 1;
                $scope.cdrList = [];
            }
        }


    };
    app.controller("cdrCampaignCtrl", cdrCampaignCtrl);

}());


