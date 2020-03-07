mainApp.controller('chatBotTemplateController', function ($scope, $q, $anchorScroll, chatbotService, templateService, $state, $stateParams) {
    $anchorScroll();

    console.log("Template controller is up!");

    $scope.getTemplateTypes = function (type) {
        var returnTypes = [];
        var returnContentTypes = [];
        switch (type) {
            case "card": {
                returnTypes = [
                    { "Key": "Select Type", "Value": "select" },
                    { "Key": "Carousel", "Value": "generic" },
                    { "Key": "List", "Value": "list" }
                ];
                returnContentTypes = [
                    { "Key": "Select Content Type", "Value": "select" },
                    { "Key": "Dynamic", "Value": "dynamic" },
                    { "Key": "Static", "Value": "static" }
                ]
                break;
            }
            case "attachment": {
                returnTypes = [
                    { "Key": "Select Attachment Type", "Value": "select" },
                    { "Key": "Image", "Value": "image" },
                    { "Key": "Audio", "Value": "audio" },
                    { "Key": "Video", "Value": "video" },
                    { "Key": "File", "Value": "file" }
                ];
                break;
            }
            case "quick reply": {
                returnContentTypes = [
                    { "Key": "Select Content Type", "Value": "select" },
                    { "Key": "Dynamic", "Value": "dynamic" },
                    { "Key": "Static", "Value": "static" }
                ];
                break;
            }
            case "button list": {
                returnTypes = [
                    { "Key": "Select Button List Type", "Value": "select" },
                    { "Key": "Card", "Value": "card" },
                    { "Key": "Normal", "Value": "normal" }
                ];
                break;
            }
        }
        return { types: returnTypes, contentTypes: returnContentTypes };
    }

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }

    $scope.createuuid = function () {
        var uuid = Math.floor((1 + Math.random()) * 0x1000000).toString(8).substring(1);
        var hostname = window.location.hostname;
        var code = window.btoa(hostname + "-" + uuid)
        code = code.replace(/=/g, '');
        return code;
    }

    $scope.newTemplateSchema = function () {
        var obj = $scope.getTemplateTypes($scope.TemplateCategory.toLowerCase());
        switch ($scope.TemplateCategory.toLowerCase()) {
            case "card": {
                return {
                    name: "",
                    description: "",
                    company: 0,
                    tenant: 0,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    type: "select",
                    contentType: "select",
                    items: [],
                    buttons: []
                }
            }
            case "attachment": {
                return {
                    name: "",
                    description: "",
                    company: 0,
                    tenant: 0,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    type: "select",
                    title: "",
                    payload: {
                        url: ""
                    }
                }
            }
            case "quick reply": {
                return {
                    name: "",
                    description: "",
                    company: 0,
                    tenant: 0,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    contentType: "select",
                    text: "",
                    items: []
                }
            }
            case "button list": {
                return {
                    name: "",
                    description: "",
                    company: 0,
                    tenant: 0,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    type: "select",
                    text: "",
                    items: []
                }
            }
        }
    }

    $scope.AddNewTemplate = function (tempDetails) {
        $scope.SaveTemplate(tempDetails, $scope.TemplateCategory);
        $scope.newTemplate = $scope.newTemplateSchema();
    }

    $scope.SaveTemplate = function (template, category) {
        category = category.replace(/ /g, "");
        templateService.CreateTemplate(template, category).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "New template created successfully.");
                $scope.GetAllTemplates($scope.TemplateCategory);
            } else {
                $scope.showAlert("Template", 'error', "Failed to create new template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to create new template.");
        });
    }

    $scope.updateTemplate = function (template, category) {
        category = category.replace(/ /g, "");
        templateService.UpdateTemplate(template, category).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "Template updated successfully.");
                $scope.GetAllTemplates($scope.TemplateCategory);
            } else {
                $scope.showAlert("Template", 'error', "Failed to update template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to update template.");
        });
    };

    $scope.deleteTemplate = function (template, category) {
        category = category.replace(/ /g, "");
        templateService.DeleteTemplate(template, category).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "Template deleted successfully.");
                $scope.GetAllTemplates($scope.TemplateCategory);
            } else {
                $scope.showAlert("Template", 'error', "Failed to delete template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to delete template.");
        });
    };

    $scope.GetAllTemplates = function (category) {
        $scope.templateList = [];
        category = category.replace(/ /g, "");
        templateService.GetAllTemplates(category).then(function (response) {
            //debugger
            if (response.data && response.data.IsSuccess) {
                var prefix = "";
                if (category == "Card") {
                    prefix = "DBF_card_";
                } else if (category == "Attachment") {
                    prefix = "DBF_attachment_";
                } else if (category == "QuickReply") {
                    prefix = "DBF_quickreply_";
                } else if (category == "ButtonList") {
                    prefix = "DBF_button_";
                }
                angular.forEach(response.data.Result, function (item) {
                    item.inputID = $scope.createuuid();
                    item.prefix = prefix + item._id;
                    $scope.templateList.push(item);
                    console.log(item);
                });
            } else {
                $scope.showAlert("Template", 'error', "Failed to get all templates.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to get all templates.");
        });
    }

    $scope.runDefaultFunctions = function () {
        $scope.TemplateTypes = [];
        $scope.TemplateContentTypes = [];
        if ($stateParams.templateType == "cards") {
            $scope.TemplateCategory = "Card";
        } else if ($stateParams.templateType == "attachments") {
            $scope.TemplateCategory = "Attachment";
        } else if ($stateParams.templateType == "quickreplies") {
            $scope.TemplateCategory = "Quick Reply";
        } else if ($stateParams.templateType == "buttonlists") {
            $scope.TemplateCategory = "Button List";
        }
        var obj = $scope.getTemplateTypes($scope.TemplateCategory.toLowerCase());
        $scope.TemplateTypes = obj.types;
        $scope.TemplateContentTypes = obj.contentTypes;
        $scope.newTemplate = $scope.newTemplateSchema();
        $scope.GetAllTemplates($scope.TemplateCategory);
    }
    $scope.runDefaultFunctions();
});