/**
 * Created by Heshan.i on 8/19/2016.
 */
(function () {
    var app = angular.module('veeryConsoleApp');
    var ticketDynamicField = function ($templateCache, $compile) {
        return {
            scope: {
                ticketField: "=",
                ticketSchema: "=",
                ticketTypes: "=",
                companyUsers: "=",
                companyUserGroups: "=",
                ngModel: "="
            },
            template: 'Select Field to continue',
            link: function (scope, element) {


                scope.querySearch = function (query) {
                    var emptyArr = [];
                    var result =[];
                    if(query)
                    {
                        query = query.toLowerCase();
                    }

                    if (query === "*" || query === "") {
                        if (scope.companyUsers) {
                            return scope.companyUsers;
                        }
                        else {
                            return emptyArr;
                        }

                    }
                    else {
                        if (scope.companyUsers) {


                            angular.forEach(scope.companyUsers, function(item){

                                if(item.Display.toLowerCase().indexOf(query)!==-1){
                                    result.push(item);
                                }

                            });

                            return result;


                            /*return scope.companyUsers.filter(function (item) {
                                var regEx = "^(" + query + ")";

                                if (item.Display.toLowerCase().indexOf(query)!==-1) {
                                    return item;
                                }
                                else {
                                    return false;
                                }

                            });*/
                        }
                        else {
                            return emptyArr;
                        }
                    }

                };

                scope.securityLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                scope.channel = ["call", "skype", "facebook", "slack", "viber", "webchat"];
                scope.$watch('ticketField', function (newValue, oldValue) {
                    if (newValue) {
                        var template = scope.getTemplate(newValue);
                        element.html(template);
                        $compile(element.contents())(scope);
                    }
                }, true);
                scope.$watch('companyUsers', function (newValue, oldValue) {
                    if (newValue) {
                        companyUsers = newValue;
                    }
                }, true);
                scope.$watch('companyUserGroups', function (newValue, oldValue) {
                    if (newValue) {
                        companyUserGroups = newValue;
                    }
                }, true);
                scope.$watch('ticketSchema', function (newValue, oldValue) {
                    if (newValue) {
                        ticketSchema = newValue;
                    }
                }, true);
                scope.$watch('ngModel', function (newValue, oldValue) {
                    if (newValue) {
                        ngModel = newValue;
                    }
                }, true);

                scope.getTemplate = function (field) {

                    var labelData = "<label>"+ field+"</label> ";

                    switch (field) {
                        case "due_at":
                        case "created_at":
                        case "updated_at":
                            return '<div class="col-sm-5">'+labelData+'<input type="text" class="form-control" ng-model="ngModel.value" name="DueDate" datepicker> </div>';
                        case "active":
                            return '<div class="col-md-5 col-sm-5 col-xs-12 form-group has-feedback">'+labelData+'<select class="form-control has-feedback-left" ng-model="ngModel.value"> <option>TRUE</option> <option>FALSE</option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                        case "is_sub_ticket":
                            return '<div class="col-md-5 col-sm-5 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" ng-model="ngModel.value"> <option>TRUE</option> <option>FALSE</option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                        case "type":
                            return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select Status" ng-model="ngModel.value"> <option value="" disabled selected>Select Type</option> <option ng-repeat="status in ticketSchema.type.enum" value="{{status}}"> {{status}} </option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                        case "security_level":
                            return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select Status" ng-model="ngModel.value"> <option value="" disabled selected>Select Type</option> <option ng-repeat="status in securityLevel" value="{{status}}"> {{status}} </option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                        case "channel":
                            return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select Status" ng-model="ngModel.value"> <option value="" disabled selected>Select Type</option> <option ng-repeat="status in channel" value="{{status}}"> {{status}} </option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                        case "time_estimation":
                        case "tid":
                            return '<div>'+labelData+'<input type="Number" min="0" class="form-control has-feedback-left" ng-model="ngModel.value" style="" id="actionValue" placeholder="Value"> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span></div>';
                        case "subject":
                            return '<div>'+labelData+'<input type="text" class="form-control has-feedback-left" ng-model="ngModel.value" style="" id="actionValue" placeholder="Value"> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span></div>';
                        case "reference":
                            return '<div>'+labelData+'<input type="text" class="form-control has-feedback-left" ng-model="ngModel.value" style="" id="actionValue" placeholder="Value"> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span></div>';
                        case "description":
                            return '<div>'+labelData+'<input type="text" class="form-control has-feedback-left" ng-model="ngModel.value" style="" id="actionValue" placeholder="Value"> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span></div>';
                        case "priority":
                            return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select Priority" ng-model="ngModel.value"> <option value="" disabled selected>Select Priority</option> <option ng-repeat="priority in ticketSchema.priority.enum" value="{{priority}}"> {{priority}} </option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';

                        case "status":
                            return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select Status" ng-model="ngModel.value"> <option value="" disabled selected>Select Status</option> <option ng-repeat="status in ticketSchema.status.enum" value="{{status}}"> {{status}} </option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                        case "assignee":
                        case "requester":
                        case "submitter":
                        case "collaborators":
                        case "watchers":
                            if (companyUsers) {
                                //return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback"> <select class="form-control has-feedback-left" placeholder="Select User" ng-model="ngModel.value"> <option value="" disabled selected>Select User</option> <option ng-repeat="user in companyUsers" value="{{user._id}}"> {{user.firstname}} {{user.lastname}} </option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';

                                return '<div class="col-md-10 col-sm-10 col-xs-12 " style="height: 150px">' +labelData+
                                    '<input type="text" class="form-control" ng-model="ngModel.value" data-min-length="1" data-html="1"\n' +
                                    '                               data-limit="1000" data-auto-select="true" data-animation="am-flip-x"\n' +
                                    '                               bs-options="user.Display as user.Display for user in querySearch($viewValue)"\n' +
                                    '                               placeholder="Agent" bs-typeahead> </div>'
                                   /* '<input type="text" class="form-control" ng-model="ngModel.value" data-min-length="0" data-html="1" data-limit="1000" data-auto-select="true" data-animation="am-flip-x" bs-options="usr.Display as usr.Display for usr in companyUsers" placeholder="Assignee" bs-typeahead> </div>';*/

                            } else {
                                return labelData+'<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select User" ng-model="ngModel.value"> <option value="" disabled selected>No User</option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                            }
                        case "assignee_group":
                            if (companyUserGroups) {
                                return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select User Group" ng-model="ngModel.value"> <option value="" disabled selected>Select User Group</option> <option ng-repeat="group in companyUserGroups" value="{{group._id}}"> {{group.name}} </option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                            } else {
                                return '<div class="col-md-10 col-sm-10 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" placeholder="Select User Group" ng-model="ngModel.value"> <option value="" disabled selected>No User Group</option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                            }
                        case "channel":
                        case "attachments":
                        case "sub_tickets":
                        case "related_tickets":
                        case "merged_tickets":
                        case "engagement_session":
                            return '<div>'+labelData+'<input type="text" class="form-control has-feedback-left" ng-model="ngModel.value" style="" id="actionValue" placeholder="Value"> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span></div>';
                        case "tags":
                        case "isolated_tags":
                            return '<div>'+labelData+'<input type="text" class="form-control has-feedback-left" ng-model="ngModel.value" style="" id="actionValue" placeholder="Value"> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span></div>';
                        case "SLAViolated":
                            return '<div class="col-md-5 col-sm-5 col-xs-12 form-group has-feedback">'+labelData+' <select class="form-control has-feedback-left" ng-model="ngModel.value"> <option>TRUE</option> <option>FALSE</option> </select> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span> </div>';
                        //return '<checkbox class="btn-success" ng-model="ngModel.value"></checkbox> <label> <small>Violated</small> </label>';
                        default :
                            return '<div>'+labelData+'<input type="text" class="form-control has-feedback-left" ng-model="ngModel.value" style="" id="actionValue" placeholder="Value"> <span class="fa fa-envelope form-control-feedback left" aria-hidden="true"></span></div>';
                            break;
                    }
                };
            }

        }
    };


    app.directive('ticketDynamicField', ticketDynamicField);
}());