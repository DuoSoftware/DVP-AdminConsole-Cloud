/**
 * Created by dinusha on 6/16/2016.
 */
mainApp.directive('timePicker', function () {
    return {
        restrict: "E",
        require: "ngModel",
        scope: true,
        templateUrl: 'views/cdr/timePicker.html',
        controller: function($scope, $element, $attrs)
        {
            $scope.Hour = '00:00';
            $scope.Minute = '00:00';

            var ngModelName = $attrs.ngModel;
            $element.scope().$watch(ngModelName, function(val)
            {
                var newModelValue = '00:00';
                var valInStr = val.toString();

                var splitTime = valInStr.split(':');

                if(splitTime.length === 2)
                {
                    //ok

                    var cleanUpHr = splitTime[0].replace(/((?![0-9]).)/g, '');

                    if(cleanUpHr)
                    {
                        var intHr = parseInt(cleanUpHr);

                        if(intHr >= 0 && intHr <= 23)
                        {
                            var cleanUpMin = splitTime[1].replace(/((?![0-9]).)/g, '');

                            if(cleanUpMin)
                            {
                                var intMin = parseInt(cleanUpMin);

                                if(intMin >= 0 && intMin <= 59)
                                {

                                    $scope.Hour = cleanUpHr;
                                    $scope.Minute = cleanUpMin;

                                    newModelValue = cleanUpHr + ':' + cleanUpMin;
                                }
                            }
                        }
                    }
                }

                var ngModel = $element.controller('ngModel');
                ngModel.$setViewValue(newModelValue);
            }, true);

            $scope.onHrUpPressed = function()
            {

            }



            $scope.onChangeHr = function()
            {
                var strHr = '00';
                var cleanUpHr = $scope.Hour.replace(/((?![0-9]).)/g, '');

                if(cleanUpHr)
                {
                    var intHr = parseInt(cleanUpHr);

                    if(intHr >= 0 && intHr <= 23)
                    {
                        strHr = cleanUpHr;

                    }
                }

                $scope.Hour = strHr;
                var ngModel = $element.controller('ngModel');
                ngModel.$setViewValue($scope.Hour + ':' + $scope.Minute);



            };

            $scope.onChangeMin = function()
            {
                var strMin = '00';
                var cleanUpMin = $scope.Minute.replace(/((?![0-9]).)/g, '');

                if(cleanUpMin)
                {
                    var intMin = parseInt(cleanUpMin);

                    if(intMin >= 0 && intMin <= 59)
                    {
                        strMin = cleanUpMin;

                    }
                }

                $scope.Minute = strMin;
                var ngModel = $element.controller('ngModel');
                ngModel.$setViewValue($scope.Hour+ ':' + $scope.Minute);

            };


        }
    }
});
