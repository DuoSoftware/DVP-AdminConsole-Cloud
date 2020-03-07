mainApp.directive('urlConfig', function () {
    return {
        restrict: 'E',
        scope: {
            integrationObj: '=',
            referenceObjects: '@',
            cssClass: '@'
        },
        templateUrl: 'template/integration/urlConfig.html',
        link: function (scope) {
            scope.refObjects = JSON.parse(scope.referenceObjects);

            scope.resetParams = function(){
                scope.params = {};
                scope["fInner"].$setUntouched();
                scope["fInner"].$setPristine();
            };

            scope.showParameters = function () {
                scope.showParameter = !scope.showParameter;
            };

            scope.addParameters = function(params){
                
                if(!scope.integrationObj){
                    scope.integrationObj = {};
                }
    
                if(!scope.integrationObj.parameters){
                    scope.integrationObj.parameters  = [];
                }
                scope.integrationObj.parameters.push(params);
                scope.resetParams();
            }

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
                    CancelCallBack("cancel");
                });
        
            };

            scope.deleteParameter = function (parameters) {

                scope.isProcessing = true;

                scope.showConfirm("Delete", "Delete", "ok", "cancel", "Do you want to delete this parameter?", function (obj) {
                    var index = scope.integrationObj.parameters.indexOf(parameters);                   
                    scope.$apply(function(){
                        scope.integrationObj.parameters.splice(index, 1);
                        scope.isProcessing = false;
                    });
                    
                }, function () {
                    scope.$apply(function(){
                        scope.isProcessing = false;
                    });
                }, parameters)
            };
        }
    }
});
