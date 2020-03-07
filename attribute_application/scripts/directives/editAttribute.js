/**
 * Created by Rajinda on 5/30/2016.
 */
mainApp.directive("editattribute", function (attributeService) {

    return {
        restrict: "EA",
        scope: {
            attribute: "=",
            'updateAttribute': '&'
        },

        templateUrl: 'attribute_application/partials/template/editAttribute.html',
        /*template: '<span class="count_top"  ><i class="fa fa-user" ></i> {{fileCount.Category| uppercase}}</span><div class="count green">{{fileCount.Count}}</div><span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>Total Number of Files</i></span>',*/

        link: function (scope, element, attributes) {

            scope.editAttribute = function(){
                scope.editMode=!scope.editMode;
            };
            scope.editMode=false;

            scope.updateAttributes = function(item) {

                attributeService.UpdateAttribute(item).then(function (response) {
                    if (response) {
                        console.info("UpdateAttributes : " + response);
                        scope.editMode=false;
                    }
                }, function (error) {
                    console.info("UpdateAttributes err" + error);
                });
            };

            scope.deleteAttribute = function(item) {

                scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " + item.Attribute, function (obj) {

                    attributeService.DeleteAttribute(item, scope.Headers).then(function (response) {
                        if (response) {
                            scope.updateAttribute(item);
                            scope.showAlert("Deleted", "Deleted", "ok", "File " + item.Attribute + " Deleted successfully");
                        }
                        else
                            scope.showError("Error", "Error", "ok", "There is an error ");
                    }, function (error) {
                        scope.showError("Error", "Error", "ok", "There is an error ");
                    });

                }, function () {

                }, item);


            };

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

            scope.showAlert = function (tittle, label, button, content) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: 'success',
                    styling: 'bootstrap3'
                });
            };

            scope.showError = function (tittle,content) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: 'error',
                    styling: 'bootstrap3'
                });
            };
        }

    }
});