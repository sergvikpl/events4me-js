function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setValue(id, val) {
    if(val)
        document.getElementById(id).value=val;
}
function getValue (id) {
    return document.getElementById(id).value;
}
function getUnix(date, time) {
    var time = new Date(date + " " + time);
    return time.getTime();
}
(function ($, undefined) {
    "use strict";

    // use this transport for "binary" data type
    $.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
        // check for conditions and support for blob / arraybuffer response type
        if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
            return {
                // create new XMLHttpRequest
                send : function (headers, callback) {
                    // setup all variables
                    var xhr = new XMLHttpRequest(),
                        url = options.url,
                        type = options.type,
                        async = options.async || true,
                        // blob or arraybuffer. Default is blob
                        dataType = options.responseType || "blob",
                        data = options.data || null,
                        username = options.username || null,
                        password = options.password || null;

                    xhr.addEventListener('load', function () {
                        var data = {};
                        data[options.dataType] = xhr.response;
                        // make callback and send data
                        callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                    });
                    xhr.addEventListener('error', function () {
                        var data = {};
                        data[options.dataType] = xhr.response;
                        // make callback and send data
                        callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                    });

                    xhr.open(type, url, async, username, password);

                    // setup custom headers
                    for (var i in headers) {
                        xhr.setRequestHeader(i, headers[i]);
                    }

                    xhr.responseType = dataType;
                    xhr.send(data);
                },
                abort : function () {}
            };
        }
    });
})(window.jQuery);

function toTimestamp(str) {
    var date = Date.parse(str);
    return date/1000;
};
function compareDate(string) {
    var start = toTimestamp(new Date(Number(string.slice(0, string.indexOf("-")))));
    var end = toTimestamp(new Date(Number(string.slice(string.indexOf("-")+1, string.length))));
    var today = new Date();
    var now = toTimestamp(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    return ((start<=now) && (now<=end));
};

function compareString (string, item)
{
    if (string.toLowerCase().indexOf(item.toLowerCase())>=0)
        return true;
    else return false;
};
function prettyAddress(str) {
    if (compareString(str, "Россия, Санкт-Петербург"))
        return str.slice(25, str.length);
    if (compareString(str, "Россия, "))
        return str.slice(8, str.length);
};
function checkReg (userId) {
    var reg = JSON.parse(sessionStorage.getItem("registrations"));
    var r = false;
    reg.reduce(function(prev,item){
        if (item.user.id==userId)
            r = item.registered;
    },0);
    return r;
}
function checkToken (){
    if (!getCookie('access_token'))
        return false;
    var str = getCookie('access_token');
    console.log(getCookie('access_token'));
    str = str.split('.');
    str = JSON.parse(atob(str[1]));
    var now = toTimestamp(new Date());
    return (now<str.exp);
}
$('.outLogin').click(function(){
    setCookie('saveMe', false);
});


function addSection() {
    if ($('.section').children()[$('.section').children().length-1].value!='')
        $('.section').append('<input type="text" required id="nameSec">');
}

function arrSections() {
    var sections = [];
    $('.section').children().map(function (item, i) {
        if(i.value!=='')
            sections.push(i.value);
    });
    return JSON.stringify(sections);//должен взвращать массив объектов вида {'name': 'название секции'}
}