mainApp.controller('chatbotEntitiesController', function ($scope, $q, $anchorScroll, $state, chatbotEntitesService, $auth, chatbotService) {
    $anchorScroll();

    console.log("chatbot Entities controller is up!");

    $scope.buttonName = "SAVE";

    $scope.entities = {
        "entityName": "",
        "description": "",
        "values": [],
        "enable": true
    };

    $scope.closeCreateModel = function(){
        $scope.entities = {};
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

    $scope.createNewEntity = function (entity) {

        console.log(entity);
        $scope.entity = entity;
        $scope.values = [];
        for (var i = 0; i < entity.values.length; i++) {
            for (var key in entity.values[i]) {
                $scope.values.push(entity.values[i][key]);
                console.log($scope.values);
            }

        }

        $scope.entities.values = [];
        $scope.entities = {};
        $scope.entities.entityName = $scope.entity.entityName;
        $scope.entities.description = $scope.entity.description;
        $scope.entities.enable = $scope.entity.enable;
        $scope.entities.values = $scope.values;

        console.log($scope.entities);
        chatbotEntitesService.CreateEntity($scope.entities).then(function (response) {
            if (response.data.IsSuccess) {
                $scope.showAlert("Entity", 'success', "Entity Created Successfully.");
                $scope.getAllEntities();
                $scope.entities = {};
            } else {
                $scope.showAlert("Entity", 'error', "Fail To Create Entity.");
            }

        }, function (error) {
            $scope.showAlert("Entity", 'error', "Fail To Create Entity.");

        });

    };

    $scope.updateEntity = function (entity) {
        $scope.entity = entity;
        $scope.values = [];
        for (var i = 0; i < entity.values.length; i++) {
            for (var key in entity.values[i]) {
                $scope.values.push(entity.values[i][key]);
                console.log($scope.values);
            }

        }

        $scope.entity.values = [];
        $scope.entities = {};
        $scope.entities.entityName = $scope.entity.entityName;
        $scope.entities.description = $scope.entity.description;
        $scope.entities.enable = $scope.entity.enable;
        $scope.entities.values = $scope.values;
        $scope.entities._id = $scope.entity._id;

        console.log($scope.entities);
        chatbotEntitesService.UpdateEntity($scope.entities).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Entity", 'success', "Entity updated successfully.");
                $scope.getAllEntities();
            } else {
                $scope.showAlert("Entity", 'error', "Failed to update entity.");
            }

        }, function (error) {
            $scope.showAlert("Entity", 'error', "Fail To update entity.");
        });
    }

    $scope.deleteEntity = function (setup) {
        chatbotEntitesService.DeleteEntity(setup).then(function (response) {
            console.log(response._id);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Entity", 'success', "Entity deleted successfully.");
                $scope.getAllEntities();
            } else {
                $scope.showAlert("Entity", 'error', "Failed to delete entity.");
            }
        }, function (error) {
            $scope.showAlert("Entity", 'error', "Failed to delete entity.");
        });

    }
  
    $scope.reloadPage = function () {
        
        $state.reload();
    };


});
