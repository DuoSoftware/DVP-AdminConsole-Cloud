/**
 * Created by dinusha on 6/3/2016.
 */

(function(){

    var app = angular.module("veeryConsoleApp");

    app.directive("usernamecheck", function ($q, $http, authService, baseUrls)
    {

        var validateUsername = function (usr)
        {

            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/"  + 'User/' + usr
            }).then(function (resp)
            {
                return resp.data;
            })
        };

        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attributes, ngModel)
            {
                ngModel.$asyncValidators.usernamecheck = function (modelValue)
                {
                    var defer = $q.defer();
                    validateUsername(modelValue).then(function (data)
                        {
                            if (scope.IsEdit)
                            {
                                defer.resolve();
                            }
                            else
                            {
                                if (data.IsSuccess)
                                {
                                    if (data.Result)
                                    {
                                        defer.reject();
                                    }
                                    else
                                    {
                                        defer.resolve();
                                    }
                                }
                                else
                                {
                                    defer.reject();
                                }
                            }
                        },
                        function (err)
                        {
                            defer.reject();
                        });

                    return defer.promise;
                }
            }
        };
    })

    app.directive("extcheck", function($q, $http, authService)
    {

        var validateExtension = function(ext)
        {

            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/"  + 'Extension/' + ext
            }).then(function (resp) {
                return resp.data;
            })
        };

        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {
                ngModel.$asyncValidators.extcheck = function(modelValue) {
                    var defer = $q.defer();
                    if(scope.IsEdit)
                    {
                        defer.resolve();
                    }
                    else
                    {
                        validateExtension(modelValue).then(function(data){
                                if (data.IsSuccess)
                                {
                                    if(data.Result)
                                    {
                                        defer.reject();
                                    }
                                    else
                                    {
                                        defer.resolve();
                                    }
                                }
                                else
                                {
                                    defer.reject();
                                }},
                            function(err)
                            {
                                defer.reject();
                            })
                    }


                    return defer.promise;
                }
            }
        };
    });
}());
