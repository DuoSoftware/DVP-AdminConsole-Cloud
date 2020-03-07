/**
 * Created by Rajinda on 05/17/2017.
 */

mainApp.controller("agentDialerController", function ($http, $scope, $filter, $location, $log, $q, $anchorScroll, notifiSenderService, agentDialService) {

    $anchorScroll();

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

    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.agentDial = {StartDate: $filter('date')(new Date(), "yyyy-MM-dd")};
    /*------------------ Excel File Read ----------------------------------*/
    $scope.campaignNumberObj = {};
    $scope.numberCategory = {};
    $scope.data = [];
    $scope.headerData = [];
    $scope.selectObj = {};
    $scope.campaignNumberObj.Contacts = [];
    $scope.enablePreviewData = false;
    $scope.showUpload = false;
    $scope.uploadState = "Show Upload";
    $scope.numberProgress = 0;
    $scope.uploadButtonValue = "Upload";

    var mySpecialLookupFunction = function (value, index) {
        var headerType = typeof value;
        if (headerType.toLowerCase() !== 'string') {
            return {name: 'Undefined Column ' + index};
        } else {
            return {name: value};
        }
    };

    $scope.gridOptions = {
        enableGridMenu: false,
        data: 'data',
        enableSorting: true,

        importerDataAddCallback: function (grid, newObjects) {
            $scope.data = newObjects;
        },
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        importerProcessHeaders: function (hData, headerArray) {
            $scope.headerData = [];
            var myHeaderColumns = [];
            var thisCol;

            headerArray.forEach(function (value, index) {
                thisCol = mySpecialLookupFunction(value, index);
                if (thisCol.name.contains('Undefined')) {
                    thisCol.name = 'Column' + index;
                }
                myHeaderColumns.push(thisCol.name);
                $scope.headerData.push({name: thisCol.name, index: index, enableSorting: true});
            });
            return myHeaderColumns;
        }
    };

    var handleFileSelect = function (event) {
        $scope.agentDial.validateNo = false;
        var target = event.srcElement || event.target;
        $scope.target = target;

        if (target && target.files && target.files.length === 1) {
            var fileObject = target.files[0];
            $scope.gridApi.importer.importFile(fileObject);
            //target.form.reset();
        }
    };

    var fileChooser = document.querySelectorAll('.file-chooser');

    if (fileChooser.length !== 1) {
        console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
    } else {
        fileChooser[0].addEventListener('change', handleFileSelect, false);
    }

    /*function validateNumbers(data, filter) {
        var deferred = $q.defer();
        setTimeout(function () {
            var numbers = [];
            var numberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;
            var i=0;
            data.forEach(function (item) {
                var tempNumber = item[filter];
                if(!tempNumber.toString().match(numberRegex)) {
                    data.splice(i, 1)
                }
                i++;
            });
            deferred.resolve(numbers);
        },1000);
        return deferred.promise;
    }*/

    $scope.leftAddValue = undefined;
    $scope.ValidateNumberSet = function () {
        if($scope.agentDial && $scope.agentDial.columnName && $scope.agentDial.validateNo) {
            $scope.isUploading = true;
            $scope.campaignNumberObj.Contacts = [];

            /*var numberRegex =  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;*/
            var numberRegex =  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;
            var newNumberSet = [];
            $scope.data.map(function (obj) {
                if(obj[$scope.agentDial.columnName].toString().match(numberRegex)) {
                    newNumberSet.push(obj);
                }
            });

            $scope.data = newNumberSet;
            $scope.campaignNumberObj.Contacts = newNumberSet;
            $scope.isUploading = false;

        }
    };
    $scope.numberLeftAdd = function () {
        if($scope.agentDial && $scope.agentDial.columnName&&$scope.leftAddValue ) {
            $scope.isUploading = true;
            $scope.campaignNumberObj.Contacts = [];
            //var newNumberSet = [];
            $scope.data.map(function (obj) {
                obj[$scope.agentDial.columnName] = $scope.leftAddValue + obj[$scope.agentDial.columnName];
                //newNumberSet.push(obj[$scope.agentDial.columnName]);
            });
            //$scope.data = newNumberSet;
            $scope.campaignNumberObj.Contacts = $scope.data;
            $scope.isUploading = false;
            $scope.ValidateNumberSet();
        }
    };

    /*------------------ Excel File Read End ----------------------------------*/

    /*------------------ Agent List ----------------------------------*/
    $scope.agentList = [];
    $scope.availableAgentList = [];

    $scope.loadCountries = function ($query) {
        return $scope.availableAgentList.filter(function (item) {
            return item.displayName.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

    $scope.GetAgentList = function () {
        $scope.availableAgentList=[];
        agentDialService.getUserCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(agentDialService.LoadUsersByPage(pagesize, i));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {
                    /*resolveData.map(function (data) {
                        $scope.availableAgentList = data.map(function (item) {
                            //item.displayName = item.firstname + " " + item.lastname; combank
                            item.displayName = item.username;
                            return item;
                        })
                    });*/

                    resolveData.map(function (data) {
                        data.map(function (item) {
                            //item.displayName = item.firstname + " " + item.lastname; combank
                            item.displayName = item.username;
                            $scope.availableAgentList.push(item);
                        })
                    });
                }



            }).catch(function (err) {
                console.error(err);

                $scope.showAlert("Load Users", "error", "Fail To Get User List.");
            });



        }, function (err) {

            $scope.showAlert("Load Users", "error", "Fail To Get User List.")
        });






       /* agentDialService.GetProfileDetails().then(function (response) {
            if (response) {
                $scope.availableAgentList = response.map(function (item) {
                    //item.displayName = item.firstname + " " + item.lastname; combank
                    item.displayName = item.username;
                    return item;
                })
            }

        }, function (error) {
            console.error("GetAgentList err");
        });*/
    };
    $scope.GetAgentList();

    /*------------------ Agent List ----------------------------------*/

    $scope.resetUploader = function () {
        $scope.safeApply(function () {
            $scope.data = [];
            $scope.agentNumberList = {};


            $scope.headerData = [];
            $scope.gridOptions.data = "data";
            $scope.gridOptions.columnDefs = [];

            $scope.target.form.reset();
            $scope.agentDial.validateNo = false;
            /*form.$setPristine();
            form.$setUntouched();*/

        });
        $scope.agentDial = {StartDate: $filter('date')(new Date(), "yyyy-MM-dd")};
    };

    $scope.agentNumberList = {};
    $scope.isUploading = false;
    $scope.assignNumbers = function () {
        $scope.isUploading = true;

        /*var postData = {
         AgentList:$scope.agentList,
         NumberColumnName:$scope.agentDial.columnName,
         DataColumnName:$scope.agentDial.dataColumnName,
         NumberList:$scope.data,
         Mechanism:$scope.agentDial.Mechanism,
         StartDate:$scope.agentDial.StartDate,
         BatchName:$scope.agentDial.BatchName
         };

         agentDialService.AssignNumber(postData).then(function (response) {
         if (response) {
         $scope.showAlert("Agent Dialer", 'success', "Pending Job. " );
         }
         else {
         $scope.showAlert("Agent Dialer", 'error', "Fail To Get Page Count.");
         }

         }, function (error) {
         $scope.showAlert("Agent Dialer", 'error', "Fail To Get Page Count.");
         });

         return;*/

        $scope.agentNumberList = {};

        var tempData = [];
        angular.copy($scope.data, tempData);

        if ($scope.agentDial && $scope.agentDial.Mechanism === 'Random') {
            tempData.sort(function () {
                return 0.5 - Math.random()
            });
        }

        var chunk = Math.ceil($scope.data.length / $scope.agentList.length);
        var i = 0;
        while (tempData.length) {
            var agent = $scope.agentList[i];
            $scope.agentNumberList[agent.displayName] = {
                'ResourceId': agent.username,
                'ResourceName': agent.displayName,
                'Data': tempData.splice(0, chunk).map(function (item) {
                    return {Number: item[$scope.agentDial.columnName], OtherData: item[$scope.agentDial.dataColumnName]}
                })
            };
            i++;
        }

        var promiseSet = [];
        angular.forEach($scope.agentNumberList, function (item) {
            if (item.Data) {
                var postData = {
                    ResourceName: item.ResourceName,
                    StartDate: $filter('date')($scope.agentDial.StartDate, "yyyy-MM-ddTHH:mm:ss.sssZ") ,
                    BatchName: $scope.agentDial.BatchName,
                    ContactList: item.Data
                };
                promiseSet.push(agentDialService.SaveDialInfo(item.ResourceId, postData));
                /*agentDialService.SaveDialInfo(item.ResourceId,postData).then(function (response) {
                 console.log(".......................")
                 }, function (error) {
                 $scope.showError("Error", "Error", "ok", "There is an error ");
                 });*/
            }
        });


        $q.all(promiseSet).then(function (data) {
            if (data) {
                $scope.loadPendingJobs();
            }



            $scope.safeApply(function () {
                $scope.agentDial = {
                    StartDate: $filter('date')(new Date(), "yyyy-MM-dd")
                };
                $scope.agentList = [];
            });

            angular.element("input[type='file']").val(null);
            $scope.showAlert("Agent Dialer", 'success', "Number Upload Process Start. Please Check Pending Job List.");
            $scope.isUploading = false;
            $scope.resetUploader();
        }).catch(function (e) {
            $scope.showAlert("Agent Dialer", 'error', "Fail To Upload Numbers.");
        });


        console.log("-------------------");
    };



    $scope.pendingJobs = [];
    $scope.isLoading = false;
    $scope.loadPendingJobs = function () {
        $scope.isLoading = true;
        agentDialService.PendingJob().then(function (response) {
            if (response) {
                $scope.pendingJobs = response.map(function (item) {
                    var data = item.split("_-_");
                    return {BatchName: data[0], id: data[1]}
                })
            }
            $scope.isLoading = false;
        }, function (error) {
            $scope.isLoading = false;
        });
    };
    $scope.loadPendingJobs();

    $scope.CheckJobStatus = function (jobId) {
        agentDialService.CheckJobStatus(jobId).then(function (response) {
            if (response) {
                $scope.showAlert("Agent Dialer", 'success', "Pending Job. " + jobId);
            }
            else {
                $scope.loadPendingJobs();
            }

        }, function (error) {
            $scope.showAlert("Agent Dialer", 'error', "Fail To Get Page Count.");
        });
    }
});
