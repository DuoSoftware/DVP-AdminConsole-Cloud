/**
 * Created by dinusha on 9/6/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var auditTrailReportCtrl = function ($scope, $filter, $q, $uibModal, ObjectDiff, companyConfigBackendService, ticketReportsService, loginService, $anchorScroll) {
        $anchorScroll();
        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.obj = {
            startDay: moment().format("YYYY-MM-DD"),
            endDay: moment().format("YYYY-MM-DD"),
            startTime: '12:00 AM',
            endTime: '12:00 AM',
            application: null,
            property: null,
            author: null
        };

        $scope.timeEnabled = 'Date & Time';
        $scope.timeEnabledStatus = false;

        $scope.changeTimeAvailability = function () {
            if ($scope.timeEnabled === 'Date & Time') {
                $scope.timeEnabled = 'Date Only';
                $scope.timeEnabledStatus = true;
            }
            else {
                $scope.timeEnabled = 'Date & Time';
                $scope.timeEnabledStatus = false;
            }
        };

        $scope.dateValid = function () {
            if ($scope.timeEnabled === 'Date & Time') {
                $scope.timeEnabled = 'Date Only';
                $scope.timeEnabledStatus = true;
            }
            else {
                $scope.timeEnabled = 'Date & Time';
                $scope.timeEnabledStatus = false;
            }
        };

        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};

        $scope.tagOrder = ['reference', 'subject', 'phoneNumber', 'email', 'ssn', 'firstname', 'lastname', 'address', 'fromNumber', 'createdDate', 'assignee', 'submitter', 'requester', 'channel', 'status', 'priority', 'type', 'slaViolated'];

        $scope.tagHeaders = ['Reference', 'Subject', 'Phone Number', 'Email', 'SSN', 'First Name', 'Last Name', 'Address', 'From Number', 'Created Date', 'Assignee', 'Submitter', 'Requester', 'Channel', 'Status', 'Priority', 'Type', 'SLA Violated'];

        $scope.moment = moment;

        $scope.pagination = {
            currentPage: 1,
            maxSize: 5,
            totalItems: 0,
            itemsPerPage: 10
        };

        $scope.recLimit = '10';

        $scope.auditList = [];
        $scope.userList = [];

        $scope.pageChanged = function () {
            $scope.getAuditTrails();
        };

        $scope.searchWithNewFilter = function () {
            $scope.pagination.currentPage = 1;
            $scope.getAuditTrails();
        };


        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        $scope.closeModal = function () {
            $scope.modalInstanceDiff.close();
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

                                var rObj = {
                                    UniqueId: item._id,
                                    Display: item.name
                                };

                                $scope.userList.push(rObj);
                            });
                        });

                    }

                    /* $scope.userList = userList.Result.map(function (obj) {
                         var rObj = {
                             UniqueId: obj._id,
                             Display: obj.name
                         };

                         return rObj;
                     });*/

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    //$scope.showAlert("Loading Agent details", "error", "Error In Loading Agent Details");
                });



            }, function (err) {
                loginService.isCheckResponse(err);
                // $scope.showAlert("Load Users", "error", "Fail To Get User List.")
            });

            /*ticketReportsService.getUsers().then(function (userList) {
                if (userList && userList.Result && userList.Result.length > 0) {
                    //$scope.userList = userList.Result;

                    $scope.userList = userList.Result.map(function (obj) {
                        var rObj = {
                            UniqueId: obj._id,
                            Display: obj.name
                        };

                        return rObj;
                    });
                }


            }).catch(function (err) {
                loginService.isCheckResponse(err);
            });*/
        };

        getUserList();

        $scope.openDiffViewer = function (oldValue, newValue) {
            //modal show
            var diffViewerOldTemp = null;

            var diffViewerNewTemp = null;

            try {
                diffViewerOldTemp = JSON.parse(oldValue);
            }
            catch (ex) {
                diffViewerOldTemp = [oldValue];
            }

            try {
                diffViewerNewTemp = JSON.parse(newValue);
            }
            catch (ex) {
                diffViewerNewTemp = [newValue];
            }

            $scope.oldValueJsonView = ObjectDiff.objToJsonView(diffViewerOldTemp);

            $scope.newValueJsonView = ObjectDiff.objToJsonView(diffViewerNewTemp);

            var diff = ObjectDiff.diffOwnProperties(diffViewerOldTemp, diffViewerNewTemp);

            $scope.diffValue = ObjectDiff.toJsonView(diff);

            $scope.modalInstanceDiff = $uibModal.open({
                animation: true,
                templateUrl: 'views/auditTrail/diffViewer.html',
                size: 'lg',
                scope: $scope
            });
        };


        $scope.getAuditTrails = function () {
            $scope.obj.isTableLoading = 0;

            var momentTz = moment.parseZone(new Date()).format('Z');
            //var encodedTz = encodeURI(momentTz);
            momentTz = momentTz.replace("+", "%2B");

            var st = moment($scope.obj.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.obj.endTime, ["h:mm A"]).format("HH:mm");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            if (!$scope.timeEnabledStatus) {
                startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
                endDate = $scope.obj.endDay + ' 23:59:59' + momentTz;
            }

            var limit = parseInt($scope.recLimit);

            $scope.pagination.itemsPerPage = limit;


            try {

                companyConfigBackendService.getAuditTrailsCount(startDate, endDate, $scope.obj.application, $scope.obj.property, $scope.obj.author).then(function (auditCount) {
                    if (auditCount && auditCount.IsSuccess) {
                        $scope.pagination.totalItems = auditCount.Result;
                    }

                    companyConfigBackendService.getAuditTrails(startDate, endDate, $scope.obj.application, $scope.obj.property, $scope.obj.author, $scope.pagination.itemsPerPage, $scope.pagination.currentPage).then(function (auditTrailsResp) {
                        if (auditTrailsResp && auditTrailsResp.Result && auditTrailsResp.Result.length > 0) {

                            $scope.auditList = auditTrailsResp.Result;
                            $scope.obj.isTableLoading = 1;

                        }
                        else {
                            $scope.obj.isTableLoading = -1;
                            $scope.auditList = [];
                        }


                    }).catch(function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                        $scope.obj.isTableLoading = -1;
                        $scope.auditList = [];
                    });


                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                    $scope.obj.isTableLoading = -1;
                    $scope.auditList = [];
                });


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                $scope.obj.isTableLoading = -1;
                $scope.auditList = [];
            }

        };

        $scope.getTicketSummaryCSV = function () {
            $scope.tagHeaders = ['Reference', 'Subject', 'Phone Number', 'Email', 'SSN', 'First Name', 'Last Name', 'Address', 'From Number', 'Created Date', 'Assignee', 'Submitter', 'Requester', 'Channel', 'Status', 'Priority', 'Type', 'SLA Violated'];
            $scope.tagOrder = ['reference', 'subject', 'phoneNumber', 'email', 'ssn', 'firstname', 'lastname', 'address', 'fromNumber', 'createdDate', 'assignee', 'submitter', 'requester', 'channel', 'status', 'priority', 'type', 'slaViolated'];

            if (!$scope.tagCount) {
                $scope.tagCount = 0;
            }

            if ($scope.tagCount) {
                for (j = 0; j < $scope.tagCount; j++) {
                    $scope.tagHeaders.push('Tag' + (j + 1));
                    $scope.tagOrder.push('Tag' + (j + 1));
                }
            }


            $scope.DownloadFileName = 'TICKET_' + $scope.obj.startDay + '_' + $scope.obj.endDay;

            var deferred = $q.defer();

            var ticketListForCSV = [];

            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
            var tempEndDate = $scope.obj.endDay;

            var endDate = moment(tempEndDate).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00' + momentTz;

            var tagName = null;

            if ($scope.selectedTag) {
                tagName = $scope.selectedTag.name;
            }

            $scope.FilterData = {
                sdate: startDate,
                edate: endDate,
                requester: $scope.selectedExtUser,
                assignee: $scope.selectedAssignee,
                submitter: $scope.selectedSubmitter,
                tag: tagName,
                channel: $scope.channelType,
                priority: $scope.priorityType,
                type: $scope.ticketType,
                status: $scope.ticketStatus,
                slaViolated: $scope.slaStatus

            };


            try {

                ticketReportsService.getTicketDetailsNoPaging($scope.FilterData).then(function (ticketDetailsResp) {
                    if (ticketDetailsResp && ticketDetailsResp.Result && ticketDetailsResp.Result.length > 0) {

                        ticketDetailsResp.Result.forEach(function (ticketInfo) {
                            var ticketInfoTemp =
                                {
                                    reference: ticketInfo.reference,
                                    subject: ticketInfo.subject,
                                    phoneNumber: (ticketInfo.requester ? ticketInfo.requester.phone : ''),
                                    email: (ticketInfo.requester ? ticketInfo.requester.email : ''),
                                    ssn: (ticketInfo.requester ? ticketInfo.requester.ssn : ''),
                                    firstname: (ticketInfo.requester ? ticketInfo.requester.firstname : ''),
                                    lastname: (ticketInfo.requester ? ticketInfo.requester.lastname : ''),
                                    address: '',
                                    fromNumber: (ticketInfo.engagement_session ? ticketInfo.engagement_session.channel_from : ''),
                                    createdDate: moment(ticketInfo.created_at).local().format("YYYY-MM-DD HH:mm:ss"),
                                    assignee: (ticketInfo.assignee ? ticketInfo.assignee.name : ''),
                                    submitter: (ticketInfo.submitter ? ticketInfo.submitter.name : ''),
                                    requester: (ticketInfo.requester ? ticketInfo.requester.name : ''),
                                    channel: ticketInfo.channel,
                                    status: ticketInfo.status,
                                    priority: ticketInfo.priority,
                                    type: ticketInfo.type,
                                    slaViolated: (ticketInfo.ticket_matrix ? ticketInfo.ticket_matrix.sla_violated : false)

                                };

                            if (ticketInfo.requester && ticketInfo.requester.address) {
                                if (ticketInfo.requester.address.number) {
                                    ticketInfoTemp.address = ticketInfoTemp.address + ticketInfo.requester.address.number + ', '
                                }
                                if (ticketInfo.requester.address.street) {
                                    ticketInfoTemp.address = ticketInfoTemp.address + ticketInfo.requester.address.street + ', '
                                }
                                if (ticketInfo.requester.address.city) {
                                    ticketInfoTemp.address = ticketInfoTemp.address + ticketInfo.requester.address.city + ', '
                                }
                                if (ticketInfo.requester.address.province) {
                                    ticketInfoTemp.address = ticketInfoTemp.address + ticketInfo.requester.address.province + ', '
                                }
                                if (ticketInfo.requester.address.country) {
                                    ticketInfoTemp.address = ticketInfoTemp.address + ticketInfo.requester.address.country + ', '
                                }
                            }


                            if (ticketInfo.isolated_tags) {
                                for (i = 0; i < ticketInfo.isolated_tags.length; i++) {
                                    if (i >= $scope.tagCount) {
                                        break;
                                    }
                                    var tagName = 'Tag' + (i + 1);
                                    ticketInfoTemp[tagName] = ticketInfo.isolated_tags[i];
                                }
                            }

                            if (ticketInfo.form_submission && ticketInfo.form_submission.fields) {
                                ticketInfo.form_submission.fields.forEach(function (field) {
                                    if (field.field) {
                                        var tempFieldName = 'DYNAMICFORM_' + field.field;
                                        if ($scope.tagHeaders.indexOf(tempFieldName) < 0) {
                                            $scope.tagHeaders.push(tempFieldName);
                                            $scope.tagOrder.push(tempFieldName);

                                        }

                                        ticketInfoTemp[tempFieldName] = field.value;

                                    }
                                })
                            }

                            ticketListForCSV.push(ticketInfoTemp);

                        });

                        deferred.resolve(ticketListForCSV);


                    }
                    else {
                        deferred.resolve(ticketListForCSV);
                    }


                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                    deferred.resolve(ticketListForCSV);
                });


            }
            catch (ex) {

                $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                deferred.resolve(ticketListForCSV);
            }

            return deferred.promise;

        };


    };
    app.controller("auditTrailReportCtrl", auditTrailReportCtrl);

}());


