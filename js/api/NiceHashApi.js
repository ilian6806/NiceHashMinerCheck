/**
 * NiceHash api wrapper
 * Autor: Ilian Iliev
 * 
 * Date: 17-07-2017
 */

NiceHashApi = (function () {

    'use strict';

    var exports = {};

    var BASE_URL = 'https://api.nicehash.com/api';


    /**
     * Custom error constructor
     */
    function NiceHashApiError(message) {
        message = message || 'Unhandled exception';
        this.name = 'NiceHashApiError';
        this.message = '[NiceHashApiError]:' + message;
    }


    /**
     * Main api method - call api method and invoke the callback with response
     */
    exports.call = function (method, params, callback) {

        if (!BaseApi.isValidMethod(method)) {
            throw new NiceHashApiError('call() first argument must be of type string');
        }

        callback = callback || BaseApi.doNothing;
        params = params || {};
        params.method = method;


        BaseApi.call(BASE_URL, params, callback);
    };

    return BaseApi.PublicMethods(exports);

}());
