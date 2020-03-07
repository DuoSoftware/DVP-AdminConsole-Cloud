/**
 * Created by Heshan.i on 8/23/2016.
 */
(function(){
    var app =angular.module('veeryConsoleApp');

    var editOperation = function(triggerApiAccess){
        return {
            restrict: "EA",
            scope: {
                triggerId: "=",
                operation: "=",
                operationIndex: "=",
                'updateOperations': '&'
            },

            templateUrl: 'views/ticket-trigger/editTriggerOperations.html',

            link: function (scope) {
                scope.editOperation = function(){
                    scope.editMode=!scope.editMode;
                };
                scope.editMode=false;

                scope.deleteOperation = function() {

                    scope.showConfirm("Delete Operation", "Delete", "ok", "cancel", "Do you want to delete " + scope.operation.name, function (obj) {

                        triggerApiAccess.removeOperations(scope.triggerId, scope.operation._id.toString()).then(function (response) {
                            if (response.IsSuccess) {
                                scope.updateOperations(scope.operation);
                                scope.showAlert('Trigger Operation', response.CustomMessage, 'success');
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }
                                scope.showAlert('Trigger Operation', errMsg, 'error');
                            }
                        }, function (error) {
                            var errMsg = "Error occurred while deleting operation";
                            if (error.statusText) {
                                errMsg = error.statusText;
                            }
                            scope.showAlert('Trigger Operation', errMsg, 'error');
                        });

                    }, function () {

                    }, scope.operation);


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

                scope.showAlert = function (title,content,type) {

                    new PNotify({
                        title: title,
                        text: content,
                        type: type,
                        styling: 'bootstrap3'
                    });
                };
            }

        }
    };

    app.directive('editOperation', editOperation)
}());