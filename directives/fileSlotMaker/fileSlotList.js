/**
 * Created by Pawan on 11/17/2016.
 */

mainApp.directive("filearraylist", function ($filter,$uibModal,fileSlotService) {

    return {
        restrict: "EAA",
        scope: {
            slotarray: "=",
            reloadArrayList:"&"


        },

        templateUrl: 'views/fileSlotMaker/partials/fileSlotArrayList.html',

        link: function (scope) {

            scope.editMode=false;
            scope.slotList=[];

            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.conigSlotArray= function () {
                scope.editMode=! scope.editMode;
            }


            scope.LoadFileSlotArray = function () {
                fileSlotService.getFileSlotArray(scope.slotarray.name).then(function (resLoad) {
                    if(resLoad.data.IsSuccess)
                    {
                        scope.slotList=resLoad.data.Result.slots;
                    }
                }, function (errLoad) {
                    scope.showAlert("Slot Array","Error in loading SlotArrays","error");
                })
            };

            scope.LoadFileSlotArray();

            scope.AddNewSlot = function (arrayData) {


                fileSlotService.addSlotToArray(arrayData).then(function (resAdd) {

                    if(resAdd.data.IsSuccess)
                    {
                        var newSlotData =
                        {
                            name:arrayData.newSlot.name
                        }
                        scope.slotList.push(newSlotData);
                        scope.showAlert("Add Slots","New Slot added to Slot Array","success");
                    }
                    else
                    {
                        scope.showAlert("Add Slots","Error in adding New Slot Slot Array","error");
                    }
                }, function (errAdd) {
                    scope.showAlert("Add Slots","Error in adding New Slot Slot Array","error");
                })


            };

            scope.removeSlotArray= function () {

                fileSlotService.removeSlotArray(scope.slotarray.name).then(function (resRemove) {

                    if(resRemove.data.IsSuccess)
                    {
                        scope.reloadArrayList();
                        scope.showAlert("Remove Slots","Slot removed from Slot Array","success");
                    }
                    else
                    {
                        scope.showAlert("Remove Slots","Error in Slot removing from Slot Array","error");
                    }

                }, function (errRemove) {
                    scope.showAlert("Remove Slots","Error in Slot removing from Slot Array","error");
                })
            }

            /* scope.IsDeveloper=false;
             scope.Developers=[];

             scope.MasterApps=[];
             scope.MasterAppName;

             scope.application.id=scope.application.id.toString();


             scope.pickMasterAppName = function (masterId) {
             for(var i=0;i<scope.applist.length;i++)
             {
             if(scope.applist[i].id==masterId)
             {
             scope.application.MasterAppName=scope.applist[i].AppName;
             }
             }
             };


             if(scope.application.MasterApplicationId)
             {
             scope.application.MasterApplicationId=(scope.application.MasterApplicationId).toString();
             }

             if(scope.application.ObjClass=="SYSTEM" )
             {
             scope.IsDeveloper=false;
             }
             else if(scope.application.ObjClass=="DEVELOPER" )
             {
             scope.IsDeveloper=true;
             scope.pickMasterAppName(scope.application.MasterApplicationId);
             if(scope.application.AppDeveloperId)
             {
             scope.application.AppDeveloperId=(scope.application.AppDeveloperId).toString();

             }

             }


             scope.setMasterAppList = function () {

             for(var i=0;i<scope.applist.length;i++)
             {
             if(scope.applist[i].ObjClass=="SYSTEM")
             {
             if(scope.applist[i].MasterApplicationId)
             {
             scope.applist[i].MasterApplicationId=scope.applist[i].MasterApplicationId.toString();
             if(scope.applist[i].MasterApplicationId==scope.application.MasterApplicationId)
             {
             scope.MasterAppName=scope.applist[i].AppName;
             console.log(scope.MasterAppName);
             }

             }

             scope.MasterApps.push(scope.applist[i]);


             }
             }

             };

             scope.setMasterAppList();

             scope.getAllDevelopers = function () {
             appBackendService.getDevelopers().then(function (response) {

             if(response.data.IsSuccess)
             {
             scope.Developers=response.data.Result;
             }
             else
             {
             console.log("Error in loading all developers ",response.data.Exception);
             }
             }, function (error) {
             console.log("Exception in loading all developers ",error);
             })
             };

             scope.getAllDevelopers();

             scope.editMode = false;

             scope.editApplication = function () {
             scope.editMode = !scope.editMode;
             console.log(scope.applist);
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


             scope.modifyApplication = function () {

             if(scope.application.ObjClass=="SYSTEM")
             {
             scope.application.AppDeveloperId=null;

             }

             appBackendService.updateApplication(scope.application).then(function (response) {
             if(response.data.IsSuccess)
             {

             if(scope.application.AppDeveloperId==null)
             {
             scope.showAlert("Updated","File " + scope.application.AppName + " updated successfully","success");
             scope.reloadpage();
             }
             else
             {
             appBackendService.ApplicationAssignToDeveloper(scope.application.id,scope.application.AppDeveloperId).then(function (Assignresponse) {
             if(Assignresponse.data.IsSuccess)
             {
             scope.showAlert("Updated","File " + scope.application.AppName + " updated successfully","success");
             console.log("Application "+scope.application.id+" : "+scope.application.AppName+" Assigned to Developer "+scope.application.AppDeveloperId);
             scope.reloadpage();
             }
             else
             {
             scope.showAlert("Error","File " + scope.application.AppName + " updating failed","error");
             console.log("Error in assigning application "+scope.application.AppName+ " to Developer "+scope.application.AppDeveloperId);
             scope.reloadpage();
             }
             }, function (Assignerror) {
             scope.showAlert("Error","File " + item.AppName + " updating failed","error");
             console.log("Exception in assigning application "+scope.application.AppName+ " to Developer "+scope.application.AppDeveloperId,Assignerror);
             scope.reloadpage();
             });
             }

             //scope.updateRecource(scope.application);


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
             scope.showAlert("Deleted","File " + item.AppName + " Deleted successfully","success");
             }
             else
             scope.showAlert("Error", "Error in file removing", "error");
             }, function (error) {
             scope.showAlert("Error", "Error in file removing", "error");
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

             */
        }

    }
});
mainApp.directive("fileslotlist", function ($filter,$uibModal,fileSlotService) {

    return {
        restrict: "EAA",
        scope: {
            slot: "=",
            arrayname:"=",
            reloadslots:"&"


        },

        templateUrl: 'views/fileSlotMaker/partials/fileSlotList.html',

        link: function (scope) {
            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.RemoveSlotFromArray = function () {
                fileSlotService.removeSlotFromArray(scope.arrayname,scope.slot.name).then(function (resRemove) {
                    if(resRemove.data.IsSuccess)
                    {
                        scope.showAlert("Removing Slots", "Slot removed from Array successfully","success");
                        scope.reloadslots();
                    }
                    else
                    {
                        scope.showAlert("Removing Slots", "Failed to remove Slot from Array successfully","error");
                    }
                }, function (errRemove) {
                    scope.showAlert("Removing Slots", "Failed to remove Slot from Array successfully","error");
                });
            }


            /*scope.editMode=false;
             scope.slotList=[];

             scope.LoadFileSlotArray = function () {
             fileSlotService.getFileSlotArray(scope.slotarray.name).then(function (resLoad) {
             if(resLoad.data.IsSuccess)
             {
             scope.slotList=resLoad.data.Result;
             }
             }, function (errLoad) {
             alert("Error");
             console.log("Error ",errLoad);
             })
             };

             scope.LoadFileSlotArray();

             scope.AddNewSlot = function (arrayData) {


             fileSlotService.addSlotToArray(arrayData).then(function (resAdd) {

             }, function (errAdd) {

             })


             };


             /!* scope.IsDeveloper=false;
             scope.Developers=[];

             scope.MasterApps=[];
             scope.MasterAppName;

             scope.application.id=scope.application.id.toString();


             scope.pickMasterAppName = function (masterId) {
             for(var i=0;i<scope.applist.length;i++)
             {
             if(scope.applist[i].id==masterId)
             {
             scope.application.MasterAppName=scope.applist[i].AppName;
             }
             }
             };


             if(scope.application.MasterApplicationId)
             {
             scope.application.MasterApplicationId=(scope.application.MasterApplicationId).toString();
             }

             if(scope.application.ObjClass=="SYSTEM" )
             {
             scope.IsDeveloper=false;
             }
             else if(scope.application.ObjClass=="DEVELOPER" )
             {
             scope.IsDeveloper=true;
             scope.pickMasterAppName(scope.application.MasterApplicationId);
             if(scope.application.AppDeveloperId)
             {
             scope.application.AppDeveloperId=(scope.application.AppDeveloperId).toString();

             }

             }


             scope.setMasterAppList = function () {

             for(var i=0;i<scope.applist.length;i++)
             {
             if(scope.applist[i].ObjClass=="SYSTEM")
             {
             if(scope.applist[i].MasterApplicationId)
             {
             scope.applist[i].MasterApplicationId=scope.applist[i].MasterApplicationId.toString();
             if(scope.applist[i].MasterApplicationId==scope.application.MasterApplicationId)
             {
             scope.MasterAppName=scope.applist[i].AppName;
             console.log(scope.MasterAppName);
             }

             }

             scope.MasterApps.push(scope.applist[i]);


             }
             }

             };

             scope.setMasterAppList();

             scope.getAllDevelopers = function () {
             appBackendService.getDevelopers().then(function (response) {

             if(response.data.IsSuccess)
             {
             scope.Developers=response.data.Result;
             }
             else
             {
             console.log("Error in loading all developers ",response.data.Exception);
             }
             }, function (error) {
             console.log("Exception in loading all developers ",error);
             })
             };

             scope.getAllDevelopers();

             scope.editMode = false;

             scope.editApplication = function () {
             scope.editMode = !scope.editMode;
             console.log(scope.applist);
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


             scope.modifyApplication = function () {

             if(scope.application.ObjClass=="SYSTEM")
             {
             scope.application.AppDeveloperId=null;

             }

             appBackendService.updateApplication(scope.application).then(function (response) {
             if(response.data.IsSuccess)
             {

             if(scope.application.AppDeveloperId==null)
             {
             scope.showAlert("Updated","File " + scope.application.AppName + " updated successfully","success");
             scope.reloadpage();
             }
             else
             {
             appBackendService.ApplicationAssignToDeveloper(scope.application.id,scope.application.AppDeveloperId).then(function (Assignresponse) {
             if(Assignresponse.data.IsSuccess)
             {
             scope.showAlert("Updated","File " + scope.application.AppName + " updated successfully","success");
             console.log("Application "+scope.application.id+" : "+scope.application.AppName+" Assigned to Developer "+scope.application.AppDeveloperId);
             scope.reloadpage();
             }
             else
             {
             scope.showAlert("Error","File " + scope.application.AppName + " updating failed","error");
             console.log("Error in assigning application "+scope.application.AppName+ " to Developer "+scope.application.AppDeveloperId);
             scope.reloadpage();
             }
             }, function (Assignerror) {
             scope.showAlert("Error","File " + item.AppName + " updating failed","error");
             console.log("Exception in assigning application "+scope.application.AppName+ " to Developer "+scope.application.AppDeveloperId,Assignerror);
             scope.reloadpage();
             });
             }

             //scope.updateRecource(scope.application);


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
             scope.showAlert("Deleted","File " + item.AppName + " Deleted successfully","success");
             }
             else
             scope.showAlert("Error", "Error in file removing", "error");
             }, function (error) {
             scope.showAlert("Error", "Error in file removing", "error");
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

             *!/*/
        }

    }
});