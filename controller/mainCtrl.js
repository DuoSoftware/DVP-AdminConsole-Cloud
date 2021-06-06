/**
 * Created by Damith on 5/28/2016.
 */

'use strict';
mainApp.controller('mainCtrl', function ($window, $scope, $rootScope, $state, $timeout, $filter, $uibModal, jwtHelper, loginService,
                                         authService, organizationService,packagingService,notifiSenderService, veeryNotification, $q, userImageList, userProfileApiAccess, myUserProfileApiAccess, turnServers, callMonitorSrv, subscribeServices, $ngConfirm, filterFilter, ShareData, $http,internal_user_service, appVersion) {

    $scope.version = appVersion.version;

    // check adminconsole is focus or not.
    angular.element($window).bind('focus', function () {
    }).bind('blur', function () {
    });


    $scope.BusinessUnit = ShareData.BusinessUnit;
    $scope.BusinessUnits = ShareData.BusinessUnits;

    $scope.RecievedInvitations = function () {
        internal_user_service.getMyReceivedInvitations().then(function (resInvites) {

            $scope.pendingInvites = resInvites.map(function (item) {

                item.time = item.created_at;
                item.messageType = "invitation";
                item.title = "Invitation";
                item.header = item.message;

                return item;


            });
            /*$scope.pendingInvites=resInvites;*/
            $scope.pendingInviteCnt = resInvites.length;
        }, function (errInvites) {
            $scope.showAlert("Error", "error", "Error in loading Invitations");
        });
    };

    $scope.RecievedInvitations();

    $scope.acceptInvitation = function (invite) {

        internal_user_service.acceptInvitation(invite).then(function (resAccept) {


            $scope.pendingInvites.splice($scope.pendingInvites.indexOf($scope.pendingInvites.map(function (item) {
                return item._id = invite._id;
            })), 1);
            $scope.showMesssageModal = false;
            if ($scope.pendingInviteCnt > 0) {
                $scope.pendingInviteCnt = $scope.pendingInviteCnt - 1;
            }
            else {
                $scope.pendingInviteCnt = 0;
            }
            $scope.showAlert("Success", "success", "You have accepted the Invitation from " + invite.from);

        }, function (errAccept) {
            $scope.showAlert("Error", "error", "Error in Accepting Invitation");
        });
    };
    $scope.rejectInvitation = function (invite) {

        internal_user_service.rejectInvitation(invite).then(function (resAccept) {


            $scope.pendingInvites.splice($scope.pendingInvites.indexOf($scope.pendingInvites.map(function (item) {
                return item._id = invite._id;
            })), 1);
            $scope.showMesssageModal = false;
            if ($scope.pendingInviteCnt > 0) {
                $scope.pendingInviteCnt = $scope.pendingInviteCnt - 1;
            }
            else {
                $scope.pendingInviteCnt = 0;
            }
            $scope.showAlert("Success", "success", "You have rejected the invitation from " + invite.from);

        }, function (errAccept) {
            $scope.showAlert("Error", "error", "Error in rejecting invitation from " + invite.from);
        });
    };
    $scope.cancelInvitation = function (invite) {

        internal_user_service.cancelInvitation(invite).then(function (resAccept) {


            $scope.pendingInvites.splice($scope.pendingInvites.indexOf($scope.pendingInvites.map(function (item) {
                return item._id = invite._id;
            })), 1);
            $scope.showMesssageModal = false;
            if ($scope.pendingInviteCnt > 0) {
                $scope.pendingInviteCnt = $scope.pendingInviteCnt - 1;
            }
            else {
                $scope.pendingInviteCnt = 0;
            }
            $scope.showAlert("Success", "success", "You have canceled the invitation from " + invite.from);

        }, function (errAccept) {
            $scope.showAlert("Error", "error", "Error in canceling invitation from " + invite.from);
        });
    };


    $scope.CallStatus = null;
    $scope.loginData = {};
    $scope.callListStatus = false;
    $scope.isRegistered = true;
    $scope.inCall = false;

    $scope.newNotifications = [];


    /** Kasun_Wijeratne_2_MARCH_2018
     * ------------------------------ */
    $scope.invalidUserPassword = true;
    /**---------------------------------
     Kasun_Wijeratne_2_MARCH_2018 */

    // Register for notifications

    $scope.showAlert = function (tittle, type, msg) {
        new PNotify({
            title: tittle,
            text: msg,
            type: type,
            styling: 'bootstrap3',
            icon: false
        });
    };
    $scope.showConfirmation = function (title, contentData, okText, okFunc, closeFunc) {

        $ngConfirm({
            title: title,
            content: contentData, // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
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

    $scope.unredNotifications = 0;
    $scope.OnMessage = function (data) {

        if (data.From && $scope.users) {

            var sender = $filter('filter')($scope.users, { username: data.From });
            console.log("Sender ", sender);
            data.avatar = (sender && sender.length) ? sender[0].avatar : "assets/images/defaultProfile.png";
            data.resv_time = new Date();
            data.read = false;
            $scope.newNotifications.unshift(data);

            if ($scope.$$phase) {
                $scope.unredNotifications = $scope.newNotifications.length;

            }
            else {
                $scope.$apply(function () {
                    $scope.unredNotifications = $scope.newNotifications.length;
                });
            }


            var audio = new Audio("assets/sounds/notification-1.mp3");
            audio.play();


        }


        //$scope.showAlert("Success","success","Got");
        //console.log(data);


    };


    /*$scope.getCountOfUnredNotifications = function () {
     return filterFilter($scope.notifications, {read: false}).length;
     };*/

    //---------------------- Notification Service  ------------------------------ //

    $scope.isSocketRegistered = false;
    $scope.isLoadingNotifiReg = false;


    $scope.agentDisconnected = function () {
        $scope.isSocketRegistered = false;
        if ($scope.isLogged) {
            $scope.showAlert("Notification Service", "error", "Disconnected from notifications, Please re-register");
        }

    };
    $scope.agentAuthenticated = function () {
        $scope.isSocketRegistered = true;
        $('#regNotificationLoading').addClass('display-none').removeClass('display-block');
        $('#regNotification').addClass('display-block').removeClass('display-none');
    };
    $scope.callMonitorRegistered = function () {
        $scope.isSocketRegistered = true;

    };


    $scope.SubscribeConnection = function () {
        subscribeServices.SubscribeConnection("main_ctrl", function (isConnected) {
            if (isConnected) {
                $scope.agentAuthenticated();
            } else {
                $scope.agentDisconnected();
            }
        });
    };
    $scope.veeryNotification = function () {
        /*veeryNotification.connectToServer(loginService.TokenWithoutBearer(), baseUrls.notification, notificationEvent);*/

        subscribeServices.Connect();
        $scope.SubscribeConnection();
    };

    $scope.veeryNotification();




    $scope.checkAndRegister = function () {


        if (!$scope.isSocketRegistered) {
            $('#regNotification').addClass('display-none').removeClass('display-block');
            $('#regNotificationLoading').addClass('display-block').removeClass('display-none');
            $scope.isLoadingNotifiReg = true;
            $scope.veeryNotification();
        }

    };


    subscribeServices.SubscribeEvents(function (event, data) {
        switch (event) {

            case 'listen_disconnected':

                ShareData.listeningCallId =null;
                ShareData.isInCall=false;

                break;


            /*case 'agent_connected':

             $scope.agentConnected(data);

             break;

             case 'agent_disconnected':

             $scope.agentDisconnected(data);

             break;

             case 'agent_found':

             $scope.agentFound(data);

             break;

             case 'agent_rejected':
             $scope.agentRejected(data);
             break;

             case 'todo_reminder':

             $scope.todoRemind(data);

             break;

             case 'notice':

             $scope.OnMessage(data);

             break;
             */
            case 'notice_message':

                $scope.OnMessage(data);

                break;
        }
    });

    subscribeServices.SubscribeStatus('main', function (status) {
        if (status) {
            Object.keys(status).forEach(function (key, index) {

                $scope.users.map(function (item) {
                    if (item.username === key) {
                        item.status = status[key];
                        item.statusTime = Date.now();
                    }
                });

                /*var userObj = $scope.users.filter(function (item) {
                 return key === item.username;
                 });
                 if (Array.isArray(userObj)) {
                 userObj.forEach(function (obj, index) {
                 obj.status = status[key];
                 obj.statusTime = Date.now();
                 });
                 }*/

            });

            $scope.users.sort(function (a, b) {

                var i = 0;
                var j = 0;


                if (a.status == 'offline') {

                    i = 1;
                } else {

                    i = 2;
                }

                if (b.status == 'offline') {

                    j = 1;
                } else {

                    j = 2;
                }


                return j - i;

            });
        }
    });


    subscribeServices.SubscribeCallStatus('main', function (status) {
        if (status) {
            Object.keys(status).forEach(function (key, index) {
                var userObj = $scope.users.filter(function (item) {
                    return key == item.username;
                });
                if (Array.isArray(userObj)) {
                    userObj.forEach(function (obj, index) {

                        obj.callstatus = status[key];
                        obj.callstatusstyle = 'call-status-' + obj.callstatus;
                        obj.callstatusTime = Date.now();
                    });
                }

            });
        }
    });

    subscribeServices.subscribeDashboard('main', function (event) {
        switch (event.roomName) {
            case 'ARDS:break_exceeded':
            case 'ARDS:freeze_exceeded':
                if (event.Message) {
                    if (event.Message.SessionId) {
                        event.Message.Message = event.Message.Message + " Session : " + event.Message.SessionId;
                    }
                    var data = {};
                    angular.copy(event, data);
                    var mObject = data.Message;

                    //var items = $filter('filter')($scope.users, {resourceid: parseInt(mObject.ResourceId)}, true);
                    var items = $filter('filter')($scope.users, { resourceid: mObject.ResourceId.toString() },true);
                    mObject.From = (items && items.length) ? items[0].username : mObject.UserName;
                    mObject.TopicKey = data.eventName;
                    mObject.messageType = mObject.Message;
                    mObject.header = mObject.Message;
                    mObject.isPersist = mObject.Direction !== "STATELESS";
                    mObject.PersistMessageID = mObject.id;
                    $scope.OnMessage(mObject);
                }
                break;
            default:
                //console.log(event);
                break;

        }
    });


    $scope.RemoveAllNotifications = function () {


        $scope.showConfirmation("Remove all notifications", "Do you want to remove all Notifications ?", "Ok", function () {
            notifiSenderService.RemoveAllPersistenceMessages().then(function (response) {

                if (response.data.IsSuccess) {
                    $scope.unredNotifications = 0;
                    $scope.newNotifications = [];
                    $scope.showAlert("Notifications Deleted", "success", "All notification deleted successfully");
                }
                else {
                    console.log("Error in Removing notifications");
                    $scope.showAlert("Error", "error", "Error in deleting notifications");
                }

                $scope.showMesssageModal = false;

            }, function (error) {
                $scope.showAlert("Error", "error", "Error in deleting notifications");
                console.log("Error in Removing notifications");
            });
        }, function () {

        });


        /* notificationService.RemoveAllPersistenceMessages().then(function (response) {

         if(response.data.IsSuccess)
         {
         $scope.unredNotifications = 0;
         $scope.notifications =[];
         }
         else
         {
         console.log("Error in Removing notifications");
         $scope.showAlert("Error", "error", "Error in deleting notifications");
         }

         $scope.showMesssageModal = false;

         },function (error) {
         $scope.showAlert("Error", "error", "Error in deleting notifications");
         console.log("Error in Removing notifications");
         });*/

        /*$scope.showConfirm("Delete notifications","Delete","ok","cancel","Do you want to delete all notifications",function () {



         },function () {

         },null)*/


    };


    //---------------------- Notification Service End ------------------------------ //

    //check my navigation
    //is can access
    /** Kasun_Wijeratne_5_MARCH_2018
     * ----------------------------------------
     * User validation for Dev or Live goes here
     * ----------------------------------------*/
    $rootScope.isLive = false;
    /** ----------------------------------------
     * Kasun_Wijeratne_5_MARCH_2018*/

    packagingService.getNavigationAccess(function (result) {

        // Kasun_Wijeratne_14_JAN_2018
        if (Object.keys(result).length > 5) {
            $rootScope.allUsers = true;
            // $state.go('console.dashboard');
        } else {
            if (Object.keys(result).length != 0) {
                $rootScope.freshUser = true;
                $rootScope.allUsers = false;
            }
        }
        // Kasun_Wijeratne_14_JAN_2018 - END

        $scope.accessNavigation = result;
        //if($scope.accessNavigation.BASIC INFO)
        if ($scope.accessNavigation.TICKET) {
            $scope.loadUserGroups();
            $scope.loadUsers();
        }
    });
    $scope.isLogged = true;

    $scope.clickDirective = {
        goLogout: function () {
            authService.Logoff(undefined, function (issuccess) {
                if (issuccess) {
                    veeryNotification.disconnectFromServer();
                    $scope.isLogged = false;
                    $rootScope.freshUser = false;
                    $state.go('company');
                    subscribeServices.Disconnect();
                    /*$timeout.cancel(getAllRealTimeTimer);*/
                } else {

                }
            });
            //loginService.clearCookie("@loginToken");
            //$state.go('login');
        },
        SetBusinessUnit: function (unit) {
            ShareData.BusinessUnit = unit;
            $scope.BusinessUnit = ShareData.BusinessUnit;
        },
        goDashboard: function () {
            $state.go('console.dashboard');
        },
        goProductivity: function () {
            $state.go('console.productivity');
        },
        goFilegallery: function () {
            $state.go('console.filegallery');
        },
        goAgentDial: function () {
            $state.go('console.AgentDialer');
        },
        goAgentDialerAgentWise: function () {
            $state.go('console.AgentDialerAgentWiseSummary');
        },
        goFileupload: function () {
            $state.go('console.fileupload');
        },
        goAttributeList: function () {
            $state.go('console.attributes');
        },
        goFacebookApp: function () {
            $state.go('console.facebook');
        },
        goTwitterApp: function () {
            $state.go('console.twitter');
        },
        goEmailApp: function () {
            $state.go('console.email');
        },
        goResourceList: function () {
            $state.go('console.resources');
        },
        goRealTimeQueued: function () {
            $state.go('console.realtime-queued');
        },
        goCdrReport: function () {
            $state.go('console.cdr');
        },
        goCampaignCdrReport: function () {
            $state.go('console.campaigncdr');
        },
        goSMSDetailReport: function () {
            $state.go('console.smsdetailreport');
        },
        goEmailDetailReport: function () {
            $state.go('console.emaildetailreport');
        },       
        goChatReport: function () {
            $state.go('console.chatreport');
        },  
        goCampaignCallSummery: function () {
            $state.go('console.CampaignCallSummary');
        },
        goCallMonitor: function () {
            $state.go('console.callmonitor');
        },
        goActiveLogins: function () {
            $state.go('console.activelogins');
        },
        goSipUser: function () {
            $state.go('console.sipuser');
        },
        goUsers: function () {
            $state.go('console.users');
        },
        goPbxUsers: function () {
            $state.go('console.pbxuser');
        },
        goPbxAdmin: function () {
            $state.go('console.pbxadmin');
        },

        goAutoAttendance: function () {
            $state.go('console.autoattendance');
        },

        goEditAutoAttendance: function () {
            $state.go('console.editautoattendance');
        },

        goNewAutoAttendance: function () {
            $state.go('console.newautoattendance');
        },

        goMyNumbers: function () {
            $state.go('console.myNumbers');
        },
        goRingGroup: function () {
            $state.go('console.ringGroup');
        },
        GoApplicationAccessManager: function () {
            $state.go('console.applicationAccessManager');
        },
        goDynamicForm: function () {
            $state.go('console.FormDesign');
        },
        goPackages: function () {
            $state.go('console.pricing');
        }, goCredit: function () {
            $state.go('console.credit');
        },
        goAgentStatus: function () {
            $state.go('console.AgentStatus');
        },
        goAgentProfileSummary: function () {
            $state.go('console.AgentProfileSummary');
        },
        goRule: function () {
            $state.go('console.rule');
        },
        goAbandonCallList: function () {
            $state.go('console.abandonCdr');
        },
        goApplications: function () {
            $state.go('console.application');
        },
        goHoldMusic: function () {
            $state.go('console.holdmusic');
        },
        goLimits: function () {
            $state.go('console.limits');
        },
        goConference: function () {
            $state.go('console.conference');
        },
        /*goConferenceMonitor: function () {
         $state.go('console.conferencemonitor');
         },*/
        goQueueSummary: function () {
            $state.go('console.queuesummary');
        },
        goQueueHourlySummary: function () {
            $state.go('console.queueHourlySummary');
        },
        goHourlyBandReport: function (){
            $state.go('console.hourlyBandReport')
        },
        goUserDetailReport: function () {
            $state.go('console.userDetailReport');
        },
        goAgentSummary: function () {
            $state.go('console.agentsummary');
        },
        goArdsConfig: function () {
            $state.go('console.ardsconfig');
        },

        goProfile: function () {
            $state.go('console.myprofile');
        },

        goExtension: function () {
            $state.go('console.extension');
        },
        goDID: function () {
            $state.go('console.did');
        },
        goSchedule: function () {
            $state.go('console.scheduler');
        },
        goReportMail: function () {
            $state.go('console.reportMail');
        },
        goCompanyConfig: function () {
            $state.go('console.companyconfig');
        },
        goThirdPartyIntegration: function () {
            $state.go('console.thirdpartyintegration');
        },
        goAppIntegration: function () {
            $state.go('console.appintegration');
        },
        goWebhookIntegration: function () {
            $state.go('console.webhookintegration');
        },
        goTranslations: function () {
            $state.go('console.translations');
        },
        goTicketTrigger: function () {
            $state.go('console.trigger');
        },
        goTemplateCreater: function () {
            $state.go('console.templatecreater');
        },
        go_ip_phone_config: function () {
            $state.go('console.ip_phone_config');
        },
        goTriggerConfiguration: function () {
            $state.go('console.trigger.triggerConfiguration');
        },
        goTagManager: function () {
            $state.go('console.tagmanager');
        },
        goDispositionalTagManager: function () {
            $state.go('console.dispositionalTagManager');
        },
        goCallSummary: function () {
            $state.go('console.callsummary');
        },
        goTicketSla: function () {
            $state.go('console.sla');
        },
        goQABuilder: function () {
            $state.go('console.qaRatingFormBuilder');
        },
        goCreateCampaign: function () {
            $state.go('console.campaign')
        },
        goCreateNewCampaign: function () {
            $state.go('console.new-campaign', { id: 0 });
        },
        goCampaignLookUp: function () {
            $state.go('console.campaign-lookup');
        },
        goViewCampaigns: function () {
            $state.go('console.campaign-console')
        },
        goCampaignMonitor: function () {
            $state.go('console.campaignmonitor')
        },
        goCampaignSummery: function () {
            $state.go('console.campaignsummeryreport')
        },
        goCampaignDisposition: function () {
            $state.go('console.campaigndispositionreport')
        },
        goCampaignAttempt: function () {
            $state.go('console.campaignattemptreport')
        },
        goAgentDialerSummery: function () {
            $state.go('console.AgentDialerSummary')
        },
        goAgentDialerDetails: function () {
            $state.go('console.AgentDialerDetails')
        },
        goZoho: function () {
            $state.go('console.zoho')
        },
        goZohoUser: function () {
            $state.go('console.zohousers')
        },
        goChatbot: function () {
            $state.go('console.chatbots')
        },
        goChatbotTemplates: function (templateType) {
            $state.go('console.bottemplates', { templateType: templateType })
        },
        goChatbotAutomations: function () {
            $state.go('console.botautomations')
        },
        goChatbotIntegration: function () {
            $state.go('console.botintegration')
        },
        goChatbotSetupAI: function () {
            $state.go('console.botsetupai')
        },
        goChatbotMedia: function () {
            $state.go('console.botmedia')
        },
        goChatbotEntities: function () {
            $state.go('console.botentities')
        },
        goChatbotContext: function(){
            $state.go('console.botcontext')
        },
        goCampaignCallback: function () {
            $state.go('console.campaigncallbackreport')
        },
        goQASubmission: function () {
            $state.go('console.qaSubmission');
        },
        goAgentStatusEvt: function () {
            $state.go('console.agentstatusevents');
        },
        goTickerAgentDashboard: function () {
            $state.go('console.agentTicketDashboard');
        },
        goTicketSummary: function () {
            $state.go('console.ticketSummary');
        },
        goTicketTagSummary: function () {
            $state.go('console.ticketTagSummary');
        },
        goAuditTrailReport: function () {
            $state.go('console.auditTrailRep');
        },
        goTicketDetailReport: function () {
            $state.go('console.ticketDetailReport');
        },
        goTimeSheet: function () {
            $state.go('console.timeSheet');
        }, goFilter: function () {
            $state.go('console.createFilter');
        },
        goToFullScreen: function () {

        }, goCaseConfiguration: function () {
            $state.go('console.caseConfiguration');
        }, goCase: function () {
            $state.go('console.case');
        }, goQueueSlaBreakDown: function () {
            $state.go('console.queueSlaBreakDown');
        }, goTicketFlow: function () {
            $state.go('console.ticketFlow');
        }, goFileSlot: function () {
            $state.go('console.fileslotmaker');
        }, goBillingHistory: function () {
            $state.go('console.billingHistory');
        }, goIvrNodeCountReport: function () {
            $state.go('console.ivrnodecount');
        }, gocSatReport: function () {
            $state.go('console.customersatisfaction');
        }, goAcwReport: function () {
            $state.go('console.acwdetails');
        },
        goQAReport: function () {
            $state.go('console.qaratingreporting');
        }, goMissedCallReport: function () {
            $state.go('console.missedcallreport');
        }, goCampaignNumberUpload: function () {
            $state.go('console.campaignnumberupload');
        }, goDncNumberManage: function () {
            $state.go('console.dncnumbermanage');
        },
        goSecLevels: function () {
            $state.go('console.seclevels');
        },
        newContact: function () {
            $state.go('console.contact-book');
        }, goCallCenterPerformance: function () {
            $state.go('console.callcenterperformance');

        }, goNotices: function () {
            $state.go('console.notices');

        },
        goToAgentDashboard: function () {
            $state.go('console.agentDashboard');

        },
        goToDetailsDashboard: function () {
            $state.go('console.detailsdashboard');
        },
        goToCampaignsDashboard: function () {
            $state.go('console.campaignsdashboard');
        }
        ,goToCampaignDashboard: function () {
            $state.go('console.campaigndashboard');
        },
        goToCallCenterPerformanceReport: function () {
            $state.go('console.callCenterPerformanceReport');

        },
        goFileCatRestrict: function () {
            $state.go('console.fileCatRestrict');

        },
        goFileCatConfig: function () {
            $state.go('console.fileCatConfig');

        },
        goAgentBreakReport: function () {
            $state.go('console.agentBreakReport');

        },
        goQueueSettings: function () {
            $state.go('console.queuesettings');
        },
        goInvitations: function () {
            $state.go('console.invitations');
        },
        goArticles: function () {
            $state.go('console.articles',{fId:null,editmode:false,fname:null});
        },
        goArticleFolders: function () {
            $state.go('console.articlefolders',{fId:null,editmode:false,catName:null});
        },
        goArticleCategories: function () {
            $state.go('console.articlecategories',{catId:null,editmode:false});
        },
    };

    $scope.loadBusinessUnit = function () {
        organizationService.LoadBusinessUnits(ShareData.MyProfile._id).then(function (response) {
            if (response && response.length > 0 && response[0]) {
                ShareData.BusinessUnits = $filter('orderBy')(response, 'unitName');
                $scope.BusinessUnits = ShareData.BusinessUnits;
                ShareData.BusinessUnit = ShareData.BusinessUnits[0].unitName;
                $scope.BusinessUnit = ShareData.BusinessUnit;
            }
        }, function (error) {
            console.error("loadBusinessUnit err");
        });

    };


    $scope.showDisplayName = false;
    var getUserName = function () {
        var userDetails = authService.getTokenDecode();
        console.log(userDetails);
        if (userDetails) {
            $scope.userName = userDetails.iss;
            $scope.displayname = $scope.userName;

            myUserProfileApiAccess.getMyProfile().then(function (resMyProf) {
                if (resMyProf.IsSuccess && resMyProf.Result) {
                    ShareData.MyProfile = resMyProf.Result;
                    $scope.loadBusinessUnit();
                    myUserProfileApiAccess.getMyOrganization().then(function (resOrg) {

                            if (resOrg.IsSuccess && resOrg.Result) {
                                if (resOrg.Result.ownerRef == resMyProf.Result._id) {
                                    $scope.displayname = resOrg.Result.companyName;
                                }
                                else {
                                    if (resMyProf.Result.firstname && resMyProf.Result.lastname) {
                                        $scope.displayname = resMyProf.Result.firstname + " " + resMyProf.Result.lastname;

                                    }

                                }
                                $scope.showDisplayName = true;
                            }
                            else {
                                if (resMyProf.Result.firstname && resMyProf.Result.lastname) {
                                    $scope.displayname = resMyProf.Result.firstname + " " + resMyProf.Result.lastname;

                                }
                                $scope.showDisplayName = true;
                            }


                        }, function (errOrg) {

                            console.log("Error in searching company");
                            if (resMyProf.Result.firstname && resMyProf.Result.lastname) {
                                $scope.displayname = resMyProf.Result.firstname + " " + resMyProf.Result.lastname;

                            }
                            $scope.showDisplayName = true;
                        }
                    );
                }
                else {
                    console.log("Error in searching client profile");
                    $scope.showDisplayName = true;

                }

            }, function (errMyProf) {
                console.log("Error in searching client profile");
                $scope.showDisplayName = true;
            });


        }
    };
    getUserName();

    // Kasun_Wijeratne
    $scope.isNavHidden = false;
    // $scope.navToggleCheck = function () {
    // 	$scope.isNavHidden = !$scope.isNavHidden;
    // }
    // Kasun_Wijeratne

    // $scope.loadBusinessUnit();

    $scope.scrollEnabled = false;
    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    //update damith
    $scope.scrollEnabled = false;
    $scope.viewScroll = function () {
        $scope.safeApply(function () {
            $scope.scrollEnabled = true;
        });
    };
    $scope.hideScroll = function () {
        $scope.safeApply(function () {
            $scope.scrollEnabled = false;
        });
    };


    //update pawan


    var authToken = authService.GetToken();
    var displayName = "";
    if (jwtHelper.decodeToken(authToken).context.veeryaccount) {
        displayName = jwtHelper.decodeToken(authToken).context.veeryaccount.display;
    }

    if(jwtHelper.decodeToken(authToken))
    {
        $scope.companyName=jwtHelper.decodeToken(authToken).companyName;
    }

    /*$scope.showAlert = function (tittle, type, msg) {
     new PNotify({
     title: tittle,
     text: msg,
     type: type,
     styling: 'bootstrap3',
     icon: false
     });
     };*/

    $scope.monitorProtocol = "user";
    $scope.legID = "";

    var getRegistrationData = function (authToken, password) {

        var decodeData = jwtHelper.decodeToken(authToken);
        console.log("Token Obj " + decodeData);

        if (decodeData.context.veeryaccount) {
            var values = decodeData.context.veeryaccount.contact.split("@");
            var sipUri = "sip:" + decodeData.context.veeryaccount.contact;
            var WSUri = "wss://" + values[1] + ":7443";
            var realm = values[1];
            var username = values[0];
            var displayname = values[0];
            var loginData = {
                realm: realm,
                impi: displayname,
                impu: sipUri,
                display_name: decodeData.iss,
                websocket_proxy_url: WSUri,
                password: password


            }
            loginData.turnServers = turnServers;

            return loginData;

        }
        else {
            return false;
        }


    };

    var onRegistrationCompleted = function (response) {
        //console.log(response);
        console.log("Hit registered");
        console.log("Registerd", "Successfully registered", "success");
        $scope.callListStatus = true;
        $scope.$apply(function () {
            $scope.isRegistered = true;
            $rootScope.$emit('register_status', $scope.isRegistered);

        });

    };

    var onUnRegisterCompleted = function (response) {
        //console.log(response);
        console.log("Unregistered", "Registration terminated", "notice");
        $scope.callListStatus = false;
        $scope.$apply(function () {
            $scope.inCall = false;
            $scope.isRegistered = false;
            $rootScope.$emit('register_status', $scope.isRegistered);
        });

    };

    $scope.$on("$destroy", function () {

        subscribeServices.unSubscribeDashboard('main');
        subscribeServices.UnSubscribeCallStatus('main');
        subscribeServices.UnSubscribeStatus('main');
        subscribeServices.UnSubscribeConnection('main_ctrl');
        subscribeServices.Disconnect();
    });

    var onCallDisconnected = function () {
        //console.log(response);
        $scope.isToggleMenu = false;
        $('#callWidget').animate({
            right: '-5%'
        });
        console.log("Call disconnected", "Call is disconnected", "notice");
        $scope.clickBtnStateName = "Waiting";
        $scope.$apply(function () {
            $scope.isCallMonitorOption = 0;
            $scope.inCall = false;
        });

        $scope.CallStatus = null;
        $scope.currentSessionID = null;

        $rootScope.$emit('load_calls', true);


    };

    var onCallConnected = function () {
        $scope.isToggleMenu = true;
        $('#callWidget').animate({
            right: '-6px'
        });
        $scope.$apply(function () {
            console.log("onCallConnected");
            $scope.CallStatus = "LISTEN";
            $scope.clickBtnStateName = "Listen";
            $scope.isCallMonitorOption = 1;
            $scope.inCall = true;
        });

    };

    $scope.RegisterPhone = function (password) {
        var loginData = getRegistrationData(authToken, password);
        if (loginData) {
            Initiate(loginData, onRegistrationCompleted, onCallDisconnected, onCallConnected, onUnRegisterCompleted);
        }
        else {
            console.log("registration failed");
        }
    };

    $scope.UnregisterPhone = function () {
        unregister();
    }

    $scope.HangUpCall = function () {
        hangupCall();
        $scope.CallStatus = null;
        $scope.clickBtnStateName = "waiting";
    };

    $scope.ThreeWayCall = function () {
        //alert("barged: "+bargeID);

        callMonitorSrv.threeWayCall($scope.currentSessionID, $scope.monitorProtocol, displayName, $scope.legID).then(function (resThreeWay) {
            if (resThreeWay.data.IsSuccess) {
                $scope.CallStatus = 'THREEWAY';
                $scope.clickBtnStateName = "Conference ";
            }
            else {
                $scope.showAlert("Call Monitor", "error", "Fail to stablish conference call");
            }
        });


    };

    $scope.BargeCall = function () {
        //alert("barged: "+bargeID);

        callMonitorSrv.bargeCalls($scope.currentSessionID, $scope.monitorProtocol, displayName, $scope.legID).then(function (resBarge) {

            if (resBarge.data.IsSuccess) {

                $scope.CallStatus = "BARGED";
                $scope.clickBtnStateName = "Barged";
            }
            else {
                $scope.showAlert("Call Monitor", "error", "Fail to stablish call barge");
            }
        });

    };

    $scope.ReturnToListen = function () {
        //alert("barged: "+bargeID);
        //
        callMonitorSrv.returnToListen($scope.currentSessionID, $scope.monitorProtocol, displayName, $scope.legID).then(function (resRetToListen) {
            if (resRetToListen.data.IsSuccess) {

                $scope.CallStatus = 'LISTEN';
                $scope.clickBtnStateName = "Listen";
            }
            else {
                $scope.showAlert("Call Monitor", "error", "Fail return to listen");
            }
        });


    };

    $scope.SwapUser = function () {
        //alert("barged: "+bargeID);
        callMonitorSrv.swapUser($scope.currentSessionID, $scope.monitorProtocol, displayName, $scope.legID).then(function (resSwap) {
            if (resSwap.data.IsSuccess) {

                $scope.CallStatus = "SWAPED";
                $scope.clickBtnStateName = "Client";
            }
            else {
                $scope.showAlert("Call Monitor", "error", "Fail to swap between users");
            }
        });


    };

    $rootScope.$on("register_phone", function (event, args) {

        args.turnServers = turnServers;
        Initiate(args, onRegistrationCompleted, onCallDisconnected, onCallConnected, onUnRegisterCompleted);
    });

    $rootScope.$on("check_register", function (event, args) {

        $rootScope.$emit("is_registered", $scope.isRegistered);
    });
    $rootScope.$on("call_listning", function (event, args) {
        $scope.currentSessionID = args.sessionID;
        $scope.monitorProtocol = args.protocol;
        $scope.legID = args.legID;
        $scope.inCall = true;
        $scope.CallStatus = args.CallStatus;

    });
    $rootScope.$on("monitor_panel", function (event, args) {

        $scope.inCall = args;

    });

    //main toggle panle option
    //toggle widget
    $scope.isToggleMenu = false;
    $scope.toggleWidget = function () {
        if ($scope.isToggleMenu) {
            $('#callWidget').animate({
                right: '-5%'
            });
            $scope.isToggleMenu = false;
        } else {
            $('#callWidget').animate({
                right: '-6px'
            });
            $scope.isToggleMenu = true;
        }
    };


    $scope.MakeNotificationObject = function (data) {
        var callbackObj = JSON.parse(data.Callback);

        callbackObj.From = data.From;
        callbackObj.TopicKey = callbackObj.Topic;
        callbackObj.messageType = callbackObj.MessageType;
        callbackObj.isPersist = true;
        callbackObj.PersistMessageID = data.id;
        return callbackObj;

    };

    $scope.users = [];
    $scope.notificationMsg = {};
    $scope.naviSelectedUser = {};
    $scope.userGroups = [];
    var isPersistanceLoaded = false;


    $scope.loadUsers = function () {


        notifiSenderService.getUserCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            $scope.loadUserRec(1,pagecount);

           /* var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(notifiSenderService.LoadUsersByPage(pagesize, i));
            }*/







            /* $q.all(method_list).then(function (resolveData) {
                 if (resolveData) {
                     resolveData.map(function (data) {
                         data.map(function (item) {
                             item.status = 'offline';
                             item.callstatus = 'offline';
                             item.callstatusstyle = 'call-status-offline';
                             $scope.users.push(item);
                         });
                     });

                 }



             }).catch(function (err) {
                 console.error(err);
                 loginService.isCheckResponse(err);
                 $scope.showAlert("Load Users", "error", "Fail To Get User List.");
             });*/


            // load notification message
            $scope.userShowDropDown = 0;

            subscribeServices.Request('pendingall');
            subscribeServices.Request('allstatus');
            subscribeServices.Request('allcallstatus');

            // load notification message
            if (!isPersistanceLoaded) {
                subscribeServices.GetPersistenceMessages().then(function (response) {

                    if (response.data.IsSuccess) {
                        isPersistanceLoaded = true;

                        angular.forEach(response.data.Result, function (value) {

                            var valObj = JSON.parse(value.Callback);

                            if (valObj.eventName == "todo_reminder") {
                                //$scope.todoRemind($scope.MakeNotificationObject(value));
                            }
                            else {
                                $scope.OnMessage($scope.MakeNotificationObject(value));
                            }


                        });

                    }


                }, function (err) {

                });
            }


        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.")
        });



        /*
                notifiSenderService.getUserList().then(function (response) {

                    if (response) {
                        $scope.users = response.map(function (item) {
                            item.status = 'offline';
                            item.callstatus = 'offline';
                            item.callstatusstyle = 'call-status-offline';
                            return item;
                        });
                    }
                    /!*for (var i = 0; i < response.length; i++) {

                     response[i].status = 'offline';
                     response[i].callstatus = 'offline';
                     response[i].callstatusstyle = 'call-status-offline';

                     }
                     $scope.users = response;*!/


                    $scope.userShowDropDown = 0;

                    subscribeServices.Request('pendingall');
                    subscribeServices.Request('allstatus');
                    subscribeServices.Request('allcallstatus');

                    // load notification message
                    if (!isPersistanceLoaded) {
                        subscribeServices.GetPersistenceMessages().then(function (response) {

                            if (response.data.IsSuccess) {
                                isPersistanceLoaded = true;

                                angular.forEach(response.data.Result, function (value) {

                                    var valObj = JSON.parse(value.Callback);

                                    if (valObj.eventName == "todo_reminder") {
                                        //$scope.todoRemind($scope.MakeNotificationObject(value));
                                    }
                                    else {
                                        $scope.OnMessage($scope.MakeNotificationObject(value));
                                    }


                                });

                            }


                        }, function (err) {

                        });
                    }

                }, function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert("Load Users", "error", "Fail To Get User List.")
                });*/
    };

    $scope.loadUserRec = function(i,pageCount)
    {
        var index=i;
        notifiSenderService.LoadUsersByPage(20, index).then(function(items)
        {

            items.map(function (item) {

                item.status = 'offline';
                item.callstatus = 'offline';
                item.callstatusstyle = 'call-status-offline';
                $scope.users.push(item);

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
    $scope.loadUsers();

    //load userGroup list
    $scope.userGroups = [];
    $scope.loadUserGroups = function () {
        notifiSenderService.getUserGroupList().then(function (response) {
            if (response.data && response.data.IsSuccess) {
                for (var j = 0; j < response.data.Result.length; j++) {
                    var userGroup = response.data.Result[j];
                    userGroup.listType = "Group";
                }
                $scope.userGroups = response.data.Result;
                ShareData.UserGroups=$scope.userGroups;
            }
        }, function (err) {
            loginService.IsCheckResponse(err);
            $scope.showAlert("Load User Groups", "error", "Fail To Get User Groups.")
        });
    };
    $scope.loadUserGroups();


    $scope.showMessageBlock = function (selectedUser) {
        $scope.naviSelectedUser = selectedUser;
        divModel.model('#sendMessage', 'display-block');
    };
    $scope.closeMessage = function () {
        divModel.model('#sendMessage', 'display-none');
    };

    $scope.showRightSideNav = false;

    $scope.openNav = function () {
        if (!$scope.showRightSideNav) {
            document.getElementById("mySidenav").style.width = "300px";
            //  document.getElementById("main").style.marginRight = "285px";
            $scope.showRightSideNav = true;
            /*getAllRealTimeTimer = $timeout(getAllRealTime, 1000);*/

        }
        else {
            document.getElementById("mySidenav").style.width = "0";
            //document.getElementById("main").style.marginRight = "0";
            /*if (getAllRealTimeTimer) {
             $timeout.cancel(getAllRealTimeTimer);
             }*/
            $scope.showRightSideNav = false;
        }
        $scope.isUserListOpen = !$scope.isUserListOpen;
        $scope.onClickGetHeight();

        //document.getElementById("main").style.marginRight = "285px";
        // document.getElementById("navBar").style.marginRight = "300px";
    };
    /* Set the width of the side navigation to 0 */
    $scope.closeNav = function () {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginRight = "0";
    };

    $scope.notification_levels = ["low", "normal", "urgent"];
    $scope.notificationMsg.level = "low";

    $scope.sendNotification = function () {
        if ($scope.naviSelectedUser) {
            $scope.notificationMsg.From = $scope.userName;
            $scope.notificationMsg.Direction = "STATELESS";
            $scope.isSendingNotifi = true;
            if ($scope.naviSelectedUser.listType === "Group") {

                userProfileApiAccess.getGroupMembers($scope.naviSelectedUser._id).then(function (response) {
                    if (response.IsSuccess) {
                        if (response.Result) {
                            var clients = [];
                            for (var i = 0; i < response.Result.length; i++) {
                                var gUser = response.Result[i];
                                //if (gUser && gUser.username && gUser.username != $scope.loginName) {
                                clients.push(gUser.username);
                                //}
                            }
                            $scope.notificationMsg.clients = clients;
                            $scope.notificationMsg.isPersist = true;
                            notifiSenderService.broadcastNotification($scope.notificationMsg).then(function (response) {
                                $scope.notificationMsg = {};
                                $scope.notificationMsg.level = "low";
                                console.log("send notification success :: " + JSON.stringify(clients));
                            }, function (err) {
                                var errMsg = "Send Notification Failed";
                                if (err.statusText) {
                                    errMsg = err.statusText;
                                }
                                $scope.showAlert('Error', 'error', errMsg);
                            });
                        } else {
                            $scope.showAlert('Error', 'error', "Send Notification Failed");
                        }
                    }
                    else {
                        console.log("Error in loading Group member list");
                        $scope.showAlert('Error', 'error', "Send Notification Failed");
                    }
                    $scope.isSendingNotifi = false;
                }, function (err) {
                    console.log("Error in loading Group member list ", err);
                    $scope.showAlert('Error', 'error', "Send Notification Failed");
                });
            } else {
                $scope.notificationMsg.To = $scope.naviSelectedUser.username;
                $scope.notificationMsg.isPersist = true;
                $scope.notificationMsg.eventlevel = $scope.notification_level;
                notifiSenderService.sendNotification($scope.notificationMsg, "message", "", $scope.notificationMsg.level).then(function (response) {
                    console.log("send notification success :: " + $scope.notificationMsg.To);
                    $scope.notificationMsg = {};
                    $scope.notificationMsg.level = "low";
                    //$scope.notification_level = "low";
                }, function (err) {
                    loginService.IsCheckResponse(err);
                    var errMsg = "Send Notification Failed";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                });
            }
            $scope.isSendingNotifi = false;

        } else {
            //$scope.showAlert('Error', 'error', "Send Notification Failed");
            $scope.notificationMsg.eventlevel = $scope.notification_level;
            $scope.notificationMsg.From = $scope.userName;
            $scope.notificationMsg.Direction = "STATELESS";
            $scope.notificationMsg.isPersist = false;
            $scope.isSendingNotifi = true;

            notifiSenderService.sendNotification($scope.notificationMsg, "message", "", $scope.notificationMsg.level).then(function (response) {
                //console.log("send notification success :: " + $scope.notificationMsg.To);
                $scope.notificationMsg = {};
                $scope.notificationMsg.level = "low";
                //$scope.notification_level = "low";
            }, function (err) {
                loginService.IsCheckResponse(err);
                var errMsg = "Send Notification Failed";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        }
    };


    $scope.usersToNotify = [];

    $scope.checkUser = function ($event, agent) {

        if ($event.target.checked) {
            if ($scope.usersToNotify.indexOf(agent.username) == -1) {
                $scope.usersToNotify.push(agent.username);
            }

        }
        else {
            if ($scope.usersToNotify.indexOf(agent.username) == -1) {
                $scope.usersToNotify.splice($scope.usersToNotify.indexOf(agent.username), 1);
            }
        }
    };


    $scope.isInviteModal = false;

    $scope.showNotificationMessage = function (notifyMessage,msgType) {

        if(msgType=="invite")
        {
            $scope.isInviteModal = true;
        }
        else
        {
            $scope.showMesssageModal = true;
        }


        $scope.showModal(notifyMessage);


        //$scope.showAlert("Message","success",notifyMessage.Message);
    };


    $scope.discardNotifications = function (notifyMessage) {
        /*$scope.newNotifications.splice($scope.newNotifications.indexOf(notifyMessage), 1);
         $scope.unredNotifications = $scope.newNotifications.length;*/

        $scope.showConfirmation("Remove notifications", "Do you want to remove this Notifications ?", "Ok", function () {
            if (notifyMessage.isPersist && notifyMessage.PersistMessageID) {
                notifiSenderService.RemovePersistenceMessage(notifyMessage.PersistMessageID).then(function (response) {
                    $scope.newNotifications.splice($scope.newNotifications.indexOf(notifyMessage), 1);
                    $scope.unredNotifications = $scope.newNotifications.length;
                    $scope.showMesssageModal = false;
                    $scope.showAlert("Notification Deleted", "success", "Notification deleted successfully");

                }, function (error) {
                    $scope.showAlert("Error", "error", "Error in deleting notification");
                    $scope.showMesssageModal = false;
                });
            }
            else {
                $scope.showAlert("Notification Deleted", "success", "Notification deleted successfully");
                $scope.newNotifications.splice($scope.newNotifications.indexOf(notifyMessage), 1);
                $scope.unredNotifications = $scope.newNotifications.length;
                $scope.showMesssageModal = false;
            }
        }, function () {

        });


    };

    $scope.showModal = function (MessageObj) {
        //modal show
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/notification-sender/messageModal.html',
            controller: 'notificationModalController',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                MessageObj: function () {
                    return MessageObj;
                },
                DiscardNotifications: function () {
                    return $scope.discardNotifications;
                },
                acceptInvitation : function()
                {
                    return $scope.acceptInvitation;
                },
                rejectInvitation : function()
                {
                    return $scope.rejectInvitation;
                },
                cancelInvitation : function()
                {
                    return $scope.cancelInvitation;
                }

            }
        });
    };
    $scope.showInviteModal = function (MessageObj) {
        //modal show
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/notification-details.html',
            controller: 'notificationModalController',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                MessageObj: function () {
                    return MessageObj;
                },
                DiscardNotifications: function () {
                    return $scope.discardNotifications;
                }
            }
        });
    };

    //Detect Document Height
    //update code damith
    $(document).ready(function () {
        // moment.lang("fr"); // Set current local to French
        window.onload = function () {
            $scope.windowHeight = jsUpdateSize() - 100 + "px";
            document.getElementById('onlineUserWraper').style.height = $scope.windowHeight;

            //slide menu height set daynamically
            $scope.windowMenuHeight = jsUpdateSize() - 120 + "px";
            document.getElementById('sidebar-menu').style.height = $scope.windowMenuHeight;
        };

        window.onresize = function () {
            $scope.windowHeight = jsUpdateSize() - 100 + "px";
            document.getElementById('onlineUserWraper').style.height = $scope.windowHeight;

            //slide menu height set daynamically
            $scope.windowMenuHeight = jsUpdateSize() - 120 + "px";
            document.getElementById('sidebar-menu').style.height = $scope.windowMenuHeight;
        };
    });

    $scope.onClickGetHeight = function () {
        $scope.windowHeight = jsUpdateSize() - 100 + "px";
        document.getElementById('onlineUserWraper').style.height = $scope.windowHeight;
    };


    //Get user image list
    //
    userImageList.getAllUsers(function (res) {
        if (res) {
            userImageList.getAvatarByUserName($scope.userName, function (res) {
                $scope.profileAvatat = res;
            });
        }
    });


    /*   //toggle menu option
     //text function
     var CURRENT_URL = window.location.href.split("?")[0], $BODY = $("body"), $MENU_TOGGLE = $("#menu_toggle"), $SIDEBAR_MENU = $("#sidebar-menu"),
     $SIDEBAR_FOOTER = $(".sidebar-footer"), $LEFT_COL = $(".left_col"), $RIGHT_COL = $(".right_col"), $NAV_MENU = $(".nav_menu"), $FOOTER = $("footer");

     // TODO: This is some kind of easy fix, maybe we can improve this
     var setContentHeight = function () {
     // reset height
     $RIGHT_COL.css('min-height', $(window).height());

     var bodyHeight = $BODY.outerHeight(),
     footerHeight = $BODY.hasClass('footer_fixed') ? 0 : $FOOTER.height(),
     leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
     contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

     // normalize content
     contentHeight -= $NAV_MENU.height() + footerHeight;

     $RIGHT_COL.css('min-height', contentHeight);
     };


     $SIDEBAR_MENU.find('a').on('click', function (ev) {
     $('.child_menu li').removeClass('active');
     var $li = $(this).parent();
     if ($li.is('.active')) {
     $li.removeClass('active');
     $('ul:first', $li).slideUp(function () {
     setContentHeight();
     });
     } else {
     // prevent closing menu if we are on child menu
     if (!$li.parent().is('.child_menu')) {
     $SIDEBAR_MENU.find('li').removeClass('active');
     $SIDEBAR_MENU.find('li ul').slideUp();
     }

     $li.addClass('active');

     $('ul:first', $li).slideDown(function () {
     setContentHeight();
     });
     }

     //slide menu height set daynamically
     $scope.windowMenuHeight = jsUpdateSize() - 120 + "px";
     document.getElementById('sidebar-menu').style.height = $scope.windowMenuHeight;
     });
     // toggle small or large menu
     $MENU_TOGGLE.on('click', function () {
     if ($BODY.hasClass('nav-md')) {
     $BODY.removeClass('nav-md').addClass('nav-sm');

     $('.d-top-h').removeClass('d1-header-lg').addClass('d1-header-wrp-sm');

     if ($SIDEBAR_MENU.find('li').hasClass('active')) {
     $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
     }
     } else {
     $BODY.removeClass('nav-sm').addClass('nav-md');

     $('.d-top-h').removeClass('d1-header-wrp-sm').addClass('d1-header-lg');


     if ($SIDEBAR_MENU.find('li').hasClass('active-sm')) {
     $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
     }
     }
     // setContentHeight();


     });

     */
    // Sidebar
    var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
        $BODY = $('body'),
        $MENU_TOGGLE = $('.menu_toggle'),
        $SIDEBAR_MENU = $('#sidebar-menu'),
        $SIDEBAR_FOOTER = $('.sidebar-footer'),
        $LEFT_COL = $('.left_col'),
        $RIGHT_COL = $('.right_col'),
        $NAV_MENU = $('.nav_menu'),
        $FOOTER = $('footer');


    $(document).ready(function () {
        // TODO: This is some kind of easy fix, maybe we can improve this
        var setContentHeight = function () {
            // reset height
            $RIGHT_COL.css('min-height', $(window).height());

            var bodyHeight = $BODY.outerHeight(),
                footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
                leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

            // normalize content
            contentHeight -= $NAV_MENU.height() + footerHeight;

            $RIGHT_COL.css('min-height', contentHeight);
        };

        var oldItem = undefined;
        $SIDEBAR_MENU.find('a').on('click', function (ev) {

            var $li = $(this).parent();
            if (oldItem) {
                oldItem.addClass('activet');
            }

            if ($li.is('.active')) {
                $li.removeClass('active');
                $li.removeClass('active-sm');
                $li.removeClass('activet');
                $('ul:first', $li).slideUp(function () {
                    setContentHeight();
                });
                if ($li.context.text != oldItem.context.text && ($li.closest("li").children("ul").length == 0)) {
                    $li.addClass('active');
                }
            } else {
                // prevent closing menu if we are on child menu
                var sibs = $li.siblings('.active');
                var sibschild = sibs.find('.active');
                sibs.removeClass('active');
                sibs.removeClass('activet');
                if (sibschild != undefined) {
                    sibschild.removeClass('active');
                    sibschild.removeClass('activet');
                }
                // if(as!=undefined)
                // 	var elems = $li.find('a').siblings('.active');
                if (!$li.parent().is('.child_menu')) {
                    $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                    $SIDEBAR_MENU.find('li ul').slideUp();
                }

                $li.addClass('active');

                $('ul:first', $li).slideDown(function () {
                    setContentHeight();
                });
            }
            oldItem = $li;
            //slide menu height set daynamically
            $scope.windowMenuHeight = jsUpdateSize() - 100 + "px";
            document.getElementById('sidebar-menu').style.height = $scope.windowMenuHeight;
        });

        // toggle small or large menu
        $MENU_TOGGLE.on('click', function () {
            if ($BODY.hasClass('nav-md')) {
                $SIDEBAR_MENU.find('li.active ul').hide();
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                $('#menu_toggle2').hide();
                $('#menu_toggle').show();
            } else {
                $SIDEBAR_MENU.find('li.active-sm ul').show();
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
                $('#menu_toggle').hide();
                $('#menu_toggle2').show();
            }

            $BODY.toggleClass('nav-md nav-sm');

            setContentHeight();
        });

        // check active menu
        $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

        $SIDEBAR_MENU.find('a').filter(function () {
            return this.href == CURRENT_URL;
        }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
            setContentHeight();
        }).parent().addClass('active');

        // recompute content when resizing
        $(window).smartresize(function () {
            setContentHeight();
        });

        setContentHeight();

        // fixed sidebar
        if ($.fn.mCustomScrollbar) {
            $('.menu_fixed').mCustomScrollbar({
                autoHideScrollbar: true,
                theme: 'minimal',
                mouseWheel: { preventDefault: true }
            });
        }
    });
    // /Sidebar


    /** Kasun_Wijeratne_14_FEB_2018
     * --------------------------------------------------------------------------
     * GUIDE FOR FRESH USERS
     * Functionality of Fresh User Guide panel appears on the very first Login.*/
    $scope.freshUserConfigStep = 0;
    $rootScope.userGuideMin = false;
    $rootScope.toggleFreshUserGuide = function () {
        $rootScope.freshUser = !$rootScope.freshUser;
    };
    $scope.rotateFreshUserGuide = function (direction) {
        if (direction == 'forward') {
            $scope.freshUserConfigStep++;
        } else if (direction == 'backward' && $scope.freshUserConfigStep != 0) {
            $scope.freshUserConfigStep--;
        }
    };
    $scope.minMaxFreshUserConfig = function () {
        $rootScope.userGuideMin = !$rootScope.userGuideMin;
    };

    /** GUIDE FOR ALL USERS
     * Functionality for the Guide panel of all users appears after the main configuration is done.*/
    $rootScope.userGuide = {};
    $scope.userGuideStep = 0;
    $scope.$watch(function () {
        $rootScope.$statecurrent = $state.current.name.split('.')[1];
    });
    $http.get('assets/js/userguide.json').then(function (res) {
        $rootScope.userGuide = res.data.secondaryguide;
        var b = $rootScope.userGuide[$rootScope.$statecurrent];
    }, function (errorres) {
        debugger;
    });

    $scope.activeGuide = {};
    $scope.rotateAllUserGuide = function (direction) {
        if (direction == 'forward') {
            $scope.userGuideStep++;
        } else if (direction == 'backward' && $scope.userGuideStep != 0) {
            $scope.userGuideStep--;
        }
    };
    /** -------------------------------------------------------------------------
     /*Kasun_Wijeratne_14_FEB_2018*/


});

mainApp.controller("notificationModalController", function ($scope, $uibModalInstance, MessageObj, DiscardNotifications,acceptInvitation,rejectInvitation,cancelInvitation) {


    $scope.MessageObj = MessageObj;

    if($scope.MessageObj.messageType=='invitation')
    {
        $scope.isInviteModal= true;
    }
    else
    {
        $scope.showMesssageModal = true;
    }




    $scope.keepNotification = function () {
        $uibModalInstance.dismiss('cancel');
    }
    $scope.discardNotification = function (msgObj) {
        DiscardNotifications(msgObj);
        $uibModalInstance.dismiss('cancel');
    }
    $scope.addToTodo = function () {

    }
    $scope.acceptInvitation = function (msgObj) {
        acceptInvitation(msgObj);
        $uibModalInstance.dismiss('cancel');
    }
    $scope.rejectInvitation = function (msgObj) {
        rejectInvitation(msgObj);
        $uibModalInstance.dismiss('cancel');
    }
    $scope.cancelInvitation = function (msgObj) {
        //cancelInvitation(msgObj);
        $uibModalInstance.dismiss('cancel');
    }


});
