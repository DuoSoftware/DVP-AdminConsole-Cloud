/**
 * Created by Pawan on 8/22/2016.
 */
/**
 * Created by Pawan on 6/8/2016.
 */

mainApp.factory('tagBackendService', function ($http, baseUrls)
{
 return {

  getTagCategories: function () {
   return $http({
    method: 'GET',
    url: baseUrls.ticketUrl+"TagCategories"
   }).then(function(response)
   {
    return response;
   });
  },

  getTagCategory: function (tagCatID) {
   return $http({
    method: 'GET',
    url: baseUrls.ticketUrl+"TagCategory/"+tagCatID
   }).then(function(response)
   {
    return response;
   });
  },

  getTagDetails: function (tagID) {
   return $http({
    method: 'GET',
    url: baseUrls.ticketUrl+"Tag/"+tagID
   }).then(function(response)
   {
    return response;
   });
  },

  getAllTags: function () {
   return $http({
    method: 'GET',
    url: baseUrls.ticketUrl+"Tags"
   }).then(function(response)
   {
    return response;
   });
  },

  saveAndAttachNewTag: function (tagID,resource) {

   return $http({
    method: 'POST',
    url: baseUrls.ticketUrl+"Tag/"+tagID,
    data:resource

   }).then(function(response)
   {
    return response;
   });
  },

  saveAndAttachNewTagToCategory: function (tagCatID,resource) {

   return $http({
    method: 'PUT',
    url: baseUrls.ticketUrl+"TagCategory/"+tagCatID+"/Tag",
    data:resource

   }).then(function(response)
   {
    return response;
   });
  },

  attachTagToCategory: function (tagCatID,tagID) {

   return $http({
    method: 'PUT',
    url: baseUrls.ticketUrl+"Tag/"+tagID+"/AttachToCategory/"+tagCatID

   }).then(function(response)
   {
    return response;
   });
  },

  detachTagFromTag: function (parentID,childID) {
   return $http({
    method: 'DELETE',
    url: baseUrls.ticketUrl+"/Tag/"+childID+"/DetachFrom/"+parentID
   }).then(function(response)
   {
    return response;
   });
  },

  detachTagFromCategory: function (parentID,childID) {
   return $http({
    method: 'DELETE',
    url: baseUrls.ticketUrl+"Tag/"+childID+"/DetachFromCategory/"+parentID
   }).then(function(response)
   {
    return response;
   });
  },

  attachTagToTag: function (parentTagID,childTagID) {

   return $http({
    method: 'PUT',
    url: baseUrls.ticketUrl+"Tag/"+childTagID+"/AttachToTag/"+parentTagID

   }).then(function(response)
   {
    return response;
   });
  },

  deleteTagFromDB: function (tagID) {
   return $http({
    method: 'DELETE',
    url: baseUrls.ticketUrl+"Tag/"+tagID
   }).then(function(response)
   {
    return response;
   });
  },

  deleteTagCategoryFromDB: function (tagCatID) {
   return $http({
    method: 'DELETE',
    url: baseUrls.ticketUrl+"TagCategory/"+tagCatID
   }).then(function(response)
   {
    return response;
   });
  },

  addNewTagCategory: function (resource) {
   return $http({
    method: 'POST',
    url: baseUrls.ticketUrl+"TagCategory",
    data:resource
   }).then(function(response)
   {
    return response;
   });
  },

  addNewTagDetails: function (resource) {
   return $http({
    method: 'POST',
    url: baseUrls.ticketUrl+"Tag",
    data:resource
   }).then(function(response)
   {
    return response;
   });
  },
  updateTagCategoryName: function (id,newName) {
   return $http({
    method: 'PUT',
    url: baseUrls.ticketUrl+"TagCategory/"+id,
    data:{name:newName}
   }).then(function(response)
   {
    return response;
   });
  },

  updateTagName: function (id,newName) {

   return $http({
    method: 'PUT',
    url: baseUrls.ticketUrl+"Tag/"+id,
    data:{name:newName}
   }).then(function(response)
   {
    return response;
   });
  }


 }
});