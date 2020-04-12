var symbolsArray = ["AAPL", "BAC"];
destinationArray = symbolsArray.slice();

destinationArray = ReplaceIndexWrapped(destinationArray, 
    "<div class='StockSymbolClass' name='StockSymbolName' data='XXX' >$XXX</div>", "XXX");

document.body.innerHTML = ReplaceArrayIgnoreCase(document.body.innerHTML, symbolsArray, destinationArray);

AddEventListenerToAllElementsByName ("StockSymbolName", 
    "click", 
    OnClickForStockSymbol,
);

function OnClickForStockSymbol() 
{
    //Prevent parent page from refreshing
    event.preventDefault();
    
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=600,left=100,top=100`;

    symbol = event.target.getAttribute(DATA_ATTRIBUTE);
    
    url = DESTINATION_URL;
    url = url.replace(TOKEN, symbol);
    OpenAndFocusPopup (url, symbol, params);

    return false;
};
