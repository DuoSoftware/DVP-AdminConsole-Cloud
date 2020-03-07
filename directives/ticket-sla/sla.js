/**
 * Created by Heshan.i on 9/14/2016.
 */

(function(){
    var app =angular.module('veeryConsoleApp');

    var slaDirective = function($filter, $state, slaApiAccess){
        return {
            restrict: "EAA",
            scope: {
                sla: "=",
                slas: "=",
                'updateSla': '&',
                'reloadPage':'&'
            },

            templateUrl: 'views/ticket-sla/editSla.html',

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

                scope.editSla = function(){
                    slaApiAccess.updateSla(scope.sla).then(function(response){
                        if(response.IsSuccess)
                        {
                            scope.showAlert('SLA', response.CustomMessage, 'success');
                            scope.reloadpage();
                        }
                        else
                        {
                            var errMsg = response.CustomMessage;

                            if(response.Exception)
                            {
                                errMsg = response.Exception.Message;
                            }
                            scope.showAlert('SLA', errMsg, 'error');
                        }
                    }, function(err){
                        var errMsg = "Error occurred while updating sla";
                        if(err.statusText)
                        {
                            errMsg = err.statusText;
                        }
                        scope.showAlert('SLA', errMsg, 'error');
                    });
                };

                scope.removeSla = function(){
                    scope.showConfirm("Delete SLA", "Delete", "ok", "cancel", "Do you want to delete " + scope.sla.title, function (obj) {
                        slaApiAccess.deleteSla(scope.sla._id.toString()).then(function (response) {
                            if (response.IsSuccess) {
                                scope.updateSla(scope.sla);
                                scope.showAlert('SLA', response.CustomMessage, 'success');
                                $state.reload();
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }
                                scope.showAlert('SLA', errMsg, 'error');
                            }
                        }, function (err) {
                            var errMsg = "Error occurred while deleting sla";
                            if (err.statusText) {
                                errMsg = err.statusText;
                            }
                            scope.showAlert('SLA', errMsg, 'error');
                        });
                    }, function () {

                    }, scope.sla);
                };

                scope.viewConfigurations = function()
                {
                    $state.go('console.slaConfiguration', {slaId: scope.sla._id.toString(), title: scope.sla.title});
                };

            }

        }
    };

    app.directive('slaDirective', slaDirective);
}());