/**
 * Created by team veery on 9/22/2016.
 */

mainApp.filter('secondsToDateTime', [function () {
    return function (seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);

mainApp.controller('agentDashboardCtrl', function ($scope, $timeout, dashboardService, loginService, $anchorScroll) {

    $anchorScroll();

    /*charts Configurations */

    /* var data1 = [[1, 5], [2, 5], [3, 6], [4, 9], [5, 7], [6, 6], [7, 2], [8, 1], [9, 3]];
     var data2 = [[1, 4], [2, 8], [3, 7], [4, 5], [5, 7], [6, 5], [7, 2], [8, 1], [9, 3]];*/
    var data1 = [];
    var data2 = [];
    var doughnutObj = {labels: [], data: []};

    $scope.difCreateVsResolvedChartOptions = {
        grid: {
            borderWidth: 1,
            borderColor: '#fff',
            show: true
        },
        series: {fill: true, shadowSize: 0, color: "#ee407d"},
        color: {color: '#ee407d'},
        legend: {
            container: '#legend',
            show: true
        },
        yaxis: {
            min:0,
            color: '#F7F7F7'
        },
        xaxis: {
            color: '#F7F7F7',
            tickFormatter: function (val, axis) {
                return moment.unix(val).format("DD-MMM"); //moment.unix(val).date();
            }
        }
    };


    var createVsResolvedChartOptions = {
        grid: {
            borderWidth: 1,
            borderColor: '#F7F7F7',
            show: true,
            hoverable: true,  autoHighlight: true
        },
        series: {
            lines: {show: true, fill: true, color: "#114858"},
            points: {show: true},
            shadowSize: 0
        },
        color: {color: '#63a5a2'},
        legend: {
            show: true
        },
        yaxis: {
            min: 0,
            color: '#F7F7F7',
            /*title: 'Ticket Count',  titleTextStyle: {color: '#333'}*/
        }, xaxis: {
            color: '#F7F7F7',
            /*title: 'Day',  titleTextStyle: {color: '#333'},*/
            tickFormatter: function (val, axis) {
                return moment.unix(val).format("DD-MMM");// moment.unix(val).date();
            }
        },
        hover: {
            mode: 'label'
        },
        tooltip: true,
        tooltipOpts: {
            content: function(label, xval, yval, flotItem){
                return "Orders <b>"+yval+"</b> for <span>"+chartData.axis[xval][1]+"</span>"
            },
            shifts: {
                x: -30,
                y: -50
            }
        }
    };

    var bindDataToChart = function () {
        var data = [
            {color: '#6a3390', data: data1, label: "Created", lines: {show: true}},
            {color: '#ee407d', data: data2, label: "Resolved", lines: {show: true}, points: {show: true}}
        ];
        chart = $.plot($("#createVsResolved"), data, createVsResolvedChartOptions);
        /*var axes = chart.getAxes();
         axes.xaxis.axisLabel = "test";
         axes.yaxis.axisLabel = "test111";
         // Redraw
         chart.setupGrid();
         chart.draw();*/
    };
    $(document).ready(function () {
        bindDataToChart();
    });
    $scope.ticketDif = [{
        data: [], lines: {
            fill: false,
            lineWidth: 2
        }
    }];

    $scope.getCreatedTicketSeries = function () {
        dashboardService.GetCreatedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                data1 = response.map(function (c, index) {
                    var item = [];
                    item[0] = c[1];
                    item[1] = c[0] ? c[0] : 0;
                    return item;
                });
                bindDataToChart();
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            console.log(err);
        });
    };
    $scope.getCreatedTicketSeries();

    $scope.getResolvedTicketSeries = function () {
        dashboardService.GetResolvedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                data2 = response.map(function (c, index) {
                    var item = [];
                    item[0] = c[1];
                    item[1] = c[0] ? c[0] : 0;
                    return item;
                });
                bindDataToChart();
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            console.log(err);
        });
    };
    $scope.getResolvedTicketSeries();

    $scope.getDeferenceResolvedTicketSeries = function () {
        dashboardService.GetDeferenceResolvedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.ticketDif[0].data = response.map(function (c, index) {
                    var item = [];
                    item[0] = c[1];
                    item[1] = c[0] ? c[0] : 0;
                    if (item[1] < 0 && item[1] < $scope.difCreateVsResolvedChartOptions.yaxis.min)
                        $scope.difCreateVsResolvedChartOptions.yaxis.min = item[1];
                    return item;
                });

            }
        }, function (err) {
            loginService.isCheckResponse(err);
            console.log(err);
        });
    };
    $scope.getDeferenceResolvedTicketSeries();

    $scope.removeDuplicate = function (key) {
        var index = doughnutObj.labels.indexOf(key);
        if (index > -1) {
            doughnutObj.labels.splice(index, 1);
            doughnutObj.data.splice(index, 1);
        }
    }

    /*charts Configurations  End ------------*/


    $scope.newTicket = 0;
    $scope.getNewTicketCount = function () {
        dashboardService.GetTicketCount("NEWTICKET").then(function (response) {
            if (response) {
                $scope.newTicket = response;
                if ($scope.newTicket > 0) {
                    calculateReopenPercentage();
                    SlaCompliance();
                }
            }
            else {
                $scope.newTicket = 0;
            }
            //config Doughnut  data


            $scope.removeDuplicate("New");

            doughnutObj.labels.push("New");
            doughnutObj.data.push($scope.newTicket);


        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.newTicket = 0;
            console.log(err);
        });
    };
    $scope.getNewTicketCount();

    $scope.totalTicket = 0;
    $scope.getNewTicketCount = function () {
        dashboardService.GetTotalTicketCount("NEWTICKET").then(function (response) {
            if (response) {
                $scope.totalTicket = response;
            }
            else {
                $scope.totalTicket = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.totalTicket = 0;
            console.log(err);
        });
    };
    $scope.getNewTicketCount();

    $scope.totalCloseTicket = 0;
    $scope.getCloseTicketCount = function () {
        dashboardService.GetTotalTicketCount("CLOSEDTICKET").then(function (response) {
            if (response) {
                $scope.totalCloseTicket = response;
            }
            else {
                $scope.totalCloseTicket = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.totalCloseTicket = 0;
            console.log(err);
        });
    };
    $scope.getCloseTicketCount();

    $scope.openTicket = 0;
    $scope.getOpenTicketCount = function () {
        dashboardService.GetTicketCount("OPENTICKET").then(function (response) {
            if (response) {
                $scope.openTicket = response;
            }
            else {
                $scope.openTicket = 0;
            }
            //config Doughnut  data
            $scope.removeDuplicate("Open");
            doughnutObj.labels.push("Open");
            doughnutObj.data.push($scope.openTicket);
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.openTicket = 0;
            console.log(err);
        });
    };
    $scope.getOpenTicketCount();

    $scope.solvedTicket = 0;
    $scope.getSolvedTicketCount = function () {
        dashboardService.GetTicketCount("SOLVEDTICKET").then(function (response) {
            if (response) {
                $scope.solvedTicket = response;
            }
            else {
                $scope.solvedTicket = 0;
            }
            //config Doughnut  data
            $scope.removeDuplicate("Resolved");

            doughnutObj.labels.push("Resolved");
            doughnutObj.data.push($scope.solvedTicket);
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.solvedTicket = 0;
            console.log(err);
        });
    };
    $scope.getSolvedTicketCount();

    $scope.reopenTicket = 0;
    $scope.getReopenTicketCount = function () {
        dashboardService.GetTicketCount("REOPENTICKET").then(function (response) {
            if (response) {
                $scope.reopenTicket = response;
                if ($scope.newTicket > 0) {
                    calculateReopenPercentage();
                }
            }
            else {
                $scope.reopenTicket = 0;
            }
            //config Doughnut  data
            $scope.removeDuplicate("Reopen");

            doughnutObj.labels.push("Reopen");
            doughnutObj.data.push($scope.reopenTicket);
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.reopenTicket = 0;
            console.log(err);
        });
    };
    $scope.getReopenTicketCount();

    $scope.parkedTicket = 0;
    $scope.getParkedTicketCount = function () {
        dashboardService.GetTicketCount("PARKEDTICKET").then(function (response) {
            if (response) {
                $scope.parkedTicket = response;
            }
            else {
                $scope.parkedTicket = 0;
            }
            //config Doughnut  data
            $scope.removeDuplicate("Parked");

            doughnutObj.labels.push("Parked");
            doughnutObj.data.push($scope.parkedTicket);
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.parkedTicket = 0;
            console.log(err);
        });
    };
    $scope.getParkedTicketCount();

    $scope.progressTicket = 0;
    $scope.getProgressTicketCount = function () {
        dashboardService.GetTicketCount("PROGRESSINGTICKET").then(function (response) {
            if (response) {
                $scope.progressTicket = response;
            }
            else {
                $scope.progressTicket = 0;
            }
            //config Doughnut  data
            $scope.removeDuplicate("Progress");

            doughnutObj.labels.push("Progress");
            doughnutObj.data.push($scope.progressTicket);
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.progressTicket = 0;
            console.log(err);
        });
    };
    $scope.getProgressTicketCount();

    $scope.closedTicket = 0;
    $scope.getClosedTicketCount = function () {
        dashboardService.GetTicketCount("CLOSEDTICKET").then(function (response) {
            if (response) {
                $scope.closedTicket = response;
            }
            else {
                $scope.closedTicket = 0;
            }
            //config Doughnut  data
            $scope.removeDuplicate("Closed");

            doughnutObj.labels.push("Closed");
            doughnutObj.data.push($scope.closedTicket);
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.closedTicket = 0;
            console.log(err);
        });
    };
    $scope.getClosedTicketCount();

    $scope.firstCallResolution = 0;
    $scope.getFirstCallResolutionTicketCount = function () {
        dashboardService.GetTotalTicketCount("FIRSTCALLRESOLUTION").then(function (response) {
            if (response) {
                $scope.firstCallResolution = response;
            }
            else {
                $scope.firstCallResolution = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.firstCallResolution = 0;
            console.log(err);
        });
    };
    $scope.getFirstCallResolutionTicketCount();

    $scope.slaViolated = 0;
    $scope.getSlaViolatedTicketCount = function () {
        dashboardService.GetTotalTicketCount("SLAVIOLATED").then(function (response) {
            if (response) {
                $scope.slaViolated = response;
                if ($scope.newTicket > 0) {
                    SlaCompliance();
                }
            }
            else {
                $scope.slaViolated = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.slaViolated = 0;
            console.log(err);
        });
    };
    $scope.getSlaViolatedTicketCount();


    $scope.ticketResolutionTime = 0;
    $scope.getTicketResolutionTime = function () {
        dashboardService.GetTotalTicketAvg("TICKETRESOLUTION").then(function (response) {
            if (response) {
                $scope.ticketResolutionTime = response;
            }
            else {
                $scope.ticketResolutionTime = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketResolutionTime = 0;
            console.log(err);
        });
    };
    $scope.getTicketResolutionTime();

    $scope.averageResponseTime = 0;
    $scope.getAverageResponseTime = function () {
        dashboardService.GetTotalTicketAvg("NEWTICKET").then(function (response) {
            if (response) {
                $scope.averageResponseTime = response;
            }
            else {
                $scope.averageResponseTime = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.averageResponseTime = 0;
            console.log(err);
        });
    };
    $scope.getAverageResponseTime();

    $scope.ticketViaCall = 0;
    $scope.ticketViaCallCount = 0;
    $scope.getTicketViaCall = function () {
        dashboardService.GetNewTicketCountViaChannel("call").then(function (response) {
            if (response) {
                $scope.ticketViaCallCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaCall = ((response / $scope.totalTicket) * 100).toFixed(2);
            }
            else {
                $scope.ticketViaCall = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaCall = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaCall();

    $scope.ticketViaSms = 0;
    $scope.ticketViaSmsCount = 0;
    $scope.getTicketViaSms = function () {
        dashboardService.GetNewTicketCountViaChannel("sms").then(function (response) {
            if (response) {
                $scope.ticketViaSmsCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaSms = ((response / $scope.totalTicket) * 100).toFixed(2);
            }
            else {
                $scope.ticketViaSms = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaSms = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaSms();

    $scope.ticketViaFacebookTotal = 0;
    $scope.ticketViaFacebookTotalCount = 0;
    $scope.showFbDetail = false;
    $scope.showFbDetails = function () {
        $scope.showFbDetail = !$scope.showFbDetail;
    };

    $scope.ticketViaFacebook = 0;
    $scope.ticketViaFacebookCount = 0;
    $scope.getTicketViaFB = function () {
        dashboardService.GetNewTicketCountViaChannel("facebook-post").then(function (response) {
            if (response) {
                $scope.ticketViaFacebookCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaFacebook = ((response / $scope.totalTicket) * 100).toFixed(2);

                $scope.ticketViaFacebookTotalCount = $scope.ticketViaFacebookCount + $scope.ticketViaFacebookChatCount;
                $scope.ticketViaFacebookTotal = (($scope.ticketViaFacebookTotalCount / $scope.totalTicket) * 100).toFixed(2);
            }
            else {
                $scope.ticketViaFacebook = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaFacebook = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaFB();

    $scope.ticketViaFacebookChat = 0;
    $scope.ticketViaFacebookChatCount = 0;
    $scope.getTicketViaFBChat = function () {
        dashboardService.GetNewTicketCountViaChannel("facebook-chat").then(function (response) {
            if (response) {
                $scope.ticketViaFacebookChatCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaFacebookChat = ((response / $scope.totalTicket) * 100).toFixed(2);

                $scope.ticketViaFacebookTotalCount = $scope.ticketViaFacebookCount + $scope.ticketViaFacebookChatCount;
                $scope.ticketViaFacebookTotal = (($scope.ticketViaFacebookTotalCount / $scope.totalTicket) * 100).toFixed(2);
            }
            else {
                $scope.ticketViaFacebookChat = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaFacebookChat = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaFBChat();

    $scope.ticketViaTwitter = 0;
    $scope.ticketViaTwitterCount = 0;
    $scope.getTicketViaTwitter = function () {
        dashboardService.GetNewTicketCountViaChannel("twitter").then(function (response) {
            if (response) {
                $scope.ticketViaTwitterCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaTwitter = ((response / $scope.totalTicket) * 100).toFixed(2);
            }
            else {
                $scope.ticketViaTwitter = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaTwitter = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaTwitter();

    $scope.ticketViaOther = 0;
    $scope.ticketViaOtherCount = 0;
    var calculateOther = function () {
        $scope.ticketViaOtherCount = $scope.ticketViaWidgetCount + $scope.ticketViaSkypeCount + $scope.ticketViaApiCount + $scope.ticketViaEmailCount;
        if ($scope.totalTicket > 0)
            $scope.ticketViaOther = (($scope.ticketViaOtherCount / $scope.totalTicket) * 100).toFixed(2);
    };

    $scope.ticketViaSkype = 0;
    $scope.ticketViaSkypeCount = 0;
    $scope.getTicketViaSkype = function () {
        dashboardService.GetNewTicketCountViaChannel("skype").then(function (response) {
            if (response) {
                $scope.ticketViaSkypeCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaSkype = ((response / $scope.totalTicket) * 100).toFixed(2);
                calculateOther();
            }
            else {
                $scope.ticketViaSkype = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaSkype = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaSkype();

    $scope.ticketViaApi = 0;
    $scope.ticketViaApiCount = 0;
    $scope.getTicketViaApi = function () {
        dashboardService.GetNewTicketCountViaChannel("api").then(function (response) {
            if (response) {
                $scope.ticketViaApiCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaApi = ((response / $scope.totalTicket) * 100).toFixed(2);
                calculateOther();
            }
            else {
                $scope.ticketViaApi = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaApi = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaApi();


    $scope.ticketViaWidget = 0;
    $scope.ticketViaWidgetCount = 0;
    $scope.getTicketViaWidget = function () {
        dashboardService.GetNewTicketCountViaChannel("web-widget").then(function (response) {
            if (response) {
                $scope.ticketViaWidgetCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaWidget = ((response / $scope.totalTicket) * 100).toFixed(2);
                calculateOther();
            }
            else {
                $scope.ticketViaWidget = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaWidget = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaWidget();

    $scope.ticketViaEmail = 0;
    $scope.ticketViaEmailCount = 0;
    $scope.getTicketViaEmail = function () {
        dashboardService.GetNewTicketCountViaChannel("email").then(function (response) {
            if (response) {
                $scope.ticketViaEmailCount = response;
                if ($scope.totalTicket > 0)
                    $scope.ticketViaEmail = ((response / $scope.totalTicket) * 100).toFixed(2);
                calculateOther();
            }
            else {
                $scope.ticketViaEmail = 0;
            }
        }, function (err) {
            loginService.isCheckResponse(err);
            $scope.ticketViaEmail = 0;
            console.log(err);
        });
    };
    $scope.getTicketViaEmail();

    $scope.showOtherDetail = false;
    $scope.showOtherDetails = function () {
        $scope.showOtherDetail = !$scope.showOtherDetail;
    };


    $scope.slaCompliance = 0;
    var SlaCompliance = function () {
        if ($scope.newTicket > 0)
            $scope.slaCompliance = (($scope.slaViolated / $scope.newTicket) * 100).toFixed(2);
    };

    $scope.reopenPercentage = 0;
    var calculateReopenPercentage = function () {
        if ($scope.totalTicket > 0)
            $scope.reopenPercentage = (($scope.reopenTicket / $scope.totalTicket) * 100).toFixed(2);
    };


    var getAllRealTimeTimer = {};
    var getAllRealTime = function () {


        $scope.getCreatedTicketSeries();
        $scope.getResolvedTicketSeries();
        $scope.getDeferenceResolvedTicketSeries();
        $scope.getNewTicketCount();
        $scope.getOpenTicketCount();
        $scope.getSolvedTicketCount();
        $scope.getReopenTicketCount();
        $scope.getParkedTicketCount();
        $scope.getProgressTicketCount();
        $scope.getClosedTicketCount();
        $scope.getFirstCallResolutionTicketCount();
        $scope.getSlaViolatedTicketCount();
        $scope.getTicketResolutionTime();
        $scope.getAverageResponseTime();
        $scope.getTicketViaSms();
        $scope.getTicketViaCall();
        $scope.getTicketViaTwitter();
        $scope.getTicketViaFB();


        $scope.labels = doughnutObj.labels;
        $scope.data = doughnutObj.data;
        getAllRealTimeTimer = $timeout(getAllRealTime, 1800000);//30min
    };
    getAllRealTime();

    $scope.$on("$destroy", function () {
        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }
    });

    //update code
    //damith
    $scope.options = {
        type: 'doughnut',
        responsive: false,
        legend: {
            display: true,
            position: 'bottom',
            padding: 2,
            labels: {
                fontColor: 'rgb(130, 152, 174)',
                fontSize: 8,
                boxWidth: 5
            }
        },
        title: {
            display: true
        }
    };


    // doughnutData.push()
    // $scope.data = [$scope.newTicket,
    //     $scope.openTicket, $scope.progressTicket,
    //     $scope.closedTicket,
    //     $scope.solvedTicket,
    //     $scope.reopenTicket,
    //     $scope.parkedTicket];


});

