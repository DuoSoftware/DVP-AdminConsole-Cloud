mainApp.filter('stringdateToDateTime', [function () {
    return function (date) {
        return new Date(date)
    };
}]);

mainApp.controller("campaigns_real_time_monitor_controller", function ($state, $scope, $q, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService, uiGridConstants, subscribeServices, dashboardService, ShareData, contactService) {

    $anchorScroll();
    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    //$filter('date')(date, format, timezone)

    var startTimeTemplate = "<div>{{row.entity.StartTime|stringdateToDateTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";
    var endTimeTimeTemplate = "<div>{{row.entity.EndTime|stringdateToDateTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";

    var viewTemplate = '<i class="fa fa-external-link cursor-pointer" ng-click="grid.appScope.view_campaign(grid, row)" title="More Details"></i>';
    /*var viewTemplate =  '<div class="campaign-edit-btn" title="More Details" ng-click="grid.appScope.view_campaign(grid, row)"><i class="ti-more-alt" title="More Details"></i></div>';*/

    $scope.view_campaign = function (grid, row) {
        $state.go('console.campaigndashboard', {
            campaignid: row.entity.CampaignId,
            campaignname: row.entity.CampaignName
        });
    };

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.height_px = "500px !important";
    $scope.getTableHeight = function () {
        return $scope.height_px;
        /* var rowHeight = 30; // your row height
         var headerHeight = 30; // your header height
         $scope.height_px = ($scope.gridQOptions.data.length * rowHeight + headerHeight) + "px !important";
         return {
             height: ($scope.gridQOptions.data.length * rowHeight + headerHeight) + "px"
         };*/
    };

    $scope.gridQOptions = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        multiSelect: true,
        modifierKeysToMultiSelect: false,
        noUnselect: false, showGridFooter: true,
        columnDefs: [{
            enableSorting: true, enableFiltering: false,
            name: 'CampaignId',
            field: 'CampaignId',
            headerTooltip: 'Campaign ID',
            cellClass: 'table-number'
        }, {
            enableSorting: true, enableFiltering: true,
            name: 'CampaignName',
            field: 'CampaignName',
            headerTooltip: 'Campaign Name',
            width: '15%',
            sort: {
                direction: uiGridConstants.ASC
            }
        },
            {
                enableSorting: true, enableFiltering: true,
                name: 'CampaignMode',
                field: 'CampaignMode',
                headerTooltip: 'Campaign Mode'
            },
            {
                enableSorting: true, enableFiltering: true,
                name: 'OperationalStatus',
                field: 'OperationalStatus',
                headerTooltip: 'Operational Status',

            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'CampaignChannel',
                field: 'CampaignChannel',
                headerTooltip: 'Campaign Channel'
            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'Extension',
                field: 'Extension',
                headerTooltip: 'Extension',
                cellClass: 'table-number'
            }, {
                enableSorting: true, enableFiltering: false,
                name: 'DialoutMechanism',
                field: 'DialoutMechanism',
                headerTooltip: 'Dialout Mechanism'
            },
            {
                enableSorting: true, enableFiltering: false,
                name: 'StartTime',
                field: 'StartTime',
                headerTooltip: 'Start Time',
                cellTemplate: startTimeTemplate,
                cellClass: 'table-time',
                width: '130'
            },
            {
                enableSorting: true, enableFiltering: false,
                name: 'EndTime',
                field: 'EndTime',
                headerTooltip: 'End Time',
                cellTemplate: endTimeTimeTemplate,
                cellClass: 'table-time',
                width: '130'
            }, {
                enableSorting: true, enableFiltering: false,
                name: '',
                field: 'CampaignId',
                headerTooltip: 'View',
                cellTemplate: viewTemplate,
                cellClass: 'table-time',
                width: '25'
            }],
        data: [{test: "loading"}],
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    //$scope.selected_campaigns[row.entity.CampaignId] = row.entity;
                    $scope.selected_campaigns.push(row.entity);
                    // $state.go('console.campaigndashboard', {campaignid: row.entity.CampaignId,campaignname:row.entity.CampaignName});
                } else {
                    // delete $scope.selected_campaigns[row.entity];
                    var index = $scope.selected_campaigns.indexOf(row.entity);
                    $scope.selected_campaigns.splice(index, 1);
                    if ($scope.selected_campaigns.length === 0) {
                        $scope.grid1Api.selection.clearSelectedRows();
                        load_default_data();
                        //$scope.GetOngoinCampignList('ALL');
                    }
                }
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                if(gridApi.grid.selection.selectAll){
                    load_default_data();
                }
            });
        }
    };

    $scope.set_selected_campaign = function () {
        $scope.gridQOptions.data = $scope.selected_campaigns;
        var cam_ids = $scope.selected_campaigns.map(function (value) {
            return value.CampaignId;
        });
        load_default_data(cam_ids);
    };

    $scope.selected_campaigns = [];
    $scope.queues = {test: "dasdas"};

    $scope.campaign_details = {};


    var setDonutData = function () {
        try {
            /*myObject.setOption({
                series: [{
                    data:[{name: "ProfilesCount",value: $scope.ProfilesCount},{name:"ProfileLoaded", value:$scope.ProfileLoaded},{name: "ContactLoaded",value: $scope.ContactLoaded},{name:"ContactRejected",value:$scope.total_contact_rejected},{name: "ProfileRejected",value: $scope.ProfileRejected},{name: "Dialed",value: $scope.total_dialed},{name: "Dialing",value: $scope.total_dialings}]
                }]
            });*/
            /* myObject.data.datasets[0].data= [$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.total_dialings]*/
            // hide profile wise count till implement in dialer side,
           // myObject.data.datasets[0].data = [$scope.ProfilesCount, $scope.ProfileLoaded, $scope.ProfileRejected, $scope.ContactCount, $scope.ContactLoaded, $scope.total_contact_rejected, $scope.total_dialed, $scope.total_dialings]

            myChart.data.datasets[0].data = [$scope.ProfilesCount, $scope.ContactLoaded, $scope.total_dialed,$scope.total_answered, $scope.total_contact_rejected,$scope.total_callback_dialed,$scope.total_callback_answered,$scope.total_callback_contact_rejected];
            myChart.options.scales.yAxes[0].ticks.min = Math.floor((Math.min.apply(this, myChart.data.datasets[0].data) * 0.6));
            myChart.options.scales.yAxes[0].ticks.max = Math.max.apply(this, myChart.data.datasets[0].data) + Math.ceil((Math.max.apply(this, myChart.data.datasets[0].data)* 0.05));
            myChart.options.scales.yAxes[0].ticks.stepSize =  Math.floor((Math.max.apply(this, myChart.data.datasets[0].data)) * 0.1);

            myChart.update();
        } catch (ex) {
            console.log(ex);
        }
    };

    // implement with data array. need test concurrency issue. if any case use key value pair
    subscribeServices.subscribeDashboard('dashboard', function (event) {
        console.info(event);

        $scope.safeApply(function () {
            switch (event.roomName) {
                case "DIALER:RealTimeCampaignEvents": {

                    var cam_obj = $scope.gridQOptions.data.find(x => x.CampaignId === event.Message.CampaignId);
                    console.info(cam_obj);
                    /*$scope.safeApply(function () {
                        switch (event.eventName) {
                            case "UPDATE_CAMPAIGN": {
                                if (cam_obj)
                                    cam_obj.OperationalStatus = event.Message.OperationalStatus;
                                break;
                            }
                            case "NEW_CAMPAIGN": {
                                if (!cam_obj)
                                    $scope.gridQOptions.data.push(event.Message);
                                break;
                            }
                            case "REMOVE_CAMPAIGN": {
                                if (cam_obj) {
                                    var index = $scope.gridQOptions.data.indexOf(cam_obj);
                                    $scope.gridQOptions.data.splice(index, 1);
                                }
                                break;
                            }
                        }
                        $scope.grid1Api.grid.refresh();
                    })*/

                    switch (event.eventName) {
                        case "UPDATE_CAMPAIGN": {
                            if (cam_obj)
                                cam_obj.OperationalStatus = event.Message.OperationalStatus;
                            break;
                        }
                        case "NEW_CAMPAIGN": {
                            if (!cam_obj) {
                                $scope.gridQOptions.data.push(event.Message);
                                $scope.getTableHeight();
                            }
                            break;
                        }
                        case "REMOVE_CAMPAIGN": {
                            if (cam_obj) {
                                var index = $scope.gridQOptions.data.indexOf(cam_obj);
                                $scope.gridQOptions.data.splice(index, 1);
                                $scope.getTableHeight();
                            }
                            break;
                        }
                    }
                    $scope.grid1Api.grid.refresh();
                }
                    break;

                case "CAMPAIGNCONNECTED:TotalCount": {
                    if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "BASIC") {
                        $scope.total_answered = event.Message.TotalCountParam2;
                    }
                    else if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "CALLBACK") {
                        $scope.total_callback_answered = event.Message.TotalCountParam2;
                    }
                }
                    break;
                case "CAMPAIGNCONNECTED:CurrentCount": {
                    if (event.Message && event.eventName === "CurrentCount" && event.Message.param2 === "BASIC") {
                        $scope.total_connected = event.Message.CurrentCountParam2;
                    }
                    else if (event.Message && event.eventName === "CurrentCount" && event.Message.param2 === "CALLBACK") {
                        $scope.total_callback_connected = event.Message.CurrentCountParam2;
                    }
                }
                    break;
                case "CAMPAIGNDIALING:CurrentCount": {
                    if (event.Message && event.eventName === "CurrentCount" && event.Message.param2 === "BASIC") {
                        $scope.total_dialings = event.Message.CurrentCountParam2;

                    }
                    else if (event.Message && event.eventName === "CurrentCount" && event.Message.param2 === "CALLBACK") {
                        $scope.total_callback_dialings = event.Message.CurrentCountParam2;

                    }
                }
                    break;

                case "CAMPAIGNDIALING:TotalCount": {
                    if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "BASIC") {
                        $scope.total_dialed = event.Message.TotalCountParam2;

                    }
                    else if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "CALLBACK") {
                        $scope.total_callback_dialed = event.Message.TotalCountParam2;

                    }
                }
                    break;
                case "CAMPAIGNNUMBERSTAKEN:TotalCount": {
                    if (event.Message && event.eventName === "TotalCount" ) {
                        $scope.ContactLoaded = event.Message.TotalCountWindow;
                    }
                    /*if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "BASIC") {
                        $scope.ContactLoaded = event.Message.TotalCountWindow;

                    }else if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "CALLBACK") {
                        $scope.callback_ContactLoaded = event.Message.TotalCountWindow;

                    }*/
                }
                    break;
                case "CAMPAIGNREJECTED:TotalCount": {
                    if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "BASIC") {
                        $scope.total_contact_rejected = event.Message.TotalCountParam2;

                    }else if (event.Message && event.eventName === "TotalCount" && event.Message.param2 === "CALLBACK") {
                        $scope.total_callback_contact_rejected = event.Message.TotalCountParam2;

                    }

                }
                break;
                case "PROFILES:PROFILESCOUNT": {
                    if (event.Message &&  event.eventName === "PROFILESCOUNT" ) {
                        $scope.ProfilesCount  = event.Message.TotalCountWindow;
                    }
                }break;

                case "PROFILESCONTACTS:PROFILESCONTACTSCOUNT": {
                    if (event.Message &&  event.eventName === "PROFILESCONTACTSCOUNT" ) {
                        $scope.ContactCount = event.Message.TotalCountWindow;
                    }
                }break;
            }
            $scope.getTableHeight();
            setDonutData();
        });

    });

    $scope.isProgress = false;
    $scope.GetOngoinCampignList = function (value) {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');
        $scope.selected_campaigns = [];

        campaignService.GetOngoinCampignList(value).then(function (response) {

            if (response) {
                $scope.grid1Api.selection.clearSelectedRows();
                $scope.gridQOptions.data = response;
                $scope.grid1Api.grid.refresh();
                /*if (value === "ALL") {
                    $scope.gridQOptions.data = response;
                }
                else {
                    $scope.gridQOptions.data = $filter('filter')(response, {OperationalStatus: value}, true);
                }*/
            }
            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }, function (error) {
            $scope.showAlert("Campaign", 'error', "Fail To Campaign List");
            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none');
            console.error(error);
        });
    };


    $scope.ProfilesCount = 0;
    $scope.ProfileLoaded= 0;
    $scope.ProfileRejected =0;
    $scope.ContactCount =0;
    $scope.ContactLoaded =0;
    $scope.total_contact_rejected= 0;
    $scope.total_dialings = 0;
    $scope.total_connected = 0;
    $scope.total_dialed =0;
    $scope.total_answered = 0;
    $scope.total_callback_contact_rejected= 0;
    $scope.total_callback_dialings = 0;
    $scope.total_callback_connected = 0;
    $scope.total_callback_dialed =0;
    $scope.total_callback_answered = 0;
    $scope.total_dialing = 0;
    $scope.total_callback_dialing = 0;

    var load_default_data = function (cam_id) {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');

        var method_list = [];
        if(cam_id){

            angular.forEach(cam_id,function(item){
                method_list.push(contactService.ProfilesCount(item),contactService.ProfileLoadedCount(item),contactService.ProfileRejectCount(item),
                    contactService.ProfileContactsCount(item),contactService.ProfileContactLoadedCount(item),
                    contactService.ProfileContactRejectedCount(item,"BASIC"),
                    dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",item,"BASIC"),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",item,"BASIC"),
                    dashboardService.GetTotalCampaignCount("CAMPAIGNDIALING",item,"BASIC"),dashboardService.GetTotalCampaignCount("CAMPAIGNCONNECTED",item,"BASIC"),
                    contactService.ProfileContactRejectedCount(item,"CALLBACK"),
                    dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",item,"CALLBACK"),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",item,"CALLBACK"),
                    dashboardService.GetTotalCampaignCount("CAMPAIGNDIALING",item,"CALLBACK"),dashboardService.GetTotalCampaignCount("CAMPAIGNCONNECTED",item,"CALLBACK"));


            })
        }else{
            method_list = [contactService.ProfilesCount(null),contactService.ProfileLoadedCount(null),contactService.ProfileRejectCount(null),
                contactService.ProfileContactsCount(null),contactService.ProfileContactLoadedCount(null),
                contactService.ProfileContactRejectedCount(null,"BASIC"),
                dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",null,"BASIC"),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",null,"BASIC"),
                dashboardService.GetTotalCampaignCount("CAMPAIGNDIALING",null,"BASIC"),dashboardService.GetTotalCampaignCount("CAMPAIGNCONNECTED",null,"BASIC"),
                contactService.ProfileContactRejectedCount(null,"CALLBACK"),
                dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",null,"CALLBACK"),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",null,"CALLBACK"),
                dashboardService.GetTotalCampaignCount("CAMPAIGNDIALING",null,"CALLBACK"),dashboardService.GetTotalCampaignCount("CAMPAIGNCONNECTED",null,"CALLBACK"),$scope.GetOngoinCampignList("ALL")];

        }


        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
            if(cam_id){
                var i =0;
                angular.forEach(cam_id,function(item){
                    $scope.ProfilesCount = $scope.ProfilesCount + (resolveData[0+i].data && resolveData[0+i].data.IsSuccess)?resolveData[0+i].data.Result:0;
                    $scope.ProfileLoaded= $scope.ProfileLoaded + (resolveData[1+i].data && resolveData[1+i].data.IsSuccess)?resolveData[1+i].data.Result:0;
                    $scope.ProfileRejected =$scope.ProfileRejected + (resolveData[2+i].data && resolveData[2+i].data.IsSuccess)?resolveData[2+i].data.Result:0;

                    $scope.ContactCount =$scope.ContactCount + (resolveData[3+i].data && resolveData[3+i].data.IsSuccess)?resolveData[3+i].data.Result:0;
                    $scope.ContactLoaded =$scope.ContactLoaded + (resolveData[4+i].data && resolveData[4+i].data.IsSuccess)?resolveData[4+i].data.Result:0;// CAMPAIGNNUMBERSTAKEN GetTotalCampaignCount
                    $scope.total_contact_rejected= $scope.total_contact_rejected + (resolveData[5+i].data && resolveData[5+i].data.IsSuccess)?resolveData[5+i].data.Result:0;


                    $scope.total_dialings = $scope.total_dialings + resolveData[6+i];//CAMPAIGNDIALING  getCurrentCampaignCount
                    $scope.total_connected = $scope.total_connected + resolveData[7+i];//CAMPAIGNCONNECTED   getCurrentCampaignCount
                    $scope.total_dialed =$scope.total_dialed + resolveData[8+i]; // CAMPAIGNDIALING GetTotalCampaignCount
                    $scope.total_answered =$scope.total_answered +  resolveData[9+i];

                    $scope.total_callback_contact_rejected= $scope.total_callback_contact_rejected + (resolveData[10+i].data && resolveData[10+i].data.IsSuccess)?resolveData[10+i].data.Result:0;
                    $scope.total_callback_dialings =$scope.total_callback_dialings +  resolveData[11+i];//CAMPAIGNDIALING  getCurrentCampaignCount
                    $scope.total_callback_connected =$scope.total_callback_connected +  resolveData[12+i];//CAMPAIGNCONNECTED   getCurrentCampaignCount
                    $scope.total_callback_dialed =$scope.total_callback_dialed + resolveData[13+i]; // CAMPAIGNDIALING GetTotalCampaignCount
                    $scope.total_callback_answered =$scope.total_callback_answered +  resolveData[14+i];
                    i = i+15;
                })
            }else{
                $scope.ProfilesCount = (resolveData[0].data && resolveData[0].data.IsSuccess)?resolveData[0].data.Result:0;
                $scope.ProfileLoaded= (resolveData[1].data && resolveData[1].data.IsSuccess)?resolveData[1].data.Result:0;
                $scope.ProfileRejected =(resolveData[2].data && resolveData[2].data.IsSuccess)?resolveData[2].data.Result:0;

                $scope.ContactCount =(resolveData[3].data && resolveData[3].data.IsSuccess)?resolveData[3].data.Result:0;
                $scope.ContactLoaded =(resolveData[4].data && resolveData[4].data.IsSuccess)?resolveData[4].data.Result:0;// CAMPAIGNNUMBERSTAKEN GetTotalCampaignCount
                $scope.total_contact_rejected= (resolveData[5].data && resolveData[5].data.IsSuccess)?resolveData[5].data.Result:0;


                $scope.total_dialings = resolveData[6];//CAMPAIGNDIALING  getCurrentCampaignCount
                $scope.total_connected = resolveData[7];//CAMPAIGNCONNECTED   getCurrentCampaignCount
                $scope.total_dialed =resolveData[8]; // CAMPAIGNDIALING GetTotalCampaignCount
                $scope.total_answered = resolveData[9];

                $scope.total_callback_contact_rejected= (resolveData[10].data && resolveData[10].data.IsSuccess)?resolveData[10].data.Result:0;
                $scope.total_callback_dialings = resolveData[11];//CAMPAIGNDIALING  getCurrentCampaignCount
                $scope.total_callback_connected = resolveData[12];//CAMPAIGNCONNECTED   getCurrentCampaignCount
                $scope.total_callback_dialed =resolveData[13]; // CAMPAIGNDIALING GetTotalCampaignCount
                $scope.total_callback_answered = resolveData[14];
            }
                $scope.echartDonutSetOption({
                    ResourceId: "ResourceId123",
                    /*data:[{name: "ProfilesCount",value: $scope.ProfilesCount},{name:"ProfileLoaded", value:$scope.ProfileLoaded},{name: "ProfileRejected",value: $scope.ProfileRejected},{name: "ContactLoaded",value: $scope.ContactLoaded},{name:"ContactRejected",value:$scope.total_contact_rejected},{name: "Dialed",value: $scope.total_dialed},{name: "Dialing",value: $scope.total_dialings}]*/
                    // hide profile wise count till implement in dialer side,
                    /* data:[$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.total_dialings]*/
                    data: [$scope.ProfilesCount, $scope.ContactLoaded, $scope.total_dialed,$scope.total_answered, $scope.total_contact_rejected,$scope.total_callback_dialed,$scope.total_callback_answered,$scope.total_callback_contact_rejected]
                    //'ProfilesCount', 'Dialed', 'ContactLoaded', 'ProfileRejected', 'Dialing'
                });
            }

            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }).catch(function (err) {
            console.error(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.");
        });

        /*var method_list = [contactService.ProfilesCount(null),contactService.ProfileLoadedCount(null),contactService.ProfileRejectCount(null),
            contactService.ProfileContactsCount(null),contactService.ProfileContactLoadedCount(null),
            contactService.ProfileContactRejectedCount(null,"BASIC"),
            dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",null,"BASIC"),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",null,"BASIC"),
            dashboardService.GetTotalCampaignCount("CAMPAIGNDIALING",null,"BASIC"),dashboardService.GetTotalCampaignCount("CAMPAIGNCONNECTED",null,"BASIC"),
            contactService.ProfileContactRejectedCount(null,"CALLBACK"),
            dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",null,"CALLBACK"),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",null,"CALLBACK"),
            dashboardService.GetTotalCampaignCount("CAMPAIGNDIALING",null,"CALLBACK"),dashboardService.GetTotalCampaignCount("CAMPAIGNCONNECTED",null,"CALLBACK"),$scope.GetOngoinCampignList("ALL")];


        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {



                $scope.ProfilesCount = (resolveData[0].data && resolveData[0].data.IsSuccess)?resolveData[0].data.Result:0;
                $scope.ProfileLoaded= (resolveData[1].data && resolveData[1].data.IsSuccess)?resolveData[1].data.Result:0;
                $scope.ProfileRejected =(resolveData[2].data && resolveData[2].data.IsSuccess)?resolveData[2].data.Result:0;

                $scope.ContactCount =(resolveData[3].data && resolveData[3].data.IsSuccess)?resolveData[3].data.Result:0;
                $scope.ContactLoaded =(resolveData[4].data && resolveData[4].data.IsSuccess)?resolveData[4].data.Result:0;// CAMPAIGNNUMBERSTAKEN GetTotalCampaignCount
                $scope.total_contact_rejected= (resolveData[5].data && resolveData[5].data.IsSuccess)?resolveData[5].data.Result:0;


                $scope.total_dialings = resolveData[6];//CAMPAIGNDIALING  getCurrentCampaignCount
                $scope.total_connected = resolveData[7];//CAMPAIGNCONNECTED   getCurrentCampaignCount
                $scope.total_dialed =resolveData[8]; // CAMPAIGNDIALING GetTotalCampaignCount
                $scope.total_answered = resolveData[9];

                $scope.total_callback_contact_rejected= (resolveData[10].data && resolveData[10].data.IsSuccess)?resolveData[10].data.Result:0;
                $scope.total_callback_dialings = resolveData[11];//CAMPAIGNDIALING  getCurrentCampaignCount
                $scope.total_callback_connected = resolveData[12];//CAMPAIGNCONNECTED   getCurrentCampaignCount
                $scope.total_callback_dialed =resolveData[13]; // CAMPAIGNDIALING GetTotalCampaignCount
                $scope.total_callback_answered = resolveData[14];



                $scope.echartDonutSetOption({
                    ResourceId: "ResourceId123",
                    /!*data:[{name: "ProfilesCount",value: $scope.ProfilesCount},{name:"ProfileLoaded", value:$scope.ProfileLoaded},{name: "ProfileRejected",value: $scope.ProfileRejected},{name: "ContactLoaded",value: $scope.ContactLoaded},{name:"ContactRejected",value:$scope.total_contact_rejected},{name: "Dialed",value: $scope.total_dialed},{name: "Dialing",value: $scope.total_dialings}]*!/
                    // hide profile wise count till implement in dialer side,
                    /!* data:[$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.total_dialings]*!/
                    data: [$scope.ProfilesCount, $scope.ContactLoaded, $scope.total_dialed,$scope.total_answered, $scope.total_contact_rejected,$scope.total_callback_dialed,$scope.total_callback_answered,$scope.total_callback_contact_rejected]
                    //'ProfilesCount', 'Dialed', 'ContactLoaded', 'ProfileRejected', 'Dialing'
                });
            }

            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }).catch(function (err) {
            console.error(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.");
        });*/
    };


    var myObject = {};
    var myChart = {};
    $scope.echartDonutSetOption = function (campaign) {
        var ctx = document.getElementById('myChart').getContext('2d');
        myObject = {
            type: 'bar',

            data: {
                /*labels: ['ProfilesCount', 'ProfileLoaded', 'ProfileRejected', 'ContactCount', 'ContactLoaded', 'ContactRejected', 'Dialed', 'Dialing'],*/
                // hide profile wise count till implement in dialer side,
                labels: ['Uploaded', 'Loaded',  'Dialed','Answered','Rejected','CB-Dialed','CB-Answered','CB-Rejected'],
                datasets: [
                    {
                        label: "Total Count",
                        backgroundColor: [
                            'rgba(43, 201, 226, 1)',
                            'rgba(231, 133, 94, 1)',
                            'rgba(93, 121, 152, 1)',
                            'rgba(174, 231, 118, 1)',
                            'rgba(251, 206, 139, 1)',
                            'rgba(34, 52, 72, 1)',
                            'rgba(23, 23, 90, 1)',
                            'rgba(344, 34, 54, 1)',
                            'rgba(251, 230, 23, 1)',
                            'rgba(34, 52, 72, 1)'
                        ],borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(56, 324, 54, 1)',
                            'rgba(46, 23, 200, 1)',
                            'rgba(150, 52, 100, 1)',
                            'rgba(100, 25, 23, 1)'
                        ],
                        borderWidth: 1,
                        data: campaign.data
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: true
                },
                /*events: [  'click'],*/
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            min:Math.floor((Math.min.apply(this, campaign.data) * 0.6)),
                            max: Math.max.apply(this, campaign.data) + Math.floor((Math.max.apply(this, campaign.data)* 0.05)),
                            stepSize : Math.floor((Math.max.apply(this, campaign.data)) * 0.1)
                        },
                        /*ticks: {
                            min: 0,
                            stepSize: 100
                        },*/
                        gridLines: {
                            show: true,
                            color: "rgba(255,99,132,0.2)"
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            show: true,
                            color: "#F3F3F3"
                        }
                    }]
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: '#485465',
                        FontFamily: "Ubuntu-Regular'"
                    }
                },
                grid: {
                    borderWidth: 1,
                    borderColor: '#fff',
                    show: true
                }
            }
        };
        myChart = new Chart(ctx, myObject);

        myChart.options.scales.yAxes[0].ticks.min = Math.floor((Math.min.apply(this, myChart.data.datasets[0].data) * 0.6));
        myChart.options.scales.yAxes[0].ticks.max = Math.max.apply(this, myChart.data.datasets[0].data) + Math.ceil((Math.max.apply(this, myChart.data.datasets[0].data)* 0.05));
        myChart.options.scales.yAxes[0].ticks.stepSize =  Math.floor((Math.max.apply(this, myChart.data.datasets[0].data)) * 0.1);
    };

    $scope.echartDonutSetOption({
        ResourceId: "ResourceId123",
        /*data:[{name: "ProfilesCount",value:0},{name: ",ProfileLoaded",value: 0},{name: "ProfileRejected",value: 0},{name: "ContactLoaded",value: 0},{name:"ContactRejected",value:0},{name: "Dialed",value: 0},{name: "Dialing",value: 0}]*/
        data: [0, 0, 0, 0, 0, 0, 0,0,0,0]

    });

    /*var load_donut_data = function () {
        var method_list = [contactService.ProfileContactsCount(),contactService.ProfileContactDialedCount(),contactService.ProfileContactLoadedCount(),contactService.ProfileContactRejectedCount(),contactService.ProfileContactDailingCount()];
        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
                $scope.echartDonutSetOption({
                    ResourceId:"ResourceId123",
                    data:[{name: "ProfilesCount",value: (resolveData[0].data && resolveData[0].data.IsSuccess)?resolveData[0].data.Result:0},{name: "Dialed",value: (resolveData[1].data && resolveData[1].data.IsSuccess)?resolveData[1].data.Result:0},{name: "ContactLoaded",value: (resolveData[2].data && resolveData[2].data.IsSuccess)?resolveData[2].data.Result:0},{name: "ProfileRejected",value: (resolveData[3].data && resolveData[3].data.IsSuccess)?resolveData[3].data.Result:0},{name: "Dialing",value: (resolveData[4].data && resolveData[4].data.IsSuccess)?resolveData[4].data.Result:0}]
                    //'ProfilesCount', 'Dialed', 'ContactLoaded', 'ProfileRejected', 'Dialing'
                });
            }

        }).catch(function (err) {
            console.error(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.");
        });
    };
    load_donut_data();*/

    load_default_data();

    $scope.$watch(function () {
        return ShareData.BusinessUnit;
    }, function (newValue, oldValue) {
        if (newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()) {
            load_default_data();
        }
    });
});
