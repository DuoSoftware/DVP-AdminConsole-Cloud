/**
 * Created by Pawan on 1/17/2017.
 */

mainApp.directive("submissionview", function ($filter,$uibModal) {

    return {
        restrict: "EAA",
        scope: {
            submissionkey: "=",
            submissiondata: "=",
            'updateApplication': '&',
            'reloadpage':'&'
        },

        templateUrl: 'views/qaRatingReport/partials/submissionView.html',

        link: function (scope) {



            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

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

            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.showModal = function () {
                //modal show
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/qaRatingReport/partials/paperDetailsViewer.html',
                    controller: 'paperViewController',
                    size: 'lg',
                    resolve: {
                        submissiondata: function () {
                            return scope.submissiondata;
                        }
                    }
                });
            };



        }

    }
});