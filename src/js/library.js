
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


function ReplaceArrayIgnoreCase(str, find, replace) 
{
    for (var i = 0; i < find.length; i++)
    {
        s = find[i];
        str = str.replace(new RegExp(s,"ig"), replace[i]);
    }
      
    return str;
};