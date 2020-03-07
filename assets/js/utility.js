/**
 * Created by Damith on 8/16/2016.
 */

function getJSONData(http, file, callback) {
    http.get('assets/json/' + file + '.json').success(function (data) {
        console.log(data.d);
        callback(data.d);
    })
}

///* Set the width of the side navigation to 250px */
//function openNav() {
//    document.getElementById("mySidenav").style.width = "300px";
//    document.getElementById("main").style.marginRight = "285px";
//    // document.getElementById("navBar").style.marginRight = "300px";
//}
//
//
///* Set the width of the side navigation to 0 */
//function closeNav() {
//    document.getElementById("mySidenav").style.width = "0";
//    document.getElementById("main").style.marginRight = "0";
//    //  document.getElementById("navBar").style.marginRight = "0";
//}

/// div none and block
var divModel = function () {
    return {
        model: function (id, className) {
            if (className == 'display-block') {
                $(id).removeClass('display-none').addClass(className);
            } else if (className == 'display-none') {
                $(id).removeClass('display-block').addClass(className);
            }
        }
    }
}();


var resizeDiv = function () {
    vpw = $(window).width();
    vph = $(window).height() - 225;
    $('div.mainScrollerBar').attr("style", "height:" + vph + "px;");
};

$(document).ready(function () {
    resizeDiv();
});


$(window).resize(function () {
    resizeDiv();
});


/**
 * introLoader - Preloader
 */
$("#introLoader").introLoader({
    animation: {
        name: 'gifLoader',
        options: {
            ease: "easeInOutCirc",
            style: 'dark bubble',
            delayBefore: 500,
            delayAfter: 0,
            exitTime: 300
        }
    }
});


// JavaScript
var jsUpdateSize = function () {
    // Get the dimensions of the viewport
    var height = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    return height;
};

var getWindowWidth = function () {
    var width = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    return width;
};

// window.onload = jsUpdateSize;       // When the page first loads
// window.onresize = jsUpdateSize;     // When the browser changes size
