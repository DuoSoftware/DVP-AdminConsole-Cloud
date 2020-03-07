/**
 * Created by Pawan on 7/26/2016.
 */

mainApp.factory('scheduleBackendService', function ($http, baseUrls) {
    return {

        getSchedules: function () {
            return $http({
                method: 'GET',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedules'
            }).then(function (response) {
                return response;
            });
        },

        getAppointments: function (scheduleId) {
            return $http({
                method: 'GET',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule/' + scheduleId + '/Appointments'
            }).then(function (response) {
                return response;
            });
        },

        saveNewSchedule: function (resource) {

            return $http({
                method: 'POST',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule',
                data: resource

            }).then(function (response) {
                return response;
            });
        },

        saveNewAppointment: function (resource) {

            return $http({
                method: 'POST',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule/Appointment',
                data: resource

            }).then(function (response) {
                return response;
            });
        },

        updateSchedule: function (resource) {

            return $http({
                method: 'POST',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule/' + resource.id,
                data: resource

            }).then(function (response) {
                return response;
            });
        },
        updateAppointment: function (resource) {

            return $http({
                method: 'POST',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule/Appointment/' + resource.id,
                data: resource

            }).then(function (response) {
                return response;
            });
        },
        removeSchedule: function (scheduleId) {

            return $http({
                method: 'DELETE',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule/' + scheduleId

            }).then(function (response) {
                return response;
            });
        },
        removeAppointment: function (appointmentId) {

            return $http({
                method: 'DELETE',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Appointment/' + appointmentId

            }).then(function (response) {
                return response;
            });
        },
        getAppointmentActions: function () {
            return $http({
                method: 'GET',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule/Appointment/Actions'

            }).then(function (response) {
                return response;
            });
        },
        getSchedule: function (scheduleId) {
            return $http({
                method: 'GET',
                url: baseUrls.limitHandlerUrl + 'LimitAPI/Schedule/'+scheduleId
            }).then(function (response) {
                return response.data;
            });
        }


    }
});