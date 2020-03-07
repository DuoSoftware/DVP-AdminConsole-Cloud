/**
 * Created by Lakmini on 01/25/2018.
 */

'use strict';
mainApp.factory("chatbotService", function ($http, $log, $filter,  baseUrls) {

    var createChatbot = function (bot) {

        return $http({
            method: 'POST',
            url: baseUrls.botAPIUrl + "Bot/",
            data: bot
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };
    var getAllChatbots = function () {

        return $http({
            method: 'GET',
            url: baseUrls.botAPIUrl + "Bots/",
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };
    var getBotById = function (id) {

        return $http({
            method: 'GET',
            url: baseUrls.botAPIUrl + "Bot/" + id,
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };

    var updateChatbot = function (bot) {
        return $http({
            method: 'PUT',
            url: baseUrls.botAPIUrl + "Bot/" + bot._id,
            data: bot
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };

    var updateChatbotAi = function (id, update) {
        console.log(id);
        console.log(update);
        return $http({
            method: 'PUT',
            url: baseUrls.botAPIUrl + "Bot/" + id,
            data: update
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };

    var deleteChatbot = function (bot) {
        return $http({
            method: 'DELETE',
            url: baseUrls.botAPIUrl + "Bot/" + bot._id,
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });

    };

    var getPersistantMenuByBotId = function (id) {
        return $http({
            method: 'GET',
            url: baseUrls.botplatformUrl + "facebook/bot/" + id + "/persistmenu",
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var updatePersistantMenuByBotId = function (id, persistmenu) {
        return $http({
            method: 'POST',
            url: baseUrls.botplatformUrl + "facebook/bot/" + id + "/persistmenu",
            data: persistmenu
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var updateChatbotEntity = function(id, entity){
        console.log(entity);
        return $http({
            method: 'PUT',
            url: baseUrls.chatbotupdateentitityAPIUrl + "/" + id,
            data: entity
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    }

    var deleteChatbotEntity = function (id, entity) {
        return $http({
            method: 'POST',
            url: baseUrls.chatbotupdateentitityAPIUrl + "/" + id,
            data: entity
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });

    };

    return {
        CreateChatbot: createChatbot,
        GetAllChatbots: getAllChatbots,
        UpdateChatbot: updateChatbot,
        DeleteChatbot: deleteChatbot,
        GetBotById: getBotById,
        UpdateChatbotAi: updateChatbotAi,
        GetPersistantMenu: getPersistantMenuByBotId,
        StorePersistantMenu: updatePersistantMenuByBotId,
        UpdateChatbotEntity: updateChatbotEntity,
        DeleteChatbotEntity: deleteChatbotEntity,
    }
});
