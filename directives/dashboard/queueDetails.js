/**
 * Created by Waruna on 1/4/2018.
 */

mainApp.directive('queueDetails', function () {
    return {

        restrict: 'EA',
        scope: {
            name: "@",
            queueoption: "=",
            pieoption: "=",
            viewmode: "=",
            que: "=",
            mque: "="
        },
        templateUrl: 'template/dashboard/d1-queued-temp.html',
        link: function (scope, element, attributes) {

            scope.quePresentageType = "danger";
            scope.que.isExceeded = false;


            scope.$on('timer-tick', function (e, data) {

                if (data.millis && scope.que.queueDetails && scope.que.queueDetails.MaxWaitTime && data.millis >= (scope.que.queueDetails.MaxWaitTime * 1000)) {
                    scope.que.isExceeded = true;
                }
                else {
                    scope.que.isExceeded = false;
                }

            });

            scope.$watch(function () {
                return scope.que.presentage;
            }, function (newValue, oldValue) {
                if (newValue < 25) {
                    scope.quePresentageType = "danger";
                } else if (newValue < 50) {
                    scope.quePresentageType = "warning";
                } else if (newValue < 75) {
                    scope.quePresentageType = "info";
                } else {
                    scope.quePresentageType = "success";
                }
                console.log("Reload Dashboard quePresentageType ****************************************");

            });


        }
    }
});