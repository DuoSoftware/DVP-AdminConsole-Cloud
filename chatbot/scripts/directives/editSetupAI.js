/**
 * Created by divani on 9/3/2018.
 */
mainApp.directive("editsetupai", function ($filter, $uibModal, appBackendService, $state) {

    return {
        restrict: "EAA",
        scope: {
            setupai: "=",
            setupaiType: "=",
            setupaiTypes: "=",
            botlist: "=",
            'updaterule': '&',
            'deleteSetupai': '&'
        },

        templateUrl: 'chatbot/views/partials/editSetupAI.html',

        link: function (scope) {

            debugger
            console.log(scope.setupai);

            scope.removeSetupai = function (item) {

                scope.showConfirm("Delete Setup AI", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.workFlowName, function (obj) {
                    scope.deleteSetupai(scope.setupai);

                }, function () {

                }, item);
            };

            /* Start of Default methods*/

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

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

            scope.showAlert = function (title, content, type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            /* End of Default Methods */

        },

        controller: function ($scope, $state, setupAIService, chatbotService) {

            // $scope.getAllBots = function () {
            //     chatbotService.GetAllChatbots().then(function (response) {
            //         if (response.data.IsSuccess) {
            //             $scope.allbots = response.data.Result;
            //         } else {
            //             $scope.showAlert("ChatBot", 'error', "Fail To load Bots.");
            //         }

            //     }, function (error) {
            //         $scope.showAlert("ChatBot", 'error', "Fail To load Bots.");
            //     });
            // };
            // $scope.getAllBots();

            $scope.getWorkflows = function () {
                setupAIService.GetWorkFlow().then(function (response) {
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

            // $scope.getAllSetupAi = function () {
            //     setupAIService.GetAllSetupAI().then(function (response) {
            //         if (response.data.IsSuccess) {
            //             // $scope.allsetupai = response.data.Result;
            //             // console.log($scope.allsetupai);

            //         } else {
            //             $scope.showAlert("Setup AI", 'error', "Fail To load setup ai.");
            //         }

            //     }, function (error) {
            //         $scope.showAlert("Set up AI", 'error', "Fail To load setup ai.");
            //     });
            // }
            // $scope.getAllSetupAi();

            $scope.closeTemplate = function () {
                $scope.editMode = false;
                $scope.getAllSetupAi();
            };

            $scope.editSetupai = function (setupai) {
                console.log(setupai);
                $scope.editMode = true;
            };
        }
    }
});
