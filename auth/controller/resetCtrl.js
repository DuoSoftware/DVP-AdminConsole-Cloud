/**
 * Created by Damith on 6/1/2016.
 */

mainApp.controller('resetCtrl', function ($rootScope, $scope, $state, $http,
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

    $scope.email = '';



    $scope.ResetPassword = function () {


        loginService.forgetPassword($scope.email, function (isSuccess) {
            if(isSuccess){
                showAlert('Success', 'success', "Please check email");
                $state.go('company');
            }else{
                showAlert('Error', 'error', "reset failed");
            }
        })



    }


    $scope.BackToLogin= function () {


        $state.go('company');


    }



});