/**
 * Created by Pawan on 8/11/2016.
 */
mainApp.directive("templatemakerdir", function ($filter,$uibModal,templateMakerBackendService) {

    return {
        restrict: "EAA",
        scope: {
            template: "=",
            'addNewStyle': '&',
            'removeAssignedStyle':'&',
            'reloadpage':'&'

        },

        templateUrl: 'views/template-generator/partials/editTemplates.html',

        link: function (scope) {

            scope.editMode=false;
            scope.renderMode=false;
            scope.showRendered=false;

            scope.paramList=[];
            scope.renderedTemplate="";



            scope.StyleList = [];

            scope.editTemplate = function () {
                scope.editMode=!scope.editMode;
            };


            scope.showAlert = function (title,content,msgtype) {

                new PNotify({
                    title: title,
                    text: content,
                    type: msgtype,
                    styling: 'bootstrap3'
                });
            };

            scope.isDeleted=true;
            scope.styleContent='';
            /*scope.IsDeveloper=false;
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
             };*/

            scope.addStyle= function () {
                scope.StyleList.push({
                    isFirst:true,
                    value:""
                });



            };


            scope.deleteStyle = function () {
                scope.isDeleted=false;
                scope.isAddstatus=false;
                scope.styleitem.itemContent=scope.styleContent;
                scope.removeAssignedStyle(scope.styleitem);
            };

            scope.checkParams = function () {

                var templateContent="";

                if(scope.template.content)
                {
                    templateContent=scope.template.content.content;
                }

                var splitList = templateContent.match(/({[a-zA-Z])\w+}/g);
                //console.log(splitList);
                //console.log(scope.template.name +" : "+splitList.length);

                if(splitList)
                {
                    for(var i=0;i<splitList.length;i++)
                    {
                       // console.log("name data "+splitList[i].match(/([a-zA-Z])\w+/g));

                        if(splitList.indexOf({name:splitList[i].match(/([a-zA-Z])\w+/g)})==-1)
                        {
                            var paramData =
                                {
                                    name:splitList[i].match(/([a-zA-Z])\w+/g)[0]
                                }
                        }

                        scope.paramList[i]=paramData;
                    }
                }





            };

            scope.renderTemplateModeChanger = function () {
                scope.renderMode=!scope.renderMode;
            };

            scope.renderTemplateData = function () {
                console.log(" Submitted "+scope.paramList);
                var paramDataList={};
                for(var i=0;i<scope.paramList.length;i++)
                {
                    var keyParam=scope.paramList[i].name;
                    paramDataList[keyParam]=scope.paramList[i].value;

                }

                var ParamBody =
                    {
                        Parameters: paramDataList
                    }

                console.log(typeof (ParamBody));
                templateMakerBackendService.renderTemplate(scope.template.name,ParamBody).then(function (response) {
                    if(response)
                    {
                        scope.showRendered=true;
                        scope.renderedTemplate=response.data;
                    }
                    else
                    {
                        console.log("Empty response");
                    }
                }), function (error) {
                    scope.showRendered=false;
                    console.log(error);
                };

                console.log("parameter list "+JSON.stringify(paramDataList));

            };

            scope.deleteTemplate = function (templateData) {

                if(templateData.name)
                {
                    templateMakerBackendService.deleteTemplates(templateData.name).then(function (response) {

                        if(response)
                        {
                            scope.showAlert("Success","Template : "+ templateData.name+" Deleted successfully","success");
                            scope.reloadpage();
                        }
                        else
                        {
                            scope.showAlert("Error","Template : "+ templateData.name+" Deleting failed","error");
                            console.log("Error in template : "+templateData.name+" Deletion",response);
                        }

                    }), function (error) {
                        scope.showAlert("Error","Template : "+ templateData.name+" Deleting failed","error");
                        console.log("Error in template : "+templateData.name+" Deletion",error);
                    }
                }

            };


            scope.removeAssignedStyleItem = function (styleItem) {

                console.log("Deleting assigned style "+JSON.stringify(styleItem));
                templateMakerBackendService.deleteStylesOfTemplate(scope.template._id,styleItem._id).then(function (response) {

                    if(response)
                    {
                        scope.showAlert("Success","Assigned style successfully removed","success") ;
                        console.log("Assigned style deletion succeeded");
                    }
                    else
                    {
                        scope.showAlert("Error","Assigned style deletion failed","error") ;
                        console.log("Assigned style deletion failed",response);
                    }

                }), function (error) {
                    scope.showAlert("Error","Assigned style deletion failed","error") ;
                    console.log("Assigned style deletion failed",error);
                }
            };

            scope.isUpdateChecked=false;
            scope.updateTemplate= function () {

                scope.isUpdateChecked=true;

                var currentStyles=scope.template.styles;
                var newStyles=[];

                for(var i=0;i<scope.StyleList.length;i++)
                {
                    if(scope.StyleList[i].value)
                    {
                        newStyles.push(scope.StyleList[i].value);
                    }


                }



                var templateData={
                    TemplateContent:scope.template.content.content,
                    TemplateSubject:scope.template.content.subject,
                    FileType:scope.template.filetype
                };

                var assignedStyles = {
                    Styles:scope.template.styles
                };

                var newStyles = {
                    StyleFiles:newStyles
                }

                console.log("Updated assigned styles ",assignedStyles);

                templateMakerBackendService.updateTemplateContentData(scope.template._id,templateData).then(function (response) {
                    console.log("Update template ",response);
                    //scope.showAlert("Success","Content updated succeeded","success");

                    if(scope.template.styles.length>0 && scope.StyleList.length>0 )
                    {
                        templateMakerBackendService.updateTemplateAssignedStyles(scope.template._id,assignedStyles).then(function (styleResponse) {
                            console.log("Update template styles",styleResponse);
                            //scope.showAlert("Success","Style Content updated succeeded","success");

                            templateMakerBackendService.addTemplateNewStyles(scope.template._id,newStyles).then(function (newStyleRes) {
                                console.log("Update template new styles",newStyleRes);
                                scope.showAlert("Success","Template updated succeeded","success");
                                //scope.reloadpage();
                                scope.isUpdateChecked=false;
                                scope.editTemplate();
                                scope.reloadpage();

                            }), function (errNewStyle) {
                                console.log("Update new style error",errNewStyle);
                                scope.showAlert("Error","Template updation failed","error");
                                scope.isUpdateChecked=false;
                                scope.editTemplate();
                                scope.reloadpage();
                            }
                        }), function (errStyle) {
                            scope.showAlert("Error","Template Content updation failed","error");
                            console.log("Update style error",errStyle);
                            scope.isUpdateChecked=false;
                            scope.editTemplate();
                            scope.reloadpage();
                        }
                    }
                    else if(scope.template.styles.length>0 && scope.StyleList.length==0)
                    {
                        templateMakerBackendService.updateTemplateAssignedStyles(scope.template._id,assignedStyles).then(function (styleResponse) {
                            console.log("Update template styles",styleResponse);
                            scope.showAlert("Success","Template Content updated succeeded","success");
                            //scope.reloadpage();
                            scope.isUpdateChecked=false;
                            scope.editTemplate();
                            scope.reloadpage();

                        }), function (errStyle) {
                            scope.showAlert("Error","Template Content updation failed","error");
                            console.log("Update style error",errStyle);
                            //scope.reloadpage();
                            scope.isUpdateChecked=false;
                            scope.editTemplate();
                            scope.reloadpage();
                        }
                    }
                    else if(scope.template.styles.length==0 && scope.StyleList.length>0)
                    {
                        templateMakerBackendService.addTemplateNewStyles(scope.template._id,newStyles).then(function (newStyleRes) {
                            console.log("Update template new styles",newStyleRes);
                            scope.showAlert("Success","Template updated succeeded","success");
                            //scope.reloadpage();
                            scope.isUpdateChecked=false;
                            scope.editTemplate();
                            scope.reloadpage();
                        }), function (errNewStyle) {
                            console.log("Update new style error",errNewStyle);
                            scope.showAlert("Error","Template updation failed","error");
                            //scope.reloadpage();
                            scope.isUpdateChecked=false;
                            scope.editTemplate();
                            scope.reloadpage();
                        }
                    }
                    else
                    {
                        //scope.reloadpage();
                        scope.isUpdateChecked=false;
                        scope.editTemplate();
                        scope.reloadpage();
                    }





                }),(function (error) {
                    scope.showAlert("Error","Content updation failed","error");
                    console.log("Update template error",error);
                    scope.isUpdateChecked=false;
                    scope.editTemplate();
                    scope.reloadpage();

                });

            };

            scope.removeNewStyleItem = function (styleContent) {

                for(var i=0;i<scope.StyleList.length;i++)
                {
                    if(scope.StyleList[i].value==styleContent.value && styleContent.$$hashKey==scope.StyleList[i].$$hashKey)
                    {
                        //scope.removeAssignedStyleItem(scope.StyleList[i]);
                        scope.StyleList.splice(i,1);


                    }

                }

                // scope.reloadpage()
            }

            scope.checkParams();
        }

    }
});

