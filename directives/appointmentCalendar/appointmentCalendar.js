/**
 * Created by dinusha on 2/6/2017.
 */
var app = angular.module("veeryConsoleApp");

app.directive('appointmentCalendar', function(uiCalendarConfig, scheduleBackendService, _) {
    return {
        scope: {
            data: '=',
            schedule: '=',
            schedulesdate: '=',
            scheduleedate: '='
        },
        restrict: 'EAA',
        templateUrl: 'directives/appointmentCalendar/appointmentCalendar.html',
        link: {
            pre: function (scope, elem, attrs)
            {
                scope.saveButtonName = 'Save';
                scope.validationError = '';

                scope.isWeeksDisabled = true;

                scope.clearCurrentAppointment = function ()
                {
                    scope.curAppointment = {
                        RecurrencePattern: 'NONE'
                    };

                    scope.isWeeksDisabled = true;

                    scope.saveButtonName = 'Save';
                };

                scope.onRecurrenceValueChanged = function()
                {
                    if(scope.curAppointment.RecurrencePattern === 'WEEKLY')
                    {
                        scope.isWeeksDisabled = false;
                    }
                    else
                    {
                        scope.isWeeksDisabled = true;
                        scope.curAppointment.WeeklyMonday = false;
                        scope.curAppointment.WeeklyTuesday = false;
                        scope.curAppointment.WeeklyWednesday = false;
                        scope.curAppointment.WeeklyThursday = false;
                        scope.curAppointment.WeeklyFriday = false;
                        scope.curAppointment.WeeklySaturday = false;
                        scope.curAppointment.WeeklySunday = false;
                    }
                };

                scope.validateSubmitData = function(curAppointment)
                {
                    var startDateMoment = null;
                    var endDateMoment = null;
                    var syear = null;
                    var smonth = null;
                    var sday = null;
                    var eyear = null;
                    var emonth = null;
                    var eday = null;

                    if(!curAppointment.AppointmentName)
                    {
                        scope.validationError = 'Appointment name is mandatory';
                        return false;
                    }
                    if(!scope.schedulesdate)
                    {
                        scope.validationError = 'Parent schedule must have a start date';
                        return false;
                    }
                    if(!scope.scheduleedate)
                    {
                        scope.validationError = 'Parent schedule must have a end date';
                        return false;
                    }
                    if(!curAppointment.StartDate)
                    {
                        scope.validationError = 'Start date is mandatory';
                        return false;
                    }
                    else
                    {
                        //moment('2010-10-20').isSameOrBefore('2010-10-21')
                        var isBefore = moment(scope.schedulesdate).isBefore(moment(curAppointment.StartDate));
                        var isSame = moment(scope.schedulesdate).isSame(moment(curAppointment.StartDate));
                        if(!(isBefore || isSame))
                        {
                            scope.validationError = 'Start date of parent schedule should be less than or equal to appointment start date';
                            return false;
                        }
                        try
                        {
                            var dateSplit = curAppointment.StartDate.split('-');

                            if(dateSplit.length === 3)
                            {
                                syear = dateSplit[0];
                                smonth = parseInt(dateSplit[1]) - 1;
                                sday = dateSplit[2];

                                startDateMoment = moment(new Date(syear, smonth, sday));

                                if(!moment(curAppointment.StartDate, 'YYYY-MM-DD', true).isValid())
                                {
                                    scope.validationError = 'Start date is not a valid date format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'Start date is not a valid date format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'Start date is not a valid date format';
                            return false;
                        }

                    }
                    if(!curAppointment.EndDate)
                    {
                        scope.validationError = 'End date is mandatory';
                        return false;
                    }
                    else
                    {
                        var isAfter = moment(scope.scheduleedate).isAfter(moment(curAppointment.EndDate));
                        var isSame = moment(scope.scheduleedate).isSame(moment(curAppointment.EndDate));
                        if(!(isAfter || isSame))
                        {
                            scope.validationError = 'End date of parent schedule should be larger than or equal to appointment end date';
                            return false;
                        }
                        try
                        {
                            var dateSplit = curAppointment.EndDate.split('-');

                            if(dateSplit.length === 3)
                            {
                                eyear = dateSplit[0];
                                emonth = parseInt(dateSplit[1]) - 1;
                                eday = dateSplit[2];

                                endDateMoment = moment(new Date(eyear, emonth, eday));

                                if(!moment(curAppointment.EndDate, 'YYYY-MM-DD', true).isValid())
                                {
                                    scope.validationError = 'End date is not a valid date format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'End date is not a valid date format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'End date is not a valid date format';
                            return false;
                        }
                    }

                    if(startDateMoment.isAfter(endDateMoment))
                    {
                        scope.validationError = 'Start date need to be less than or equal to end date';
                        return false;
                    }
                    if(curAppointment.StartTime)
                    {
                        try
                        {
                            var timeSplit = curAppointment.StartTime.split(':');

                            if(timeSplit.length === 2)
                            {
                                var shour = timeSplit[0];
                                var sminute = timeSplit[1];

                                startDateMoment = moment(new Date(syear, smonth, sday, shour, sminute));

                                if(!moment(curAppointment.StartTime, 'HH:mm', true).isValid())
                                {
                                    scope.validationError = 'Start time is not a valid time format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'Start time is not a valid time format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'Start time is not a valid date format';
                            return false;
                        }

                    }
                    else
                    {
                        if(curAppointment.RecurrencePattern === 'WEEKLY' || curAppointment.RecurrencePattern === 'NONE')
                        {
                            scope.validationError = 'Start time is mandatory for NONE and WEEKLY events';
                            return false;
                        }
                    }
                    if(curAppointment.EndTime)
                    {
                        try
                        {
                            var timeSplit = curAppointment.EndTime.split(':');

                            if(timeSplit.length === 2)
                            {
                                var ehour = timeSplit[0];
                                var eminute = timeSplit[1];

                                endDateMoment = moment(new Date(eyear, emonth, eday, ehour, eminute));

                                if(!moment(curAppointment.EndTime, 'HH:mm', true).isValid())
                                {
                                    scope.validationError = 'End time is not a valid time format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'End time is not a valid time format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'End time is not a valid date format';
                            return false;
                        }

                    }
                    else
                    {
                        if(curAppointment.RecurrencePattern === 'WEEKLY' || curAppointment.RecurrencePattern === 'NONE')
                        {
                            scope.validationError = 'End time is mandatory for NONE and WEEKLY events';
                            return false;
                        }
                    }

                    if(curAppointment.RecurrencePattern === 'NONE' || curAppointment.RecurrencePattern === 'DAILY')
                    {
                        if(startDateMoment.isAfter(endDateMoment))
                        {
                            scope.validationError = 'Start date and time need to be less than or equal to end date';
                            return false;
                        }
                    }
                    if(curAppointment.RecurrencePattern === 'WEEKLY')
                    {
                        if(moment(new Date(0,0,0,shour, sminute)).isAfter(new Date(0,0,0,ehour, eminute)))
                        {
                            scope.validationError = 'Start time should be less than or equal to end time in weekly appointments';
                            return false;
                        }

                        if(!(curAppointment.WeeklyMonday || curAppointment.WeeklyTuesday || curAppointment.WeeklyWednesday || curAppointment.WeeklyThursday || curAppointment.WeeklyFriday || curAppointment.WeeklySaturday || curAppointment.WeeklySunday))
                        {
                            scope.validationError = 'At least one day need to be checked for a weekly recurring schedule';
                            return false;
                        }

                    }
                    scope.validationError = '';
                    return true;


                };

                scope.validateSubmitDataOnMove = function(curAppointment)
                {
                    var startDateMoment = null;
                    var endDateMoment = null;
                    var syear = null;
                    var smonth = null;
                    var sday = null;
                    var eyear = null;
                    var emonth = null;
                    var eday = null;

                    if(!curAppointment.AppointmentName)
                    {
                        scope.validationError = 'Appointment name is mandatory';
                        return false;
                    }
                    if(!scope.schedulesdate)
                    {
                        scope.validationError = 'Parent schedule must have a start date';
                        return false;
                    }
                    if(!scope.scheduleedate)
                    {
                        scope.validationError = 'Parent schedule must have a end date';
                        return false;
                    }
                    if(!curAppointment.StartDate)
                    {
                        scope.validationError = 'Start date is mandatory';
                        return false;
                    }
                    else
                    {
                        //moment('2010-10-20').isSameOrBefore('2010-10-21')
                        var isBefore = moment(scope.schedulesdate).isBefore(moment(curAppointment.StartDate));
                        var isSame = moment(scope.schedulesdate).isSame(moment(curAppointment.StartDate));
                        if(!(isBefore || isSame))
                        {
                            scope.validationError = 'Start date of parent schedule should be less than or equal to appointment start date';
                            return false;
                        }
                        try
                        {
                            var dateSplit = curAppointment.StartDate.split('-');

                            if(dateSplit.length === 3)
                            {
                                syear = dateSplit[0];
                                smonth = parseInt(dateSplit[1]) - 1;
                                sday = dateSplit[2];

                                startDateMoment = moment(new Date(syear, smonth, sday));

                                if(!moment(curAppointment.StartDate, 'YYYY-MM-DD', true).isValid())
                                {
                                    scope.validationError = 'Start date is not a valid date format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'Start date is not a valid date format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'Start date is not a valid date format';
                            return false;
                        }

                    }
                    if(!curAppointment.EndDate)
                    {
                        scope.validationError = 'End date is mandatory';
                        return false;
                    }
                    else
                    {
                        var isAfter = moment(scope.scheduleedate).isAfter(moment(curAppointment.EndDate));
                        var isSame = moment(scope.scheduleedate).isSame(moment(curAppointment.EndDate));
                        if(!(isAfter || isSame))
                        {
                            scope.validationError = 'End date of parent schedule should be larger than or equal to appointment end date';
                            return false;
                        }
                        try
                        {
                            var dateSplit = curAppointment.EndDate.split('-');

                            if(dateSplit.length === 3)
                            {
                                eyear = dateSplit[0];
                                emonth = parseInt(dateSplit[1]) - 1;
                                eday = dateSplit[2];

                                endDateMoment = moment(new Date(eyear, emonth, eday));

                                if(!moment(curAppointment.EndDate, 'YYYY-MM-DD', true).isValid())
                                {
                                    scope.validationError = 'End date is not a valid date format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'End date is not a valid date format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'End date is not a valid date format';
                            return false;
                        }
                    }

                    if(startDateMoment.isAfter(endDateMoment))
                    {
                        scope.validationError = 'Start date need to be less than or equal to end date';
                        return false;
                    }
                    if(curAppointment.StartTime)
                    {
                        try
                        {
                            var timeSplit = curAppointment.StartTime.split(':');

                            if(timeSplit.length === 2)
                            {
                                var shour = timeSplit[0];
                                var sminute = timeSplit[1];

                                startDateMoment = moment(new Date(syear, smonth, sday, shour, sminute));

                                if(!moment(curAppointment.StartTime, 'HH:mm', true).isValid())
                                {
                                    scope.validationError = 'Start time is not a valid time format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'Start time is not a valid time format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'Start time is not a valid date format';
                            return false;
                        }

                    }
                    else
                    {
                        if(curAppointment.RecurrencePattern === 'WEEKLY' || curAppointment.RecurrencePattern === 'NONE')
                        {
                            scope.validationError = 'Start time is mandatory for NONE and WEEKLY events';
                            return false;
                        }
                    }
                    if(curAppointment.EndTime)
                    {
                        try
                        {
                            var timeSplit = curAppointment.EndTime.split(':');

                            if(timeSplit.length === 2)
                            {
                                var ehour = timeSplit[0];
                                var eminute = timeSplit[1];

                                endDateMoment = moment(new Date(eyear, emonth, eday, ehour, eminute));

                                if(!moment(curAppointment.EndTime, 'HH:mm', true).isValid())
                                {
                                    scope.validationError = 'End time is not a valid time format';
                                    return false;
                                }
                            }
                            else
                            {
                                scope.validationError = 'End time is not a valid time format';
                                return false;
                            }
                        }
                        catch(ex)
                        {
                            scope.validationError = 'End time is not a valid date format';
                            return false;
                        }

                    }
                    else
                    {
                        if(curAppointment.RecurrencePattern === 'WEEKLY' || curAppointment.RecurrencePattern === 'NONE')
                        {
                            scope.validationError = 'End time is mandatory for NONE and WEEKLY events';
                            return false;
                        }
                    }

                    if(curAppointment.RecurrencePattern === 'NONE' || curAppointment.RecurrencePattern === 'DAILY')
                    {
                        if(startDateMoment.isAfter(endDateMoment))
                        {
                            scope.validationError = 'Start date and time need to be less than or equal to end date';
                            return false;
                        }
                    }
                    if(curAppointment.RecurrencePattern === 'WEEKLY')
                    {
                        if(moment(new Date(0,0,0,shour, sminute)).isAfter(new Date(0,0,0,ehour, eminute)))
                        {
                            scope.validationError = 'Start time should be less than or equal to end time in weekly appointments';
                            return false;
                        }

                        if(!(curAppointment.WeeklyMonday || curAppointment.WeeklyTuesday || curAppointment.WeeklyWednesday || curAppointment.WeeklyThursday || curAppointment.WeeklyFriday || curAppointment.WeeklySaturday || curAppointment.WeeklySunday))
                        {
                            scope.validationError = 'At least one day need to be checked for a weekly recurring schedule';
                            return false;
                        }

                    }
                    scope.validationError = '';
                    return true;


                };

                scope.showAlert = function (tittle, type, content)
                {

                    new PNotify({
                        title: tittle,
                        text: content,
                        type: type,
                        styling: 'bootstrap3'
                    });
                };

                var redrawEvent = function ()
                {

                    uiCalendarConfig.calendars['myCalendar1'].fullCalendar('refetchEvents');

                    /*var index = _.findIndex(scope.events, function (evt)
                    {
                        return evt.id === appointment.id;
                    });

                    var tempEvt =
                    {
                        title: appointment.AppointmentName,
                        id: appointment.id,
                        appointmentObj: appointment
                    };

                    if (appointment.RecurrencePattern === 'NONE')
                    {

                        if (appointment.StartDate && appointment.EndDate)
                        {
                            var sDateStr = appointment.StartDate;
                            var eDateStr = appointment.EndDate;

                            if (appointment.StartTime)
                            {
                                sDateStr = sDateStr + appointment.StartTime
                            }

                            if (appointment.EndTime)
                            {
                                eDateStr = eDateStr + appointment.EndTime
                            }

                            tempEvt.start = sDateStr;
                            tempEvt.end = eDateStr;

                        }
                    }
                    else if (appointment.RecurrencePattern === 'DAILY')
                    {
                        if (appointment.StartDate && appointment.EndDate && appointment.StartTime && appointment.EndTime)
                        {
                            var sDateStr = appointment.StartDate;
                            var eDateStr = appointment.EndDate;

                            sDateStr = sDateStr + appointment.StartTime;
                            eDateStr = eDateStr + appointment.EndTime;

                            tempEvt.start = sDateStr;
                            tempEvt.end = eDateStr;
                            tempEvt.allDay = true;

                        }
                    }
                    else if (appointment.RecurrencePattern === 'WEEKLY')
                    {
                        if (appointment.DaysOfWeek)
                        {
                            tempEvt.dow = [];

                            if (appointment.DaysOfWeek.includes("Monday"))
                            {
                                tempEvt.dow.push(1);
                            }
                            if (appointment.DaysOfWeek.includes("Tuesday"))
                            {
                                tempEvt.dow.push(2);
                            }
                            if (appointment.DaysOfWeek.includes("Wednesday"))
                            {
                                tempEvt.dow.push(3);
                            }
                            if (appointment.DaysOfWeek.includes("Thursday"))
                            {
                                tempEvt.dow.push(4);
                            }
                            if (appointment.DaysOfWeek.includes("Friday"))
                            {
                                tempEvt.dow.push(5);
                            }
                            if (appointment.DaysOfWeek.includes("Saturday"))
                            {
                                tempEvt.dow.push(6);
                            }
                            if (appointment.DaysOfWeek.includes("Sunday"))
                            {
                                tempEvt.dow.push(7);
                            }

                        }

                        if (tempEvt.dow.length > 0)
                        {
                            var sDateStr = appointment.StartTime;
                            var eDateStr = appointment.EndTime;

                            tempEvt.start = sDateStr;
                            tempEvt.end = eDateStr;

                            if (appointment.StartDate && appointment.EndDate)
                            {
                                tempEvt.ranges = [{start: appointment.StartDate, end: appointment.EndDate}]
                            }


                        }


                    }

                    if (index >= 0)
                    {
                        scope.events.splice(index, 1);
                        scope.events.push(tempEvt);

                    }
                    else
                    {
                        scope.events.push(tempEvt);
                    }*/
                };

                var setUpdateFormData = function (event)
                {
                    scope.curAppointment.id = event.appointmentObj.id;
                    scope.curAppointment.AppointmentName = event.appointmentObj.AppointmentName;
                    scope.curAppointment.RecurrencePattern = event.appointmentObj.RecurrencePattern;
                    scope.curAppointment.StartDate = event.appointmentObj.StartDate;
                    scope.curAppointment.EndDate = event.appointmentObj.EndDate;
                    scope.curAppointment.StartTime = event.appointmentObj.StartTime;
                    scope.curAppointment.EndTime = event.appointmentObj.EndTime;
                    scope.curAppointment.Action = event.appointmentObj.Action;
                    scope.curAppointment.ExtraData = event.appointmentObj.ExtraData;

                    if (event.appointmentObj.RecurrencePattern === 'WEEKLY')
                    {
                        scope.isWeeksDisabled = false;
                        if (event.appointmentObj.DaysOfWeek)
                        {
                            if (event.appointmentObj.DaysOfWeek.includes("Monday"))
                            {
                                scope.curAppointment.WeeklyMonday = true;
                            }
                            else
                            {
                                scope.curAppointment.WeeklyMonday = false;
                            }
                            if (event.appointmentObj.DaysOfWeek.includes("Tuesday"))
                            {
                                scope.curAppointment.WeeklyTuesday = true;
                            }
                            else
                            {
                                scope.curAppointment.WeeklyTuesday = false;
                            }
                            if (event.appointmentObj.DaysOfWeek.includes("Wednesday"))
                            {
                                scope.curAppointment.WeeklyWednesday = true;
                            }
                            else
                            {
                                scope.curAppointment.WeeklyWednesday = false;
                            }
                            if (event.appointmentObj.DaysOfWeek.includes("Thursday"))
                            {
                                scope.curAppointment.WeeklyThursday = true;
                            }
                            else
                            {
                                scope.curAppointment.WeeklyThursday = false;
                            }
                            if (event.appointmentObj.DaysOfWeek.includes("Friday"))
                            {
                                scope.curAppointment.WeeklyFriday = true;
                            }
                            else
                            {
                                scope.curAppointment.WeeklyFriday = false;
                            }
                            if (event.appointmentObj.DaysOfWeek.includes("Saturday"))
                            {
                                scope.curAppointment.WeeklySaturday = true;
                            }
                            else
                            {
                                scope.curAppointment.WeeklySaturday = false;
                            }
                            if (event.appointmentObj.DaysOfWeek.includes("Sunday"))
                            {
                                scope.curAppointment.WeeklySunday = true;
                            }
                            else
                            {
                                scope.curAppointment.WeeklySunday = false;
                            }

                        }

                    }
                    else
                    {
                        scope.isWeeksDisabled = true;
                    }

                    scope.saveButtonName = 'Update';
                };

                scope.uiconfig = {
                    calendar: {
                        height: 450,
                        editable: true,
                        header: {
                            left: 'title',
                            center: '',
                            right: 'today prev,next'
                        },
                        eventRender: function (event, element, view)
                        {

                            if (event.ranges)
                            {
                                return (event.ranges.filter(function (range)
                                    {
                                        return (event.start.isBefore(range.end) &&
                                        event.end.isAfter(range.start));
                                    }).length) > 0;
                            }
                            else
                            {
                                return true;
                            }

                        },
                        eventClick: function (event, jsEvent, view)
                        {
                            setUpdateFormData(event);

                        },
                        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view)
                        {
                            scope.clearCurrentAppointment();

                            var originalObj = {};

                            angular.copy(event.appointmentObj, originalObj);

                            if (event.appointmentObj.RecurrencePattern === 'NONE' || event.appointmentObj.RecurrencePattern === 'DAILY')
                            {
                                if (event.appointmentObj.StartDate && event.appointmentObj.EndDate)
                                {
                                    var isTimeSet = false;
                                    var sDateSplit = event.appointmentObj.StartDate.split('-');
                                    var eDateSplit = event.appointmentObj.EndDate.split('-');

                                    if (eDateSplit.length === 3 && sDateSplit.length === 3)
                                    {
                                        var eyear = eDateSplit[0];
                                        var emonth = parseInt(eDateSplit[1]) - 1;
                                        var eday = eDateSplit[2];

                                        var syear = sDateSplit[0];
                                        var smonth = parseInt(sDateSplit[1]) - 1;
                                        var sday = sDateSplit[2];

                                        var endDateMoment = moment(new Date(eyear, emonth, eday));
                                        var startDateMoment = moment(new Date(syear, smonth, sday));

                                        if (event.appointmentObj.EndTime && event.appointmentObj.StartTime)
                                        {
                                            var eTimeSplit = event.appointmentObj.EndTime.split(':');

                                            if (eTimeSplit.length === 2)
                                            {
                                                var ehour = eTimeSplit[0];
                                                var eminute = eTimeSplit[1];

                                                endDateMoment = moment(new Date(eyear, emonth, eday, ehour, eminute));

                                                var sTimeSplit = event.appointmentObj.StartTime.split(':');

                                                if (sTimeSplit.length === 2)
                                                {
                                                    var shour = sTimeSplit[0];
                                                    var sminute = sTimeSplit[1];

                                                    startDateMoment = moment(new Date(syear, smonth, sday, shour, sminute));
                                                    isTimeSet = true;
                                                }

                                            }


                                        }

                                        if (delta && delta._data)
                                        {
                                            startDateMoment.add({
                                                days: delta._data.days,
                                                months: delta._data.months,
                                                years: delta._data.years,
                                                hours: delta._data.hours,
                                                minutes: delta._data.minutes,
                                                seconds: delta._data.seconds

                                            });

                                            endDateMoment.add({
                                                days: delta._data.days,
                                                months: delta._data.months,
                                                years: delta._data.years,
                                                hours: delta._data.hours,
                                                minutes: delta._data.minutes,
                                                seconds: delta._data.seconds

                                            })

                                        }

                                        event.appointmentObj.EndDate = endDateMoment.format('YYYY-MM-DD');

                                        if (isTimeSet)
                                        {
                                            event.appointmentObj.EndTime = endDateMoment.format('hh:mm');
                                        }

                                        event.appointmentObj.StartDate = startDateMoment.format('YYYY-MM-DD');

                                        if (isTimeSet)
                                        {
                                            event.appointmentObj.StartTime = startDateMoment.format('hh:mm');
                                        }

                                        //setUpdateFormData(event);

                                        //scope.saveUpdateAppointment();

                                        if(!scope.validateSubmitDataOnMove(event.appointmentObj))
                                        {
                                            event.appointmentObj = originalObj;
                                            revertFunc();
                                            scope.showAlert('Error', 'error', scope.validationError);
                                        }
                                        else
                                        {
                                            scheduleBackendService.updateAppointment(event.appointmentObj)
                                                .then(function (updateRes)
                                                {
                                                    if (updateRes.data.IsSuccess)
                                                    {

                                                        scope.showAlert('Success', 'success', 'Appointment updated successfully');
                                                    }
                                                    else
                                                    {
                                                        scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                                        revertFunc();
                                                    }

                                                }).catch(function (err)
                                                {
                                                    scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                                    revertFunc();
                                                })
                                        }



                                    }
                                    else
                                    {
                                        revertFunc();
                                    }

                                }
                                else
                                {
                                    revertFunc();
                                }

                            }
                            else
                            {
                                scope.showAlert('Warning', 'warn', 'Resizing i not allowed for WEEKLY appointments');
                                revertFunc();
                            }
                        },
                        eventResize: function (event, delta, revertFunc, jsEvent, ui, view)
                        {
                            scope.clearCurrentAppointment();
                            var originalObj = {};

                            angular.copy(event.appointmentObj, originalObj);
                            if (event.appointmentObj.RecurrencePattern === 'NONE' || event.appointmentObj.RecurrencePattern === 'DAILY')
                            {
                                if (event.appointmentObj.StartDate && event.appointmentObj.EndDate)
                                {
                                    var isTimeSet = false;
                                    var eDateSplit = event.appointmentObj.EndDate.split('-');

                                    if (eDateSplit.length === 3)
                                    {
                                        var year = eDateSplit[0];
                                        var month = parseInt(eDateSplit[1]) - 1;
                                        var day = eDateSplit[2];

                                        var endDateMoment = moment(new Date(year, month, day));

                                        if (event.appointmentObj.EndTime)
                                        {
                                            var eTimeSplit = event.appointmentObj.EndTime.split(':');

                                            if (eTimeSplit.length === 2)
                                            {
                                                var hour = eTimeSplit[0];
                                                var minute = eTimeSplit[1];

                                                endDateMoment = moment(new Date(year, month, day, hour, minute));
                                                isTimeSet = true;
                                            }
                                        }

                                        if (delta && delta._data)
                                        {
                                            endDateMoment.add({
                                                days: delta._data.days,
                                                months: delta._data.months,
                                                years: delta._data.years,
                                                hours: delta._data.hours,
                                                minutes: delta._data.minutes,
                                                seconds: delta._data.seconds

                                            })

                                        }

                                        event.appointmentObj.EndDate = endDateMoment.format('YYYY-MM-DD');

                                        if (isTimeSet)
                                        {
                                            event.appointmentObj.EndTime = endDateMoment.format('hh:mm');
                                        }

                                        //setUpdateFormData(event);

                                        //scope.saveUpdateAppointment();
                                        if(!scope.validateSubmitDataOnMove(event.appointmentObj))
                                        {
                                            event.appointmentObj = originalObj;
                                            revertFunc();
                                            scope.showAlert('Error', 'error', scope.validationError);
                                        }
                                        else
                                        {
                                            scheduleBackendService.updateAppointment(event.appointmentObj)
                                                .then(function (updateRes)
                                                {
                                                    if (updateRes.data.IsSuccess)
                                                    {

                                                        scope.showAlert('Success', 'success', 'Appointment updated successfully');
                                                    }
                                                    else
                                                    {
                                                        scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                                        revertFunc();
                                                    }

                                                }).catch(function (err)
                                                {
                                                    scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                                    revertFunc();
                                                })
                                        }



                                    }
                                    else
                                    {
                                        revertFunc();
                                    }

                                }
                                else
                                {
                                    scope.showAlert('Error', 'error', 'Start and End dates not found');
                                    revertFunc();
                                }

                            }
                            else
                            {
                                scope.showAlert('Warning', 'warn', 'Resizing i not allowed for WEEKLY appointments');
                                revertFunc();
                            }
                        }
                    }
                };

                scope.eventsF = function (start, end, timezone, callback)
                {
                    var events = [];

                    scheduleBackendService.getAppointments(scope.schedule)
                        .then(function(appointments)
                        {
                            if(appointments && appointments.data && appointments.data.Result)
                            {
                                appointments.data.Result.forEach(function (appointment)
                                {
                                    var tempEvt =
                                    {
                                        title: appointment.AppointmentName,
                                        id: appointment.id,
                                        appointmentObj: appointment
                                    };

                                    if (appointment.RecurrencePattern === 'NONE')
                                    {
                                        tempEvt.color = '#28af26';

                                        if (appointment.StartDate && appointment.EndDate && appointment.StartTime && appointment.EndTime)
                                        {
                                            var sDateStr = appointment.StartDate;
                                            var eDateStr = appointment.EndDate;

                                            if (appointment.StartTime)
                                            {
                                                sDateStr = sDateStr + ' ' + appointment.StartTime
                                            }

                                            if (appointment.EndTime)
                                            {
                                                eDateStr = eDateStr + ' ' + appointment.EndTime
                                            }

                                            tempEvt.start = sDateStr;
                                            tempEvt.end = eDateStr;

                                            events.push(tempEvt);
                                            //uiCalendarConfig.calendars['myCalendar1'].fullCalendar('renderEvent', tempEvt, true);
                                        }
                                    }
                                    else if (appointment.RecurrencePattern === 'DAILY')
                                    {
                                        tempEvt.color = '#d8db2e';
                                        if (appointment.StartDate && appointment.EndDate)
                                        {
                                            var sDateStr = appointment.StartDate;
                                            var eDateStr = appointment.EndDate;

                                            tempEvt.start = sDateStr;
                                            tempEvt.end = eDateStr;
                                            tempEvt.allDay = true;

                                            events.push(tempEvt);
                                            //uiCalendarConfig.calendars['myCalendar1'].fullCalendar('renderEvent', tempEvt, true);
                                        }
                                    }
                                    else if (appointment.RecurrencePattern === 'WEEKLY')
                                    {
                                        tempEvt.color = '#2edbc4';
                                        if (appointment.DaysOfWeek)
                                        {
                                            tempEvt.dow = [];

                                            if (appointment.DaysOfWeek.includes("Monday"))
                                            {
                                                tempEvt.dow.push(1);
                                            }
                                            if (appointment.DaysOfWeek.includes("Tuesday"))
                                            {
                                                tempEvt.dow.push(2);
                                            }
                                            if (appointment.DaysOfWeek.includes("Wednesday"))
                                            {
                                                tempEvt.dow.push(3);
                                            }
                                            if (appointment.DaysOfWeek.includes("Thursday"))
                                            {
                                                tempEvt.dow.push(4);
                                            }
                                            if (appointment.DaysOfWeek.includes("Friday"))
                                            {
                                                tempEvt.dow.push(5);
                                            }
                                            if (appointment.DaysOfWeek.includes("Saturday"))
                                            {
                                                tempEvt.dow.push(6);
                                            }
                                            if (appointment.DaysOfWeek.includes("Sunday"))
                                            {
                                                tempEvt.dow.push(0);
                                            }

                                        }

                                        if (tempEvt.dow.length > 0)
                                        {
                                            var sDateStr = appointment.StartTime;
                                            var eDateStr = appointment.EndTime;

                                            tempEvt.start = sDateStr;
                                            tempEvt.end = eDateStr;

                                            if (appointment.StartDate && appointment.EndDate)
                                            {
                                                //display start date for recurring ranges comes exclusive - this will bypass that when displaying
                                                var tempStart = moment(appointment.StartDate).subtract(1, 'days').format('YYYY-MM-DD');
                                                tempEvt.ranges = [{start: tempStart, end: appointment.EndDate}]
                                            }

                                            events.push(tempEvt);
                                            //uiCalendarConfig.calendars['myCalendar1'].fullCalendar('renderEvent', tempEvt, true);
                                        }


                                    }

                                });

                                callback(events);
                            }
                            else
                            {
                                if(appointments && appointments.data && !appointments.data.IsSuccess)
                                {
                                    scope.showAlert('Appointments', appointments.data.Exception.Message, 'error')

                                }
                                callback(events);
                            }


                        }).catch(function(err)
                        {
                            scope.showAlert('Appointments', 'Error occurred while loading appointments', 'error')
                            callback(events);
                        });

                };

                scope.eventsources = [scope.eventsF];

                scope.curAppointment = {
                    RecurrencePattern: 'NONE'
                };


                scope.deleteCurrentAppointment = function ()
                {
                    new PNotify({
                        title: 'Confirm Deletion',
                        text: 'Are You Sure You Want To Delete Appointment ?',
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
                    }).get().on('pnotify.confirm', function () {
                            scheduleBackendService.removeAppointment(scope.curAppointment.id)
                                .then(function (removeRes)
                                {
                                    if (removeRes.data.IsSuccess)
                                    {

                                        redrawEvent();

                                        scope.clearCurrentAppointment();

                                        scope.showAlert('Success', 'success', 'Appointment updated successfully');
                                    }
                                    else
                                    {
                                        scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                    }

                                }).catch(function (err)
                                {
                                    scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                })
                        }).on('pnotify.cancel', function () {

                        });

                };

                scope.saveUpdateAppointment = function ()
                {
                    //create weekly pattern

                    if(!scope.validateSubmitData(scope.curAppointment))
                    {
                        scope.showAlert('Error', 'error', scope.validationError);
                    }
                    else
                    {
                        var daysArr = [];

                        if (scope.curAppointment.WeeklyMonday)
                        {
                            daysArr.push('Monday');
                        }
                        if (scope.curAppointment.WeeklyTuesday)
                        {
                            daysArr.push('Tuesday');
                        }
                        if (scope.curAppointment.WeeklyWednesday)
                        {
                            daysArr.push('Wednesday');
                        }
                        if (scope.curAppointment.WeeklyThursday)
                        {
                            daysArr.push('Thursday');
                        }
                        if (scope.curAppointment.WeeklyFriday)
                        {
                            daysArr.push('Friday');
                        }
                        if (scope.curAppointment.WeeklySaturday)
                        {
                            daysArr.push('Saturday');
                        }
                        if (scope.curAppointment.WeeklySunday)
                        {
                            daysArr.push('Sunday');
                        }

                        scope.curAppointment.DaysOfWeek = daysArr;

                        if (scope.curAppointment.id)
                        {
                            //update
                            scheduleBackendService.updateAppointment(scope.curAppointment)
                                .then(function (updateRes)
                                {
                                    if (updateRes.data.IsSuccess)
                                    {

                                        redrawEvent();
                                        scope.clearCurrentAppointment();

                                        scope.showAlert('Success', 'success', 'Appointment updated successfully');
                                    }
                                    else
                                    {
                                        scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                    }

                                }).catch(function (err)
                                {
                                    scope.showAlert('Error', 'error', 'Error occurred while updating appointment');
                                })
                        }
                        else
                        {
                            //save
                            scope.curAppointment.ScheduleId = scope.schedule;
                            scheduleBackendService.saveNewAppointment(scope.curAppointment)
                                .then(function (saveRes)
                                {
                                    if (saveRes.data.IsSuccess)
                                    {

                                        redrawEvent();
                                        scope.clearCurrentAppointment();

                                        scope.showAlert('Success', 'success', 'Appointment saved successfully');
                                    }
                                    else
                                    {
                                        scope.showAlert('Error', 'error', 'Error occurred while saving appointment');
                                    }

                                }).catch(function (err)
                                {
                                    scope.showAlert('Error', 'error', 'Error occurred while saving appointment');
                                })

                        }
                    }



                };










                scope.$watch('data', function (newVal, oldVal)
                {
                    if (!angular.equals(newVal, oldVal))
                    {
                        //need to convert new value

                        if (newVal)
                        {

                            /*var date = new Date();
                             var d = date.getDate();
                             var m = date.getMonth();
                             var y = date.getFullYear();

                             var events = [
                             //{title: 'All Day Event', start: new Date(y, m, 1)},
                             //{title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2)},
                             //{id: 999, title: 'Repeating Event', start: new Date(2017, 1, 7, 10), end: new Date(2017, 1, 7, 11), allDay: true},
                             //{id: 999, title: 'Repeating Event', start: new Date(2017, 1, 8, 10), end: new Date(2017, 1, 8, 11), allDay: true},
                             {
                             title: 'Birthday Party',
                             start: '10:00', // a start time (10am in this example)
                             end: '18:00', // an end time (2pm in this example)
                             dow: [ 1, 4 ], // Repeat monday and thursday
                             ranges: [{ //repeating events are only displayed if they are within one of the following ranges.
                             start: '2017-02-01', //next two weeks
                             end: '2017-02-15'
                             }]}
                             //,
                             //{
                             //    title: 'Click for Google',
                             //    start: '2017-02-07',
                             //    end: '2017-02-05'
                             //}
                             ];

                             scope.eventsources[0] = events;*/

                            /*scope.events.slice(0, scope.events.length);

                            newVal.forEach(function (appointment)
                            {
                                var tempEvt =
                                {
                                    title: appointment.AppointmentName,
                                    id: appointment.id,
                                    appointmentObj: appointment
                                };

                                if (appointment.RecurrencePattern === 'NONE')
                                {

                                    if (appointment.StartDate && appointment.EndDate)
                                    {
                                        var sDateStr = appointment.StartDate;
                                        var eDateStr = appointment.EndDate;

                                        if (appointment.StartTime)
                                        {
                                            sDateStr = sDateStr + appointment.StartTime
                                        }

                                        if (appointment.EndTime)
                                        {
                                            eDateStr = eDateStr + appointment.EndTime
                                        }

                                        tempEvt.start = sDateStr;
                                        tempEvt.end = eDateStr;

                                        scope.events.push(tempEvt);
                                        //uiCalendarConfig.calendars['myCalendar1'].fullCalendar('renderEvent', tempEvt, true);
                                    }
                                }
                                else if (appointment.RecurrencePattern === 'DAILY')
                                {
                                    if (appointment.StartDate && appointment.EndDate && appointment.StartTime && appointment.EndTime)
                                    {
                                        var sDateStr = appointment.StartDate;
                                        var eDateStr = appointment.EndDate;

                                        sDateStr = sDateStr + appointment.StartTime;
                                        eDateStr = eDateStr + appointment.EndTime;

                                        tempEvt.start = sDateStr;
                                        tempEvt.end = eDateStr;
                                        tempEvt.allDay = true;

                                        scope.events.push(tempEvt);
                                        //uiCalendarConfig.calendars['myCalendar1'].fullCalendar('renderEvent', tempEvt, true);
                                    }
                                }
                                else if (appointment.RecurrencePattern === 'WEEKLY')
                                {
                                    if (appointment.DaysOfWeek)
                                    {
                                        tempEvt.dow = [];

                                        if (appointment.DaysOfWeek.includes("Monday"))
                                        {
                                            tempEvt.dow.push(1);
                                        }
                                        if (appointment.DaysOfWeek.includes("Tuesday"))
                                        {
                                            tempEvt.dow.push(2);
                                        }
                                        if (appointment.DaysOfWeek.includes("Wednesday"))
                                        {
                                            tempEvt.dow.push(3);
                                        }
                                        if (appointment.DaysOfWeek.includes("Thursday"))
                                        {
                                            tempEvt.dow.push(4);
                                        }
                                        if (appointment.DaysOfWeek.includes("Friday"))
                                        {
                                            tempEvt.dow.push(5);
                                        }
                                        if (appointment.DaysOfWeek.includes("Saturday"))
                                        {
                                            tempEvt.dow.push(6);
                                        }
                                        if (appointment.DaysOfWeek.includes("Sunday"))
                                        {
                                            tempEvt.dow.push(7);
                                        }

                                    }

                                    if (tempEvt.dow.length > 0)
                                    {
                                        var sDateStr = appointment.StartTime;
                                        var eDateStr = appointment.EndTime;

                                        tempEvt.start = sDateStr;
                                        tempEvt.end = eDateStr;

                                        if (appointment.StartDate && appointment.EndDate)
                                        {
                                            tempEvt.ranges = [{start: appointment.StartDate, end: appointment.EndDate}]
                                        }

                                        scope.events.push(tempEvt);
                                        //uiCalendarConfig.calendars['myCalendar1'].fullCalendar('renderEvent', tempEvt, true);
                                    }


                                }

                            });*/

                            //scope.eventsources[0] = events;
                        }


                    }
                });


                scope.changeView = function (view, calendar)
                {
                    uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
                };
                /* Change View */
                scope.renderCalendar = function (calendar)
                {
                    //console.log(JSON.stringify(scope.data));
                    if (uiCalendarConfig.calendars[calendar])
                    {
                        uiCalendarConfig.calendars[calendar].fullCalendar('rerenderEvents');
                    }
                };
            }
        }
    }


});
