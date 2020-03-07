/**
 * Created by Pawan on 6/17/2016.
 */
mainApp.directive("editextension", function ($filter,$uibModal,extensionBackendService) {

    return {
        restrict: "EAA",
        scope: {
            extension: "=",
            extensionlist: "=",
            applications: "=",
            'reloadpage':'&'
        },


        templateUrl: 'views/extension/partials/editExtension.html',

        link: function (scope) {


            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };


            //scope.setMasterAppList();


            scope.editMode = false;

            scope.editExtension = function () {
                scope.editMode = !scope.editMode;
                //console.log(scope.applist);
            };
            scope.removeExtension = function (item) {
                // scope.editMode = !scope.editMode;
                //console.log(scope.applist);
                extensionBackendService.removeExtension(item.Extension).then(function (response) {

                    if(response.data.IsSuccess)
                    {

                        var index = scope.extensionlist.indexOf(item);
                        if (index != -1) {
                            scope.extensionlist.splice(index, 1);
                        }

                        scope.showAlert("Deleted","Extension "+item.Extension+" is successfully removed","notice");
                        console.log("Del extension "+item);
                    }
                    else
                    {
                        scope.showAlert("Error","Extension "+item.Extension+" deletion error","error");
                        //scope.reloadpage();
                    }

                }, function (error) {
                    scope.showAlert("Error","Extension "+item.Extension+" deletion failed","error");
                    //scope.reloadpage();
                });

            };

            scope.updateExtension = function (item) {
                extensionBackendService.updateExtension(item).then(function (response) {
                    if(response.data.IsSuccess)
                    {


                        extensionBackendService.assignDodToExtension(item.id,item.DodNumber).then(function (dodResponse) {

                            if(dodResponse.data.IsSuccess)
                            {
                                scope.showAlert("Success","Extension "+item.Extension+" is updated","success");
                                scope.reloadpage();
                            }
                            else
                            {
                                scope.showAlert("Error","Extension "+item.Extension+" updation error (Assign DOD)","error");
                                scope.reloadpage();
                            }

                        }, function (error) {
                            scope.showAlert("Error","Extension "+item.Extension+" updation error (Assign DOD)","error");
                            scope.reloadpage();
                        });

                    }
                    else
                    {
                        scope.showAlert("Error","Extension "+item.Extension+" updation error","error");
                        scope.reloadpage();
                    }
                }, function (error) {
                    scope.showAlert("Error","Extension "+item.Extension+" updation failed","error");
                    scope.reloadpage();
                })
            };


        }

    }
});