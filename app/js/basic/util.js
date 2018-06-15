/**
 * Created by linxd on 2018/5/28.
 */

iS3.util = function () {

};

iS3.util.checkData = function (data) {
    if (data.success === false) {
        console.log(data.error);
        return false;
    }
    return true;
};

iS3.util.stringHash = function (s) {
    var hash = 0;
    if (s.length == 0) {
        return hash;
    }
    for (var i = 0; i < s.length; i++) {
        var char = s.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
};

iS3.util.getParamFromUrl = function (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};