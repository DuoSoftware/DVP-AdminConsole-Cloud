/**
 * Created by Heshan.i on 8/24/2016.
 */

(function(){
    var app =angular.module('veeryConsoleApp');
    var dynamicOperation = function($templateCache, $compile) {
        return {
            scope: {
                operationName: "=",
                renderTemplates: "=",
                ardsAttributes: "=",
                ngModel: "="
            },
            template: '<div ng-include="dynamicTemplateUrl"></div>',
            link: function (scope, element) {
                scope.currentDragItem = {};
                scope.selectedAttributes = [];

                scope.assignAttributeToTask = function(){
                    if(scope.ngModel.value && Array.isArray(scope.ngModel.value) && scope.ngModel.value.length > 0){
                        scope.ngModel.value.push(scope.currentDragItem.Id);
                    }else{
                        scope.ngModel.value = [scope.currentDragItem.Id];
                    }
                };
                scope.deleteAttributeAssignToTask = function(item){
                    for(var i = 0; i < scope.ngModel.value.length; i++){
                        if(scope.currentDragItem.Id === scope.ngModel.value[i]){
                            scope.ngModel.value.splice(i,1);
                        }
                    }
                };

                scope.currentDragAttribute = function(item){
                    scope.currentDragItem = item;
                };
                scope.$watch('operationName', function(newValue, oldValue) {
                    if (newValue) {
                        scope.getTemplate(newValue);
                    }
                }, true);

                scope.$watch('ngModel', function(newValue, oldValue) {
                    if (newValue) {
                        scope.ngModel = newValue;
                    }
                }, true);

                scope.$watch('renderTemplates', function(newValue, oldValue) {
                    if (newValue) {
                        scope.renderTemplates = newValue;
                    }
                }, true);

                scope.$watch('ardsAttributes', function(newValue, oldValue) {
                    if (newValue) {
                        scope.ardsAttributes = newValue;
                    }
                }, true);

                scope.getTemplate = function(operation){
                    switch (operation){
                        case "AddInteraction":
                            scope.dynamicTemplateUrl = 'views/ticket-trigger/template/interactionTemplate.html';
                            break;
                        case "SendMessage":
                            scope.dynamicTemplateUrl = 'views/ticket-trigger/template/smsTemplate.html';
                            break;
                        case "SendEmail":
                            scope.dynamicTemplateUrl = 'views/ticket-trigger/template/emailTemplate.html';
                            break;
                        case "PickAgent":
                            scope.dynamicTemplateUrl = 'views/ticket-trigger/template/ardsTemplate.html';
                            break;
                        case "SendNotification":
                            scope.dynamicTemplateUrl = 'views/ticket-trigger/template/notificationTemplate.html';
                            break;
                        case "InvokeService":
                            scope.dynamicTemplateUrl = 'views/ticket-trigger/template/serviceTemplate.html';
                            break;
                        default :
                            break;
                    }
                };
            }

        }
    };



    app.directive('dynamicOperation', dynamicOperation);
}());