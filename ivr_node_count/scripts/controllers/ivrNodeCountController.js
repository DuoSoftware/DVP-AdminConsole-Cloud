mainApp.controller('ivrNodeCountController', ['$scope', '$filter', '$anchorScroll', 'ivrNodeCountService', function ($scope, $filter, $anchorScroll, ivrNodeCountService) {
    $anchorScroll();

    $scope.intiate = true;
    var viweWidth = 0;
    $scope.reportLayoutWidth = 0;

    var setReportUIwidth = function () {
        viweWidth = getWindowWidth();
        if (viweWidth > 1500) {
            viweWidth = viweWidth - 360
        } else {
            viweWidth = viweWidth - 350
        }

        $scope.reportLayoutWidth = viweWidth + "px";
    };

    // search
    $scope.StartTime = {
        date: new Date()
    };
    $scope.EndTime = {
        date: new Date()
    };
    $scope.openCalendar = function (name) {
        if (name == 'StartTime') {
            $scope.StartTime.open = true;
        }
        else {
            $scope.EndTime.open = true;
        }

    };
    var d = new Date();
    d.setDate(d.getDate() - 1);
    $scope.fileSerach = {};
    $scope.fileSerach.StartTime = moment().format("YYYY-MM-DD");
    $scope.fileSerach.EndTime = moment().format("YYYY-MM-DD");
    // search end

    var showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.applicationList = [];
    $scope.application = {};
    var GetApplicationList = function () {

        ivrNodeCountService.GetApplicationList().then(function (response) {
            if (response) {
                $scope.applicationList = response;
                if ($scope.applicationList) {
                    if ($scope.applicationList.length > 0) {
                        $scope.application = $scope.applicationList[0].id;
                    }
                }
            }
            else {
                showAlert("IVR", "error", "Fail To Get Application List.");
            }
        }, function (err) {
            showAlert("IVR", "error", "Fail To Get Application List.");
        });
    };
    GetApplicationList();


    $scope.doughnutObj = {labels: [], data: [], node: []};
    $scope.options = {
        type: 'doughnut',
        responsive: false,
        legend: {
            display: true,
            position: 'bottom',
            padding: 5,
            labels: {
                fontColor: 'rgb(130, 152, 174)',
                fontSize: 10,
                boxWidth: 10
            }
        },
        title: {
            display: true
        }
    };

    $scope.isLoading = false;

    $scope.LoadNodeData = function () {
    	
        if (!$scope.application) {
            showAlert("IVR", "error", "Please Select Application");
            return
        }

        if ($scope.fileSerach.StartTime >= $scope.fileSerach.EndTime) {
            showAlert("IVR", "error", "End time should be greater than start time.");
            return
        }

        var nodeList = $scope.tags.map(function (t) {
            return t.Name
        });

        var nods = {
            "nodes": nodeList
        };

        $scope.intiate = false;
        $scope.isLoading = true;
        ivrNodeCountService.GetIvrNodeCount($scope.application, $scope.fileSerach.StartTime, $scope.fileSerach.EndTime,nods).then(function (response) {
            $scope.isLoading = false;
            if (response) {
                $scope.doughnutObj = {labels: [], data: [], node: []};
                angular.forEach(response, function (item) {
                    if (item) {
                        item.EventParams = item.EventParams ? item.EventParams : "Other";
                        $scope.doughnutObj.labels.push(item.EventParams);
                        $scope.doughnutObj.data.push(item.count);
                        $scope.doughnutObj.node.push(item);

                    }
                });

            }
            else {
                $scope.noDataToshow = true;
            }
        }, function (err) {
            showAlert("IVR", "error", "Fail To Get Node Count.");
        });

        $scope.getPageData("", $scope.currentPage, $scope.pageSize, $scope.pageTotal);

        //set window view point
        setReportUIwidth();


    };


    $scope.LoadDataByNode = function (eventParams) {
        $('.widget-dy-wrp').removeClass('active');
        $('#' + eventParams).addClass('active');
        $scope.tags = [];
        $scope.tags.push({
            "Name": eventParams,
            "Description": eventParams
        });
        $scope.LoadNodeData();
    };


    $scope.enableSearchButton = true;
    $scope.dtOptions = {paging: false, searching: false, info: false, order: [6, 'desc']};
    $scope.pageSizRange = [100, 500, 1000, 5000, 10000];
    $scope.isLoading = false;
    $scope.noDataToshow = false;
    $scope.showPaging = false;
    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = 100;
    $scope.satisfactionRequest = [];
    $scope.getPageData = function (Paging, page, pageSize, total) {
        $scope.isLoading = true;

        var nodeList = $scope.tags.map(function (t) {
            return t.Name
        });

        var nods = {
            "nodes": nodeList
        };

        ivrNodeCountService.GetEventByNodes($scope.application, $scope.fileSerach.StartTime, $scope.fileSerach.EndTime, page, pageSize, nods).then(function (response) {
            if (response.length > 0) {
                $scope.satisfactionRequest = response;
                $scope.showPaging = true;
            }
            else {
                $scope.satisfactionRequest = [];
                //$scope.noDataToshow = true;
            }
            $scope.satisfaction = "all";
            $scope.isLoading = false;
        }, function (err) {
            showAlert("IVR", "error", "Fail To Get IVR Details.");
        });
        GetEventByNodesCount($scope.application, $scope.fileSerach.StartTime, $scope.fileSerach.EndTime, page, pageSize, nods);
    };

    var GetEventByNodesCount = function (application, startTime, endTime, page, pageSize, nods) {
        ivrNodeCountService.GetEventByNodesCount(application, startTime, endTime, page, pageSize, nods).then(function (response) {
            $scope.pageTotal = response;
        }, function (err) {

            showAlert("IVR", "error", "Fail To Get Node Type.");
        });
    };


    $scope.nodesType = [];
    $scope.GetNodesType = function () {
        ivrNodeCountService.GetNodesType().then(function (response) {
            $scope.nodesType = response;
        }, function (err) {

            showAlert("IVR", "error", "Fail To Get Node Type.");
        });
    };
    $scope.GetNodesType();


    var emptyArr = [];
    $scope.tags = [];
    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.nodesType) {
                return $scope.nodesType;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.nodesType) {
                var filteredArr = $scope.nodesType.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.Name) {
                        return item.Name.match(regEx);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return emptyArr;
            }
        }

    };

    //set view point option
    window.onresize = function () {
        setReportUIwidth();
    }

}]);
