/**
 * Created by Pawan on 1/10/2017.
 */

mainApp.directive("editusertags", function ($filter,$uibModal,companyConfigBackendService) {
    console.log("Hit");

    return {
        restrict: "EAA",
        scope: {
            usertag: "=",
            taglist: "=",
            'reloadpage':'&'
        },

        templateUrl: 'views/companyConfig/partials/editUserTag.html',

        link: function (scope) {

            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

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


            scope.deleteUserTag = function () {
                scope.showConfirm("Delete user tag", "Delete", "ok", "cancel", "Do you want to delete " +scope.usertag.name, function (obj) {

                    companyConfigBackendService.removeUserTag(scope.usertag.name).then(function (response) {

                        scope.showAlert("Success",scope.usertag.name+" Deleted successfully","success");
                        scope.reloadpage(scope.usertag);
                    }), function (error) {
                        scope.showAlert("Error",scope.usertag.name+" Deletion failed","error");
                    }

                }, function () {

                },null);


            }

        }

    }
});