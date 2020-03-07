/**
 * Created by Pawan on 2/14/2018.
 */


mainApp.directive("editfilecategory", function ($filter,$uibModal,fileServiceApiAccess) {

    return {
        restrict: "EAA",
        scope: {
            category: "=",
            'updateApplication': '&',
            'reloadpage':'&'
        },

        templateUrl: 'views/file-category-config/partials/editFileCategory.html',

        link: function (scope) {










            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(group) {
                    return (group.GroupName.toLowerCase().indexOf(lowercaseQuery) != -1);;
                };
            }

            scope.querySearch = function (query) {
                if(query === "*" || query === "")
                {
                    if(scope.groups)
                    {
                        return scope.groups;
                    }
                    else
                    {
                        return [];
                    }

                }
                else
                {
                    var results = query ? scope.groups.filter(createFilterFor(query)) : [];
                    return results;
                }

            };




            scope.editMode = false;

            scope.editFileCat = function () {
                scope.editMode = !scope.editMode;

            };
            scope.closeEdit = function () {
                scope.editMode=false;
            };



            scope.UpdateFileCategory = function () {

                scope.showConfirm("Update File category","Update","ok","cancel","Do you want to update File Category : "+scope.category.Category,function (obj) {
                    fileServiceApiAccess.updateFileCategory(scope.category.id,scope.category).then(function (response) {

                        if(response.IsSuccess)
                        {
                            scope.showAlert("Updated", "File Category " + scope.category.Category + " Updated successfully","success");
                            scope.editMode = !scope.editMode;
                        }
                        else
                        {
                            scope.showAlert("Error", "File Category " + scope.category.Category + " Updating failed","error");
                        }
                    }, function (error) {

                        scope.showAlert("Error", "File Category " + scope.category.Category + " Updating failed","error");
                    })
                },function () {

                },scope.category);



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


            scope.cancelUpdate=function()
            {
                scope.editMode=false;
            };
        }

    }
});