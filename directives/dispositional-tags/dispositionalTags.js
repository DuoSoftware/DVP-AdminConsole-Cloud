/**
 * Created by Heshan.i on 9/14/2016.
 */

(function(){
    var app =angular.module('veeryConsoleApp');

    var dispositionalTagDirective = function($filter, $state, dispositionalTagBackendService){
        return {
            restrict: "EAA",
            scope: {
                dispositionalTag: "=",
                dispositionalTags: "=",
                'updateDispositionalTag': '&',
                'reloadPage':'&'
            },

            templateUrl: 'views/dispositional-tag-manager/editDispositionalTag.html',

            link: function (scope) {
                scope.editMode = false;

                scope.editDispositionalTagView = function () {
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

                scope.editDispositionalTag = function(){
                    dispositionalTagBackendService.updateDispositionalTag(scope.dispositionalTag).then(function(response){
                        if(response.IsSuccess)
                        {
                            scope.showAlert('Dispositional Tag', response.CustomMessage, 'success');
                            scope.reloadPage();
                        }
                        else
                        {
                            var errMsg = response.CustomMessage;

                            if(response.Exception)
                            {
                                errMsg = response.Exception.Message;
                            }
                            scope.showAlert('Dispositional Tag', errMsg, 'error');
                        }
                    }, function(err){
                        var errMsg = "Error occurred while updating dispositional tag";
                        if(err.statusText)
                        {
                            errMsg = err.statusText;
                        }
                        scope.showAlert('Dispositional Tag', errMsg, 'error');
                    });
                };

                scope.removeDispositionalTag = function(){
                    scope.showConfirm("Delete Dispositional Tag", "Delete", "ok", "cancel", "Do you want to delete " + scope.dispositionalTag.tag, function (obj) {
                        dispositionalTagBackendService.deleteDispositionalTag(scope.dispositionalTag.tag).then(function (response) {
                            if (response.IsSuccess) {
                                scope.updateDispositionalTag(scope.dispositionalTag);
                                scope.showAlert('Dispositional Tag', response.CustomMessage, 'success');
                                $state.reload();
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }
                                scope.showAlert('Dispositional Tag', errMsg, 'error');
                            }
                        }, function (err) {
                            var errMsg = "Error occurred while deleting dispositional tag";
                            if (err.statusText) {
                                errMsg = err.statusText;
                            }
                            scope.showAlert('Dispositional Tag', errMsg, 'error');
                        });
                    }, function () {

                    }, scope.dispositionalTag);
                };
            }

        }
    };

    app.directive('dispositionalTagDirective', dispositionalTagDirective);
}());