/**
 * Created by Heshan.i on 9/14/2016.
 */


(function(){
    var app =angular.module('veeryConsoleApp');

    var editSlaFilter = function(slaApiAccess){
        return {
            restrict: "EA",
            scope: {
                slaId: "=",
                filter: "=",
                filterIndex: "=",
                filterType:"=",
                'updateFilters': '&'
            },

            templateUrl: 'views/ticket-sla/editSlaFilters.html',

            link: function (scope) {

                scope.editFilter = function(){
                    scope.editMode=!scope.editMode;
                };
                scope.editMode=false;

                scope.deleteFilter = function() {

                    scope.showConfirm("Delete Filter", "Delete", "ok", "cancel", "Do you want to delete " + scope.filter.field, function (obj) {
                        switch (scope.filterType){
                            case "any":
                                slaApiAccess.removeFilterAny(scope.slaId, scope.filter._id.toString()).then(function (response) {
                                    if(response.IsSuccess)
                                    {
                                        scope.showAlert('Filter', response.CustomMessage, 'success');
                                        scope.updateFilters(scope.filter, scope.filterType);
                                    }
                                    else
                                    {
                                        var errMsg = response.CustomMessage;

                                        if(response.Exception)
                                        {
                                            errMsg = response.Exception.Message;
                                        }
                                        scope.showAlert('Filter', errMsg, 'error');
                                    }
                                }, function (error) {
                                    var errMsg = "Error occurred while deleting filter";
                                    if (error.statusText) {
                                        errMsg = error.statusText;
                                    }
                                    scope.showAlert('Filter', errMsg, 'error');
                                });
                                break;
                            case "all":
                                slaApiAccess.removeFilterAll(scope.slaId, scope.filter._id.toString()).then(function (response) {
                                    if(response.IsSuccess)
                                    {
                                        scope.showAlert('Filter', response.CustomMessage, 'success');
                                        scope.updateFilters(scope.filter, scope.filterType);
                                    }
                                    else
                                    {
                                        var errMsg = response.CustomMessage;

                                        if(response.Exception)
                                        {
                                            errMsg = response.Exception.Message;
                                        }
                                        scope.showAlert('Filter', errMsg, 'error');
                                    }
                                }, function (error) {
                                    var errMsg = "Error occurred while deleting filter";
                                    if (error.statusText) {
                                        errMsg = error.statusText;
                                    }
                                    scope.showAlert('Filter', errMsg, 'error');
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

    app.directive('editSlaFilter', editSlaFilter)
}());