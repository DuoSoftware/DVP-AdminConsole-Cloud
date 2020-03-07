/**
 * Created by dinusha on 12/16/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var qaRatingCtrl = function ($scope, $uibModal, $location, $anchorScroll, loginService) {

        $scope.showAlert = function (title, type, content) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };


    };


    app.controller("qaRatingCtrl", qaRatingCtrl);
}());