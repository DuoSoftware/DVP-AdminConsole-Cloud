/**
 * Created by Shehan on 26/1/2018.
 */
mainApp.directive("edittemplate", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            template: "=",
            templateCategory: "=",
            templateTypes: "=",
            templateContentTypes: "=",
            'updateTemplate': '&',
            'deleteTemplate': '&'
        },

        templateUrl: 'chatbot/views/partials/editTemplate.html',

        link: function (scope) {

            scope.templateCategory = scope.templateCategory;

            scope.getTemplateItemObject = function (type) {
                var returnObj = {};
                switch (type.toLowerCase()) {
                    case "card": {
                        returnObj = {
                            buttons: [],
                            default_action: {
                                url: ""
                            },
                            image_url: "",
                            sub_title: "",
                            title: "<new card>"
                        }
                        break;
                    }
                    case "quick reply": {
                        returnObj = {
                            title: "<quick reply>",
                            type: "",
                            payload: "",
                            image: ""
                        }
                        break;
                    }
                }
                return returnObj;
            }

            scope.editTemplate = function () {
                scope.editMode = !scope.editMode;
            };

            scope.removeCard = function (index) {
                var item = scope.template.items[index];
                scope.showConfirm("Delete Card", "Delete", "ok", "cancel", "Are you sure you want to delete \"" + item.title + "\" Card?", function (obj) {
                    scope.$apply(function () {
                        scope.template.items.splice(index, 1);
                    });
                }, function () {

                }, item);
            }

            scope.addNewCard = function () {
                debugger
                scope.template.items.push(scope.getTemplateItemObject(scope.templateCategory));
            }

            scope.copyTemplateID = function (cardID, type) {
                debugger
                var id = cardID;

                var copyText = document.getElementById(id);
                copyText.select();
                document.execCommand("Copy");

                // window.getSelection().empty();
                // var copyField = document.getElementById(id);
                // var range = document.createRange();
                // range.selectNode(copyField);
                // window.getSelection().addRange(range);
                // document.execCommand('copy');
                scope.showAlert(type, type + ' ID was successfully copied into the Clipboard.', "success");
            }

            scope.removeTemplate = function (item) {

                scope.showConfirm("Delete Template", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.name, function (obj) {

                    scope.deleteTemplate(scope.template);
                    // appBackendService.deleteApplication(scope.application).then(function (response) {
                    //     if (response) {
                    //         scope.updateApplication(item);
                    //         scope.showAlert("Deleted","File " + item.AppName + " Deleted successfully","success");
                    //     }
                    //     else
                    //         scope.showAlert("Error", "Error in file removing", "error");
                    // }, function (error) {
                    //     scope.showAlert("Error", "Error in file removing", "error");
                    // });

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

        }

    }
});