mainApp.directive("templatestyledir", function ($filter,$uibModal) {

    return {
        restrict: "EAA",
        scope: {
            styleitem: "=",
            newstyleitem:"=",
            'addNewStyle': '&',
            'removeAssignedStyle':'&'

        },

        templateUrl: 'views/template-generator/partials/currentStyleCollection.html',

        link: function (scope) {



            scope.paramList=[];
            scope.editMode=false;

            scope.editTemplate = function () {
                scope.editMode=!scope.editMode;
            };


            scope.showAlert = function (title,content,msgtype) {

                new PNotify({
                    title: title,
                    text: content,
                    type: msgtype,
                    styling: 'bootstrap3'
                });
            };

            scope.isDeleted=true;
            scope.styleContent='';



            scope.deleteStyle = function () {
                scope.isDeleted=false;
                scope.isAddstatus=false;
                scope.styleitem.itemContent=scope.styleContent;
                scope.removeAssignedStyle(scope.styleitem);
            };





        }

    }
});

mainApp.directive("newtemplatestyledir", function ($filter,$uibModal) {

    return {
        restrict: "EAA",
        scope: {
            newstyleitem: "=",
            'removeNewStyle':'&'

        },

        templateUrl: 'views/template-generator/partials/addNewStylesCollection.html',

        link: function (scope) {



            scope.paramList=[];
            scope.editMode=false;

            scope.editTemplate = function () {
                scope.editMode=!scope.editMode;
            };


            scope.showAlert = function (title,content,msgtype) {

                new PNotify({
                    title: title,
                    text: content,
                    type: msgtype,
                    styling: 'bootstrap3'
                });
            };

            scope.isDeleted=true;
            scope.styleContent='';



            scope.deleteNewStyle = function () {
                scope.removeNewStyle();
            };



        }

    }
});

