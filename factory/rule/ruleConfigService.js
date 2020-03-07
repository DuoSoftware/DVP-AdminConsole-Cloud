/**
 * Created by Pawan on 6/3/2016.
 */
/**
 * Created by Pawan on 5/28/2016.
 */

mainApp.factory('ruleconfigservice', function ($http, baseUrls) {

    return {

        allRulePicker : function () {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRules'
            }).then(function(response)
            {
                return response;
            });
        },

        inboundRulePicker : function () {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRules/Direction/INBOUND'
            }).then(function(response)
            {
                return response;
            });
        },

        outboundRulePicker : function () {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRules/Direction/OUTBOUND'
            }).then(function(response)
            {
                return response;
            });
        },

        addNewRule : function (newRuleObj) {

            if(!newRuleObj.Context || newRuleObj.Context=="" )
            {
                newRuleObj.Context="ANY"
            }
            if(newRuleObj.Direction=='INBOUND')
            {
                newRuleObj.TrunkNumber=null;
            }

            return $http({
                method: 'POST',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule',
                data:newRuleObj
            }).then(function(response)
            {
                return response;
            });
        },

        getContextList : function () {

            return $http({
                method: 'GET',
                url: baseUrls.sipUserendpoint +"SipUser/"  + 'Contexts'
            }).then(function(response)
            {
                return response;
            });


        },
        loadTrunks: function () {

            return $http({
                method: 'GET',
                url: baseUrls.TrunkServiceURL + 'PhoneNumberTrunkApi/TrunkNumbers'
            }).then(function(response)
            {
                return response;
            });


        },
        deleteRules: function (rule) {
            return $http({
                method: 'DELETE',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule/'+rule.id
            }).then(function(response)
            {
                response.data.id=rule.id;
                return response;
            });

        },
        getRule : function (rID) {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule/'+rID
            }).then(function(response)
            {
                return response;
            });


        },

        loadApps : function () {
            return $http({
                method: 'GET',
                url: baseUrls.appregistryServiceUrl + 'APPRegistry/Applications'
            }).then(function(response)
            {
                return response;
            });

        },

        loadTranslations : function () {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/Translations'
            }).then(function(response)
            {
                return response;
            });

        },
         attchDNISTransToRule : function (rID,dtID) {
            return $http({
                method: 'POST',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule/'+rID+'/SetDNISTranslation/'+dtID
            }).then(function(response)
            {
                return response;
            });


        },
        attchANITransToRule : function (rID,atID) {
            return $http({
                method: 'POST',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule/'+rID+'/SetANITranslation/'+atID
            }).then(function(response)
            {
                return response;
            });

        },

        updateRules :function (rule) {
            return $http({
                method: 'PUT',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule/'+rule.id,
                data:rule
            }).then(function(response)
            {
                return response;
            });



        },
        attchAppWithRule : function (rID,aID) {

            return $http({
                method: 'POST',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule/'+rID+'/SetApplication/'+aID
            }).then(function(response)
            {
                return response;
            });

        },
        attachScheduleWithRule : function (rID,sID) {

            return $http({
                method: 'POST',
                url: baseUrls.ruleServiceUrl + 'CallRuleApi/CallRule/'+rID+'/SetSchedule/'+sID
            }).then(function(response)
            {
                return response;
            });

        }


    }
});




