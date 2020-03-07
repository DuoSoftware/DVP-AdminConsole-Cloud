/**
 * Created by Heshan.i on 2/14/2017.
 */

(function(){

    var app = angular.module('veeryConsoleApp');

    var numberDncController = function($scope, $q, campaignNumberApiAccess, loginService,$anchorScroll){
        $anchorScroll();
        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $scope.dncNumberList = [];
        $scope.numbersToUpdate = {};
        $scope.numbersToUpdate.ContactIds = [];
        $scope.manageDncNumbers = true;
        $scope.numberProgress = 0;
        $scope.uploadButtonValue = true;
        $scope.removeButtonValue = true;


        $scope.data = [];
        $scope.headerData = [];
        $scope.selectObj = {};

        $scope.leftAddValue = undefined;


        $scope.showAlert = function (title,content,type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.reset = function() {
            $scope.safeApply(function() {
                $scope.target.form.reset();
                $scope.numberProgress = 0;
                $scope.selectObj = {};
                $scope.headerData = [];
                $scope.numbersToUpdate.ContactIds = [];
                $scope.gridOptions2.data = [];
                $scope.gridOptions2.columnDefs = [];
                $scope.uploadButtonValue = true;
                $scope.leftAddValue = undefined;
            });

        };


        function validateNumbers(data, filter) {
            var deferred = $q.defer();
            setTimeout(function () {
                var numbers = [];
                var numberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;
                data.forEach(function (data) {
                    var tempNumber = data[filter];
                    if(tempNumber && tempNumber.toString().match(numberRegex)) {
                        numbers.push(data[filter])
                        console.log('Valid Number - '+tempNumber);
                    }
                    else {
                        console.log('Invalid Number - '+tempNumber);
                    }
                });
                deferred.resolve(numbers);
            },1000);
            return deferred.promise;
        }


        $scope.loadNumbers = function(){
            $scope.numbersToUpdate.ContactIds = [];


            var promise = validateNumbers($scope.data, $scope.selectObj.name);
            promise.then(function(numbers) {
                $scope.numbersToUpdate.ContactIds = numbers;
            });
        };

        $scope.numberLeftAdd = function () {
            if($scope.selectObj && $scope.selectObj.name && $scope.leftAddValue) {
                $scope.numbersToUpdate.ContactIds = [];

                var numberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;
                var newNumberSet = [];
                $scope.data.map(function (obj) {

                    if($scope.leftAddValue){
                        obj[$scope.selectObj.name] = $scope.leftAddValue + obj[$scope.selectObj.name];
                    }
                    if(obj[$scope.selectObj.name].toString().match(numberRegex)) {
                        newNumberSet.push(obj);
                    }
                });

                $scope.data = newNumberSet;
                $scope.numbersToUpdate.ContactIds = newNumberSet;
            }
        };


        $scope.gridOptions2 = {
            enableGridMenu: false,
            data: 'data',
            importerDataAddCallback: function ( grid, newObjects ) {
                $scope.data = newObjects;
            },
            onRegisterApi: function(gridApi){
                $scope.gridApi2 = gridApi;
            },
            importerProcessHeaders: function( hData, headerArray ) {
                var myHeaderColumns = [];
                var thisCol;

                headerArray.forEach(function (value, index) {
                    thisCol = mySpecialLookupFunction(value, index);
                    myHeaderColumns.push(thisCol.name);
                    $scope.headerData.push({name: thisCol.name, index: index});
                });

                return myHeaderColumns;
            }
        };

        var mySpecialLookupFunction = function(value, index){
            var headerType = typeof value;
            if(headerType.toLowerCase() !== 'string'){
                return {name:'Undefined Column '+index};
            }else{
                return {name:value};
            }
        };

        var handleFileSelect = function( event ){
            var target = event.srcElement || event.target;
            $scope.target = target;
            if (target && target.files && target.files.length === 1) {
                var fileObject = target.files[0];
                $scope.gridApi2.importer.importFile( fileObject );
                target.form.reset();
            }
        };

        var fileChooser = document.querySelectorAll('.file-chooser2');

        if ( fileChooser.length !== 1 ){
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
        } else {
            fileChooser[0].addEventListener('change', handleFileSelect, false);
        }










        $scope.gridOptions3 = {
            enableSorting: true,
            enableFiltering: true,
            treeRowHeaderAlwaysVisible: true,
            multiSelect: true,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            columnDefs: [
                { name: 'DNC Number', field: 'ContactId', width: '50%' },
                { name: 'DNC Type', field: 'DncType', grouping: { groupPriority: 1 }, sort: { priority: 1, direction: 'asc' }, width: '50%', cellFilter: 'mapDncType' }
            ],
            onRegisterApi: function( gridApi ) {
                $scope.gridApi3 = gridApi;
            }
        };

        $scope.selectAll = function() {
            $scope.gridApi3.selection.selectAllRows();
        };

        $scope.clearAll = function() {
            $scope.gridApi3.selection.clearSelectedRows();
        };

        $scope.loadDncNumberList = function(){
            campaignNumberApiAccess.GetDncNumbers().then(function(response){
                if(response.IsSuccess)
                {
                    var tempDncNumList = response.Result;

                    tempDncNumList.forEach(function(dncNumber){
                        if(dncNumber.TenantId === -1 && dncNumber.CompanyId === -1){
                            dncNumber.DncType = 'Global';
                        }else{
                            dncNumber.DncType = 'Company';
                        }
                    });


                    $scope.dncNumberList = tempDncNumList;
                    $scope.gridOptions3.data = $scope.dncNumberList;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Dnc Number Upload', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading DNC numbers";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Dnc Number Upload', errMsg, 'error');
            });
        };

        $scope.addNumbersToDncList = function(){

            $scope.numberProgress = 0;
            if($scope.numbersToUpdate && $scope.numbersToUpdate.ContactIds && $scope.numbersToUpdate.ContactIds.length >0) {
                var numberCount = $scope.numbersToUpdate.ContactIds.length;
                var numOfIterations = Math.ceil(numberCount / 1000);

                var numberArray = [];

                for (var i = 0; i < numOfIterations; i++) {
                    var start = i * 1000;
                    var end = (i * 1000) + 1000;
                    var numberChunk = $scope.numbersToUpdate.ContactIds.slice(start, end);

                    var sendObj = {
                        ContactIds: numberChunk
                    };
                    numberArray.push(sendObj);
                }

                $scope.uploadButtonValue = false;
                $scope.BatchUploader(numberArray).then(function () {

                    console.log("Upload done ..................");
                    $scope.loadDncNumberList();
                    $scope.reset();
                    $scope.showAlert('Dnc Number Upload', 'Add numbers to DNC list success', 'success');
                }, function (reason) {

                });
            }else{
                $scope.showAlert('Dnc Number Upload', 'Please select number column before upload', 'error');
            }
        };

        $scope.BatchUploader =function(array){
            var index = 0;


            return new Promise(function(resolve, reject) {

                function next() {
                    $scope.numberProgress = Math.ceil((index / array.length)*100);
                    if (index < array.length) {
                        campaignNumberApiAccess.AddNumbersToDnc(array[index++]).then(next, reject);
                    } else {
                        resolve();
                    }
                }
                next();
            });
        };

        $scope.BatchRemove =function(array){
            var index = 0;


            return new Promise(function(resolve, reject) {

                function next() {
                    $scope.numberProgress = Math.ceil((index / array.length)*100);
                    if (index < array.length) {
                        campaignNumberApiAccess.DeleteNumbersFromDnc(array[index++]).then(next, reject);
                    } else {
                        resolve();
                    }
                }
                next();
            });
        };

        $scope.removeNumbersFromDncList = function(){

            $scope.numberProgress = 0;
            var selectedRows = $scope.gridApi3.selection.getSelectedRows();
            var numberCount = selectedRows.length;
            if(numberCount > 0) {
                var numOfIterations = Math.ceil(numberCount / 1000);

                var numberArray = [];


                var numbersToRemove = selectedRows.map(function (row) {
                    return row.ContactId;
                });


                for (var i = 0; i < numOfIterations; i++) {
                    var start = i * 1000;
                    var end = (i * 1000) + 1000;
                    var numberChunk = numbersToRemove.slice(start, end);

                    var removeObj = {ContactIds: numberChunk};
                    numberArray.push(removeObj);
                }

                $scope.removeButtonValue = false;
                $scope.BatchRemove(numberArray).then(function () {

                    console.log("Remove done ..................");
                    $scope.loadDncNumberList();
                    $scope.reset();
                    $scope.showAlert('Dnc Number Upload', 'Remove numbers from DNC list success', 'success');
                }, function (reason) {

                });
            }else{
                $scope.showAlert('Dnc Number Upload', 'Select numbers to remove', 'error');
            }
        };

        $scope.loadDncNumberList();
    };

    app.controller('numberDncController', numberDncController).filter('mapDncType', function() {
        var dncTypeHash = {
            1: 'Global',
            2: 'Company'
        };

        return function(input) {
            var result;
            var match;
            if (!input){
                return '';
            } else if (result = dncTypeHash[input]) {
                return result;
            } else if ( ( match = input.match(/(.+)( \(\d+\))/) ) && ( result = dncTypeHash[match[1]] ) ) {
                return result + match[2];
            } else {
                return input;
            }
        };
    });

}());