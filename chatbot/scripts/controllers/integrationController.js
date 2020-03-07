mainApp.controller('chatBotIntegrationController', function ($scope, $q, $anchorScroll, $state, botintegrationService) {
    $anchorScroll();

    console.log("integration controller is up!");

    $scope.buttonName = "SAVE";
    $scope.bodyDisabled = false;
    $scope.showNewCardForm = false;

    $scope.integration = {
        "name": "",
        "url": "",
        "method": "",
        "headers": {},
        "url_params": {},
        "body": {},
        "response": {
            "success": {
                "http_code": "",
                "fieldCheckCondition": "",
                "out_message_field": "",
                "check_fields": [
                    // {
                    //     "name": "status",
                    //     "type": "boolean",
                    //     "value": "true"
                    // }
                ]
            },
            "error": {
                "http_code": "",
                "fieldCheckCondition": "",
                "out_message_field": "",
                "check_fields": [
                    // {
                    //     "value": "",
                    //     "type": "",
                    //     "name": ""
                    // }
                ],

            }
        }
    }

    $scope.integration.body = "";

    $scope.addSuccessCheckFields = addSuccessCheckFields;
    $scope.addErrorCheckFields = addErrorCheckFields;
    $scope.addCheckHeaders = addCheckHeaders;
    $scope.addUrlParams = addUrlParams;

    $scope.deleteUrlParams = deleteUrlParams;
    $scope.deleteHeader = deleteHeader;
    $scope.successDeleteCheckFields = successDeleteCheckFields;
    $scope.errordeleteCheckFields = errordeleteCheckFields;
    $scope.save = save;

    $scope.openNewIntegration = function(){
        $scope.showNewCardForm = true;
    }
    $scope.closeNewIntegration = function(){
        $scope.showNewCardForm = false;
    }

    var headers = {};
    var url_params = {};
    
    $scope.headersArray = [{ key: "", value: "" }];
    $scope.urlParamsArray = [{ key: "", value: "" }];
    $scope.successCheckFieldsArray = [{ name: "", type: "", value: "" }];
    $scope.errorCheckFieldsArray = [{ name: "", type: "", value: "" }];

    $scope.setbody = function (type) {
        if (type === "POST") {
            $scope.integration.body = "";
            $scope.bodyDisabled = false;
        }
        else {
            $scope.bodyDisabled = true;
            $scope.integration.body = "";
        }
    }

    function addCheckHeaders() {

        $scope.headersArray.push({});
    }

    function addErrorCheckFields() {

        $scope.errorCheckFieldsArray.push({});
    }

    function addUrlParams() {

        $scope.urlParamsArray.push({});
    }

    function addSuccessCheckFields() {

        $scope.successCheckFieldsArray.push({});
    }

    function deleteUrlParams(param, index) {
        console.log(param);
        console.log(index);
        for (var j = $scope.urlParamsArray.length - 1; j >= 0; j--) {
            if (j == index) {
                $scope.urlParamsArray.splice(j, 1);
            }
        }
    }

    function deleteHeader(index) {
        console.log(index);
        for (var k = $scope.headersArray.length - 1; k >= 0; k--) {
            if (k == index) {
                $scope.headersArray.splice(k, 1);
            }
        }
    }

    function successDeleteCheckFields(index) {
        console.log(index);
        for (var m = $scope.successCheckFieldsArray.length - 1; m >= 0; m--) {
            if (m == index) {
                $scope.successCheckFieldsArray.splice(m, 1);
            }
        }
    }

    function errordeleteCheckFields(index) {
        for (var n = $scope.errorCheckFieldsArray.length - 1; n >= 0; n--) {
            if (n == index) {
                $scope.errorCheckFieldsArray.splice(n, 1);
            }
        }
    }

    function save() {
        for (var i = 0; i < $scope.headersArray.length; i++) {
            console.log($scope.headersArray[i]);
            headers[$scope.headersArray[i].key] = $scope.headersArray[i].value;
            console.log(headers);

            if ($scope.headersArray[i].key === "") {
                headers = {};
            }

            $scope.integration.headers = headers;
        }
        for (var i = 0; i < $scope.urlParamsArray.length; i++) {
            console.log($scope.urlParamsArray[i]);
            url_params[$scope.urlParamsArray[i].key] = $scope.urlParamsArray[i].value;
            console.log(url_params);
            if ($scope.urlParamsArray[i].key === "") {
                url_params = {};
            }
            $scope.integration.url_params = url_params;
        }
        console.log($scope.successCheckFieldsArray);

        if ($scope.successCheckFieldsArray.length === 0) {
            // if($scope.successCheckFieldsArray[0].name===""){
            $scope.successCheckFieldsArray = [];
            // }
        }
        //$scope.errorCheckFieldsArray[0].name==="" 
        if ($scope.errorCheckFieldsArray.length === 0) {
            $scope.errorCheckFieldsArray = [];
        }

        $scope.integration.response.success.check_fields = $scope.successCheckFieldsArray;
        $scope.integration.response.error.check_fields = $scope.errorCheckFieldsArray;

        var body = {};

        body = $scope.integration.body;
        console.log(body);
        if (body !== "") {
            debugger;
            try {
                obj = JSON.parse(body);
                $scope.errorMsg = false;
            }
            catch (e) {
                $scope.errorMsg = true;
                $scope.showAlert("Not Valid JSON", 'error', "Enter valid JSON formatte.");
                return;
            }
        }
        else {
            $scope.errorMsg = false;
            var obj = {};
        }

        console.log(obj);
        $scope.integration.body = obj;
        console.log($scope.integration);

        botintegrationService.CreateIntegration($scope.integration).then(function (response) {
            if (response.data.IsSuccess) {
                $scope.showAlert("Integration", 'success', "Integration Created Successfully.");
                $scope.getAllIntegrations();
                debugger;
                $scope.integration = {};
                $scope.headersArray = [{ key: "", value: "" }];
                $scope.urlParamsArray = [{ key: "", value: "" }];
                $scope.showNewCardForm = false;

            } else {
                $scope.showAlert("Integration", 'error', "Fail To Create Integration.");
            }

        }, function (error) {
            $scope.showAlert("Integration", 'error', "Fail To Create Integration.");

        });

    };

    $scope.createuuid = function () {
        var uuid = Math.floor((1 + Math.random()) * 0x1000000).toString(8).substring(1);
        var hostname = window.location.hostname;
        var code = window.btoa(hostname + "-" + uuid)
        code = code.replace(/=/g, '');
        return code;
    }

    //Get all integrations
    $scope.getAllIntegrations = function () {
        botintegrationService.GetAllIntegrations().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allintegration = [];
                angular.forEach(response.data.Result, function (item) {
                    item.inputID = $scope.createuuid();
                    item.prefix = "INT-" + item._id;
                    $scope.allintegration.push(item);
                });
                console.log($scope.allintegration);
            } else {
                $scope.showAlert("Integration", 'error', "Fail To load integration.");
            }

        }, function (error) {
            $scope.showAlert("Integration", 'error', "Fail To load integration.");
        });
    }
    $scope.getAllIntegrations();

    $scope.deleteIntegration = function (integrate) {
        botintegrationService.DeleteIntegration(integrate).then(function (response) {
            console.log(response._id);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Integration", 'success', "Integration deleted successfully.");
                $scope.getAllIntegrations();
            } else {
                $scope.showAlert("Integration", 'error', "Failed to delete integration.");
            }
        }, function (error) {
            $scope.showAlert("Integration", 'error', "Failed to delete integration.");
        });

    }

    $scope.updateIntegration = function (template) {
        debugger;
        console.log(template);
        
        if(template.body === undefined){
            template.body = "";
        }
        var body = {};
        body= template.body;
        console.log(body);
        if(body !== ""){
            debugger;
            try {
                obj = JSON.parse(body);
                $scope.errorMsg = false;
            }
            catch (e) {
                $scope.errorMsg = true;
                $scope.showAlert("Not Valid JSON", 'error', "Enter valid JSON formatte.");
                return;
            }
        }
        else {
            $scope.errorMsg = false;
            var obj = {};
        }


        console.log(obj);
        template.body = obj;
        console.log(template.body);
        var editheaders = {};
        var editurl_params = {};

        for (var i = 0; i < template.headers.length; i++) {

            console.log(template.headers[i]);
            editheaders[template.headers[i].key] = template.headers[i].value;
            console.log(editheaders);
            if (template.headers[i].key === "") {
                editheaders = {};
            }
            // template.headers = {};

        }

       for (var j = 0; j < template.url_params.length; j++) {
            console.log(template.url_params[j]);
            editurl_params[template.url_params[j].key] = template.url_params[j].value;
            console.log(editurl_params);
            if(template.url_params[j].key === ""){
            editurl_params ={};
            } 
           
        }
        
        console.log(template.url_params);
        template.headers = editheaders;
        template.url_params = editurl_params;

        console.log(template);
        botintegrationService.UpdateIntegration(template).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Integration", 'success', "Integration updated successfully.");
                $scope.getAllIntegrations();
            } else {
                $scope.showAlert("Integration", 'error', "Failed to update integration.");
            }
        }, function (error) {
            $scope.showAlert("Integration", 'error', "Failed to update integration.");
        });
    };

    $scope.reloadPage = function () {
        $state.reload();
    };

});