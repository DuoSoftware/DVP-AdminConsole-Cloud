/**
 * Created by Rajinda on 11/22/2016.
 */

mainApp.controller("creditController", function ($scope, walletService, $anchorScroll) {
    $anchorScroll();

    /*$scope.config = {
     publishKey: 'pk_test_1zgLjpz4eFC1bbhfkE1LZfqh',
     title: 'Facetone',
     description: "Communication and Collaboration Platform Developed Under the Veery platform.",
     logo: 'images/logo_130x130yellow.png',
     label: 'New Card'
     };*/

    $scope.config = {
        publishKey: 'pk_test_L5zUHIzLje2UXP0oPVJ8FoX3',
        title: 'Facetone',
        description: "Communication and Collaboration Platform",
        logo: 'images/logo_130x130yellow.png',
        label: 'Save Card'
    };

    $scope.Amount = 0;
    $scope.isLoading = false;
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

        });

    };

    $scope.showError = function (tittle, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: 'error',
            styling: 'bootstrap3'
        });
    };

    $scope.showAlert = function (tittle, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'success',
            styling: 'bootstrap3'
        });
    };
    $scope.isBuyCredit = false;
    $scope.Amount = 50;
    $scope.buyCredit = function (amount) {
        amount = amount * 100;
        $scope.isBuyCredit = true;
        walletService.BuyCredit(amount, $scope.wallet.WalletId).then(function (res) {
            if (res.IsSuccess) {
                $scope.showAlert("Credit", "Your Current Balance is : " + res.Result / 100);
                $scope.wallet.Credit = res.Result / 100;
            } else {
                var msg = res.Exception.Message ? res.Exception.Message : "Fail To Buy Credit.";
                $scope.showError("Credit", msg);
            }
            $scope.isBuyCredit = false;
        }, function (err) {
            $scope.showError("Credit", "Fail To Buy Credit.");
            $scope.isBuyCredit = false;
        });
    };


    $scope.wallet = {
        WalletId: -1,
        Credit: 0,
        AutoRechargeAmount: 0,
        AutoRecharge: true,
        ThresholdValue: 0
    };

    /* $scope.walletConfig = {
     AutoRechargeAmount:0,
     AutoRecharge:true,
     ThresholdValue:0
     }; */
    $scope.CreditBalance = function () {
        walletService.CreditBalance().then(function (res) {
            if (res) {
                $scope.wallet.WalletId = parseInt(res.WalletId);
                $scope.wallet.Credit = parseInt(res.Credit) / 100;
                $scope.wallet.AutoRechargeAmount = parseInt(res.AutoRechargeAmount) / 100;
                $scope.wallet.ThresholdValue = parseInt(res.ThresholdValue) / 100;
                $scope.wallet.AutoRecharge = res.AutoRecharge;
            }
            $scope.ListCards();
        }, function (err) {
            $scope.showError("Credit", "Fail To Get Wallet Details.");
        });
    };
    $scope.CreditBalance();

    $scope.cardList = [];
    $scope.ListCards = function () {
        $scope.isLoading = true;
        walletService.ListCards($scope.wallet.WalletId).then(function (res) {
            $scope.cardList = res;
            $scope.isLoading = false;
        }, function (err) {
            $scope.showError("Credit", "Fail To Get Card Details.");
            $scope.isLoading = false;
        });
    };

    $scope.RemoveCord = function (card) {
        $scope.showConfirm("Delete Card", "Delete", "ok", "cancel", "Do you want to delete " + card.name, function (obj) {
            walletService.RemoveCard($scope.wallet.WalletId, card.id).then(function (res) {
                if (res) {
                    $scope.showAlert("Credit", "Selected Card Has Been Removed Form You Account Successfully.");
                    $scope.ListCards();
                } else {
                    $scope.showError("Credit", "Fail To Remove Selected Card.");
                }
            }, function (err) {
                $scope.showError("Credit", "Fail To Remove Selected Card.");
            });

        }, function () {

        }, card);
    };


    $scope.UpdateWallet = function (config) {
        walletService.UpdateWallet($scope.wallet.WalletId, config).then(function (res) {
            if (res) {
                $scope.showAlert("Update Wallet", "Successfully Configured..");
            } else {
                $scope.showError("Update Wallet", "Fail To Configured.");
            }
        }, function (err) {
            $scope.showError("Update Wallet", "Fail To Configured.");
        });
    };

    $scope.setDefaultCard = function (card) {
        walletService.SetDefaultCard(card.id, $scope.wallet.WalletId).then(function (res) {
            if (res) {
                $scope.showAlert("Update Wallet", "Card Set To Default.");
            } else {
                $scope.showError("Update Wallet", "Fail To Set Default Card.");
            }
            $scope.ListCards();
        }, function (err) {
            $scope.showError("Update Wallet", "Fail To Set Default Card.");
        });
    };

    $scope.rechargTo = 0;
    $scope.$watch('wallet', function (newVal, oldVal) {
        $scope.rechargTo = 0;
        if ($scope.wallet.Credit < (newVal.ThresholdValue * 10)) {
            var b = newVal.AutoRechargeAmount - ($scope.wallet.Credit );
            if (b > 0) {
                $scope.rechargTo = b;
            }
        }

    }, true);

    $scope.$on('stripe-token-received', function (event, args) {
        $scope.CreditBalance();
    });
});
