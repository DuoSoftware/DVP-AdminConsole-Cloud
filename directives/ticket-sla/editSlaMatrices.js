/**
 * Created by Heshan.i on 9/14/2016.
 */


(function(){
    var app =angular.module('veeryConsoleApp');

    var editSlaMatrices = function(slaApiAccess){
        return {
            restrict: "EA",
            scope: {
                slaId: "=",
                matrix: "=",
                matrixIndex: "=",
                'updateMatrices': '&'
            },

            templateUrl: 'views/ticket-sla/editSlaMatices.html',

            link: function (scope) {

                scope.editFilter = function(){
                    scope.editMode=!scope.editMode;
                };
                scope.editMode=false;

                scope.deleteMatrix = function() {

                    scope.showConfirm("Delete Matrix", "Delete", "ok", "cancel", "Do you want to delete Matrix?", function (obj) {
                        slaApiAccess.removeMatrix(scope.slaId, scope.matrix._id.toString()).then(function (response) {
                            if(response.IsSuccess)
                            {
                                scope.showAlert('Matrix', response.CustomMessage, 'success');
                                scope.updateMatrices(scope.matrix, scope.filterType);
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
                        }, function (error) {
                            var errMsg = "Error occurred while deleting matrix";
                            if (error.statusText) {
                                errMsg = error.statusText;
                            }
                            scope.showAlert('Matrix', errMsg, 'error');
                        });
                    }, function () {

                    }, scope.matrix);


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

    app.directive('editSlaMatrices', editSlaMatrices)
}());