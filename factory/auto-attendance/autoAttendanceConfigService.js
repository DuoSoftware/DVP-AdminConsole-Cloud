
mainApp.factory('autottendanceconfigservice', function ($http, baseUrls) {

    return {

        getAutoAttendances: function () {
            return $http({
                method: 'GET',
                url: baseUrls.autoattendantUrl+ 'AutoAttendants'
            }).then(function (response) {
                return response;
            });
        },

        addNewAutoAttendance: function (newAAObj) {
            return $http({
                method: 'POST',
                url: baseUrls.autoattendantUrl+ 'AutoAttendant',
                data: newAAObj
            }).then(function (response) {
                return response;
            });
        },

        deleteAutoAttendance: function (name) {

            return $http({
                method: 'DELETE',
                url: baseUrls.autoattendantUrl+ "AutoAttendant/" + name
            }).then(function (response) {

                return response;
            });

        },

        getAutoAttendance: function (name) {

            return $http({
                method: 'GET',
                url: baseUrls.autoattendantUrl+ "AutoAttendant/" + name
            }).then(function (response) {
                return response;
            });


        },

        updateAutoAttendance: function (newAAObj) {

            return $http({
                method: 'PUT',
                url: baseUrls.autoattendantUrl+ 'AutoAttendant/' + newAAObj.Name,
                data: newAAObj
            }).then(function (response) {
                return response;
            });


        },

        setAction: function (name, on, action) {

            return $http({
                method: 'PUT',
                url: baseUrls.autoattendantUrl+ 'AutoAttendant/' + name + '/Action/' + on,
                data: action
            }).then(function (response) {
                return response;
            });


        },

        deleteAction: function (name, id) {

            return $http({
                method: 'DELETE',
                url: baseUrls.autoattendantUrl+ 'AutoAttendant/' + name + '/Action/' + id
            }).then(function (response) {
                return response;
            });


        }


    }
});




