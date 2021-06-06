/**
 * Created by DuoB Coder on 06/05/2021.
 */
 (function(){
    var app =angular.module('veeryConsoleApp');

    var dispositionalTagController = function($scope, $state, dispositionalTagBackendService, loginService) {
        $scope.dispositionalTags = [];
        $scope.dispositionalTag = {};
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
            var index = $scope.dispositionalTags.indexOf(item);
            if (index != -1) {
                $scope.dispositionalTags.splice(index, 1);
            }
        };

        $scope.reloadPage = function () {
            $state.reload();
        };

        $scope.loadDispositionalTags = function(){
            dispositionalTagBackendService.getAllDispositionalTags().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.dispositionalTags = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Dispositional Tags', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading triggers";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Dispositional Tags', errMsg, 'error');
            });
        };

        $scope.saveDispositionalTag = function(){
            dispositionalTagBackendService.createDispositionalTag($scope.dispositionalTag).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.dispositionalTag = {};
                    $scope.dispositionalTags = response.Result;
                    $scope.showAlert('Dispositional Tags', response.CustomMessage, 'success');
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
                    $scope.showAlert('Dispositional Tags', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while saving trigger";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Dispositional Tags', errMsg, 'error');
            });
        };

        $scope.loadDispositionalTags();
    };

    app.controller('dispositionalTagController', dispositionalTagController);
}());