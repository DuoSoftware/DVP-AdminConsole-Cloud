
'use strict';

mainApp.controller('newautoattendancecontroller', function ($scope, autottendanceconfigservice,extensionBackendService,
                                                            $state,$stateParams,fileService,loginService) {


    $scope.newObj={};
    $scope.extentions = [];


    $scope.showAlert = function (title,content,type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };



    $scope.saveNewAA = function () {
        autottendanceconfigservice.addNewAutoAttendance($scope.newObj).then(onSaveCompleted, onError);
    };




    var onSaveCompleted = function (response) {

        if (!response.data.IsSuccess) {
            if(response.data.Exception.Message)
                onError(response.data.Exception.Message);
        }
        else {

            $scope.showAlert("Success","Successfully saved","success");
            $scope.backToList();
        }
    };

    var onError = function (reason) {
        $scope.showAlert("Error","There is an error","error");
        console.log(reason);
    };

    var loadExtentions = function(){

        extensionBackendService.getExtensionsByCategory('AUTO_ATTENDANT').then(onExtentionCompleted, onError);
    };


    var onExtentionCompleted = function (response) {

        if (!response.data.IsSuccess) {
            if(response.data.Exception.Message)
                onError(response.data.Exception.Message);
        }
        else {


            $scope.extentions = response.data.Result;
        }
    };



    $scope.backToList =function()
    {
        $state.go('console.autoattendance');
    };



    loadExtentions();

    $scope.ivrFileList = [];
    $scope.LoadIvrFiles = function () {
        fileService.GetFilesByCategoryName('IVRCLIPS').then(function (response) {
            $scope.ivrFileList = response;
        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.showAlert("IVR Clips","Fail To Get IVR File List.","error");
        });
    };
    $scope.LoadIvrFiles();
    //if($stateParams.id)
    //{
    //    $scope.ruleID=$stateParams.id;
    //    $scope.editMode=true;
    //}
    //
    //
    //
    //
    //
    //var onAppLoadCompleted = function (response) {
    //    if(response.data.Exception){
    //        onError(response.data.Exception);
    //    }
    //    else
    //    {
    //        console.log(response.data.Result);
    //        console.log($scope.newObj);
    //        $scope.AppObj=response.data.Result;
    //        console.log("App success");
    //        console.log("AppID from newOBJ "+$scope.newObj.AppId);
    //        //$scope.App.id = {id: '3'};
    //    }
    //};
    //
    //var onTransLoadCompleted = function (response) {
    //    if(response.data.Exception){
    //        onError(response.data.Exception);
    //    }
    //    else
    //    {
    //        $scope.TransObj=response.data.Result;
    //        $scope.newObj.ANITranslationId={id:$scope.newObj.ANITranslationId};
    //        $scope.newObj.TranslationId={id:$scope.newObj.TranslationId};
    //    }
    //};
    //
    //var onRuleLoad = function (response) {
    //    if(response.data.Exception){
    //        onError(response.data.Exception);
    //    }
    //    else
    //    {
    //        $scope.newObj=response.data.Result;
    //        console.log(response.data.Result);
    //        loadContexts();
    //        loadTranslations();
    //        $scope.setEnableStatus();
    //
    //        if($scope.newObj.Direction=="INBOUND")
    //        {
    //            loadApplications();
    //            $scope.isInbound=true;
    //            console.log($scope.newObj.AppId);
    //            //$scope.newObj.AppId=$scope.newObj.AppId;
    //            $scope.newObj.AppId={id:$scope.newObj.AppId};
    //        }
    //        else
    //        {
    //            $scope.isInbound=false;
    //            $scope.newObj.AppId=null;
    //            loadTrunks();
    //        }
    //
    //
    //
    //    }
    //
    //};
    //
    //
    //
    //var onTrunkLoadCompleted = function (response) {
    //    if(response.data.Exception)
    //    {
    //        onError(response.data.Exception.Message);
    //    }
    //    else
    //    {
    //
    //        $scope.isDisabled=false;
    //        $scope.trunkObj= response.data.Result;
    //    }
    //};
    //
    //
    //
    //var onContextLoad = function (response) {
    //    if(response.data.Exception)
    //    {
    //        onError(response.data.Exception.Message);
    //    }
    //    else
    //    {
    //
    //        $scope.isDisabled=false;
    //        $scope.contextData=response.data.Result;
    //        if(!$scope.editMode)
    //        {
    //            loadTrunks();
    //        }
    //
    //
    //    }
    //};
    //
    //var onAttachCompleted = function (response) {
    //    if(response.data.Exception)
    //    {
    //        onError(response.data.Exception.Message);
    //    }
    //    else
    //    {
    //
    //        console.log("Done attached");
    //
    //    }
    //};
    //
    //var loadTrunks = function () {
    //    ruleconfigservice.loadTrunks().then(onTrunkLoadCompleted,onError);
    //};
    //
    //var loadApplications = function () {
    //    ruleconfigservice.loadApps().then(onAppLoadCompleted,onError);
    //};
    //var loadTranslations = function () {
    //    ruleconfigservice.loadTranslations().then(onTransLoadCompleted,onError);
    //};
    //
    //
    //$scope.saveNewRule = function () {
    //    //$scope.newObj.Direction=Direction;
    //    var isValid = true;
    //    try {
    //        new RegExp($scope.newObj.CustomRegEx);
    //    } catch(e) {
    //        isValid = false;
    //    }
    //
    //
    //
    //    if($scope.editMode)
    //    {
    //        if(isValid)
    //        {
    //            ruleconfigservice.updateRules($scope.newObj).then(onSaveCompleted, onError);
    //        }else
    //        {
    //            $scope.showAlert("Error","Invalid Custom regEx pattern","error");
    //        }
    //    }
    //
    //    else
    //    {
    //
    //        if(isValid)
    //        {
    //            ruleconfigservice.addNewRule($scope.newObj).then(onSaveCompleted,onError);
    //        }
    //        else
    //        {
    //            $scope.showAlert("Error","Invalid Custom regEx pattern","error");
    //        }
    //
    //    }
    //
    //
    //
    //};
    //
    //$scope.makeContextEmpty = function () {
    //    $scope.newObj.Context=null;
    //    console.log("After Remove context "+$scope.newObj.Context);
    //};
    //$scope.makeTrunkEmpty = function () {
    //    $scope.newObj.TrunkNumber=null;
    //    console.log("After Remove TrunkNumber "+$scope.newObj.TrunkNumber);
    //};
    //
    //function  loadContexts()
    //{
    //    ruleconfigservice.getContextList().then(onContextLoad,onError);
    //};
    //
    //
    //
    ////loadContexts();
    //function initiateProcess  () {
    //    if($scope.ruleID)
    //    {
    //        ruleconfigservice.getRule($scope.ruleID).then(onRuleLoad,onError);
    //
    //    }
    //    else
    //    {
    //        loadContexts();
    //    }
    //};
    //
    //
    //$scope.showAdvanced = function()
    //{
    //    if($scope.advancedViewSt)
    //    {
    //        $scope.advancedViewSt=false;
    //    }
    //    else
    //    {
    //        $scope.advancedViewSt=true;
    //    }
    //};
    //
    //$scope.AttachDNISTransToRule = function () {
    //
    //    if($scope.editMode)
    //    {
    //        console.log("Id "+$scope.newObj.id);
    //        console.log("TId "+$scope.newObj.TranslationId.id);
    //        ruleconfigservice.attchDNISTransToRule($scope.newObj.id,$scope.newObj.TranslationId.id).then(onAttachCompleted,onError);
    //    }
    //
    //};
    //$scope.AttachANITransToRule = function () {
    //
    //    if($scope.editMode)
    //    {
    //        console.log("Id "+$scope.newObj.id);
    //        console.log("TId "+$scope.newObj.ANITranslationId.id);
    //        ruleconfigservice.attchANITransToRule($scope.newObj.id,$scope.newObj.ANITranslationId.id).then(onAttachCompleted,onError);
    //    }
    //
    //};
    //
    //$scope.AttachAppToRule = function () {
    //
    //    if($scope.editMode)
    //    {
    //        console.log("Id "+$scope.newObj.id);
    //        console.log("APPId "+$scope.newObj.AppId.id);
    //        ruleconfigservice.attchAppWithRule($scope.newObj.id,$scope.newObj.AppId.id).then(onAttachCompleted,onError);
    //    }
    //
    //};
    //
    //
    //
    //$scope.setEnableStatus = function () {
    //
    //    if($scope.newObj.ANIRegExPattern=="ANY")
    //    {
    //        $scope.ANIRequired=false;
    //        $scope.newObj.ANI=null;
    //    }
    //    else
    //    {
    //        $scope.ANIRequired=true;
    //    }
    //    if($scope.newObj.RegExPattern=="ANY")
    //    {
    //        $scope.DNISRequired=false;
    //        $scope.newObj.DNIS=null;
    //    }
    //    else
    //    {
    //        $scope.DNISRequired=true;
    //    }
    //
    //
    //}
    //
    //
    //initiateProcess();


});