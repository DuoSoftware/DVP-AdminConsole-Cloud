/**
 * Created by Pawan on 8/5/2016.
 */
mainApp.directive("edittanslations", function ($filter,$uibModal,transBackendService, _) {

    return {
        restrict: "EAA",
        scope: {
            translation: "=",
            translationList: "=",
            phonenumbers: "=",
            'updateTranslation': '&',
            'reloadpage':'&'
        },

        templateUrl: 'views/translation/partials/editTranslations.html',

        link: function (scope) {

            scope.editMode = false;

            scope.editApplication = function () {
                scope.editMode = !scope.editMode;
                console.log(scope.translationList);
            };

            scope.showAlert = function (tittle,content,type) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.editMode = false;

            scope.editTranslation = function()
            {
                scope.editMode = !scope.editMode;

            };

            scope.updateTranslations = function()
            {
                scope.translation.GhostNumbers =  _.uniq(_.map(scope.translation.GhostNumbers, 'PhoneNumber'));
                transBackendService.updateTranslations(scope.translation.id, scope.translation).then(function (response) {

                    if(response.data.IsSuccess)
                    {
                        scope.showAlert("Success","Translation successfully updated","success");
                    }
                    else
                    {
                        scope.showAlert("Error","Translation update failed","error");
                    }




                }), function (error) {
                    loginService.isCheckResponse(error);
                    scope.showAlert("Error","Translation update failed","error");
                }
            };

            scope.querySearch = function (query)
            {
                var emptyArr = [];
                if (query === "*" || query === "") {
                    if (scope.phonenumbers) {
                        return scope.phonenumbers;
                    }
                    else {
                        return emptyArr;
                    }

                }
                else {
                    if (scope.phonenumbers) {
                        var filteredArr = scope.phonenumbers.filter(function (item) {
                            var regEx = "^(" + query + ")";

                            if (item) {
                                return item.match(regEx);
                            }
                            else {
                                return false;
                            }

                        });

                        return filteredArr;
                    }
                    else {
                        return emptyArr;
                    }
                }

            };

            scope.removeTranslation = function (item) {

                scope.showConfirm("Delete Translation", "Delete", "ok", "cancel", "Do you want to delete " + item.TransName, function (obj) {

                    transBackendService.deleteTranslation(scope.translation).then(function (response) {
                        if (response) {
                            scope.updateTranslation(item);
                            scope.showAlert("Deleted","Translation " + item.TransName + " Deleted successfully","success");
                        }
                        else
                            scope.showAlert("Error", "Error in translation removing", "error");
                    }, function (error) {
                        scope.showAlert("Error", "Error in tranlation removing", "error");
                    });

                }, function () {

                }, item);


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



            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };


            scope.showConig= function (appid) {
                //modal show
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/app-registry/partials/appConfigModal.html',
                    controller: 'modalController',
                    size: 'sm',
                    resolve: {
                        appID: function () {
                            return appid;
                        }
                    }
                });
            };




        }

    }
});