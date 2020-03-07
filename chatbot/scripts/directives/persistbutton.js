/**
 * Created by Shehan on 25/4/2018.
 */
mainApp.directive("persistbutton", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            button: "="
        },
        templateUrl: 'chatbot/views/partials/persistbutton.html',
        link: function (scope) {
            scope.mode = "view"

            scope.changeMode = function (mode) {
                scope.mode = mode
            };
        }

    }
});