/**
 * Created by Heshan.i on 9/14/2016.
 */


/**
 * Created by Heshan.i on 8/15/2016.
 */
(function(){
    var app =angular.module('veeryConsoleApp');

    var slaController = function($scope, $state, slaApiAccess,loginService) {
        $scope.slas = [];
        $scope.sla = {};
        $scope.searchCriteria = "";

        $scope.showAlert = function (title,content,type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.removeDeleted = function (item) {

            var index = $scope.slas.indexOf(item);
            if (index != -1) {
                $scope.slas.splice(index, 1);
            }

        };

        $scope.reloadPage = function () {
            $state.reload();
        };

        $scope.loadSLAs = function(){
            slaApiAccess.getAllSla().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.slas = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('SLA', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading triggers";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('SLA', errMsg, 'error');
            });
        };

        $scope.saveSla = function(){
            slaApiAccess.createSla($scope.sla).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.slas = response.Result;
                    $scope.showAlert('SLA', response.CustomMessage, 'success');
                    $scope.searchCriteria = "";
                    $state.reload();
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('SLA', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while saving trigger";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('SLA', errMsg, 'error');
            });
        };

        $scope.loadSLAs();
    };

    app.controller('slaController', slaController);
}());