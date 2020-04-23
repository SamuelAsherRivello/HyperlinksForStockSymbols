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
            var stock = Stock.CreateNewFromLine(line);
            const stockSymbol = stock.GetObject();
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


async function ReplaceAllSymbolsWithinHTMLElements(stockObjectArray) 
{
    let replacementCount = 0;

    //Replace without repeating
    let alreadyReplacedValues = [];

    var elements = document.getElementsByTagName('*');
    let alreadyReplacedNodes = [];

    var totalRefreshes = 10;
    var totalCountToNextRefresh = totalRefreshes / stockObjectArray.length;
    var currentCountToNextRefresh = 0;

    for (var i = 0; i < stockObjectArray.length; i++)
    {
        if (!alreadyReplacedValues.includes (stockObjectArray[i].stockSymbol))
        {
            alreadyReplacedValues.push (stockObjectArray[i].stockSymbol);
            var innerReplacementCount = await ReplaceOneSymbolsWithinHTMLElements (alreadyReplacedNodes, elements, stockObjectArray[i]);
            replacementCount += innerReplacementCount;

            if (++currentCountToNextRefresh > totalCountToNextRefresh)
            {
                currentCountToNextRefresh = 0;
                WaitForNextFrame();
            }
        }
    }
    return replacementCount;

}

async function ReplaceOneSymbolsWithinHTMLElements(alreadyReplacedNodes, elements, stockObject) 
{
    let nodeMatches = 0;
    let replacementCount = 0;
    let totalChecks = 0;

    loop1:
    for (var i = 0; i < elements.length; i++) 
    {
        var element = elements[i];
    
        loop2:
        for (var j = 0; j < element.childNodes.length; j++) 
        {
            totalChecks++;

            if (totalChecks > MAX_REPLACEMENT_CHECKS)
            {
                console.log ("REACHED LIMIT: " + MAX_REPLACEMENT_CHECKS + ". Fix this loop to run without max.")
                break loop1;  // breaks out of loop1 and loop2
            }

            var nodeOriginal = element.childNodes[j];

            //Find text contents
            var textOriginal = nodeOriginal.nodeValue;

            // Find display text (not, for ex., code or tags)
            if (nodeOriginal.nodeType == 3)
            {
                nodeMatches++;

                //Remove line breaks
                textOriginal = textOriginal.replace(/(\r\n|\n|\r)/gm,""); 

                var textOriginalWhitespaceRemoved = textOriginal.replace(" ", "");
                if (textOriginalWhitespaceRemoved.length > 0) 
                {   
                    //Avoid if ONLY whitespace
                    const isOnlyWhitespace = !(/\S/.test(textOriginal));

                    //Avoid javascript results
                    const jsRegex = /function/g;
                    const isJS = textOriginal.search(jsRegex) != -1;

                    //Avoid javascript results
                    const cssRegex = /color:/g;
                    const isCSS = textOriginal.search(cssRegex) != -1;

                    //Avoid $ results
                    const isPrefixed = textOriginal.includes (PREFIX_AFTER_REPLACEMENT);

                    if (!isJS && !isCSS && !isOnlyWhitespace && !isPrefixed)
                    {
                        let stockExchange = stockObject.stockExchange;
                        let stockSymbol = stockObject.stockSymbol;

                        //Create replacement
                        let stockSymbolReplacement = "";
                        if (HAS_STOCK_EXCHANGE_IN_REPLACEMENT)
                        {
                            stockSymbolReplacement = PREFIX_AFTER_REPLACEMENT + stockExchange + ":" + stockSymbol;
                        }
                        else
                        {
                            stockSymbolReplacement = PREFIX_AFTER_REPLACEMENT + stockSymbol;
                        }
                        stockSymbolReplacement = stockSymbolReplacement.toUpperCase();
              
                        if (textOriginal.length >= HAYSTACK_MIN_LENGTH && 
                            stockSymbol.length >= NEEDLE_MIN_LENGTH && 
                            !alreadyReplacedNodes.includes (nodeOriginal))
                        {

                            //Does it contain "AAPL"
                            var stockSymbolRegex = new RegExp(StringFriendlyRegExp(/\bXXX\b/, stockSymbol ), 'gi');
                            const isStockSymbol = textOriginal.search(stockSymbolRegex) != -1;

                            if (isStockSymbol) 
                            {
                                replacementCount++;

                                //Create the before, during, after
                                var tokens = textOriginal.split (stockSymbolRegex);
                                tokens.splice(1, 0, stockSymbolReplacement);
                              
                                //Set content
                                var divNode = document.createElement("DIV");

                                //Add the before, during, after
                                var spanNode1 = CreateNewSpanElement (tokens[0])
                                divNode.appendChild(spanNode1);
                                var spanNode2 = CreateNewSpanElement (tokens[1], "stockSymbolClass")
                                divNode.appendChild(spanNode2);
                                var spanNode3 = CreateNewSpanElement (tokens[2])
                                divNode.appendChild(spanNode3);

                                //
                                ReplaceDOMElementChild(element, divNode, nodeOriginal);
        
                                //Set functionality
                                spanNode2.addEventListener("click", function (event)
                                {
                                    event.preventDefault(); //Needed? Trying to avoid old hrefs
                                    OpenAndFocusPopup(stockObject.stockSymbol)
                                });

                                // $(spanNode2, 
                                //     {
                                //     onclick: function() 
                                //     {
                                //         event.preventDefault(); //Needed? Trying to avoid old hrefs
                                //         OpenAndFocusPopup(stockObject.stockSymbol)
                                //     }
                                // })
                    
                                //Store
                                alreadyReplacedNodes.push (nodeOriginal);
                            }
                        }
                    }
                }
            }
        }
    }
    //console.log ("totalChecks: " + totalChecks);
    //console.log("n = " + nodeMatches + " and t " + replacementCount);
    return replacementCount;
}

async function ReplaceDOMElementChild (element, divNode, nodeOriginal)
{
    element.replaceChild(divNode, nodeOriginal);
}

function CreateNewSpanElement (text, className)
{
    var spanElement = document.createElement("SPAN");
    spanElement.appendChild (document.createTextNode (text))
    if (className != null)
    {
        spanElement.classList.add(className);
    }
    return spanElement;
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

