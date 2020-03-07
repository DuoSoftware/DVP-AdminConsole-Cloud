/**
 * Created by Rajinda on 12/31/2015.
 */

var fileModule = angular.module("fileServiceModule", ["download"]);

fileModule.factory("fileService", function ($http, download,authService,baseUrls,FileSaver) {



  var downloadFile = function (id, fileName) {
    $http({
      url: baseUrls.fileServiceUrl+ "File/Download/" + id + "/" + fileName,
      method: "get",
      //data: json, //this is your json data string
      headers: {
        'Content-type': 'application/json'
      },
      responseType: 'arraybuffer'
    }).success(function (data, status, headers, config) {

      /*
       var blob = new Blob([data], {type: "application/image/png"});
       var objectUrl = URL.createObjectURL(blob);
       window.open(objectUrl);
       */

      var myBlob = new Blob([data]);
      var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
      var anchor = document.createElement("a");
      anchor.download = fileName;
      anchor.href = blobURL;
      anchor.click();

    }).error(function (data, status, headers, config) {
      //upload failed
    });

  };

  var downloadInternalFile = function (file) {
    $http({

      url: baseUrls.fileServiceInternalUrl+ "File/Download/" +file.TenantId + "/" +file.CompanyId+"/"+file.UniqueId+"/"+file.Filename,
      method: "get",
      //data: json, //this is your json data string
      headers: {
        'Content-type': 'application/json'
      },
      responseType: 'arraybuffer'
    }).success(function (data, status, headers, config) {

      /*
       var blob = new Blob([data], {type: "application/image/png"});
       var objectUrl = URL.createObjectURL(blob);
       window.open(objectUrl);
       */

      var myBlob = new Blob([data]);
      var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
      var anchor = document.createElement("a");
      anchor.download = file.Filename;
      anchor.href = blobURL;
      anchor.click();

    }).error(function (data, status, headers, config) {
      //upload failed
    });

  };

  var downloadLatestFile = function (fileName, fileSaveAs) {
    $http({
      url: baseUrls.fileServiceUrl+ "File/DownloadLatest/" + fileName,
      method: "get",
      //data: json, //this is your json data string
      headers: {
        'Content-type': 'application/json'
      },
      responseType: 'arraybuffer'
    }).success(function (data, status, headers, config) {

      /*
       var blob = new Blob([data], {type: "application/image/png"});
       var objectUrl = URL.createObjectURL(blob);
       window.open(objectUrl);
       */

      var myBlob = new Blob([data]);
      var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
      var anchor = document.createElement("a");
      anchor.download = fileSaveAs;
      anchor.href = blobURL;
      anchor.click();

    }).error(function (data, status, headers, config) {
      //upload failed
    });

  };

  var playEncryptedFile = function ( file) {
    $http({
      url: baseUrls.fileServiceInternalUrl + "File/Download/" + file.TenantId + "/" + file.CompanyId + "/" + file.UniqueId + "/" + file.Filename,
      method: "get",
      //data: json, //this is your json data string
      headers: {
        'Content-type': 'application/json'
      },
      responseType: 'arraybuffer'
    }).success(function (data, status, headers, config) {

      /*
       var blob = new Blob([data], {type: "application/image/png"});
       var objectUrl = URL.createObjectURL(blob);
       window.open(objectUrl);
       */
      console.log(data);
      var myBlob = new Blob([data]);
      var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
      FileSaver.saveAs(myBlob, 'a_enc_2.mp3');



      /*var newFile = new File(data,"./dec.mp3","audio/mp3");
       saveAs(newFile);
       var anchor = document.createElement("a");
       //anchor.download = file.Filename;
       anchor.src = blobURL;
       anchor.click();*/



      return blobURL;
      //anchor.click();

    }).error(function (data, status, headers, config) {
      //upload failed
      return null;
    });

  };

  var getFiles = function (pageSize,pageNo) {
    return $http({
      method: 'get',
      url: baseUrls.fileServiceUrl+ 'Files/50/'+pageNo+"?visibleSt=true"
    }).then(function (response) {
      return response.data.Result;
    });
  };

    var getAvailableCategoryFiles = function (pageSize,pageNo,resource) {
        return $http({
            method: 'post',
            url: baseUrls.fileServiceUrl+ 'Files/50/'+pageNo,
            data:resource

        }).then(function (response) {
            return response.data.Result;
        });
    };

  /*
   var searchFiles = function (categoryId,startTime,endTime) {
   return $http({
   method: 'get',
   url: baseUrls.fileServiceUrl+ 'Files/infoByCategoryID/'+categoryId+'?startDateTime='+startTime+'&endDateTime='+endTime,
   headers: {
   'authorization': authService.GetToken()
   }
   }).then(function (response) {
   return response.data.Result;
   });
   };
   */
  var searchFiles = function (categoryId,startTime,endTime) {
    return $http({
      method: 'get',
      url: baseUrls.fileServiceUrl+ 'Files/infoByCategoryID/'+categoryId,
      params: [{startDateTime: startTime},{endDateTime:endTime}]
    }).then(function (response) {
      return response.data.Result;
    });
  };

  var searchFilesWithCategories = function (startTime,endTime,categories,pageSize,pageNo) {
    return $http({
      method: 'post',
      url: baseUrls.fileServiceUrl+ "FileInfo/ByCategoryList/"+pageSize+"/"+pageNo,
      // params: [{startDateTime: startTime},{endDateTime:endTime}],
        params: {startDateTime: startTime, endDateTime:endTime},
        data:categories
    }).then(function (response) {
      return response.data.Result;
    });
  };

    var getFileCountByCategory = function (categories,startTime,endTime) {
        return $http({
            method: 'POST',
            url: baseUrls.fileServiceUrl+ "FileInfo/ByCategoryList/count",
            params: {startDateTime: startTime, endDateTime:endTime},
            data:categories
        }).then(function (response) {
            return response.data.Result;
        });
    };

  var getFilesCategoryID = function (categoryId,pageSize,pageNo) {
    return $http({
      method: 'get',
      url: baseUrls.fileServiceUrl+ 'FilesInfo/Category/'+categoryId+'/'+pageSize+'/'+pageNo
    }).then(function (response) {
      return response.data.Result;
    });
  };
  var getFilesByCategoryName = function (categoryName) {
    return $http({
      method: 'get',
      url: baseUrls.fileServiceUrl+ 'Files/infoByCategory/'+categoryName
    }).then(function (response) {
      return response.data.Result;
    });
  };

  var getFileCountCategoryID = function (categoryId) {
    return $http({
      method: 'get',
      url: baseUrls.fileServiceUrl+ 'File/Count/Category/'+categoryId
    }).then(function (response) {
      return response.data.Result;
    });
  };

  var deleteFile = function (file) {
    return $http({
      method: 'delete',
      url: baseUrls.fileServiceUrl+'File/' + file.UniqueId
    }).then(function (response) {
      return response.data.IsSuccess;
    });
  };

  var getCatagories = function (token) {

    return $http.get(baseUrls.fileServiceUrl+'FileCategories'
    ).then(function (response) {

          return response.data.Result;
        });

  };

    var getStorageDetails = function () {
        return $http({
            method: 'get',
            url: baseUrls.fileServiceUrl+ "FileStorage/Sizes"
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var getUploadSize = function () {
        return $http({
            method: 'get',
            url: baseUrls.fileServiceUrl+ "MaxUploadSize"
        }).then(function (response) {
            return response.data.Result;
        });
    };

  return {
    GetToken: authService.GetToken(),
    DownloadFile: downloadFile,
    GetFiles: getFiles,
    SearchFiles: searchFiles,
    DeleteFile: deleteFile,
    GetCatagories: getCatagories,
    GetFilesCategoryID:getFilesCategoryID,
    GetFileCountCategoryID:getFileCountCategoryID,
    GetFileCountByCategory:getFileCountByCategory,
    GetFilesByCategoryName:getFilesByCategoryName,
    playEncryptedFile:playEncryptedFile,
    downloadLatestFile:downloadLatestFile,
    downloadInternalFile:downloadInternalFile,
      getAvailableCategoryFiles:getAvailableCategoryFiles,
      searchFilesWithCategories:searchFilesWithCategories,
      getStorageDetails:getStorageDetails,
      getUploadSize:getUploadSize,

    UploadUrl: baseUrls.fileServiceUrl+ "File/Upload",
    File: {},
    Headers: {'Authorization':  authService.GetToken()}
  }

});

