/**
 * Handle all js code on the page
 */
MainPageController = (function () {

    var NH_ALGORITMS = {
        'Scrypt': 0,
        'SHA256': 1,
        'ScryptNf': 2,
        'X11': 3,
        'X13': 4,
        'Keccak': 5,
        'X15': 6,
        'Nist5': 7,
        'NeoScrypt': 8,
        'Lyra2RE': 9,
        'WhirlpoolX': 10,
        'Qubit': 11,
        'Quark': 12,
        'Axiom': 13,
        'Lyra2REv2': 14,
        'ScryptJaneNf16': 15,
        'Blake256r8': 16,
        'Blake256r14': 17,
        'Blake256r8vnl': 18,
        'Hodl': 19,
        'DaggerHashimoto': 20,
        'Decred': 21,
        'CryptoNight': 22,
        'Lbry': 23,
        'Equihash': 24,
        'Pascal': 25,
        'X11Gost': 26,
        'Sia': 27,
        'Blake2s': 28
    };

    var NICEHASH_URL = 'https://www.nicehash.com/miner/';

    var DEFAULT_ALGO = NH_ALGORITMS['Equihash'];
    var DEFAULT_CURR = 'BGN';

    var $view = {};

    function initializeComponents() {
        $view = {
            unpaid: $('#nh-unpaid'),
            unpaidCurr: $('#nh-unpaid-curr'),
            unpaidCurrLabel: $('#nh-unpaid-curr-label'),
            profitability: $('#nh-prof'),
            profitabilityDay: $('#nh-prof-day'),
            profitabilityDayLabel: $('#nh-prof-day-label'),
            profitabilityMonth: $('#nh-prof-month'),
            profitabilityMonthLabel: $('#nh-prof-month-label'),
            efficiency: $('#nh-effic'),
            speed: $('#nh-speed'),
            algo: $('#nh-algo'),
            btcPrice: $('#btc-price'),
            refreshBtn: $('#nh-refresh-btn'),
            redirectBtn: $('#nh-redirect-btn'),
            loader: $('#nh-loader')
        };
    }

    var loader = {
        show: function () {
            $view.loader.show();
        },
        hide: function () {
            $view.loader.hide();
        },
    };

    function each(arr, func) {
        for (var i = 0 ; i < arr.length; i++) {
            func.call(arr[i], i);
        }
    }

    function getJsonFromUrl() {
        var query = location.search.substr(1);
        var result = {};
        query.split('&').forEach(function(part) {
            var item = part.split('=');
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    function buildQueryString(params) {
       var str = [];
       for(var p in params){
           if (params.hasOwnProperty(p)) {
               str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
           }
       }
       return '?' + str.join('&');
    }

    function redirectWithParams(params) {
        var queryString = buildQueryString(params);
        var fullPath = window.location.protocol + '//' + window.location.host + window.location.pathname;
        window.location.replace(fullPath + queryString);
    }

    function getSmallText(text) {
        return '<span class="smaller-text">' + text + '</span>';
    }

    function getAddrPromptText() {
        return (
            'This page has the simple purpose of giving quick info for NiceHash miner, ' +
            'by given BTC address and currency (default is BGN).\n\n\ ' +
            'You can paste your address below:'
        );
    }

    var handlers = {
        stats: {
            provider: {}
        }
    };

    handlers.stats.provider.ex = function(response, currency, price) {

        var data = response.result;

        if (data.error) {
            alert(data.error);
            return;
        }

        var current = {};

        for (var i = 0, len = data.current.length; i < len; i++) {
            if (data.current[i].data 
             && data.current[i].data[0] 
             && data.current[i].data[0].a
            ) {
                current = data.current[i];
                break;
            }
        }

        var acceptedSpeed = parseFloat(current.data[0].a || 0);
        var rejectedSpeed = parseFloat(current.data[0].rs || 0);

        var totalSpeed = acceptedSpeed + rejectedSpeed;
        var efficiency = (acceptedSpeed / totalSpeed) * 100;
        efficiency = isNaN(efficiency) ? 0 : efficiency;

        var balance = parseFloat(current.data[1]);
        var profitability = parseFloat(current.profitability * acceptedSpeed);

        $view.unpaid.html(balance + getSmallText(' BTC'));
        $view.unpaidCurr.html((balance * price).toFixed(2) + ' ' + getSmallText(currency));
        $view.unpaidCurrLabel.html($view.unpaidCurrLabel.html().replace('_', currency));

        $view.profitability.html(profitability.toFixed(4) + getSmallText(' BTC/day'));
        $view.profitabilityDay.html((profitability * price).toFixed(2) + ' ' + getSmallText(currency + '/day'));
        $view.profitabilityMonth.html(((profitability * price) * 27).toFixed(2) + ' ' + getSmallText(currency + '/mth'));

        $view.efficiency.html(efficiency + getSmallText('%'));

        $view.speed.html(acceptedSpeed.toFixed(2) + getSmallText(' Sol/s'));
        $view.algo.html(current.name);
    }

    function update() {

        var urlParams = getJsonFromUrl();
        var currency = urlParams.currency || DEFAULT_CURR;

        if (!urlParams.addr) {
            var addr = prompt(getAddrPromptText());
            if (addr && addr != 'null') {
                redirectWithParams({ addr: addr });
            }
            loader.hide();
            return;
        }

        loader.show();

        CoinMarketApi.call({ 
            convert: currency, 
            limit: 1
        }, function (response) {

            loader.hide();

            if (! response || ! response[0]) {
                alert('BTC price unavailable.');
                return;
            }

            var btcPrice = response[0]['price_' + currency.toLowerCase()];

            if (!btcPrice) {
                alert('Unable to get BTC price in current value.');
                return;
            }

            $view.btcPrice.html(parseFloat(btcPrice).toFixed(2));

            loader.show();

            NiceHashApi.call('stats.provider.ex', { 
                addr: urlParams.addr, 
            }, function (response) {
                handlers.stats.provider.ex(response, currency, btcPrice);
                loader.hide();
            });
        });
    }

    function goToNiceHash() {
        loader.show();
        setTimeout(function () {
            window.location = NICEHASH_URL +  getJsonFromUrl()['addr'];
        }, 50);
    }

    function bindEvents() {
        $view.refreshBtn.off('click').on('click', update);
        $view.redirectBtn.off('click').on('click', goToNiceHash);
    }

    function load() {
        initializeComponents();
        bindEvents();
        update();
    }

    return { load: load };

})();
