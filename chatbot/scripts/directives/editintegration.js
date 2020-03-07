/**
 * Created by Shehan on 26/1/2018.
 */
mainApp.directive("editintegration", function ($filter, $uibModal, appBackendService, $state) {

    return {
        restrict: "EAA",
        scope: {
            template: "=",
            templateType: "=",
            templateTypes: "=",
            'updateIntegration': '&',
            'deleteIntegration': '&'
        },

        templateUrl: 'chatbot/views/partials/editIntegration.html',

        link: function (scope) {

            scope.templateType = scope.templateType;

            scope.getSelectedTemplateType = function(){
                angular.for
            }
            scope.selectedTemplateType = scope.getSelectedTemplateType(scope.templateType);

            scope.removeCard = function (index) {
                scope.template.items.splice(index, 1);
            }

            scope.addNewCard = function () {
                scope.template.items.push({
                    buttons: [],
                    default_action: {
                        url: ""
                    },
                    image_url: "",
                    sub_title: "",
                    title: "<new card>"
                });
            }

            scope.copyCardID = function (cardID) {

                var id = cardID;
                window.getSelection().empty();
                var copyField = document.getElementById(id);
                var range = document.createRange();
                range.selectNode(copyField);
                window.getSelection().addRange(range);
                document.execCommand('copy');
                scope.showAlert("Card ID", 'Card ID copied to clipboard.', "success");
            }

            scope.removeTemplate = function (item) {

                scope.showConfirm("Delete Integration", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.name, function (obj) {
                    scope.deleteIntegration(scope.template);

                }, function () {

                }, item);
            };

            /* Start of Default methods*/

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

            /* End of Default Methods */

        },

        controller: function($scope, $state, botintegrationService, $window) { 

                $scope.bodyDisabled= false; 
                $scope.errorMsg = false;

                $scope.closeTemplate = function () {
                    $scope.editMode = false;
                    $scope.getAllIntegrations();
                    //$state.reload();
                };

                $scope.getAllIntegrations = function () {
                    botintegrationService.GetAllIntegrations().then(function (response) {
                        if (response.data.IsSuccess) {
                            $scope.allintegration = response.data.Result;
                            console.log($scope.allintegration);
                        } else {
                            $scope.showAlert("Integration", 'error', "Fail To load integration.");
                        }

                    }, function (error) {
                        $scope.showAlert("Integration", 'error', "Fail To load integration.");
                    });  
                }
                $scope.getAllIntegrations();

                $scope.editTemplate = function (temp) {
                    $scope.integrate = {};
                    console.log(temp);
                   
                    $scope.editMode = true;
                    $scope.integrate= temp;
                    console.log($scope.integrate);

                    //body 
                    debugger; 
                    if($scope.integrate.method === "POST"){
                        $scope.bodyDisabled = false; 
                    }
                    else{
                        $scope.bodyDisabled = true; 
                    }

                    //is jsonStringfy
                     
                    try {
                        $scope.integrate.body = JSON.parse($scope.integrate.body);
                        $scope.integrate.body = JSON.stringify($scope.integrate.body);
                    }
                    catch (e) { 
                        $scope.integrate.body = JSON.stringify($scope.integrate.body);
                    }
                    console.log($scope.integrate.body);

                    console.log($scope.integrate.headers);
                   
                    if($scope.integrate.headers === {} || $scope.integrate.headers === undefined){
                        $scope.integrate.headers = [];
                        $scope.integrate.headers = [{key:"",value:""}];
                        // $scope.integrate.headers = {};
                      
                        // $scope.integrate.headers[key] = $scope.integrate.headers[key];
                        // $scope.integrate.headers[key] = "";
                        // console.log($scope.integrate.headers);
                    }
                    else{
                        if(Array.isArray($scope.integrate.headers)){
                            $scope.integrate.headers = $scope.integrate.headers;
                        }
                        else{
                            console.log($scope.integrate.headers);
                            var xx = Object.keys($scope.integrate.headers);
                            var arr = xx.map(function(x) {
                                var o = {}; 
                                o['key'] = x;
                                o['value'] = $scope.integrate.headers[x];
                                return o;
                            })
                            $scope.integrate.headers = [];
                            $scope.integrate.headers = arr;

                        }
                      
                    }
                   
                    
                    if($scope.integrate.url_params === {} || $scope.integrate.url_params === undefined){
                        $scope.integrate.url_params = [];
                        $scope.integrate.url_params = [{key:"",value:""}];
                        // $scope.integrate.url_params = {};
                        // $scope.integrate.url_params[key] = $scope.integrate.url_params[key];
                        // $scope.integrate.url_params[key] = "";
                    }
                    else{
                        if(Array.isArray($scope.integrate.url_params)){
                            $scope.integrate.url_params = $scope.integrate.url_params;
                        }
                        else{
                            console.log($scope.integrate.url_params);
                            var yy = Object.keys($scope.integrate.url_params);
                            var arry = yy.map(function(y) {
                                var o = {}; 
                                o['key'] = y;
                                o['value'] = $scope.integrate.url_params[y];
                                return o;
                            })
                            $scope.integrate.url_params = [];
                            $scope.integrate.url_params = arry;
                        }
                       

                    }

                    if($scope.integrate.response.success.check_fields.length === 0){
                        $scope.integrate.response.success.check_fields = [{name:"",type:"",value:""}];
                    }
                
                    if($scope.integrate.response.error.check_fields.length === 0){
                        $scope.integrate.response.error.check_fields = [{name:"",type:"",value:""}];
                    }
                };
    
    $scope.deleteUrlParams = deleteUrlParams;
    $scope.deleteHeader = deleteHeader;
    $scope.successDeleteCheckFields = successDeleteCheckFields;
    $scope.errordeleteCheckFields = errordeleteCheckFields;
                
    function deleteUrlParams(index){
        // console.log(prop); 
        // delete $scope.integrate.url_params[prop];
        // console.log($scope.integrate.url_params);
        for (var j = $scope.integrate.url_params.length - 1; j >= 0; j--) {
            if (j == index) {
                $scope.integrate.url_params.splice(j, 1);
            }
        }
    }

    $scope.setbody = function(type){
        if(type === "POST"){
            $scope.bodyDisabled = false; 
            // $scope.integration.body = "";
        }
        else{
            $scope.bodyDisabled = true; 
            // $scope.integration.body = "";
        }
    }

    function deleteHeader(index){
        // console.log(prop); 
        // delete $scope.integrate.headers[prop];
        // console.log($scope.integrate.headers);
        console.log(index);
        for (var k = $scope.integrate.headers.length - 1; k >= 0; k--) {
            if (k == index) {
                $scope.integrate.headers.splice(k, 1);
            }
        }
    }

    function successDeleteCheckFields(index){
        console.log(index);
        for (var m = $scope.integrate.response.success.check_fields.length - 1; m >= 0; m--) {
            if (m == index) {
                $scope.integrate.response.success.check_fields.splice(m, 1);
            }
        }
    }

    function errordeleteCheckFields(index){
        for (var n = $scope.integrate.response.error.check_fields.length - 1; n >= 0; n--) {
            if (n == index) {
                $scope.integrate.response.error.check_fields.splice(n, 1);
            }
        }
    }


    console.log($scope.integrate);

    $scope.addSuccessCheckFields = addSuccessCheckFields;
    $scope.addErrorCheckFields = addErrorCheckFields;
    $scope.addCheckHeaders = addCheckHeaders;
    $scope.addUrlParams = addUrlParams;

    function addCheckHeaders(){
        $scope.integrate.headers.push({});
        //  var key = "",
        //  value="";
        // console.log($scope.integrate.headers);
        // $scope.integrate.headers[key] = $scope.integrate.headers[key];
        // $scope.integrate.headers[key] = "";
        // console.log($scope.integrate.headers);
    }

    function addUrlParams(){
        $scope.integrate.url_params.push({});
        // var key = "",
        //  value="";
        // $scope.integrate.url_params[key] = $scope.integrate.url_params[key];
        // $scope.integrate.url_params[key] = "";
        // console.log($scope.integrate.url_params);
    }

    function addErrorCheckFields(){
        $scope.integrate.response.error.check_fields.push({});
    }

    function addSuccessCheckFields(){
        $scope.integrate.response.success.check_fields.push({});
    }

    }

    }
});