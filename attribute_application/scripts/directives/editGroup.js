/**
 * Created by Rajinda on 5/30/2016.
 */
mainApp.directive("editgroups", function ($filter, $rootScope, attributeService) {

    return {
        restrict: "EA",
        scope: {
            groupinfo: "=",
           /* attribinfo: "=",*/
            taskList: "=",
            'updateGroups': '&'
        },

        templateUrl: 'attribute_application/partials/template/editGroups.html',
        /*template: '<span class="count_top"  ><i class="fa fa-user" ></i> {{fileCount.Category| uppercase}}</span><div class="count green">{{fileCount.Count}}</div><span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>Total Number of Files</i></span>',*/

        link: function (scope, element, attributes) {
            scope.attribinfo =[];
            scope.GetAttributes = function () {
                attributeService.GetAttributes(1000, 1).then(function (response) {
                    scope.attribinfo = response;
                    scope.GetAttributeByGroupId();
                }, function (error) {
                    scope.showError("Error", "Error", "ok", "There is an error ");
                });

            };
            scope.GetAttributes();

            scope.attachedAttributes = [];

            scope.GetAttributeByGroupId = function () {
                attributeService.GetAttributeByGroupId(scope.groupinfo.GroupId).then(function (response) {
                    /*scope.attachedAttributes = response.ResAttribute;*/

                    angular.forEach(response, function (a) {
                        if (a) {
                            var items = $filter('filter')(scope.attribinfo, {AttributeId: a.AttributeId},true);
                            if (items) {
                                scope.attachedAttributes.push(items[0]);
                                var index = scope.attribinfo.indexOf(items[0]);
                                scope.attribinfo.splice(index, 1);
                            }
                            /*AttributeIds.push(a.AttributeId)*/
                        }
                    });


                }, function (error) {
                    $log.debug("GetAttributeByGroupId err");
                    $scope.showError("Error", "Error", "ok", "There is an error ");
                });

            };


            scope.editGroup = function () {
                scope.editMode = !scope.editMode;
            };
            scope.editMode = false;

            scope.updateGroup = function (item) {

                attributeService.UpdateGroup(item, item.GroupId).then(function (response) {

                    if (response) {
                        console.info("UpdateAttributes : " + response);
                        scope.showAlert("Update Group", "success", "ok", "User Group Updated Successfully.");
                        scope.editMode = false;
                    }
                }, function (error) {
                    console.error("UpdateAttributes err" + error);
                    scope.showError("Error", "Error", "ok", "User Group Updated Error.");
                });
            };

            scope.deleteGroup = function (item) {

                scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " + item.GroupName, function (obj) {

                    attributeService.DeleteGroup(item).then(function (response) {
                        if (response) {
                            scope.updateGroups(item);
                            scope.showAlert("Deleted", "Deleted", "ok", "File " + item.GroupName + " Deleted successfully");
                        }
                        else
                            scope.showError("Error", "Error", "ok", "There is an error ");
                    }, function (error) {
                        scope.showError("Error", "Error", "ok", "There is an error ");
                    });

                }, function () {

                }, item);


            };

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

                (new PNotify({
                    title: tittle,
                    text: content,
                    icon: 'glyphicon glyphicon-question-sign',
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    }
                })).get().on('pnotify.confirm', function () {
                    OkCallback("confirm");
                }).on('pnotify.cancel', function () {

                });

            };

            scope.showAlert = function (tittle, label, button, content) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: 'success',
                    styling: 'bootstrap3'
                });
            };

            scope.showError = function (tittle, content) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: 'error',
                    styling: 'bootstrap3'
                });
            };

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(group) {
                    return (group.Attribute.toLowerCase().indexOf(lowercaseQuery) != -1);
                    ;
                };
            }

            scope.querySearch = function (query) {
                if (query === "*" || query === "") {
                    if (scope.attribinfo) {
                        return scope.attribinfo;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    var results = query ? scope.attribinfo.filter(createFilterFor(query)) : [];
                    return results;
                }

            };

            scope.onChipAdd = function (chip) {
                attributeService.AddAttributeToGroup(scope.groupinfo.GroupId, chip.AttributeId, "Attribute Group").then(function (response) {
                    if (response) {
                        console.info("AddAttributeToGroup : " + response);
                        scope.showAlert("Info", "Info", "ok", "Attribute " + chip.Attribute + " Save successfully");

                    }
                    else {
                        scope.resetAfterAddFail(chip);
                        scope.showError("Error", "Fail To Save " + chip.Attribute);
                    }
                }, function (error) {
                    scope.resetAfterAddFail(chip);
                    scope.showError("Error", "Fail To Save " + chip.Attribute);
                });
            };

            scope.onChipDelete = function (chip) {
                attributeService.DeleteOneAttribute(scope.groupinfo.GroupId, chip.AttributeId).then(function (response) {
                    if (response) {
                        console.info("AddAttributeToGroup : " + response);
                        scope.showAlert("Info", "Info", "ok", "Successfully Delete " + chip.Attribute);
                    }
                    else {
                        scope.resetAfterDeleteFail(chip);
                        scope.showError("Error", "Fail To Delete " + chip.Attribute);
                    }
                }, function (error) {
                    scope.showError("Error", "Fail To Delete " + chip.Attribute);
                    scope.resetAfterDeleteFail(chip);
                });

            };

            scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            scope.resetAfterAddFail = function (chip) {
                scope.GetAttributeByGroupId();
                /*scope.safeApply(function () {
                 var index = scope.attachedAttributes.indexOf(chip);
                 if (index > 0)
                 scope.attachedAttributes.splice(index, 1);
                 index = scope.attribinfo.indexOf(chip);
                 if (index > 0)
                 scope.attribinfo.push(chip);
                 });*/

            };

            scope.resetAfterDeleteFail = function (chip) {
                scope.GetAttributeByGroupId();
                /* scope.safeApply(function () {
                 var index = scope.attribinfo.indexOf(chip);
                 if (index > 0)
                 scope.attribinfo.splice(index, 1);
                 index = scope.attachedAttributes.indexOf(chip);
                 if (index > 0)
                 scope.attachedAttributes.push(chip);
                 });*/
            }
        }
    }
});