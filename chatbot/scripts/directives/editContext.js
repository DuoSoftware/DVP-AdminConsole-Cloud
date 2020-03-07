/**
 * Created by divani on 9/3/2018.
 */
mainApp.directive("editchatbotcontext", function ($filter, $uibModal, appBackendService, $state) {

    return {
        restrict: "EAA",
        scope: {
            context: "=",
            entitylist: "=",
            'updateContext': '&',
            'deleteContext': '&'
        },

        templateUrl: 'chatbot/views/partials/editChatbotcontext.html',

        link: function (scope) {

            debugger
            console.log(scope.context);

            scope.removeContext = function (item) {

                scope.showConfirm("Delete Context", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.workflowName, function (obj) {
                    scope.deleteContext(scope.context);

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

        controller: function ($scope, $state, setupAIService) {

            // $scope.contxMap = [{ entityName: "", contextName: ""}];

            $scope.addcontxMap = function() {
                $scope.context.contextMapping.push({});
            }
        
            $scope.deletecontextMap = function(index) {
                for (var n = $scope.context.contextMapping.length - 1; n >= 0; n--) {
                    if (n == index) {
                        $scope.context.contextMapping.splice(n, 1);
                    }
                }
            }

            $scope.getWorkflows = function () {
                setupAIService.GetWorkFlow().then(function (response) {
                    console.log(response);
                    if (response.data !== 0) {
                        $scope.workFlowNames = response.data;
                       
                    } else {
                        $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
                    }
        
                }, function (error) {
                    $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
                });
            }
            $scope.getWorkflows();

            $scope.closeTemplate = function () {
                $scope.editMode = false;
            };

            $scope.editContext = function (context) {
                console.log(context);
                $scope.editMode = true;
            };
        }
    }
});
