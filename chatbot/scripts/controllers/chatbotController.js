mainApp.controller('chatbotController', function ($scope, $q, $anchorScroll, chatbotService, $state, $uibModal, integrationsService) {
    $anchorScroll();

    console.log("Chatbot controller is up!");

    $scope.createuuid = function () {
        var uuid = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
        var hostname = window.location.hostname;
        var code = window.btoa(hostname + "-" + uuid)
        code = code.replace(/=/g, '');
        return code;
    }
    
    //Create New Bot
    $scope.CreateNewBot = function (newBot) {

        var bot = {
            "name": newBot.name,
            "screen_name": newBot.name,
            "description": newBot.description,
            "status": true,
            "company": -1,
            "tenant": -1,
            "channel_facebook": {
                "company": -1,
                "tenant": -1,
                "page_id": "",
                "app_id": "",
                "app_secret": "",
                "page_token": "",
                "verification_token": $scope.createuuid()
            },
            "channel_slack": {
                "company": -1,
                "tenant": -1,
                "client_id": "",
                "client_secret": "",
                "verification_token": "",
                "api_token": "",
                "bot_token": ""

            },
            "ai":{
                "name" : "default",
                "key": "",
                "description": ""
            },
            "entities" :[],
            "avatar": "11111111111111111111111111111111111111111111"
        }

        chatbotService.CreateChatbot(bot).then(function (response) {
            if (response.data.IsSuccess) {
                $scope.showAlert("ChatBot", 'success', "Bot Created Successfully.");
                $scope.showAlert("Next Step", 'info', "Now you may configure \"" + newBot.name + "\" with your Integration settings");
                $scope.newBot = {};
                $scope.getAllBots();
            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To Create Bot.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To Create Bot.");

        });

    };

    //Get All Bots
    $scope.getAllBots = function () {
        chatbotService.GetAllChatbots().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allbots = response.data.Result;
                //$scope.allbots = temp.Result;
            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To load Bot.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To load Bot.");
        });
    };
    $scope.getAllBots();

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }
    $scope.reloadPage = function () {
        $state.reload();
    };


});