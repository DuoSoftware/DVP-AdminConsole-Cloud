/**
 * Created by Pawan on 6/3/2016.
 */

'use strict';

mainApp.controller('rulelistcontroller', function ($scope,$state, ruleconfigservice,$location, notificationService,$anchorScroll) {

    // Update the dataset at 25FPS for a smoothly-animating chart
    $anchorScroll();
    $scope.ruleObj = {};
    $scope.inBtnSt=true;
    $scope.outBtnSt=true;
    $scope.isCallMonitorOption=0;
    $scope.isInbound=true;
    $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};
    $scope.showAlert = function (title,content,type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };



    var onRuleDeleted = function (response) {
        if (response.data.Exception) {
            $scope.showAlert("Error","Deletion failed","error");
            onError(response.data.Exception.Message);
        }
        else {

            /*var val = 0;
             for (var i = 0, len = $scope.ruleObj.length; i < len; i++) {

             if($scope.ruleObj[i].id == response.data.id) {
             val = i;

             break;

             }
             }
             $scope.ruleObj.splice(val, 1);*/
            $scope.showAlert("Deleted","Successfully deleted","success");
            refershPage();



        }

    };

    var onAllRulePicked = function (response) {
        if (response.data.Exception) {
            onError(response.data.Exception.Message);
        }
        else {


            $scope.isInbound=true;
            $scope.ruleObj =response.data.Result ;

        }

    };
    var onInRulePicked = function (response) {
        if (response.data.Exception) {
            onError(response.data.Exception.Message);
        }
        else {



            $scope.ruleObj =response.data.Result ;
            $scope.isInbound=true;
            console.log("Only IN selected "+$scope.ruleObj);
        }

    };
    var onOutRulePicked = function (response) {
        if (response.data.Exception) {
            onError(response.data.Exception.Message);
        }
        else {

            $scope.ruleObj =response.data.Result ;
            $scope.isInbound=false;
            console.log("Only Out selected "+$scope.ruleObj);
        }

    };

    var onError = function (error) {

    };
    var getAllRules= function () {
        $scope.ruleObj=null;
        ruleconfigservice.allRulePicker().then(onAllRulePicked,onError);
    };

    var getInRules = function () {
        $scope.ruleObj=null;
        ruleconfigservice.inboundRulePicker().then(onInRulePicked,onError);
    };
    var getOutRules = function () {
        $scope.ruleObj=null;
        ruleconfigservice.outboundRulePicker().then(onOutRulePicked,onError);
    };

    $scope.onBtnPressed = function (btnName) {

        if(btnName=="IN")
        {
            if($scope.inBtnSt==true)
            {
                setButtonAppearance("btn_in",true);
                $scope.inBtnSt=false;
            }
            else
            {//document.getElementById("btn_in").style.opacity = "1";
                setButtonAppearance("btn_in",false);
                $scope.inBtnSt=true;
            }
        }
        else
        {
            if($scope.outBtnSt==true)
            {
                setButtonAppearance("btn_out",true);
                $scope.outBtnSt=false;
            }
            else
            {
                setButtonAppearance("btn_out",false);
                $scope.outBtnSt=true;
            }
        }


        fillTable();
    };


    var fillTable = function () {

        if($scope.inBtnSt&& $scope.outBtnSt)
        {


            getAllRules();
        }
        else if($scope.inBtnSt && !$scope.outBtnSt)
        {

            getInRules();
        }
        else if(!$scope.inBtnSt && $scope.outBtnSt)
        {

            getOutRules();
        }
        else
        {


            $scope.ruleObj=null;
        }

    };

    var setButtonAppearance = function (btnId,pressed)
    {
        if(pressed)
        {
            //background: #2ba89c
            document.getElementById(btnId).style.backgroundColor = "#999";
           // document.getElementById(btnId).style.opacity = "1";
        }
        else
        {
            document.getElementById(btnId).style.backgroundColor = "#2ba89c";
            //document.getElementById(btnId).style.opacity = "2";
        }

    };

    $scope.addNewRule = function () {
        $state.go('console.newrule');
    };

    $scope.deleteRule= function(rule){

        // Sanura Wijayarathne - 2019/11/08
        $scope.showConfirm("Delete Operation", "Delete", "ok", "cancel", "Do you want to delete ", function () {
            ruleconfigservice.deleteRules(rule).then(onRuleDeleted,onError);
            console.log(rule)
        }, function () {

        }, rule
        );

    };

    $scope.editRule = function (rule) {
        //$location.path("/new-rule/"+rule.id);
        $state.go('console.editrule',{id:rule.id});
    };

    var refershPage= function () {
        $scope.ruleObj = null;
        $scope.inBtnSt=true;
        $scope.outBtnSt=true;
        $scope.isCallMonitorOption=0;
        getAllRules();
    }

    getAllRules();
    // Sanura Wijayarathne - 2019/11/08
    $scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

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

});


