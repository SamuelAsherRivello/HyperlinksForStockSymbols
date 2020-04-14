'use strict';

window.onload = function() 
{
    console.log("onload() Complete!")

    var test1 = $( '#header' ); // select the element with an ID of 'header'
    var test2 = $( 'li' );      // select all list items on the page
    var test3 = $( 'ul li' );   // select list items that are in unordered lists
    var test4 = $( '.person' ); // select all elements with a class of 'person'
    console.log ("test1: " + test1.eq(1));
    console.log ("test2: " + test2.eq(1));
    console.log ("test3: " + test3.eq(1));
    console.log ("test4: " + test4.eq(1));

}

$( document ).ready(function() 
{
    console.log("ready() Complete! Jquery works.")
    MessagingInitializeContentPage();
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



Initialize();


async function Initialize() 
{
    let symbolsArray = await LoadStockSymbolsFromFiles(["text/nasdaqlisted.txt"]);// "text/otherlisted.txt"]); //["text/temp.txt"]); 
    symbolsArray = ["AA", "AAPL", "AAP", "Z"];

    ArraySortReverseAlphabetical(symbolsArray);

    let replacementCount = ReplaceAllSymbolsWithinHTMLElements(symbolsArray);

    LogConsoleOutput (function ()
    {
        console.log (replacementCount + " replacements using " + symbolsArray.length + " symbols.");
    });
    
    AddEventListenerToAllElementsByName (STOCK_SYMBOL_NAME, 
        "click", 
        OnClickForStockSymbol,
    );
    console.log("Initialize() Complete")
}


function WaitForSeconds(delay) {
    console.log("starting slow promise")
    return new Promise(resolve => {
      setTimeout(function() {
        resolve("slow")
        console.log("slow promise is done")
      }, delay * 1000)
    })
  }

function OnClickForStockSymbol(symbol) 
{
    //Prevent parent page from refreshing
    event.preventDefault();
    
    var params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100';
    
    if (symbol == null)
    {
        symbol = event.target.getAttribute(DATA_ATTRIBUTE);
    }
    
    OpenAndFocusPopup (symbol);
    return false;
};
