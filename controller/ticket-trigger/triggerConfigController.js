/**
 * Created by Heshan.i on 8/16/2016.
 */
(function () {
    var app = angular.module('veeryConsoleApp');

    var triggerConfigController = function ($scope, $state, $stateParams, triggerApiAccess,
                                            loginService,
                                            triggerUserServiceAccess, triggerTemplateServiceAccess,
                                            triggerArdsServiceAccess,companyConfigBackendService,$anchorScroll,$q) {
        $anchorScroll();
        $scope.title = $stateParams.title;
        $scope.triggerId = $stateParams.triggerId;
        $scope.triggerAction = {};
        $scope.triggerFilter = {};
        $scope.triggerOperation = {};
        $scope.filterTypeAny = "any";
        $scope.filterTypeAll = "all";
        $scope.triggerAction.value = "";
        $scope.users = {};
        $scope.userGroups = {};

        $scope.addOperationsActive = true;

        /*$scope.ticketSchemaKeys = [
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
         "channel",
         "tags",
         "SLAViolated"
         ];*/
        $scope.ticketSchemaKeys = [];
        /*$scope.ticketSchema = {
         due_at: {type: "Date"},
         active: {type: "Boolean"},
         is_sub_ticket: {type: "Boolean"},
         type: {type: "String", enum : ["question","complain","incident","action"]},
         subject: { type: "String"},
         reference: { type: "String"},
         description: { type: "String"},
         priority: {type: "String", enum : ["urgent","high","normal","low"]},
         status: {type: "String", enum : ["new","open","progressing","parked","solved","closed"]},
         assignee: {type: "ObjectId",ref: "User"},
         assignee_group: {type: "ObjectId",ref: "UserGroup"},
         channel: {type: String},
         tags: [String],
         SLAViolated: Boolean
         };*/
        $scope.ticketSchema = {};
        $scope.ticketSchemaStatus = [];

        $scope.getInitialConfigData = function () {
            triggerApiAccess.GetInitialConfigData().then(function (response) {
                if (response) {
                    if(response[0]&&response[0].data&&response[0].data.IsSuccess&&response[0].data.Result){
                        $scope.ticketSchemaStatus = response[0].data.Result.map(function (item) {
                            return item.status_node;
                        })
                    }
                    if(response[1]&&response[1].data&&response[1].data.IsSuccess&&response[1].data.Result){
                        if(response[1].data.Result.custom_types){
                            response[1].data.Result.custom_types.map(function (item) {
                                $scope.ticketTypes.push(item);
                            })
                        }
                        if(response[1].data.Result.default_types){
                            response[1].data.Result.default_types.map(function (item) {
                                $scope.ticketTypes.push(item);
                            })
                        }
                    }

                    if (response[2]&&response[2].data&&response[2].data.IsSuccess&&response[2].data.Result) {
                        angular.forEach(response[2].data.Result, function (item) {
                            if (!(item.field === 'company' || item.field === 'tenant' || item.field === '__v' || item.field === '_id'|| item.field === 'custom_fields'|| item.field === 'form_submission'|| item.field === 'sla'|| item.field === 'comments'|| item.field === 'events'|| item.field === 'ticket_matrix'|| item.field === 'slot_attachment')) {
                                $scope.ticketSchemaKeys.push(item.field);
                                $scope.ticketSchema[item.field] = item.type == "Select" ? ({
                                        type: "String",
                                        enum: item.values
                                    }) :(item.field == "status" ?({type: "String", enum : $scope.ticketSchemaStatus}):(item.field == "type"?({type: "String", enum : $scope.ticketTypes}):({type: item.type}))) ;// ({type: item.type})) ;
                            }
                        });
                    }

                }

            }, function (error) {
                $scope.showError("Error", "Error", "ok", "There is an error Loading Schemas.");
            });

        };
        $scope.getInitialConfigData();

        $scope.getTicketStatusNodes = function () {
            triggerApiAccess.TicketStatusNodes().then(function (response) {
                if (response) {
                    $scope.ticketSchemaStatus = response.map(function (item) {
                       return item.status_node;
                    })
                }
                //$scope.getDynamicTicketTypes();

            }, function (error) {
                $scope.showError("Error", "Error", "ok", "There is an error Loading Schemas.");
            });

        };
        $scope.getTicketStatusNodes();

        $scope.ticketTypes = [];
        $scope.getDynamicTicketTypes = function () {
            companyConfigBackendService.getTicketTypes().then(function (response) {
                if (response.IsSuccess) {
                    if(response.Result){
                        if(response.Result.custom_types){
                            response.Result.custom_types.map(function (item) {
                                $scope.ticketTypes.push(item);
                            })
                        }
                        if(response.Result.default_types){
                            response.Result.default_types.map(function (item) {
                                $scope.ticketTypes.push(item);
                            })
                        }
                    }

                }
                else {
                    $scope.showAlert('Dynamic Ticket Types', "Error occurred while saving ticket type", 'error');
                }
                //$scope.getTicketSchema();
            }, function (err) {
                $scope.showAlert('Dynamic Ticket Types', "Error occurred while saving ticket type", 'error');
            });
        };

        $scope.getTicketSchema = function () {
            triggerApiAccess.TicketSchema().then(function (response) {
                if (response) {
                    angular.forEach(response, function (item) {
                        if (!(item.field === 'company' || item.field === 'tenant' || item.field === '__v' || item.field === '_id'|| item.field === 'custom_fields'|| item.field === 'form_submission'|| item.field === 'sla'|| item.field === 'comments'|| item.field === 'events'|| item.field === 'ticket_matrix'|| item.field === 'slot_attachment')) {
                            $scope.ticketSchemaKeys.push(item.field);
                            $scope.ticketSchema[item.field] = item.type == "Select" ? ({
                                    type: "String",
                                    enum: item.values
                                }) :(item.field == "status" ?({type: "String", enum : $scope.ticketSchemaStatus}):(item.field == "type"?({type: "String", enum : $scope.ticketTypes}):({type: item.type}))) ;// ({type: item.type})) ;
                        }
                    });
                }
            }, function (error) {
                $scope.showError("Error", "Error", "ok", "There is an error ");
            });

        };



        $scope.filterActionSchemaKeys = function (value) {
            if (value === "channel" || value === "tags" || value === "SLAViolated" || value === "isolated_tags") {
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
            $state.go('console.trigger');
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

        $scope.OnChangeTriggerAction = function () {
            $scope.triggerAction.value = undefined;
        };

        //---------------functions Initial Data-------------------
        $scope.loadFilterAll = function () {
            triggerApiAccess.getFiltersAll($stateParams.triggerId).then(function (response) {
                if (response.IsSuccess) {
                    $scope.filterAll = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Filter', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading filters";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Filter', errMsg, 'error');
            });
        };

        $scope.loadFilterAny = function () {
            triggerApiAccess.getFiltersAny($stateParams.triggerId).then(function (response) {
                if (response.IsSuccess) {
                    $scope.filterAny = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Filter', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading filters";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Filter', errMsg, 'error');
            });
        };

        $scope.loadTriggerActions = function () {
            triggerApiAccess.getActions($stateParams.triggerId).then(function (response) {
                if (response.IsSuccess) {
                    $scope.triggerActions = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Trigger Actions', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading trigger actions";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Trigger Actions', errMsg, 'error');
            });
        };

        $scope.loadTriggerOperations = function () {
            triggerApiAccess.getOperations($stateParams.triggerId).then(function (response) {
                if (response.IsSuccess) {
                    $scope.triggerOperations = response.Result;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Trigger Operations', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading trigger operations";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Trigger Operations', errMsg, 'error');
            });
        };






        $scope.loadUsers = function () {
            $scope.users =[];
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

                                item.Display = item.firstname+" " +item.lastname;

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
                $scope.showAlert('Users', err, 'error');;
            });









            /*triggerUserServiceAccess.getUsers().then(function (response) {
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
        $scope.removeDeletedAction = function (item) {

            var index = $scope.triggerActions.indexOf(item);
            if (index != -1) {
                $scope.triggerActions.splice(index, 1);
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

        $scope.removeDeletedOperation = function (item) {

            var index = $scope.triggerOperations.indexOf(item);
            if (index != -1) {
                $scope.triggerOperations.splice(index, 1);
            }

        };

        //---------------insertNewData-----------------------------
        $scope.addTriggerAction = function () {
            console.log(JSON.stringify($scope.triggerAction));


            if ($scope.triggerAction.value === "TRUE") {
                $scope.triggerAction.value = true;
            } else if ($scope.triggerAction.value === "FALSE") {
                $scope.triggerAction.value = false;
            }


            triggerApiAccess.addAction($scope.triggerId, $scope.triggerAction).then(function (response) {
                if (response.IsSuccess) {
                    $scope.OnChangeTriggerAction();
                    $scope.loadTriggerActions();
                    $scope.showAlert('Trigger Action', response.CustomMessage, 'success');
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Trigger Action', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while saving trigger action";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Trigger Action', errMsg, 'error');
            });
        };

        $scope.addTriggerFilter = function () {
            console.log(JSON.stringify($scope.triggerFilter));

            if ($scope.triggerFilter.value === "TRUE") {
                $scope.triggerFilter.value = true;
            } else if ($scope.triggerFilter.value === "FALSE") {
                $scope.triggerFilter.value = false;
            }

            switch ($scope.triggerFilter.type) {
                case "any":
                    triggerApiAccess.addFilterAny($scope.triggerId, $scope.triggerFilter).then(function (response) {
                        if (response.IsSuccess) {
                            $scope.loadFilterAny();
                            $scope.showAlert('Trigger Filter', response.CustomMessage, 'success');
                        }
                        else {
                            var errMsg = response.CustomMessage;

                            if (response.Exception) {
                                errMsg = response.Exception.Message;
                            }
                            $scope.showAlert('Trigger Filter', errMsg, 'error');
                        }
                    }, function (err) {
                        loginService.isCheckResponse(err);
                        var errMsg = "Error occurred while saving trigger filters";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Trigger Filter', errMsg, 'error');
                    });
                    break;
                case "all":
                    triggerApiAccess.addFilterAll($scope.triggerId, $scope.triggerFilter).then(function (response) {
                        if (response.IsSuccess) {
                            $scope.loadFilterAll();
                            $scope.showAlert('Trigger Filter', response.CustomMessage, 'success');
                        }
                        else {
                            var errMsg = response.CustomMessage;

                            if (response.Exception) {
                                errMsg = response.Exception.Message;
                            }
                            $scope.showAlert('Trigger Filter', errMsg, 'error');
                        }
                    }, function (err) {
                        loginService.isCheckResponse(err);
                        var errMsg = "Error occurred while saving trigger filters";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Trigger Filter', errMsg, 'error');
                    });
                    break;
                default :
                    break;
            }
        };

        $scope.addTriggerOperation = function () {
            console.log(JSON.stringify($scope.triggerOperation));
            $scope.addOperationsActive = false;
            triggerApiAccess.addOperations($scope.triggerId, $scope.triggerOperation).then(function (response) {
                if (response.IsSuccess) {
                    $scope.addOperationsActive = true;
                    $scope.loadTriggerOperations();
                    $scope.showAlert('Trigger Operation', response.CustomMessage, 'success');
                }
                else {
                    $scope.addOperationsActive = true;
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Trigger Operation', errMsg, 'error');
                }
            }, function (err) {
                $scope.addOperationsActive = true;
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while saving trigger operation";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Trigger Operation', errMsg, 'error');
            });
        };

        //---------------load initialData--------------------------
        $scope.loadFilterAll();
        $scope.loadFilterAny();
        $scope.loadTriggerActions();
        $scope.loadTriggerOperations();
        $scope.loadUsers();
        $scope.loadUserGroups();
        $scope.loadTemplateInfo();
        $scope.loadAttributes();
    };

    app.controller('triggerConfigController', triggerConfigController);
}());