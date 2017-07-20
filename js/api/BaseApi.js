/**
 * Basic api wrappers functions
 * Autor: Ilian Iliev
 * 
 * Date: 17-07-2017
 */

BaseApi = (function () {

    'use strict';

    var exports = {};

    var PROXY_URL = 'proxy.php';


    /**
     * Get xhr object for all major browsers
     */
    function getXHR() {

        var xhr = null;

        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
            try {
                xhr = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                try {
                  xhr = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e) {}
            }
        }

        return xhr;
    }


    /**
     * Build URL query string from plain object
     */
    function buildQueryString(params) {

       var str = [];

       for(var p in params){
           if (params.hasOwnProperty(p)) {
               str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
           }
       }

       return '?' + str.join('&');
    }


    /**
     * Main method - call api method and invoke the callback with response
     */
    exports.call = function (baseUrl, params, callback) {
    
        var xhr = getXHR();
        var url = PROXY_URL + buildQueryString(params);
        
        xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('BASE_URL=' + baseUrl);
    };


    /**
     * Empty function reference
     */
    exports.doNothing = function () { };


    /**
     * Validate input method param
     */
    exports.isValidMethod = function (method) { 
        return method && (typeof method).toLowerCase() == 'string';
    };


    /**
     * Disable toString method - because we can, thats why...
     */
    exports.PublicMethods = function (exports) {
        for (var method in exports) {
            if (exports.hasOwnProperty(method) && exports[method].call) {
                exports[method].toString = function () { return '[ Native code ]'; };
            }
        }
        return exports;
    };

    return exports.PublicMethods(exports);

}());
