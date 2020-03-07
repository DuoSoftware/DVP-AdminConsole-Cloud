/**
 * Created by Rajinda on 12/31/2015.
 */

mainApp.factory("walletService", function ($http, $log, authService, baseUrls) {

    var creditBalance = function () {

        return $http.get(baseUrls.walletUrl + "Wallet").then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
    };

    var listCards = function (walletId) {

        return $http.get(baseUrls.walletUrl + "Wallet/"+walletId+"/Cards").then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
    };

    var createWallet = function (token,email) {
        return $http({
            method: 'post',
            url: baseUrls.walletUrl + "Wallet",
            headers: {
                'api_key': token
            },
            data: {'Email': email,'Description':email,"CurrencyISO": "usd",AutoRecharge:false}
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });

    };

    var updateWallet = function (walletId,config) {
        return $http({
            method: 'put',
            url: baseUrls.walletUrl + "Wallet/"+walletId,
            data: {'AutoRechargeAmount': config.AutoRechargeAmount*100,'ThresholdValue':config.ThresholdValue*100,"AutoRecharge":config.AutoRecharge}
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });

    };

    var addNewCard = function (walletId,token,email,card) {
        return $http({
            method: 'put',
            url: baseUrls.walletUrl + "Wallet/"+walletId+"/Card",
            headers: {
                'api_key': token
            },
            data: {'Email': email,'Description':email,"CurrencyISO": "usd" }
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });

    };

    var removeCard = function (walletId,cardId) {
        return $http({
            method: 'delete',
            url: baseUrls.walletUrl + "Wallet/"+walletId+"/Card/"+cardId
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });

    };

    var buyCredit = function (amount,walletId) {
        return $http({
            method: 'post',
            url: baseUrls.walletUrl + "Wallet/"+walletId+"/Credit",
            data: {'Amount': amount}
        }).then(function (response) {
            /*if (response.data && response.data.IsSuccess) {
                return response.data;
            } else {
                return undefined;
            }*/
            return response.data;
        });

    };

    var setDefaultCard = function (cardId,walletId) {
        return $http({
            method: 'put',
            url: baseUrls.walletUrl + "Wallet/"+walletId+"/Card/"+cardId
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });

    };


    return {
        CreditBalance: creditBalance,
        CreateWallet:createWallet,
        BuyCredit:buyCredit,
        ListCards:listCards,
        AddNewCard:addNewCard,
        RemoveCard:removeCard,
        UpdateWallet:updateWallet,
        SetDefaultCard:setDefaultCard
    }

});
