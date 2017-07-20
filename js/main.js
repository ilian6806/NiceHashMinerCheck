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

    var DEFAULT_ALGO = NH_ALGORITMS['Equihash'];
    var DEFAULT_CURR = 'BGN';

    var $view = {};

    function initializeComponents() {
        $view = {
            unpaid: $('#nh-unpaid'),
            unpaidCurr: $('#nh-unpaid-curr'),
            unpaidCurrLabel: $('#nh-unpaid-curr-label'),
            profitability: $('#nh-prof'),
            profitabilityCurr: $('#nh-prof-curr'),
            profitabilityCurrLabel: $('#nh-prof-curr-label'),
            efficiency: $('#nh-effic'),
            speed: $('#nh-speed'),
            refreshBtn: $('#nh-refresh-btn'),
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

        var current = data.current[0];

        var acceptedSpeed = parseFloat(current.data[0].a);
        var rejectedSpeed = parseFloat(current.data[0].rs || 0);

        var totalSpeed = acceptedSpeed + rejectedSpeed;
        var efficiency = (acceptedSpeed / totalSpeed) * 100;

        var balance = parseFloat(current.data[1]);
        var profitability = parseFloat(current.profitability * acceptedSpeed);

        $view.unpaid.html(balance + getSmallText(' BTC'));
        $view.unpaidCurr.html((balance * price).toFixed(2) + ' ' + getSmallText(currency));
        $view.unpaidCurrLabel.html($view.unpaidCurrLabel.html().replace('_', currency));

        $view.profitability.html(profitability.toFixed(4) + getSmallText(' BTC/day'));
        $view.profitabilityCurr.html((profitability * price).toFixed(2) + ' ' + getSmallText(currency + '/day'));
        $view.profitabilityCurrLabel.html($view.profitabilityCurrLabel.html().replace('_', currency));

        $view.efficiency.html(efficiency + getSmallText('%'));

        $view.speed.html(acceptedSpeed.toFixed(2) + getSmallText(' Sol/s'));
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

            loader.show();

            NiceHashApi.call('stats.provider.ex', { 
                addr: urlParams.addr, 
            }, function (response) {
                handlers.stats.provider.ex(response, currency, btcPrice);
                loader.hide();
            });
        });
    }

    function bindEvents() {
        $view.refreshBtn.off('click').on('click', update);
    }

    function load() {
        initializeComponents();
        bindEvents();
        update();
    }

    return { load: load };

})();
