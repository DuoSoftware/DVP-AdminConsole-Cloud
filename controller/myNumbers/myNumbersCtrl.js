/**
 * Created by dinusha on 6/12/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var myNumbersCtrl = function ($scope, $uibModal, $location, $anchorScroll, phnNumApiAccess, voxboneApi, loginService) {

        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };


        $scope.newDropDownState = false;
        $scope.newDropDownStatePhoneNum = false;
        $scope.currentTrunk = {};

        $scope.pressNewButtonPhoneNum = function () {
            if (!$scope.newDropDownStatePhoneNum) {
                $scope.newDropDownStatePhoneNum = true;
            }
        };

        $scope.pressNewButton = function () {
            if (!$scope.newDropDownState) {
                $scope.newDropDownState = true;
            }
        };

        $scope.pressCancelButton = function () {
            $scope.newDropDownState = false;
        };

        $scope.pressCancelButtonPhoneNum = function () {
            $scope.newDropDownStatePhoneNum = false;
        };

        $scope.phnNum = {};
        $scope.searchCriteria = "";

        var resetForm = function () {
            $scope.phnNum = {};
            $scope.currentTrunk = {};
            $scope.searchCriteria = "";
        };

        var resetTrunkForm = function () {
            $scope.currentTrunk = {};
            $scope.searchCriteria = "";
        };

        var getLimits = function () {
            phnNumApiAccess.getLimits().then(function (data) {
                if (data.IsSuccess) {
                    $scope.limitList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading limits";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.updateTrunk = function (trunk) {
            phnNumApiAccess.updateTrunk(trunk.EditData.id, trunk.EditData).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Trunk settings updated');

                    if (data.Result) {
                        trunk.TrunkName = data.Result.TrunkName;
                        trunk.IpUrl = data.Result.IpUrl;
                        trunk.TranslationId = data.Result.TranslationId;

                        trunk.Enabled = data.Result.Enabled;
                    }

                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error updating trunk";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var loadNumbers = function () {
            $scope.myNumList = [];

            phnNumApiAccess.getMyNumbers().then(function (data) {
                if (data.IsSuccess) {
                    data.Result.forEach(function (phn) {
                        phn.EditData = angular.copy(phn);
                    });
                    $scope.myNumList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading numbers";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };


        $scope.trunkEditMode = function (trunk, mode) {
            if (mode === 1) {
                if (trunk.OpenStatus === 1) {
                    trunk.OpenStatus = 0;
                }
                else {
                    trunk.OpenStatus = 1;
                }
            }

            if (mode === 2) {
                if (trunk.OpenStatus === 2) {
                    trunk.OpenStatus = 0;
                }
                else {
                    trunk.OpenStatus = 2;

                    //get ip addresses
                    trunk.IpRangeData = {};
                    loadIpAddresses(trunk);
                }
            }


        };

        $scope.phoneEditMode = function (phone) {
            if (phone.OpenStatus === 1) {
                phone.OpenStatus = 0;
            }
            else {
                phone.OpenStatus = 1;
            }


        };

        $scope.addIpAddress = function (trunk) {
            phnNumApiAccess.addTrunkIpAddress(trunk.id, trunk.IpRangeData).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Ip address added');

                    loadIpAddresses(trunk);

                    trunk.IpRangeData = {};
                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error adding ip address";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.ipAddressDelete = function (trunk, trunkIpObj) {
            phnNumApiAccess.removeTrunkIpAddress(trunk, trunkIpObj.id).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Ip address deleted');

                    loadIpAddresses(trunk);

                    trunk.IpRangeData = {};
                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                    loadIpAddresses(trunk);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error adding ip address";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
                loadIpAddresses(trunk);
            });

            return false;
        };


        $scope.phoneNumberDelete = function (number) {

            new PNotify({
                title: 'Confirm deletion',
                text: 'Are you sure you want to delete phone number ?',
                type: 'warn',
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
            }).get().on('pnotify.confirm', function () {
                phnNumApiAccess.removeTrunkNumber(number.PhoneNumber).then(function (data) {
                    if (data.IsSuccess) {
                        $scope.showAlert('Success', 'success', 'Ip address deleted');

                        loadNumbers();
                    }
                    else {
                        var errMsg = "";
                        if (data.Exception && data.Exception.Message) {
                            errMsg = data.Exception.Message;
                        }

                        if (data.CustomMessage) {
                            errMsg = data.CustomMessage;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error deleting phone number";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                });
            }).on('pnotify.cancel', function () {

            });


            return false;
        };

        $scope.tagAdding = function (tag) {
            return false;
        };

        var loadIpAddresses = function (trunk) {
            trunk.IpAddressList = [];
            phnNumApiAccess.getTrunkIpAddresses(trunk.id).then(function (data) {
                if (data.IsSuccess) {
                    if (data.Result) {


                        trunk.IpAddressList = data.Result.map(function (ip) {
                            newIpAddressObj = ip;
                            newIpAddressObj.DisplayValue = ip.IpAddress + '/' + ip.Mask;
                            return newIpAddressObj;
                        });
                    }

                    //$scope.trunkList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading trunk ip addresses";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var loadTrunks = function () {
            $scope.trunkList = [];
            phnNumApiAccess.getTrunks().then(function (data) {
                if (data.IsSuccess) {
                    data.Result.forEach(function (trunk) {
                        trunk.EditData = angular.copy(trunk);
                    });
                    $scope.trunkList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading trunks";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        var loadTranslations = function () {
            phnNumApiAccess.getTranslations().then(function (data) {
                if (data.IsSuccess) {
                    $scope.transList = data.Result;
                }
                else {
                    var errMsg = data.CustomMessage;

                    if (data.Exception) {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading translations";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.addNewTrunk = function () {
            phnNumApiAccess.addNewTrunk($scope.currentTrunk).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Trunk configuration added');

                    resetTrunkForm();

                    loadTrunks();
                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error saving trunk";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.addNewNumber = function () {

            phnNumApiAccess.savePhoneNumber($scope.phnNum).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Phone number added');

                    resetForm();

                    loadNumbers();
                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error saving phone number";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.updateNumber = function (phnNum) {

            phnNumApiAccess.updatePhoneNumber(phnNum.EditData).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('Success', 'success', 'Phone number updated');

                    if (data.Result) {
                        phnNum.ObjCategory = data.Result.ObjCategory;
                        phnNum.Enable = data.Result.Enable;
                        phnNum.TrunkId = data.Result.TrunkId;
                        phnNum.InboundLimitId = data.Result.InboundLimitId;
                        phnNum.OutboundLimitId = data.Result.OutboundLimitId;
                        phnNum.BothLimitId = data.Result.BothLimitId;
                    }
                }
                else {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }

            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error saving phone number";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };


        loadTranslations();
        loadTrunks();
        loadNumbers();
        getLimits();

        //------------------------------------------------voxboneNumber---------------------------------------------

        $scope.order = {};
        $scope.selectedVoxDidGroup = undefined;
        $scope.selectedCountry = undefined;
        $scope.searchQ = {};
        $scope.searchQ.isTableLoading = 0;
        $scope.didTypes = [{group: "VOXDID",
            items: [{key: "Geographic", value: "GEOGRAPHIC"}, {key: "National", value: "NATIONAL"}, {
                key: "Mobile",
                value: "MOBILE"
            }, {key: "Nomadic", value: "INUM"}]
        }, {group: "VOX800",
            items: [{key: "Toll-free", value: "TOLL_FREE"}, {key: "Shared Cost", value: "SHARED_COST"}, {
                key: "Special",
                value: "SPECIAL"
            }]
        }];
        $scope.voxDidGroupList = [];
        $scope.pageNumber = 0;
        $scope.pageSize = 10;
        $scope.numberOfPages = 0;

        $scope.dtOptions = {paging: false, searching: false, info: false, order: [1, 'asc']};
        $scope.pagination = {
            currentPage: 1,
            maxSize: 5,
            totalItems: 0,
            itemsPerPage: 10
        };


        $scope.selectVoxDidGroup = function (voxDidGroup) {
            if (voxDidGroup) {
                var voxSetupFee = voxDidGroup.setup100?parseInt(voxDidGroup.setup100):0;
                var voxMonthlyFee = voxDidGroup.monthly100?parseInt(voxDidGroup.monthly100):0;
                $scope.selectedVoxDidGroup = voxDidGroup;
                $scope.order.customerReference = 'ref:' + voxDidGroup.didGroupId;
                $scope.order.quantity = 1;
                $scope.order.didGroup = voxDidGroup;
                $scope.order.didGroupId = voxDidGroup.didGroupId;
                $scope.order.numberSetupFee = voxSetupFee/100;
                $scope.order.monthlyFee = voxMonthlyFee/100;
                $location.hash('voxDidLimitScroll');
                $anchorScroll();
            }
        };

        $scope.selectCountry = function (country) {
            if (country) {
                $scope.selectedCountry = country;
                $scope.order.countryCodeA3 = country.countryCodeA3;
                $scope.loadStates(country.countryCodeA3);
            }
        };

        $scope.pageChanged = function () {
            $scope.loadDidGroups();
        };

        $scope.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };

        $scope.clearOrder = function () {
            $scope.searchQ.isTableLoading = 0;
            $scope.order = {countryCodeA3: $scope.order.countryCodeA3};
            $scope.selectedVoxDidGroup = undefined;
            $location.hash('voxDidTop');
            $anchorScroll();

        };

        $scope.showModal = function () {
            //modal show
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/mynumbers/voxNumberConfirmation.html',
                controller: 'voxNumberConfirmModalController',
                size: 'sm',
                resolve: {
                    order: function () {
                        return $scope.order;
                    },
                    numberRates: function () {
                        return $scope.numberRates;
                    },
					clearOrder: function () {
						return $scope.clearOrder;
					}
                }
            });
        };

        $scope.loadNumberRates = function () {
            voxboneApi.GetNumberRates().then(function (response) {
                if (response.IsSuccess) {
                    if(response.Result) {
                        $scope.numberRates = response.Result;
                    }else{
                        $scope.showAlert("Voxbone", 'error', 'Loading error, No number rates found');
                    }
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert("Voxbone", 'error', errMsg);
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading number rates";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Voxbone', 'error', errMsg);
            });
        };

        $scope.loadNumberRates();

        $scope.loadStates = function (countryCode) {
            voxboneApi.GetStates(countryCode).then(function (response) {
                if (response.IsSuccess) {
                    var jResult = JSON.parse(response.Result);
                    $scope.states = jResult;
                }
                else {
                    if (Array.isArray(response.Result)) {
                        $scope.showAlert("Voxbone", 'error', response.Result[0].apiErrorMessage);
                    } else {
                        var errMsg = response.CustomMessage;

                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert("Voxbone", 'error', errMsg);
                    }
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading States";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Voxbone', 'error', errMsg);
            });
        };

        $scope.loadCountryCodes = function () {
            voxboneApi.GetCountryCodes(0, 500).then(function (response) {
                if (response.IsSuccess) {
                    var jResult = JSON.parse(response.Result);
                    $scope.countries = jResult.countries;
                    $scope.autoCompletePlaceHolder = "Select Your Country";
                    /*$scope.countries.map( function (country) {
                     return {
                     country: country
                     };
                     });*/
                }
                else {
                    if (Array.isArray(response.Result)) {
                        $scope.showAlert("Voxbone", 'error', response.Result[0].apiErrorMessage);
                    } else {
                        var errMsg = response.CustomMessage;

                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert("Voxbone", 'error', errMsg);
                    }
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading Country Codes";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Voxbone', 'error', errMsg);
            });
        };
        $scope.loadCountryCodes();

        $scope.loadDidGroups = function () {
            console.log($scope.selectedCountry);

            if ($scope.searchQ.selectedCity && $scope.searchQ.selectedCity !== "All") {
                voxboneApi.FilterDidsFormState($scope.searchQ.selectedDidType, $scope.searchQ.selectedCity, $scope.selectedCountry.countryCodeA3, $scope.pagination.currentPage - 1, $scope.pagination.itemsPerPage).then(function (response) {
                    if (response.IsSuccess) {
                        if (response.Result) {
                            var jResult = JSON.parse(response.Result);
                            for (i = 0; i < jResult.didGroups.length; i++) {
                                var voxIn = [{name: "VoxIN"}];
                                //append voxIn data to front in feature list
                                jResult.didGroups[i].features = voxIn.concat(jResult.didGroups[i].features);
                            }

                            $scope.voxDidGroupList = jResult;
                            $scope.pagination.totalItems = jResult.resultCount;
                            $scope.searchQ.isTableLoading = 1;
                            $location.hash('voxDidGroupScroll');
                            $anchorScroll();
                        }
                    }
                    else {
                        var errMsg = response.CustomMessage;

                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert('DID Group List', errMsg, 'error');
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading DID groups";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('DID Group List', errMsg, 'error');
                });
            } else {
                voxboneApi.FilterDidsFormType($scope.searchQ.selectedDidType, $scope.selectedCountry.countryCodeA3, $scope.pagination.currentPage - 1, $scope.pagination.itemsPerPage).then(function (response) {
                    if (response.IsSuccess) {
                        if (response.Result) {
                            var jResult = JSON.parse(response.Result);
                            for (i = 0; i < jResult.didGroups.length; i++) {
                                var voxIn = [{name: "VoxIN"}];
                                //append voxIn data to front in feature list
                                jResult.didGroups[i].features = voxIn.concat(jResult.didGroups[i].features);
                            }

                            $scope.voxDidGroupList = jResult;
                            $scope.pagination.totalItems = jResult.resultCount;
                            $scope.searchQ.isTableLoading = 1;
                            $location.hash('voxDidGroupScroll');
                            $anchorScroll();
                        }
                    }
                    else {
                        var errMsg = response.CustomMessage;

                        if (response.Exception) {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert('DID Group List', errMsg, 'error');
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading DID groups";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('DID Group List', errMsg, 'error');
                });
            }
        };


    };


    app.controller("myNumbersCtrl", myNumbersCtrl);
}());


