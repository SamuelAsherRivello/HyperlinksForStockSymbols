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
    console.log ("************************************");
    console.log ("\t" + name);
    console.log ("")
    fun();
    console.log ("")
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
function OpenAndFocusPopup(url, target, params) 
{
    if(lastPopup)
    {
        lastPopup.close();
    }
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


function ReplaceAllSymbolsWithinInnerHTML(str, find, replace) 
{
    for (var i = 0; i < find.length; i++)
    {
        str = str.replace(new RegExp("\\b"+find[i]+"\\b"), replace[i]);
    }
      
    return str;
};