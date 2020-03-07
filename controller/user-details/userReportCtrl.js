/**
 * Created by Marlon on 3/2/2019.
 */
(function(){

var app =angular.module('veeryConsoleApp');

var userReportCtrl = function ($scope, $filter, $q, $uibModal, uiGridConstants, loginService,organizationService, $anchorScroll) {
    $anchorScroll();

    $scope.showAlert = function (title, type, content) {
        ngNotify.set(content, {
            position: 'top',
            sticky: true,
            duration: 3000,
            type: type
        });
    };


    var data = [];
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 100,
        sort: null
    };
    $scope.isTableLoading = 1;

    $scope.getUserDetails = function (isSearch){
        if(isSearch){
            data =[];
            paginationOptions.pageNumber = 1;
            paginationOptions.pageSize = 100;
        }
        $scope.isTableLoading = 0;
        organizationService.LoadBusinessUnitsWithPaging('all', paginationOptions.pageNumber, paginationOptions.pageSize).then(function (response) {
            $scope.isCurrPageEmpty = response.length === 0;
            if (response) {
                var promises = response.map(function (user) {

                    if (user.user_meta !== undefined) {  //ignore wrong data
                        var sipAccount = '-';
                        if (user.veeryaccount != null) {
                            sipAccount = user.veeryaccount.contact;
                        }

                        var groupName = '-';
                        var buName = '-';

                        if (user.group !== undefined){
                            groupName = user.group.name;
                            buName = user.group.businessUnit;
                        }

                        var userobj = {
                            buName: buName,
                            groupName: groupName,
                            username: user.username,
                            createdDate: user.created_at,
                            updatedDate: user.updated_at,
                            role: user.user_meta.role,
                            sipAccount: sipAccount,
                            userScopes: user.user_scopes
                        };
                        if ($scope.roleFilter !== undefined && $scope.roleFilter.length > 0) {
                            $scope.roleFilter.some(function (el) {
                                if (el.role === user.user_meta.role) {
                                    data.push(userobj);
                                }
                            });

                        }
                        else {
                            data.push(userobj);
                        }
                    }
                });

                $q.all(promises).then(
                    function (res) {
                        if(res) {

                            if(data.length < paginationOptions.pageSize && !$scope.isCurrPageEmpty){
                                paginationOptions.pageNumber ++;
                                $scope.getUserDetails();
                            }
                            else {
                                $scope.gridQOptions.data = data;
                                $scope.isTableLoading = 1;
                            }
                        }
                    }
                );
            }

        });


    };

    $scope.userList = [];

    $scope.roleFilterData = [{'role':'admin'},{'role':'agent'},{'role':'supervisor'}];

    $scope.querySearchRoles = function (query) {
        if (query === "*" || query === "") {
            if ($scope.roleFilterData) {
                return $scope.roleFilterData;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.roleFilterData) {
                var filteredArr = $scope.roleFilterData.filter(function (item) {
                    //var regEx = "^(" + query + ")";

                    if (item.role) {
                        return item.role.match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };


    // $scope.getTableHeight = function () {
    //     var rowHeight = 30; // row height
    //     var headerHeight = 50; // header height
    //     return {
    //         height: (($scope.gridQOptions.data.length + 2) * rowHeight + headerHeight) + "px"
    //     };
    // };
    $scope.getTableHeight = function() {
        var rowHeight = 30;
        var headerHeight = 50; // your header height
        var height = 300 + headerHeight;
        // if ($scope.grid1Api.core.getVisibleRows().length * rowHeight > 200){
        //     height = $scope.grid1Api.core.getVisibleRows().length * rowHeight + headerHeight;
        // }
        return "height:" + height + "px !important;"
    };
    $scope.gridQOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableExpandable: true,
        enableColumnResizing: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false, enableHorizontalScrollbar: true,
        columnDefs: [
            {
                enableFiltering: true,
                width: '150',
                name: 'Business Unit',
                field: 'buName',
                grouping: { groupPriority: 2 },
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 1
                },
                headerTooltip: 'Business Unit'
            },
            {
                enableFiltering: false,
                width: '80',
                name: 'Role ',
                field: 'role',
                grouping: { groupPriority: 3 },
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 2
                },
                headerTooltip: 'Role'
            },
            {
                enableFiltering: false,
                width: '120',
                name: 'User Group ',
                field: 'groupName',
                headerTooltip: 'User Group',
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 3
                },
            },
            {
                enableFiltering: true,
                width: '150',
                name: 'User',
                field: 'username',
                headerTooltip: 'User',
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 4
                },
            },
            {
                enableFiltering: true,
                width: '120',
                name: 'SIP Account',
                field: 'sipAccount',
                headerTooltip: 'SIP Account'
            },
            {
                enableFiltering: false,
                width: '100',
                name: 'Created Date',
                field: 'createdDate',
                headerTooltip: 'Created Date',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.createdDate| date:'MM/dd/yyyy'}}</div>"
            }, {
                enableFiltering: false,
                width: '100',
                name: 'Updated Date',
                field: 'updatedDate',
                headerTooltip: 'Updated Date',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.updatedDate| date:'MM/dd/yyyy'}}</div>"
            }
        ],
        data: [],
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
            $scope.isCurrPageEmpty = false;
            gridApi.core.on.scrollEnd($scope, function (row) {
                if (row.y.percentage > 0.95 && !$scope.isCurrPageEmpty) { // if vertical scroll bar reaches 95% this triggers
                    paginationOptions.pageNumber++;
                    $scope.getUserDetails(false);
                }
            });
        }
    };

};
    app.controller('userReportCtrl', userReportCtrl);

}());