mainApp.controller("voxNumberConfirmModalController", function ($scope, $uibModalInstance, order, numberRates, clearOrder, voxboneApi) {
    $scope.showModal = true;
    $scope.order = order;
    $scope.numberRates = numberRates;

    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    var calculateNumberFee = function () {
        $scope.order.ChannelCount = $scope.order.ChannelCount?$scope.order.ChannelCount:1;
        $scope.order.numberSetupFee = $scope.order.numberSetupFee + $scope.numberRates.NumberSetupFee;
        $scope.order.monthlyFee = $scope.order.monthlyFee + ($scope.order.monthlyFee * $scope.numberRates.NumberRSCRate / 100) + ($scope.order.ChannelCount * $scope.numberRates.ChannelFee);
    };

    calculateNumberFee();

    $scope.isOrderInitiated = false;
    $scope.initiateOrder = function () {
		$scope.isOrderInitiated = true;
		voxboneApi.OrderDid($scope.order).then(function (response) {
            if (response.IsSuccess) {
				$scope.isOrderInitiated = false;
				// var jResult = JSON.parse(response.Result);
				// var result = jResult.productCheckoutList[0];
				$scope.showAlert("Voxbone", response.CustomMessage, "success");
                $scope.closeModal();
            }
            else {
                if (Array.isArray(response.Result)) {
					$scope.isOrderInitiated = false;
					$scope.showAlert("Voxbone", response.Result[0].apiErrorMessage, 'error');
                } else {
					$scope.isOrderInitiated = false;
					var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
					$scope.showAlert("Voxbone", errMsg, 'error');
                }
            }
        }, function (err) {
			$scope.isOrderInitiated = false;
			loginService.isCheckResponse(err);
            var errMsg = "Error occurred while initiate order";
            if (err.statusText) {
                errMsg = err.statusText;
            }
			$scope.showAlert('Voxbone', errMsg, 'error');
        });
    };

    $scope.closeModal = function () {
		clearOrder();
        $uibModalInstance.dismiss('cancel');
        //reloadPage();
    };


});


