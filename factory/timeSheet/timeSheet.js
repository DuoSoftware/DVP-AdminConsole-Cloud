/**
 * Created by Heshan.i on 9/29/2016.
 */

(function(){
    var timerServiceAccess = function($http, baseUrls){
        var getTimersByUser = function(userId, from, to){
            return $http({
                method: 'GET',
                url: baseUrls.ticketUrl+'Timers/User/'+userId+'?from='+from+'&to='+to
            }).then(function(response){
                return response.data;
            });
        };

        return{
            getTimersByUser: getTimersByUser
        };
    };

    var module = angular.module('veeryConsoleApp');
    module.factory('timerServiceAccess', timerServiceAccess);

}());