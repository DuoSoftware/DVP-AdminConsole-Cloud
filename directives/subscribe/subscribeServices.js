/**
 * Created by damith on 5/3/17.
 */


mainApp.factory('subscribeServices', function ($http, baseUrls, authService) {


    //local  variable
    var connectionSubscribers={};
    var dashboardSubscriber = {};
    var eventSubscriber;
    var callSubscribers = {};
    var statusSubcribers = {};
    //********  subscribe event ********//
    var OnConnected = function () {
        //console.log("OnConnected..............");
        var token = authService.GetToken();
        SE.authenticate({
            success: function (data) {
                //console.log("authenticate..............");

                /*if (connectionSubscribers) {
                    connectionSubscribers(true);
                }*/
                angular.forEach(connectionSubscribers,function (func,key) {
                    func(true);
                });
                //subscribe room
                SE.subscribe({room: 'QUEUE:QueueDetail'});
                SE.subscribe({room: 'QUEUE:CurrentCount'});
                SE.subscribe({room: 'QUEUE:TotalCount'});
                SE.subscribe({room: 'QUEUE:TotalCount'});
                SE.subscribe({room: 'CONNECTED:TotalTime'});
                SE.subscribe({room: 'QUEUEANSWERED:TotalCount'});
                SE.subscribe({room: 'BRIDGE:TotalCount'});
                SE.subscribe({room: 'QUEUE:ResetAll'});

                SE.subscribe({room: 'CALLS:TotalCount'});
                SE.subscribe({room: 'CALLS:CurrentCount'});
                SE.subscribe({room: 'QUEUEDROPPED:TotalCount'});
                SE.subscribe({room: 'BRIDGE:CurrentCount'});

                SE.subscribe({room: 'ARDS:ResourceStatus'});
                SE.subscribe({room: 'ARDS:RemoveResourceTask'});
                SE.subscribe({room: 'ARDS:RemoveResource'});
                SE.subscribe({room: 'ARDS:break_exceeded'});
                SE.subscribe({room: 'ARDS:freeze_exceeded'});

                SE.subscribe({room: 'AFTERWORK:TotalTime'});
                SE.subscribe({room: 'LOGIN:TotalTimeWithCurrentSession'});
                SE.subscribe({room: 'LOGIN:TotalKeyCount'});
                SE.subscribe({room: 'CONNECTED:TotalKeyCount'});
                SE.subscribe({room: 'CONNECTED:TotalCount'});
                SE.subscribe({room: 'BREAK:TotalTime'});
                SE.subscribe({room: 'AGENTHOLD:TotalTime'});



                //SE.subscribe({room: 'DASHBOARD:RESETALL'});
                SE.subscribe({room: 'DIALER:RealTimeCampaignEvents'});
                SE.subscribe({room: 'CAMPAIGNCONNECTED:TotalCount'});
                SE.subscribe({room: 'CAMPAIGNCONNECTED:CurrentCount'});
                SE.subscribe({room: 'CAMPAIGNDIALING:TotalCount'});
                SE.subscribe({room: 'CAMPAIGNDIALING:CurrentCount'});
                SE.subscribe({room: 'CAMPAIGNNUMBERSTAKEN:TotalCount'});
                SE.subscribe({room: 'CAMPAIGNNUMBERSTAKEN:CurrentCount'});
                SE.subscribe({room: 'CAMPAIGNREJECTED:TotalCount'});
                SE.subscribe({room: 'PROFILES:PROFILESCOUNT'});
                SE.subscribe({room: 'PROFILESCONTACTS:PROFILESCONTACTSCOUNT'});

            },
            error: function (data) {
                //console.log("authenticate error..............");
            },
            token: token
        });
    };

    var OnDisconnect = function (o) {
        //console.log("OnDisconnect..............");
        /*if (connectionSubscribers)
            connectionSubscribers(false);*/
        angular.forEach(connectionSubscribers,function (func,key) {
            func(false);
        });
    };

    var OnDashBoardEvent = function (event) {

        // dashboardSubscriber.forEach(function (func) {
        //     func(event);
        // });

        for (var k in dashboardSubscriber) {
            if (dashboardSubscriber.hasOwnProperty(k)) {
                dashboardSubscriber[k](event);
            }
        }

    };

    var OnStatus = function (o) {
        //console.log("OnStatus..............");
        // statusSubcribers.forEach(function (func) {
        //     func(o);
        // });

        for (var k in statusSubcribers) {
            if (statusSubcribers.hasOwnProperty(k)) {
                statusSubcribers[k](event);
            }
        }
    };

    var OnEvent = function (event, o) {
        //console.log("OnEvent..............");
        if (eventSubscriber) {
            eventSubscriber(event, o);
        }

    };

    var OnCallStatus = function (o) {
        //console.log("OnStatus..............");
        // callSubscribers.forEach(function (func) {
        //     func(o);
        // });

        for (var k in callSubscribers) {
            if (callSubscribers.hasOwnProperty(k)) {
                callSubscribers[k](event);
            }
        }

    };

    var callBackEvents = {
        OnConnected: OnConnected,
        OnDisconnect: OnDisconnect,
        OnDashBoardEvent: OnDashBoardEvent,
        OnEvent: OnEvent,
        OnStatus: OnStatus,
        OnCallStatus: OnCallStatus,
    };


    //********  subscribe function ********//
    var connect = function () {
        SE.init({
            serverUrl: baseUrls.ipMessageURL,
            callBackEvents: callBackEvents
        });
    };
    var disconnect = function () {
        SE.disconnect();
    };
    var subscribeConnection = function (name,callbck) {
        connectionSubscribers[name] = callbck;

    };
    var unSubscribeConnection = function (name) {
        delete connectionSubscribers[name];

    };
    var subscribeDashboard = function (key, func) {
        dashboardSubscriber[key] = func;
    };

    var unSubscribeDashboard = function (key) {
        delete dashboardSubscriber[key];
    };


    var unsubscribe = function (view) {
        //if (view == "dashoboard") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    SE.unsubscribe({room: 'QUEUE:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'CONNECTED:TotalTime'});
        //    SE.unsubscribe({room: 'QUEUEANSWERED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:TotalCount'});
        //
        //    SE.unsubscribe({room: 'CALLS:TotalCount'});
        //    SE.unsubscribe({room: 'CALLS:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUEDROPPED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:CurrentCount'});
        //    return;
        //}
        //
        //if (view == "queuedetail") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    return;
        //}
    };

    var subscribe = function (view) {
        //if (view == "dashoboard") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    SE.unsubscribe({room: 'QUEUE:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'QUEUE:TotalCount'});
        //    SE.unsubscribe({room: 'CONNECTED:TotalTime'});
        //    SE.unsubscribe({room: 'QUEUEANSWERED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:TotalCount'});
        //
        //    SE.unsubscribe({room: 'CALLS:TotalCount'});
        //    SE.unsubscribe({room: 'CALLS:CurrentCount'});
        //    SE.unsubscribe({room: 'QUEUEDROPPED:TotalCount'});
        //    SE.unsubscribe({room: 'BRIDGE:CurrentCount'});
        //    return;
        //}
        //
        //if (view == "queuedetail") {
        //    SE.unsubscribe({room: 'QUEUE:QueueDetail'});
        //    return;
        //}
    };

    var request = function (status, from) {
        SE.request({type: status, from: from});
    };

    var SubscribeEvents = function (func) {
        eventSubscriber = func;
    };
    var SubscribeStatus = function (key ,func) {
        statusSubcribers[key] = func;
    };

    var unSubscribeStatus = function (key) {
        delete statusSubcribers[key];
    };

    var SubscribeCallStatus = function (key,func) {
        callSubscribers[key] = func;
    };

    var unSubscribeCallStatus = function (key) {
        delete callSubscribers[key];
    };

    var getPersistenceMessages = function () {

        return $http({
            method: 'GET',
            url: baseUrls.notification + "/DVP/API/1.0.0.0/NotificationService/PersistenceMessages"
        }).then(function (response) {
            return response;
        });
    };



    return {
        Disconnect:disconnect,
        Request: request,
        Connect: connect,
        SubscribeConnection:subscribeConnection,
        UnSubscribeConnection: unSubscribeConnection,
        subscribeDashboard: subscribeDashboard,
        unSubscribeDashboard: unSubscribeDashboard,
        unsubscribe: unsubscribe,
        subscribe: subscribe,
        SubscribeEvents: SubscribeEvents,
        UnSubscribeStatus: unSubscribeStatus,
        UnSubscribeCallStatus: unSubscribeCallStatus,
        SubscribeStatus: SubscribeStatus,
        SubscribeCallStatus: SubscribeCallStatus,
        GetPersistenceMessages: getPersistenceMessages
    }


});
