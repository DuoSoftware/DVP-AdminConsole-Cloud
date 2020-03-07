/**
 * Created by Damith on 6/18/2016.
 */

mainApp.controller('signUpCtrl', function ($rootScope, $scope, $state, vcRecaptchaService,
    signUpServices, $auth, $http, moment) {

    //go to login

    $scope.myRecaptchaResponse = null;
    $scope.pwdBox = false;
    $scope.confirmPwd = null;
    $scope.siteKey = "6LezaAsUAAAAAMbVGpjJPNm86i__8a38YO1rtXEI";

    $scope.onClickLogIn = function () {
        $state.go('company');
    };
    $scope.companyName=$state.params.company;

    $scope.isSignUp = false;
    $scope.password = '';

    //fire notification
    var showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    //config captcha setting
    $scope.captchaConfig = applicationConfig.captchaEnable;


    var newUser = {
        companyname: '',
        password: '',
        mail: ''
    };

    //create new user
    var signUp = function (newUser) {
        $auth.signup(newUser)
            .then(function (response) {
                //$auth.setToken(response);
                showAlert('Job Done', 'success', 'You have successfully registered with Face Tone.Please check your email for verification.');
                $state.go('company');
            })
            .catch(function (response) {
                showAlert('Error', 'error', 'User Registration error.');
                $scope.isSignUp = false;
            });
    };

    $scope.newWidgetId = 0;
    $scope.getRecaptchaId = function (widgetId) {
        $scope.newWidgetId = widgetId;
        return;
    };

    $scope.onClickCreateAccount = function () {
        newUser.mail = $scope.email;
        newUser.companyname = $scope.companyName;
        newUser.password = $scope.password;
        newUser.timeZone = { tz: moment.tz.guess(), utcOffset: "" };
        $scope.isSignUp = true;

        if (vcRecaptchaService.getResponse($scope.newWidgetId) === "") { //if string is empty
          alert("Please resolve the captcha and submit!");
        } else {
        newUser['g-recaptcha-response'] = vcRecaptchaService.getResponse($scope.newWidgetId);
             signUp(newUser);
         }

    };


    $('#password').on('focus', function () {
        $scope.pwdBox = true;
    });
    $('#password').focusout(function () {
        $scope.pwdBox = false;
    });

    $scope.onClickBackToLogin = function () {
        $state.go('company');
    };


});

//Password verification
mainApp.directive('passwordVerify', function () {
    return {
        restrict: 'A', // only activate on element attribute
        require: 'ngModel', // get a hold of NgModelController
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('passwordVerify', function (val) {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.passwordVerify;
                // set validity
                var status = !val1 || !val2 || val1 === val2;
                ngModel.$setValidity('passwordVerify', status);
                // return val1
            };
        }
    }
});


// mainApp.directive('passwordStrength', [
//     function () {
//         return {
//             require: 'ngModel',
//             restrict: 'E',
//             scope: {
//                 password: '=ngModel'
//             },
//
//             link: function (scope, elem, attrs, ctrl, ngModel) {
//                 //password validation
//                 scope.isShowBox = false;
//                 scope.isPwdValidation = {
//                     minLength: false,
//                     specialChr: false,
//                     digit: false,
//                     capitalLetter: false
//                 };
//                 scope.$watch('password', function (newVal) {
//                     scope.strength = isSatisfied(newVal && newVal.length >= 8) +
//                         isSatisfied(newVal && /[A-z]/.test(newVal)) +
//                         isSatisfied(newVal && /(?=.*[A-Z])/.test(newVal)) +
//                         isSatisfied(newVal && /(?=.*\W)/.test(newVal)) +
//                         isSatisfied(newVal && /\d/.test(newVal));
//
//
//                     function isSatisfied(criteria) {
//                         return criteria ? 1 : 0;
//                     }
//
//
//                 }, true);
//             },
//             template: '<div ng-if="strength != ' + 5 + ' " ' +
//             'ng-show=strength class="password-progress-wrapper animated fadeIn "> <div class="progress password-progress">' +
//             '<div class="progress-bar progress-bar-danger" style="width: {{strength >= 1 ? 25 : 0}}%"></div>' +
//             '<div class="progress-bar progress-bar-warning" style="width: {{strength >= 2 ? 25 : 0}}%"></div>' +
//             '<div class="progress-bar progress-bar-warning" style="width: {{strength >= 3 ? 25 : 0}}%"></div>' +
//             '<div class="progress-bar progress-bar-success" style="width: {{strength >= 4 ? 25 : 0}}%"></div>' +
//             '</div></div>'
//         }
//     }
// ]);

