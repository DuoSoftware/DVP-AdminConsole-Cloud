/**
 * Created by Pawan on 7/26/2016.
 */
mainApp.directive("appointmentdir", function ($filter, $uibModal, scheduleBackendService) {
    console.log("Hit");

    return {
        restrict: "EAA",
        scope: {
            schedule: "=",
            'viewAction': '&'
        },

        templateUrl: 'views/scheduler/appointments.html',

        link: function (scope) {
            scope.AppointmetList = [];
            scope.dayListMode = false;
            scope.newDayList = [];
            scope.newAppointment = {};
            scope.application = null;
            scope.searchCriteria = "";
            // scope.dayList=[{day:"Monday"},{day:"Tuesday"},{day:"Wednesday"},{day:"Thursday"},{day:"Friday"},{day:"Saturday"},{day:"Sunday"}];

            scope.dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


            scope.showAlert = function (title, content, type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.removeDeleted = function (item) {

                console.log("Hit remDel");
                var index = scope.AppointmetList.indexOf(item);
                if (index != -1) {
                    scope.AppointmetList.splice(index, 1);
                }

            };

            scope.optionChanger = function (option) {
                scope.newDayList = [];
                scope.newAppointment.newDaysOfWeek = [];
                if (option == "RecurrencePattern") {
                    if (scope.newAppointment.RecurrencePattern == "WEEKLY") {
                        scope.dayListMode = true;
                    }
                    else {
                        scope.dayListMode = false;
                    }
                }
                scope.appointmentSummary(scope.newAppointment);

            };

            scope.$on('APPOINTMENT_RELOAD', function (event, args) {
                scope.LoadAppointments(args);
            });

            scope.LoadAppointments = function (scheduleId) {

                scheduleBackendService.getAppointments(scheduleId).then(function (response) {

                    if (response.data.Exception) {
                        console.info("Error in picking Appointment list " + response.data.Exception);
                    }
                    else {
                        scope.AppointmetList = response.data.Result;
                        //$scope.MasterAppList = response.data.Result;
                    }

                }), function (error) {
                    console.info("Error in picking App service " + error);
                }

            }

            scope.LoadAppointments(scope.schedule.id);

            scope.querySearch = function (query) {
                if (query === "*" || query === "") {
                    if (scope.dayList) {
                        return scope.dayList;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    //var results = query ? scope.dayList.filter(createFilterFor(query)) : [];
                    //return results;
                    //return [];
                    var results = query ? scope.dayList.filter(createFilterFor(query)) : [];
                    return results;
                }

            };

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(days) {
                    return (days.toLowerCase().indexOf(lowercaseQuery) != -1);
                };
            };


            scope.onChipAdd = function (chip) {

                scope.newDayList.push(chip.DayName);
                console.log(scope.newDayList);
                if (scope.newDayList.length > 0) {
                    scope.newAppointment.DaysOfWeek = scope.newDayList;
                }
                scope.appointmentSummary(scope.newAppointment);


            };
            scope.onChipDelete = function (chip) {

                var index = scope.newDayList.indexOf(chip.DayName);
                console.log("index ", index);
                if (index > -1) {
                    scope.newDayList.splice(index, 1);
                    console.log(scope.newDayList);
                    if (scope.newDayList.length > 0) {
                        scope.newAppointment.DaysOfWeek = scope.newDayList;
                    }
                    scope.appointmentSummary(scope.newAppointment);

                }


            };


            scope.saveAppointment = function () {

                if (!scope.newAppointment.RecurrencePattern) {
                    scope.newAppointment.RecurrencePattern = "NONE";
                }


                if (scope.newAppointment.RecurrencePattern == "NONE" || scope.newAppointment.RecurrencePattern == "DAILY") {
                    scope.newAppointment.DaysOfWeek = [];
                    scope.newDayList = [];

                }


                scope.newAppointment.ScheduleId = scope.schedule.id;

                scheduleBackendService.saveNewAppointment(scope.newAppointment).then(function (response) {

                    if (!response.data.IsSuccess) {

                        console.info("Error in adding new appointment " + response.data.Exception.Message);
                        scope.showAlert("Error", "There is an error in saving new appointment ", "error");
                        //$scope.showAlert("Error",)
                    }
                    else {

                        scope.searchCriteria = "";
                        scope.showAlert("Success", "New appointment added successfully.", "success");

                        scope.AppointmetList.splice(0, 0, response.data.Result);
                        scope.newAppointment = {};
                        scope.newDayList = [];


                    }

                }), function (error) {
                    console.info("Error in adding new Application " + error);
                    scope.showAlert("Error", "There is an Exception in saving appointment " + error, "error");

                }


            };

            scope.hideAppointments = function () {
                scope.viewAction();
            }

            scope.showEdits = function () {
                console.log("hit show " + scope.configMode);
                scope.configMode = !scope.configMode;

            };

            scope.summaryText = "";
            scope.showSummary = false;
            scope.appointmentSummary = function (newAppointmentData) {

                var appointmentName = newAppointmentData.AppointmentName;
                var recPattern = newAppointmentData.RecurrencePattern;
                var sDate = newAppointmentData.StartDate;
                var eDate = newAppointmentData.EndDate;
                var sTime = newAppointmentData.StartTime;
                var eTime = newAppointmentData.EndTime;
                var weekDays = scope.newDayList;


                if (appointmentName) {
                    scope.showSummary = true;
                }
                else {
                    scope.showSummary = false;
                }


                scope.summaryText = "*Appointment " + appointmentName + " will work ";


                if (sDate && eDate && sTime && eTime) {
                    scope.summaryText += "from " + sDate + " " + sTime + " to " + eDate + " " + eTime;
                }
                if (sDate && eDate && (!sTime || !eTime)) {
                    scope.summaryText += "from " + sDate + " to " + eDate;
                }
                if (sTime && eTime && (!sDate || !eDate)) {
                    scope.summaryText += "from " + sTime + " to " + eTime;
                }
                if (recPattern == "NONE") {
                    scope.summaryText += " everyday";
                }
                if (recPattern == "WEEKLY" && weekDays && weekDays.length == 0) {
                    scope.summaryText += " on every weekday";
                }
                if (recPattern == "WEEKLY" && weekDays && weekDays.length > 0) {
                    var daysSelected = "";
                    angular.forEach(weekDays, function (item) {

                        daysSelected += item + " , ";
                    })
                    scope.summaryText += " on every " + daysSelected;
                }


            };

            //Code by damith last update 10/11
            //Get all appointment actions
            scope.applications = [];
            var allAction = [];
            scope.pbxStatus = [];
            var getAppointmentActions = function () {
                scheduleBackendService.getAppointmentActions().then(function (response) {
                    if (response.data.IsSuccess) {
                        if (response.data.Result) {
                            if (response.data.Result) {
                                //get application data
                                for (var result in response.data.Result) {
                                    var application = {
                                        value: result
                                    };
                                    scope.applications.push(application);
                                }
                                allAction = response.data.Result;
                            }
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
            };
            getAppointmentActions();
            //end

            //Change application name
            scope.changeApplication = function (name) {
                if (name && name != "") {
                    for (var result in  allAction) {
                        if (result == name) {
                            scope.pbxStatus = [];
                            console.log(allAction[result]);
                            scope.pbxStatus = allAction[result];
                        }
                    }
                }
            } // end
        }

    }
});