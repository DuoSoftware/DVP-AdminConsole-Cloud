/**
 * Created by Pawan on 7/29/2016.
 */

mainApp.controller("companyConfigController", function ($scope, $state, companyConfigBackendService, jwtHelper, authService, callMonitorSrv, attributeService, campaignNumberApiAccess, loginService,$anchorScroll,userProfileApiAccess,ShareData,$q) {

    $anchorScroll();
    $scope.scrlTabsApi = {};

    $scope.reCalcScroll = function () {
        if ($scope.scrlTabsApi.doRecalculate) {
            $scope.scrlTabsApi.doRecalculate();
        }
    };

    $scope.isNewEndUser = false;
    $scope.isUserError = false;
    $scope.ClusterID;
    $scope.abandonRedialConfig = {
        redialTime: "0",
        redialCampaignId: "-1",
        camScheduleId: -1,
        categoryId: -1
    };
    $scope.contextList = [];
    $scope.campaignList = [];
    $scope.scheduleList = [];
    $scope.categoryList = [];
    var currentSchedule = null;
    var currentCategory = null;
    $scope.prefixList=[];
    $scope.userTagList=[];
    $scope.newPrefix={};
    $scope.isValidPrefix=false;
    $scope.validmsg="";
    $scope.abandonRedialTime = 0;

    var authToken = authService.GetToken();
    var decodeData = jwtHelper.decodeToken(authToken);

    $scope.contextPrefix = decodeData.tenant + "_" + decodeData.company + "_";


    $scope.newApplication = {};
    $scope.addNew = false;
    $scope.MasterAppList = [];
    $scope.IsDeveloper = false;
    $scope.Developers = [];
    $scope.CloudEndUser = {};

    $scope.showAlert = function (tittle, content, type) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.saveEndUser = function () {

        switch ($scope.CloudEndUser.ConnectivityProvision) {
            case "SINGLE":
                $scope.CloudEndUser.Provision = 1;
                break;
            case "PROFILE":
                $scope.CloudEndUser.Provision = 2;
                break;
            case "SHARED":
                $scope.CloudEndUser.Provision = 3;
                break;
            default :
                $scope.CloudEndUser.Provision = 1;
                break;
        }

        $scope.CloudEndUser.ClientCompany = decodeData.company;
        $scope.CloudEndUser.ClientTenant = decodeData.tenant;


        if ($scope.isNewEndUser) {
            $scope.CloudEndUser.ClusterID = $scope.ClusterID;

            companyConfigBackendService.saveNewEndUser($scope.CloudEndUser).then(function (response) {

                if (!response.data.IsSuccess) {

                    console.info("Error in adding new Enduser " + response.data.Exception);
                    $scope.showAlert("Error", "There is an error in adding new Enduser ", "error");
                    //$scope.showAlert("Error",)
                }
                else {
                    $scope.addNew = !response.data.IsSuccess;
                    $scope.showAlert("Success", "New Enduser added successfully.", "success");


                }
                $state.reload();
            }, function (error) {
                loginService.isCheckResponse(error);
                console.info("Error in adding new Enduser " + error);
                $scope.showAlert("Error", "There is an Exception in saving Enduser " + error, "error");
                $state.reload();
            });
        }
        else {
            $scope.CloudEndUser.SIPConnectivityProvision = $scope.CloudEndUser.Provision;
            companyConfigBackendService.updateEndUser($scope.CloudEndUser).then(function (response) {

                if (!response.data.IsSuccess) {

                    console.info("Error in adding new Enduser " + response.data.Exception);
                    $scope.showAlert("Error", "There is an error in updating Enduser ", "error");
                    //$scope.showAlert("Error",)
                }
                else {
                    $scope.addNew = !response.data.IsSuccess;
                    $scope.showAlert("Success", "New Enduser updated successfully.", "success");


                }
                $state.reload();
            }, function (error) {
                loginService.isCheckResponse(error);
                console.info("Error in adding new Enduser " + error);
                $scope.showAlert("Error", "There is an Exception in updating Enduser " + error, "error");
                $state.reload();
            });
        }


    };

    $scope.GetEndUser = function () {
        companyConfigBackendService.getCloudEndUser().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking EndUsers " + response.data.Exception);

                $scope.isUserError = true;
            }
            else {
                $scope.isUserError = false;
                if (response.data.Result.length > 0) {
                    $scope.isNewEndUser = false;
                    $scope.CloudEndUser = response.data.Result[0];
                    switch ($scope.CloudEndUser.SIPConnectivityProvision) {
                        case 1:
                            $scope.CloudEndUser.ConnectivityProvision = "SINGLE";
                            break;
                        case 2:
                            $scope.CloudEndUser.ConnectivityProvision = "PROFILE";
                            break;
                        case 3:
                            $scope.CloudEndUser.ConnectivityProvision = "SHARED";
                            break;
                        default :
                            $scope.CloudEndUser.ConnectivityProvision = "SINGLE";
                            break;
                    }
                }
                else {
                    $scope.isNewEndUser = true;
                }

                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking EndUsers " + error);
            $scope.isUserError = true;
        });
    };

    $scope.GetClusters = function () {

        companyConfigBackendService.getClusters().then(function (response) {
            if (!response.data.IsSuccess) {
                console.info("Error in picking Clusters " + response.data.Exception);

            } else {

                if (response.data.Result.length > 0) {
                    $scope.ClusterID = response.data.Result[0].id;

                }


                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking clusters " + JSON.stringify(error));
        });

    };

    $scope.GetContexts = function () {
        companyConfigBackendService.getContexts().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Contexts " + response.data.Exception);

            }
            else {
                $scope.contextList = response.data.Result;

                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Contexts " + error);

        })
    };
    $scope.removeDeleted = function (item) {

        var index = $scope.contextList.indexOf(item);
        if (index != -1) {
            $scope.contextList.splice(index, 1);
        }

    };

    $scope.newContext={};
    $scope.saveNewContext = function () {

        $scope.newContext.ContextCat = "INTERNAL";
        $scope.newContext.ClientCompany = decodeData.company;
        $scope.newContext.ClientTenant = decodeData.tenant;
        $scope.newContext.Context = $scope.contextPrefix + $scope.newContext.Context;

        companyConfigBackendService.saveNewContext($scope.newContext).then(function (response) {

            if (!response.data.IsSuccess) {

                console.info("Error in adding new Context " + response.data.Exception);
                $scope.showAlert("Error", "There is an error in adding new Context ", "error");
                //$scope.showAlert("Error",)
            }
            else {
                $scope.addNew = !response.data.IsSuccess;
                $scope.showAlert("Success", "New Context added successfully.", "success");


            }
            $state.reload();
        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in adding new Enduser " + error);
            $scope.showAlert("Error", "There is an Exception in saving Context " + error, "error");
            $state.reload();
        });
    };

    $scope.reloadPage = function () {
        $state.reload();
    };


    $scope.getTicketPrefixes = function () {

        companyConfigBackendService.getTicketPrefixList().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Prefixes " + response.data.Exception);

            }
            else {
                $scope.prefixList = response.data.Result;

                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Prefixes " + error);

        })

    };

    $scope.checkPrefixAvailability = function () {

        companyConfigBackendService.checkPrefixAvailability($scope.newPrefix.name).then(function (response) {

            if (!response.data.IsSuccess) {

                $scope.isValidPrefix=false;
                console.info("Error in picking Prefixes " + response.data.Exception);
                $scope.validmsg="Invalid prefix";
                //$('#validmsgID').addClass('unavailable_msg').removeClass('available_msg');


            }
            else
            {
                $scope.isValidPrefix=true;
                $scope.validmsg="Valid prefix";
                //$('#validmsgID').addClass('available_msg').removeClass('unavailable_msg');
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Prefixes " + error);

        })

    };

    $scope.setChangeStatus = function () {
        $scope.isValidPrefix=false;
        $scope.validmsg="";
    };

    $scope.saveNewTicketPrefix = function () {
        if( $scope.isValidPrefix && $scope.newPrefix.name)
        {
            companyConfigBackendService.saveNewPrefix($scope.newPrefix).then(function (resAdd) {

                $scope.isValidPrefix=false;
                $scope.validmsg="";
                $scope.newPrefix.name="";
                $scope.showAlert("Add new ticket prefix","Prefix added successfully","success");
                console.log("New prefix added",$scope.newPrefix.name);
                $scope.getTicketPrefixes();

            }, function (errAdd) {
                $scope.showAlert("Add new ticket prefix","Failed to add prefix","error");
                console.log("New prefix adding failed"+$scope.newPrefix.name,errAdd);

            });
        }
        else
        {
            $scope.showAlert("Add new ticket prefix","Failed to add prefix","error");
            console.log("Failed to add prefix , Invalid prefix received ",$scope.newPrefix.name);
        }
    }

    $scope.createNewUserTag = function (tagName) {

        var tagData = {
            name:tagName
        }

        companyConfigBackendService.saveNewUserTag(tagData).then(function (resAdd) {



            $scope.newUserTag={};
            if(resAdd.data.Result)
            {
                $scope.showAlert("Add new user tag","User tag added successfully","success");
                console.log("New user tag added",tagName);
                $scope.userTagList.push(resAdd.data.Result);
            }
            else
            {
                $scope.showAlert("Add new user tag","Invalid user Tag","error");
                console.log("New user tag adding failed/ Invalid"+tagName);
            }



        }, function (errAdd) {
            $scope.showAlert("Add new user tag","Failed to add new user tag","error");
            console.log("New user tag adding failed"+tagName);

        });

    }

    $scope.removeDeletedTags = function (item) {
        var index = $scope.userTagList.indexOf(item);
        if (index != -1) {
            $scope.userTagList.splice(index, 1);
        }
    }


    $scope.getUserTags = function () {

        companyConfigBackendService.getUserTagList().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking UserTags " + response.data.Exception);

            }
            else {
                console.info(" UserTags found ");
                $scope.userTagList = response.data.Result;

            }

        }, function (error) {

            console.info("Error in picking UserTags " + error);

        })

    };

    $scope.GetEndUser();
    $scope.GetClusters();
    $scope.GetContexts();
    $scope.getTicketPrefixes();
    $scope.getUserTags();


    //----------------------------Dynamic Ticket Types----------------------------------------------
    $scope.ticketTypes = undefined;

    $scope.activateDynamicTicketTypes = function () {
        companyConfigBackendService.activateTicketTypes().then(function (response) {
            if (response) {

                var result = response.data;
                if (result && result.IsSuccess) {
                    $scope.ticketTypes = result.Result;
                } else {
                    $scope.ticketTypes = undefined;

                    $scope.showAlert("Dynamic Ticket Types", "Empty Response", "error");
                }
            }
            else {
                $scope.ticketTypes = undefined;
                $scope.showAlert("Dynamic Ticket Types", "Empty Response", "error");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            $scope.ticketTypes = undefined;

            var errMsg = "Error in activate ticket types";
            if (error.statusText) {
                errMsg = error.statusText;
            }

            $scope.showAlert("Dynamic Ticket Types", errMsg, "error");
        });
    };

    $scope.getDynamicTicketTypes = function () {
        companyConfigBackendService.getTicketTypes().then(function (response) {
            if (response.IsSuccess) {
                $scope.ticketTypes = response.Result;
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while saving ticket type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.updateDynamicTicketTypes = function () {
        companyConfigBackendService.updateTicketTypes($scope.ticketTypes).then(function (response) {
            if (response.IsSuccess) {
                $scope.showAlert('Dynamic Ticket Types', response.CustomMessage, 'success');
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(error);
            var errMsg = "Error occurred while saving ticket type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.addCustomTicketTypes = function () {
        companyConfigBackendService.addCustomTicketTypes($scope.ticketTypes._id.toString(), $scope.ticketTypes.newCustomState).then(function (response) {
            if (response.IsSuccess) {
                $scope.ticketTypes.custom_types.push($scope.ticketTypes.newCustomState);
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while saving custom type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.removeCustomTicketTypes = function (index, customType) {
        companyConfigBackendService.removeCustomTicketTypes($scope.ticketTypes._id.toString(), customType).then(function (response) {
            if (response.IsSuccess) {
                $scope.ticketTypes.custom_types.splice(index, 1);
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while removing custom type";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Dynamic Ticket Types', errMsg, 'error');
        });
    };

    $scope.getDynamicTicketTypes();


    //----------------------------Custom Ticket Status----------------------------------------------
    $scope.cusTicketStatus = {};
    $scope.cusTicketStatus.category="INPROGRESS";
    $scope.customticketStatus = [];
    $scope.systemTicketStatus = [];

    $scope.getCustomTicketStatus = function(){
        $scope.customticketStatus = [];
        $scope.systemTicketStatus = [];
        companyConfigBackendService.getCustomTicketStatus().then(function(response){
            if(response.IsSuccess)
            {
                if(response.Result){
                    for(var i=0; i< response.Result.length; i++){
                        if(response.Result[i].node_type === "system"){
                            $scope.systemTicketStatus.push(response.Result[i]);
                        }else{
                            $scope.customticketStatus.push(response.Result[i]);
                        }
                    }
                }else{
                    $scope.customticketStatus = [];
                }
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Custom Ticket Status', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving ticket status";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Custom Ticket Status', errMsg, 'error');
        });
    };

    $scope.addCustomTicketStatus = function(){
        companyConfigBackendService.addCustomTicketStatus($scope.cusTicketStatus).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Custom Ticket Status', response.CustomMessage, 'success');
                $scope.cusTicketStatus = {};
                $scope.cusTicketStatus.category = "INPROGRESS";
                $scope.getCustomTicketStatus();
            }
            else
            {
                var errMsg = response.CustomMessage;

                /*if(response.Exception)
                 {
                 errMsg = response.Exception.Message;
                 }*/
                $scope.showAlert('Custom Ticket Status', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while add new ticket status";
            /*if(err.statusText)
             {
             errMsg = err.statusText;
             }*/
            $scope.showAlert('Custom Ticket Status', errMsg, 'error');
        });
    };

    $scope.removeDeleted = function (item) {

        var index = $scope.customticketStatus.indexOf(item);
        if (index != -1) {
            $scope.customticketStatus.splice(index, 1);
        }

    };

    $scope.getCustomTicketStatus();

    //-----------------------------Chat Config----------------------------------------------------
    $scope.chatConfig = {WelcomeMessage : ""};
    $scope.createChatConfig = function (config) {
        companyConfigBackendService.createChatConfig(config).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Chat Config', "Welcome Chat Message Successfully Saved.", 'success');
            }
            else
            {
                $scope.showAlert('Chat Config', "Fail To Save Welcome Chat Message Config.", 'error');
            }
        }, function(err){
            $scope.showAlert('Chat Config', "Fail To Save Chat Config.", 'error');
        });
    };

    $scope.deleteChatConfig = function () {
        var config = {
            welcomeMessage : ""
        };
        companyConfigBackendService.createChatConfig(config).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.chatConfig = {WelcomeMessage : ""};
                $scope.showAlert('Chat Config', "Welcome Chat Message Successfully Deleted.", 'success');
            }
            else
            {
                $scope.showAlert('Chat Config', "Fail To Delete Welcome Chat Message Config.", 'error');
            }
        }, function(err){
            $scope.showAlert('Chat Config', "Fail To Delete Chat Config.", 'error');
        });
    };

    $scope.GetChatConfig = function () {
        companyConfigBackendService.getChatConfig().then(function (response) {
            if(response)
            {
                $scope.chatConfig =response;
            }
            else
            {
                $scope.showAlert('Chat Config', "Fail To Get Welcome Chat Message Config.", 'error');
            }
        }, function(err){
            $scope.showAlert('Chat Config', "Fail To Get Chat Config.", 'error');
        });
    };
    $scope.GetChatConfig();
    //-----------------------------Phone Config----------------------------------------------------
    $scope.createPhoneConfig = function (config) {
        companyConfigBackendService.createPhoneConfig(config).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.phoneConfig = response.Result;
                $scope.phoneConfig.autoAnswerDelay = parseInt(response.Result.autoAnswerDelay)/1000;
                $scope.isPhoneConfiged = true;
                $scope.showAlert('Phone Config', "Successfully Saved.", 'success');

            }
            else
            {
                $scope.showAlert('Phone Config', "Fail To Save Phone Config.", 'error');
            }
        }, function(err){
            $scope.showAlert('Phone Config', "Fail To Save Phone Config.", 'error');
        });
    };

    $scope.updatePhoneConfig = function (config) {
        companyConfigBackendService.updatePhoneConfig(config).then(function (response) {
            if(response)
            {
                $scope.showAlert('Phone Config', "Successfully Updated.", 'success');

            }
            else
            {
                $scope.showAlert('Phone Config', "Fail To Update Phone Config.", 'error');
            }
        }, function(err){
            $scope.showAlert('Phone Config', "Fail To Update Phone Config.", 'error');
        });
    };

    $scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

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

    $scope.deletePhoneConfig = function (config) {
        $scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " , function (obj) {

            companyConfigBackendService.deletePhoneConfig(config).then(function (response) {
                if(response)
                {
                    $scope.phoneConfig = {};
                    $scope.isPhoneConfiged = false;
                    $scope.showAlert('Phone Config', "Successfully deleted.", 'success');

                }
                else
                {
                    $scope.showAlert('Phone Config', "Fail To Delete Phone Config.", 'error');
                }
            }, function(err){
                $scope.showAlert('Phone Config', "Fail To Delete Phone Config.", 'error');
            });

        }, function () {

        }, config)


    };

    $scope.phoneConfig = {};
    $scope.isPhoneConfiged = false;
    var getPhoneConfig = function () {
        companyConfigBackendService.getPhoneConfig().then(function (response) {
            $scope.phoneConfig = response;

            if(response){
                $scope.isPhoneConfiged =true;
                $scope.phoneConfig.autoAnswerDelay = parseInt(response.autoAnswerDelay)/1000;
            }
        }, function(err){
            $scope.showAlert('Phone Config', "Fail To Get Phone Config.", 'error');
        });
    };
    getPhoneConfig();

    //----------------------------Break Types------------------------------------------------------

    $scope.breakType = {};
    $scope.breakTypes = [];

    $scope.createBreakType = function () {
        if($scope.breakType) {
            if($scope.breakType.MaxDurationPerDay){
                if($scope.breakType.MaxDurationPerDay < 0) {
                    $scope.breakType.MaxDurationPerDay = 0;
                }else if($scope.breakType.MaxDurationPerDay > 100){
                    $scope.breakType.MaxDurationPerDay = 100;
                }
            }

            var patt = /^[a-zA-Z0-9-_\\s]+(Break|break)$/;
            if(!patt.test($scope.breakType.BreakType)){
                $scope.breakType.BreakType = $scope.breakType.BreakType+'Break';
            }

            companyConfigBackendService.createBreakType($scope.breakType).then(function (response) {
                if (response.IsSuccess) {
                    $scope.showAlert('Custom Break Type', 'Break Type Added Successfully.', 'success');
                    $scope.breakType = {};
                    $scope.getBreakTypes();
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Custom Break Type', 'Break Type Added Error.', 'error');
                }
            }, function (err) {
                var errMsg = "Error occurred while add new Break Type";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Custom Break Type', 'Break Type Added Error.', 'error');
            });
        }
    };

    $scope.getBreakTypes = function () {
        companyConfigBackendService.getAllBreakTypes().then(function (response) {
            if(response.IsSuccess)
            {
                $scope.breakTypes = response.Result;
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Custom Break Type', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Break Types";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Custom Break Type', errMsg, 'error');
        });
    };

    $scope.getBreakTypes();


    //----------------------------Company Details------------------------------------------------------
    $scope.companyDetail = {};

    var getOrganizationDetail = function () {
        companyConfigBackendService.getOrganizationDetail().then(function (response) {
            if(response.IsSuccess)
            {
                if(response.Result.timeZone) {
                    $scope.companyDetail = response.Result;
                }else{
                    response.Result.timeZone = {tz:"", utcOffset:""};
                    $scope.companyDetail = response.Result;
                }
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Company Details', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Company Details";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Company Details', errMsg, 'error');
        });

    };

    $scope.updateOrganizationDetail = function () {
        companyConfigBackendService.updateOrganizationDetail($scope.companyDetail).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Company Details', 'Update Company Detail Success', 'success');
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Company Details', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Company Details";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Company Details', errMsg, 'error');
        });

    };

    // Console access limit details

    var setMaximumConsoleAccessLimits = function (data) {

        var maxAccessLimitAdminObj = data.consoleAccessLimits.filter(function(obj) {
            return obj.accessType === 'admin'
        });
        $scope.maxAccessLimitAdmin = maxAccessLimitAdminObj[0].accessLimit;

        var maxAccessLimitSupervisorObj = data.consoleAccessLimits.filter(function(obj) {
            return obj.accessType === 'supervisor'
        });
        $scope.maxAccessLimitSupervisor = maxAccessLimitSupervisorObj[0].accessLimit;

        var maxAccessLimitAgentObj = data.consoleAccessLimits.filter(function(obj) {
            return obj.accessType === 'agent'
        });
        $scope.maxAccessLimitAgent = maxAccessLimitAgentObj[0].accessLimit;

    };

    var setCurrentConsoleAccessLimits = function (data) {

        var currAccessLimitAdminObj = data.consoleAccessLimits.filter(function(obj) {
            return obj.accessType === 'admin'
        });
        $scope.currentAccessLimitAdmin = currAccessLimitAdminObj[0].currentAccess.length;

        var currAccessLimitSupervisorObj = data.consoleAccessLimits.filter(function(obj) {
            return obj.accessType === 'supervisor'
        });
        $scope.currentAccessLimitSupervisor = currAccessLimitSupervisorObj[0].currentAccess.length;

        var currAccessLimitAgentObj = data.consoleAccessLimits.filter(function(obj) {
            return obj.accessType === 'agent'
        });
        $scope.currentAccessLimitAgent = currAccessLimitAgentObj[0].currentAccess.length;

    };

    var getConsoleAccessLimits = function () {

        companyConfigBackendService.getConsoleAccessLimits().then(function (response) {
            if(response && response.IsSuccess){
                if(response.Result){
                    setMaximumConsoleAccessLimits(response.Result);
                    setCurrentConsoleAccessLimits(response.Result);
                }
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Company Console Access Details', errMsg, 'error');
            }
        })
    };
    getConsoleAccessLimits();

    $scope.bgColorAdmin = function () {
        return ($scope.maxAccessLimitAdmin === $scope.currentAccessLimitAdmin) ? 'red-threshold' : 'product_price '
    };

    $scope.bgColorSupervisor = function () {
        return ($scope.maxAccessLimitSupervisor === $scope.currentAccessLimitSupervisor) ? 'red-threshold' : 'product_price '
    };

    $scope.bgColorAgent = function () {
        return ($scope.maxAccessLimitAgent === $scope.currentAccessLimitAgent) ? 'red-threshold' : 'product_price '
    };

    var getAbandonRedialInfo = function () {
        companyConfigBackendService.getAbandonCallRedialConfig().then(function (response) {
            if(response && response.IsSuccess)
            {
                if(response.Result)
                {
                    response.Result.redialCampaignId = response.Result.redialCampaignId.toString();
                    response.Result.camScheduleId = response.Result.camScheduleId.toString();
                    response.Result.categoryId = response.Result.categoryId.toString();
                }


                $scope.loadSchedulesAndCategories(response.Result.redialCampaignId, function(resp){
                    $scope.abandonRedialConfig = response.Result;
                })
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Company Details', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Campaigns";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Company Details', errMsg, 'error');
        });

    };

    var getRealTimeCampaigns = function () {
        callMonitorSrv.getCurrentCampaigns().then(function (response) {
            if(response && response.data && response.data.IsSuccess)
            {
                $scope.campaignList = response.data.Result;

                getAbandonRedialInfo();
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Company Details', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Campaigns";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Company Details', errMsg, 'error');
        });

    };

    $scope.loadSchedulesAndCategories = function (campId, callback) {
        campaignNumberApiAccess.getSchedulesForCampaign(campId).then(function (response) {
            if(response && response.IsSuccess)
            {
                $scope.scheduleList = response.Result;

                campaignNumberApiAccess.getCategoriesForCampaign(campId).then(function (response) {
                    if(response && response.IsSuccess)
                    {
                        $scope.categoryList = response.Result;
                        callback(true);
                    }
                    else
                    {
                        var errMsg = response.CustomMessage;

                        if(response.Exception)
                        {
                            errMsg = response.Exception.Message;
                        }
                        $scope.showAlert('Company Details', errMsg, 'error');
                        callback(false);
                    }
                }, function(err){
                    var errMsg = "Error occurred while receiving Campaigns";
                    if(err.statusText)
                    {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Company Details', errMsg, 'error');
                    callback(false);
                });
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Company Details', errMsg, 'error');
                callback(false);
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Campaigns";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Company Details', errMsg, 'error');
            callback(false);
        });



    };

    $scope.loadSchedulesAndCategoriesList = function (campId) {
        $scope.loadSchedulesAndCategories(campId, function(result){

        })
    };

    getRealTimeCampaigns();

    $scope.updateAbandonCallRedialTime = function () {
        companyConfigBackendService.updateAbandonCallRedialConfig($scope.abandonRedialConfig).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Company Details', 'Update Abandon Call Redial Config Success', 'success');
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Company Details', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Company Details";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Company Details', errMsg, 'error');
        });

    };




    getOrganizationDetail();



    //----------------------------ActiveDirectory-------------------------------------------

    $scope.activeDirectoryDetail = {};
    $scope.resetPasswordStatus = false;
    $scope.passwordResetData = {};
    $scope.ResetPasswordPressed = function () {
        $scope.resetPasswordStatus = true;
    };

    $scope.cancelPasswordReset = function () {
        $scope.resetPasswordStatus = false;
    };

    $scope.configActiveDirectory = function () {
        companyConfigBackendService.configActiveDirectoryDetail($scope.activeDirectoryDetail).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Active Directory', 'Configure Active Directory Success', 'success');
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Active Directory', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error Occurred While Configuring Active Directory";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Active Directory', errMsg, 'error');
        });

    };

    $scope.updateActiveDirectory = function () {
        companyConfigBackendService.updateActiveDirectoryDetail($scope.activeDirectoryDetail).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Active Directory', 'Update Active Directory Success', 'success');
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Active Directory', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error Occurred While Updating Active Directory";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Active Directory', errMsg, 'error');
        });

    };

    $scope.resetActiveDirectoryPassword = function () {
        if($scope.passwordResetData && $scope.passwordResetData.currentPassword && $scope.passwordResetData.newPassword && ($scope.passwordResetData.newPassword === $scope.passwordResetData.confirmPassword)) {
            companyConfigBackendService.resetActiveDirectoryPassword($scope.activeDirectoryDetail._id,{
                currentPassword: $scope.passwordResetData.currentPassword,
                newPassword: $scope.passwordResetData.newPassword
            }).then(function (response) {
                if (response.IsSuccess) {
                    $scope.showAlert('Active Directory', 'Reset Active Directory Password Success', 'success');
                    $scope.resetPasswordStatus = false;
                }
                else {
                    var errMsg = response.CustomMessage;

                    if (response.Exception) {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Active Directory', errMsg, 'error');
                }
            }, function (err) {
                var errMsg = "Error Occurred While Updating Active Directory";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Active Directory', errMsg, 'error');
            });
        }else{
            $scope.showAlert('Active Directory', 'Invalid Password Details', 'error');
        }

    };

    $scope.removeActiveDirectory = function () {
        companyConfigBackendService.removeActiveDirectory($scope.activeDirectoryDetail._id).then(function (response) {
            if(response.IsSuccess)
            {
                $scope.showAlert('Active Directory', 'Remove Active Directory Success', 'success');
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Active Directory', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error Occurred While Removing Active Directory";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Active Directory', errMsg, 'error');
        });

    };

    $scope.getActiveDirectory = function () {
        companyConfigBackendService.getActiveDirectoryDetail().then(function (response) {
            if(response.IsSuccess)
            {
                $scope.activeDirectoryDetail = response.Result;
                if(!$scope.activeDirectoryDetail){
                    $scope.createNewConfig = true;
                    $scope.activeDirectoryDetail = {};
                }else{
                    $scope.createNewConfig = false;
                }
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Active Directory', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error Occurred While Retrieving Active Directory";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Active Directory', errMsg, 'error');
        });

    };

    $scope.getActiveDirectory();



    //----------------------------Business Units------------------------------------------------------

    $scope.newBUnit = {};
    $scope.businessUnits = [];
    $scope.headUsers=[];
    $scope.attribinfo=[];
    $scope.bUnitGroups={};
    $scope.userGroupList=[];

    var getBUGroup = function()
    {
        attributeService.getGroupByName('Business Unit').then(function(response)
        {
            if(!response.data || !response.data.IsSuccess)
            {
                $scope.showAlert("Error", "error", "Error loading fixed group for business units");
            }
            else
            {
                if(response.data.Result)
                {
                    attributeService.GetAttributeByGroupId(response.data.Result.GroupId).then(function (response) {
                        /*scope.attachedAttributes = response.ResAttribute;*/
                        response.forEach(res => {
                            if(res.ResAttribute)
                            {
                                res.ResAttribute.AttributeGroupId = res.AttributeGroupId;
                                $scope.attribinfo.push(res.ResAttribute)
                            }});
                    }, function (error) {
                        $log.debug("GetAttributeByGroupId err");
                        $scope.showError("Error", "Error", "ok", "There is an error ");
                    });
                }
                else
                {
                    $scope.attribinfo = [];
                }
            }
        })
    };
    getBUGroup();



    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(group) {
            return (group.username.toLowerCase().indexOf(lowercaseQuery) != -1);
            ;
        };
    }

    /* $scope.querySearch = function(query) {
     var results = query ? $scope.groups.filter(createFilterFor(query)) : [];
     return results;
     };*/


    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.headUsers) {
                return $scope.headUsers;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.headUsers.filter(createFilterFor(query)) : [];
            return results;
        }

    };



    $scope.saveNewBusinessUnit = function () {

        if($scope.newBUnit && $scope.newBUnit.unitName)
        {
            /*var unitObj =
             {
             unitName:$scope.newBUnit.unitName,
             description:$scope.newBUnit.description
             }*/
            if($scope.newBUnit&& $scope.newBUnit.headUserObjs)
            {
                $scope.newBUnit.headUsers = $scope.newBUnit.headUserObjs.map(function (item) {
                    return item._id;
                });
                delete $scope.newBUnit.headUserObjs;
            }




            userProfileApiAccess.saveBusinessUnit($scope.newBUnit).then(function (resSave) {

                if(resSave.IsSuccess)
                {
                    $scope.showAlert('Business Unit', 'New Business Unit added successfully', 'success');

                    if($scope.groupSofNewBUnit.length>0)
                    {
                        $scope.setBusinessUnitUserGroups ($scope.newBUnit.unitName);

                    }
                    else
                    {
                        $scope.getBusinessUnits();
                        $scope.newBUnit = {};
                    }


                }
                else
                {
                    $scope.showAlert('Business Unit', 'New Business Unit adding failed', 'error');
                }

            },function (errSave) {

                $scope.showAlert('Business Unit', 'New Business Unit adding failed', 'error');
                console.log(errSave);
            });
        }

    }
    $scope.getBusinessUnits = function () {

        userProfileApiAccess.getBusinessUnitsWithGroups().then(function (resUnits) {

            if(resUnits.IsSuccess && resUnits.Result && resUnits.Result.length > 0)
            {
                var buIds = resUnits.Result.map(bu => bu._id);
                attributeService.getSkillsForBusinessUnits(buIds).then(function(skillsList)
                {
                    if(skillsList.IsSuccess && skillsList.Result && skillsList.Result.length > 0)
                    {
                        skillsList.Result.forEach(skill => {
                            resUnits.Result.forEach(bu => {
                                if(bu._id === skill.BUId)
                                {
                                    if(!bu.skills)
                                    {
                                        bu.skills = [];
                                    }

                                    bu.skills.push(skill);
                                }
                            })
                        })
                    }


                    $scope.businessUnits=resUnits.Result;

                }).catch(function(err)
                {

                })

            }
            else
            {
                $scope.showAlert('Business Unit', 'No Business Units found', 'info');
            }
        },function (errUnits) {
            $scope.showAlert('Business Unit', 'Error in searching Business Units', 'error');
        });
    };
    $scope.getAdminUsers = function () {

        ShareData.getUsersCountByRole().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

           /* for (var i = 1; i <= pagecount; i++) {
                method_list.push(ShareData.getUsersByRoleWithPaging(pagesize, i));
            }*/
            $scope.loadUserRec(1,pagecount);


           /* $q.all(method_list).then(function (resolveData) {
                if (resolveData) {

                    resolveData.map(function (data) {

                        data.map(function (item) {

                            $scope.headUsers.push(item);
                        });
                    });

                }
                else
                {
                    $scope.showAlert("Error","Error in loading Admin user details","error");
                }



            }).catch(function (err) {
                console.error(err);

                $scope.showAlert("Error","Error in loading Admin user details","error");
            });*/



        }, function (err) {
            $scope.showAlert("Error","Error in loading Admin user details","error");
        });


        /*userProfileApiAccess.getUsersByRole().then(function (resAdmins) {

            if(resAdmins.IsSuccess)
            {
                $scope.headUsers=resAdmins.Result;
            }
            else
            {
                $scope.showAlert('Business Unit', 'No Business Units found', 'info');
            }
        },function (errAdmins) {
            $scope.showAlert('Business Unit', 'Error in searching Business Units', 'error');
        });*/
    };

    $scope.loadUserRec = function(i,pageCount)
    {
        var index=i;
        ShareData.getUsersByRoleWithPaging(20, index).then(function(items)
        {
            items.map(function(item)
            {
                $scope.headUsers.push(item);
            });

            index++;
            if(index<=pageCount)
            {
                $scope.loadUserRec(index,pageCount);
            }

        },function (err) {
            index++;
            if(index<=pageCount)
            {
                $scope.loadUserRec(i,pageCount);
            }
        })
    }
    $scope.nonAlocatedGroups =[];

    $scope.loadUserGroups = function () {
        userProfileApiAccess.getUserGroups().then(function (data) {
            if (data.IsSuccess) {
                $scope.userGroupList = data.Result;
                $scope.nonAlocatedGroups = $scope.userGroupList.filter(function (obj) {
                    return !obj.businessUnit
                });
            }
            else
            {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = data.Exception.Message;
                }
                $scope.showAlert('Error', 'error', errMsg);

            }

        }, function (err) {

            var errMsg = "Error occurred while loading users";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);
        });
    };




    $scope.updateGroupsOfBUnit = function (groupId,unitName,item,isAdd) {


        if(isAdd)
        {
            $scope.nonAlocatedGroups= $scope.nonAlocatedGroups.filter(function (obj) {

                if(obj._id !=groupId)
                {
                    return obj;
                };
            });
            $scope.businessUnits.forEach(function (unit) {

                if(unit.unitName!=unitName && unit.groups)
                {

                    unit.groups = unit.groups.filter(function( obj ) {
                        return obj._id != groupId;
                    });

                }
            });
        }
        else
        {
            $scope.nonAlocatedGroups.push(item);
        }



    };




    $scope.getBusinessUnits();
    $scope.getAdminUsers();
    $scope.loadUserGroups();


    //----------------------------Accessible Fields ------------------------------------------------------

    $scope.isConfigured =false;
    $scope.accessFileds =[];
    $scope.accessArray =[];
    $scope.isDefault=false;
    $scope.btnTitle="SAVE";
    $scope.RequireFields=[];



    $scope.querySearchGroups = function (query) {
        if (query === "*" || query === "") {
            if ($scope.nonAlocatedGroups) {
                return $scope.nonAlocatedGroups;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.nonAlocatedGroups.filter(createFilterForGroups(query)) : [];
            return results;
        }

    };

    $scope.getExternalUserFields = function ()
    {
        userProfileApiAccess.getExternalUserFields().then(function (resFileds) {

            if(resFileds.IsSuccess)
            {

                var keysObj = Object.keys(resFileds.Result);

                keysObj.forEach(function (item) {
                    if(resFileds.Result[item].isRequired && resFileds.Result[item].path)
                    {
                        $scope.RequireFields.push(resFileds.Result[item].path) ;
                    }
                });


            }
            else
            {
                $scope.showAlert("Error","Error in loading External User Fields ","error");
            }
        },function (errFields) {
            $scope.showAlert("Error","Error in loading External User Fields","error");
        });
    };
    $scope.getExternalUserFields();

    $scope.getDefaultAccessFieldConfigs = function () {



        userProfileApiAccess.GetExternalUserDefaultAccessFields().then(function (resConfigs) {
            if(resConfigs.IsSuccess)
            {
                $scope.accessFileds=[];
                if(resConfigs.Result)
                {

                    resConfigs.Result.Keys.forEach(function (key) {
                        if(!(key =="_id" || key =="created_at" || key =="updated_at" || key=="__v" || key=="company" ||key=="tenant" ) )
                        {
                            /*$scope.accessFileds[key] =
                             {
                             Key:key
                             }*/
                            var isRequired =false;
                            var title="";

                            if($scope.RequireFields.indexOf(key)!=-1)
                            {
                                isRequired=true;
                            }




                            if(key=="primary_contacts")
                            {
                                title="( Phone numbers )";
                                isRequired=true;
                            }
                            if(key=="secondary_contacts")
                            {
                                title="( Land Phone )";
                            }





                            var obj =
                                {
                                    Key:key,
                                    title:title,
                                    Sub_fileds:{
                                        require:{},
                                        view_enable:{},
                                        editable:{}

                                    },
                                    isRequired:isRequired
                                }

                            resConfigs.Result.Sub_keys.forEach(function (field) {

                                if(field!="_id")
                                {
                                    var sub_obj =
                                        {
                                            action:field,
                                            value:true
                                        }

                                    obj.Sub_fileds[field]=sub_obj;
                                }

                            });

                            $scope.accessFileds.push(obj);


                        }
                    });


                }
                else
                {
                    $scope.showAlert("Error","Error in loading Access configs","error");
                }
            }
            else
            {
                $scope.showAlert("Error","Error in loading Access configs","error");
            }
        },function (errConfigs) {
            $scope.showAlert("Error","Error in loading Access configs","error");
        })
    };
    $scope.getAccessFieldConfigs = function () {

        userProfileApiAccess.GetExternalUserConfig().then(function (resConfigs) {
            if(resConfigs.IsSuccess)
            {
                $scope.accessFileds=[];
                if(resConfigs.Result)
                {
                    $scope.isConfigured=true;
                    $scope.btnTitle="UPDATE";

                    for(key in resConfigs.Result)
                    {
                        if(!(key =="_id" || key =="created_at" || key =="updated_at" || key=="__v" || key=="company" ||key=="tenant" ) )
                        {
                            var isRequired =false;
                            var title="";

                            if($scope.RequireFields.indexOf(key)!=-1)
                            {
                                isRequired=true;

                            }

                            if(key=="primary_contacts")
                            {
                                title="( Phone number )";
                                isRequired=true;
                            }
                            if(key=="secondary_contacts")
                            {
                                title="( Land Phone )";
                            }

                            var obj =
                                {
                                    Key:key,
                                    Sub_fileds:{
                                        require:{},
                                        view_enable:{},
                                        editable:{}

                                    },
                                    title:title,
                                    isRequired:isRequired
                                }



                            for(field in resConfigs.Result[key])
                            {

                                if(field!="_id")
                                {
                                    var sub_obj =
                                        {
                                            action:field,
                                            value:resConfigs.Result[key][field]
                                        }

                                    obj.Sub_fileds[field]=sub_obj;
                                }

                            }

                            $scope.accessFileds.push(obj);

                        }

                    }


                }
                else
                {
                    $scope.isConfigured=false;
                    $scope.isDefault=true;
                    $scope.getDefaultAccessFieldConfigs();
                }
            }
            else
            {
                $scope.showAlert("Error","Error in loading Access configs","error");
            }
        },function (errConfigs) {
            $scope.showAlert("Error","Error in loading Access configs","error");
        });
    };

    $scope.checkDisable = function (sub,field) {
        if(sub.action =='require'  && field.isRequired)
        {
            return true;
        }
        else
        {
            return false;
        }
    };


    $scope.getAccessFieldConfigs();
    //$scope.getDefaultAccessFieldConfigs();

    $scope.checkValidation=function (action,filed,val) {



        if((action=="require" || action=="editable") && $scope.RequireFields.indexOf(filed)==-1)

        {
            $scope.accessFileds.forEach(function (item) {

                if(item.Key == filed)
                {
                    if(action=="editable" && !val)
                    {
                        item.Sub_fileds.require.value=val;
                    }
                    if(action=="require" && val)
                    {
                        item.Sub_fileds.editable.value=val;
                    }



                    /*
                     item.Sub_fileds.forEach(function (sub) {

                     if(((action=="require" && sub.action=="editable") || (action=="editable" && sub.action=="require" && val==false)))
                     {

                     sub.value=val;

                     }


                     });*/
                }
            });
        }



    };

    $scope.addOrUpdateConfig = function () {
        var saveObj= {};

        $scope.accessFileds.forEach(function (item) {



            Object.keys(item.Sub_fileds).forEach(function(sub, index) {
                if(!saveObj[item.Key])
                {
                    saveObj[item.Key]={};
                }
                if(!saveObj[item.Key][sub])
                {
                    saveObj[item.Key][sub]="";
                }
                saveObj[item.Key][sub]=item.Sub_fileds[sub].value;
            }, item.Sub_fileds);

            /* item.Sub_fileds.forEach(function (sub) {

             if(!saveObj[item.Key])
             {
             saveObj[item.Key]={};
             }
             if(!saveObj[item.Key][sub.action])
             {
             saveObj[item.Key][sub.action]="";
             }
             saveObj[item.Key][sub.action]=sub.value;

             });*/




        });

        var dataObj=
            {
                fields:saveObj
            }


        if(!$scope.isDefault)
        {
            userProfileApiAccess.updateAccessFields(dataObj).then(function (resUpdate) {
                if(resUpdate.IsSuccess)
                {
                    $scope.showAlert("Updated","Access Fields Updated","success");
                }
                else {
                    $scope.showAlert("Error","Access Fields Updating failed","error");
                }
            },function (errUpdate) {
                $scope.showAlert(" Error","Access Fields Updating failed","error");
            });
        }
        else
        {
            userProfileApiAccess.addAccessFields(dataObj).then(function (resUpdate) {
                if(resUpdate.IsSuccess)
                {
                    $scope.showAlert("New Access Config","Access Fields Added","success");
                }
                else {
                    $scope.showAlert("New Access Config","Access Fields Adding failed","error");
                }
            },function (errUpdate) {
                $scope.showAlert("New Access Config","Access Fields Adding failed","error");
            });
        }


    };

    $scope.showDefaultAceessFields = function () {
        $scope.isConfigured =true;
    }

    $scope.groupSofNewBUnit=[];

    $scope.onChipAddBGroup = function (group) {

        $scope.groupSofNewBUnit.push(group._id);
        $scope.updateGroupsOfBUnit(group._id,"",group,true);
        /*scope.updateGroupBUnit(scope.unit.unitName,group,true);*/

    };
    $scope.onChipDeleteBGroup = function (group) {

        /* var index = $scope.attributeGroups.indexOf(chip.GroupId);
         console.log("index ", index);
         if (index > -1) {
         $scope.attributeGroups.splice(index, 1);
         console.log("rem attGroup " + $scope.attributeGroups);
         }*/
        $scope.groupSofNewBUnit = $scope.groupSofNewBUnit.filter(function (item) {

            return item !=group;
        });

        $scope.updateGroupsOfBUnit(group._id,"",group,false);


    };



    $scope.setBusinessUnitUserGroups = function (bUnit) {

        var obj =
            {
                groups:$scope.groupSofNewBUnit
            }


        userProfileApiAccess.addGroupsToBUnit(bUnit,obj).then(function (resUpdate) {
            if(resUpdate.IsSuccess)
            {
                $scope.showAlert("Business Unit","Update Groups of Business Unit successfully","success");
                $scope.getBusinessUnits();
                $scope.newBUnit = {};

            }
            else
            {
                $scope.showAlert("Business Unit","Error in updating Groups of Business Unit ","error");
            }
        },function (errUpdate) {
            $scope.showAlert("Business Unit","Error in updating Groups of  Business Unit ","error");
        });



    }

});
