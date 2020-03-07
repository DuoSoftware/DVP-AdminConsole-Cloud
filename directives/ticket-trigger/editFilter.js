/**
 * Created by Heshan.i on 8/22/2016.
 */
(function(){
    var app =angular.module('veeryConsoleApp');

    var editFilter = function(triggerApiAccess){
        return {
            restrict: "EA",
            scope: {
                triggerId: "=",
                filter: "=",
                filterIndex: "=",
                filterType:"=",
                'updateFilters': '&'
            },

            templateUrl: 'views/ticket-trigger/editTriggerFilters.html',

            link: function (scope) {

                scope.editFilter = function(){
                    scope.editMode=!scope.editMode;
                };
                scope.editMode=false;

                scope.deleteFilter = function() {

                    scope.showConfirm("Delete Filter", "Delete", "ok", "cancel", "Do you want to delete " + scope.filter.field, function (obj) {
                        switch (scope.filterType){
                            case "any":
                                triggerApiAccess.removeFilterAny(scope.triggerId, scope.filter._id.toString()).then(function (response) {
                                    if (response.IsSuccess) {
                                        scope.updateFilters(scope.filter, scope.filterType);
                                        scope.showAlert('Trigger Filter', response.CustomMessage, 'success');
                                    }
                                    else {
                                        var errMsg = response.CustomMessage;

                                        if (response.Exception) {
                                            errMsg = response.Exception.Message;
                                        }
                                        scope.showAlert('Trigger Filter', errMsg, 'error');
                                    }
                                }, function (error) {
                                    var errMsg = "Error occurred while deleting trigger";
                                    if (error.statusText) {
                                        errMsg = error.statusText;
                                    }
                                    scope.showAlert('Trigger Filter', errMsg, 'error');
                                });
                                break;
                            case "all":
                                triggerApiAccess.removeFilterAll(scope.triggerId, scope.filter._id.toString()).then(function (response) {
                                    if (response.IsSuccess) {
                                        scope.updateFilters(scope.filter, scope.filterType);
                                        scope.showAlert('Trigger Filter', response.CustomMessage, 'success');
                                    }
                                    else {
                                        var errMsg = response.CustomMessage;

                                        if (response.Exception) {
                                            errMsg = response.Exception.Message;
                                        }
                                        scope.showAlert('Trigger Filter', errMsg, 'error');
                                    }
                                }, function (error) {
                                    var errMsg = "Error occurred while deleting trigger";
                                    if (error.statusText) {
                                        errMsg = error.statusText;
                                    }
                                    scope.showAlert('Trigger Filter', errMsg, 'error');
                                });
                                break;
                            default :
                                break;
                        }
                    }, function () {

                    }, scope.filter);


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

    app.directive('editFilter', editFilter)
}());