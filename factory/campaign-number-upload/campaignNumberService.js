/**
 * Created by Heshan.i on 2/11/2017.
 */

(function() {
  var campaignNumberApiAccess = function($http, $q, baseUrls) {
    //----------------Number Category-------------------------------------------

    var createNumberCategory = function(categoryData) {
      return $http({
        method: "POST",
        url: baseUrls.campaignmanagerUrl + "CampaignCategory",
        headers: {
          "Content-Type": "application/json"
        },
        data: categoryData
      }).then(function(response) {
        return response.data;
      });
    };

    var changeNumberCategoryName = function(categoryData) {
      return $http({
        method: "PUT",
        url:
          baseUrls.campaignmanagerUrl +
          "Campaign/Numbers/Category/" +
          categoryData.CategoryID,
        headers: {
          "Content-Type": "application/json"
        },
        data: categoryData
      }).then(function(response) {
        return response.data;
      });
    };

    var getNumberCategories = function() {
      return $http({
        method: "GET",
        url: baseUrls.campaignmanagerUrl + "CampaignCategorys",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getNumbersByCategory = function(categoryId) {
      return $http({
        method: "GET",
        url:
          baseUrls.campaignmanagerUrl +
          "Campaign/Numbers/Category/" +
          categoryId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    //----------------Number Upload-------------------------------------------

    var uploadNumbers = function(numberData) {
      var deferred = $q.defer();

      $http({
        method: "POST",
        url: baseUrls.campaignmanagerUrl + "CampaignNumbers",
        headers: {
          "Content-Type": "application/json"
        },
        data: numberData
      }).then(function(response) {
        deferred.resolve(response.data);
      });

      return deferred.promise;
    };

    var deleteNumbersFromCampaign = function(campaignId, numberData) {
      return $http({
        method: "DELETE",
        url:
          baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Numbers",
        headers: {
          "Content-Type": "application/json"
        },
        data: numberData
      }).then(function(response) {
        return response.data;
      });
    };

    var getAllNumbers = function() {
      return $http({
        method: "GET",
        url: baseUrls.campaignmanagerUrl + "Campaign/Numbers/all",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getNumbersByCampaign = function(campaignId) {
      return $http({
        method: "GET",
        url:
          baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Numbers",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getSchedulesForCampaign = function(campaignId) {
      return $http({
        method: "GET",
        url:
          baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Schedules",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getCategoriesForCampaign = function(campaignId) {
      return $http({
        method: "GET",
        url:
          baseUrls.campaignmanagerUrl +
          "Campaign/" +
          campaignId +
          "/Categories",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getNumbersByCampaignAndSchedule = function(campaignId, scheduleId) {
      return $http({
        method: "GET",
        url:
          baseUrls.campaignmanagerUrl +
          "Campaign/" +
          campaignId +
          "/Numbers/" +
          scheduleId,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    //----------------Campaign-------------------------------------------

    var getNewlyCreatedCampaigns = function() {
      return $http({
        method: "GET",
        url: baseUrls.campaignmanagerUrl + "Campaigns/State/create/500",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getOngoingCampaigns = function() {
      return $http({
        method: "GET",
        url: baseUrls.campaignmanagerUrl + "Campaigns/State/ongoing/500",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    //----------------Campaign Schedule-------------------------------------------

    var getCampaignSchedule = function(campaignId) {
      return $http({
        method: "GET",
        url:
          baseUrls.campaignmanagerUrl + "Campaign/" + campaignId + "/Schedule",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    //----------------Dnc List-------------------------------------------

    var addNumbersToDnc = function(dncNumbers) {
      var deferred = $q.defer();

      $http({
        method: "POST",
        url: baseUrls.campaignmanagerUrl + "Dnc",
        headers: {
          "Content-Type": "application/json"
        },
        data: dncNumbers
      }).then(function(response) {
        deferred.resolve(response.data);
      });

      return deferred.promise;
    };

    var deleteNumbersFromDnc = function(dncNumbers) {
      var deferred = $q.defer();

      $http({
        method: "POST",
        url: baseUrls.campaignmanagerUrl + "Dnc/Delete",
        headers: {
          "Content-Type": "application/json"
        },
        data: dncNumbers
      }).then(function(response) {
        deferred.resolve(response.data);
      });

      return deferred.promise;
    };

    var getDncNumbers = function() {
      return $http({
        method: "GET",
        url: baseUrls.campaignmanagerUrl + "Dnc",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getCustomersByTags = function(tags) {
      return $http({
        method: "GET",
        url: baseUrls.externalUserServiceBaseUrl + "ExternalUsersByTags",
        headers: {
          "Content-Type": "application/json"
        },
        params: { tags: tags }
      }).then(function(response) {
        return response.data;
      });
    };

    var getCustomersTags = function() {
      return $http({
        method: "GET",
        url: baseUrls.externalUserServiceBaseUrl + "CustomerTags",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    var getCustomers = function() {
      return $http({
        method: "GET",
        url: baseUrls.externalUserServiceBaseUrl + "ExternalUsers",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response.data;
      });
    };

    return {
      CreateNumberCategory: createNumberCategory,
      ChangeNumberCategoryName: changeNumberCategoryName,
      GetNumberCategories: getNumberCategories,
      GetNumbersByCategory: getNumbersByCategory,
      UploadNumbers: uploadNumbers,
      DeleteNumbersFromCampaign: deleteNumbersFromCampaign,
      GetAllNumbers: getAllNumbers,
      GetNumbersByCampaign: getNumbersByCampaign,
      GetNewlyCreatedCampaigns: getNewlyCreatedCampaigns,
      GetOngoingCampaigns: getOngoingCampaigns,
      GetCampaignSchedule: getCampaignSchedule,
      AddNumbersToDnc: addNumbersToDnc,
      DeleteNumbersFromDnc: deleteNumbersFromDnc,
      GetDncNumbers: getDncNumbers,
      GetNumbersByCampaignAndSchedule: getNumbersByCampaignAndSchedule,
      GetCustomersByTags: getCustomersByTags,
      GetCustomersTags: getCustomersTags,
      GetCustomers: getCustomers,
      getSchedulesForCampaign: getSchedulesForCampaign,
      getCategoriesForCampaign: getCategoriesForCampaign
    };
  };

  var module = angular.module("veeryConsoleApp");
  module.factory("campaignNumberApiAccess", campaignNumberApiAccess);
})();
