mainApp.controller("appConfigController", function ($scope, $state, $stateParams, $filter, $location, $log, $anchorScroll, ticketService, integrationConfigService) {

    $anchorScroll();

    $scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

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

    $scope.getAppById = function(app_id){
        $scope.isProcessing = true;
        integrationConfigService.getAppById(app_id).then(function (response) {
            if (response && response.IsSuccess) {
                $scope.currentApp = response.Result;
            } else {
                $scope.showAlert("App Integrations", "error", "Failed To Load App.");
                $state.go('console.appintegration');
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Failed To Load App.");
            $state.go('console.appintegration');
        });
    };

    $scope.getAppById($stateParams.app_id);

    $scope.LoadFormList = function(){
		$scope.isProcessing = true;
		ticketService.LoadFormList().then(function (response) {
			if(response){
				$scope.formList = response;
			}
			else{
				$scope.showAlert("Load Form", "Fail To Load Form List.");
			}
			$scope.isProcessing = false;
		}, function (error) {
            $scope.showAlert("Load Form", "Fail To Load Form List.");
            $scope.isProcessing = false;
		});

    };

    $scope.LoadFormList();

    $scope.showAlert = function (tittle,type, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.appList = [];

    // set default app data..

    $scope.resetActionData = function(){
        $scope.actionData = {
            name: '', 
            icon: '',
            integration: {
                parameters: [],
                url:'',
                response_map: {
                    accepted_codes: [],
                    success_msg: '',
                    error_msg: ''
                }
            }
        };

        $scope.actionData_Orig = {}

        // reset form...
        if($scope["fOuter"]){
            $scope["fOuter"].$setUntouched();
            $scope["fOuter"].$setPristine();
        }
        
    };

    $scope.addActionToApp = function(action){

        if(action.integration.method == "GET"){
            if (action.integration.parameters.filter(function(e) { return e.parameterLocation === 'BODY'; }).length > 0) {
                // contains a body parameter
                $scope.showAlert("App Integrations", "error", "GET request cannot contain a BODY.");
                return false;
              }
        };

        $scope.isProcessing = true;
        action.integration.response_map.accepted_codes = action.integration.response_map.accepted_codes.map(function(tag){
            return tag.code;
        });
        integrationConfigService.createAction($scope.currentApp._id, action).then(function (response) {
            if (response && response.IsSuccess) {
                $scope.showAlert("App Integrations", 'success', "Action Created Successfully.");

                var added_action = response.Result.actions[response.Result.actions.length - 1];
                action._id = added_action._id;
                action.integration._id = added_action.integration;

                $scope.currentApp.actions.push(action);

                $scope.showConfigurations();
                $scope.resetActionData();
            } else {
                $scope.showAlert("App Integrations", "error", "Fail To Save Action.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Save Action.");
        });
    }

    $scope.resetActionData();

    $scope.isProcessing = false;
    $scope.showConfiguration = false;
    $scope.isUpdate = false;

    $scope.showConfigurations = function () {
        $scope.resetActionData();
        $scope.isUpdate = false;
        $scope.showConfiguration = !$scope.showConfiguration;
    };

    $scope.reloadConfig = function(){
        $state.go('console.appconfig', { 'app_id': $scope.currentApp._id }, {reload: true});
    };

    $scope.editAction = function(action){
        $scope.actionData_Orig = action;
        // $scope.actionData = action;
        angular.copy(action, $scope.actionData);
        $scope.showConfiguration = true;
        $scope.isUpdate = true;
        $anchorScroll('action_panel');
    };

    $scope.updateAction = function(){   
        
        if($scope.actionData.integration.method == "GET"){
            if ($scope.actionData.integration.parameters.filter(function(e) { return e.parameterLocation === 'BODY'; }).length > 0) {
                // contains a body parameter
                $scope.showAlert("App Integrations", "error", "GET request cannot contain a BODY.");
                return false;
              }
        }
        
        $scope.actionData.integration.response_map.accepted_codes = $scope.actionData.integration.response_map.accepted_codes.map(function(tag){
                                                                        return tag.code;
                                                                    });
        $scope.isProcessing = true;
        
        integrationConfigService.updateAction($scope.currentApp._id, $scope.actionData).then(function (response) {
            if (response && response.IsSuccess) {
                $scope.showAlert("App Integrations", 'success', "Action Updated Successfully.");
                
		angular.copy($scope.actionData, $scope.actionData_Orig);
                $scope.showConfigurations();
            } else {
                $scope.showAlert("App Integrations", "error", "Fail To Update Action.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Update Action.");
        });
    }

    $scope.addParameters = function (parameters) {
        $scope.appData.parameters.push(parameters);

        var form = $scope["fInner"];
        form.$setUntouched();
        form.$setPristine();
        $scope.showParameter = false;
    };

    $scope.saveApp = function (appData) {
        $scope.isProcessing = true;
        integrationConfigService.saveAppDetails(appData).then(function (response) {
            if (response) {
                $scope.showAlert("Integrations", 'success', "Configurations Created Successfully.");
                if(!appData._id){
                    $scope.appList.push(response);
                }
                $scope.showConfiguration = false;
                $scope.resetAppData();

                var form = $scope["fOuter"];
                form.$setUntouched();
                form.$setPristine();
            } else {
                $scope.showAlert("Integrations", "error", "Fail To Save Integration Configurations.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("Integrations", "error", "Fail To Save Integration Configurations.");
        });

    };

    $scope.updateApp = function (appData) {        
        $scope.isProcessing = true;

        integrationConfigService.updateAppDetails(appData).then(function (response) {
            if (response.IsSuccess) {
                $scope.showAlert("App Integrations", 'success', "App updated Successfully.");

                // reload the config window...
                $scope.reloadConfig();
                $scope.showConfiguration = false;
            } else {
                $scope.showAlert("App Integrations", "error", "Fail To Save App.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Save App.");
        });

    };   


    $scope.updateDefaultIntegration = function (appId, integrationData) {

        if(integrationData.method == "GET"){
            if (integrationData.parameters && integrationData.parameters.filter(function(e) { return e.parameterLocation === 'BODY'; }).length > 0) {
                // contains a body parameter
                $scope.showAlert("App Integrations", "error", "GET request cannot contain a BODY.");
                return false;
              }
        }
       
        $scope.isProcessing = true;

        if(integrationData._id){
            var reqPromise = integrationConfigService.updateDefaultIntegration(appId, integrationData);
        }else{
            var reqPromise = integrationConfigService.addDefaultIntegration(appId, integrationData);
        }

        reqPromise.then(function (response) {
            if (response.IsSuccess) {
                $scope.showAlert("App Integrations", 'success', "App updated Successfully.");

                // reload the config window...
                $scope.reloadConfig();
                $scope.showConfiguration = false;
            } else {
                $scope.showAlert("App Integrations", "error", "Fail To Save App.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Save App.");
        });

    }; 

    $scope.deleteAction = function (action) {

        if(action._id == $scope.actionData._id){
            $scope.showAlert("Delete Action", "error", "Please save or close before deleting!");
            return false;
        }

        $scope.isProcessing = true;
        $scope.showConfirm("Delete Action", "Delete", "ok", "cancel", "Do you want to delete " + action.name + " action?", function (obj) {
            integrationConfigService.deleteAppAction($scope.currentApp._id, action).then(function (response) {
                if (response) {
                    var index = $scope.currentApp.actions.indexOf(action);

                    $scope.isProcessing = false;
                    $scope.currentApp.actions.splice(index, 1);
                    
                    $scope.showAlert("App Integrations", 'success', "Action Deleted Successfully.");
                } else {
                    $scope.showAlert("App Integrations", "error", "Fail To Delete Action.");
                }
                $scope.isProcessing = false;
            }, function (error) {
                $scope.isProcessing = false;
                $scope.showAlert("App Integrations", "error", "Fail To Delete Action.");
            });
        }, function () {
            $scope.$apply(function(){
                $scope.isProcessing = false;
            });
        }, action);
    };
});
