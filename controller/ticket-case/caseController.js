/**
 * Created by Heshan.i on 10/19/2016.
 */

(function () {
    var app = angular.module('veeryConsoleApp');

    var caseController = function ($scope, $state, $timeout, caseApiAccess, loginService) {
        $scope.caseInfos = [];
        $scope.caseInfo = {};
        $scope.searchCriteria = "";
        $scope.searchOption = "activeCases";

        $scope.showAlert = function (title, content, type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.removeDeleted = function (item) {

            var index = $scope.caseInfos.indexOf(item);
            if (index != -1) {
                $scope.caseInfos.splice(index, 1);
            }

        };

        $scope.reloadPage = function () {
            //$state.reload();
            $scope.loadCases();
        };

        $scope.filterCases = function () {
            switch ($scope.searchOption) {
                case 'activeCases':
                    $scope.caseInfos = $scope.tempCaseInfos.filter(function (caseI) {
                        if (caseI.active) {
                            return caseI
                        }
                    });
                    break;
                case 'deactivateCases':
                    $scope.caseInfos = $scope.tempCaseInfos.filter(function (caseI) {
                        if (!caseI.active) {
                            return caseI
                        }
                    });
                    break;
                default :
                    $scope.caseInfos = $scope.tempCaseInfos;
                    break;
            }
        };

        $scope.loadCases = function () {
            caseApiAccess.getCases().then(function (response) {
                if (response.IsSuccess) {
                    $scope.tempCaseInfos = response.Result;
                    switch ($scope.searchOption) {
                        case 'activeCases':
                            $scope.caseInfos = $scope.tempCaseInfos.filter(function (caseI) {
                                if (caseI.active) {
                                    return caseI
                                }
                            });
                            break;
                        case 'deactivateCases':
                            $scope.caseInfos = $scope.tempCaseInfos.filter(function (caseI) {
                                if (!caseI.active) {
                                    return caseI
                                }
                            });
                            break;
                        default :
                            $scope.caseInfos = $scope.tempCaseInfos;
                            break;
                    }
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Case', errMsg, 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading cases";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Case', errMsg, 'error');
            });
        };

        $scope.saveCase = function () {
            caseApiAccess.createCase($scope.caseInfo).then(function (response) {
                if (response.IsSuccess) {
                    $scope.caseInfos = response.Result;
                    $scope.showAlert('Case', 'Case Added Successfully.', 'success');
                    $scope.searchCriteria = "";
                    $scope.loadCases();
                    //$state.reload();
                }
                else {
                    var errMsg = response.CustomMessage;
                    console.log(errMsg);
                    //if(response.Exception)
                    //{
                    //    errMsg = response.Exception.Message;
                    //}
                    $scope.showAlert('Case', 'Entered Case Already Exists.', 'error');
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while saving case";
                //if(err.statusText)
                //{
                //    errMsg = err.statusText;
                //}
                $scope.showAlert('Case', errMsg, 'error');
            });
        };



        var getOngoingBulkOperations = function(){
            var caseIds = $scope.caseInfos.map(function(caseInfo){
                return caseInfo._id.toString();
            });

            if(caseIds && caseIds.length >0) {
                caseApiAccess.getBulkOperationByReference(caseIds).then(function (response) {
                    if (response) {
                        $scope.ongoingBulkOperations = response.map(function (bulkObj) {
                            return{
                                JobId: bulkObj.JobId,
                                JobReference: bulkObj.JobReference,
                                JobType: bulkObj.JobType,
                                JobStatus: bulkObj.JobStatus,
                                Percentage: Math.floor(((bulkObj.JobCount - bulkObj.OperationCount)/bulkObj.JobCount)*100)
                            };
                        });
                    }
                }, function (err) {
                });
            }
        };

        var getTimer = function(){
            getOngoingBulkOperations();
            getTimesTimer = $timeout(getTimer, 5000);
        };

        var getTimesTimer = $timeout(getTimer, 5000);

        $scope.$on("$destroy", function () {
            if (getTimesTimer) {
                $timeout.cancel(getTimesTimer);
            }
        });

        $scope.loadCases();
    };

    app.controller('caseController', caseController);
}());