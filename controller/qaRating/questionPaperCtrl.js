/**
 * Created by dinusha on 12/19/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var questionPaperCtrl = function ($scope, $uibModal, loginService, qaModuleService, $anchorScroll) {

        $anchorScroll();
        //Detect Document Height
        //update code damith
        var setElementHeight = function () {
            $scope.qaDetailsHeight = jsUpdateSize() - 280 + "px";
            document.getElementById('qaDetailsWrp').style.height = $scope.qaDetailsHeight;
        };
        window.onload = function () {
            setElementHeight();
        };

        window.onresize = function () {
            setElementHeight();
        };

        $scope.init = function () {
            setElementHeight();
        };


        $scope.showAlert = function (title, type, content) {

            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.currentSection = {};
        $scope.addQuestionSection = {};
        $scope.currentQuestion = {
            weight: 1
        };

        $scope.currentPaper = {};
        $scope.sections = [];
        $scope.newQFormToggle = {
            isOpen: true,
            display: 'New Form'
        };


        /*$scope.newQuestionFormToggle = function()
         {
         $scope.newQFormToggle.IsOpen = !$scope.newQFormToggle.IsOpen;
         if($scope.newQFormToggle.display === 'New Form')
         {
         $scope.newQFormToggle.display = 'Close';
         }
         else
         {
         $scope.newQFormToggle.display = 'New Form';
         }
         };*/

        $scope.showModalSection = function () {
            //modal show
            $scope.currentSection = {};
            $scope.modalInstanceSec = $uibModal.open({
                animation: true,
                templateUrl: 'views/qaRating/sections.html',
                size: 'lg',
                scope: $scope
            });
        };

        $scope.showModalPaper = function () {
            //modal show
            $scope.modalInstancePaper = $uibModal.open({
                animation: true,
                templateUrl: 'views/qaRating/questionForm.html',
                size: 'sm',
                scope: $scope
            });
        };

        $scope.isAddNewQuestion = false;
        $scope.showModalQuestion = function (sectionId) {
            $scope.currentQuestion = {
                weight: 1,
                type: 'binary'
            };
            $scope.questionSectionId = sectionId;
            $scope.getSections();
            $scope.isAddNewQuestion = true;
        };

        $scope.closeQuestion = function () {
            $scope.isAddNewQuestion = false;
        };

        $scope.closeSectionView = function () {
            $scope.isAddNewQuestion = false;
            $scope.showPaper = false;
            $scope.currentPaper = {};
        };

        $scope.paperEditMode = function (paper) {

            //$scope.currentPaper = paper;

            var active = (paper.active == 'true');

            if(!active)
            {
                $scope.showAlert('QA Question', 'warn', 'Please activate question paper to edit');
            }
            else
            {
                if ($scope.showPaper === null || $scope.showPaper === undefined) {
                    $scope.showPaper = false;
                }
                $scope.showPaper = !$scope.showPaper;

                if ($scope.showPaper) {
                    reloadCurrentPaper(paper._id);
                }
            }


        };

        $scope.setPaperStatus = function (paper) {
            var respMsg = 'deactivated';

            if(status)
            {
                respMsg = 'activated';
            }

            var active = (paper.active == 'true');

            qaModuleService.setPaperStatus(paper._id, !active).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('QA Question', 'success', 'Question Paper ' + respMsg + ' Successfully');
                    $scope.getPapers();
                }
                else {
                    if (data.Exception) {
                        $scope.showAlert('QA Question', 'error', data.Exception.Message);
                    }
                    else {
                        $scope.showAlert('QA Question', 'error', 'Error occurred while setting question paper status');
                    }
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Question', 'error', err.Message);
            });


        };

        $scope.backToListView = function () {

            $scope.currentPaper = {};

            $scope.showPaper = false;
        };

        $scope.closeModalSection = function () {
            $scope.modalInstanceSec.close();
        };

        $scope.closeModalQuestion = function () {
            $scope.modalInstanceQues.close();
        };

        $scope.closeModalPaper = function () {
            $scope.modalInstancePaper.close();
        };


        $scope.deleteQuestion = function (id) {

            //Check for completed submissions

            qaModuleService.validateBeforeDeleteQuestion(id).then(function(data)
            {
                if (data.IsSuccess)
                {
                    if(data.Result === true)
                    {
                        qaModuleService.deleteQuestionById(id).then(function (data) {
                            if (data.IsSuccess) {
                                $scope.showAlert('QA Question', 'success', 'Question Deleted Successfully');
                                reloadCurrentPaper($scope.currentPaper._id);
                            }
                            else {
                                if (data.Exception) {
                                    $scope.showAlert('QA Question', 'error', data.Exception.Message);
                                }
                                else {
                                    $scope.showAlert('QA Question', 'error', 'Error occurred while deleting question');
                                }
                            }

                        }).catch(function (err) {
                            loginService.isCheckResponse(err);
                            $scope.showAlert('QA Question', 'error', err.Message);
                        });
                    }
                    else
                    {
                        //confirm box

                        new PNotify({
                            title: 'Question Deletion',
                            text: 'This question has submitted answers, removing it will effect all paper submissions which have this question. Are you sure you want to continue ?',
                            type: 'warn',
                            hide: false,
                            confirm: {
                                confirm: true
                            },
                            buttons: {
                                closer: false,
                                sticker: false
                            },
                            history: {
                                history: false
                            }
                        }).get().on('pnotify.confirm', function ()
                            {
                                qaModuleService.deleteQuestionById(id).then(function (data) {
                                    if (data.IsSuccess) {
                                        $scope.showAlert('QA Question', 'success', 'Question Deleted Successfully');
                                        reloadCurrentPaper($scope.currentPaper._id);
                                    }
                                    else {
                                        if (data.Exception) {
                                            $scope.showAlert('QA Question', 'error', data.Exception.Message);
                                        }
                                        else {
                                            $scope.showAlert('QA Question', 'error', 'Error occurred while deleting question');
                                        }
                                    }

                                }).catch(function (err) {
                                    loginService.isCheckResponse(err);
                                    $scope.showAlert('QA Question', 'error', err.Message);
                                });
                            }).on('pnotify.cancel', function () {

                            });



                    }
                }
                else
                {
                    if (data.Exception)
                    {
                        $scope.showAlert('QA Question', 'error', data.Exception.Message);
                    }
                    else
                    {
                        $scope.showAlert('QA Question', 'error', 'Error occurred while pre checking deletion');
                    }
                }
            })



        };

        $scope.addSection = function () {

            qaModuleService.addNewSection($scope.currentSection).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('QA Section', 'success', 'Section Added Successfully');
                    $scope.getSections();
                    $scope.currentSection = {};
                }
                else {
                    if (data.Exception) {
                        $scope.showAlert('QA Section', 'error', data.Exception.Message);
                    }
                    else {
                        $scope.showAlert('QA Section', 'error', 'Error occurred while adding section');
                    }
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Section', 'error', err.Message);
            });

        };

        $scope.addSectionToPaper = function (section) {
            var obj = {
                SectionName: section.name,
                Questions: []
            };

            if (!$scope.currentPaper.questionsBySection[section._id]) {
                var incompleteSections = _.find($scope.currentPaper.questionsBySection, function (obj) {
                    return obj.Questions.length === 0
                });

                if (incompleteSections) {
                    new PNotify({
                        title: 'Section Incomplete',
                        text: 'Section ' + incompleteSections.SectionName + ' has no questions added, Do you wish to remove it ?',
                        type: 'warn',
                        hide: false,
                        confirm: {
                            confirm: true
                        },
                        buttons: {
                            closer: false,
                            sticker: false
                        },
                        history: {
                            history: false
                        }
                    }).get().on('pnotify.confirm', function () {
                        reloadCurrentPaper($scope.currentPaper._id);
                    }).on('pnotify.cancel', function () {

                    });
                }
                else {
                    $scope.currentPaper.questionsBySection[section._id] = obj;
                }

            }
            else {
                $scope.showAlert('QA Question', 'warn', 'Section already added');
            }

        };

        $scope.addQuestion = function () {

            $scope.currentQuestion.section = $scope.questionSectionId;
            qaModuleService.addQuestionToPaper($scope.currentPaper._id, $scope.currentQuestion).then(function (data) {
                if (data.IsSuccess) {
                    $scope.isAddNewQuestion = false;
                    $scope.showAlert('QA Question', 'success', 'Question Added Successfully');
                    reloadCurrentPaper($scope.currentPaper._id);
                }
                else {
                    if (data.Exception) {
                        $scope.showAlert('QA Question', 'error', data.Exception.Message);
                    }
                    else {
                        $scope.showAlert('QA Question', 'error', 'Error occurred while adding question');
                    }
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Question', 'error', err.Message);
            });

        };

        $scope.addPaper = function () {

            qaModuleService.addNewPaper($scope.currentPaper).then(function (data) {
                if (data.IsSuccess) {
                    $scope.showAlert('QA Paper', 'success', 'Question paper added successfully');
                    $scope.currentPaper = {};
                    $scope.getPapers();
                }
                else {
                    if (data.Exception) {
                        $scope.showAlert('QA Paper', 'error', data.Exception.Message);
                    }
                    else {
                        $scope.showAlert('QA Paper', 'error', 'Error occurred while adding question paper');
                    }
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Paper', 'error', err.Message);
            });

        };

        $scope.getSections = function () {
            $scope.sections = [];

            qaModuleService.getSections().then(function (data) {
                if (data.IsSuccess) {
                    $scope.sections = data.Result;
                }
                else {
                    if (data.Exception) {
                        $scope.showAlert('QA Section', 'error', data.Exception.Message);
                    }
                    else {
                        $scope.showAlert('QA Section', 'error', 'Error occurred while loading sections');
                    }
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Section', 'error', err.Message);
            });

        };

        $scope.getSections();

        var reloadCurrentPaper = function (id) {
            qaModuleService.getQuestionsForPaper(id).then(function (data) {
                if (data.IsSuccess && data.Result) {
                    $scope.currentPaper = data.Result;

                    $scope.currentPaper.questionsBySection = {};

                    /*$scope.sections.forEach(function(section){

                     var questionsBySec = _.filter($scope.currentPaper.questions, {section: section._id});

                     var obj = {
                     SectionName: section.name,
                     Questions: questionsBySec
                     };

                     $scope.currentPaper.questionsBySection[section._id] = obj;
                     });*/

                    var questionsBySec = _.groupBy($scope.currentPaper.questions, function (question) {
                        return question.section;
                    });

                    for (var section in questionsBySec) {
                        var sec = _.find($scope.sections, {_id: section});

                        var obj = {
                            SectionName: sec.name,
                            Questions: questionsBySec[section]
                        };

                        $scope.currentPaper.questionsBySection[section] = obj;
                    }
                }
                else {
                    if (data.Exception) {
                        $scope.showAlert('QA Section', 'error', data.Exception.Message);
                    }
                    else {
                        $scope.showAlert('QA Section', 'error', 'Error occurred while loading sections');
                    }
                }

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Section', 'error', err.Message);
            });

        };

        /*var getQuestionsBySection = function()
         {
         $scope.currentPaper.questionsBySection = {};

         $scope.sections.forEach(function(section){

         var questionsBySec = _.where($scope.currentPaper.questions, {section: section._id});

         $scope.currentPaper.questionsBySection[section.name] = questionsBySec;
         });


         //paper.questionsBySection = groupedList;

         };*/

        $scope.isPapersLoading = false;
        $scope.getPapers = function () {
            $scope.papers = [];
            $scope.isPapersLoading = true;
            qaModuleService.getPapersAll().then(function (data) {
                if (data.IsSuccess) {
                    $scope.papers = data.Result;
                }
                else {
                    if (data.Exception) {
                        $scope.showAlert('QA Paper', 'error', data.Exception.Message);
                    }
                    else {
                        $scope.showAlert('QA Paper', 'error', 'Error occurred while loading question papers');
                    }
                }
                $scope.isPapersLoading = false;

            }).catch(function (err) {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Paper', 'error', err.Message);
            });

        };

        $scope.getPapers();


    };


    app.controller("questionPaperCtrl", questionPaperCtrl);
}());