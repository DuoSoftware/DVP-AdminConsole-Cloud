/**
 * Created by Rajinda on 5/30/2016.
 */
mainApp.directive("filecountbycategory", function ($filter, fileService) {

    return {
        restrict: "EA",
        scope: {
            category: "=",
            'loadFiles': '&',
            'restToDefault': '&'
        },

        templateUrl: 'file_gallery/view/fileCount.html',

        link: function (scope, element, attributes) {

            scope.category.fileCount = {"Category": scope.category.Category, "Count": 0, "ID": scope.category.id};
            scope.category.selected = false;
            scope.GetFileCountCategoryID = function () {
                fileService.GetFileCountCategoryID(scope.category.id).then(function (count) {
                    if (count) {
                        scope.category.fileCount = count;
                    }
                    else {
                        //{"ID":"2","Category":"CONVERSATION","Count":2}
                        scope.category.fileCount = {
                            "Category": scope.category.Category,
                            "Count": 0,
                            "ID": scope.category.id
                        };
                    }
                }, function (error) {
                    scope.category.fileCount = {
                        "Category": scope.category.Category,
                        "Count": 0,
                        "ID": scope.category.id
                    };
                    console.error("GetFileCountCategoryID err" + error);
                });
            };
            scope.GetFileCountCategoryID();

            scope.loadFileByCategoryID = function () {
                scope.loadFiles(scope.category);
                scope.category.selected = true;
                scope.GetFileCountCategoryID();
            }
        }
    }
});