async function LoadStockSymbolsFromFiles(fileUrlsArray)
{
    let symbolsArray = [];

    for (let f = 0; f < fileUrlsArray.length; f++) 
    {
        let nextArray = await LoadStockSymbolsFromSingleFile(fileUrlsArray[f]);
        symbolsArray.push.apply(symbolsArray, nextArray);
    }
    return symbolsArray;
}

async function LoadStockSymbolsFromSingleFile(url)
{
    let symbolsArray = [];
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
            symbolsArray.push(pipeTokens[0])
        });
    })
    .catch(function(error) {
        console.log('Request failed', error)
    });

    return symbolsArray;
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
    buttons = document.getElementsByName (elementName);

    for (let b = 0; b < buttons.length; b++) 
    {
        buttons[b].addEventListener (
            eventName, 
            f
        );
    }
}

var lastPopup;
function OpenAndFocusPopup(symbol) 
{
    if(lastPopup)
    {
        //lastPopup.close();
    }

    var params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=100,top=100';

    let url = DESTINATION_URL;
    url = url.replace(TOKEN, symbol);

    //put each symbol in its own window
    let target = "_blank";

    lastPopup = window.open(url, target, params);
    lastPopup.focus();
    return false;
 }

function ReplaceIndexWrapped(find, format, token) 
{
    for (var i = 0; i < find.length; i++)
    {
        find[i] = find[i].toUpperCase();
        output = format.replace(new RegExp(token,"g"), find[i])
        find[i] = output;
    }
    return find;
};


function ReplaceAllSymbolsWithinInnerHTML(find, replace) 
{
    let str = document.body.innerHTML; 

    for (var i = 0; i < find.length; i++)
    {
        str = str.replace(new RegExp("\\b"+find[i]+"\\b"), replace[i]);
    }
      
    document.body.innerHTML = str;
};


function ReplaceAllSymbolsWithinHTMLElements(findArray) 
{
    let replacementCount = 0;

    //Replace without repeating
    let alreadyReplacedValues = [];

    var elements = document.getElementsByTagName('*');
    let alreadyReplacedNodes = [];

    for (var i = 0; i < findArray.length; i++)
    {
        if (!alreadyReplacedValues.includes (findArray[i]))
        {
            alreadyReplacedValues.push (findArray[i]);
            var innerReplacementCount = ReplaceOneSymbolsWithinHTMLElements (alreadyReplacedNodes, elements, findArray[i]);
            replacementCount += innerReplacementCount;
        }
    }
    return replacementCount;

}

function ReplaceOneSymbolsWithinHTMLElements(alreadyReplacedNodes, elements, findOne) 
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

                var text = nodeOriginal.nodeValue;

                //Avoid javascript results
                const jsRegex = /function/g;
                const jsMatch = text.search(jsRegex);

                //Avoid javascript results
                const cssRegex = /color:/g;
                const cssMatch = text.search(cssRegex);

                if (jsMatch == -1 && cssMatch == -1)
                {
                    if (!alreadyReplacedNodes.includes (nodeOriginal))
                    {
                        replaceOne = PREFIX_AFTER_REPLACEMENT + findOne;

                        var replacedText = text.replace(new RegExp(findOne,"ig"), replaceOne);

                        let characterBeforeMatch = Get1CharacterBeforeMatch (text, findOne)

                        let isValidReplacement = characterBeforeMatch != PREFIX_AFTER_REPLACEMENT;

                        var beforeReplacement = nodeOriginal.nodeValue;
                        var isChanged = replacedText !== text;
                        if (isChanged && isValidReplacement) 
                        {
                            replacementCount++;

                            //Set content
                            var nodeReplacement = document.createTextNode(replacedText);
                            element.replaceChild(nodeReplacement, nodeOriginal);

                            //console.log ("\t" + nodeOriginal.nodeValue + " => " +  nodeReplacement.nodeValue);

                            //Set styling
                            //TODO.........................

                            //Set functionality
                            element.addEventListener("click", function ()
                            {
                                OpenAndFocusPopup(findOne)
                            });

                            //Store
                            alreadyReplacedNodes.push (nodeOriginal);
                        }
                    }
                   
                }
            }
        }
    }
    //console.log("n = " + nodeMatches + " and t " + replacementCount);
    return replacementCount;
}


function ArraySortReverseAlphabetical(array)
{
    array.sort();
    array.reverse();
}

function ArrayLog (array)
{
    for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
    }
}


function Get1CharacterBeforeMatch (text, findOne)
{
    let index = text.indexOf (findOne);
    if (index != -1)
    {
        return text.substring (index - 1, index);
    }
    return index;
}

