/**
 * Created by Pawan on 11/22/2016.
 */

mainApp.controller("billingHistoryController", function ($scope,$filter,$state, $q,loginService,billingHistoryService,$anchorScroll)
{
    $anchorScroll();

    $scope.startDate = moment().format("YYYY-MM-DD");
    $scope.endDate = moment().format("YYYY-MM-DD");
    $scope.dateValid = true;
    $scope.agentSummaryList = [];
    $scope.Agents=[];
    $scope.summaryData = {
        'all': [],
        'calls': [],
        'credits': [],
        'packages': []
    };
    $scope.pageNo=1;
    $scope.rowCount=50;

    $scope.paginateData = {
        'all': { pageNo: 1, rowCount: 5, loadMore: true },
        'calls': { pageNo: 1, rowCount: 5, loadMore: true },
        'credits': { pageNo: 1, rowCount: 5, loadMore: true },
        'packages': { pageNo: 1, rowCount: 5, loadMore: true },
    };

    $scope.dtOptions = { paging: false, searching: false, info: false, order: [0, 'desc'] };




    var momentTz = moment.parseZone(new Date()).format('Z');
    momentTz = momentTz.replace("+", "%2B");

    $scope.onDateChange = function()
    {
        if(moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid())
        {
            $scope.dateValid = true;
        }
        else
        {
            $scope.dateValid = false;
        }
    };

    $scope.showError = function (tittle, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: 'error',
            styling: 'bootstrap3'
        });
    };


    $scope.getBillHistoryCSV = function (type) {
    
        type = type || "all";
        $scope.DownloadFileName = 'BILL_HISTORY_SUMMARY_' + type.toUpperCase() + '_' + $scope.startDate + '_' + $scope.endDate;
        var deferred = $q.defer();

        /* var billData = $scope.summaryData.map(function (c,index) {

         return c;
         });*/


        //$scope.AgentDetailsAssignToSummery();
        deferred.resolve($scope.summaryData[type]);

        return deferred.promise;


        /*$scope.historyList=[];
         billingHistoryService.getBillingHistory($scope.rowCount,$scope.pageNo).then(function (response) {

         if(!response.data.IsSuccess)
         {
         console.log("Bill history loading failed ",response.data.Exception);
         deferred.reject($scope.summaryData);
         }
         else
         {
         $scope.isTableLoading=1;

         var NewSummaryData=$scope.summaryData.concat(response.data.Result);
         $scope.summaryData=NewSummaryData;


         var billData = $scope.summaryData.map(function (c,index) {
         c.description = c.OtherJsonData.msg;
         return c;
         });


         //$scope.AgentDetailsAssignToSummery();
         deferred.resolve(billData);
         }

         }, function (error) {
         loginService.isCheckResponse(error);
         console.log("Error in Queue Summary loading ",error);
         deferred.reject(agentSummaryList);
         });

         return deferred.promise;*/
    };




    //$scope.getAgents();

    $scope.getBillingHistory = function (txType, hideErrors) {

        txType = txType || 'all';

        billingHistoryService.getBillingHistory($scope.rowCount,$scope.paginateData[txType].pageNo, txType).then(function (response) {

            if(!response.data.IsSuccess)
            {
                console.log("Bill History loading failed ",response.data.Exception);
            }
            else
            {
                $scope.isTableLoading=1;
                if(response.data.Result && response.data.Result.length > 0) {
                    //$scope.summaryData=$scope.summaryData.concat(response.data.Result);
                    // $scope.summaryData[txType] = response.data.Result;
                    // $scope.pageNo+=1;
                    // $scope.rowCount+=5;
                    // $scope.paginateData[txType].rowCount +=5;
                    $scope.paginateData[txType].pageNo +=1;
                    // $scope.pageNo+=1;

                    // hide more button if no. of records are less than page size.
                    if(response.data.Result.length < $scope.rowCount)
                        $scope.paginateData[txType].loadMore = false;

                    response.data.Result.map(function (c,index) {
                        c.description = c.OtherJsonData.msg;
                        c.Payment=0;
                        if(c.OtherJsonData.amount && c.OtherJsonData.amount>0)
                        {
                            c.Payment= (c.OtherJsonData.amount/100);
                        }

                        if(c.Credit && c.Credit>0)
                        {
                            c.Credit= (c.Credit/100).toFixed(2);;


                        }
                        else
                        {
                            c.Credit=0;
                        }

                        if(c.createdAt)
                        {
                            c.createdAt=new Date(c.createdAt);
                        }


                        // return c;
                        $scope.summaryData[txType].push(c);
                    });

                }else{
                    $scope.paginateData[txType].loadMore = false;
                    if(!hideErrors) $scope.showError("Billing History", "No data to load.");
                }


            }

        }, function (error) {
            console.log("Error in Bill History loading ",error);
        })
    };


    $scope.reloadBillingHistory = function (txType) {
        $scope.isTableLoading = 0;
        $scope.paginateData[txType].pageNo = 1;
        $scope.summaryData[txType] = [];
        $scope.getBillingHistory(txType);
    }



    // $scope.getBillingHistory();
    $scope.getBillingHistory('all', true);
    $scope.getBillingHistory('credits', true);
    $scope.getBillingHistory('calls', true);
    $scope.getBillingHistory('packages', true);

});
