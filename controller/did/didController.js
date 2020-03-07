/**
 * Created by Pawan on 6/30/2016.
 */
mainApp.controller("didController", function ($scope, $state, $uibModal, $filter, didBackendService, loginService,$anchorScroll) {

    $anchorScroll();
    $scope.didList = [];

    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.GetDidNumbers = function () {
        didBackendService.getDidRecords().then(function (response) {

            if (response.data.IsSuccess) {
                $scope.didList = response.data.Result;
            }
            else {
                console.log("Picking limits failed ", response.data.Exception);
            }

        }, function (error) {
            console.log("Error in picking limits  ", error);
        });
    };

    $scope.showModal = function (didId, didData) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/did/partials/editDid.html',
            controller: 'didModalController',
            size: 'sm',
            resolve: {
                didData: function () {
                    return didData;
                }, didId: function () {
                    return didId;
                },
                reloadPage: function () {
                    return $scope.reloadPage;
                }
            }
        });
    };

    $scope.reloadPage = function () {
        $state.reload();
    };

    $scope.removeDeleted = function (item) {

        var index = $scope.didList.indexOf(item);
        if (index != -1) {
            $scope.didList.splice(index, 1);
        }

    };

    $scope.DeleteDidNumber = function (didData) {

        didBackendService.deleteDidRecords(didData.id).then(function (response) {

            if (response.data.IsSuccess) {
                $scope.showAlert("Deleted", didData.DidNumber + " Successfully deleted", "success");
                $scope.removeDeleted(didData);
            }
            else {
                $scope.showAlert("Error", didData.DidNumber + " deletion failed", "error");
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.showAlert("Error", didData.DidNumber + " deletion failed", "error");
        });
    }


    $scope.GetDidNumbers();

});
mainApp.controller("didModalController", function ($scope, $uibModalInstance, $filter, didBackendService, didId, didData, reloadPage) {

    $scope.showModal = true;
    $scope.Extensions = [];
    $scope.TrunkNumbers = [];


    if(didId)
    {
        $scope.did=didData;
        $scope.did.Extension.id=(didData.Extension.id).toString();
    }

    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.RemoveAllocatedDIDs = function () {

        if ($scope.TrunkNumbers) {
            didBackendService.pickAllocatedDIDNumbers().then(function (response) {
                if (response.data.IsSuccess) {

                    angular.forEach(response.data.Result, function (item) {
                        var value = $filter('filter')($scope.TrunkNumbers, {PhoneNumber: item.DidNumber})[0];
                        if (value) {
                            $scope.TrunkNumbers.splice($scope.TrunkNumbers.indexOf(value), 1);
                        }

                    });
                }
                else {
                    $scope.showAlert("Error", "Error in loading Current allocated Trunk numbers", "error");
                }
            }, function (error) {
                loginService.isCheckResponse(error);
                $scope.showAlert("Error", "Error in loading Current allocated Trunk numbers", "error");
            })
        }
    };

    $scope.loadDidNumbers = function () {

        didBackendService.pickPhoneNumbers().then(function (response) {

            if (response.data.IsSuccess) {
                $scope.TrunkNumbers = response.data.Result;
                angular.forEach($scope.TrunkNumbers, function (item) {
                    if (!(item.ObjCategory == "INBOUND" || item.ObjCategory == "BOTH")) {
                        $scope.TrunkNumbers.splice($scope.TrunkNumbers.indexOf(item), 1);
                    }

                });

                if(!didId)
                {
                    $scope.RemoveAllocatedDIDs();
                }



            }
            else {
                $scope.showAlert("Error", "Error in loading Trunk numbers", "error");
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.showAlert("Error", "Error in loading Trunk numbers", "error");
            console.log("Error in loading Trunk numbers", error);
        });
    };

    $scope.loadDidNumbers();


    $scope.updateDid = function (extensionId) {
        if ($scope.did.id) {
            didBackendService.updateDidExtension($scope.did.DidNumber, extensionId).then(function (response) {

                if (response.data.IsSuccess) {
                    $scope.showAlert("Updated", "DID number " + $scope.did.DidNumber + " is successfully updated", "success");

                }
                else {
                    $scope.showAlert("Error", "DID number " + $scope.did.DidNumber + " is failed to update", "error");

                }
                $scope.closeModal();
            }, function (error) {
                loginService.isCheckResponse(error);
                console.log("Error in updating DID " + error);
                $scope.showAlert("Error", "DID number " + $scope.did.DidNumber + " is failed to update", "error");
                $scope.closeModal();
            });
        }

    };

    $scope.addNewDID = function (didData) {


        didBackendService.addNewDidNumber(didData).then(function (response) {

            if (response.data.IsSuccess) {
                $scope.showAlert("Saved", "DID number " + $scope.did.DidNumber + " is successfully saved", "success");

            }
            else {
                $scope.showAlert("Error", "DID number " + $scope.did.DidNumber + " is failed to save", "error");

            }
            $scope.closeModal();
        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.showAlert("Error", "DID number " + $scope.did.DidNumber + " is failed to save", "error");
            $scope.closeModal();
        });


    }

    $scope.saveOrUpdate = function () {
        if (didId) {
            for (var i = 0; i < $scope.Extensions.length; i++) {
                if ($scope.Extensions[i].id == $scope.did.Extension.id) {
                    $scope.updateDid($scope.Extensions[i].Extension);
                }
            }

        }
        else {
            $scope.did.DidActive = true;
            $scope.did.ExtensionId = $scope.did.Extension.id;
            $scope.addNewDID($scope.did);

        }
    }

    $scope.pickExtensions = function () {

        didBackendService.pickExtensionRecords().then(function (response) {

            if (response.data.IsSuccess) {

                $scope.Extensions = response.data.Result;
                console.log($scope.Extensions.length + " Extensions received");
            }
            else {
                console.log("Errors in getting extensions");
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Errors in getting extensions " + error);
        })

    };

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
        reloadPage();
    }


    $scope.pickExtensions();

});