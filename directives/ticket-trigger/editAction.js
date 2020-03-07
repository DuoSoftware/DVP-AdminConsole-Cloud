/**
 * Created by Heshan.i on 8/16/2016.
 */
(function(){
    var app =angular.module('veeryConsoleApp');

    var editAction = function(triggerApiAccess){
        return {
            restrict: "EA",
            scope: {
                triggerId: "=",
                action: "=",
                actionIndex: "=",
                'updateActions': '&'
            },

            templateUrl: 'views/ticket-trigger/editTriggerActions.html',

            link: function (scope) {

                scope.editAction = function(){
                    scope.editMode=!scope.editMode;
                };
                scope.editMode=false;

                scope.deleteAction = function() {

                    scope.showConfirm("Delete Action", "Delete", "ok", "cancel", "Do you want to delete " + scope.action.field, function (obj) {

                        triggerApiAccess.removeAction(scope.triggerId, scope.action._id.toString()).then(function (response) {
                            if (response.IsSuccess) {
                                scope.updateActions(scope.action);
                                scope.showAlert('Trigger Action', response.CustomMessage, 'success');
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }
                                scope.showAlert('Trigger Operation', errMsg, 'error');
                            }
                        }, function (error) {
                            var errMsg = "Error occurred while deleting action";
                            if (error.statusText) {
                                errMsg = error.statusText;
                            }
                            scope.showAlert('Trigger Operation', errMsg, 'error');
                        });

                    }, function () {

                    }, scope.action);


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

    app.directive('editAction', editAction)
}());