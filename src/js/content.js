
async function Initialize() 
{
    let symbolsArray = await LoadStockSymbolsFromFiles(["data/temp.txt", "data/nasdaqlisted.txt"]); //["nasdaqlisted.txt", "otherlisted.txt"]);
    
    //symbolsArray = ["AA"];

    destinationArray = symbolsArray.slice();
    destinationArray = ReplaceIndexWrapped(destinationArray, HYPERLINK, TOKEN);
    document.body.innerHTML = ReplaceAllSymbolsWithinInnerHTML(document.body.innerHTML, symbolsArray, destinationArray);

    let stockSymbolCount = document.body.innerHTML.indexOf("StockSymbolClass");

    LogConsoleOutput (function ()
    {
        if (stockSymbolCount > 0)
        {
            console.log ("FOUND " + stockSymbolCount + " out of " + symbolsArray.length + ".");
        }
        else
        {
            console.log ("NOTHING found out of " + symbolsArray.length + ".");
        }
    });
    
    AddEventListenerToAllElementsByName (STOCK_SYMBOL_NAME, 
        "click", 
        OnClickForStockSymbol,
    );


}
Initialize();


function WaitForSeconds(delay) {
    console.log("starting slow promise")
    return new Promise(resolve => {
      setTimeout(function() {
        resolve("slow")
        console.log("slow promise is done")
      }, delay * 1000)
    })
  }

function OnClickForStockSymbol() 
{
    //Prevent parent page from refreshing
    event.preventDefault();
    
    var params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100';
    
    symbol = event.target.getAttribute(DATA_ATTRIBUTE);
    
    url = DESTINATION_URL;
    url = url.replace(TOKEN, symbol);
    OpenAndFocusPopup (url, symbol, params);

    return false;
};
