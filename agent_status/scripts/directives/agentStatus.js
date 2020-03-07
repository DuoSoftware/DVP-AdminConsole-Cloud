/**
 * Created by Rajinda on 6/13/2016.
 */

mainApp.directive("agentstatus", function ($filter, moment, agentStatusService, userImageList) {

    return {
        restrict: "EA",
        scope: {
            resItem: '=',
            attributesList: '=',
            activeCallList: '=',
            productivityList: '=',
            showSummary: '=',
            viewState: '=',
            productivity:'='
        },

        templateUrl: 'agent_status/view/template/agentStatus.html',


        link: function (scope, element, attributes) {
            /*var productivityData = $filter('filter')(scope.productivityList, {ResourceId: scope.resItem.ResourceId});
            if (productivityData.length > 0)
                scope.productivity = productivityData[0];*/

            scope.profile = {
                name: '',
                slotState: null,
                LastReservedTime: 0,
                other: null,
                avatar: null,
                slotStateTime: 0,
            };

            // Kasun_Wijeratne_2_21_2018
			scope.agentStateHelper = {
				suspended: '#000',
				offline: '#000',
				available: '#56ab46',
				inbound: '#56ab46',
				connected: '#4ec4d2',
				outbound: '#777',
				afterwork: '#f9bf2b',
				reserved: '#753a88',
				officialbreak: '#db2a26',
				break: '#db2a26',
				other: '#bbb'
			}
            // Kasun_Wijeratne_2_21_2018 - ENDS

            scope.profile.name = scope.resItem.ResourceName;

            //get current user profile image
            userImageList.getAvatarByUserName(scope.profile.name, function (res) {
                scope.profile.avatar = res;
            });

            /* /!* Set ConcurrencyInfo *!/
             var sessionIds = [];
             angular.forEach(scope.resItem.ConcurrencyInfo, function (item) {
             try {
             var slotInfo = $filter('filter')(item.SlotInfo, {State: "Connected"});
             if (slotInfo.length > 0) {
             var sid = slotInfo[0].HandlingRequest;
             sessionIds.push(sid);
             }
             }
             catch (ex) {
             console.info(ex);
             }
             });

             /!*Get Call info base on sid*!/
             scope.callInfos = [];
             angular.forEach(scope.activeCallList, function (item) {
             try {
             var inboundCalls = $filter('filter')(item, {'Call-Direction': "inbound"});
             angular.forEach(sessionIds, function (sid) {
             try {
             var callInfo = $filter('filter')(inboundCalls, {'Unique-ID': sid});
             if (callInfo.length > 0) {

             scope.callInfos.push(callInfo[0]);
             }
             } catch (ex) {
             console.info(ex);
             }
             })
             }
             catch (ex) {
             console.info(ex);
             }
             });

             /!* Set ConcurrencyInfo*!/*/

            /*update damith */
            scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };
            scope.scrollEnabled = false;
            scope.viewScroll = function () {
                scope.safeApply(function () {
                    scope.scrollEnabled = true;
                });

            };
            scope.hideScroll = function () {
                scope.safeApply(function () {
                    scope.scrollEnabled = false;
                });
            };

            scope.scrollOtherEnabled = false;
            scope.viewOtherScroll = function () {
                scope.safeApply(function () {
                    scope.scrollOtherEnabled = true;
                });

            };
            scope.hideOtherScroll = function () {
                scope.safeApply(function () {
                    scope.scrollOtherEnabled = false;
                });
            };
        }


    }
});

mainApp.filter('secondsToDateTime', [function () {
    return function (seconds) {
        if (!seconds) {
            return new Date(1970, 0, 1).setSeconds(0);
        }
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);

mainApp.filter('millisecondsToDateTime', [function () {
    return function (seconds) {
        return new Date(1970, 0, 1).setMilliseconds(seconds);
    };
}]);