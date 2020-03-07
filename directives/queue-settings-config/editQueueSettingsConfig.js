/**
 * Created by Pawan on 9/26/2017.
 */
mainApp.directive("editqsettings", function ($filter,$uibModal,queueSettingsBackendService) {

    return {
        restrict: "EAA",
        scope: {
            setting: "=",
            'reloadpage':'&',
            'reloadrecords':'&'
        },

        templateUrl: 'views/queue-settings-config/partials/editQueueSettings.html',

        link: function (scope) {


            scope.editMode=false;
            scope.assignedAttributes=[];


            scope.attributeGroup;
            scope.editQueueSetting = function () {
                scope.editMode = !scope.editMode;


            }
            scope.closeQueueSetting = function () {
                scope.editMode=false;
            }

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

            scope.removeSettingRecord= function (recordID) {


                scope.showConfirm("Delete Queue Setting", "Delete", "ok", "cancel", "Do you want to delete " + recordID, function (obj) {

                    queueSettingsBackendService.deleteSettingRecord(recordID).then(function (response) {

                        if(response.data.IsSuccess)
                        {
                            scope.showAlert("Success","Queue Setting record removed successfully",'success');
                            scope.reloadpage();
                        }
                        else
                        {
                            scope.showAlert("Error","Queue Setting record removing failed",'error');
                            console.log("Error in deleting Queue setting record");
                        }
                    }, function (error) {
                        scope.showAlert("Error","Queue Setting record removing failed",'error');
                        console.log("Exception in deleting ueue setting record"+error);
                    });

                }, function () {

                }, recordID)





            };
            
            scope.UpdateQueueSettings = function () {

                queueSettingsBackendService.UpdateQueueSettings(scope.setting.RecordID,scope.setting).then(function (response) {
                    if(!response.data.IsSuccess)
                    {
                        scope.showAlert("Error","Error in updating Queue Setting : "+scope.setting.QueueName,"error");
                    }
                    else {
                        scope.showAlert("Success","Successfully updated Queue Setting : "+scope.setting.QueueName,"success");
                        scope.reloadrecords();
                        scope.editQueueSetting();
                    }
                },function (error) {
                    scope.showAlert("Error","Error in updating Queue Setting : "+scope.setting.QueueName,"error");
                })
                
            };

            scope.loadAttributeDetails = function () {
                queueSettingsBackendService.getQueueAttributeDetails(scope.setting.RecordID).then(function (resAttribs) {
                    if(!resAttribs.data.IsSuccess)
                    {
                        console.log("Error in loading assigned attributes to Queue");
                    }
                    else
                    {
                        scope.assignedAttributes=resAttribs.data.Result;
                    }
                },function (errAttribs) {
                    console.log("Error in loading assigned attributes to Queue",errAttribs);
                });
            }

            scope.loadAttributeDetails();






        }

    }
});