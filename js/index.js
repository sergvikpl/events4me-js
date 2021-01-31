$(document).ready(function () {
    if(getCookieTokenExpiration('access_token') != undefined
        && Math.floor(new Date().getTime()/1000) < getCookieTokenExpiration('access_token')) {
        window.location.replace('./profile')
    }
});