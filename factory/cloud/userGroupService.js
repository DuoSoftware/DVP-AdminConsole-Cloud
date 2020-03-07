/**
 * Created by codemax on 02/03/20220.
 */

mainApp.service("userGroupService", function ($http, $log,  baseUrls) {

    var assignNumber = function (postData) {
        return $http({
            method: "POST",
            url: baseUrls.agentDialerURL + "AssignNumbers",
            data: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };
    var checkJobStatus = function (jobId) {
        return $http({
            method: "GET",
            url: baseUrls.agentDialerURL + "/Job/"+jobId
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });
    };

    return {
        AssignNumber: assignNumber,
        CheckJobStatus:checkJobStatus
    };
});
