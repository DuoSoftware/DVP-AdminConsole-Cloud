/**
 * Created by Pawan on 1/2/2018.
 */
mainApp.directive("bisunit", function (userProfileApiAccess, attributeService) {


    return {
        restrict: "EAA",
        scope: {
            unit: "=",
            headusers:"=",
            groups:"=",
            skills:"=",
            updateobjs:"="
        },

        templateUrl: 'views/companyConfig/partials/businessUnitList.html',

        link: function (scope) {

            scope.editBUnit=false;
            scope.isHide=false;

            scope.buSkills = [];


            if(scope.unit.skills && scope.unit.skills.length > 0)
            {
                if(scope.skills && scope.skills.length > 0)
                {
                    scope.skills.filter(attr => {
                        scope.unit.skills.forEach(sg => {
                            if(sg.AttributeId === attr.AttributeId)
                            {
                                scope.buSkills.push(attr);
                            }

                        })
                    });
                }

            }


            if(scope.unit.unitName.toUpperCase() == 'ALL' || scope.unit.unitName.toUpperCase() == 'DEFAULT')
            {
                scope.isHide=true;
            }

            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };
            scope.changeEditMode = function () {
                scope.editBUnit=!scope.editBUnit;
            }
            scope.closeEdit = function () {
                scope.editBUnit=false;
            };
            scope.updateBusinessUnit = function () {

                var obj={
                    description:scope.unit.description
                }
                userProfileApiAccess.updateBusinessUnit(scope.unit.unitName,obj).then(function (resUpdate) {
                    if(resUpdate.IsSuccess)
                    {
                        scope.showAlert("Update Business Unit","Successfully updated Business Unit","success");
                    }
                    else
                    {
                        scope.showAlert("Update Business Unit","Error in updating Business Unit","error");
                    }
                },function (errUpdate) {
                    scope.showAlert("Update Business Unit","Error in updating Business Unit","error");
                });
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(group) {
                    return (group.username.toLowerCase().indexOf(lowercaseQuery) != -1);
                    ;
                };
            };
            function createFilterForGroups(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(group) {
                    return (group.name.toLowerCase().indexOf(lowercaseQuery) != -1);
                    ;
                };
            }

            /* $scope.querySearch = function(query) {
             var results = query ? $scope.groups.filter(createFilterFor(query)) : [];
             return results;
             };*/


            scope.querySearch = function (query) {
                if (query === "*" || query === "") {
                    if (scope.headusers) {
                        return scope.headusers;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    var results = query ? scope.headusers.filter(createFilterFor(query)) : [];
                    return results;
                }

            };
            scope.querySearchGroups = function (query) {
                if (query === "*" || query === "") {
                    if (scope.attri) {
                        return scope.groups;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    var results = query ? scope.groups.filter(createFilterForGroups(query)) : [];
                    return results;
                }

            };

            scope.querySearchSkills = function (query) {
                if (query === "*" || query === "") {
                    if (scope.skills) {
                        return scope.skills;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    var results = query ? scope.skills.filter(createFilterForGroups(query)) : [];
                    return results;
                }

            };

            scope.onChipAddBSkill = function (chip) {

                var addObj = {
                    BUId: scope.unit._id,
                    UnitName: scope.unit.unitName,
                    AttributeId: chip.AttributeId,
                    AttributeGroupId: chip.AttributeGroupId
                };
                attributeService.addAttributeToBusinessUnit(addObj).then(function (response) {
                    if (response) {
                        console.info("AddAttributeToBU : " + response);
                        return true;
                    }
                    else {

                        scope.showAlert("Error", "error", "Failed to save " + chip.Attribute);
                        return false;
                    }
                }, function (error) {
                    scope.showAlert("Error", "error", "Failed to save " + chip.Attribute);
                    return false;
                });
            };

            scope.onChipDeleteBSkill = function (chip) {

                attributeService.removeAttributeFromBusinessUnit(scope.unit._id, chip.AttributeId).then(function (response) {
                    if (response) {
                        return true;
                    }
                    else {

                        scope.showAlert("Error", "error", "Failed to save " + chip.Attribute);
                        return false;
                    }
                }, function (error) {
                    scope.showAlert("Error", "error", "Failed to save " + chip.Attribute);
                    return false;
                });
            };


            scope.onChipAdd = function (group) {

                scope.updateGroupBUnit(scope.unit.unitName,group,true);

            };
            scope.onChipDelete = function (group) {

               /* var index = $scope.attributeGroups.indexOf(chip.GroupId);
                console.log("index ", index);
                if (index > -1) {
                    $scope.attributeGroups.splice(index, 1);
                    console.log("rem attGroup " + $scope.attributeGroups);
                }*/
                scope.updateGroupBUnit("",group,false);


            };

            scope.onHUserChipAdd = function (hUser) {

                scope.addHeadUserToBUnit(scope.unit.unitName,hUser._id);

            };
            scope.onHUserChipDelete = function (hUser) {


                scope.removeHeadUserToBUnit(scope.unit.unitName,hUser._id);


            };

            scope.updateGroupBUnit = function (bUnit,group,isAdd) {


                var updateObj =
                    {
                        businessUnit:bUnit
                    }


                userProfileApiAccess.updateUserGroup(group._id,updateObj).then(function (resUpdate) {
                    if(resUpdate.IsSuccess)
                    {
                        scope.showAlert("Business Unit","Update Groups of Business Unit successfully","success");
                        scope.updateobjs(group._id,bUnit,group,isAdd);

                    }
                    else
                    {
                        scope.showAlert("Business Unit","Error in updating Groups of Business Unit ","error");
                    }
                },function (errUpdate) {
                    scope.showAlert("Business Unit","Error in updating Groups of  Business Unit ","error");
                });



            };
            scope.addHeadUserToBUnit = function (bUnit,hUser) {
                userProfileApiAccess.addHeadUserToBUnit(bUnit,hUser).then(function (resHeadUser) {
                    scope.showAlert('Head User', ' Head user Added to BusinessUnit : '+bUnit, 'success');
                },function (errHeadUSer) {
                    scope.showAlert('Head User', 'Cannot add Head user to BusinessUnit : '+bUnit, 'error');
                });
            };
            scope.removeHeadUserToBUnit = function (bUnit,hUser) {
                userProfileApiAccess.removeHeadUserToBUnit(bUnit,hUser).then(function (resHeadUser) {
                    scope.showAlert('Head User', ' Head user removed from BusinessUnit : '+bUnit, 'success');
                },function (errHeadUSer) {
                    scope.showAlert('Head User', 'Cannot add remove user from BusinessUnit : '+bUnit, 'error');
                });
            };


        }

    }
});