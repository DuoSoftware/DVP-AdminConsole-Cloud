/**
 * Created by Pawan on 9/26/2017.
 */

mainApp.controller("queueSettingsController", function ($scope, $state, loginService,$anchorScroll,queueSettingsBackendService,attributeService,ardsBackendService) {

    $anchorScroll();

    $scope.ArdsList = [];
    $scope.attributeGroups = [];
    $scope.attributeGroup;
    $scope.RequestServers = [];
    $scope.groupAttributes=[];
    $scope.attributeSkills=[];
    $scope.showAttrib=false;
    $scope.showSkill=false;
    $scope.showArds=true;
    $scope.newSetting={};
    $scope.newSetting.PublishPosition=false;
    $scope.skillObj=[];
    $scope.addedCombinations =[];
    $scope.showAdd=false;
    $scope.isDisabled=false;

    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };
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


    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(group) {
            return (group.GroupName.toLowerCase().indexOf(lowercaseQuery) != -1);
            ;
        };
    }

    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.attributeSkills) {
                return $scope.attributeSkills;
            }
            else {
                return [];
            }

        }
        else {
            var results;
            if($scope.attributeSkills)
            {
                results = query ? $scope.attributeSkills.filter(createFilterFor(query)) : [];

            }
            return results;
        }

    };

    $scope.onChipDelete = function (chip) {

        $scope.groupAttributes.push(chip.attribute);


    };

    $scope.reloadPage = function () {
        $state.reload();
    };

    $scope.GetQueueSettingRecords = function () {

        queueSettingsBackendService.getQueueSettingRecords().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Queue Setting Records " + response.data.Exception);
            }
            else {
                $scope.settingList = response.data.Result;
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {

            console.info("Error in picking Queue Setting Records " + error);
        });

    };

    $scope.LoadAttributes = function (ards) {

        $scope.showArds=false;
        $scope.showAttrib=false;
        $scope.showSkill=false;
        $scope.groupAttributes=[];
        $scope.attributeSkills=[];
        $scope.newSetting.attribute={};

        var ardsData = JSON.parse(ards);
        $scope.groupAttributes =ardsData.AttributeMeta;
        $scope.showAttrib=true;


    };

    $scope.LoadSkills = function (attribute) {

        $scope.showSkill=false;
        $scope.attributeSkills=[];

        var attributeData = JSON.parse(attribute);
        $scope.attributeSkills =attributeData.AttributeDetails;
        $scope.showSkill=true;
    }

    $scope.AddNewCombination=function (ards,attribute,skill) {

        var skillData=JSON.parse(skill);
        var obj = {
            skillName:skillData.Name,
            skillId:skillData.Id,
            attribute:JSON.parse(attribute)
        }

        if(!$scope.newSetting.skillObj)
        {
            $scope.newSetting.skillObj=[];
        }

        $scope.newSetting.skillObj.push(obj);

        RefreshResources(JSON.parse(attribute));


    }

    $scope.LoadARDSRecords =function () {

        ardsBackendService.getArdsRecords().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Ards list " + response.data.Exception);
            }
            else {


                $scope.ArdsList = response.data.Result;



            }

        }, function (error) {

            console.info("Error in picking Ards service " + error);
        });

    }

    var RefreshResources = function (attribute) {

        $scope.groupAttributes=$scope.groupAttributes.filter(function (item) {

            if(item.AttributeGroupName==attribute.AttributeGroupName)
            {
                $scope.addedCombinations.push(item);
            }

            return item.AttributeGroupName!=attribute.AttributeGroupName

        });

        $scope.showSkill=false;
        $scope.attributeSkills=[];
        $scope.newSetting.skill=null;
        $scope.newSetting.attribute=null;



    };

    var resetObjects = function () {
        $scope.newSetting.skillObj=[];
        $scope.newSetting.QueueName=null;
        $scope.newSetting.MaxWaitTime=null;
        $scope.newSetting.CallAbandonedThreshold=null;
        $scope.newSetting.CallAbandonedThreshold=null;
        $scope.newSetting.PublishPosition=false;


    }

    $scope.addQueueSettings = function () {

        $scope.isDisabled = true;

        var ardsObj = JSON.parse($scope.newSetting.ards);
        $scope.newSetting.ServerType=ardsObj.ServerType;
        $scope.newSetting.RequestType=ardsObj.RequestType;
        $scope.newSetting.Skills = $scope.newSetting.skillObj.map(function (item) {

            return item.skillId;
        });

        queueSettingsBackendService.saveQueueSetting($scope.newSetting).then(function (response) {

            $scope.isDisabled = false;

            if(!response.data.IsSuccess)
            {
                if(response.data.Exception && response.data.Exception.Message=="Validation error")
                {
                    $scope.showAlert("Error","Queue Settings Adding Failed / Record Already Exists",'error');
                }
                else {
                    $scope.showAlert("Error","Queue Settings Adding Failed",'error');
                }

            }
            else {
                $scope.showAlert("Success","Queue Settings Added Successfully",'success');
                resetObjects();
                $scope.GetQueueSettingRecords();
                $scope.showArds=true;
            }

        },function (error) {
            $scope.showAlert("Error","Queue Settings Adding Failed",'error');
            $scope.isDisabled = false;
        });


    }

    $scope.GetQueueSettingRecords();
    $scope.LoadARDSRecords();


});