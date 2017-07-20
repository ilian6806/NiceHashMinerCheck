/**
 * Coin Market api wrapper
 * Autor: Ilian Iliev
 * 
 * Date: 17-07-2017
 */

CoinMarketApi = (function () {

    'use strict';

    var exports = {};

    var BASE_URL = 'https://api.coinmarketcap.com/v1/ticker/';


    /**
     * Main api method - call api method and invoke the callback with response
     */
    exports.call = function (params, callback) {

        callback = callback || BaseApi.doNothing;
        params = params || {};

        BaseApi.call(BASE_URL, params, callback);
    };

    return BaseApi.PublicMethods(exports);

}());
