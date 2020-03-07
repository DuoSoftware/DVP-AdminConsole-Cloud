/**
 * Created by Heshan.i on 8/15/2016.
 */
(function(){
    var app =angular.module('veeryConsoleApp');

    var ticketDirective = function($filter, $state, triggerApiAccess){
        return {
            restrict: "EAA",
            scope: {
                trigger: "=",
                triggers: "=",
                'updateTrigger': '&',
                'reloadpage':'&'
            },

            templateUrl: 'views/ticket-trigger/editTrigger.html',

            link: function (scope) {
                scope.editMode = false;

                scope.editApplication = function () {
                    scope.editMode = !scope.editMode;
                    console.log(scope.applist);
                };

                scope.cancelUpdate=function()
                {
                    scope.editMode=false;
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

                scope.editTrigger = function(){
                    triggerApiAccess.updateTrigger(scope.trigger).then(function(response){
                        if(response.IsSuccess)
                        {
                            scope.showAlert('Trigger', response.CustomMessage, 'success');
                            scope.reloadpage();
                        }
                        else
                        {
                            var errMsg = response.CustomMessage;

                            if(response.Exception)
                            {
                                errMsg = response.Exception.Message;
                            }
                            scope.showAlert('Trigger', errMsg, 'error');
                        }
                    }, function(err){
                        var errMsg = "Error occurred while updating trigger";
                        if(err.statusText)
                        {
                            errMsg = err.statusText;
                        }
                        scope.showAlert('Trigger', errMsg, 'error');
                    });
                };

                scope.removeTrigger = function(){
                    scope.showConfirm("Delete Trigger", "Delete", "ok", "cancel", "Do you want to delete " + scope.trigger.title, function (obj) {
                        triggerApiAccess.deleteTrigger(scope.trigger._id.toString()).then(function (response) {
                            if (response.IsSuccess) {
                                scope.updateTrigger(scope.trigger);
                                scope.showAlert('Trigger', response.CustomMessage, 'success');
                                $state.reload();
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }
                                scope.showAlert('Trigger', errMsg, 'error');
                            }
                        }, function (err) {
                            var errMsg = "Error occurred while deleting trigger";
                            if (err.statusText) {
                                errMsg = err.statusText;
                            }
                            scope.showAlert('Trigger', errMsg, 'error');
                        });
                    }, function () {

                    }, scope.trigger);
                };

                scope.viewConfigurations = function()
                {
                    $state.go('console.triggerConfiguration', {triggerId: scope.trigger._id.toString(), title: scope.trigger.title});
                };

            }

        }
    };

    app.directive('ticketDirective', ticketDirective);
}());