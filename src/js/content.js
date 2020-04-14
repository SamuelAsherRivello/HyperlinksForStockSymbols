

window.onload = function() 
{
    console.log("onload() Complete")
}
Initialize();


async function Initialize() 
{
    let symbolsArray = await LoadStockSymbolsFromFiles(["data/nasdaqlisted.txt"]);// "data/otherlisted.txt"]); //["data/temp.txt"]); 
    
    symbolsArray = ["AA", "AAPL", "AAP", "Z"];

    ArraySortReverseAlphabetical(symbolsArray);

    destinationArray = symbolsArray.slice();
    destinationArray = ReplaceIndexWrapped(destinationArray, HYPERLINK, TOKEN);

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
