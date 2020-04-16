'use strict';

function AddAdvertisingAtopBody (head, body)
{
    //This is correct code!
   // var googleAdsenseJs = '<script data-ad-client="ca-pub-3309085785138087" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>';
    //head.append(googleAdsenseJs);

    body.prepend('<div id="advertisingDiv" class="advertisingClass">This is for Stock Symbol Chrome Extension advertising.</div>');
}