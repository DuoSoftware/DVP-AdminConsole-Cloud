/**
 * Created by Pawan on 5/29/2017.
 */
mainApp.controller("fileCatRestrictController", function ($scope, $state, userProfileApiAccess,fileService, loginService,$anchorScroll,ShareData,$q) {

    $anchorScroll();
    $scope.addNew = false;
    $scope.ArdsList = [];
    $scope.tasks = [];
    $scope.groups = [];
    $scope.attributeGroups = [];
    $scope.attributeGroup;
    $scope.RequestServers = [];

    $scope.AdminUsers =[];
    $scope.FileCategories=[];
    $scope.FileCategoryNames=[];

    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    $scope.loadUsers = function () {

        ShareData.getUsersCountByRole().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            $scope.loadUserRec(1,pagecount);
           /* var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(ShareData.getUsersByRoleWithPaging(pagesize, i));
            }
*/

            /*$q.all(method_list).then(function (resolveData) {
                if (resolveData) {

                    resolveData.map(function (data) {

                        data.map(function (item) {

                            $scope.AdminUsers.push(item);
                        });
                    });

                }
                else
                {
                    $scope.showAlert("Error","Error in loading Admin user details","error");
                }



            }).catch(function (err) {
                console.error(err);

                $scope.showAlert("Error","Error in loading Admin user details","error");
            });*/



        }, function (err) {
            $scope.showAlert("Error","Error in loading Admin user details","error");
        });



       /* userProfileApiAccess.getUsersByRole().then(function (response) {

            if(response.IsSuccess)
            {
                $scope.AdminUsers=response.Result;
            }
            else
            {
                $scope.showAlert("Error","Error in loading Admin user details","error");
            }
        },function (error) {
            $scope.showAlert("Error","Error in loading Admin user details","error");
            console.log(error);
        });*/
    };

    $scope.loadUserRec = function(i,pageCount)
    {
        var index=i;
        userProfileApiAccess.LoadUsersByPage('all',20, index).then(function(items)
        {
            items.map(function (item) {
                item.status = 'offline';
                item.callstatus = 'offline';
                item.callstatusstyle = 'call-status-offline';
                $scope.AdminUsers.push(item);
            })

            index++;
            if(index<=pageCount)
            {
                $scope.loadUserRec(index,pageCount);
            }

        },function (err) {
            index++;
            if(index<=pageCount)
            {
                $scope.loadUserRec(i,pageCount);
            }
        })
    }
    $scope.loadFileCategoryList = function () {
        userProfileApiAccess.GetFileCatagories().then(function (response) {

            if(response)
            {
                $scope.FileCategories=response;
                $scope.FileCategoryNames=$scope.FileCategories.map(function (item) {

                    return item.Category;
                });

            }


        },function (error) {
            console.log(error);
        });
    }


    $scope.loadUsers();
    $scope.loadFileCategoryList();







    /*$scope.GetARDSRecords();
    $scope.LoadTasks();
    $scope.LoadGroups();
    $scope.LoadServers();*/

});