/**
 * Created by Damith on 6/19/2016.
 */

mainApp.controller('pricingCtrl', function ($rootScope, $scope, $state,
                                            authService, loginService,packagingService,organizationService, walletService, $anchorScroll, $interval, veeryNotification) {
    $anchorScroll();

    //on load get my package
    $scope.packages = [];
    $scope.myCurrentPackage = null;
    packagingService.getAllPackages(function (result) {
        $scope.packages = result;
        //get my package
        organizationService.getMyPackages(function (status, res, data) {
            if (status && data && data.Result) {
                $scope.myCurrentPackage = data.Result;

                ////////////////////////////////////////sukitha added new logic////////////////////////////////////////////////////
				$scope.myPackages = $scope.packages.filter(function(item){
					return $scope.myCurrentPackage.indexOf(item.packageName) >= 0;
				});


				for (var i = 0; i < $scope.packages.length; i++) {
					for(var j = 0; j < $scope.myPackages.length; j++){

                        if($scope.packages[i].navigationType.toLowerCase() == 'user'){
                            continue;
                        }
                        if($scope.packages[i].packageType == $scope.myPackages[j].packageType){

							if ($scope.packages[i].packageName == $scope.myPackages[j].packageName) {
								$scope.packages[i]['disable'] = true;
								$scope.packages[i]['active'] = true;
								//i = $scope.packages.length;
							}else if($scope.packages[i].price < $scope.myPackages[j].price){

								$scope.packages[i]['disable'] = true;

							}


						}


				}
				    // else {
				    //     $scope.packages[i]['disable'] = true;
				    // }
				}




				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // for (var i = 0; i < $scope.packages.length; i++) {
                // 	for(var j = 0; j < data.Result.length; j++){
				//
					// 	if ($scope.packages[i].packageName == data.Result[j]) {
					// 		$scope.packages[i]['disable'] = true;
					// 		$scope.packages[i]['active'] = true;
					// 		//i = $scope.packages.length;
					// 	}
				//
					// }
                //     // else {
                //     //     $scope.packages[i]['disable'] = true;
                //     // }
                // }
            }
        })
    });

    $scope.showMessage = function (tittle, content, type) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    //onclick get my package
    $scope.onClickBuyPackages = function (pak) {
        walletService.CreditBalance().then(function (res) {
            if ((parseInt(res.Credit) / 100) >= parseInt(pak.price)) {
                packagingService.buyMyPackage(pak.packageName, function (result, data) {
                    if (!result) {
                        $scope.showMessage("Package Buy", "Please Contact System Administrator.", 'error');
                        return;
                    }
                    else {
                        // loginService.clearCookie();
                        //$state.go('login');
                        $scope.showMessage("Package Buy", "Package upgrade was done successfully.", 'success');

                        /** Kasun_Wijeratne_19_FEB_2018
						 * --------------------------------*/
						$rootScope.userGuideMin = false;
						$rootScope.freshUser = true;
						$rootScope.guidePhase1Closure = true;
						$rootScope.logoutcount = 5;
						var logoutcounter = $interval(function () {
							if($rootScope.logoutcount == 1){
								$interval.cancel(logoutcounter);
                                authService.Logoff(undefined, function (issuccess) {
									if (issuccess) {
										veeryNotification.disconnectFromServer();
										$rootScope.freshUser = false;
										$rootScope.guidePhase1Closure = false;
										SE.disconnect();
										$state.go('company');
									} else {
										$scope.showMessage("Logout", "Something went wrong. Please logout manually", 'error');
										return -1;
									}
								});
							}
							$rootScope.logoutcount--;
						}, 1200);
						/** --------------------------------
						 * Kasun_Wijeratne_19_FEB_2018 */
						return -1;
                    }
                });
            }
            else {
                $scope.showMessage("Package Buy", "Insufficient Balance. Please Add Credit To Your Account. Needs $" + (parseInt(pak.price) - (parseInt(res.Credit) / 100)) + " more.", 'error');
                $state.go('console.credit');
            }
        }, function (err) {
            $scope.showMessage("Package Buy", "Fail To Get Credit Balance.", 'error');
        });
    };


});
