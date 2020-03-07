

'use strict';

mainApp.controller('autoattendancelistcontroller', function ($scope,$state,
                                                             autottendanceconfigservice,$location) {

    // Update the dataset at 25FPS for a smoothly-animating chart
    $scope.aas = [];
    $scope.searchCriteria = "";

    $scope.showAlert = function (title,content,type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    var onError = function (error) {

    };

    var getAllAAS= function () {
        $scope.aas=null;
        autottendanceconfigservice.getAutoAttendances().then(onGetAllAAs,onError);
    };

    $scope.deleteAA= function(aa){

        autottendanceconfigservice.deleteAutoAttendance(aa.Name).then(onAADeleted,onError);

    };

    $scope.addNewAA = function () {
        $state.go('console.newautoattendance');
    };

    $scope.editAA = function (aa) {
        $state.go('console.editautoattendance',{aa: aa});
    };

    var onGetAllAAs = function (response) {
        if (response.data.Exception) {
            onError(response.data.Exception.Message);
        }
        else {

            $scope.aas =response.data.Result ;
            console.log($scope.aas);
        }

    };


    var onAADeleted = function (response) {
        if (response.data.Exception) {
            $scope.showAlert("Error","Deletion failed","error");
            onError(response.data.Exception.Message);
        }
        else {
            $scope.showAlert("Deleted","Successfully deleted","success");
            getAllAAS();
        }

    };



    getAllAAS();



    ///////////////////////////////////////////////////old/////////////////////////////////////

    //

    //
    //var onInRulePicked = function (response) {
    //    if (response.data.Exception) {
    //        onError(response.data.Exception.Message);
    //    }
    //    else {
    //
    //
    //
    //        $scope.ruleObj =response.data.Result ;
    //        $scope.isInbound=true;
    //        console.log("Only IN selected "+$scope.ruleObj);
    //    }
    //
    //};
    //
    //var onOutRulePicked = function (response) {
    //    if (response.data.Exception) {
    //        onError(response.data.Exception.Message);
    //    }
    //    else {
    //
    //        $scope.ruleObj =response.data.Result ;
    //        $scope.isInbound=false;
    //        console.log("Only Out selected "+$scope.ruleObj);
    //    }
    //
    //};
    //
    //
    //
    //var getAllRules= function () {
    //    $scope.ruleObj=null;
    //    ruleconfigservice.allRulePicker().then(onAllRulePicked,onError);
    //};
    //
    //var getInRules = function () {
    //    $scope.ruleObj=null;
    //    ruleconfigservice.inboundRulePicker().then(onInRulePicked,onError);
    //};
    //
    //var getOutRules = function () {
    //    $scope.ruleObj=null;
    //    ruleconfigservice.outboundRulePicker().then(onOutRulePicked,onError);
    //};
    //
    //$scope.onBtnPressed = function (btnName) {
    //
    //    if(btnName=="IN")
    //    {
    //        if($scope.inBtnSt==true)
    //        {
    //            setButtonAppearance("btn_in",true);
    //            $scope.inBtnSt=false;
    //        }
    //        else
    //        {//document.getElementById("btn_in").style.opacity = "1";
    //            setButtonAppearance("btn_in",false);
    //            $scope.inBtnSt=true;
    //        }
    //    }
    //    else
    //    {
    //        if($scope.outBtnSt==true)
    //        {
    //            setButtonAppearance("btn_out",true);
    //            $scope.outBtnSt=false;
    //        }
    //        else
    //        {
    //            setButtonAppearance("btn_out",false);
    //            $scope.outBtnSt=true;
    //        }
    //    }
    //
    //
    //    fillTable();
    //};
    //
    //
    //var fillTable = function () {
    //
    //    if($scope.inBtnSt&& $scope.outBtnSt)
    //    {
    //
    //
    //        getAllRules();
    //    }
    //    else if($scope.inBtnSt && !$scope.outBtnSt)
    //    {
    //
    //        getInRules();
    //    }
    //    else if(!$scope.inBtnSt && $scope.outBtnSt)
    //    {
    //
    //        getOutRules();
    //    }
    //    else
    //    {
    //
    //
    //        $scope.ruleObj=null;
    //    }
    //
    //};
    //
    //var setButtonAppearance = function (btnId,pressed)
    //{
    //    if(pressed)
    //    {
    //        //background: #2ba89c
    //        document.getElementById(btnId).style.backgroundColor = "#999";
    //       // document.getElementById(btnId).style.opacity = "1";
    //    }
    //    else
    //    {
    //        document.getElementById(btnId).style.backgroundColor = "#2ba89c";
    //        //document.getElementById(btnId).style.opacity = "2";
    //    }
    //
    //};
    //
    //$scope.addNewRule = function () {
    //    $state.go('console.newrule');
    //};
    //
    //$scope.deleteRule= function(rule){
    //
    //    ruleconfigservice.deleteRules(rule).then(onRuleDeleted,onError);
    //
    //};
    //
    //$scope.editRule = function (rule) {
    //    //$location.path("/new-rule/"+rule.id);
    //    $state.go('console.editrule',{id:rule.id});
    //}
    //
    //var refershPage= function () {
    //    $scope.ruleObj = null;
    //    $scope.inBtnSt=true;
    //    $scope.outBtnSt=true;
    //    $scope.isCallMonitorOption=0;
    //    getAllRules();
    //}




});


