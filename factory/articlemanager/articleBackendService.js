mainApp.factory('articleBackendService', function ($http, baseUrls)
{
    var showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };
    return {

        getCategories: function () {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Categories"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },

        saveNewArticleCategory: function (resource) {


            return $http({
                method: 'POST',
                url: baseUrls.articleServiceUrl + "Category",
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Article Category Adding Failed");
                    return undefined;
                }
            });
        },
        getFoldersOfCategory: function (catId) {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullCategory/"+catId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        getAllFolders: function () {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Folders"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        saveNewArticleFolder: function (resource) {


            return $http({
                method: 'POST',
                url: baseUrls.articleServiceUrl + "Folder",
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Article Folder Adding Failed");
                    return undefined;
                }
            });
        },
        attachFolderToCategory: function (catId,fId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+catId+"/Folder/"+fId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        getArticlesOfFolders: function (fId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullFolder/"+fId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        getAllArticles: function (fId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Articles"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        getArticlesTags: function () {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Tags"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        saveNewArticle: function (resource) {



            return $http({
                method: 'POST',
                url: baseUrls.articleServiceUrl + "Article",
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {

                    return undefined;
                }
            });
        },
        updateArticle: function (id,resource) {



            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+id,
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Article Adding Failed");
                    return undefined;
                }
            });
        },
        getFullArticle: function (aId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullArticle/"+aId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        getArticle: function (aId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Article/"+aId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        attachTagToArticle: function (tag,aId) {



            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/Tag",
                data:{"tag":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        detachTagToArticle: function (tag,aId) {



            return $http({
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/Tag",
                data:{"tag":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        updateEnablityOfArticle: function (aId,state) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/Enable/"+state


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Article State change failed");
                    return undefined;
                }
            });
        },
        getFullFolder: function (fId) {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullFolder/"+fId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        updateFolder: function (id,resource) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Folder/"+id,
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Folder Adding Failed");
                    return undefined;
                }
            });
        },
        attachUserGroupToArticle: function (gId,fId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Group?allow_groups="+gId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        detachUserGroupToArticle: function (gId,fId) {


            return $http({
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Group?allow_groups="+gId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },

        getFullCategory: function (cId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullCategory/"+cId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        updateCategory: function (id,resource) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+id,
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Category updating Failed");
                    return undefined;
                }
            });
        },
        updateEnablityOfFolder: function (fId,state) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Enable/"+state


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Folder state Change failed");
                    return undefined;
                }
            });
        },
        updateEnablityOfCategory: function (cId,state) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+cId+"/Enable/"+state


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Folder state Change failed");
                    return undefined;
                }
            });
        },
        attachBUToCategory: function (cId,bId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+cId+"/BU?allow_business_units="+bId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        detachBUToCategory: function (cId,bId) {


            return $http({
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Category/"+cId+"/BU?allow_business_units="+bId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        attachSearchTagToArticle: function (tag,aId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/SearchTag",
                data:{"tags":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        detachSearchTagToArticle: function (tag,aId) {


            return $http({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/SearchTag",
                data:{"tags":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        attachSearchMetaToArticle: function (meta,aId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/SearchMeta",
                data:{"meta":meta}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        getSectionsOfArticle: function (aId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Sections/Article/"+aId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        AddArticleToFolder : function (aId,fId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Article/"+aId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },
        RemoveArticleFromFolder : function (aId,fId) {


            return $http({
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Article/"+aId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return undefined;
                }
            });
        },






    }
});
