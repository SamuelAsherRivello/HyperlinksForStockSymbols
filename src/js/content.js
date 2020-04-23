'use strict';

window.onload = function() 
{
    console.log("EVENT! onload() Complete!")

    //var test1 = $( '#header' ); // select the element with an ID of 'header'
    //var test2 = $( 'li' );      // select all list items on the page
    //var test3 = $( 'ul li' );   // select list items that are in unordered lists
    //var test4 = $( '.person' ); // select all elements with a class of 'person'
    //console.log ("test1: " + test1.eq(1));
    //console.log ("test2: " + test2.eq(1));
    //console.log ("test3: " + test3.eq(1));
    //console.log ("test4: " + test4.eq(1));

}

$( document ).ready(function() 
{
    console.log("EVENT! ready() Complete! Jquery works.");

    $('.tooltip').tooltipster({
        theme: 'tooltipster-noir'
    });

    //???????????????????????
    //HACK - for some reason, if this is false, then *LATER* the popup will not show the popup-ad
    if (true || HAS_ADVERTISING_ON_CONTENT_PAGE)
    {
        AddAdvertisingAtopBody ($('head'), $('body'));
    }
    
    
    Initialize();

});

//REFRESH NOW
ChromeStorageGet (KEY_DESTINATION_URL_INDEX, function (value)
{
    destinationUrlIndex = value;
});

//REFRESH LATER
ChromeStorageOnChanged (KEY_DESTINATION_URL_INDEX, function (value)
{
    destinationUrlIndex = value;
});


async function Initialize() 
{
    var stopwatch = new Stopwatch(); 
    
    stopwatch.start();
    console.log ("Time 01: " + stopwatch.toString());
    
    MessagingInitializeContentPage();

    var fileList = [
        //"text/temp.txt",
        //"text/temp300.txt"
        "text/temp1000.txt"
        //"text/nasdaqlisted.txt",
       // "text/otherlisted.txt"
    ];
    let stockSymbolArray = await LoadStockSymbolsFromFiles(fileList); 
    
    console.log ("Time 02: " + stopwatch.toString());

    /*
    let stockSymbolArray = [
        {"stockSymbol": "AA", "stockName": "the a and a"}, 
        {"stockSymbol": "AAPL", "stockName": "the apple"}, 
        {"stockSymbol": "AAP", "stockName": "the app thing"}, 
        {"stockSymbol": "ZOM", "stockName": "the zom zom thing"},
        {"stockSymbol": "1Z1", "stockName": "the z thing"}];
    */

    ArraySortReverseAlphabetical(stockSymbolArray);

    console.log ("Time 03: " + stopwatch.toString());

    let replacementCount = await ReplaceAllSymbolsWithinHTMLElements(stockSymbolArray);

    console.log ("Time 04: " + stopwatch.toString());

    LogConsoleOutput (function ()
    {
        console.log (replacementCount + " replacements using " + stockSymbolArray.length + " symbols.");
    });
    
    console.log("Initialize() Complete")
    stopwatch.stop();
    console.log ("Time 05: " + stopwatch.toString());
}


function WaitForNextFrame() 
{
    WaitForMilliseconds(10);
}

function WaitForMilliseconds(delayMS) 
{
    //console.log("START WaitMilliseconds("  + delayMS +")");

    return new Promise(resolve => {
      setTimeout(function() {
        resolve("What is this?")
        //console.log("END WaitMilliseconds("  + delayMS +")");
      }, delayMS)
    })
}

function OnClickForStockSymbol(stockSymbol) 
{
    console.log ("symbol: " + stockSymbol);
    //Prevent parent page from refreshing
    event.preventDefault();
    
    var params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100';
    
    OpenAndFocusPopup (stockSymbol);
    return false;
};
