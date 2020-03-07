/**
 * Created by Pawan on 6/18/2016.
 */

mainApp.directive("editardsconfig", function ($filter,$uibModal,ardsBackendService) {

    return {
        restrict: "EAA",
        scope: {
            ards: "=",
            ardslist: "=",
            groups: "=",
            tasks: "=",
            requestServers: "=",
            'updateApplication': '&',
            'reloadpage':'&'
        },

        templateUrl: 'views/ards-config/partials/editArdsConfig.html',

        link: function (scope) {

            scope.attributeGroups=[];
            scope.NewattributeGroups=[];
            scope.attributeGroup;

            Array.prototype.inArray = function(comparer) {
                for(var i=0; i < this.length; i++) {
                    if(comparer === (this[i].GroupId)) return this[i];
                }
                return null;
            };



            scope.LoadTasks = function () {
                ardsBackendService.getTasks().then(function (response) {
                    if(response.data.IsSuccess)
                    {
                        scope.tasks=response.data.Result;
                        console.log(scope.tasks);
                    }
                    else
                    {
                        console.log("Task loading failed");
                    }
                }, function (error) {
                    console.log("Task loading error",error);
                });
            };
            scope.LoadGroups = function () {

                scope.attributeGroups=[];
                scope.NewattributeGroups=[];

                ardsBackendService.getGroups().then(function (response) {
                    if(response.data.IsSuccess)
                    {
                        scope.groups=response.data.Result;

                        if(scope.ards.AttributeMeta)
                        {
                            for(var i=0;i<scope.ards.AttributeMeta.length;i++)
                            {
                                scope.groups.forEach(function (group) {
                                    if(group.GroupName==scope.ards.AttributeMeta[i].AttributeGroupName)
                                    {
                                        //scope.attributeGroups[]

                                        scope.attributeGroups.indexOf(group) === -1 ? scope.attributeGroups.push(group) : console.log("Duplicate");
                                        scope.NewattributeGroups.indexOf(group) === -1 ? scope.NewattributeGroups.push(group) : console.log("Duplicate");

                                        //scope.attributeGroups.push(group);
                                        //scope.NewattributeGroups.push(group);
                                    }
                                });

                            }
                        }
                        else
                        {
                            console.log("No Attribute meta data found");
                        }


                        /*if(scope.ards.AttributeGroups)
                         {
                         for(var i=0; i<scope.ards.AttributeGroups.length; i++){
                         var group = scope.groups.inArray(scope.ards.AttributeGroups[i]);
                         if(group != null) {
                         scope.attributeGroups.push(group);
                         scope.NewattributeGroups.push(group);
                         }
                         }
                         }
                         else
                         {
                         console.log("No groups found");
                         }*/

                    }
                    else
                    {
                        console.log("group loading failed");
                    }
                }, function (error) {
                    console.log("group loading error",error);
                });
            };

            scope.LoadServers = function () {
                ardsBackendService.getRequestServers().then(function (response) {
                    if(response.data.IsSuccess)
                    {
                        scope.requestServers=response.data.Result;
                        console.log("servers "+scope.requestServers);
                    }
                    else
                    {
                        console.log("server loading failed");
                    }
                }, function (error) {
                    console.log("server loading error",error);
                });
            };


            console.log(scope.ards);


            scope.onChipAdd = function (chip) {

                scope.NewattributeGroups.indexOf(chip) === -1 ? scope.NewattributeGroups.push(chip) : console.log("Duplicate");
                console.log("add attGroup "+scope.NewattributeGroups);

            };
            scope.onChipDelete = function (chip) {

                var index=scope.NewattributeGroups.indexOf(chip);
                console.log("index ",index);
                if(index>-1)
                {
                    scope.NewattributeGroups.splice(index,1);
                    console.log("rem attGroup "+scope.NewattributeGroups);
                }


            };


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

            scope.editArds = function () {
                scope.editMode = !scope.editMode;
                scope.LoadTasks();
                scope.LoadGroups();
                scope.LoadServers();

                console.log(scope.applist);
            };
            scope.closeEdit = function () {
                scope.editMode=false;
            };

            scope.removeArds= function (serverType,requestType) {

                ardsBackendService.deleteArds(serverType,requestType).then(function (response) {

                    if(response.data.IsSuccess)
                    {
                        scope.reloadpage();
                    }
                    else
                    {
                        console.log("Error in deleting");
                    }
                }, function (error) {
                    console.log("Exception in deleting "+error);
                });
            };

            scope.UpdateArds = function () {
                scope.ards.AttributeGroups = [];
                for(var i=0; i< scope.NewattributeGroups.length; i++){
                    scope.ards.AttributeGroups.push(scope.NewattributeGroups[i].GroupId);
                }
                ardsBackendService.updateArds(scope.ards).then(function (response) {

                    if(response.data.IsSuccess)
                    {
                        console.log("Updated");
                        scope.showAlert("Success", "Updation ARDS success ","success");
                        scope.editMode = !scope.editMode;
                    }
                    else
                    {
                        scope.showAlert("Error", "Updation ARDS error ","error");
                        console.log("Updation error "+response.data);
                    }
                }, function (error) {
                    scope.showAlert("Error", "Updation ARDS Exception ","error");
                    console.log("Updation Exception ",error);
                })

            };

            scope.changeApplicationType = function (appType) {
                if(appType=="SYSTEM")
                {
                    scope.IsDeveloper=false;
                    scope.application.AppDeveloperId=null;
                }
                else
                {
                    scope.IsDeveloper=true;
                }
            };


            scope.UpdateApplication = function () {

                if(scope.application.ObjClass=="SYSTEM")
                {
                    scope.application.AppDeveloperId=null;
                }
                appBackendService.updateApplication(scope.application).then(function (response) {
                    if(response.data.IsSuccess)
                    {
                        //scope.updateRecource(scope.application);
                        appBackendService.ApplicationAssignToDeveloper(scope.application.id,scope.application.AppDeveloperId).then(function (Assignresponse) {
                            if(Assignresponse.data.IsSuccess)
                            {
                                console.log("Application "+scope.application.id+" : "+scope.application.AppName+" Assigned to Developer "+scope.application.AppDeveloperId);
                                scope.reloadpage();
                            }
                            else
                            {
                                console.log("Error in assigning application "+scope.application.AppName+ " to Developer "+scope.application.AppDeveloperId);
                                scope.reloadpage();
                            }
                        }, function (Assignerror) {
                            console.log("Exception in assigning application "+scope.application.AppName+ " to Developer "+scope.application.AppDeveloperId,Assignerror);
                            scope.reloadpage();
                        });

                        //scope.editMode=false;



                    }
                    else
                    {
                        console.info("Error in updating app "+response.data.Exception);
                    }

                }, function (error) {
                    console.info("Error in updating application "+error);
                });
            };


            scope.removeApplication = function (item) {

                scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " + item.AppName, function (obj) {

                    appBackendService.deleteApplication(scope.application).then(function (response) {
                        if (response) {
                            scope.updateApplication(item);
                            scope.showAlert("Deleted", "File " + item.AppName + " Deleted successfully","success");
                        }
                        else
                            scope.showAlert("Error", "Error in deleting ","error");
                    }, function (error) {
                        scope.showAlert("Error", "Error in deleting ","error");
                    });

                }, function () {

                }, item);


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

            scope.selectionsChanged = function () {

                appBackendService.assignMasterApplication(scope.application.MasterApplicationId,scope.application.id).then(function (response) {


                    if(!response.data.IsSuccess)
                    {
                        console.info("Master app Assigning failed "+response.data.Exception);
                    }
                    else
                    {
                        console.info("Master app Assigning Success ");
                    }


                }, function (error) {

                    console.info("Master app Assigning error "+error);
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

            scope.showConig= function (appid) {
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

            scope.cancelUpdate=function()
            {
                scope.editMode=false;
            };
        }

    }
});