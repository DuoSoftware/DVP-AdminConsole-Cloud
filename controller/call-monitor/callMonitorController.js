mainApp.controller('callmonitorcntrl', function ($scope, $rootScope, $state, $uibModal, $timeout,
                                                 callMonitorSrv, notificationService,
                                                 jwtHelper, authService, loginService, $anchorScroll, ShareData,subscribeServices) {

    $anchorScroll();

    $scope.CallObj = [];

    $scope.FullCallObj = [];
    $scope.isRegistered = false;
    $scope.currentSessionID=ShareData.listeningCallId;
    $scope.inCall=ShareData.isInCall;
    var authToken = authService.GetToken();
    $scope.selectedBUnit = "ALL";
    $scope.filterMode = "FromID";



    $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};

    $rootScope.$on("is_registered", function (events, args) {
        console.log("isRegisterd " + args);
        $scope.isRegistered = args;


    });


    var protocol = "user";
    var actionObject = {};


    subscribeServices.SubscribeEvents(function (event, data) {
        switch (event) {

            case 'agent_found':

                if(data && data.Message)
                {
                    dataArr = data.Message.split("|");
                }

                ShareData.listeningCallId = dataArr[1];

                break;

            case 'listen_connected':

                if(data && data.Message)
                {
                    dataArr = data.Message.split("|");
                }
                console.log("Call listening");
                ShareData.listeningCallId = dataArr[1];
                ShareData.IsListingCall=true;

                break;

            case 'listen_disconnected':

                ShareData.listeningCallId =null;

               /* $scope.IsListingCall (null);*/
                $scope.inCall = false;
                ShareData.isInCall=false;

                $timeout(function () {
                    $scope.currentSessionID = null;
                },0);



                break;

            /*case 'agent_disconnected':

                ShareData.listeningCallId =null;
                $scope.inCall = false;

                break;*/

            /*case 'agent_rejected':
                ShareData.listeningCallId =null;
                $scope.inCall = false;
                break;*/


            /*
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

        }
    });

    var onCallsDataReceived = function (response) {

        if (!response.data.IsSuccess) {
            onError(response.data.Exception.Message);
        }
        else {

            ValidCallsPicker(response.data);
           /* $scope.inCall = false;
            ShareData.IsListingCall=$scope.inCall;*/

        }

    };
    var onError = function (error) {
        console.log(error);
    };


    $scope.$watch(function () {
        return $scope.inCall;
    }, function (newValue, oldValue) {

        if (newValue.toString() != oldValue.toString()) {
            ShareData.isInCall =$scope.inCall;
        }


    });

    $scope.$watch(function () {
        return ShareData.BusinessUnit;
    }, function (newValue, oldValue) {

        if (newValue.toString() != oldValue.toString()) {
            $scope.LoadCurrentCalls();
        }


    });





    var ValidCallsPicker = function (callObj) {

        $scope.CallObj = [];

        var callObjLen = Object.keys(callObj.Result).length;

        for (var i = 0; i < callObjLen; i++) {
            if (Object.keys(callObj.Result)[i] != "undefined") {
                var keyObj = callObj.Result[Object.keys(callObj.Result)[i]];

                if (keyObj.length > 1) {
                    var callObject = CallObjectCreator(keyObj);
                    if (callObject && (callObject.BusinessUnit.toLowerCase() === ShareData.BusinessUnit.toLowerCase() || ShareData.BusinessUnit.toLowerCase() === "all")) {

                        callObject.isListning=false;

                        /* if($scope.IsListingCall(callObject.BargeID))
                         {
                             callObject.isListning=true;
                         }*/
                        $scope.CallObj.push(callObject);
                    }


                }


            }

        }

    };


    var CallObjectCreator = function (objKey) {
        var bargeID = "";
        var otherID = "";
        var FromID = "";
        var ToID = "";
        var Direction = "";
        var Receiver = "";
        var Bridged = false;
        var newKeyObj = {};
        var skill = "";
        var callDuration = "";
        var localTime = "";
        var BusinessUnit = "";

        for (var j = 0; j < objKey.length; j++) {

            if (objKey[j]["DVP-Call-Direction"]) {
                Direction = objKey[j]["DVP-Call-Direction"];
            }


            if (objKey[j]['Call-Direction'] == "inbound") {


                FromID = objKey[j]['Caller-Caller-ID-Number'];
                ToID = objKey[j]['Caller-Destination-Number'];
                otherID = objKey[j]['Caller-Unique-ID'];


                if (objKey[j]['Bridge-State'] == "Bridged") {
                    Bridged = true;
                }
                if (objKey[j]["DVP-Business-Unit"]) {
                    BusinessUnit = objKey[j]["DVP-Business-Unit"];
                }

                if (objKey[j]['CHANNEL-BRIDGE-TIME']) {
                    var b = moment(objKey[j]['CHANNEL-BRIDGE-TIME']);

                    localTime = b.local().format('YYYY-MM-DD HH:mm:ss');
                }

                if (objKey[j]['BRIDGE-DURATION']) {
                    callDuration = objKey[j]['BRIDGE-DURATION'];
                }


            }
            else if (objKey[j]['Call-Direction'] == "outbound") {
                Receiver = objKey[j]['Caller-Destination-Number'];
                bargeID = objKey[j]['Caller-Unique-ID'];
            }


            if (objKey[j]['ARDS-Skill-Display'] && objKey[j]['ARDS-Skill-Display'] !== 'null') {
                skill = objKey[j]['ARDS-Skill-Display'];
            }


            ////if (j == objKey.length - 1) {
            //if(objKey[j]['Call-Direction'] === 'inbound'){
            //    if (Bridged) {
            //        newKeyObj.FromID = FromID;
            //        newKeyObj.ToID = ToID;
            //        newKeyObj.BargeID = bargeID;
            //        newKeyObj.Direction = Direction;
            //        newKeyObj.Receiver = Receiver;
            //        newKeyObj.CallDuration = objKey[j]['BRIDGE-DURATION'];
            //        newKeyObj.Skill = skill;
            //        newKeyObj.LocalTime = localTime;
            //
            //        //return newKeyObj;
            //    }else{
            //
            //        newKeyObj.BargeID = bargeID;
            //        newKeyObj.Receiver =
            //    }
            //
            //}

        }


        if (Bridged) {
            newKeyObj.FromID = FromID;
            newKeyObj.ToID = ToID;
            newKeyObj.BargeID = bargeID;
            newKeyObj.Direction = Direction;
            newKeyObj.Receiver = Receiver;
            newKeyObj.Skill = skill;
            newKeyObj.LocalTime = localTime;
            newKeyObj.CallDuration = callDuration;
            newKeyObj.BusinessUnit = BusinessUnit;
            if (Direction === 'outbound') {
                newKeyObj.BargeID = otherID;
            }


            return newKeyObj;
        }
        else {
            return null;
        }


    };


    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.pickPassword = function (response) {
        $scope.password = response;


        if ($scope.password != null) {
            console.log("Password picked " + $scope.password);
            $scope.loginData.password = $scope.password;
            //Initiate($scope.loginData,onRegistrationCompleted, onCallDisconnected, onCallConnected,onUnRegisterCompleted);
            $rootScope.$emit("register_phone", $scope.loginData);
        }
    };


    $scope.showModal = function (User) {
        //modal show
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/call-monitor/partials/loginModal.html',
            controller: 'loginModalController',
            size: 'sm',
            resolve: {
                user: function () {
                    return User;
                },
                pickPassword: function () {
                    return $scope.pickPassword;
                }
            }
        });
    };

    $scope.addSamples = function()
    {
        $scope.CallObj.push({BargeID:5});
    }

    $scope.LoadCurrentCalls = function () {
        $rootScope.$emit("monitor_panel", false);

        callMonitorSrv.getCurrentCalls().then(onCallsDataReceived, onError);


    };

    $scope.RegisterThePhone = function () {

        //$rootScope.$emit("register_phone",);
        getRegistrationData(authToken);
        $scope.LoadCurrentCalls();
    }


    var getRegistrationData = function (authToken) {

        var decodeData = jwtHelper.decodeToken(authToken);


        if (decodeData.context.veeryaccount) {
            var values = decodeData.context.veeryaccount.contact.split("@");
            $scope.sipUri = "sip:" + decodeData.context.veeryaccount.contact;
            $scope.WSUri = "wss://" + values[1] + ":7443";
            $scope.realm = values[1];
            $scope.username = values[0];
            $scope.displayname = decodeData.context.veeryaccount.display;
            $scope.loginData = {
                realm: $scope.realm,
                impi: $scope.username,
                impu: $scope.sipUri,
                display_name: decodeData.iss,
                websocket_proxy_url: $scope.WSUri


            }

            console.log("Showing modal ..................................................");
            //$scope.showModal(decodeData.iss);
        }
        else {
            $scope.showAlert("Error", "Unauthorized user details to login ", "error");
        }


    };

    //getRegistrationData(authToken);


    $rootScope.$on('load_calls', function (event, args) {

        $scope.LoadCurrentCalls();

    });

    $rootScope.$on('register_status', function (event, args) {

        $scope.isRegistered = args;
        var moduleSt = [];
        if (args) {
            moduleSt = ["success", "Registered"];

        }
        else {
            moduleSt = ["notice", "Unregistered"];
        }

        $scope.showAlert("Info", " Supervisor call monitor module " + moduleSt[1], moduleSt[0]);


        if ($scope.isRegistered && actionObject && actionObject.action == "LISTEN") {
            //  $scope.currentSessionID = actionObject.BargeID;
            callMonitorSrv.listenCall(actionObject.BargeID, actionObject.protocol, actionObject.displayname).then(function (listenData) {
                actionObject = {};
                if (!listenData.data.IsSuccess) {
                    console.log("Invalid or Disconnected call, Loading Current list ", listenData.data.CustomMessage);
                    $scope.showAlert("Info", "Invalid or Disconnected call, Loading Current list", "notice");
                    $scope.LoadCurrentCalls();
                }
                else {
                    var listenObj =
                        {
                            sessionID: $scope.currentSessionID,
                            protocol: protocol,
                            legID: listenData.data.Result
                        }
                    $rootScope.$emit("call_listning", listenObj);

                }


            }, function (error) {
                loginService.isCheckResponse(error);
                actionObject = {};
                console.log("Invalid or Disconnected call, Loading Current list ", error);
                $scope.showAlert("Info", "Invalid or Disconnected call, Loading Current list", "notice");
                $scope.LoadCurrentCalls();
            });
        }

    });

    $scope.ListenCall = function (callData) {
        //alert("barged: "+bargeID);
        ShareData.listeningCallId=callData.BargeID;
       /* $scope.IsListingCall(callData.BargeID);*/
        $scope.isRegistered = true;
        $scope.inCall = true;
        ShareData.IsListingCall=true;

        getRegistrationData(authToken);
        $scope.currentSessionID = callData.BargeID;
        callMonitorSrv.listenCall(callData.BargeID, protocol, $scope.displayname,callData.FromID,callData.Skill).then(function (listenData) {

            if (!listenData.data.IsSuccess) {
                console.log("Invalid or Disconnected call, Loading Current list ", listenData.data.CustomMessage);
                $scope.showAlert("Info", "Invalid or Disconnected call, Loading Current list", "notice");
                $scope.LoadCurrentCalls();
                $scope.inCall = false;
                ShareData.IsListingCall=$scope.inCall;
                ShareData.listeningCallId=null;
                $scope.currentSessionID=null;
            } else {

                var listenObj =
                    {
                        sessionID: $scope.currentSessionID,
                        protocol: protocol,
                        legID: listenData.data.Result,
                        CallStatus: "LISTEN"
                    }
                $rootScope.$emit("call_listning", listenObj);
                // ShareData.listeningCallId=$scope.currentSessionID;
                callData.isListning=true;

            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Invalid or Disconnected call, Loading Current list ", error);
            $scope.showAlert("Info", "Invalid or Disconnected call, Loading Current list", "notice");
            $scope.inCall = false;
            ShareData.IsListingCall=$scope.inCall;
            ShareData.listeningCallId=null;
            $scope.currentSessionID=null;
            $scope.LoadCurrentCalls();

        });
        /* if ($scope.isRegistered) {
         getRegistrationData(authToken);
         $scope.currentSessionID = callData.BargeID;
         callMonitorSrv.listenCall(callData.BargeID, protocol, $scope.displayname).then(function (listenData) {
         if (!listenData.data.IsSuccess) {
         console.log("Invalid or Disconnected call, Loading Current list ", listenData.data.CustomMessage);
         $scope.showAlert("Info", "Invalid or Disconnected call, Loading Current list", "notice");
         $scope.LoadCurrentCalls();
         $scope.inCall=false;
         }else
         {
         var listenObj =
         {
         sessionID:$scope.currentSessionID,
         protocol:protocol,
         legID:listenData.data.Result,
         CallStatus:"LISTEN"
         }
         $rootScope.$emit("call_listning", listenObj);
         }
         }, function (error) {
         loginService.isCheckResponse(error);
         console.log("Invalid or Disconnected call, Loading Current list ", error);
         $scope.showAlert("Info", "Invalid or Disconnected call, Loading Current list", "notice");
         $scope.inCall=false;
         $scope.LoadCurrentCalls();
         });
         }
         else {
         getRegistrationData(authToken);
         actionObject = {
         action: "LISTEN",
         BargeID: callData.BargeID,
         protocol: protocol,
         displayname: $scope.displayname
         };
         }*/


    };


    /*getRegistrationData(authToken);
     $scope.LoadCurrentCalls();*/
    $rootScope.$emit("check_register", null);

    if ($scope.isRegistered) {
        $scope.LoadCurrentCalls();
    }
    else {
        console.log("going to register");
        //$scope.RegisterThePhone();
    }


    /*$scope.IsListingCall = function (sId) {
        // debugger
        // if(!sid)
        // {
        //     return false;
        // }
        sId==ShareData.listeningCallId ? $scope.currentSessionID = sId : $scope.currentSessionID = null;
        // return sId;
    }*/


});

mainApp.controller("loginModalController", function ($scope, $rootScope, $uibModalInstance, user, pickPassword) {


    $scope.showModal = true;

    $scope.username = user;

    $scope.ok = function () {
        pickPassword($scope.userPasssword);
        $scope.showModal = false;
        $uibModalInstance.close($scope.password);
    };

    $scope.loginPhone = function () {
        pickPassword($scope.userPasssword);
        $scope.showModal = false;
        $uibModalInstance.close($scope.password);
    };

    $scope.closeModal = function () {
        pickPassword(null);
        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        pickPassword(null);
        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };


});