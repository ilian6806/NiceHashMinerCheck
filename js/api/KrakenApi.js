/**
 * Kraken api wrapper
 * Autor: Ilian Iliev
 * 
 * Date: 17-07-2017
 */

KrakenApi = (function () {

    'use strict';

    var exports = {};

    var BASE_URL = 'https://api.kraken.com/0/public/';


    /**
     * Custom error constructor
     */
    function KrakenApiError(message) {
        message = message || 'Unhandled exception';
        this.name = 'KrakenApiError';
        this.message = '[KrakenApiError]:' + message;
    }


    /**
     * Main api method - call api method and invoke the callback with response
     */
    exports.call = function (method, params, callback) {

        if (!BaseApi.isValidMethod(method)) {
            throw new KrakenApiError('call() first argument must be of type string');
        }

        callback = callback || BaseApi.doNothing;
        params = params || {};

        BaseApi.call(BASE_URL + method, params, callback);
    };

    return BaseApi.PublicMethods(exports);

}());
