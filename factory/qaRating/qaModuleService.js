/**
 * Created by dinusha on 12/19/2016.
 */

(function() {

    var qaModuleService = function($http, baseUrls)
    {

        var addNewSection = function(sectionInfo)
        {
            var jsonStr = JSON.stringify(sectionInfo);

            return $http({
                method: 'POST',
                url: baseUrls.qaModule + 'Section',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var addNewPaper = function(paperInfo)
        {
            var jsonStr = JSON.stringify(paperInfo);

            return $http({
                method: 'POST',
                url: baseUrls.qaModule + 'Paper',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var setPaperStatus = function(id, status)
        {
            return $http({
                method: 'PUT',
                url: baseUrls.qaModule + 'QuestionPaper/' + id + '/Activate/' + status
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var addQuestionToPaper = function(paperId, questionInfo)
        {
            var jsonStr = JSON.stringify(questionInfo);

            return $http({
                method: 'PUT',
                url: baseUrls.qaModule + 'QuestionPaper/' + paperId + '/Question',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var setPaperComplete = function(paperId)
        {
            return $http({
                method: 'PUT',
                url: baseUrls.qaModule + 'QuestionPaperSubmission/' + paperId + '/Complete'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var addAnswerToQuestion = function(paperId, answerInfo)
        {
            var jsonStr = JSON.stringify(answerInfo);
            return $http({
                method: 'PUT',
                url: baseUrls.qaModule + 'QuestionPaperSubmission/' + paperId + '/QuestionAnswer',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getSections = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'Sections'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getPapers = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'QuestionPapers'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getPapersAll = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'QuestionPapersAll'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getPaperSubmissionBySession = function(sessionId)
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'QuestionPaperSubmission/Session/' + sessionId
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getQuestionsForPaper = function(id)
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'QuestionPaper/' + id
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var validateBeforeDeleteQuestion = function(id)
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'Question/' + id + '/ValidateSubmission'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var deleteQuestionById = function(id)
        {
            return $http({
                method: 'DELETE',
                url: baseUrls.qaModule + 'Question/' + id
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var deleteSubmissionById = function(id)
        {
            return $http({
                method: 'DELETE',
                url: baseUrls.qaModule + 'QuestionPaperSubmission/' + id
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var paperSubmission = function(paperInfo)
        {

            var jsonStr = JSON.stringify(paperInfo);
            return $http({
                method: 'POST',
                url: baseUrls.qaModule + 'QuestionPaperSubmission',
                data : jsonStr
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getAllSubmissionsByOwner = function(owner)
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'QuestionPaperSubmission/Owner/' + owner + '/Completed/true'
            }).then(function(resp)
            {
                return resp.data;
            })
        };
        var getAllSubmissionsByOwnerAndTimeRange = function(owner,sDate,eDate)
        {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'QuestionPaperSubmission/Owner/' + owner + '/Completed/true/From/'+sDate+'/To/'+eDate
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        return {
            addNewSection: addNewSection,
            getSections: getSections,
            getPapers: getPapers,
            addNewPaper: addNewPaper,
            getQuestionsForPaper: getQuestionsForPaper,
            addQuestionToPaper: addQuestionToPaper,
            deleteQuestionById: deleteQuestionById,
            getPaperSubmissionBySession: getPaperSubmissionBySession,
            addAnswerToQuestion: addAnswerToQuestion,
            setPaperComplete: setPaperComplete,
            paperSubmission: paperSubmission,
            deleteSubmissionById: deleteSubmissionById,
            getAllSubmissionsByOwner: getAllSubmissionsByOwner,
            getAllSubmissionsByOwnerAndTimeRange: getAllSubmissionsByOwnerAndTimeRange,
            validateBeforeDeleteQuestion: validateBeforeDeleteQuestion,
            setPaperStatus: setPaperStatus,
            getPapersAll: getPapersAll
        };

    };



    var module = angular.module("veeryConsoleApp");
    module.factory("qaModuleService", qaModuleService);

}());

