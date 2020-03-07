/**
 * Created by Damith on 6/1/2016.
 */

mainApp.controller('reEnterPWCtrl', function ($rootScope, $stateParams, $scope, $state, $http,
                                              loginService) {


    var showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3',
            animate: {
                animate: true,
                in_class: "bounceIn",
                out_class: "bounceOut"
            }
        });
    };

    $scope.password = '';


    $scope.isLoadinRstPwd = false;
    $scope.ReEnterPassword = function () {
        $scope.isLoadinRstPwd = true;
        loginService.resetPassword($stateParams.token, $scope.password, function (isSuccess) {
            $scope.isLoadinRstPwd = false;
            if (isSuccess) {
                showAlert('Success', 'success', "Please login with new password");
                $state.go('company');
            } else {
                showAlert('Error', 'error', "reset failed");
            }
        })
    };


    $scope.CheckTokenExists = function () {
        loginService.tokenExsistes($stateParams.token, function (isSuccess) {
            if (isSuccess) {
                //showAlert('Success', 'success', "Please login with new password");
                //$state.go('login');
            } else {
                showAlert('Error', 'error', "reset failed due to token expire");
                $state.go('ResetPw');
            }
        })
    }


    $scope.BackToLogin = function () {
        $state.go('company');
    }


    $scope.CheckTokenExists();

});