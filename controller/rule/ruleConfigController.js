/**
 * Created by Pawan on 6/6/2016.
 */
'use strict';
mainApp.controller('newrulecontroller', function ($scope, ruleconfigservice, userProfileApiAccess, notificationService, $state, $stateParams, loginService,scheduleBackendService,ShareData) {


    $scope.newObj = {};
    $scope.newObj.RegExPattern = "STARTWITH";
    $scope.newObj.ANIRegExPattern = "STARTWITH";
    $scope.newObj.Direction = "INBOUND";
    $scope.editMode = false;
    $scope.advancedViewSt = false;
    $scope.isInbound = false;
    $scope.DNISRequired = true;
    $scope.ANIRequired = true;
    $scope.scheduleList;
    $scope.BusinessUnits = [];


    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    if ($stateParams.id) {
        $scope.ruleID = $stateParams.id;
        $scope.editMode = true;
    }


    var onAppLoadCompleted = function (response) {
        if (!response.data.IsSuccess) {
            onError(response.data.Exception);
        }
        else {
            console.log(response.data.Result);
            console.log($scope.newObj);
            $scope.AppObj = response.data.Result;
            console.log("App success");
            console.log("AppID from newOBJ " + $scope.newObj.AppId);
            //$scope.App.id = {id: '3'};
        }
    };

    var onTransLoadCompleted = function (response) {
        if (!response.data.IsSuccess) {
            onError(response.data.Exception);
        }
        else {
            $scope.TransObj = response.data.Result;
            $scope.newObj.ANITranslationId = {id: $scope.newObj.ANITranslationId};
            $scope.newObj.TranslationId = {id: $scope.newObj.TranslationId};
        }
    };

    var onRuleLoad = function (response) {
        if (!response.data.IsSuccess) {
            onError(response.data.Exception);
        }
        else {
            $scope.newObj = response.data.Result;
            console.log(response.data.Result);
            loadContexts();
            loadBusinessUnits();
            loadTranslations();
            $scope.setEnableStatus();
            $scope.newObj.ScheduleId = {id: $scope.newObj.ScheduleId};

            if ($scope.newObj.Direction == "INBOUND") {
                loadApplications();
                $scope.isInbound = true;
                console.log($scope.newObj.AppId);
                //$scope.newObj.AppId=$scope.newObj.AppId;
                $scope.newObj.AppId = {id: $scope.newObj.AppId};

            }
            else {
                $scope.isInbound = false;
                $scope.newObj.AppId = null;
                loadTrunks();
            }


        }

    };

    var onSaveCompleted = function (response) {
        $scope.showAlert("Success", "Successfully saved", "success");
        $scope.backToList();
    };

    var onTrunkLoadCompleted = function (response) {
        if (!response.data.IsSuccess) {
            onError(response.data.Exception.Message);
        }
        else {

            $scope.isDisabled = false;
            $scope.trunkObj = response.data.Result;
        }
    };

    var onError = function (reason) {
        $scope.showAlert("Error", "There is an error", "error");
        console.log(reason);
    };

    var onContextLoad = function (response) {
        if (!response.data.IsSuccess) {
            onError(response.data.Exception.Message);
        }
        else {

            $scope.isDisabled = false;
            $scope.contextData = response.data.Result;
            if (!$scope.editMode) {
                loadTrunks();
            }


        }
    };

    var onAttachCompleted = function (response) {
        if (!response.data.IsSuccess) {
            onError(response.data.Exception.Message);
        }
        else {
            $scope.showAlert("Success", "Application added to Rule", "success");
            console.log("Done attached");


        }
    };

    var loadTrunks = function () {
        ruleconfigservice.loadTrunks().then(onTrunkLoadCompleted, onError);
    };

    var loadApplications = function () {
        ruleconfigservice.loadApps().then(onAppLoadCompleted, onError);
    };
    var loadTranslations = function () {
        ruleconfigservice.loadTranslations().then(onTransLoadCompleted, onError);
    };



    var loadSchedules = function () {
        scheduleBackendService.getSchedules().then(function (resSchedule) {

            if(resSchedule.data.IsSuccess)
            {
                $scope.scheduleList=resSchedule.data.Result;
            }

        }).catch(function (errSchedule) {
            onError(errSchedule);
        });
    };


    $scope.saveNewRule = function () {
        //$scope.newObj.Direction=Direction;
        $scope.isPressed=true;
        var isValid = true;
        try {
            new RegExp($scope.newObj.CustomRegEx);
        } catch (e) {
            isValid = false;
        }


        if ($scope.editMode) {
            if (isValid) {
                //ruleconfigservice.updateRules($scope.newObj).then(onSaveCompleted, onError);
                var scheduleID;
                if($scope.newObj.ScheduleId)
                {
                    $scope.newObj.ScheduleId=$scope.newObj.ScheduleId.id;

                }
                if($scope.newObj.ANITranslationId)
                {
                    $scope.newObj.ANITranslationId =  $scope.newObj.ANITranslationId.id;

                }
                if($scope.newObj.TranslationId)
                {
                    $scope.newObj.TranslationId = $scope.newObj.TranslationId.id;
                }
                if($scope.newObj.AppId)
                {
                    $scope.newObj.AppId = $scope.newObj.AppId.id;
                }
                ruleconfigservice.updateRules($scope.newObj).then(function (response) {

                    if (response.data.IsSuccess) {
                        $scope.showAlert("Success", "Rule successfully saved", "success");
                        if ($scope.newObj.id) {

                            $scope.backToList();

                        }



                    }
                    else {
                        $scope.showAlert("Error", "Rule updating failed ", "error");
                        $scope.backToList();
                    }
                }, function (err) {
                    $scope.showAlert("Error", "Rule updating failed ", "error");
                    $scope.backToList();
                    loginService.isCheckResponse(err);
                });
            } else {
                $scope.showAlert("Error", "Invalid fields ", "error");
            }
        }

        else {

            if (isValid) {
                ruleconfigservice.addNewRule($scope.newObj).then(function (resposne) {
                    if(resposne.data.IsSuccess)
                    {
                        $scope.showAlert("Success", "Successfully saved", "success");
                        $scope.backToList();
                    }
                    else
                    {
                        $scope.showAlert("Error", "Saving Failed", "error");

                    }

                }).catch(function (error) {
                    onError(error);
                });
            }
            else {
                $scope.showAlert("Error", "Invalid Custom regEx pattern", "error");
            }

        }


    };

    $scope.makeContextEmpty = function () {
        $scope.newObj.Context = null;
        console.log("After Remove context " + $scope.newObj.Context);
    };
    $scope.makeTrunkEmpty = function () {
        $scope.newObj.TrunkNumber = null;
        console.log("After Remove TrunkNumber " + $scope.newObj.TrunkNumber);
    };

    $scope.makeANITransEmpty = function () {
        $scope.newObj.ANITranslationId = null;
        console.log("After Remove ANITranslation " + $scope.newObj.ANITranslationId);
    };
    $scope.makeDNISTransEmpty = function () {
        $scope.newObj.TranslationId = null;
        console.log("After Remove DNISTranslationId " + $scope.newObj.TranslationId);
    };
    $scope.makeScheduleEmpty = function () {

        $scope.newObj.ScheduleId = null;
        console.log("After Remove Schedule " + $scope.newObj.ScheduleId);
    };
    $scope.makeAppEmpty = function () {
        $scope.newObj.AppId = null;
        console.log("After Remove Application " + $scope.newObj.AppId);
    };

    function loadContexts() {
        ruleconfigservice.getContextList().then(onContextLoad, onError);
    };

    function loadBusinessUnits() {

        if(ShareData.BusinessUnits && ShareData.BusinessUnits.length>0)
        {
            $scope.BusinessUnits=ShareData.BusinessUnits
        }
        else {
            userProfileApiAccess.getBusinessUnits().then(function(result)
            {
                if (result && !result.IsSuccess)
                {
                    var errMsg = "Error occurred while retrieving business units";
                    if(result.CustomMessage)
                    {
                        errMsg = result.CustomMessage;
                    }
                    $scope.showAlert("Call Rule", errMsg, 'error');
                }
                else
                {
                    $scope.BusinessUnits = result.Result;
                }

            }, function(err)
            {
                $scope.showAlert("Call Rule", 'Error occurred while loading business units', 'error');

            });
        }

    };

    $scope.backToList = function () {
        $scope.isPressed=false;
        $state.go('console.rule');
    };

    //loadContexts();
    function initiateProcess() {
        loadSchedules();
        if ($scope.ruleID) {
            ruleconfigservice.getRule($scope.ruleID).then(onRuleLoad, onError);

        }
        else {
            loadContexts();
            loadBusinessUnits();
        }
    };


    $scope.showAdvanced = function () {
        if ($scope.advancedViewSt) {
            $scope.advancedViewSt = false;
        }
        else {
            $scope.advancedViewSt = true;
        }
    };

    $scope.AttachDNISTransToRule = function () {

        if ($scope.editMode) {
            console.log("Id " + $scope.newObj.id);
            console.log("TId " + $scope.newObj.TranslationId.id);
            ruleconfigservice.attchDNISTransToRule($scope.newObj.id, $scope.newObj.TranslationId.id).then(onAttachCompleted, onError);
        }

    };
    $scope.AttachANITransToRule = function () {

        if ($scope.editMode) {
            console.log("Id " + $scope.newObj.id);
            console.log("TId " + $scope.newObj.ANITranslationId.id);
            ruleconfigservice.attchANITransToRule($scope.newObj.id, $scope.newObj.ANITranslationId.id).then(onAttachCompleted, onError);
        }

    };

    $scope.AttachAppToRule = function () {

        if ($scope.editMode) {
            console.log("Id " + $scope.newObj.id);
            console.log("APPId " + $scope.newObj.AppId.id);
            ruleconfigservice.attchAppWithRule($scope.newObj.id, $scope.newObj.AppId.id).then(onAttachCompleted, onError);
        }

    };
    $scope.AttachScheduleToRule = function (scheduleID) {

        if ($scope.editMode) {
            console.log("Id " + $scope.newObj.id);
            console.log("ScheduleId " + scheduleID);
            ruleconfigservice.attachScheduleWithRule($scope.newObj.id, scheduleID).then(function (response) {

                if (!response.data.IsSuccess) {
                    onError(response.data.Exception.Message);
                }
                else
                {
                    $scope.showAlert("Success", "Schedule attached to Rule", "success");
                    console.log("Done Schedule attached");
                    $scope.backToList();
                }


            }).catch(function (error) {
                onError(error);
            });
        }

    };


    $scope.setEnableStatus = function () {

        if ($scope.newObj.ANIRegExPattern == "ANY") {
            $scope.ANIRequired = false;
            $scope.newObj.ANI = null;
        }
        else {
            $scope.ANIRequired = true;
        }
        if ($scope.newObj.RegExPattern == "ANY") {
            $scope.DNISRequired = false;
            $scope.newObj.DNIS = null;
        }
        else {
            $scope.DNISRequired = true;
        }


    }


    initiateProcess();


});