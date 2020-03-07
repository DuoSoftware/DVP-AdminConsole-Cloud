/**
 * Created by Shehan on 29/1/2018.
 */
mainApp.directive("workflow", function ($filter, $uibModal, appBackendService, setupAIService) {

    return {
        restrict: "EAA",
        scope: {
            wfdata: "=",
            'editwf': '&'
        },

        templateUrl: 'chatbot/views/partials/workflow.html',

        link: function (scope) {
            scope.mode = "view";
            scope.changeMode = function (mode) {
                scope.mode = mode
            };

            scope.editWorkflow = function (data) {
                scope.editwf(data);
            }

            scope.deleteWorkflow = function (data) {
                debugger
                setupAIService.DeleteWorkFlow(data.ID, data.WFID).then(function (response) {
                    console.log(response);
                    if (response.data !== 0) {
                        console.log($scope.workFlowNames);

                    } else {
                        // add msg here
                    }

                }, function (error) {
                    // add message here
                });
            }

        }

    }
});