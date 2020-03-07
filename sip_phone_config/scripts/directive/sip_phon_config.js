mainApp.directive("sipphonconfig", function (sipUserService) {

    return {
        restrict: "EA",
        scope: {
            phone: "=",
            sipusers: "="
        },

        templateUrl: 'sip_phone_config/views/partials/sip_phone.html',

        link: function (scope) {
            scope.showAlert = function (tittle, type, content) {
                new PNotify({
                    title: tittle,
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

            scope.editMode = false;
            scope.addSipAccount = function () {
                scope.editMode = !scope.editMode;
            };

            scope.selected_sip_user = {};
            scope.update_ip_phone = function () {
                scope.isUpdate = true;

                sipUserService.add_sip_account_to_phone(scope.phone.mac, scope.selected_sip_user.value.SipUsername).then(function (response) {
                    scope.isUpdate = false;
                    if (response) {
                        scope.showAlert("SIP Config", 'success', 'Successfully Updated.');
                        var index = scope.sipusers.indexOf(scope.selected_sip_user.value);
                        if (index > -1) {
                            scope.sipusers.splice(index, 1);
                        }
                    }
                    else {
                        scope.showAlert("SIP Config", 'error', 'Fail To Update.');
                    }

                }, function (error) {
                    console.error(error);
                    $scope.showAlert("SIP Config", 'error', 'Fail To Get Phone List.');
                    scope.isUpdate = false;
                })
            };

            scope.delete_ip_phone_config = function () {
                scope.isUpdate = true;
                scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " + scope.phone.mac +" SIP Setting.", function (obj) {
                    sipUserService.add_sip_account_to_phone(scope.phone.mac, {}).then(function (response) {
                        scope.isUpdate = false;
                        if (response) {
                            scope.showAlert("SIP Config", 'success', 'Successfully Delete SIP User Configurations.');
                        }
                        else {
                            scope.showAlert("SIP Config", 'error', 'Fail To Delete.');
                        }

                    }, function (error) {
                        console.error(error);
                        $scope.showAlert("SIP Config", 'error', 'Fail To Get Phone List.');
                        scope.isUpdate = false;
                    })
                }, function () {
                    scope.isUpdate = false;
                }, null);




            };
        }

    }
});