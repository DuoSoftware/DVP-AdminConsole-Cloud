/**
 * Created by lakmini on 26/01/2018.
 */
mainApp.directive("editachatbot", function ($filter, $uibModal, chatbotService, integrationsService, botappconfigService, chatbotEntitesService, whitelistconfigService, $auth, baseUrls, $timeout) {

    return {
        restrict: "EAA",
        scope: {
            bot: "=",
            allbots: "=",
            'updatebot': '&',
            'getall': '&'
        },

        templateUrl: 'chatbot/views/partials/editbotdetails.html',
        link: function (scope) {
            //debugger;
            scope.editMode = false;
            scope.botappedit = false;
            // scope.botappeditApiai =false;
            // scope.botappeditSmooth = false;

            scope.copytoClipboard = function (cardID, type, message) {
                var id = cardID;

                var copyText = document.getElementById(id);
                copyText.select();
                document.execCommand("Copy");

                // window.getSelection().empty();
                // var copyField = document.getElementById(id);
                // var range = document.createRange();
                // range.selectNode(copyField);
                // window.getSelection().addRange(range);
                // document.execCommand('copy');
                scope.showAlert(type, message, "success");
            }

            scope.generateCallBackURL = function (botid) {
                //debugger
                var companyDetails = $auth.getPayload();
                var URL = baseUrls.botFrameworkFacebookConnector + "/DBF/API/1.0.0.0/tenant/" + companyDetails.tenant + "/company/" + companyDetails.company + "/bot/" + botid;
                scope.generatedCallbackURL = URL;
            }

            $(".sortable").sortable({
                update: function (event, ui) {
                    console.log(event);
                    console.log(ui);
                }
            });

            scope.editbotdetails = function () {
                //debugger;
                scope.editMode = !scope.editMode;
                if (scope.editMode) {
                    $(".sortable").sortable({

                        stop: function (event, ui) {
                            scope.order = [];
                            $(".sortable li").each(function (i, el) {
                                var OrderedBots = JSON.parse(el.id);
                                OrderedBots.order = i;
                                OrderedBots.aid = OrderedBots._id;
                                delete OrderedBots._id;
                                scope.order.push(OrderedBots);
                            })
                            scope.updatebotappsOrder(scope.order);
                        }

                    });
                    //debugger;
                    $(".sortable").disableSelection();
                    scope.generateCallBackURL(scope.bot._id);
                    scope.getallBotApps(scope.bot._id);
                    scope.getallDefaultAi(scope.bot._id);
                    scope.getallselectedEntity(scope.bot._id);
                    scope.getwhitelisturl(scope.bot._id);
                    scope.getPersistantMenu(scope.bot._id);
                }
            };

            scope.editbotappdetails = function (botapp) {
                debugger
                console.log(botapp);

                scope.selectedBot = botapp;
            };
            // bot details update method
            scope.modifyBotDetails = function (bot) {
                //delete bot._id;
                debugger;
                chatbotService.UpdateChatbot(bot).then(function (response) {
                    if (response) {
                        scope.showAlert("ChatBot", 'Bot Update Successfully.', "success");

                    } else {
                        scope.showAlert("ChatBot", 'Fail To Update Bot.', "error");
                    }

                }, function (error) {
                    scope.showAlert("ChatBot", 'Fail To Update Bot.', "error");

                });
            }
            //Selected bot delete method
            scope.deleteBot = function (bot) {
                console.log("deleteBot");
                scope.showConfirm("Delete Bot", "Delete", "ok", "cancel", "Do you want to delete " + bot.screen_name, function (obj) {
                    chatbotService.DeleteChatbot(bot).then(function (response) {
                        if (response.data.IsSuccess) {
                            scope.showAlert("ChatBot", 'Bot Delete Successfully.', "success");
                            scope.getall();
                        } else {
                            scope.showAlert("ChatBot", 'Fail To Delete Bot.', "error");
                        }

                    }, function (error) {
                        scope.showAlert("ChatBot", '"Fail To Delete Bot.', "error");

                    });
                }, function () {

                }, bot);

            };


            scope.BotIntegrations = function (configDetails, appmodule) {
                integrationsService.ConfigApp(configDetails, appmodule).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.showAlert("ChatBot Integrations", 'Bot Integrations Created Successfully.', "success");
                    } else {
                        scope.showAlert("ChatBot Integrations", 'Fail Integrations To Created Bot.', "error");
                    }

                }, function (error) {
                    scope.showAlert("ChatBot Integrations", 'Fail Integrations To Created Bot.', "error");
                });
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
            scope.showAlert = function (title, content, type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };


            //get all bots apps for mathch with current bot
            scope.getallBotApps = function (id) {
                scope.slectedConfig = [];
                botappconfigService.GetAllBotApps().then(function (response) {
                    if (response.data.IsSuccess) {
                        for (var index = 0; index < response.data.Result.length; index++) {
                            if (id == response.data.Result[index].bot_id) {
                                scope.slectedConfig.push(response.data.Result[index]);
                            }
                        }
                        console.log(scope.slectedConfig);
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To load Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To load Bot Apps.', "error");
                });
            }
            //add new bot app
            scope.addnewBotApp = function (botapp) {

                var newbotapp = {
                    "company": -1,
                    "tenant": -1,
                    "bot_id": scope.bot._id,
                    "app": botapp.app,
                    "order": 0,
                    "config": {
                        "Securitykey": "<key>"
                    }
                }
                botappconfigService.SavenewBotApp(newbotapp).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.getallBotApps(scope.bot._id);
                        // scope.botappedit = false;
                        scope.botappeditApiai = false;
                        scope.botappeditSmooth = false;


                        scope.showAlert("Bot Apps", 'Added new Bot app.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Save Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Save Bot Apps.', "error");
                });
            }

            //update bot app
            scope.updatebotapp = function (botapp) {
                console.log(botapp);
                //debugger
                var id = botapp._id;
                // delete botapp._id;
                botappconfigService.UpdateBotApp(botapp, id).then(function (response) {
                    if (response.data.IsSuccess) {
                        // scope.botappedit = false;
                        scope.botappeditApiai = false;
                        scope.botappeditSmooth = false;
                        scope.showAlert("Bot Apps", 'Bot App Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                });
            };

            //update bot apps 
            scope.updatebotapps = function (botapps) {
                debugger
                botappconfigService.UpdateBotApps(botapps).then(function (response) {
                    if (response.data.IsSuccess) {

                        scope.getallBotApps(scope.bot._id);
                        scope.showAlert("Bot Apps", 'Bot App Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                });
            };

            //update bot apps order
            scope.updatebotappsOrder = function (botapps) {
                debugger
                botappconfigService.UpdateBotApps(botapps).then(function (response) {
                    if (response.data.IsSuccess) {

                        // scope.getallBotApps(scope.bot._id);
                        //scope.showAlert("Bot Apps", 'Bot App Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                });
            };
            //Delete bot app 
            scope.deletebotapp = function (bot) {
                debugger
                botappconfigService.DeleteBotApp(bot._id).then(function (response) {
                    if (response.data.IsSuccess) {

                        scope.getallBotApps(scope.bot._id);
                        scope.showAlert("Bot Apps", 'Bot App Deleted Successfully.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Deleted Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Deleted Bot Apps.', "error");
                });
            }
            //Delete bot app 
            scope.deletebotEntity = function (entity) {
                console.log(entity);
                var id = scope.bot._id;
                var update = {
                    "entityName": entity.entityName,
                    "id": entity.id,
                }
                chatbotService.DeleteChatbotEntity(id, update).then(function (response) {
                    if (response.data.IsSuccess) {
                        
                        scope.showAlert("Entity", 'Entity Deleted Successfully.', "success");
                        scope.getallselectedEntity(scope.bot._id);
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Deleted entity.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Deleted entity.', "error");
                });
            }
            //get facebook whitelist
            scope.getwhitelisturl = function (botid) {
                if (scope.bot.channel_facebook.page_token != "") {
                    whitelistconfigService.GetAllWhitelist(scope.bot._id).then(function (response) {
                        //debugger
                        if (response.data.IsSuccess) {
                            scope.urllist = response.data.Result;
                        }
                        else {
                            scope.showAlert("White List", response.data.Exception.Message, 'error');
                            scope.urllist = [];
                        }

                    }, function (error) {
                        scope.showAlert("White list", 'error', "Fail To Load Url.");
                    });
                }
            }
            //add facebook whitelist
            scope.addnewurl = function (url) {
                var isvalid = scope.urllist.findIndex(x => x == url);
                if (isvalid == -1) {
                    scope.urllist.push(url);
                    var jsonurl = { "urls": scope.urllist };
                    whitelistconfigService.AddWhitelist(jsonurl, scope.bot._id).then(function (response) {
                        if (response.data.IsSuccess) {
                            scope.url = "";
                            //scope.urllist.push(url);
                            scope.getwhitelisturl(scope.bot._id);
                        } else {
                            scope.showAlert("White list", 'Fail To Added Url.', "error");
                        }

                    }, function (error) {
                        scope.showAlert("White list", 'Fail To Added Url.', "error");
                    });
                } else { scope.showAlert("White list", 'Already added to list', "error"); }

            }
            //Delete facebook whitelist
            scope.deleteurl = function (url) {

                scope.showConfirm("Delete URL", "Delete", "ok", "cancel", "Do you want to delete " + url, function (obj) {
                    var urlindex = scope.urllist.findIndex(x => x == url);
                    scope.urllist.splice(urlindex, 1);

                    var jsonurl = { "urls": scope.urllist };
                    whitelistconfigService.AddWhitelist(jsonurl, scope.bot._id).then(function (response) {
                        if (response.data.IsSuccess) {

                            scope.getwhitelisturl(scope.bot._id);
                        } else {
                            scope.showAlert("White list", 'Fail To Delete Url.', "error");
                        }

                    }, function (error) {
                        scope.showAlert("White list", 'Fail To Delete Url.', "error");
                    });

                }, function () {

                }, url);
            }

            //Defult AI
            scope.disabledField = false;
            scope.getallDefaultAi = function (id) {
                // var id = scope.bot._id;
                // console.log(scope.bot._id);
                scope.slectedDefaultAi = {};
                chatbotService.GetBotById(id).then(function (response) {
                    console.log(response);
                    if (response.data.IsSuccess) {
                        scope.slectedDefaultAi = response.data.Result;

                        if (scope.slectedDefaultAi.ai.name == 'default') {
                            scope.displayNameAi = "Smoothflow AI (Default)";
                            scope.disabledField = true;
                        }
                        else if (scope.slectedDefaultAi.ai.name == 'gnlp') {
                            scope.displayNameAi = "Googlenlp";
                            scope.disabledField = false;
                        }
                        else {

                        }



                    } else {
                        scope.showAlert("Load AI", 'Fail To load ai.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Load AI", 'Fail To load ai.', "error");
                });

            }

            scope.getallselectedEntity = function(id){
                
                chatbotService.GetBotById(id).then(function (response) {
                    console.log(response);
                    if (response.data.IsSuccess) {
                        scope.selectEntities = response.data.Result.entities;

                    } else {
                        scope.showAlert("Load AI", 'Fail To load.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Load AI", 'Fail To load.', "error");
                });
            }
          
            
            scope.getallentity = function(){
               
                chatbotEntitesService.GetAllEntity().then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.allEntities = response.data.Result;
                        console.log(scope.allEntities);
                    } else {
                        scope.showAlert("ChatBot", 'error', "Fail To load entities.");
                    }
        
                }, function (error) {
                    scope.showAlert("ChatBot", 'error', "Fail To load entities.");
                });
            }
            scope.getallentity();

            scope.addnewEntity = function (entity) {
                console.log(entity.app);
                var id = scope.bot._id
                var update = {
                    "entityName": entity.app.entityName,
                    "id": entity.app._id,
                }
                console.log(update);
                
                chatbotService.UpdateChatbotEntity(id,update).then(function (response) {
                    console.log(response);
                    scope.slectedentity = {};
                    
                    if (response.data.IsSuccess) {
                        scope.slectedentity = response.data.Result;
                        // scope.botappedit = false;
                        scope.selectEntities= response.data.Result.entities;
                        console.log(scope.selectEntities);
                        scope.showAlert("Update Entity", 'Entity Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Update Entity", 'Fail To add entity.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Add Entity", 'Fail To add entity.', "error");
                });

            }

            scope.addnewDefaultAi = function (newai) {

                var id = scope.bot._id;
                var update = {
                    "ai": {
                        "name": newai.app,
                        "key": "",
                        "description": ""
                    }
                }
                chatbotService.UpdateChatbotAi(id, update).then(function (response) {
                    console.log(response);
                    scope.slectedDefaultAi = {};

                    if (response.data.IsSuccess) {
                        scope.getallDefaultAi(id);
                        scope.slectedDefaultAi = response.data.Result;
                        // scope.botappedit = false;
                        scope.showAlert("Update Default AI", 'Default AI Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Add Default AI", 'Fail To add default ai.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Add Default AI", 'Fail To add default ai.', "error");
                });

            }

            scope.updateDeafultAi = function (defaultAi) {
                console.log(defaultAi);
                var id = scope.bot._id;
                var update = {
                    "ai": {
                        "name": defaultAi.name,
                        "key": defaultAi.key,
                        "description": defaultAi.key
                    }
                }
                chatbotService.UpdateChatbotAi(id, update).then(function (response) {
                    console.log(response);
                    scope.slectedDefaultAi = {};

                    if (response.data.IsSuccess) {
                        scope.getallDefaultAi(id);
                        scope.slectedDefaultAi = response.data.Result;
                        // scope.botappedit = false;
                        scope.showAlert("Update Default AI", 'Default AI Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Add Default AI", 'Fail To add default ai.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Add Default AI", 'Fail To add default ai.', "error");
                });
            }

            // persist menu items
            // persis button types: nested,postback,web_url
            // https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
            scope.persisMenu = {
                "persistent_menu": [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": []
                    }
                ]
            };
            scope.getnewPersistPlainButton = function () {
                var obj = {
                    "title": "New Button",
                    "payload": "",
                    "type": "postback"
                };
                return obj;
            };
            scope.getnewPersistNestedButton = function () {
                var obj = {
                    "title": "New Nested Button",
                    "call_to_actions": [],
                    "type": "nested",
                };
                return obj;
            };
            scope.getnewPersistWeburlButton = function () {
                var obj = {
                    "title": "New Web URL",
                    "url": "",
                    "webview_height_ratio": "full",
                    "type": "web_url"
                }
                return obj;
            };
            scope.enablepersistmenu = "disabled";
            scope.addnewButtons = function (type) {
                if (type == "postback") {
                    scope.persisMenu.persistent_menu[0].call_to_actions.push(scope.getnewPersistPlainButton());
                } else if (type == "nested") {
                    scope.persisMenu.persistent_menu[0].call_to_actions.push(scope.getnewPersistNestedButton());
                } else if (type == "web_url") {
                    scope.persisMenu.persistent_menu[0].call_to_actions.push(scope.getnewPersistWeburlButton());
                }
            }

            scope.removepersistButton = function (index) {
                var item = scope.persisMenu.persistent_menu[0].call_to_actions[index];
                scope.showConfirm("Delete Button", "Delete", "ok", "cancel", "Are you sure you want to delete \"" + item.title + "\" Button", function (obj) {
                    scope.$apply(function () {
                        scope.persisMenu.persistent_menu[0].call_to_actions.splice(index, 1);
                    });

                }, function () {

                }, item);
            }

            scope.getPersistantMenu = function (botid) {
                if (scope.bot.channel_facebook.page_token != "") {
                    chatbotService.GetPersistantMenu(scope.bot._id).then(function (response) {
                        if (response.data.IsSuccess) {
                            scope.enablepersistmenu = "enabled";
                            scope.persisMenu = response.data.Result;
                        }
                        else {
                            scope.showAlert("Persist Menu", response.data.Exception.Message, 'error');
                        }
                    }, function (error) {
                        scope.showAlert("Persist Menu", "Fail To Load Url.", 'error');
                    });
                }
            }

            scope.updatePersistantMenu = function () {
                if (scope.bot.channel_facebook.page_token != "") {
                    chatbotService.StorePersistantMenu(scope.bot._id, scope.persisMenu).then(function (response) {
                        if (response.data.IsSuccess) {
                            scope.showAlert("Persist Menu", "Persistent menu was updated successfully.", 'success');
                        }
                        else {
                            scope.showAlert("Persist Menu", response.data.Exception.Message, 'error');
                        }
                    }, function (error) {
                        scope.showAlert("Persist Menu", "Failed to update Persist Menu items.", 'error');
                    });
                } else {
                    scope.showAlert("Persist Menu", "You cannot add a Persistant Menu without adding a valid Page Access token for this Bot.", 'error');
                }
            }

            // scope.validatePersistMenu = function (value) {
            //     debugger
            //     if (value == "enabled") {
            //         if (scope.bot.channel_facebook.page_token == "") {
            //             scope.showAlert("Persist Menu", "You cannot add a Persistant Menu without adding a valid Page Access token for this Bot.", 'error');
            //             $timeout(function () {
            //                 scope.enablepersistmenu = "disabled";
            //             }, 001);
            //         }else{
            //             scope.enablepersistmenu = "enabled";
            //         }
            //     }
            // }

            // end of persis menu items


        }
    }

})