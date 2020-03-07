/**
 * Created by Heshan.i on 10/19/2016.
 */

(function () {
    var app = angular.module('veeryConsoleApp');

    var caseDirective = function ($filter, $state, $timeout, caseApiAccess) {
        return {
            restrict: "EAA",
            scope: {
                caseInfo: "=",
                bulkOperations: "=",
                'updateCase': '&',
                'reloadPage': '&'
            },

            templateUrl: 'views/ticket-case/editCase.html',

            link: function (scope) {
                scope.editMode = false;

                scope.statusMode = scope.caseInfo.status !== "closed";

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

                /*scope.editSla = function(){
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
                 };*/

                scope.removeCase = function () {
                    scope.showConfirm("Delete Case", "Delete", "ok", "cancel", "Do you want to delete " + scope.caseInfo.caseName, function (obj) {
                        caseApiAccess.deleteCase(scope.caseInfo._id.toString()).then(function (response) {
                            if (response.IsSuccess) {
                                scope.reloadPage();
                                scope.updateCase(scope.caseInfo);
                                scope.showAlert('Case', 'Case Deactivated Successfully.', 'success');
                                //$state.reload();
                            }
                            else {
                                var errMsg = response.CustomMessage;

                                if (response.Exception) {
                                    errMsg = response.Exception.Message;
                                }
                                scope.showAlert('Case', 'Case Deactivated Error.', 'error');
                            }
                        }, function (err) {
                            var errMsg = "Error occurred while deleting Case";
                            if (err.statusText) {
                                errMsg = err.statusText;
                            }
                            scope.showAlert('Case', 'Case Deactivated Error.', 'error');
                        });
                    }, function () {

                    }, scope.caseInfo);
                };

                scope.viewConfigurations = function () {
                    $state.go('console.configCase', {
                        caseInfo: JSON.stringify(scope.caseInfo),
                        title: scope.caseInfo.caseName
                    });
                };

                scope.removeBulkOperation = function(jobId){
                    caseApiAccess.removeBulkOperation(jobId).then(function (response) {
                        if (response) {
                            scope.showAlert('Case', 'Bulk Operation Removed Successfully.', 'success');
                        }else{
                            console.log('remove Bulk Operation Failed');

                        }
                    }, function (err) {
                        console.log('remove Bulk Operation Failed');
                    });
                };

                var getTimer = function(){
                    if(scope.bulkOperations && scope.bulkOperations.length >0) {
                        scope.ongoingOperations = scope.bulkOperations.filter(function (bulkObj) {
                            return bulkObj.JobReference === scope.caseInfo._id.toString();
                        });
                    }else{
                        scope.ongoingOperations = [];
                    }
                    getTimesTimer = $timeout(getTimer, 5000);
                };

                var getTimesTimer = $timeout(getTimer, 5000);

                scope.$on("$destroy", function () {
                    if (getTimesTimer) {
                        $timeout.cancel(getTimesTimer);
                    }
                });

            }

        }
    };

    app.directive('caseDirective', caseDirective);
}());