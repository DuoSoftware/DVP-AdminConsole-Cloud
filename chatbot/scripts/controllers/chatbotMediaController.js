mainApp.controller('chatbotMediaController', function ($scope, $q, $anchorScroll, botMediaService, $state, $uibModal, integrationsService) {
    $anchorScroll();

    console.log("Chatbot controller is up!");

    //Get All Media Files
    $scope.getAllMedia = function () {
        botMediaService.GetAllMediaFiles().then(function (response) {
            console.log(response);
            if (response.data.IsSuccess) {
                $scope.allmediaFiles = response.data.Result;

                var ty = $scope.allmediaFiles.reduce(function (a, b) {
                    if (a.indexOf(b.type) == -1) {
                      a.push(b.type)
                    }
                    return a;
                  }, []);
                  
               
                  $scope.mediaTypes=[];
                  $scope.mediaTypes = ty;

            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To load Media.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To load Media.");
        });
    };
    $scope.getAllMedia();

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }
    $scope.reloadPage = function () {
        $state.reload();
    };
    $scope.val = 'created_at';
    $scope.sort = 'created_at';
    $scope.reverse = false;

    $scope.sorting = function(val){
        console.log(val);
        $scope.reverse = ($scope.val === val) ? !$scope.reverse : false;
        $scope.val = val;
    }
   
    $scope.filterType = function(type){
        console.log(type);
        $scope.selectedtype = type;
    }

    $scope.resetFilters = function(){
        $scope.selectedtype = "";
        $scope.type = "";
    }

});