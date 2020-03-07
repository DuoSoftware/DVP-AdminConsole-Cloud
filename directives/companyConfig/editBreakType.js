/**
 * Created by Heshan.i on 2/6/2017.
 */

(function () {
    var app = angular.module('veeryConsoleApp');

    var customBreakTypeDirective = function ($filter, $state, companyConfigBackendService) {
        return {
            restrict: "EAA",
            scope: {
                customBreakType: "=",
                'updateCustomBreakTypes': '&'
            },

            templateUrl: 'views/companyConfig/partials/editCustomBreakType.html',

            link: function (scope) {
                scope.editMode = false;

                scope.editApplication = function () {
                    scope.editMode = !scope.editMode;
                };

                scope.cancelUpdate = function () {
                    scope.editMode = false;
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

                scope.showAlert = function (title, content, type) {

                    new PNotify({
                        title: title,
                        text: content,
                        type: type,
                        styling: 'bootstrap3'
                    });
                };

                scope.updateCustomBreakType = function () {

                    companyConfigBackendService.updateBreakType(scope.customBreakType).then(function (response) {
                        if (response.IsSuccess) {
                            scope.showAlert('Custom Break Type', 'Custom Break Update Successfully', 'success');
                            scope.editApplication();
                            scope.updateCustomBreakTypes();
                        }
                        else {
                            var errMsg = response.CustomMessage;

                            if (response.Exception) {
                                errMsg = response.Exception.Message;
                            }
                            scope.showAlert('Custom Break Type', 'Error occurred while updating break type', 'error');
                        }
                    }, function (err) {
                        var errMsg = "Error occurred while updating break type";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        scope.showAlert('Custom Break Type', 'Error occurred while updating break type', 'error');
                    });
                };

                scope.removeCustomBreakType = function () {
                    scope.showConfirm("Delete Custom StatuBreak Type", "Delete", "ok", "cancel", "Do you want to delete " + scope.customBreakType.BreakType, function (obj) {
                        companyConfigBackendService.deleteBreakType(scope.customBreakType.BreakType).then(function (response) {
                            if (response.IsSuccess) {
                                scope.updateCustomBreakTypes();
                                scope.showAlert('Custom Break Type', 'Custom Break Deleted Successfully', 'success');
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }
                                scope.showAlert('Custom Break Type', 'Error occurred while deleting custom break type', 'error');
                            }
                        }, function (err) {
                            var errMsg = "Error occurred while deleting custom break type";
                            if (err.statusText) {
                                errMsg = err.statusText;
                            }
                            scope.showAlert('Custom Break Type', 'Error occurred while deleting custom break type', 'error');
                        });
                    }, function () {

                    }, scope.customBreakType);
                };

            }

        }
    };

    app.directive('customBreakTypeDirective', customBreakTypeDirective);
}());