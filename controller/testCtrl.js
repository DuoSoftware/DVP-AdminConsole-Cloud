/**
 * Created by Damith on 5/27/2016.
 */

'use strict';

mainApp.controller('testCtrl', function ($scope, $interval) {

    // Update the dataset at 25FPS for a smoothly-animating chart
    var maximum = 500;
    $scope.data = [[]];
    $scope.labels = [];
    $scope.options = {
        animation: false,
        showScale: false,
        showTooltips: false,
        pointDot: false,
        datasetStrokeWidth: 0.3,
        backgroundColor: "rgba(255,99,132,0.0)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 5
    };
    $interval(function () {
        getLiveChartData();
    }, 40);

    function getLiveChartData() {
        if ($scope.data[0].length) {
            $scope.labels = $scope.labels.slice(1);
            $scope.data[0] = $scope.data[0].slice(1);
        }

        while ($scope.data[0].length < maximum) {
            $scope.labels.push('');
            $scope.data[0].push(getRandomValue($scope.data[0]));
            console.log(getRandomValue($scope.data[0]));
        }
    }

    function getRandomValue(data) {
        var l = data.length, previous = l ? data[l - 1] : 50;
        var y = previous + Math.random() * 10 - 5;
        return y < 0 ? 0 : y > 100 ? 100 : y;
    }
})
;