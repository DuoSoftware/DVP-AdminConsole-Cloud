/**
 * Created by Pawan on 5/29/2017.
 */
mainApp.directive("editfcatrestrict", function ($filter,$uibModal,userProfileApiAccess) {

    return {
        restrict: "EAA",
        scope: {
            adminuser: "=",
            catlist: "=",
            'reloadpage':'&'
        },

        templateUrl: 'views/file-category-restriction/partials/editFileCatRestrictions.html',

        link: function (scope) {

            scope.isProcessing=false;

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

            scope.allocatedCategories=[];

            if(scope.adminuser.allowed_file_categories)
            {
                scope.allocatedCategories =scope.adminuser.allowed_file_categories
            }



            scope.onChipAdd = function (chip) {
                scope.isProcessing =true;
                userProfileApiAccess.allowFileCategoryToUser(scope.adminuser.username,chip.text).then(function (response) {

                    if(response.IsSuccess)
                    {

                        scope.showAlert("Allow File Categories","File Category "+chip.text+" successfully assigned to user "+scope.adminuser.username,"success");
                        scope.isProcessing =false;

                    }
                    else
                    {

                        var index=scope.allocatedCategories.indexOf(chip);
                        if(index>-1)
                        {
                            scope.allocatedCategories.splice(index,1);
                        }
                        scope.showAlert("Allow File Categories","Write permission has not been granted for the user "+scope.adminuser.username,"error");
                        scope.isProcessing =false;


                    }
                },function (error) {
                    var index=scope.allocatedCategories.indexOf(chip);
                    if(index>-1)
                    {
                        scope.allocatedCategories.splice(index,1);
                    }
                    scope.showAlert("Allow File Categories","Write permission has not been granted for the user "+scope.adminuser.username,"error");
                    scope.isProcessing =false;
                });



            };
            scope.onChipDelete = function (chip) {
                scope.isProcessing =true;


                    userProfileApiAccess.restrictFileCategoryToUser(scope.adminuser.username,chip.text).then(function (response) {
                        scope.showAlert("Allow File Categories","File Category "+chip.text+" successfully restricted to user "+scope.adminuser.username,"success");
                        scope.isProcessing =false;
                    },function (error) {
                        scope.allocatedCategories.push(chip);
                        scope.showAlert("Allow File Categories","Delete permission has not been granted for the user "+scope.adminuser.username,"error");
                        scope.isProcessing =false;
                    });





            };


            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(category) {
                    return (category.toLowerCase().indexOf(lowercaseQuery) != -1);
                };
            }

            scope.querySearch = function (query) {
                if(query === "*" || query === "")
                {
                    if(scope.catlist)
                    {
                        return scope.catlist;
                    }
                    else
                    {
                        return [];
                    }

                }
                else
                {
                    var results = query ? scope.catlist.filter(createFilterFor(query)) : [];
                    return results;
                }

            };




            scope.editMode = false;

            scope.editArds = function () {
                scope.editMode = !scope.editMode;
                /* scope.LoadTasks();
                 scope.LoadGroups();
                 scope.LoadServers();*/


            };
            scope.closeEdit = function () {
                scope.editMode=false;
            };
            scope.editUserFileCategories = function () {
                scope.editMode=true;
            };

        }

    }
});