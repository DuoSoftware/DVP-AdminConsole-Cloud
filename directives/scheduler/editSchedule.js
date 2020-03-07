/**
 * Created by Pawan on 7/26/2016.
 */

mainApp.directive("editschedule", function ($filter, $uibModal, scheduleBackendService) {
    console.log("Hit");

    return {
        restrict: "EAA",
        scope: {
            schedule: "=",
            scheduleList: "=",
            showmodalappointments: "&",
            'updateSchedule': '&',
            'reloadpage': '&'
        },

        templateUrl: 'views/scheduler/partials/editSchedule.html',

        link: function (scope) {

            console.log("+++++++++++++++++++++++++++ " + scope.schedule + " ++++++++++++++++++++++++");
            scope.editMode = false;
            scope.configMode = false;

            scope.editAppointment = function () {
                scope.editMode = !scope.editMode;
                console.log(scope.applist);
            };

            scope.pressAdvAppointment = function(){
                scope.showmodalappointments({scheduleId: scope.schedule.id});
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


            scope.showAlert = function (title, content, type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };


            scope.showConig = function (appid) {
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

            scope.cancelUpdate = function () {
                scope.editMode = false;
            };

            scope.showAppointments = function () {
                console.log("hit show " + scope.configMode);
                scope.configMode = !scope.configMode;

            };

            scope.showAppointmentsAdvanced = function () {
                console.log('--------------------- ADVANCED ----------------------')

            };

            scope.modifySchedule = function () {

                scheduleBackendService.updateSchedule(scope.schedule).then(function (response) {
                    if (response.data.IsSuccess) {


                        scope.showAlert("Updated", "Schedule " + scope.schedule.schedule + " updated successfully", "success");
                        scope.editMode = false;


                    }
                    else {
                        scope.showAlert("Error", "Schedule " + scope.schedule.schedule + " updating failed", "error");
                        console.info("Error in updating app " + response.data.Exception);
                    }
                    scope.editMode = false;

                }, function (error) {
                    scope.showAlert("Error", "Schedule " + scope.schedule.schedule + " updating failed", "error");
                    console.info("Error in updating application " + error);
                    scope.editMode = false;
                });


            };

            scope.deleteSchedule = function (schedule) {

                scope.showConfirm("Delete Schedule", "Delete", "ok", "cancel", "Do you want to delete " + schedule.ScheduleName, function (obj) {

                    scheduleBackendService.removeSchedule(schedule.id).then(function (response) {
                        if (response) {
                            scope.updateSchedule(schedule);
                            scope.showAlert("Deleted", "Schedule " + schedule.ScheduleName + " Deleted successfully", "success");
                        }
                        else
                            scope.showAlert("Error", "Error in schedule removing", "error");
                    }, function (error) {
                        scope.showAlert("Error", "Error in schedule removing", "error");
                    });

                }, function () {

                }, schedule);




            }
        }
    }

});