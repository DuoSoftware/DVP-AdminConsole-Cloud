/**
 * Created by Shehan on 30/1/2018.
 */
mainApp.directive("cardbutton", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            button: "="
        },
        templateUrl: 'chatbot/views/partials/cardbutton.html',
        link: function (scope) {
            scope.mode = "view"

            scope.changeMode = function (mode) {
                scope.mode = mode
            };
        }

    }
});