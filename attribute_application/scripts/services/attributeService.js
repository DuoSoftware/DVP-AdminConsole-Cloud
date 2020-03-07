/**
 * Created by Rajinda on 12/31/2015.
 */
'use strict';
mainApp.factory("attributeService", function ($http, $log, $filter,  baseUrls) {

    var getattributeCount = function () {

        return $http.get(baseUrls.resourceServiceBaseUrl + "AttributeCount").then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return {};
                }
            });
    };

    var saveAttribute = function (item) {

        return $http({
            method: 'post',
            url: baseUrls.resourceServiceBaseUrl + 'Attribute',
            data: item
        }).then(function (response) {
            return response.data;
        });
    };

    var updateAttribute = function (item) {

        return $http({
            method: 'put',
            url: baseUrls.resourceServiceBaseUrl + 'Attribute/' + item.AttributeId,
            data: item
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var getattributes = function (rowCount,pageNo) {

        return $http.get(baseUrls.resourceServiceBaseUrl + "Attributes/"+rowCount+"/"+pageNo).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return {};
                }
            });
    };

    var deleteAttribute = function (item) {

        return $http({
            method: 'delete',
            url: baseUrls.resourceServiceBaseUrl + 'Attribute/' + item.AttributeId,
            data: item
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var deleteOneAttribute = function (groupId,attributeId) {

        return $http({
            method: 'delete',
            url: baseUrls.resourceServiceBaseUrl + 'Group/'+groupId+'/Attribute/'+attributeId
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };


    var getGroups = function (rowCount,pageNo) {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'Groups/'+rowCount+'/'+pageNo
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var getAllowedGroups = function (rowCount, pageNo) {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'AllowedGroups/'+rowCount+'/'+pageNo
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var getSkillsForUserGroup = function (groupId) {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'UserGroupSkill/'+groupId
        }).then(function (response) {
            return response.data;
        });
    };

    var getSkillsForBusinessUnits = function (bUnits) {

        return $http({
            method: 'post',
            url: baseUrls.resourceServiceBaseUrl + 'BusinessUnitSkills',
            data: bUnits
        }).then(function (response) {
            return response.data;
        });
    };

    var GroupsCount = function () {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'GroupsCount'
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var getAllowedGroupsCount = function () {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'AllowedGroupsCount'
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var saveGroup = function (item) {

        return $http({
            method: 'post',
            url: baseUrls.resourceServiceBaseUrl + 'Group',
            data: item
        }).then(function (response) {
            return response.data;
        });
    };

    var addAttributeToBusinessUnit = function (item) {

        return $http({
            method: 'post',
            url: baseUrls.resourceServiceBaseUrl + 'BusinessUnit/Skill',
            data: item
        }).then(function (response) {
            return response.data;
        });
    };

    var addAttributeToUserGroup = function (item) {

        return $http({
            method: 'post',
            url: baseUrls.resourceServiceBaseUrl + 'UserGroup/Skill',
            data: item
        }).then(function (response) {
            return response.data;
        });
    };

    var removeAttributeFromUserGroup = function (grpId, attrId) {

        return $http({
            method: 'delete',
            url: baseUrls.resourceServiceBaseUrl + 'UserGroup/' + grpId + '/Skill/' + attrId
        }).then(function (response) {
            return response.data;
        });
    };

    var removeAttributeFromBusinessUnit = function (buId, attrId) {

        return $http({
            method: 'delete',
            url: baseUrls.resourceServiceBaseUrl + 'BusinessUnit/' + buId + '/Skill/' + attrId
        }).then(function (response) {
            return response.data;
        });
    };

    var updateGroup = function (item,grpID) {
        return $http({
            method: 'put',
            url: baseUrls.resourceServiceBaseUrl + 'Group/' + grpID ,
            data: item
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var deleteGroup = function (item) {

        return $http({
            method: 'delete',
            url: baseUrls.resourceServiceBaseUrl + 'Group/' + item.GroupId,
            data: item
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var deleteAttributeFrmGroup = function (item, oldItems, grpID) {


        /*var items = $filter('filter')($scope.items, {name: '!ted'})*/
        var AttributeIds = [];
        angular.forEach(item, function (a) {
            var items = $filter('filter')(oldItems, {AttributeId: a.AttributeId});
            if (items) {
                var index = oldItems.indexOf(items[0]);
                oldItems.splice(index, 1);
            }
            /*AttributeIds.push(a.AttributeId)*/
        });

        angular.forEach(oldItems, function (a) {
            AttributeIds.push(a.AttributeId)
        });

        if (AttributeIds.length == 0)
            return;

        return $http({
            method: 'delete',
            url: baseUrls.resourceServiceBaseUrl + 'Group/' + grpID + '/DeleteAttributes',
            data: {"AttributeIds": AttributeIds}
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var getTasks = function () {


        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "Tasks"
        }).then(function (response) {
            return response.data.Result;
        });
    };


    var addAttributeToGroup = function (groupId,attributeId,otherData) {


        return $http({
            method: 'put',
            url: baseUrls.resourceServiceBaseUrl + "ExsistingGroup/"+groupId+"/Attribute/"+attributeId,
            data: {"AttributeId": attributeId, "OtherData": otherData}
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var getAttributeByGroupId = function (groupId) {
        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "AttributeGroup/"+groupId
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var getGroupNames = function () {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'GroupNames'
        }).then(function (response) {
            return response;
        });
    };
    var getAttributeDetails = function (groupId) {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'Group/'+groupId+'/Attribute/Details'
        }).then(function (response) {
            return response;
        });
    };

    var getGroupByName = function (groupName) {

        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + 'Group/Name/' + groupName
        }).then(function (response) {
            return response;
        });
    };

    return {
        GetAttributes: getattributes,
        GetAttributeCount: getattributeCount,
        SaveAttribute: saveAttribute,
        UpdateAttribute: updateAttribute,
        DeleteAttribute: deleteAttribute,
        GetGroups: getGroups,
        GroupsCount:GroupsCount,
        UpdateGroup: updateGroup,
        SaveGroup: saveGroup,
        DeleteGroup: deleteGroup,
        DeleteAttributeFrmGroup: deleteAttributeFrmGroup,
        GetTasks: getTasks,
        AddAttributeToGroup:addAttributeToGroup,
        DeleteOneAttribute:deleteOneAttribute,
        GetAttributeByGroupId:getAttributeByGroupId,
        getGroupNames:getGroupNames,
        getAttributeDetails:getAttributeDetails,
        getAllowedGroups: getAllowedGroups,
        getAllowedGroupsCount: getAllowedGroupsCount,
        getGroupByName: getGroupByName,
        addAttributeToUserGroup: addAttributeToUserGroup,
        removeAttributeFromUserGroup: removeAttributeFromUserGroup,
        getSkillsForUserGroup: getSkillsForUserGroup,
        getSkillsForBusinessUnits: getSkillsForBusinessUnits,
        addAttributeToBusinessUnit: addAttributeToBusinessUnit,
        removeAttributeFromBusinessUnit: removeAttributeFromBusinessUnit
    }

});




