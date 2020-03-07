/**
 * Created by divani on 9/3/2018.
 */
mainApp.directive("editentity", function ($filter, $uibModal, appBackendService, $state) {

    return {
        restrict: "EAA",
        scope: {
            entity: "=",
            entityType: "=",
            entityTypes: "=",
            botlist: "=",
            'updateEntity': '&',
            'deleteEntity': '&'
        },

        templateUrl: 'chatbot/views/partials/editEntity.html',

        link: function (scope) {

            debugger
            console.log(scope.entity);

            scope.removeEntity = function (item) {

                scope.showConfirm("Delete Entity", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.entityName, function (obj) {
                    scope.deleteEntity(scope.entity);

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

        controller: function ($scope, $state) {

            $scope.closeTemplate = function () {
                $scope.editMode = false;
            };

            $scope.editEntity = function (entity) {
                console.log(entity);
                $scope.editMode = true;
            };
        }
    }
});
