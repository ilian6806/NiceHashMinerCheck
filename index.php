<!DOCTYPE html>
<html>
<head>
    <title>NH</title>
    <meta charset="utf-8">
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <meta name="msapplication-tap-highlight" content="no" />
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
</head>
<body>
    <br />
    <div class="main-container">

        <table class="width-100">
            <tr>
                <td class="ta-left inline width-30">Unpaid:</td>
                <td id="nh-unpaid" class="ta-right inline width-60 m-left-5 inner-box">-</td>
            </tr>
            <tr>
                <td id="nh-unpaid-curr-label" class="ta-left inline width-30"></td>
                <td id="nh-unpaid-curr" class="ta-right inline width-60 m-left-5 inner-box">-</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td class="ta-left inline width-30">Profitability:</td>
                <td id="nh-prof" class="ta-right inline width-60 m-left-5 inner-box">-</td>
            </tr>
            <tr>
                <td id="nh-prof-day-label" class="ta-left inline width-30"></td>
                <td id="nh-prof-day" class="ta-right inline width-60 m-left-5 inner-box">-</td>
            </tr>
            <tr>
                <td id="nh-prof-month-label" class="ta-left inline width-30"></td>
                <td id="nh-prof-month" class="ta-right inline width-60 m-left-5 inner-box">-</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td class="ta-left inline width-30">Efficiency:</td>
                <td id="nh-effic" class="ta-right inline width-60 m-left-5 inner-box">-</td>
            </tr>
            <tr>
                <td class="ta-left inline width-30">Speed:</td>
                <td id="nh-speed" class="ta-right inline width-60 m-left-5 inner-box">-</td> 
            </tr>
            <tr>
                <td class="ta-left inline width-30">Algorithm:</td>
                <td id="nh-algo" class="ta-right inline width-60 m-left-5 inner-box">-</td> 
            </tr>
        </table>

        <div class="btc-price-wrapper">
            <span id="btc-price" class="btc-price-container"></span>
        </div>

        <div id="nh-redirect-btn" class="redirect-btn bottom-btn">NH</div>
        <img src="img/refresh.png" id="nh-refresh-btn" class="refresh-btn bottom-btn" />

        <img src="img/loading.gif" id="nh-loader" class="loader" />
    </div>

    <script src="js/libs/jquery-3.2.1.min.js"></script>

    <script src="js/api/BaseApi.js"></script>
    <script src="js/api/CoinMarketApi.js"></script>
    <script src="js/api/NiceHashApi.js"></script>
    <script src="js/api/KrakenApi.js"></script>

    <script src="js/main.js"></script>

    <script type="text/javascript">
        $(function () {
            MainPageController.load();
        });
    </script>
</body>
</html>