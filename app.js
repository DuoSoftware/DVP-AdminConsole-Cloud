/**
 * Created by Veery Team on 5/27/2016.
 */


var mainApp = angular.module('veeryConsoleApp', ['ngAnimate', 'ngMessages', 'ui.bootstrap',
    'ui.router', 'ui.checkbox', 'angular-flot',
    'resourceProductivityServiceModule', 'ngTagsInput', 'jlareau.pnotify',
    'easypiechart', 'mgcrea.ngStrap', 'angular.filter', 'fileServiceModule', 'angularFileUpload', 'download',
    'ngMessages', 'ngAudio', 'bw.paging', 'ngDragDrop', 'ui.knob', 'ui-rangeSlider',
    'AngularBootstrapTree',
    'jkuri.slimscroll',
    'base64',
    'dndLists',
    'angular-jwt',
    'angular-sly',
    'LocalStorageModule',
    'ngSanitize',
    'ngCsv',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster', 'ui.bootstrap.datetimepicker', 'angularBootstrapNavTree', 'ui.bootstrap.accordion', 'yaru22.angular-timeago',
    'ui.bootstrap.pagination',
    'ui.grid', 'ui.grid.grouping', 'ui.grid.importer','ui.grid.edit',
    'mgcrea.ngStrap',
    'btford.socket-io',
    'veeryNotificationMod', 'stripe-payment-tools',
    'datatables',
    'satellizer',
    'checklist-model',
    'vcRecaptcha',
    'angucomplete-alt',
    'angular-cron-jobs',
    'jsplumb',
    'ui.slimscroll',
    'ngImgCrop',
    'ngNumberPicker',
    'ui.calendar',
    'webcam',
    "chart.js",
    'schemaForm',
    'angular-timezone-selector',
    'ds.objectDiff',
    'ui.grid.selection',
    'ngFileSaver',
    'timer',
    'as.sortable',
    'cp.ngConfirm',
    'uiSwitch',
    'ui.grid.pinning',
    'ui.grid.autoResize',
    'ui.grid.exporter',
    'ui.grid.resizeColumns',
    'ui.grid.resizeColumns',
    'ui.grid.selection',
    'ui.grid.moveColumns',
    'ui.grid.infiniteScroll',
    'ui.grid.grouping',
    'ngWizard',
    'gantt',
    'angularMoment',
    'gantt.table',
    'gantt.labels',
    'gantt.tooltips',
    'gantt.sortable',
    'gantt.resizeSensor',
    'gantt.dependencies',
    'angular-progress-arc',
    'ui.tab.scroll','ui.select',
    'textAngular'

]).value('froalaConfig', {
    toolbarInline: false,
    placeholderText: 'Enter Text Here'
});

mainApp.constant('appVersion', {
    version: 'v3.0.0.8'
});
mainApp.constant('moment', moment);
mainApp.run(['$anchorScroll', function ($anchorScroll) {
    $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}]);

app.run(function ($rootScope) {
    $rootScope.keys = Object.keys;
});

mainApp.config(function (scrollableTabsetConfigProvider) {
    scrollableTabsetConfigProvider.setShowTooltips(true);
    scrollableTabsetConfigProvider.setTooltipLeftPlacement('bottom');
    scrollableTabsetConfigProvider.setTooltipRightPlacement('left');
});
//resourceservice.app.veery.cloud
var baseUrls = {
    'UserServiceBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',//'http:////resourceservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'packagingServiceBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',//http://packagingservice.facetone.space/DVP/API/1.0.0.0/
    'organizationServiceBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/', //http://organizationservice.facetone.space/DVP/API/1.0.0.0/
    'userGroupServiceBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'externalUserServiceBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'authServiceBaseUrl': 'https://app.facetone.com:1443/', //http://authservice.facetone.space/oauth/
    //'authProviderUrl': 'http://authservice.facetone.space/',

    'monitorrestapi': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/MonitorRestAPI/',//http://monitorrestapi.app1.veery.cloud/DVP
    'resourceServiceBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/ResourceManager/',//resourceservice.app1.veery.cloud
    'productivityServiceBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/ResourceManager/',
    'ardsmonitoringBaseUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/ARDS/',//ardsmonitoring.app1.veery.cloud
    'fileServiceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/FileService/',
    'fileServiceInternalUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/InternalFileService/',
    'clusterconfigUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/CloudConfiguration/',//clusterconfig.app1.veery.cloud
    'conferenceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'sipUserendpoint': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/', //sipuserendpointservice.app1.veery.cloud
    'pbxUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/PBXService/',
    'ticketUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',//http://liteticket.app1.veery.cloud/DVP/API/1.0.0.0/',
    'dashBordUrl': 'https://app.facetone.com:1443/',
    'autoattendantUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'TrunkServiceURL': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'socialConnectorUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/Social/', //104.236.197.119
    'mailSenderUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/Social/', //104.236.197.119
    'notification': 'https://app.facetone.com:1443/',//notificationservice.app1.veery.cloud
    'cdrProcessor': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/CallCDR/', //cdrprocessor.app1.veery.cloud
    'scheduleWorker': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'qaModule': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/QAModule/',
    'limitHandlerUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'templatesUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'ardsLiteServiceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'ruleServiceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'appregistryServiceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'queuemusicServiceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'voxboneApiUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/voxbone/',//voxboneapi.app1.veery.cloud
    'twilioApiUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/twilio/',
    'eventserviceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',//eventservice.app1.veery.cloud
    'walletUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/PaymentManager/',//104.236.197.119
    'cSatUrl': 'https://app.facetone.com:1443/DVP/API/1.0/',  //csatservice.app1.veery.cloud
    'campaignmanagerUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/CampaignManager/', //campaignmanager.app1.veery.cloud
    'softPhoneContactUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/ContactManager/',
    'dialerAPIUrl': 'https://app.facetone.com:1443/DVP/DialerAPI/',
    'zohoAPIUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',//crmintegrations.app1.veery.cloud,
    'ipMessageURL': 'https://app.facetone.com:90/',
    'agentDialerURL': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/AgentDialer/', //agentdialerservice.app1.veery.cloud
    'integrationapi': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/IntegrationAPI/', //integrationapi.app1.veery.cloud
    'reportQueryFilterUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/ReportQueryFilter/',//reportqueryfilters.app.veery.cloud
    'contactUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/ContactManager/', //contacts.app1.veery.cloud
    'botAPIUrl': 'https://smoothbotservices.plus.smoothflow.io/DBF/API/1.0.0.0/BotService/',//Bot API URL
    'botplatformUrl': 'https://smoothbot.plus.smoothflow.io/fb/DBF/API/v1/platform/',//Bot Platform URL
    'templateAPIUrl': 'https://smoothbotservices.plus.smoothflow.io/DBF/API/1.0.0.0/ViewService/',//View service API URL
    'integrationAPIUrl': "https://smoothbotservices.plus.smoothflow.io/DBF/API/v1/IntegrationService/",//Integration service API URL
    'payapiUrl': "https://smoothflow.io/payapi/getWorkflowData/",
    'setupaiAPTUrl': "https://smoothbotservices.plus.smoothflow.io/DBF/API/1.0.0.0/AiMap",
    'getworkflowfortextAPIUrl': "https://smoothbotservices.plus.smoothflow.io/DBF/API/1.0.0.0/GetWorkflowForText",
    'botFrameworkFacebookConnector': "https://smoothbot.plus.smoothflow.io/fb",
    'uploadFilesinCardTemplate': "https://smoothmediaservice.plus.smoothflow.io/media/1/103/upload",
    'getallMediaFilesAPIUrl': "https://smoothbotservices.plus.smoothflow.io/DBF/API/v1/UploadFileService/UploadFiles",
    'botentitiesAPIUrl': "https://smoothbotservices.plus.smoothflow.io/DBF/API/1.0.0.0/EntityMap",
    'chatbotupdateentitityAPIUrl': "https://smoothbotservices.plus.smoothflow.io/DBF/API/1.0.0.0/BotEntity",
    'chatbotContextAPIUrl': "https://smoothbotservices.plus.smoothflow.io/DBF/API/1.0.0.0/ContextMap",
    'articleServiceUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/',
    'contactbasednumberUrl': 'https://app.facetone.com:1443/DVP/API/1.0.0.0/Campaign/', //contactbasednumberdialingservice.app.veery.cloud
    'interactionServiceURL': 'http://localhost:3637/DVP/API/1.0.0.0/'
};

