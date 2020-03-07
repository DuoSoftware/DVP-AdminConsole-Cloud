mainApp.controller('setupAIController', function ($scope, $q, $anchorScroll, $state, setupAIService, $auth, chatbotService) {
    $anchorScroll();

    console.log("Setup AI controller is up!");

    $scope.buttonName = "SAVE";
    $scope.checkData = false;
    $scope.notFound = false;
    $scope.checkWorkFlowMatching = false;
    $scope.notMatchingKeyWord = false;

    $scope.setupAI = {
        "workFlowName": "",
        "events": [],
        "enable": true
    };

    $scope.createNewAutomation = function () {
        debugger
        var profile = $auth.getPayload();
        var url = "https://" + profile.companyName + ".smoothflow.io/app/";
        var win = window.open(url, '_blank');
        win.focus();
    }

    $scope.testWorkFlowForText = {
        "message": ""
    }

    $scope.getworkflowfortextAPIUrl = function (workflowfortext) {
        console.log(workflowfortext);
        $scope.checkWorkFlowMatching = true;
        setupAIService.SetWorkFlowForText(workflowfortext).then(function (response) {
            console.log(response);
            $scope.checkWorkFlowMatching = false;
            console.log(response.status);
            if (response.status == 200) {
                $scope.testWorkForText = response.data;
                console.log($scope.testWorkForText);

                if (response.data.IsSuccess == false) {

                    //ai coudn't found any matching work flow
                    $scope.checkWorkFlowMatching = false;
                    $scope.checkData = false;
                    $scope.notFound = true;
                    if (response.data.Result.aiResolution.entities.length !== 0) {
                        $scope.notMatchingKeyWord = true;

                    }
                    else {
                        $scope.notMatchingKeyWord = false;

                    }

                    console.log('ai could not found any matching work flow');
                }
                else {

                    $scope.checkWorkFlowMatching = false;
                    $scope.checkData = true;
                    $scope.notFound = false;
                    $scope.notMatchingKeyWord = false;

                    $scope.showAlert("WorkFlow For Text", 'success', response.data.CustomMessage);
                }

            } else {
                $scope.checkData = false;
                $scope.notFound = false;
                $scope.checkWorkFlowMatching = false;
                $scope.notMatchingKeyWord = false;

                $scope.showAlert("WorkFlow For Text", 'error', "Fail To config workFlow for text.");
            }

        }, function (error) {
            $scope.checkData = false;
            $scope.notFound = false;
            $scope.checkWorkFlowMatching = false;
            $scope.notMatchingKeyWord = false;
            $scope.showAlert("WorkFlow For Text", 'error', "Fail To config workFlow for text.");
        });
    }

    //Get All Bots
    $scope.getAllBots = function () {
        chatbotService.GetAllChatbots().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allbots = response.data.Result;
                //$scope.allbots = temp.Result;
            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To load Bots.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To load Bots.");
        });
    };
    $scope.getAllBots();

    $scope.getWorkflows = function () {
        setupAIService.GetWorkFlow().then(function (response) {
            console.log(response);
            if (response.data !== 0) {
                $scope.workFlowNames = response.data;
                console.log($scope.workFlowNames);

            } else {
                $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
            }

        }, function (error) {
            $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
        });
    }
    $scope.getWorkflows();

    $scope.checkTextForEnter = function (event) {
        if (event.which === 13) {
            $scope.getworkflowfortextAPIUrl($scope.testWorkFlowForText);
            event.preventdefault();
        }
    }

    $scope.createSetupAI = function (setup) {

        console.log(setup);
        $scope.setup = setup;
        $scope.events = [];
        for (var i = 0; i < setup.events.length; i++) {
            for (var key in setup.events[i]) {
                $scope.events.push(setup.events[i][key]);
                console.log($scope.events);
            }

        }
        $scope.setup.events = [];
        $scope.setupai = {};
        $scope.setupai.ruleName = $scope.setup.ruleName;
        $scope.setupai.description = $scope.setup.description;
        $scope.setupai.enable = $scope.setup.enable;
        $scope.setupai.workFlowName = $scope.setup.workFlowName;
        $scope.setupai.events = $scope.events;
        $scope.setupai.botAppId = $scope.setup.botAppId;

        console.log($scope.setupai);
        setupAIService.CreateSetupAI($scope.setupai).then(function (response) {
            if (response.data.IsSuccess) {
                $scope.showAlert("Setup AI", 'success', "Setup AI Created Successfully.");
                $scope.getAllSetupAi();
                $scope.editMode = false;
            } else {
                $scope.showAlert("Setup AI", 'error', "Fail To Create Setup AI.");
            }

        }, function (error) {
            $scope.showAlert("Setup AI", 'error', "Fail To Create Setup AI.");

        });

    };

    $scope.getAllSetupAi = function () {
        setupAIService.GetAllSetupAI().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allsetupai = response.data.Result;
                console.log($scope.allsetupai);

                // console.log($scope.allsetupai);
                // for (var i=0; i<$scope.allsetupai.length; i++) {
                //     for (var j=0; j<$scope.workFlowNames.length; j++) {
                //         if($scope.allsetupai[i].workFlowName === $scope.workFlowNames[j].Name){
                //             $scope.workFlowNames.splice(j, 1);
                //         }

                //     }
                // }

            } else {
                $scope.showAlert("Setup AI", 'error', "Fail To load setup ai.");
            }

        }, function (error) {
            $scope.showAlert("Set up AI", 'error', "Fail To load setup ai.");
        });
    }
    $scope.getAllSetupAi();

    $scope.updateSetupai = function (setup) {
        debugger
        console.log(setup);
        $scope.setup = setup;
        $scope.events = [];
        for (var i = 0; i < setup.events.length; i++) {
            for (var key in setup.events[i]) {
                $scope.events.push(setup.events[i][key]);
                console.log($scope.events);
            }

        }
        $scope.setup.events = [];
        $scope.setupai = {};
        $scope.setupai.enable = $scope.setup.enable;
        $scope.setupai.workFlowName = $scope.setup.workFlowName;
        $scope.setupai.events = $scope.events;
        $scope.setupai.company = $scope.setup.company;
        $scope.setupai.tenant = $scope.setup.tenant;
        $scope.setupai.botAppId = $scope.setup.botAppId;
        $scope.setupai._id = $scope.setup._id;
        $scope.setupai.__v = $scope.setup.__v;

        console.log($scope.setupai);
        setupAIService.UpdateSetupAI($scope.setupai).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Setup AI", 'success', "Setup AI updated successfully.");
                $scope.getAllSetupAi();
            } else {
                $scope.showAlert("Setup AI", 'error', "Failed to update setup ai.");
            }

        }, function (error) {
            $scope.showAlert("Setup AI", 'error', "Fail To update setup ai.");
        });
    }

    $scope.deleteSetupai = function (setup) {
        setupAIService.DeleteSetupAI(setup).then(function (response) {
            console.log(response._id);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Setup AI", 'success', "Setup AI deleted successfully.");
                $scope.getAllSetupAi();
            } else {
                $scope.showAlert("Setup AI", 'error', "Failed to delete setup ai.");
            }
        }, function (error) {
            $scope.showAlert("Setup AI", 'error', "Failed to delete setup ai.");
        });

    }


    $scope.createAiModel={};

    $scope.closeModal = function(){
        $scope.editMode = false;
        $scope.createAiModel = {};
    }
    $scope.showCreateModel = false;
    $scope.train = function(trainDetails){
        $scope.editMode = !$scope.editMode;
        $scope.createAiModel.events = [];
        console.log($scope.testWorkForText.Result.allKeyWords);
        if($scope.testWorkForText.Result.flowName == "NotFound"){
            $scope.modalName = "Create AI";
            $scope.showCreateModel = true;
            $scope.createAiModel.events.push(trainDetails.name);
        }
        else{
            $scope.modalName = "Edit AI"
            $scope.createAiModel.workFlowName = $scope.testWorkForText.Result.flowName;
            // $scope.createAiModel.botAppId = $scope.testWorkForText.Result.id;
            $scope.showCreateModel = false;
            debugger;
            if(trainDetails.tagged == false){
                $scope.createAiModel.events=[];
                 $scope.createAiModel.events= angular.copy($scope.testWorkForText.Result.allKeyWords);
                 $scope.createAiModel.events.push(trainDetails.name);

                for(var i = $scope.createAiModel.events.length-1; i--;){
                    if ($scope.createAiModel.events[i] === trainDetails.name) 
                    $scope.createAiModel.events.splice(i, 1);
                }
                console.log($scope.createAiModel.events);
            }
            else{
                 $scope.createAiModel.events= angular.copy($scope.testWorkForText.Result.allKeyWords);
            }
            $scope.createAiModel._id=$scope.testWorkForText.Result.id;

        }
        console.log($scope.createAiModel.events);
     
        console.log(trainDetails);
    }

    $scope.updateTrainModelData = function(setup){
        $scope.setup = setup;
        $scope.events = [];
        for (var i = 0; i < setup.events.length; i++) {
            for (var key in setup.events[i]) {
                $scope.events.push(setup.events[i][key]);
                console.log($scope.events);
            }

        }
        $scope.setup.events = [];
        $scope.setupai = {};
        $scope.setupai.workFlowName = $scope.setup.workFlowName;
        $scope.setupai.events = $scope.events;
        $scope.setupai._id = $scope.setup._id;

        console.log($scope.setupai);
        setupAIService.UpdateSetupAI($scope.setupai).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Setup AI", 'success', "Setup AI updated successfully.");
                $scope.getAllSetupAi();
                $scope.editMode = false;
                $scope.notMatchingKeyWord = false;
                $scope.checkData = false;
            } else {
                $scope.showAlert("Setup AI", 'error', "Failed to update setup ai.");
            }

        }, function (error) {
            $scope.showAlert("Setup AI", 'error', "Fail To update setup ai.");
        });
    }
    $scope.reloadPage = function () {
        
        $state.reload();
    };


});
