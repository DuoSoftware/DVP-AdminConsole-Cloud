/**
 * Created by Heshan.i on 9/14/2016.
 */

(function () {
    var app = angular.module('veeryConsoleApp');

    var slaConfigController = function ($scope, $state, $stateParams, $uibModal, slaApiAccess, triggerUserServiceAccess,
                                        triggerTemplateServiceAccess, triggerArdsServiceAccess, loginService,$q,ticketFlowService) {
        $scope.title = $stateParams.title;
        $scope.slaId = $stateParams.slaId;
        $scope.slaFilter = {};
        $scope.slaMatrix = {};
        $scope.filter = {};
        $scope.matrix = {};
        $scope.matrix.on_fail = [];
        $scope.matrix.target = 0;
        $scope.matrix.threshold = 0;
        $scope.matrix.on_threshold = [];
        $scope.filterTypeAny = "any";
        $scope.filterTypeAll = "all";
        $scope.users = [];
        $scope.userGroups = {};
        $scope.addNewMatrix = false;
        $scope.types=["question", "complain", "incident", "action"];

        $scope.ticketSchemaKeys = [
            "due_at",
            "active",
            "is_sub_ticket",
            "type",
            "subject",
            "reference",
            "description",
            "priority",
            "status",
            "assignee",
            "assignee_group",
            "requester",
            "channel",
            "tags",
            "SLAViolated"
        ];

        $scope.loadTicketTypes = function()
        {
            ticketFlowService.getAvailableTicketTypes().then(function (res) {
                //var connections = [];
                if (res.data.IsSuccess && res.status == '200') {
                    // var connection = [];
                    $scope.ticketSchema.type = {type: "String", enum: res.data.Result};
                }
            }, function (err) {
                console.log(err);
            });
        };

        $scope.loadTicketTypes();

        $scope.ticketSchema = {
            due_at: {type: "Date"},
            active: {type: "Boolean"},
            is_sub_ticket: {type: "Boolean"},
            type: {type: "String", enum: $scope.types},
            subject: {type: "String"},
            reference: {type: "String"},
            description: {type: "String"},
            priority: {type: "String", enum: ["urgent", "high", "normal", "low"]},
            status: {type: "String", enum: ["new", "open", "progressing", "parked", "solved", "closed"]},
            assignee: {type: "ObjectId", ref: "User"},
            assignee_group: {type: "ObjectId", ref: "UserGroup"},
            channel: {type: String},
            tags: [String],
            SLAViolated: Boolean
        };

        $scope.filterActionSchemaKeys = function (value) {
            if (value === "channel" || value === "tags" || value === "SLAViolated") {
                return false;
            } else {
                return true;
            }
        };

        $scope.showAlert = function (title, content, type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.backToList = function () {
            $state.go('console.sla');
        };

        $scope.addNewSlaMatrix = function () {
            if ($scope.addNewMatrix === true) {
                $scope.addNewMatrix = false;
            } else {
                $scope.addNewMatrix = true;
            }
        };
        //$scope.reloadPage = function () {
        //    $state.reload();
        //};

        //---------------ResetData-------------------------------
        $scope.updateValue = function () {
            $scope.triggerFilter.value = undefined;
        };

        $scope.OnChangeTriggerOperation = function () {
            $scope.triggerOperation.field = undefined;
            $scope.triggerOperation.value = undefined;
        };
        //---------------functions Initial Data-------------------
        $scope.loadFilterAll = function () {
            slaApiAccess.getFiltersAll($stateParams.slaId).then(function (response) {
                if (response.IsSuccess) {
                    $scope.filterAll = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('SLA Filter', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading filters";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('SLA Filter', errMsg, 'error');
            });
        };

        $scope.loadFilterAny = function () {
            slaApiAccess.getFiltersAny($stateParams.slaId).then(function (response) {
                if (response.IsSuccess) {
                    $scope.filterAny = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('SLA Filter', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading filters";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('SLA Filter', errMsg, 'error');
            });
        };

        $scope.loadSlaMatrices = function () {
            slaApiAccess.getMatrices($stateParams.slaId).then(function (response) {
                if (response.IsSuccess) {
                    $scope.slaMatrix = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('SLA Matrix', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading sla matrix";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('SLA Matrix', errMsg, 'error');
            });
        };

        $scope.loadUsers = function () {

            triggerUserServiceAccess.getUserCount().then(function (row_count) {
                var pagesize = 20;
                var pagecount = Math.ceil(row_count / pagesize);

                var method_list = [];

                for (var i = 1; i <= pagecount; i++) {
                    method_list.push(triggerUserServiceAccess.LoadUsersByPage(pagesize, i));
                }


                $q.all(method_list).then(function (resolveData) {
                    if (resolveData) {
                        resolveData.map(function (data) {
                            var Result= data.Result;
                            Result.map(function (item) {

                                item.Display = item.firstname+" "+item.lastname;

                                $scope.users.push(item);
                            });
                        });

                    }



                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = err;
                    $scope.showAlert('Users', errMsg, 'error');
                });



            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert("Load Users", "error", "Fail To Get User List.")
            });



/*

            triggerUserServiceAccess.getUsers().then(function (response) {
                if (response.IsSuccess) {
                    $scope.users = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Users', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Users', errMsg, 'error');
            });*/
        };

        $scope.loadUserGroups = function () {
            triggerUserServiceAccess.getUserGroups().then(function (response) {
                if (response.IsSuccess) {
                    $scope.userGroups = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('User Groups', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading user groups";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('User Groups', errMsg, 'error');
            });
        };

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

        //---------------updateCollections-----------------------
        $scope.removeDeletedMatrix = function (item) {

            var index = $scope.slaMatrix.indexOf(item);
            if (index != -1) {
                $scope.slaMatrix.splice(index, 1);
            }

        };

        $scope.removeDeletedFilter = function (item, itemType) {
            switch (itemType) {
                case "any":
                    var indexAny = $scope.filterAny.indexOf(item);
                    if (indexAny != -1) {
                        $scope.filterAny.splice(indexAny, 1);
                    }
                    break;
                case "all":
                    var indexAll = $scope.filterAll.indexOf(item);
                    if (indexAll != -1) {
                        $scope.filterAll.splice(indexAll, 1);
                    }
                    break;
                default :
                    break;
            }


        };

        //---------------insertNewData-----------------------------
        $scope.addSlaFilter = function () {
            console.log(JSON.stringify($scope.filter));

            if ($scope.filter.value === "TRUE") {
                $scope.filter.value = true;
            } else if ($scope.filter.value === "FALSE") {
                $scope.filter.value = false;
            }

            switch ($scope.filter.type) {
                case "any":
                    slaApiAccess.addFilterAny($scope.slaId, $scope.filter).then(function (response) {
                        if (response.IsSuccess) {
                            $scope.loadFilterAny();
                            $scope.showAlert('SLA Filter', response.CustomMessage, 'success');
                        }
                        else {
                            var errMsg = response.CustomMessage;

                            if (response.Exception) {
                                errMsg = response.Exception.Message;
                            }
                            $scope.showAlert('SLA Filter', errMsg, 'error');
                        }
                    }, function (err) {
                        loginService.isCheckResponse(err);
                        var errMsg = "Error occurred while saving sla filters";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('SLA Filter', errMsg, 'error');
                    });
                    break;
                case "all":
                    slaApiAccess.addFilterAll($scope.slaId, $scope.filter).then(function (response) {
                        if (response.IsSuccess) {
                            $scope.loadFilterAll();
                            $scope.showAlert('SLA Filter', response.CustomMessage, 'success');
                        }
                        else {
                            var errMsg = response.CustomMessage;

                            if (response.Exception) {
                                errMsg = response.Exception.Message;
                            }
                            $scope.showAlert('SLA Filter', errMsg, 'error');
                        }
                    }, function (err) {
                        loginService.isCheckResponse(err);
                        var errMsg = "Error occurred while saving sla filters";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('SLA Filter', errMsg, 'error');
                    });
                    break;
                default :
                    break;
            }
        };

        $scope.addSlaMatrix = function () {
            console.log(JSON.stringify($scope.matrix));
            if (!$scope.matrix.priority || !$scope.matrix.criteria) {
                $scope.showAlert('SLA Matrix', "Priority and criteria should be selected", 'error');
            } else if ($scope.matrix.threshold > $scope.matrix.target) {
                $scope.showAlert('SLA Matrix', "Threshold value should be less than the target value", 'error');
            } else {
                slaApiAccess.addMatrix($scope.slaId, $scope.matrix).then(function (response) {
                    if (response.IsSuccess) {
                        $scope.addNewSlaMatrix()
                        $scope.loadSlaMatrices();
                        $scope.showAlert('SLA Matrix', response.CustomMessage, 'success');
                        $scope.matrix = {};
                        $scope.matrix.on_fail = [];
                        $scope.matrix.target = 0;
                        $scope.matrix.threshold = 0;
                        $scope.matrix.on_threshold = [];
                    }
                    else {
                        var errMsg = response.CustomMessage;

                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert('SLA Matrix', errMsg, 'error');
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while saving sla Matrix";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('SLA Matrix', errMsg, 'error');
                });
            }
        };

        //---------------load initialData--------------------------
        $scope.loadFilterAll();
        $scope.loadFilterAny();
        $scope.loadSlaMatrices();
        $scope.loadUsers();
        $scope.loadUserGroups();
        $scope.loadTemplateInfo();
        $scope.loadAttributes();


        //-----------------matrix Modal-------------------------------

        $scope.addOperation = function (operationType, operation) {
            switch (operationType) {
                case "on_fail":
                    $scope.matrix.on_fail.push(operation);
                    break;
                case "on_threshold":
                    $scope.matrix.on_threshold.push(operation);
                    break;
                default :
                    break;
            }
        };

        $scope.removeOperation = function (operationType, operation) {
            switch (operationType) {
                case "on_fail":
                    var index_on_fail = $scope.matrix.on_fail.indexOf(operation);
                    if (index_on_fail != -1) {
                        $scope.matrix.on_fail.splice(index_on_fail, 1);
                    }
                    break;
                case "on_threshold":
                    var index_on_threshold = $scope.matrix.on_threshold.indexOf(operation);
                    if (index_on_threshold != -1) {
                        $scope.matrix.on_threshold.splice(index_on_threshold, 1);
                    }
                    break;
                default :
                    break;
            }
        };

        $scope.showModal = function (operationType) {
            //modal show
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/ticket-sla/matrixModal.html',
                controller: 'matrixModalController',
                size: 'sm',
                resolve: {
                    operationType: function () {
                        return operationType;
                    },
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

    app.controller('slaConfigController', slaConfigController);
}());

mainApp.controller("matrixModalController", function ($scope, $uibModalInstance, operationType, addOperation, attributes, templates) {
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
        addOperation(operationType, $scope.operation);
    };

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    }
});