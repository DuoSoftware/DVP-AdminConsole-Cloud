mainApp.controller('chatbotContextController', function ($scope, $q, $anchorScroll, $state, chatbotEntitesService, chatbotContextService, setupAIService, chatbotEntitesService, $auth, chatbotService) {
    $anchorScroll();

    console.log("chatbot Context controller is up!");

    $scope.context = {
        "workflowName": "",
        "displayName": "",
        "contextMapping" : [{
            "entityName": "",
            "contextName": ""
        }],
        "description": "",
        "enable": true
    };

    $scope.contxMap = [{ entityName: "", contextName: ""}];

    $scope.addcontxMap = function() {
        $scope.contxMap.push({});
    }

    $scope.deletecontextMap = function(index) {
        for (var n = $scope.contxMap.length - 1; n >= 0; n--) {
            if (n == index) {
                $scope.contxMap.splice(n, 1);
            }
        }
    }

    $scope.closeCreateModel = function(){
        $scope.context = {};
        $scope.contxMap = [{ entityName: "", contextName: ""}];
    }

    //Get all workflows
    $scope.getWorkflows = function () {
        setupAIService.GetWorkFlow().then(function (response) {
            console.log(response);
            if (response.data !== 0) {
                $scope.workFlowNames = response.data;
                console.log($scope.workFlowNames);
               
                for (var i=0; i<$scope.allContext.length; i++) {
                    for (var j=0; j<$scope.workFlowNames.length; j++) {
                        if($scope.allContext[i].workflowName === $scope.workFlowNames[j].Name){
                            $scope.workFlowNames.splice(j, 1);
                            console.log($scope.workFlowNames);
                        }

                    }
                }

            } else {
                $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
            }

        }, function (error) {
            $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
        });
    }
    

     //Get All Entity
    $scope.getAllEntities = function () {
        chatbotEntitesService.GetAllEntity().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allEntities = response.data.Result;
                console.log($scope.allEntities);
            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To load entities.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To load entities.");
        });
    };
    $scope.getAllEntities();

    //Get All context
    $scope.getAllContext = function () {
        chatbotContextService.GetAllContext().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allContext = response.data.Result;
                console.log($scope.allContext);
                $scope.getWorkflows();

            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To load context.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To load context.");
        });
    };
    $scope.getAllContext();

    $scope.createNewContext = function (context) {
        console.log(context);
        context.displayName = context.workflowName.DisplayName;
        context.workflowName = context.workflowName.Name;
        context.contextMapping= angular.copy($scope.contxMap);
        console.log(context);
        chatbotContextService.CreateContext(context).then(function (response) {
            if (response.data.IsSuccess) {
                $scope.showAlert("Context", 'success', "Context Created Successfully.");
                $scope.getAllContext();
                $scope.context = {};
                $scope.contxMap = [{ entityName: "", contextName: ""}];
            } else {
                $scope.showAlert("Context", 'error', "Fail To Create Context.");
            }

        }, function (error) {
            $scope.showAlert("Context", 'error', "Fail To Create Context.");

        });

    };

    $scope.updateContext = function (context) {
        console.log(context);
        chatbotContextService.UpdateContext(context).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Context", 'success', "Context updated successfully.");
                $scope.getAllContext();
            } else {
                $scope.showAlert("Context", 'error', "Failed to update context.");
            }

        }, function (error) {
            $scope.showAlert("Context", 'error', "Fail To update context.");
        });
    }

    $scope.deleteContext = function (contx) {
        console.log(contx);
        chatbotContextService.DeleteContext(contx).then(function (response) {
            console.log(response._id);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Context", 'success', "Context deleted successfully.");
                $scope.getAllContext();
            } else {
                $scope.showAlert("Context", 'error', "Failed to delete context.");
            }
        }, function (error) {
            $scope.showAlert("Context", 'error', "Failed to delete context.");
        });

    }
  
    $scope.reloadPage = function () {
        
        $state.reload();
    };


});
