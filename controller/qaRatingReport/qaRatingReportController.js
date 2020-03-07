/**
 * Created by Pawan on 1/16/2017.
 */
(function () {
    var app = angular.module("veeryConsoleApp").constant('_', window._);


    var qaRatingReportCtrl = function ($scope, $uibModal, $location, $anchorScroll, loginService,qaModuleService,userProfileApiAccess,$anchorScroll,$q) {

        $anchorScroll();
        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };


        $scope.sectionArray={};
        $scope.questionArray={};


        $scope.querySearch = function (query) {
            var emptyArr = [];
            var result =[];
            if(query)
            {
                query = query.toLowerCase();
            }
            if (query === "*" || query === "") {
                if ($scope.userList) {
                    return $scope.userList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.userList) {

                    angular.forEach($scope.userList, function(item){

                        if(item.username.toLowerCase().indexOf(query)!==-1){
                            result.push(item);
                        }

                    });

                    return result;

                    /*return $scope.userList.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.username) {
                            return item.username.match(regEx);
                        }
                        else {
                            return false;
                        }

                    });*/
                }
                else {
                    return emptyArr;
                }
            }

        };

        var pickAllSubmittedPapersByDateRange  = function (owner,sDate,eDate) {

            qaModuleService.getAllSubmissionsByOwnerAndTimeRange(owner,sDate,eDate).then(function (resPapers) {

                if(resPapers.Result)
                {
                    angular.forEach(resPapers.Result, function (submissions) {
                        if(submissions.answers)
                        {
                            angular.forEach(submissions.answers, function (answer) {

                                if(answer.question && answer.section)
                                {
                                    var questionObj = {
                                        question:answer.question,
                                        answer:answer.points
                                    };

                                    if(answer.remarks)
                                    {
                                        questionObj.remarks = answer.remarks;
                                    }

                                    if($scope.questionArray[submissions._id])
                                    {

                                        var secIndexes = $scope.questionArray[submissions._id].sectionData.map(function(obj, index) {
                                            if(obj.section._id == answer.section._id) {
                                                return index;
                                            }
                                        }).filter(isFinite);



                                        if(secIndexes.length>0)
                                        {

                                            $scope.questionArray[submissions._id].sectionData[0].questionDetails.push(questionObj);
                                        }
                                        else
                                        {



                                            var sectionObj= {
                                                section:answer.section,
                                                questionDetails :[questionObj]
                                            }




                                            $scope.questionArray[submissions._id].sectionData.push(sectionObj);
                                        }
                                    }
                                    else
                                    {


                                        $scope.questionArray[submissions._id]={

                                            paper:submissions.paper,
                                            sectionData:[
                                                {
                                                    section:answer.section,
                                                    questionDetails :[questionObj]
                                                }
                                            ]
                                        }



                                    }
                                }


                                if(answer.section && answer.question && answer.question.weight > 0 && answer.question.type != 'remark')
                                {
                                    if($scope.sectionArray[answer.section._id])
                                    {
                                        var ansValue=$scope.sectionArray[answer.section._id].value;
                                        var val = (answer.points * answer.question.weight)/10;

                                        $scope.sectionArray[answer.section._id].value=ansValue+val;
                                        $scope.sectionArray[answer.section._id].itemCount+=1;
                                        //  console.log(answer.section.name+" :  "+sectionArray[answer.section._id].value);
                                        //console.log(answer.section.name+" Items :  "+sectionArray[answer.section._id].itemCount);


                                    }
                                    else
                                    {
                                        //sectionArray[answer.section._id]=(answer.points * answer.question.weight)/10;

                                        $scope.sectionArray[answer.section._id] =
                                        {
                                            value:(answer.points * answer.question.weight)/10,
                                            itemCount:1,
                                            name:answer.section.name,
                                            id:answer.section._id
                                        }

                                        //console.log(answer.section.name+" :  "+sectionArray[answer.section._id].value);
                                        // console.log(answer.section.name+" Items :  "+sectionArray[answer.section._id].itemCount);


                                    }


                                }


                            });
                        }


                    });


                    //console.log($scope.sectionArray);

                }
                else
                {
                    console.log("Error");
                }

            }).catch(function (errPapers) {

            })

        };

        var pickAllSubmissionQuestionDetails = function (owner,sDate,eDate) {

            qaModuleService.getAllSubmissionsByOwnerAndTimeRange(owner,sDate,eDate).then(function (resPapers) {

                if(resPapers.Result)
                {
                    angular.forEach(resPapers.Result, function (submission) {
                        //submission id
                        if(submission.answers) {
                            angular.forEach(submission.answers, function (answer) {
//answer id

                                /*var questionObj;

                                if(answer.remarks)
                                {
                                    questionObj= {
                                        question:answer.question,
                                        answer:answer.points,
                                        remarks:answer.remarks


                                    };
                                }
                                else
                                {
                                    questionObj= {
                                        question:answer.question,
                                        answer:answer.points


                                    };
                                }

                                if($scope.questionArray[submission._id])
                                {

                                    var secIndexes = $scope.questionArray[submission._id].sectionData.map(function(obj, index) {
                                        if(obj.section._id == answer.section._id) {
                                            return index;
                                        }
                                    }).filter(isFinite);



                                    if(secIndexes.length>0)
                                    {

                                        $scope.questionArray[submission._id].sectionData[0].questionDetails.push(questionObj);
                                    }
                                    else
                                    {



                                        var sectionObj= {
                                            section:answer.section,
                                            questionDetails :[questionObj]
                                        }




                                        $scope.questionArray[submission._id].sectionData.push(sectionObj);
                                    }
                                }
                                else
                                {


                                    $scope.questionArray[submission._id]={

                                        paper:submission.paper,
                                        sectionData:[
                                            {
                                                section:answer.section,
                                                questionDetails :[questionObj]
                                            }
                                        ]
                                    }



                                }*/

                            });
                        }
                        else
                        {
                            console.log("No questions found");
                        }


                    });
                    console.log($scope.questionArray);
                }

            }).catch(function (error) {

            });

        }

        $scope.RatingResultResolve = function (item) {
            var rateObj =
                {
                    starValue: Math.round(item.value / item.itemCount),
                    displayValue: (item.value / item.itemCount).toFixed(2)
                };

            return rateObj;
        };
        $scope.titles =[];
        $scope.SetTitiles = function (value) {
            $scope.titles =[];
            for (var i = 1; i <= 10; i++)
            {
                $scope.titles.push(value);
            }

        };

        $scope.loadRatingDetails = function () {

            var owner =null;
            var momentTz = moment.parseZone(new Date()).format('Z');
            //var encodedTz = encodeURI(momentTz);
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.startDate + ' 00:00:00.000' + momentTz;
            var endDate = $scope.endDate + ' 23:59:59.999' + momentTz;

            if($scope.agentSelected && $scope.agentSelected.veeryaccount && $scope.agentSelected.veeryaccount.contact)
            {
                owner=$scope.agentSelected._id;
                $scope.sectionArray={};
                $scope.questionArray={};
                pickAllSubmittedPapersByDateRange(owner,startDate,endDate);
                //pickAllSubmissionQuestionDetails(owner,startDate,endDate);



            }
            else
            {
                $scope.showAlert('Error', 'error', 'Selected agent has no veery account');
            }

        };





        $scope.startDate = moment().format("YYYY-MM-DD");
        $scope.endDate = moment().format("YYYY-MM-DD");


        var loadUsers = function () {

            $scope.userList=[];
            userProfileApiAccess.getUserCount('all').then(function (row_count) {
                var pagesize = 20;
                var pagecount = Math.ceil(row_count / pagesize);

                var method_list = [];

                for (var i = 1; i <= pagecount; i++) {
                    method_list.push(userProfileApiAccess.LoadUsersByPage('all',pagesize, i));
                }


                $q.all(method_list).then(function (resolveData) {
                    if (resolveData) {
                        resolveData.map(function (data) {
                            var Result= data.Result;
                            Result.map(function (item) {

                                $scope.userList.push(item);
                            });
                        });

                    }



                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert("Loading Agent details", "error", "Error In Loading Agent Details");
                });



            }, function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert("Load Users", "error", "Fail To Get User List.")
            });


            /*userProfileApiAccess.getUsers().then(function (data)
            {
                if (data.IsSuccess)
                {
                    $scope.userList = data.Result;
                }
                else
                {
                    var errMsg = data.CustomMessage;

                    if (data.Exception)
                    {
                        errMsg = data.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);

                }

            }, function (err)
            {
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading users";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });*/
        };

        loadUsers();




    };





    app.controller("qaRatingReportCtrl", qaRatingReportCtrl);
}());

mainApp.controller("paperViewController", function ($scope, $rootScope, $uibModalInstance, submissiondata) {


    $scope.showModal = true;


    $scope.submissiondata=submissiondata;

    console.log($scope.submissiondata);

    $scope.ok = function () {

        $scope.showModal = false;
        $uibModalInstance.close($scope.password);
    };

    $scope.loginPhone = function () {

        $scope.showModal = false;
        $uibModalInstance.close($scope.password);
    };

    $scope.closeModal = function () {

        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {

        $scope.showModal = false;
        $uibModalInstance.dismiss('cancel');
    };


});