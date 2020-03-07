/**
 * Created by Waruna on 8/14/2017.
 */

mainApp.directive("lastReserved", function ($filter, $interval) {

    return {
        restrict: "EA",
        scope: {
            lastReservedTime: '=',
            userName: '@?'
        },

        templateUrl: 'agent_status/view/template/lastReserved.html',


        link: function (scope, element, attributes) {
            scope.timeNow = new Date().getTime();

            $interval(function () {
                scope.timeNow = new Date().getTime();
            }, 1000);
        }


    }
}).filter("timeago", function () {
    //time: the time
    //local: compared to what time? default: now
    //raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
    return function (time, local, raw) {
        if (!time) return "N/A";

        if (!local) {
            (local = Date.now())
        }

        if (angular.isDate(time)) {
            time = time.getTime();
        } else if (typeof time === "string") {
            time = new Date(time).getTime();
        }

        if (angular.isDate(local)) {
            local = local.getTime();
        } else if (typeof local === "string") {
            local = new Date(local).getTime();
        }

        if (typeof time !== 'number' || typeof local !== 'number') {
            return;
        }
        function pad(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        }
        var
            offset = Math.abs((local - time) / 1000),
            span = [],
            MINUTE = 60,
            HOUR = 3600,
            DAY = 86400,
            WEEK = 604800,
            MONTH = 2629744,
            YEAR = 31556926,
            DECADE = 315569260;


        var hours = parseInt(offset / HOUR);
        var restHours = parseInt(offset % HOUR);
        var minutes = parseInt(restHours / MINUTE);
        var seconds = parseInt(restHours % MINUTE);



        if(hours > 0){

            span = [pad(hours), 'hr',pad(minutes), 'mins'];

        }else{
            if(minutes > 0){

                span = [pad(minutes), 'min', pad(seconds), 'secs'];

            }else{

                span = [pad(seconds), 'second'];
            }
        }



        //
        // if (offset <= MINUTE) span = [Math.round(Math.abs(offset)), 'second'];//['', raw ? 'now' : [Math.round(offset), 'second']];
        // else if (offset < (MINUTE * 60)) {
        //     //span = [Math.round(Math.abs(offset / MINUTE)), 'min'];
        //     var sec = offset - ((Math.floor(offset / MINUTE)) * 60);
        //     span = [Math.round(Math.abs(offset / MINUTE)), 'min', Math.round(Math.abs(sec)), 'seconds'];
        // }
        // else if (offset < (HOUR * 24)) {
        //     var hor = offset - ((Math.floor(offset / HOUR)) * 3600);
        //     span = [Math.round(Math.abs(offset / HOUR)), 'hr', Math.round(Math.abs(hor / MINUTE)), 'mins'];
        // }
        // else if (offset < (DAY * 7)) span = [Math.round(Math.abs(offset / DAY)), 'day'];
        // else if (offset < (WEEK * 52)) span = [Math.round(Math.abs(offset / WEEK)), 'week'];
        // else if (offset < (YEAR * 10)) span = [Math.round(Math.abs(offset / YEAR)), 'year'];
        // else if (offset < (DECADE * 100)) span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
        // else                               span = ['', 'a long time'];

        span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
        span = span.join(' ');

        if (raw === true) {
            return span;
        }
        return (time <= local) ? span + ' ago' : 'in ' + span;
    }
});