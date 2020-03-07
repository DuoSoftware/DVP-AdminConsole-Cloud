/**
 * Created by Rajinda on 12/31/2015.
 */
'use strict';
mainApp.factory("ticketService", function ($http, $log, $filter,  baseUrls) {

    var saveForm = function (item) {

        return $http({
            method: 'post',
            url: baseUrls.ticketUrl + 'FormMaster',
            data: item
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var getFormProfile = function () {

        return $http({
            method: 'get',
            url: baseUrls.ticketUrl + 'FormProfile'
        }).then(function (response) {
            return response.data;
        });
    };

    var getAllIsolatedTagForms = function()
    {
        return $http({
            method: 'get',
            url: baseUrls.ticketUrl + 'FormMasters/IsolatedTagForms'
        }).then(function (response) {
            return response.data;
        });
    };

    var removeIsolatedTagForm = function(isolatedTag)
    {
        return $http({
            method: 'delete',
            url: baseUrls.ticketUrl + 'FormMasters/IsolatedTag/' + isolatedTag
        }).then(function (response) {
            return response.data;
        });
    };


    var getFormByIsolatedTag = function (isolated_tag) {

        return $http({
            method: 'get',
            url: baseUrls.ticketUrl + 'FormMasters/Tag/' + isolated_tag
        }).then(function (response) {
            return response.data;
        });
    };

    var updateFormByTag = function (formId, isolatedTag)
    {
        var formBody = {
            isolated_tag: isolatedTag
        };
        return $http({
            method: 'put',
            url: baseUrls.ticketUrl + 'FormMaster/' + formId,
            data: JSON.stringify(formBody)
        }).then(function (response) {
            return response.data;
        });
    };

    var saveFormProfile = function (formProfile) {

        return $http({
            method: 'post',
            url: baseUrls.ticketUrl + 'FormProfile',
            data: JSON.stringify(formProfile)
        }).then(function (response) {
            return response.data;
        });
    };

    var updateFormProfile = function (formProfile) {

        return $http({
            method: 'put',
            url: baseUrls.ticketUrl + 'FormProfile',
            data: JSON.stringify(formProfile)
        }).then(function (response) {
            return response.data;
        });
    };

    var loadFormList = function () {

        return $http({
            method: 'get',
            url: baseUrls.ticketUrl + 'FormMasters'
        }).then(function (response) {
            return response.data.Result;
        });
    };
    return {
        SaveForm:saveForm,
        LoadFormList: loadFormList,
        getFormProfile: getFormProfile,
        saveFormProfile: saveFormProfile,
        updateFormProfile: updateFormProfile,
        getFormByIsolatedTag: getFormByIsolatedTag,
        updateFormByTag: updateFormByTag,
        getAllIsolatedTagForms: getAllIsolatedTagForms,
        removeIsolatedTagForm: removeIsolatedTagForm
    }

});




