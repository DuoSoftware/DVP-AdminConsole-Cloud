/**
 * Created by Pawan on 12/2/2016.
 */

mainApp.directive("editprefix", function ($filter,$uibModal,companyConfigBackendService) {
    console.log("Hit");

    return {
        restrict: "EAA",
        scope: {
            prefix: "=",
            prefixlist: "=",
            'reloadpage':'&',
            'updateContext':'&'
        },

        templateUrl: 'views/companyConfig/partials/editTicketPrefix.html',

        link: function (scope) {

            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };


            scope.makeAsDefault = function () {
                companyConfigBackendService.makeAsDefaultPrefix(scope.prefix.name).then(function (response) {

                    scope.showAlert("Success",scope.prefix.name+" Set as Default prefix","success");
                    scope.reloadpage();
                }), function (error) {
                    scope.showAlert("Error",scope.prefix.name+" Set as Default prefix failed","error");
                }

            };

        }

    }
});