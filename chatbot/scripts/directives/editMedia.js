/**
 * Created by Shehan on 26/1/2018.
 */
mainApp.directive("editmedia", function ($filter, $uibModal, appBackendService, $state) {

    return {
        restrict: "EAA",
        scope: {
            media: "=",
            mediaType: "=",
            mediaTypes: "=",
            'updateIntegration': '&',
            'deleteIntegration': '&'
        },

        templateUrl: 'chatbot/views/partials/editmediaFiles.html',

        link: function (scope) {

            scope.templateType = scope.templateType;

            scope.getSelectedTemplateType = function(){
                angular.for
            }
            scope.selectedTemplateType = scope.getSelectedTemplateType(scope.templateType);

            scope.copyCardID = function (cardID) {

                var id = cardID;
                window.getSelection().empty();
                var copyField = document.getElementById(id);
                var range = document.createRange();
                range.selectNode(copyField);
                window.getSelection().addRange(range);
                document.execCommand('copy');
                scope.showAlert("Card ID", 'Card ID copied to clipboard.', "success");
            }

            // scope.removeTemplate = function (item) {

            //     scope.showConfirm("Delete Integration", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.name, function (obj) {
            //         scope.deleteIntegration(scope.template);

            //     }, function () {

            //     }, item);
            // };

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

        controller: function($scope, $state, botintegrationService, $window) { 

            $scope.bodyDisabled= false; 
            $scope.errorMsg = false;

            $scope.closeMedia = function () {
                $scope.editMode = false;
                
            };

            $scope.editMedia = function (temp) {
                $scope.integrate = {};
                console.log(temp);
                
                $scope.editMode = true;
                $scope.integrate= temp;
                console.log($scope.integrate);

            };

        }

    }
});