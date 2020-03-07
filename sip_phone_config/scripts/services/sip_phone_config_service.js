/**
 * Created by waruna on 4/7/2017.
 */
(function () {

    var sipUserService = function ($http, baseUrls) {

        var getPhoneConfigs = function () {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint + 'IPPhone/Configs'
            }).then(function (resp) {
                return (resp.data && resp.data.IsSuccess) ? resp.data.Result : [];
            })
        };

        var reassignIpPhoneToCompany = function (mac,company) {
            return $http({
                method: 'PUT',
                url: baseUrls.sipUserendpoint + 'IPPhone/Config/'+mac+'/reassign',
                data:{company:company}
            }).then(function (resp) {
                return resp.data.IsSuccess;
            })
        };

        var add_sip_account_to_phone = function (mac,sip_user) {
            return $http({
                method: 'PUT',
                url: baseUrls.sipUserendpoint + 'IPPhone/Config/'+mac+'/uac/'+sip_user
            }).then(function (resp) {
                return resp.data.IsSuccess;
            })
        };



        return {
            reassignIpPhoneToCompany: reassignIpPhoneToCompany,
            getPhoneConfigs: getPhoneConfigs,
            add_sip_account_to_phone: add_sip_account_to_phone

        };
    };

    mainApp.factory("sipUserService", sipUserService);

}());