mainApp.directive("chattemplatemakerdir", function ($filter,$uibModal,templateMakerBackendService,$ngConfirm) {

    return {
        restrict: "EAA",
        scope: {
            chattemplate: "=",
            chattemplateList:"=",
            'addNewStyle': '&',
            'removeAssignedStyle':'&',
            'reloadpage':'&'

        },

        templateUrl: 'views/template-generator/partials/editChatTemplates.html',

        link: function (scope) {

            scope.editMode=false;



            scope.showAlert = function (title,content,msgtype) {

                new PNotify({
                    title: title,
                    text: content,
                    type: msgtype,
                    styling: 'bootstrap3'
                });
            };
            scope.showConfirmation = function (title, contentData, okText, okFunc, closeFunc) {

                $ngConfirm({
                    title: title,
                    content: contentData, // if contentUrl is provided, 'content' is ignored.
                    scope: scope,
                    buttons: {
                        // long hand button definition
                        ok: {
                            text: okText,
                            btnClass: 'btn-primary',
                            keys: ['enter'], // will trigger when enter is pressed
                            action: function (scope) {
                                okFunc();
                            }
                        },
                        // short hand button definition
                        close: function (scope) {
                            closeFunc();
                        }
                    }
                });
            };



            scope.deleteChatTemplate = function (tempID) {

                scope.showConfirmation("Delete Chat Template","Do you want to delete chat template","OK",function () {
                    templateMakerBackendService.removeChatTemplate(tempID).then(function (response) {

                        var index = scope.chattemplateList.map(function(el) {
                            return el._id;
                        }).indexOf(tempID);
                        scope.chattemplateList.splice(index,1);
                        scope.showAlert("Success","Chat template removed successfully","success");


                    }), function (error) {
                        scope.showAlert("Error","Error in deleting chat template","error");
                        console.log("Error in deleting chat template",error);
                    }
                },function () {

                })




            };


        }

    }
});