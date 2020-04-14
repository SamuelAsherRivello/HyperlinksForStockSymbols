'use strict';

let TOKEN = "XXX";
//
let HYPERLINK = "";
HYPERLINK += "<div class='tooltip'>";
HYPERLINK += "<span class='StockSymbolClass' name='StockSymbolName' data='XXX' >$XXX</span>"
HYPERLINK += "<span class='tooltiptext'>Tooltip text</span>";
HYPERLINK += "</div>";
//
let PREFIX_AFTER_REPLACEMENT = "$";
let DATA_ATTRIBUTE = "data";
let STOCK_SYMBOL_NAME = "StockSymbolName";

//OPTIONS
let DESTINATION_URL_GOOGLE = {"name":"Google","url": "https://www.google.com/search?q=XXX+stock+symbol"};
let DESTINATION_URL_YAHOO = {"name":"Yahoo Finance","url": "https://finance.yahoo.com/quote/XXX/"};
let DESTINATION_URL_TRADINGVIEW = {"name":"Trading View","url": "https://www.tradingview.com/symbols/XXX/"};
let DESTINATION_URL_ROBINHOOD = {"name":"Robin Hood","url": "https://robinhood.com/stocks/XXX/"};
let DESTINATION_URL_INDEX_DEFAULT = 0;

// STORAGE KEYS
let KEY_DESTINATION_URL_INDEX = "KEY_DESTINATION_URL_INDEX";