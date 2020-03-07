mainApp.controller('firstLoginCtrl', function ($rootScope, $scope, $state, $http,
                                               loginService,
                                               config, $base64, $auth,$q,$location,vcRecaptchaService,signUpServices,redctUrls,$window,$ngConfirm) {

    var userData ={};
    $scope.pwdBox = false;
    $scope.isRequested=false;
    $scope.showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };
    var showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    if($location.search().company)
    {
        userData.companyName = $location.search().company;
        $scope.companyName=userData.companyName;
    }
    if($location.search().role)
    {
        userData.role = $location.search().role;
    }
    if($location.search().invitation)
    {
        userData.invitation = $location.search().invitation;
    }


    $scope.newWidgetId = 0;
    $scope.getRecaptchaId = function (widgetId) {
        $scope.newWidgetId = widgetId;
        return;
    };



    $scope.setupPassword = function () {

        $scope.isRequested=true;
        if($scope.password)
        {
            userData.password = $scope.password;
        }
        if (vcRecaptchaService.getResponse($scope.newWidgetId) === "") { //if string is empty
            alert("Please resolve the captcha and submit!");
            $scope.isRequested=false;
        } else {
            userData['g-recaptcha-response'] = vcRecaptchaService.getResponse($scope.newWidgetId);
            sendPasswordConfirmation(userData)
        }
    };

    var sendPasswordConfirmation = function(user)
    {
        signUpServices.invitationSignup(user,function (isValid,status) {
            if(isValid)
            {
               /* console.log(user);
                $scope.showAlert("Info","info","Check your Email Inbox for Login");

                if(userData.role =='agent')
                {

                    $window.open(redctUrls.agent,"_self");
                }
                else
                {
                    $window.open(redctUrls.admin,"_self");
                }*/
                $scope.showConfirmation("Operation Succeeded...");
            }
            else
            {
                if(status=='409')
                {
                    $scope.showAlert("Error","error","Your invitation link has expired or You have already registered to this company ");

                }
                else{
                    $scope.showAlert("Error","error","Something went wrong, Try again");
                    $scope.isRequested=false;
                }

            }
        });
    }

    $('#password').on('focus', function () {
        $scope.pwdBox = true;
    });
    $('#password').focusout(function () {
        $scope.pwdBox = false;
    });


    $scope.showConfirmation = function (title, contentData,notRegSt, allText,registeredText, allFunc,regFunc ,closeFunc) {

        $ngConfirm({
            title: title,
            icon: 'glyphicon glyphicon-ok-circle',
            type: 'green',
            content: '<!--<strong>Password Setup Succeeded</strong>-->' +
                '<div>\n' +
                '    <div class="clearfix">\n' +
                '  Your password setup process is succeeded. Please check your mails for Confirmation process' +
                '\n' +
                '    </div>\n' +
                '\n' +
                '</div>', // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            boxHeight: '100px',
            theme: 'my-theme',
            buttons: {

            }
        });
    };



});