mainApp.constant('baseUrls', baseUrls);
mainApp.constant('turnServers', [{url: "stun:stun.l.google.com:19302"}, {url: "stun:stun.counterpath.net:3478"}, {url: "stun:numb.viagenie.ca:3478"}]);
mainApp.constant('redctUrls', {admin:'http://localhost/DVP-AdminConsole' ,agent:'http://localhost/DVP-AgentConsole'});


var applicationConfig = {
    'captchaEnable': false,
    'repMaxDateRangeHourlyBand': 30,
    'repMaxDateRangeAgentProd': 1
};
mainApp.constant('applicationConfig', applicationConfig);


mainApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider", "$authProvider", "vcRecaptchaServiceProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider, $authProvider, vcRecaptchaServiceProvider) {

        var authProviderUrl = 'https://app.facetone.com:1443/auth/';
        //var authProviderUrl = 'http://192.168.0.132:3637/auth/';
        vcRecaptchaServiceProvider.setSiteKey('6LezaAsUAAAAAMbVGpjJPNm86i__8a38YO1rtXEI');

        //http://userservice.app1.veery.cloud/
        //var authProviderUrl = 'http:192.168.1.16:3637/';
        $urlRouterProvider.otherwise('/company');

        /////////////////////////////////////////////////////////


        $authProvider.loginUrl = authProviderUrl + 'login';
        $authProvider.signupUrl = authProviderUrl + 'signup';
        $authProvider.invitationSignupUrl = authProviderUrl + 'inviteSignup';


        $authProvider.facebook({
            url: authProviderUrl + 'facebook',
            clientId: '1237176756312189',
            redirectUri: window.location.origin+'/DVP-AdminConsole/index.html'
            //responseType: 'token'
        });

        $authProvider.google({
            url: authProviderUrl + 'google',
            clientId: '260058487091-ko7gcp33dijq6e3b8omgbg1f1nfh2nsk.apps.googleusercontent.com',
            redirectUri: window.location.origin+'/DVP-AdminConsole/index.html'
        });

        $authProvider.github({
            url: authProviderUrl + 'github',
            clientId: 'f725eae279e6727c68c7',
            redirectUri: window.location.origin+'/DVP-AdminConsole/index.html'
        });

        $authProvider.linkedin({
            clientId: 'LinkedIn Client ID'
        });

        $authProvider.instagram({
            clientId: 'Instagram Client ID'
        });

        $authProvider.yahoo({
            clientId: 'Yahoo Client ID / Consumer Key'
        });

        $authProvider.live({
            clientId: 'Microsoft Client ID'
        });

        $authProvider.twitch({
            clientId: 'Twitch Client ID'
        });

        $authProvider.bitbucket({
            clientId: 'Bitbucket Client ID'
        });

        $authProvider.spotify({
            clientId: 'Spotify Client ID'
        });

        // No additional setup required for Twitter

        $authProvider.oauth2({
            name: 'foursquare',
            url: '/auth/foursquare',
            clientId: 'Foursquare Client ID',
            redirectUri: window.location.origin,
            authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
        });

        ///////////////////////////////////////////////////////////////////////////////
        $stateProvider.state("console", {
            url: "/console",
            templateUrl: "views/main-home.html",
            data: {
                requireLogin: true
            }
        }).state('console.dashboard', {
            url: "/dashboard",
            controller: "dashboardCtrl",
            templateUrl: "views/dashboard/dashboardContactCenter.html",
            data: {
                requireLogin: true,
                navigation: "DASHBOARD"

            }
        }).state('console.facebook', {
            url: "/social/facebook",
            templateUrl: "socialConnectors/views/socialFbConnector.html",
            controller: "socialFbConnectorController",
            data: {
                requireLogin: true,
                navigation: "FACEBOOK"
            }
        }).state('console.twitter', {
            url: "/social/twitter",
            templateUrl: "socialConnectors/views/socialTwitterConnector.html",
            controller: "socialTwitterConnectorController",
            data: {
                requireLogin: true,
                navigation: "TWITTER"
            }
        }).state('console.email', {
            url: "/social/email",
            templateUrl: "socialConnectors/views/emailConnector.html",
            controller: "emailConnectorController",
            data: {
                requireLogin: true,
                navigation: "EMAIL"
            }
        }).state('console.productivity', {
            url: "/productivity",
            templateUrl: "agent_productivity/view/agentProductivity.html",
            data: {
                requireLogin: true,
                navigation: "AGENT_PRODUCTIVITY"
            }
        }).state('console.detailsdashboard', {
            url: "/detailsdashboard",
            templateUrl: "detailsDashBoard/view/detailsDashboard.html",
            controller: "detailsDashBoardController",
            data: {
                requireLogin: true,
                navigation: "DASHBOARD"
            }
        })/*.state('console.campaigndashboard', {
            url: "/campaigndashboard",
            templateUrl: "campaignManager/view/realtime/real_time_campaign_monitor.html",
            controller: "campaign_real_time_monitor_controller",
            data: {
                requireLogin: true,
                navigation: "DASHBOARD"
            }
        })*/.state('console.campaignsdashboard', {
            url: "/campaignsdashboard",
            templateUrl: "campaignManager/view/realtime/real_time_campaigns_monitor.html",
            controller: "campaigns_real_time_monitor_controller",
            data: {
                requireLogin: true,
                navigation: "DASHBOARD"
            }
        }).state("console.campaigndashboard", {
            url: "/campaignsdashboard/:campaignname/:campaignid",
            templateUrl: "campaignManager/view/realtime/real_time_campaign_monitor.html",
            controller: "campaign_real_time_monitor_controller",
            data: {
                requireLogin: true,
                navigation: "DASHBOARD"
            }
        }).state('console.filegallery', {
            url: "/filegallery",
            templateUrl: "file_gallery/view/fileList.html",
            controller: "FileListController",
            data: {
                requireLogin: true,
                navigation: "FILE_GALLERY"
            }
        }).state('console.fileupload', {
            url: "/fileupload",
            templateUrl: "file_gallery/view/fileAdd.html",
            controller: "FileEditController",
            data: {
                requireLogin: true,
                navigation: "FILE_UPLOAD"
            }
        }).state('console.attributes', {
            url: "/attributes",
            templateUrl: "attribute_application/partials/attributeList.html",
            controller: "attributeListController",
            data: {
                requireLogin: true,
                navigation: "ATTRIBUTES"
            }
        }).state('console.resources', {
            url: "/resources",
            templateUrl: "resource_application/partials/resourceList.html",
            controller: "resourceController",
            data: {
                requireLogin: true,
                navigation: "RESOURCES"
            }
        }).state('console.AgentStatus', {
            url: "/AgentStatus",
            templateUrl: "agent_status/view/agentStatusList.html",
            controller: "agentStatusController",
            data: {
                requireLogin: true,
                navigation: "AGENTSTATUSEVENT"
            }
        }).state('console.AgentDialer', {
            url: "/AgentDialer",
            templateUrl: "agent_dialer/views/agentDialer.html",
            controller: "agentDialerController",
            data: {
                requireLogin: true,
                navigation: "FILE_GALLERY"
            }
        }).state('console.AgentDialerDetails', {
            url: "/AgentDialerDetails",
            templateUrl: "agent_dialer/views/agentDialerDetails.html",
            controller: "agentDialerDetailsController",
            data: {
                requireLogin: true,
                navigation: "FILE_GALLERY"
            }
        }).state('console.AgentDialerSummary', {
            url: "/AgentDialerSummary",
            templateUrl: "agent_dialer/views/agentDialerSummary.html",
            controller: "agentDialerSummaryController",
            data: {
                requireLogin: true,
                navigation: "FILE_GALLERY"
            }
        }).state('console.CampaignCallSummary', {
            url: "/CampaignCallSummary",
            templateUrl: "views/cdr/campaignCallSummary.html",
            controller: "campaignCallSummaryController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_SUMMARY_REPORT"
            }
        }).state('console.AgentDialerAgentWiseSummary', {
            url: "/AgentDialerAgentWiseSummary",
            templateUrl: "agent_dialer/views/agentDialerAgentSummary.html",
            controller: "agentDialerAgentSummaryController",
            data: {
                requireLogin: true,
                navigation: "FILE_GALLERY"
            }
        }).state('console.FormDesign', {
            url: "/FormDesign",
            templateUrl: "dynamicForm/view/formDesign.html",
            controller: "FormBuilderCtrl",
            data: {
                requireLogin: true,
                navigation: "DYNAMICFORM"
            }
        }).state('console.reportMail', {
            url: "/ReportMail",
            templateUrl: "views/reportEmailConfig/reportEmailConfig.html",
            controller: "emailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "REPORT_EMAIL_CONFIG"
            }
        }).state('console.auditTrailRep', {
            url: "/AuditTrailReport",
            templateUrl: "views/auditTrail/auditTrailReport.html",
            controller: "auditTrailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "AUDITTRAIL"
            }
        }).state('console.qaRatingFormBuilder', {
            url: "/QAFormBuilder",
            templateUrl: "views/qaRating/questionFormDesigner.html",
            controller: "qaRatingCtrl",
            data: {
                requireLogin: true,
                navigation: "QA_FORM_DESIGNER"
            }
        }).state('console.smsdetailreport', {
            url: "/SMSDetailReport",
            templateUrl: "views/sms/smsDetailReport.html",
            controller: "smsDetailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "SMS_DETAIL_REPORT"
            }
        }).state('console.emaildetailreport', {
            url: "/EmailDetailReport",
            templateUrl: "views/emailReport/emailDetailReport.html",
            controller: "emailDetailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "USERDETAIL"
            }
        }).state('console.chatreport', {
            url: "/ChatReport",
            templateUrl: "views/chatReport/chatReport.html",
            controller: "chatReportCtrl",
            data: {
                requireLogin: true,
                navigation: "USERDETAIL"
            }
        }).state('console.qaSubmission', {
            url: "/QAFormSubmission",
            templateUrl: "views/qaPaperSubmission/qaPaperSubmission.html",
            controller: "qaSubmissionCtrl",
            data: {
                requireLogin: true,
                navigation: "QA_FORM_SUBMISSION"
            }
        }).state('console.AgentProfileSummary', {
            url: "/AgentProfileSummary",
            templateUrl: "agent_status/view/agentProfileStatus.html",
            controller: "AgentSummaryController",
            data: {
                requireLogin: true,
                navigation: "AGENT_SUMMARY"
            }
        }).state("console.applicationAccessManager", {
            url: "/applicationAccessManager/:username/:role",
            templateUrl: "application_access_management/view/appAccessManage.html",
            data: {
                requireLogin: true,
                navigation: "USERS"
            }
        }).state('login', {
            url: "/login/:company",
            templateUrl: "auth/login.html",
            data: {
                requireLogin: false

            }
        }).state('company', {
            url: "/company",
            templateUrl: "auth/company-name.html",
            data: {
                requireLogin: false

            }
        }).state('invitaionsuignup', {
            url: "/invitationSignUp",
            templateUrl: "auth/first-login-password.html",
            data: {
                requireLogin: false

            }
        }).state('signUp', {
            url: "/signUp/:company",
            templateUrl: "auth/signUp.html",
            data: {
                requireLogin: false
            }
        }).state('ResetPw', {
            url: "/resetPassword",
            templateUrl: "auth/resetPassword.html",
            data: {
                requireLogin: false
            }
        }).state("Reset", {
            url: "/reset/:token",
            templateUrl: "auth/reEnterPassword.html",
            data: {
                requireLogin: false
            }
        }).state("Activate", {
            url: "/activate/:token",
            templateUrl: "auth/activateAccount.html",
            data: {
                requireLogin: false
            }
        }).state('pricing', {
            url: "/pricing",
            templateUrl: "auth/pricing.html",
            data: {
                requireLogin: false
            }
        }).state('console.pricing', {
            url: "/Packages",
            templateUrl: "auth/pricing.html",
            data: {
                requireLogin: true,
                navigation: "PACKAGE_MANAGER"
            }
        }).state('console.credit', {
            url: "/Credit",
            templateUrl: "auth/Credit/buyCredit.html",
            controller: "creditController",
            data: {
                requireLogin: true,
                navigation: "CREDIT_MANAGER"
            }
        }).state("console.cdr", {
            url: "/cdr",
            templateUrl: "views/cdr/call-cdr.html",
            data: {
                requireLogin: true,
                navigation: "CDR"

            }
        }).state("console.myNumbers", {
            url: "/myNumbers",
            templateUrl: "views/mynumbers/myNumbers.html",
            controller: "myNumbersCtrl",
            data: {
                requireLogin: true,
                navigation: "MY_NUMBERS"
            }
        }).state("console.sipuser", {
            url: "/sipuser",
            templateUrl: "views/sipuser/sipuser.html",
            controller: "sipUserCtrl",

            data: {
                requireLogin: true,
                navigation: "SIPUSER_CONFIGURATION"
            }

        }).state("console.userprofile", {
            url: "/userprofile/:username",
            templateUrl: "views/userprofile/userprofile.html",
            data: {
                requireLogin: true,
                navigation: "PROFILE"

            }
        }).state("console.users", {
            url: "/users",
            templateUrl: "views/user/userList.html",
            controller: "userListCtrl",
            data: {
                requireLogin: true,
                navigation: "USERS"
            }
        }).state("console.pbxuser", {
            url: "/pbxuser",
            templateUrl: "views/pbxuser/pbxuser.html",
            controller: "pbxCtrl",
            data: {
                requireLogin: true,
                navigation: "PABX_USER"
            }
        }).state("console.pbxadmin", {
            url: "/pbxadmin",
            templateUrl: "views/pabxAdmin/pabxCompanyConfig.html",
            controller: "pbxAdminCtrl",
            data: {
                requireLogin: true,
                navigation: "PABX_ADMIN"
            }
        }).state("console.autoattendance", {
            url: "/autoattendance",
            templateUrl: "views/auto-attendance/autoAttendanceList.html",
            controller: "autoattendancelistcontroller",
            data: {
                requireLogin: true,
                navigation: "AUTOATTENDANCE"
            }
        }).state('console.newautoattendance', {
            url: "/autoattendance/new",
            templateUrl: "views/auto-attendance/newAutoAttendance.html",
            controller: "newautoattendancecontroller",
            data: {
                requireLogin: true,
                navigation: "AUTOATTENDANCE"
            }
        }).state('console.editautoattendance', {
            url: "/autoattendance/edit",
            templateUrl: "views/auto-attendance/editAutoAttendance.html",
            controller: "editautoattendancecontroller",
            params: {
                aa: null
            },
            data: {
                requireLogin: true,
                navigation: "AUTOATTENDANCE"
            }
        }).state("console.ringGroup", {
            url: "/ringGroup",
            templateUrl: "views/ringGroup/ringGroup.html",
            controller: "ringGroupCtrl",
            data: {
                requireLogin: true,
                navigation: "RING_GROUP_CONFIGURATION"
            }
        }).state('console.callmonitor', {
            url: "/call-monitor",
            templateUrl: "views/call-monitor/callMonitor.html",

            data: {
                requireLogin: true,
                navigation: "CALL_MONITOR"
            }
        }).state('console.activelogins', {
            url: "/active-logins",
            templateUrl: "detailsDashBoard/view/template/activeLogins.html",

            data: {
                requireLogin: true,
                navigation: "ACTIVE_LOGINS"
            }
        }).state('console.abandonCdr', {
            url: "/abandonCallReport",
            templateUrl: "views/cdr/abandonCallReport.html",
            controller: "abandonCallCdrCtrl",
            data: {
                requireLogin: true,
                navigation: "ABANDONED_CALL_REPORT"
            }
        }).state('console.realtime-queued', {
            url: "/realtime-queued",
            templateUrl: "views/real-time/queued.html",
            data: {
                requireLogin: true,
                navigation: "QUEUE_SUMMARY"
            }
        }).state('console.phone', {
            url: "/call-phone",
            templateUrl: "views/call-monitor/phoneWidget.html",
            data: {
                requireLogin: true,
                navigation: "CALL_MONITOR"
            }
        }).state('console.rule', {
            url: "/rule/rules",
            templateUrl: "views/rule/ruleList.html",
            controller: "rulelistcontroller",
            data: {
                requireLogin: true,
                navigation: "RULES"
            }
        }).state('console.newrule', {
            url: "/rule/new-rule",
            templateUrl: "views/rule/newRule.html",
            controller: "newrulecontroller",
            data: {
                requireLogin: true,
                navigation: "RULES"
            }
        }).state('console.editrule', {
            url: "/rule/edit-rule?id",
            params: {id: null},
            templateUrl: "views/rule/newRule.html",
            controller: "newrulecontroller",
            data: {
                requireLogin: true,
                navigation: "RULES"
            }
        }).state('console.application', {
            url: "/applications",
            templateUrl: "views/app-registry/applications.html",
            controller: "applicationController",
            data: {
                requireLogin: true,
                navigation: "APPLICATIONS"
            }
        }).state('console.holdmusic', {
            url: "/holdmusic",
            templateUrl: "views/hold-music/holdmusic.html",
            controller: "holdMusicController",
            data: {
                requireLogin: true,
                navigation: "HOLD_MUSIC"
            }
        }).state('console.limits', {
            url: "/limits",
            templateUrl: "views/limit/Limits.html",
            controller: "limitController",
            data: {
                requireLogin: true,
                navigation: "LimitHandler"
            }
        }).state('console.conference', {
            url: "/conference",
            templateUrl: "conference_app/views/conferenceList.html",
            controller: "conferenceController",
            data: {
                requireLogin: true,
                navigation: "CONFERENCE"
            }
        })/*.state('console.conferencemonitor', {
         url: "/conference",
         templateUrl: "conference_app/views/conferenceMonitor.html",
         controller: "conferenceMonitorController",
         data: {
         requireLogin: true,
         navigation: "CONFERENCE"
         }
         })*/.state('console.queuesummary', {
            url: "/queuesummary",
            templateUrl: "views/queue-summary/queue-summary.html",
            controller: "queueSummaryController",
            data: {
                requireLogin: true,
                navigation: "QUEUE_SUMMARY_REPORT"
            }
        }).state('console.agentsummary', {
            url: "/agentsummary",
            templateUrl: "views/agent-productivity-summary/agentSummary.html",
            controller: "agentSummaryController",
            data: {
                requireLogin: true,
                navigation: "AGENT_PRODUCTIVITY_SUMMARY_REPORT"
            }
        }).state('console.AgentTblList', {
            url: "/AgentTblList",
            templateUrl: "agent_status/view/agentStatusTblList.html",
            controller: "agentStatusController",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state('console.extension', {
            url: "/extensions",
            templateUrl: "views/extension/extension.html",
            controller: "extensionController",
            data: {
                requireLogin: true,
                navigation: "EXTENSION"
            }
        })
            .state('console.ardsconfig', {
                url: "/ardsconfig",
                templateUrl: "views/ards-config/ardsconfig.html",
                controller: "ardsController",

                data: {
                    requireLogin: true,
                    navigation: "ARDS_CONFIGURATION"
                }

            }).state('console.myprofile', {
            url: "/myprofile",
            templateUrl: "views/myUserprofile/myUserprofile.html",

            data: {
                requireLogin: true,
                navigation: "MYPROFILE"
            }

        })
            .state('console.did', {
                url: "/didnumbers",
                templateUrl: "views/did/did.html",
                controller: "didController",
                data: {
                    requireLogin: true,
                    navigation: "DID"
                }
            })
            .state('console.scheduler', {
                url: "/schedules",
                templateUrl: "views/scheduler/schedule.html",
                controller: "scheduleController",
                data: {
                    requireLogin: true,
                    navigation: "SCHEDULER"
                }
            }).state('console.companyconfig', {
            url: "/companyconfiguration",
            templateUrl: "views/companyConfig/companyConfigMain.html",
            controller: "companyConfigController",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state('console.thirdpartyintegration', {
            url: "/thirdpartyintegration",
            templateUrl: "views/companyConfig/integrationConfiguration.html",
            controller: "companyConfigController",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state('console.appintegration', {
            url: "/appintegration",
            templateUrl: "views/integrations/appList.html",
            controller: "appListController",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state("console.appconfig", {
            url: "/appintegration/config/:app_id",
            templateUrl: "views/integrations/appConfig.html",
            controller: "appConfigController",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state('console.webhookintegration', {
            url: "/webhookintegration",
            templateUrl: "views/integrations/webhookList.html",
            controller: "webhookConfigController",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state('console.ip_phone_config', {
            url: "/ip_phone_config",
            templateUrl: "sip_phone_config/views/sip_phone_config.html",
            controller: "sip_phone_config_controller",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state('console.translations', {
            url: "/translation",
            templateUrl: "views/translation/translations.html",
            controller: "translationController",
            data: {
                requireLogin: true,
                navigation: "TRANSLATIONS"
            }
        }).state('console.trigger', {
            url: "/trigger",
            templateUrl: "views/ticket-trigger/trigger.html",
            controller: "triggerController",
            data: {
                requireLogin: true,
                navigation: "TICKET_TRIGGER"
            }
        }).state("console.triggerConfiguration", {
            url: "/triggerConfiguration/:triggerId/:title",
            templateUrl: "views/ticket-trigger/configTrigger.html",
            controller: "triggerConfigController",
            data: {
                requireLogin: true,
                navigation: "TICKET_TRIGGER"
            }
        }).state('console.templatecreater', {
            url: "/templatecreater",
            templateUrl: "views/template-generator/templateview.html",
            controller: "templateController",
            data: {
                requireLogin: true,
                navigation: "TEMPLATEMAKER"
            }
        }).state('console.tagmanager', {
            url: "/tagmanager",
            templateUrl: "views/tag-manager/tagView.html",
            controller: "tagcontroller",
            data: {
                requireLogin: true,
                navigation: "TAGMANAGER"
            }
        }).state('console.dispositionalTagManager', {
            url: "/dispositionaltagmanager",
            templateUrl: "views/dispositional-tag-manager/dispositionalTagView.html",
            controller: "dispositionalTagController",
            data: {
                requireLogin: true,
                navigation: "TAGMANAGER"
            }
        }).state('console.callsummary', {
            url: "/callsummary",
            templateUrl: "views/cdr/callSummaryReport.html",
            controller: "callSummaryCtrl",
            data: {
                requireLogin: true,
                navigation: "CALL_SUMMARY_REPORT"
            }

        }).state('console.queueHourlySummary', {
            url: "/queueHourlySummary",
            templateUrl: "views/cdr/queueSummaryHourly.html",
            controller: "queueSummaryHourlyCtrl",
            data: {
                requireLogin: true,
                navigation: "QUEUE_HOURLY_BREAKDOWN_REPORT"
            }
        }).state('console.hourlyBandReport', {
            url: "/hourlyBandReport",
            templateUrl: "views/cdr/hourlyBandReport.html",
            controller: "hourlyBandReportCtrl",
            data: {
                requireLogin: true,
                navigation: "HOURLY_BAND_REPORT"
            }
        }).state('console.userDetailReport', {
            url: "/userDetailReport",
            templateUrl: "views/user-details/userDetails.html",
            controller: "userReportCtrl",
            data: {
                requireLogin: true,
                navigation: "USERDETAIL"
            }
        }).state('console.sla', {
            url: "/sla",
            templateUrl: "views/ticket-sla/sla.html",
            controller: "slaController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state("console.slaConfiguration", {
            url: "/slaConfiguration/:slaId/:title",
            templateUrl: "views/ticket-sla/configSla.html",
            controller: "slaConfigController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state("console.agentstatusevents", {
            url: "/agent_status_list",
            templateUrl: "views/cdr/agentStatusEventList.html",
            controller: "agentStatusListCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state("console.agentTicketDashboard", {
            url: "/agentTicketDashboard",
            templateUrl: "views/dashboard/dashboardTicket.html",
            controller: "agentDashboardCtrl",
            data: {
                requireLogin: true,
                navigation: "TICKET_DASHBOARD"
            }
        }).state("console.ticketSummary", {
            url: "/ticketSummary",
            templateUrl: "views/ticket-reports/ticketSummary.html",
            controller: "ticketSummaryCtrl",
            data: {
                requireLogin: true,
                navigation: "TICKET_SUMMARY_REPORT"
            }
        }).state("console.ticketTagSummary", {
            url: "/ticketTagSummary",
            templateUrl: "views/ticket-reports/tagWiseTicketSummary.html",
            controller: "tagWiseTicketSummaryCtrl",
            data: {
                requireLogin: true,
                navigation: "TICKET_SUMMARY_REPORT"
            }
        }).state("console.ticketDetailReport", {
            url: "/ticketDetailReport",
            templateUrl: "views/ticket-reports/ticketDetailReport.html",
            controller: "ticketDetailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "TICKET_DETAIL_REPORT"
            }
        }).state("console.timeSheet", {
            url: "/timeSheet",
            templateUrl: "views/timeSheet/time-sheet.html",
            controller: "timeSheetCtrl",
            data: {
                requireLogin: true,
                navigation: "TIME_SHEET_REPORT"
            }
        }).state("console.createFilter", {
            url: "/createFilter",
            templateUrl: "views/ticket-trigger/create-filter.html",
            data: {
                requireLogin: true,
                navigation: "TICKET_FILTER"
            }
        }).state("console.caseConfiguration", {
            url: "/caseConfiguration",
            templateUrl: "views/ticket-case/caseConfig.html",
            controller: "caseConfigController",
            data: {
                requireLogin: true,
                navigation: "CASE_CONFIGURATION"
            }
        }).state("console.case", {
            url: "/case",
            templateUrl: "views/ticket-case/case.html",
            controller: "caseController",
            data: {
                requireLogin: true,
                navigation: "CASES"
            }
        }).state("console.configCase", {
            url: "/configCase/:caseInfo/:title",
            templateUrl: "views/ticket-case/configCase.html",
            controller: "configCaseController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state('console.queueSlaBreakDown', {
            url: "/slabreakdown",
            templateUrl: "views/queue-slabreakdown/queue-slabreakdown.html",
            data: {
                requireLogin: true,
                navigation: "SLA_BREAKDOWN"
            }
        }).state('console.fileslotmaker', {
            url: "/fileslot",
            templateUrl: "views/fileSlotMaker/fileSlotMaker.html",
            controller: "fileSlotController",
            data: {
                requireLogin: true,
                navigation: "TICKET_ATTACHMENT_SLOT"
            }
        }).state('console.billingHistory', {
            url: "/billingHistory",
            templateUrl: "views/billing-history/billingHistory.html",
            controller: "billingHistoryController",

            data: {
                requireLogin: true,
                navigation: "BILLING_HISTORY"
            }
        }).state('console.ticketFlow', {
            url: "/ticketFlow",
            templateUrl: "views/flow/flowTest.html",
            data: {
                requireLogin: true,
                navigation: "TICKET_FLOW"
            }
        }).state('console.ivrnodecount', {
            url: "/ivrNode",
            templateUrl: "ivr_node_count/view/ivrNodeCount.html",
            controller: "ivrNodeCountController",
            data: {
                requireLogin: true,
                navigation: "IVR_NODE_COUNT_REPORT"
            }
        }).state('console.customersatisfaction', {
            url: "/customersatisfaction",
            templateUrl: "customerSatisfactions/view/cSat.html",
            controller: "cSatController",
            data: {
                requireLogin: true,
                navigation: "CSATREPORT"
            }
        }).state('console.acwdetails', {
            url: "/acwdetails",
            templateUrl: "views/acw-details/acwDetails.html",
            controller: "acwDetailController",
            data: {
                requireLogin: true,
                navigation: "ACWREPORT"
            }
        }).state('console.qaratingreporting', {
            url: "/qaratingreport",
            templateUrl: "views/qaRatingReport/qaRatingReport.html",
            controller: "qaRatingReportCtrl",
            data: {
                requireLogin: true,
                navigation: "QUALITYASSUARANCE_REPORT"
            }
        }).state('console.missedcallreport', {
            url: "/missedcallreport",
            templateUrl: "views/agent-missedcall-details/missedCallDetails.html",
            controller: "agentMissedCallDetailController",
            data: {
                requireLogin: true,
                navigation: "MISSEDCALLREPORT"
            }
        }).state('console.campaign', {
            url: "/campaign",
            templateUrl: "campaignManager/view/campaignList.html",
            controller: "campaignController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNMANAGER"
            }
        }).state('console.campaignmonitor', {
            url: "/campaign/monitor",
            templateUrl: "campaignManager/view/campaignMonitor.html",
            controller: "campaignMonitorController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_MONITOR"
            }
        }).state('console.campaignsummeryreport', {
            url: "/campaign/report/summery",
            templateUrl: "campaignManager/view/report/campaignSummeryReport.html",
            controller: "campaignReportController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_SUMMARY_REPORT"
            }
        }).state('console.campaigndispositionreport', {
            url: "/campaign/report/disposition",
            templateUrl: "campaignManager/view/report/campaignDispositionReport.html",
            controller: "campaignDispositionReportController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_DISPOSITION_REPORT"
            }
        }).state('console.campaigncallbackreport', {
            url: "/campaign/report/callback",
            templateUrl: "campaignManager/view/report/campaignCallbackReport.html",
            controller: "campaignCallbackReportController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_CALLBACK_REPORT"
            }
        }).state('console.campaignattemptreport', {
            url: "/campaign/report/attempt",
            templateUrl: "campaignManager/view/report/campaignAttemptReport.html",
            controller: "campaignAttemptReportController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_ATTEMPT_REPORT"
            }
        }).state('console.zoho', {
            url: "/zoho",
            templateUrl: "zoho/views/zohoConnector.html",
            controller: "zohoController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.chatbots', {
            url: "/chatbots",
            templateUrl: "chatbot/views/chatbot.html",
            controller: "chatbotController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.bot-details', {
            url: "/bot-details",
            templateUrl: "chatbot/views/chatbot-details.html",
            controller: "chatbotController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.bottemplates', {
            url: "/templates/:templateType",
            templateUrl: "chatbot/views/chatbotTemlplates.html",
            controller: "chatBotTemplateController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.botautomations', {
            url: "/automations",
            templateUrl: "chatbot/views/chatbotAutomations.html",
            controller: "setupAIController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.botintegration', {
            url: "/integration",
            templateUrl: "chatbot/views/chatbotIntegration.html",
            controller: "chatBotIntegrationController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.botsetupai', {
            url: "/setupai",
            templateUrl: "chatbot/views/chatbotSetupAI.html",
            controller: "setupAIController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.botmedia', {
            url: "/media",
            templateUrl: "chatbot/views/chatbotMedia.html",
            controller: "chatbotMediaController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.botentities', {
            url: "/entities",
            templateUrl: "chatbot/views/chatbotEntities.html",
            controller: "chatbotEntitiesController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.botcontext', {
            url: "/context",
            templateUrl: "chatbot/views/chatbotContext.html",
            controller: "chatbotContextController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM"
            }
        }).state('console.zohousers', {
            url: "/zoho/users",
            templateUrl: "zoho/views/zohoUsers.html",
            controller: "zohoUsersController",
            data: {
                requireLogin: true,
                navigation: "ZOHO_CRM_USERS"
            }
        }).state('console.campaignnumberupload', {
            url: "/campaign/numberupload",
            templateUrl: "views/campaign-number-upload/numberUpload.html",
            controller: "numberUploadController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_NUMBER_BASE"
            }
        }).state('console.dncnumbermanage', {
            url: "/campaign/dncnumbermanage",
            templateUrl: "views/campaign-number-upload/dncList.html",
            controller: "numberDncController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_DNCLIST"
            }
        }).state('console.contact-book', {
            url: "/contact-book",
            templateUrl: "views/softPhone/soft-phone-option.html",
            controller: "softPhoneCtrl",
            data: {
                requireLogin: true,
                navigation: "PHONE_BOOK"
            }
        }).state('console.callcenterperformance', {
            url: "/callcenterperformance",
            templateUrl: "views/callcenter-performance-summery/call-center-performance.html",
            controller: "callcenterPerformanceController",
            data: {
                requireLogin: true,
                navigation: "CALLCENTER_PERFORMANCE"
            }
            //callcenterPerformance.html
        }).state('console.seclevels', {
            url: "/SecutityLevels",
            templateUrl: "user_security_level_management/views/securityLevelManagement.html",
            controller: "securityLevelManagementController",
            data: {
                requireLogin: true,
                navigation: "USERS"
            }
        }).state('console.notices', {
            url: "/Notices",
            templateUrl: "views/notice-config/notices.html",
            controller: "noticeConfigController",
            data: {
                requireLogin: true,
                navigation: "NOTICE"
            }
        }).state('console.callCenterPerformanceReport', {
            url: "/callCenterPerformanceReport",
            templateUrl: "views/callcenter-performance-summery/callCenterPerformanceReport.html",
            controller: "callcenterPerformanceReportController",
            data: {
                requireLogin: true,
                navigation: "QUEUE_SUMMARY_REPORT"
            }
        }).state('console.fileCatRestrict', {
            url: "/FileCategoryRestrictions",
            templateUrl: "views/file-category-restriction/fileCategoryRestrictions.html",
            controller: "fileCatRestrictController",
            data: {
                requireLogin: true,
                navigation: "FILE_CAT_RESTRICT"
            }
        }).state('console.agentBreakReport', {
            url: "/agentBreakReport",
            templateUrl: "views/agent-break-details/agentBreakDetails.html",
            controller: "agentBreakDetailController",
            data: {
                requireLogin: true,
                navigation: "AGENT_BREAKS"
            }
        }).state('console.queuesettings', {
            url: "/queuesetting",
            templateUrl: "views/queue-settings-config/queueSettingsConfig.html",
            controller: "queueSettingsController",
            data: {
                requireLogin: true,
                navigation: "QUEUE_SETTINGS"
            }

        }).state('console.campaigncdr', {
            url: "/campaigncdr",
            templateUrl: "views/cdr/campaign-cdr.html",
            controller: "cdrCampaignCtrl",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGN_CDR"
            }

        }).state('console.campaign-console', {
            url: "/campaign-console",
            templateUrl: "campaignManager/template/temp/campaign-console.html",
            controller: "campaignController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNMANAGER"
            }
        }).state('console.new-campaign', {
            url: "/new-campaign/?id",
            templateUrl: "campaignManager/template/new-campaign/new-campaign.html",
            controller: "campaignController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNMANAGER"
            }
        }).state('console.campaign-lookup', {
            url: "/campaign-lookup",
            templateUrl: "campaignManager/template/temp/campaign-lookup.html",
            controller: "campaignLookUpController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNMANAGER"
            }
        }).state('console.invitations', {
            url: "/invitations",
            templateUrl: "views/invitation-config/invitations.html",
            controller: "invitationController",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state('console.fileCatConfig', {
            url: "/FileCategoryConfigurations",
            templateUrl: "views/file-category-config/fileCategoryConfig.html",
            controller: "filecategoryController",
            data: {
                requireLogin: true,
                navigation: "FILE_CAT_CONFIG"
            }
        }).state('console.articlecategories', {
            url: "/ArticleCategories",
            templateUrl: "views/articlemanager/categoryManager.html",
            controller: "articleCategoryManagerController",
            data: {
                requireLogin: true,
                navigation: "KNOWLEDGE_PORTAL"
            }
        }).state("console.articlefolders", {
            url: "/articlefolders/:catId/:editmode/:catName",
            templateUrl: "views/articlemanager/FolderManager.html",
            controller: "articleFolderController",
            data: {
                requireLogin: true,
                navigation: "KNOWLEDGE_PORTAL"
            }
        }).state("console.articles", {
            url: "/articles/:fId/:editmode/:fname",
            templateUrl: "views/articlemanager/articleManager.html",
            controller: "articleManagerController",
            data: {
                requireLogin: true,
                navigation: "KNOWLEDGE_PORTAL"
            }
        });
        //Todo shoud be change navigation
    }]);


mainApp.filter('durationFilter', function () {
    return function (value) {
        var durationObj = moment.duration(value);
        return durationObj._data.days + 'd::' + durationObj._data.hours + 'h::' + durationObj._data.minutes + 'm::' + durationObj._data.seconds + 's';

    }
});


//main console directive
//menu Collapse

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


mainApp.directive('datepicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "yy-mm-dd",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
});


mainApp.constant('config', {
    Auth_API: 'http://userservice.162.243.230.46.xip.io/',
    appVersion: 1.0,
    client_Id_secret: 'ae849240-2c6d-11e6-b274-a9eec7dab26b:6145813102144258048'
});


mainApp.run(function ($rootScope, authService, $location, $auth, $state) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        var navigation = toState.data.navigation;


        if (navigation) {
            if (!authService.checkNavigation(navigation)) {
                event.preventDefault();
                return;
            }
        }

        if (requireLogin) {
            if (!$auth.isAuthenticated()) {
                event.preventDefault();
                //$state.go("login");
            }
            // get me a login modal!
        }

    });

});