mainApp.directive('passwordStrengthBox', [
    function () {
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                password: '=ngModel',
                confirm: '=',
                box: '=',
                invaliduserp: '='
            },

            link: function (scope, elem, attrs, ctrl) {
                //password validation
                scope.isShowBox = false;
                scope.isPwdValidation = {
                    minLength: false,
                    specialChr: false,
                    digit: false,
                    capitalLetter: false
                };

                scope.$watch('password', function (newVal) {
                    scope.strength = isSatisfied(newVal && newVal.length >= 8) +
                        isSatisfied(newVal && /[A-z]/.test(newVal)) +
                        isSatisfied(newVal && /(?=.*[A-Z])/.test(newVal)) +
                        isSatisfied(newVal && /(?=.*\W)/.test(newVal)) +
                        isSatisfied(newVal && /\d/.test(newVal));

                    if (!ctrl || !newVal || scope.strength != 5) {
                        ctrl.$setValidity('unique', false);
                    } else {
                        ctrl.$setValidity('unique', true);
                    }

                    //length
                    if (newVal && newVal.length >= 8) {
                        scope.isPwdValidation.minLength = true;
                    } else {
                        scope.isPwdValidation.minLength = false;
                    }

                    // Special Character
                    if (newVal && /(?=.*\W)/.test(newVal)) {
                        scope.isPwdValidation.specialChr = true;
                    } else {
                        scope.isPwdValidation.specialChr = false;
                    }

                    //digit
                    if (newVal && /\d/.test(newVal)) {
                        scope.isPwdValidation.digit = true;
                    } else {
                        scope.isPwdValidation.digit = false;
                    }

                    //capital Letter
                    if (newVal && /(?=.*[A-Z])/.test(newVal)) {
                        scope.isPwdValidation.capitalLetter = true;
                    } else {
                        scope.isPwdValidation.capitalLetter = false;
                    }


					/** Kasun_Wijeratne_2_MARCH_2018
					 * ------------------------------ */
                    if (scope.invaliduserp != undefined) {
                        if (scope.strength >= 5) {
                            scope.invaliduserp = false;
                        } else {
                            scope.invaliduserp = true;
                        }
                    }
					/**---------------------------------
					 Kasun_Wijeratne_2_MARCH_2018 */


                    //check password confirm validation
                    // if (scope.confirm) {
                    //     var origin = scope.confirm;
                    //     if (origin !== newVal) {
                    //         ctrl.$setValidity("unique", false);
                    //     } else {
                    //         ctrl.$setValidity("unique", true);
                    //     }
                    // };


                    function isSatisfied(criteria) {
                        return criteria ? 1 : 0;
                    }
                }, true);
            },
            template: '<div ng-if="strength != ' + 5 + ' "' +
                'ng-show=strength' +
                ' class="password-leg-wrapper animated fadeIn ">' +
                '<ul>' +
                '<li>' +
                '<i ng-show="isPwdValidation.minLength" class="ti-check color-green"></i>' +
                '<i ng-show="!isPwdValidation.minLength" class="ti-close color-red"></i>' +
                ' Min length 8' +
                '</li>' +
                '<li><i ng-show="isPwdValidation.specialChr" class="ti-check color-green "></i>' +
                '<i ng-show="!isPwdValidation.specialChr" class="ti-close color-red"></i>' +
                ' Special Character' +
                '</li>' +
                '<li><i ng-show="isPwdValidation.digit" class="ti-check color-green"></i>' +
                '<i ng-show="!isPwdValidation.digit" class="ti-close color-red"></i>' +
                ' Digit' +
                '</li>' +
                '<li><i ng-show="isPwdValidation.capitalLetter" class="ti-check color-green"></i>' +
                '<i ng-show="!isPwdValidation.capitalLetter" class="ti-close color-red"></i>' +
                ' Capital Letter' +
                ' </li>' +
                '</ul>' +
                '</div>'
        }
    }
]);

mainApp.directive('patternValidator', [
    function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {

                    var patt = new RegExp(attrs.patternValidator);

                    var isValid = patt.test(viewValue);

                    ctrl.$setValidity('passwordPattern', isValid);

                    // angular does this with all validators -> return isValid ? viewValue : undefined;
                    // But it means that the ng-model will have a value of undefined
                    // So just return viewValue!
                    return viewValue;

                });
            }
        };
    }
]);


mainApp.directive('uniqueCompany', ['signUpServices', function (signUpServices) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                scope.isLoading = false;
                scope.pwdBox = false;
                var currentValue = element.val();

                function validateCompany(companyName) {
                    var re = /^[a-zA-Z0-9]+$/;
                    return re.test(companyName);
                };

                if (!ngModel || !element.val() || !validateCompany(currentValue)) {
                    $('#companystate').removeClass('fa-circle-o-notch fa-spin fa-times fa-check');
                    ngModel.$setValidity('unique', false);
                    return;
                }


                $('#companystate').addClass('fa-circle-o-notch fa-spin').removeClass('fa-times fa-check');
                signUpServices.checkUniqueOrganization(currentValue, function (data) {
                    if (!data) {
                        $('#companystate').addClass('fa-check').removeClass('fa-circle-o-notch fa-spin fa-times');
                        ngModel.$setValidity('unique', true);
                    } else {
                        $('#companystate').addClass('fa-times').removeClass('fa-circle-o-notch fa-spin fa-check');
                        ngModel.$setValidity('unique', false);
                    }

                });

            });
        }
    }
}]);


mainApp.directive('uniqueOwner', ['signUpServices', function (signUpServices) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {

                function validateEmail(email) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                };

                scope.isLoading = false;
                if (!ngModel || !element.val() || !validateEmail(element.val())) {
                    $('#emailstate').removeClass('fa-circle-o-notch fa-spin fa-times fa-check');
                    ngModel.$setValidity('unique', false);
                    return;
                }
                var currentValue = element.val();

                $('#emailstate').addClass('fa-circle-o-notch fa-spin').removeClass('fa-times fa-check');
                signUpServices.checkUniqueOwner(currentValue, function (data) {
                    if (!data) {
                        $('#emailstate').addClass('fa-check').removeClass('fa-circle-o-notch fa-spin fa-times');
                        ngModel.$setValidity('unique', true);
                    } else {
                        $('#emailstate').addClass('fa-times').removeClass('fa-circle-o-notch fa-spin fa-check');
                        ngModel.$setValidity('unique', false);
                    }

                });


            });
        }
    }
}]);



