/**
 * Created by dinusha on 9/6/2016.
 */
(function () {
    var app = angular.module("veeryConsoleApp");

    var qaSubmissionCtrl = function ($scope, $filter, $q, $sce, $http, $uibModal, userProfileApiAccess, cdrApiHandler,authService, qaModuleService, loginService, $anchorScroll,$auth) {
        $anchorScroll();
        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.averagePoint = 0;

        $scope.moment = moment;

        $scope.config = {
            preload: "auto",
            tracks: [
                {
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }
            ],
            theme: {
                url: "bower_components/videogular-themes-default/videogular.css"
            },
            "analytics": {
                "category": "Videogular",
                "label": "Main",
                "events": {
                    "ready": true,
                    "play": true,
                    "pause": true,
                    "stop": true,
                    "complete": true,
                    "progress": 10
                }
            }
        };

        $scope.userList = [];
        $scope.cdrList = [];
        $scope.papers = [];
        $scope.sections = [];
        $scope.currentPaper = {};
        $scope.isTableLoading = 2;
        $scope.currentSubmission = null;
        $scope.showCancel = false;

        var videogularAPI = null;

        $scope.onPlayerReady = function (API) {
            videogularAPI = API;

        };

        $scope.deleteRecord = function(cdr)
        {
            var index = $scope.cdrList.indexOf(cdr);

            if (index > -1) {
                $scope.cdrList.splice(index, 1);
            }
        };



        $scope.playStopFile = function (uuid) {
            if (videogularAPI) {
                var decodedToken = authService.getTokenDecode();

                if(videogularAPI.currentState === 'play')
                {
                    videogularAPI.stop();
                }

                if (decodedToken && decodedToken.company && decodedToken.tenant) {
                    var fileToPlay = baseUrls.fileServiceUrl + 'File/DownloadLatest/' + uuid + '.mp3?Authorization='+$auth.getToken();

                    $http({
                        method: 'GET',
                        url: fileToPlay,
                        responseType: 'blob'
                    }).then(function successCallback(response)
                    {
                        if(response.data)
                        {
                            var url = URL.createObjectURL(response.data);
                            var arr = [
                                {
                                    src: $sce.trustAsResourceUrl(url),
                                    type: 'audio/mp3'
                                }
                            ];

                            $scope.config.sources = arr;


                            videogularAPI.play();
                        }
                    }, function errorCallback(response) {

                        $scope.showAlert('Recording Player', 'error', 'Error occurred while playing file');

                    });


                }
            }


        };

        $scope.goBackToRecords = function(){
            $scope.showCancel = false;
            $scope.isTableLoading = 1;
            $scope.currentPaper = {};
            $scope.currentSubmission = null;
        };




        $scope.startDate = moment().format("YYYY-MM-DD");
        $scope.endDate = moment().format("YYYY-MM-DD");

        var loadUsers = function () {

            $scope.userList= [];

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



          /*
            userProfileApiAccess.getUsers().then(function (data)
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

        var owner = null;

        $scope.getRecords = function () {

            $scope.isTableLoading = 0;

            var momentTz = moment.parseZone(new Date()).format('Z');
            //var encodedTz = encodeURI(momentTz);
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.startDate + ' 00:00:00.000' + momentTz;
            var endDate = $scope.endDate + ' 23:59:59.999' + momentTz;

            var sipUser = null;

            if($scope.agentSelected && $scope.agentSelected.veeryaccount && $scope.agentSelected.veeryaccount.contact)
            {
                owner = $scope.agentSelected._id;
                var split = $scope.agentSelected.veeryaccount.contact.split('@');

                if(split && split.length >= 1)
                {
                    sipUser = split[0];
                }

                cdrApiHandler.getCDRForTimeRange(startDate, endDate, null, null, sipUser, null, $scope.directionFilter, null, null, null, null, -1).then(function (data)
                {
                    if (data.IsSuccess && data.Result)
                    {
                        var answeredCalls = _.filter(data.Result, {IsAnswered: true});
                        $scope.cdrList = answeredCalls;
                        $scope.isTableLoading = 1;
                    }
                    else
                    {
                        $scope.cdrList = [];
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        $scope.showAlert('Error', 'error', errMsg);

                        $scope.isTableLoading = 1;

                    }

                }, function (err)
                {
                    $scope.cdrList = [];
                    $scope.isTableLoading = 1;
                    loginService.isCheckResponse(err);
                    var errMsg = "Error occurred while loading cdr records";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                });
            }
            else
            {
                $scope.showAlert('Error', 'error', 'Selected agent has no veery account');
            }


        };

        var buildFormSchema = function (schema, form, fields) {
            fields.forEach(function (fieldItem) {
                if (fieldItem.field)
                {
                    var isActive = true;
                    if (fieldItem.active === false) {
                        isActive = false;
                    }

                    //field type parser

                    if (fieldItem.type === 'text') {

                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        form.push({
                            "key": fieldItem.field,
                            "type": "text"
                        })
                    }
                    else if (fieldItem.type === 'textarea') {

                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        form.push({
                            "key": fieldItem.field,
                            "type": "textarea"
                        })
                    }
                    else if (fieldItem.type === 'url') {

                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        form.push({
                            "key": fieldItem.field,
                            "type": "text"
                        })
                    }
                    else if (fieldItem.type === 'section') {
                        var h2Tag = '<h4><b><u>' + 'SECTION - ' + fieldItem.title + '</u></b></h4>';
                        form.push({
                            "type": "help",
                            "helpvalue": h2Tag
                        });
                    }
                    else if (fieldItem.type === 'qheader') {
                        var h2Tag = '<h2><b>' + 'QUESTION - ' + fieldItem.title + '</b></h2>';
                        form.push({
                            "type": "help",
                            "helpvalue": h2Tag
                        });
                    }
                    else if (fieldItem.type === 'radio') {
                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive,
                            enum: [
                                'Yes',
                                'No'
                            ]

                        };

                        var formObj = {
                            "key": fieldItem.field,
                            "type": "radios-inline",
                            "titleMap": []
                        };


                        if (fieldItem.values && fieldItem.values.length > 0) {

                            schema.properties[fieldItem.field].enum = [];

                            fieldItem.values.forEach(function (enumVal) {
                                schema.properties[fieldItem.field].enum.push(enumVal.name);
                                formObj.titleMap.push(
                                    {
                                        "value": enumVal.id,
                                        "name": enumVal.name
                                    }
                                )
                            })

                        }

                        form.push(formObj);
                    }
                    else if (fieldItem.type === 'date') {

                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive,
                            format: 'date'

                        };

                        form.push({
                            "key": fieldItem.field,
                            "minDate": "1900-01-01"
                        })
                    }
                    else if (fieldItem.type === 'number') {

                        schema.properties[fieldItem.field] = {
                            type: 'number',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        form.push({
                            "key": fieldItem.field,
                            "type": "number"
                        })
                    }
                    else if (fieldItem.type === 'phone') {

                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            pattern: "^[0-9*#+]+$",
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        form.push({
                            "key": fieldItem.field,
                            "type": "text"
                        })
                    }
                    else if (fieldItem.type === 'boolean' || fieldItem.type === 'checkbox') {

                        schema.properties[fieldItem.field] = {
                            type: 'boolean',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        form.push({
                            "key": fieldItem.field,
                            "type": "checkbox"
                        })
                    }
                    else if (fieldItem.type === 'checkboxes') {

                        schema.properties[fieldItem.field] = {
                            type: 'array',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive,
                            items: {
                                type: "string",
                                enum: []
                            }

                        };

                        if (fieldItem.values && fieldItem.values.length > 0) {

                            fieldItem.values.forEach(function (enumVal) {
                                schema.properties[fieldItem.field].items.enum.push(enumVal.name);
                            })

                        }

                        form.push(fieldItem.field);
                    }
                    else if (fieldItem.type === 'email') {

                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            description: fieldItem.description,
                            pattern: "^\\S+@\\S+$",
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        form.push({
                            "key": fieldItem.field,
                            "type": "text"
                        })
                    }
                    else if (fieldItem.type === 'select') {
                        schema.properties[fieldItem.field] = {
                            type: 'string',
                            title: fieldItem.title,
                            required: fieldItem.require ? true : false,
                            readonly: !isActive

                        };

                        var formObj = {
                            "key": fieldItem.field,
                            "type": "select",
                            "titleMap": []
                        };

                        if (fieldItem.values && fieldItem.values.length > 0) {

                            schema.properties[fieldItem.field].enum = [];

                            fieldItem.values.forEach(function (enumVal) {
                                schema.properties[fieldItem.field].enum.push(enumVal.name);
                                formObj.titleMap.push(
                                    {
                                        "value": enumVal.id,
                                        "name": enumVal.name
                                    });
                            })

                        }
                        form.push(formObj);
                    }

                    //end field type parser

                }


            });

            return schema;
        };

        var getPapers = function()
        {
            $scope.papers = [];

            qaModuleService.getPapers().then(function (data)
            {
                if (data.IsSuccess)
                {
                    $scope.papers = data.Result;
                }
                else
                {
                    if(data.Exception)
                    {
                        $scope.showAlert('QA Paper', 'error', data.Exception.Message);
                    }
                    else
                    {
                        $scope.showAlert('QA Paper', 'error', 'Error occurred while loading question papers');
                    }
                }

            }).catch(function (err)
            {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Paper', 'error', err.Message);
            });

        };

        getPapers();

        var getSections = function()
        {
            $scope.sections = [];

            qaModuleService.getSections().then(function (data)
            {
                if (data.IsSuccess)
                {
                    $scope.sections = data.Result;
                }
                else
                {
                    if(data.Exception)
                    {
                        $scope.showAlert('QA Section', 'error', data.Exception.Message);
                    }
                    else
                    {
                        $scope.showAlert('QA Section', 'error', 'Error occurred while loading sections');
                    }
                }

            }).catch(function (err)
            {
                loginService.isCheckResponse(err);
                $scope.showAlert('QA Section', 'error', err.Message);
            });

        };

        getSections();

        var loadNewPaperInitiate = function(sessionId){
            var decodedToken = authService.getTokenDecode();

            $scope.currentPaper = $scope.paperSelected;

            var evaluatorObj = _.find($scope.userList, {username: decodedToken.iss});

            if(evaluatorObj)
            {
                //submit paper initially
                var paperInfo = {
                    paper: $scope.currentPaper._id,
                    session: sessionId,
                    evaluator: evaluatorObj._id,
                    owner: owner
                };

                qaModuleService.paperSubmission(paperInfo).then(function (data)
                {
                    if(data.IsSuccess && data.Result && data.Result._id)
                    {

                        $scope.currentSubmission = data.Result._id;
                        $scope.isTableLoading = 3;
                        $scope.showCancel = true;
                        buildQuestionPaper();
                    }
                    else
                    {
                        $scope.showAlert('Paper Submission', 'error', 'Paper submission failed');
                    }


                }).catch(function(err){
                    $scope.showAlert('Paper Submission', 'error', err.Message);

                })


            }
            else
            {
                $scope.showAlert('Paper Submission', 'error', 'Cannot find evaluator');
            }
        };


        $scope.openQuestionPaper = function(sessionId){

            qaModuleService.getPaperSubmissionBySession(sessionId).then(function (data)
            {
                if (data.IsSuccess)
                {
                    if(data.Result)
                    {
                        if(data.Result.completed === 'true')
                        {
                            $scope.showAlert('QA Submission', 'warn', 'Question paper already completed for this session');
                        }
                        else
                        {
                            //existing paper - open that paper with answers

                            qaModuleService.deleteSubmissionById(data.Result._id)
                                .then(function (data){

                                    if(data.IsSuccess)
                                    {
                                        loadNewPaperInitiate(sessionId);
                                    }
                                    else
                                    {
                                        $scope.showAlert('QA Submission', 'error', 'Error occurred reseting paper');
                                    }

                                })
                                .catch(function(err){

                                    $scope.showAlert('QA Submission', 'error', err.Message);

                                })

                        }
                    }
                    else
                    {
                        //new paper prompt for paper selection
                        loadNewPaperInitiate(sessionId);

                    }
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
            });



        };

        var addAnswer = function(paperId, answerData){
            var deferred = $q.defer();

            qaModuleService.addAnswerToQuestion(paperId, answerData).then(function (data)
            {
                if (data.IsSuccess)
                {
                    deferred.resolve(data.Result);
                }
                else
                {
                    deferred.reject(null);
                }

            }).catch(function (err)
            {
                deferred.reject(null);
            });

            return deferred.promise;

        };

        $scope.onSubmit = function (form)
        {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid)
            {
                if($scope.currentSubmission)
                {
                    var arr = [];
                    for (var key in $scope.model)
                    {
                        if ($scope.model.hasOwnProperty(key))
                        {
                            //get question type
                            var answerInfo = {};
                            var questionInfo = _.find($scope.currentPaper.questions, {_id: key});

                            if(questionInfo)
                            {
                                answerInfo.question = key;
                                answerInfo.section = questionInfo.section;
                                if(questionInfo.type === 'binary')
                                {
                                    var answer = $scope.model[key];

                                    if(answer === 'Yes')
                                    {
                                        answerInfo.points = 10;
                                    }
                                    else
                                    {
                                        answerInfo.points = 0;
                                    }
                                }
                                else if(questionInfo.type === 'rating')
                                {
                                    answerInfo.points = $scope.model[key];
                                }
                                else if(questionInfo.type === 'remark')
                                {
                                    answerInfo.points = -1;
                                    answerInfo.remarks = $scope.model[key];
                                }
                            }
                            arr.push(addAnswer($scope.currentSubmission, answerInfo));
                        }
                    }


                    $q.all(arr).then(function(resolveData){
                        //form complete
                        qaModuleService.setPaperComplete($scope.currentSubmission).then(function (data)
                        {
                            if (data.IsSuccess)
                            {
                                $scope.goBackToRecords();
                                $scope.showAlert('QA Paper', 'success', 'Question form submitted');
                            }
                            else
                            {
                                $scope.showAlert('QA Paper', 'error', 'Question form set complete fail');
                            }

                        }).catch(function (err)
                        {
                            $scope.showAlert('QA Paper', 'error', err.Message);
                        });

                    }).catch(function(err){
                        $scope.showAlert('QA Paper', 'error', err.Message);
                    })
                }
                else
                {
                    $scope.showAlert('QA Paper', 'error', 'Form submission not set');
                }



            }
            else{
                $scope.showAlert('QA Paper', 'error', 'Incomplete question form, please answer all questions');
            }
        };

        var buildQuestionPaper = function()
        {
            var schema = {
                type: "object",
                properties: {}
            };

            var form = [];

            var model = {};

            var fields = [];

            if($scope.currentPaper && $scope.currentPaper.questions)
            {

                $scope.currentPaper.questionsBySection = {};

                $scope.sections.forEach(function(section){

                    var questionsBySec = _.filter($scope.currentPaper.questions, {section: section._id});

                    var obj = {
                        SectionName: section.name,
                        Questions: questionsBySec
                    };

                    $scope.currentPaper.questionsBySection[section._id] = obj;
                });

                for (var key in $scope.currentPaper.questionsBySection)
                {
                    if($scope.currentPaper.questionsBySection[key].Questions && $scope.currentPaper.questionsBySection[key].Questions.length > 0)
                    {
                        //add section as schema tag
                        var field = {
                            field: $scope.currentPaper.questionsBySection[key].SectionName,
                            active: true,
                            type : 'section',
                            title : $scope.currentPaper.questionsBySection[key].SectionName
                        };

                        fields.push(field);

                        //loop questions and create fields
                        $scope.currentPaper.questionsBySection[key].Questions.forEach(function(question)
                        {
                            if(question.type === 'binary')
                            {
                                var qHeadField = {
                                    type : 'qheader',
                                    title : question.question,
                                    field: 'QUESTION_' + question._id,
                                    active: true
                                };

                                fields.push(qHeadField);

                                var qField = {
                                    field: question._id,
                                    title: 'Answer',
                                    description: '',
                                    active: true,
                                    require: false,
                                    type: 'radio',
                                    values: []
                                };

                                qField.values.push({name: 'Yes', id: 'Yes'},{name: 'No', id: 'No'});

                                fields.push(qField);
                            }
                            else if(question.type === 'rating')
                            {
                                var qHeadField = {
                                    type : 'qheader',
                                    title : question.question,
                                    field: 'QUESTION_' + question._id,
                                    active: true
                                };

                                fields.push(qHeadField);

                                var qField = {
                                    field: question._id,
                                    title: 'Answer',
                                    description: '',
                                    active: true,
                                    require: true,
                                    type: 'select',
                                    values: []
                                };

                                qField.values.push({name: '0', id: '0'},{name: '1', id: '1'},{name: '2', id: '2'},{name: '3', id: '3'},{name: '4', id: '4'},{name: '5', id: '5'},{name: '6', id: '6'},{name: '7', id: '7'},{name: '8', id: '8'},{name: '9', id: '9'},{name: '10', id: '10'});

                                fields.push(qField);

                            }
                            else if(question.type === 'remark')
                            {
                                var qHeadField = {
                                    type : 'qheader',
                                    title : question.question,
                                    field: 'QUESTION_' + question._id,
                                    active: true
                                };

                                fields.push(qHeadField);

                                var qField = {
                                    field: question._id,
                                    title: 'Answer',
                                    description: '',
                                    active: true,
                                    require: true,
                                    type: 'textarea'
                                };

                                fields.push(qField);

                            }

                        })

                    }
                }

                buildFormSchema(schema, form, fields);

                form.push({
                    type: "submit",
                    title: "Save"
                });

                /*if (formSubmission.fields && formSubmission.fields.length > 0) {
                    formSubmission.fields.forEach(function (fieldValueItem) {
                        if (fieldValueItem.field) {
                            model[fieldValueItem.field] = fieldValueItem.value;
                        }

                    });
                }*/

                $scope.schema = schema;
                $scope.form = form;
                $scope.model = model;
            }

        };


        $scope.getScore = function(owner){

            var totalQuestions = 0;
            var totalPointsWeighted = 0;

            $scope.cdrList = [];
            $scope.isTableLoading = 2;

            qaModuleService.getAllSubmissionsByOwner(owner._id).then(function (data)
            {
                if (data.IsSuccess && data.Result)
                {
                    data.Result.forEach(function(submission){
                        if(submission.answers)
                        {
                            submission.answers.forEach(function(answer)
                            {
                                if(answer.question && answer.question.weight > 0 && answer.question.type != 'remark')
                                {
                                    var val = (answer.points * answer.question.weight)/10;
                                    totalPointsWeighted = totalPointsWeighted + val;
                                    totalQuestions++;
                                }

                            });
                        }
                    });
                    $scope.averagePoint = totalPointsWeighted / totalQuestions;
                }
                else
                {
                    $scope.showAlert('QA Rating', 'error', 'Error loading rating');
                }

            }).catch(function (err)
            {
                $scope.showAlert('QA Paper', 'error', err.Message);
            });

        }




    };
    app.controller("qaSubmissionCtrl", qaSubmissionCtrl);

}());


