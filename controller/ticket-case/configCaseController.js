/**
 * Created by Heshan.i on 10/19/2016.
 */

(function () {
    var app = angular.module('veeryConsoleApp');

    var configCaseController = function ($scope, $filter, $q, $uibModal, $stateParams, $state, ticketFlowService, ticketReportsService, caseApiAccess, loginService, triggerArdsServiceAccess, triggerTemplateServiceAccess) {

        $scope.title = $stateParams.title;
        $scope.caseInfo = JSON.parse($stateParams.caseInfo);
        $scope.statusMode = $scope.caseInfo.status !== "closed";

        $scope.showPaging = true;
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.totalTickets = $scope.caseInfo.related_tickets ? $scope.caseInfo.related_tickets.length : 0;
        $scope.pageTotal = $scope.totalTickets > 0 ? $scope.totalTickets / $scope.pageSize : 0;
        $scope.pageTotal = Math.ceil($scope.pageTotal);


        if ($scope.caseInfo.caseConfiguration) {
            $scope.ticketType = $scope.caseInfo.caseConfiguration.activeTicketTypes;
        }

        $scope.getPageData = function (page) {
            var start = ((page - 1) * $scope.pageSize);
            var end = (page * $scope.pageSize);
            var tIds = $scope.caseInfo.related_tickets.slice(start, end);

            caseApiAccess.getTicketsForCase(tIds).then(function (response) {
                $scope.CTickets = response.Result;
            }, function (err) {
            });
        };

        $scope.selectedTickets = {ids: []};
        $scope.selectedExsistingTickets = {ids: []};

        $scope.checkAll = function () {
            if ($scope.ticketList && $scope.ticketList.length > 0) {
                for (var i = 0; i < $scope.ticketList.length; i++) {
                    $scope.selectedTickets.ids.push($scope.ticketList[i]._id.toString());
                }
            }
        };
        $scope.uncheckAll = function () {
            $scope.selectedTickets.ids = [];
        };
        $scope.checkAllExsisting = function () {
            //if ($scope.caseInfo.related_tickets && $scope.caseInfo.related_tickets.length > 0) {
            //    for (var i = 0; i < $scope.caseInfo.related_tickets.length; i++) {
            //        $scope.selectedExsistingTickets.ids.push($scope.caseInfo.related_tickets[i]._id.toString());
            //    }
            //}
            $scope.selectedExsistingTickets.ids = $scope.caseInfo.related_tickets;
        };
        $scope.uncheckAllExsisting = function () {
            $scope.selectedExsistingTickets.ids = [];
        };

        $scope.backToList = function () {
            $state.go('console.case');
        };

        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.addNewTickets = false;

        $scope.addNewRelatedSlaMatrix = function () {
            if ($scope.addNewTickets === true) {
                $scope.addNewTickets = false;
            } else {
                $scope.addNewTickets = true;
            }
        };

        $scope.dtOptions = {paging: false, searching: false, info: false, order: [5, 'asc']};

        $scope.tagHeaders = "['Reference', 'Subject', 'Assignee', 'Submitter', 'Requester', 'Channel', 'Status', 'Priority', 'Type', 'SLA Violated']";

        $scope.moment = moment;

        $scope.pagination = {
            currentPage: 1,
            maxSize: 5,
            totalItems: 0,
            itemsPerPage: 10
        };

        $scope.recLimit = '10';


        $scope.obj = {
            startDay: moment().format("YYYY-MM-DD"),
            endDay: moment().format("YYYY-MM-DD")
        };

        $scope.ticketList = [];
        $scope.extUserList = [];

        $scope.tagList = [];

        $scope.pageChanged = function () {
            $scope.getTicketSummary();
        };

        $scope.searchWithNewFilter = function () {
            $scope.pagination.currentPage = 1;
            $scope.FilterData = null;
            $scope.getTicketSummary();
        };


        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        var getExternalUserList = function () {

            ticketReportsService.getExternalUsers().then(function (extUserList) {
                if (extUserList && extUserList.Result && extUserList.Result.length > 0) {
                    //$scope.extUserList.push.apply($scope.extUserList, extUserList.Result);

                    $scope.extUserList = extUserList.Result.map(function (obj) {
                        var rObj = {
                            UniqueId: obj._id,
                            Display: obj.firstname + ' ' + obj.lastname
                        };

                        return rObj;
                    });


                    /*$scope.extUserList.push({name: 'sukitha', age:'rrr'});
                     $scope.extUserList.push({name: 'ddd', age:'eee'});
                     $scope.extUserList.push({name: 'eeee', age:'rrrs'});*/
                    //$scope.extUserList = extUserList.Result;
                }


            }).catch(function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getUserList = function () {

            ticketReportsService.getUsers().then(function (userList) {
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
            });
        };


        var getTagList = function (callback) {
            $scope.tagList = [];
            var tagData = {};
            ticketReportsService.getTagList().then(function (tagList) {
                if (tagList && tagList.Result) {
                    tagData.AllTags = tagList.Result;

                }

                ticketReportsService.getCategoryList().then(function (categoryList) {
                    if (categoryList && categoryList.Result) {
                        tagData.TagCategories = categoryList.Result;
                    }

                    callback(tagData);


                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    callback(tagData);

                });


            }).catch(function (err) {
                loginService.isCheckResponse(err);
                callback(tagData);
            });
        };


        var populateToTagList = function () {
            $scope.tagList = [];
            getTagList(function (tagObj) {

                if (tagObj && tagObj.TagCategories) {
                    var newTagCategories = tagObj.TagCategories.map(function (obj) {
                        obj.TagType = 'CATEGORIES';
                        return obj;
                    });

                    $scope.tagList.push.apply($scope.tagList, newTagCategories);

                    console.log($scope.tagList);
                }

                if (tagObj && tagObj.AllTags) {
                    var newAllTags = tagObj.AllTags.map(function (obj) {
                        obj.TagType = 'TAGS';
                        return obj;
                    });

                    $scope.tagList.push.apply($scope.tagList, newAllTags);
                }


            })
        };


        populateToTagList();
        //getExternalUserList();
        getUserList();


        $scope.getTicketSummary = function () {
            $scope.obj.isTableLoading = 0;

            if (!$scope.FilterData) {
                var slaStatus = $scope.slaStatus ? ($scope.slaStatus === 'true') : null;
                var momentTz = moment.parseZone(new Date()).format('Z');
                momentTz = momentTz.replace("+", "%2B");

                var startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
                var tempEndDate = $scope.obj.endDay;

                var endDate = moment(tempEndDate).add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00' + momentTz;

                var tagName = null;

                if ($scope.selectedTag) {
                    tagName = $scope.selectedTag.name;
                }

                var limit = 0;

                if ($scope.recLimit === 'all') {
                    limit = 0;
                } else {
                    limit = parseInt($scope.recLimit);
                }


                $scope.pagination.itemsPerPage = limit;


                $scope.FilterData = {
                    sdate: startDate,
                    edate: endDate,
                    limitCount: limit,
                    skipCount: 0,
                    requester: $scope.selectedExtUser,
                    assignee: $scope.selectedAssignee,
                    submitter: $scope.selectedSubmitter,
                    tag: tagName,
                    channel: $scope.channelType,
                    priority: $scope.priorityType,
                    status: $scope.ticketStatus,
                    slaViolated: slaStatus

                }
            }
            else {
                $scope.FilterData.skipCount = ($scope.pagination.currentPage - 1) * $scope.FilterData.limitCount;
            }


            try {

                if ($scope.recLimit === 'all') {
                    ticketReportsService.getTicketDetailsCount($scope.FilterData).then(function (ticketCount) {
                        if (ticketCount && ticketCount.IsSuccess) {
                            $scope.pagination.totalItems = ticketCount.Result;
                        }

                        ticketReportsService.getTicketDetailsNoPaging($scope.FilterData).then(function (ticketDetailsResp) {
                            if (ticketDetailsResp && ticketDetailsResp.Result && ticketDetailsResp.Result.length > 0) {


                                $scope.ticketList = [];
                                for (var i = 0; i < ticketDetailsResp.Result.length; i++) {
                                    var ticket = ticketDetailsResp.Result[i];
                                    if ($scope.ticketType && $scope.ticketType.length > 0) {
                                        if ($scope.ticketType.indexOf(ticket.type) > -1) {
                                            $scope.ticketList.push(ticket);
                                        }
                                    } else {
                                        $scope.ticketList.push(ticket);
                                    }
                                }
                                $scope.obj.isTableLoading = 1;

                            }
                            else {
                                $scope.obj.isTableLoading = -1;
                                $scope.ticketList = [];
                            }


                        }).catch(function (err) {
                            loginService.isCheckResponse(err);
                            $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                            $scope.obj.isTableLoading = -1;
                            $scope.ticketList = [];
                        });


                    }).catch(function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                        $scope.obj.isTableLoading = -1;
                        $scope.ticketList = [];
                    });
                } else {
                    ticketReportsService.getTicketDetailsCount($scope.FilterData).then(function (ticketCount) {
                        if (ticketCount && ticketCount.IsSuccess) {
                            $scope.pagination.totalItems = ticketCount.Result;
                        }

                        ticketReportsService.getTicketDetails($scope.FilterData).then(function (ticketDetailsResp) {
                            if (ticketDetailsResp && ticketDetailsResp.Result && ticketDetailsResp.Result.length > 0) {
                                $scope.ticketList = [];
                                for (var i = 0; i < ticketDetailsResp.Result.length; i++) {
                                    var ticket = ticketDetailsResp.Result[i];
                                    if ($scope.ticketType && $scope.ticketType.length > 0) {
                                        if ($scope.ticketType.indexOf(ticket.type) > -1) {
                                            $scope.ticketList.push(ticket);
                                        }
                                    } else {
                                        $scope.ticketList.push(ticket);
                                    }
                                }
                                $scope.obj.isTableLoading = 1;

                            }
                            else {
                                $scope.obj.isTableLoading = -1;
                                $scope.ticketList = [];
                            }


                        }).catch(function (err) {
                            loginService.isCheckResponse(err);
                            $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                            $scope.obj.isTableLoading = -1;
                            $scope.ticketList = [];
                        });


                    }).catch(function (err) {
                        loginService.isCheckResponse(err);
                        $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                        $scope.obj.isTableLoading = -1;
                        $scope.ticketList = [];
                    });
                }


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading ticket summary');
                $scope.obj.isTableLoading = -1;
                $scope.ticketList = [];
            }

        };

        $scope.loadCase = function () {
            caseApiAccess.getCase($scope.caseInfo._id.toString()).then(function (response) {
                if (response.IsSuccess) {
                    $scope.caseInfo = response.Result;
                    $scope.getPageData($scope.currentPage);
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Case', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading case";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Case', errMsg, 'error');
            });
        };


        $scope.getPageData($scope.currentPage);

        $scope.addTicketToCase = function () {
            caseApiAccess.addTicketToCase($scope.caseInfo._id.toString(), $scope.selectedTickets.ids).then(function (response) {
                if (response.IsSuccess) {
                    //$scope.caseInfo = response.Result;
                    $scope.loadCase();
                    $scope.showAlert('Case', 'success', response.CustomMessage);
                    //$state.reload();
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Case', 'error', errMsg);
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while updating tickets";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Case', 'error', errMsg);
            });
        };

        $scope.removeTicketFromCase = function () {
            caseApiAccess.removeTicketFromCase($scope.caseInfo._id.toString(), $scope.selectedExsistingTickets.ids).then(function (response) {
                if (response.IsSuccess) {
                    //$scope.caseInfo = response.Result;
                    $scope.loadCase();
                    $scope.showAlert('Case', 'success', response.CustomMessage);
                    //$state.reload();
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Case', 'error', errMsg);
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while removing tickets";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Case', 'error', errMsg);
            });
        };


        $scope.BatchStatusChange =function(array, jobId){
            var index = 0;


            return new Promise(function(resolve, reject) {

                function next() {
                    $scope.uploadProgress = Math.ceil((index / array.length)*100);
                    if (index < array.length) {
                        var uploadStatus = index === array.length-1? 'done': 'uploading';
                        caseApiAccess.bulkStatusChangeTickets(array[index++], $scope.bulkAction, jobId, uploadStatus).then(next, reject);
                    } else {
                        resolve();
                    }
                }
                next();
            });
        };
        $scope.uploadProgress = 0;
        $scope.bulkStatusChangeTickets = function () {

            $scope.uploadProgress = 0;
            var ticketCount = $scope.selectedExsistingTickets.ids.length;
            var numOfIterations = Math.ceil(ticketCount / 1000);

            var ticketArray = [];

            for (var i = 0; i < numOfIterations; i++) {
                var start = i * 1000;
                var end = (i * 1000) + 1000;
                var numberChunk = $scope.selectedExsistingTickets.ids.slice(start, end);

                ticketArray.push(numberChunk);
            }

            caseApiAccess.getBulkOperationJobId($scope.bulkAction.action, $scope.caseInfo._id.toString()).then(function (response) {
                if (response) {
                    $scope.BatchStatusChange(ticketArray, response).then(function () {

                        console.log("Upload done ..................");
                        $scope.showAlert('Case', 'success', "Successfully Upload For Bulk Process");
                        $scope.uploadProgress = 0;
                    }, function (reason) {
                        $scope.showAlert('Case', 'error', "Tickets Update Failed.");
                    });
                } else {
                    $scope.showAlert('Case', 'error', "Get Bulk Operation Job Id Failed");
                }
            }, function (err) {
                $scope.showAlert('Case', 'error', "Get Bulk Operation Job Id Failed");
            });


            //caseApiAccess.bulkStatusChangeTickets($scope.selectedExsistingTickets.ids, $scope.bulkAction).then(function (response) {
            //    if (response.IsSuccess) {
            //        $scope.showAlert('Case', 'success', "Tickets Have Been Updated Successfully.");
            //        //$state.reload();
            //    }
            //    else {
            //        var errMsg = response.CustomMessage;
            //
            //        if (response.Exception) {
            //            errMsg = response.Exception.Message;
            //        }
            //        $scope.showAlert('Case', 'error', "Tickets Have Been Updated Error.");
            //    }
            //}, function (err) {
            //    loginService.isCheckResponse(err);
            //    var errMsg = "Error occurred while updating tickets";
            //    if (err.statusText) {
            //        errMsg = err.statusText;
            //    }
            //    $scope.showAlert('Case', 'error', "Tickets Have Been Updated Error.");
            //});
        };




        $scope.bulkActions = ['closed'];

        $scope.getFlowNodes = function () {
            if ($scope.ticketType && $scope.ticketType.length === 1) {
                ticketFlowService.getFlowNodes($scope.ticketType[0]).then(function (res) {
                    //var connections = [];
                    if (res.data.IsSuccess && res.status == '200') {
                        // var connection = [];
                        $scope.bulkActions = res.data.Result.map(function (item) {

                            return item.node.name

                        });
                    } else {
                        $scope.bulkActions = ['closed'];
                    }
                }, function (err) {
                    $scope.bulkActions = ['closed'];
                });
            } else {
                $scope.bulkActions = ['closed'];
            }
        };

        $scope.getFlowNodes();
        $scope.loadAttributes = function () {
            triggerArdsServiceAccess.getReqMetaData().then(function (response) {
                if (response.IsSuccess) {
                    $scope.attributes = [];
                    if (response.Result) {
                        var jResult = JSON.parse(response.Result);
                        if (jResult.AttributeMeta) {
                            for (var i = 0; i < jResult.AttributeMeta.length; i++) {
                                if (jResult.AttributeMeta[i].AttributeDetails) {
                                    for (var j = 0; j < jResult.AttributeMeta[i].AttributeDetails.length; j++) {

                                        $scope.attributes.push(jResult.AttributeMeta[i].AttributeDetails[j]);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Attributes', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading attributes";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Attributes', errMsg, 'error');
            });
        };

        $scope.loadTemplateInfo = function () {
            triggerTemplateServiceAccess.getTemplates().then(function (response) {
                if (response.IsSuccess) {
                    $scope.templates = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Template', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading templates";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Template', errMsg, 'error');
            });
        };


        $scope.loadTemplateInfo();
        $scope.loadAttributes();


        //-----------------specific Operation Modal-------------------------------
        $scope.bulkAction = {action: undefined, specificOperations: []};
        $scope.addOperation = function (operation) {
            $scope.bulkAction.specificOperations.push(operation);
        };

        $scope.removeOperation = function (operation) {
            var index = $scope.bulkAction.specificOperations.indexOf(operation);
            if (index != -1) {
                $scope.bulkAction.specificOperations.splice(index, 1);
            }
        };



        $scope.showModal = function () {
            //modal show
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/ticket-case/specificOperations.html',
                controller: 'spoModalController',
                size: 'sm',
                resolve: {
                    addOperation: function () {
                        return $scope.addOperation;
                    },
                    attributes: function () {
                        return $scope.attributes;
                    },
                    templates: function () {
                        return $scope.templates;
                    }
                }
            });
        };
    };

    app.controller('configCaseController', configCaseController);
}());

mainApp.controller("spoModalController", function ($scope, $uibModalInstance, addOperation, attributes, templates) {
    $scope.showModal = true;
    $scope.operation = {};
    $scope.attributes = attributes;
    $scope.templates = templates;

    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.addOperation = function () {
        $uibModalInstance.dismiss('cancel');
        addOperation($scope.operation);
    };

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    }
});