mainApp.controller("TwilioController", function ($scope, twilioApi) {
    //------------------------------------------------twilioNumber---------------------------------------------


    $scope.twilioSearchQ = {};
    $scope.twilioSearchQ.isTableLoading = 0;

    $scope.twilioModelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };

    $scope.twilioNumberTypes = [{key: "Local", value: "Local"},
        {key: "Toll free", value: "TollFree"},
        {key: "Mobile", value: "Mobile"}];
    $scope.twilioSearchQ.numberType = "Local";

    $scope.twilioLoadCountryCodes = function () {
        twilioApi.GetCountryCodes().then(function (response) {
            if (response.IsSuccess) {
                $scope.twilioCountries = response.Result;
                $scope.twilioSearchQ.selectedCountry = response.Result[0];
                // $scope.autoCompletePlaceHolder = "Select Your Country";
            } else {
                if (Array.isArray(response.Result)) {
                    $scope.showAlert("Twilio", 'error', response.Result[0].apiErrorMessage);
                } else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert("Twilio", 'error', errMsg);
                }
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while loading Country Codes";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Twilio', 'error', errMsg);
        });
    };
    $scope.twilioLoadCountryCodes();

    $scope.twilioSelectCountry = function (country) {
        if (country) {
            $scope.twilioSelectedCountry = country;
        }
    };


    $scope.loadPhoneNumbers = function () {
        if ($scope.searchQ.selectedCity !== "All") {
            $scope.twilioSearchQ.isTableLoading = 1;
            twilioApi.GetAvailableNumbersByType($scope.twilioSearchQ.selectedCountry.isoCountry, $scope.twilioSearchQ.numberType).then(function (response) {
                if (response.IsSuccess) {
                    if (response.Result && response.Result.length > 0) {
                        var jResult = response.Result;
                        $scope.phoneNumberDetail = jResult;
                        $scope.phoneNumberDetail.map(function (v) {
                            v.isActive = true
                        });
                        $scope.twilioSearchQ.isTableLoading = 0;
                        $scope.showAlert('Twilio', 'success', response.CustomMessage);
                    } else {
                        $scope.twilioSearchQ.isTableLoading = 0;
                        $scope.showAlert('Twilio', 'error', 'No phone numbers found for searched country');
                    }
                } else {
                    var errMsg = response.CustomMessage;

                    if (!errMsg) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.phoneNumberDetail = [];
                    $scope.twilioSearchQ.isTableLoading = 0;
                    $scope.showAlert('Twilio', 'error', errMsg);
                }
            }, function (err) {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading phone numbers";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.twilioSearchQ.isTableLoading = 0;
                $scope.showAlert('Twilio', 'error', errMsg);
            });
        }
    };

    $scope.showConfirm = function (phoneNumberObj) {

        (new PNotify({
            title: 'Buy Twilio number',
            text: 'Do you want to purchase ' + phoneNumberObj.phoneNumber + ' for ' + phoneNumberObj.numberPrice + ' USD',
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
            if (phoneNumberObj) {
                twilioApi.BuyNumber({
                    "number": phoneNumberObj.phoneNumber,
                    "numberType": phoneNumberObj.numberType,
                    "isoCountry": phoneNumberObj.isoCountry
                }).then(function (response) {
                        if(response.IsSuccess){
                            phoneNumberObj.isActive = false;
                            $scope.showAlert('Twilio', 'success', response.CustomMessage);
                        }
                        else {
                            $scope.showAlert("Twilio", 'error', response.CustomMessage);
                        }
                    }

                );

            }
        }).on('pnotify.cancel', function () {
        });

    };
});