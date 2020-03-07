/**
 * Created by marlon on 04/28/2019.
 */

(function(){
    var twilioApi = function($http, baseUrls){
       var GetCountryCodes = function(){
            return $http({
                method: 'GET',
                url: baseUrls.twilioApiUrl +'Countries'
            })
                .then(function(response){
                    return response.data;
                });
        };
        var GetAvailableNumbersByType = function(isoCountry,numberType){
            return $http({
                method: 'GET',
                url: baseUrls.twilioApiUrl +'PhoneNumbers/'+numberType+ '/'+isoCountry
            })
                .then(function(response){
                    return response.data;
                });
        };
        var BuyNumber = function(numberInfo){
            return $http({
                method: 'POST',
                url: baseUrls.twilioApiUrl +'Buy/Number',
                data: JSON.stringify(numberInfo)
            })
                .then(function(response){
                    return response.data;
                });
        };

        return{
            GetCountryCodes: GetCountryCodes,
            GetAvailableNumbersByType: GetAvailableNumbersByType,
            BuyNumber: BuyNumber
        };
    };
    var module = angular.module("veeryConsoleApp");
    module.factory('twilioApi', twilioApi);
}());