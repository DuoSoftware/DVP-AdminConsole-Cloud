/**
 * Created by Damith on 9/29/2016.
 */

mainApp.directive('createFilterForm', function (createFileServices) {
    return {
        restrict: "EA",
        scope: {
            filter: "="
        },
        templateUrl: 'controller/ticket-trigger/template/filter-filed.html',
        link: function (scope) {
            scope.filters = [];
            var obj = {
                id: '',
                name: '',
                selectedFiled: '',
                data: []
            };

            //create randome number
            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }

            var data = null;
            createFileServices.getMainFiledList().then(function (response) {
                if (response) {
                    data = response;
                    obj.id = guid();
                    obj.data = data;
                    scope.filters.push(obj);
                }
            }, function (error) {
                console.log(error);
            });

            //add new filed
            scope.addNewFilter = function () {
                obj.id = guid();
                obj.data = data;
                scope.filters.push(obj);
            };

            //remove filed
            var index = -1;
            scope.removeFilter = function (id) {
                for (var i = 0, len = scope.filters.length; i < len; i++) {
                    if (scope.filters[i].id === id) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0)
                    scope.filters.splice(index, 1);
            };
            //selectedFiled
            scope.allFromData = []

            scope.updateValue = function (filed) {
                console.log(filed);
            }
        }
    }
})