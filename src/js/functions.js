'use strict';

async function LoadStockSymbolsFromFiles(fileUrlsArray)
{
    let stockObjectArray = [];

    for (let f = 0; f < fileUrlsArray.length; f++) 
    {
        let nextStockObjectArray = await LoadStockSymbolsFromSingleFile(fileUrlsArray[f]);
        stockObjectArray.push.apply(stockObjectArray, nextStockObjectArray);
    }
    return stockObjectArray;
}

async function LoadStockSymbolsFromSingleFile(url)
{
    let stockObjectArray = [];
    let u = chrome.runtime.getURL(url);

    await fetch(u, {mode: 'cors'})
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        const pageLines = text.split(/\r?\n/);
        pageLines.forEach((line) => 
        {
            const pipeTokens = line.split("|");
            const stockSymbol = {"stockSymbol": pipeTokens[0], "stockName": pipeTokens[1]};
            stockObjectArray.push(stockSymbol)
        });
    })
    .catch(function(error) {
        console.log('Request failed', error)
    });

    return stockObjectArray;
}

function LogConsoleOutput (fun)
{
    var name = chrome.runtime.getManifest().name;
    console.log ("************************************");
    console.log ("**  " + name + "  **");
    console.log ("************************************");
    fun();
    console.log ("************************************");
    console.log ("************************************");
}


function AddEventListenerToAllElementsByName (elementName, eventName, f)
{
    var buttons = document.getElementsByName (elementName);

    for (let b = 0; b < buttons.length; b++) 
    {
        buttons[b].addEventListener (
            eventName, 
            f
        );
    }
}

var lastPopup;
function OpenAndFocusPopup(stockSymbol) 
{
    //KEEP
    console.log ("OpenAndFocusPopup() stockSymbol=" + stockSymbol);

    if(lastPopup)
    {
        lastPopup.close();
    }

    let url = destinationUrlsArray[destinationUrlIndex].url;
    url = url.replace(TOKEN, stockSymbol);

    //put each symbol in its own window
    let target = "_blank";

    var params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100';
    lastPopup = window.open(url, target, params);
    //lastPopup.document.body.innerHTML = '<iframe src="'+url+'" width="100%" height="100%" frameborder="0" scrolling="no" id="myFrame"></iframe>';
    lastPopup.document.title = url;

    if (HAS_ADVERTISING_ON_STOCK_SYMBOL_PAGE)
    {
        console.log ("onload1");

        lastPopup.onload = function () 
        {
            console.log ("onload2");

            var head = lastPopup.document.$('head');
            var body = lastPopup.document.$('body');
            AddAdvertisingAtopBody (head, body);
        }
    }

    lastPopup.focus();
    return false;
 }


function ReplaceAllSymbolsWithinHTMLElements(stockObjectArray) 
{
    let replacementCount = 0;

    //Replace without repeating
    let alreadyReplacedValues = [];

    var elements = document.getElementsByTagName('*');
    let alreadyReplacedNodes = [];

    for (var i = 0; i < stockObjectArray.length; i++)
    {
        if (!alreadyReplacedValues.includes (stockObjectArray[i].stockSymbol))
        {
            alreadyReplacedValues.push (stockObjectArray[i].stockSymbol);
            var innerReplacementCount = ReplaceOneSymbolsWithinHTMLElements (alreadyReplacedNodes, elements, stockObjectArray[i]);
            replacementCount += innerReplacementCount;
        }
    }
    return replacementCount;

}

function ReplaceOneSymbolsWithinHTMLElements(alreadyReplacedNodes, elements, stockObject) 
{
    let nodeMatches = 0;
    let replacementCount = 0;
    for (var i = 0; i < elements.length; i++) 
    {
        var element = elements[i];
    
        for (var j = 0; j < element.childNodes.length; j++) 
        {
            var nodeOriginal = element.childNodes[j];
    
            // Find display text (not, for ex., code or tags)
            if (nodeOriginal.nodeType == 3) 
            {
                nodeMatches++;

                var textOriginal = nodeOriginal.nodeValue;

                //Remove line breaks
                textOriginal = textOriginal.replace(/(\r\n|\n|\r)/gm,""); 

                //Avoid if ONLY whitespace
                const isOnlyWhitespace = !(/\S/.test(textOriginal));

                //Avoid javascript results
                const jsRegex = /function/g;
                const isJS = textOriginal.search(jsRegex) != -1;

                //Avoid javascript results
                const cssRegex = /color:/g;
                const isCSS = textOriginal.search(cssRegex) != -1;

                if (!isJS && !isCSS && !isOnlyWhitespace)
                {
                    let stockSymbol = stockObject.stockSymbol;
                    let stockSymbolWithPrefix = PREFIX_AFTER_REPLACEMENT + stockSymbol;

                    if (textOriginal.length >= HAYSTACK_MIN_LENGTH && 
                        stockSymbol.length >= NEEDLE_MIN_LENGTH && 
                        !alreadyReplacedNodes.includes (nodeOriginal))
                    {
                       
                        //Does it contain "AAPL"
                        var stockSymbolRegex = new RegExp(StringFriendlyRegExp(/\bXXX\b/, stockSymbol ), 'gi');
                        const isStockSymbol = textOriginal.search(stockSymbolRegex) != -1;

                         //Does it contain "$AAPL"
                        var stockSymbolWithPrefixRegex = new RegExp(StringFriendlyRegExp(/\bXXX\b/, stockSymbolWithPrefix ), 'gi');
                        const isStockSymbolWithPrefix = textOriginal.search(stockSymbolWithPrefixRegex) != -1;

                        if (isStockSymbol && !isStockSymbolWithPrefix) 
                        {
                  
                            replacementCount++;

                            //Create replacement
                            var textReplacement = textOriginal.replace (stockSymbolRegex, stockSymbolWithPrefix.toUpperCase());

                            //Set content
                            var nodeReplacement = document.createTextNode(textReplacement);
                            element.replaceChild(nodeReplacement, nodeOriginal);

                            //Set functionality
                            element.addEventListener("click", function (event)
                            {
                                event.preventDefault();
                                console.log (event.target);
                                OpenAndFocusPopup(stockObject.stockSymbol)
                            });

                    
                            //Set Styling
                            //var newDiv = document.createElement("div"); 
                            //newDiv.setAttribute("class", "tooltip");
                            //newDiv.setAttribute("title", "hello");
                            //var newContent = document.createTextNode(stockObject.stockName); 
                            //element.appendChild(newContent);  

                
                            //Store
                            alreadyReplacedNodes.push (nodeOriginal);

                            //console.log ("b4: '" + nodeOriginal.data + "' and: '" + nodeReplacement.data + "' for '" + stockSymbol + "'.");

                        }
                    }
                   
                }
            }
        }
    }
    //console.log("n = " + nodeMatches + " and t " + replacementCount);
    return replacementCount;
}

function StringFriendlyRegExp(source, insertMe)
{
    return RegExp(source.toString().replace(/\//g,"").replace(/XXX/g, insertMe), "g")
};

function ArraySortReverseAlphabetical(array)
{
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element == null && element.length == 0)
        {
            console.log ("bad at : " + i);
        }
    }
    array.sort((a, b) => (a.stockName > b.stockName) ? 1 : -1)
}

function ArrayLog (array)
{
    for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
    }
}

