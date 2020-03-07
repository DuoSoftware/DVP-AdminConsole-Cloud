/**
 * Created by Heshan.i on 11/17/2016.
 */

(function(){
    var app =angular.module('veeryConsoleApp');

    var customTicketStatusDirective = function($filter, $state, companyConfigBackendService){
        return {
            restrict: "EAA",
            scope: {
                customStatus: "=",
                'updateCustomStatus': '&',
                'reloadpage':'&'
            },

            templateUrl: 'views/companyConfig/partials/editCustomTicketStatus.html',

            link: function (scope) {
                scope.editMode = false;

                scope.editApplication = function () {
                    scope.editMode = !scope.editMode;
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

                scope.updateCustomTicketStatus = function(){
                    companyConfigBackendService.updateCustomTicketStatus(scope.customStatus).then(function (response) {
                        if(response.IsSuccess)
                        {
                            scope.showAlert('Custom Ticket Status', response.CustomMessage, 'success');
                            scope.editApplication();
                            scope.reloadpage();
                        }
                        else
                        {
                            var errMsg = response.CustomMessage;

                            /*if(response.Exception)
                            {
                                errMsg = response.Exception.Message;
                            }*/
                            scope.showAlert('Custom Ticket Status', errMsg, 'error');
                        }
                    }, function(err){
                        var errMsg = "Error occurred while updating ticket status";
                        /*if(err.statusText)
                        {
                            errMsg = err.statusText;
                        }*/
                        scope.showAlert('Custom Ticket Status', errMsg, 'error');
                    });
                };

                scope.removeCustomTicketStatus = function(){
                    scope.showConfirm("Delete Custom Status", "Delete", "ok", "cancel", "Do you want to delete " + scope.customStatus.status_node, function (obj) {
                        companyConfigBackendService.removeCustomTicketStatus(scope.customStatus._id.toString()).then(function (response) {
                            if (response.IsSuccess) {
                                scope.updateCustomStatus(scope.customStatus);
                                scope.showAlert('Custom Ticket Status', response.CustomMessage, 'success');
                                scope.reloadpage();
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                /*if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }*/
                                scope.showAlert('Custom Ticket Status', errMsg, 'error');
                            }
                        }, function (err) {
                            var errMsg = "Error occurred while deleting custom ticket status";
                            /*if (err.statusText) {
                                errMsg = err.statusText;
                            }*/
                            scope.showAlert('Custom Ticket Status', errMsg, 'error');
                        });
                    }, function () {

                    }, scope.customStatus);
                };

            }

        }
    };

    app.directive('customTicketStatusDirective', customTicketStatusDirective);
}());