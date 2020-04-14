'use strict';

let stockUrlButton = document.getElementById('stockUrlButton');
let stockUrlDropdown = document.getElementById('stockUrlDropdown');
let stockUrlDropdownSelect = document.getElementById('stockUrlDropdownSelect');

MessagingInitializeFromPopupPage ();
stockUrlButton.onclick = function ()
{
  MessagingFromPopupPage ("click!");
}

ChromeStorageGet (KEY_DESTINATION_URL_INDEX, function (value)
{
  stockUrlDropdownSelect.selectedIndex = value;
});

stockUrlDropdown.onchange = function (value)
{
  ChromeStorageSet (KEY_DESTINATION_URL_INDEX, stockUrlDropdownSelect.selectedIndex);
}

for(var i=0; i< destinationUrlsArray.length;i++)
{
  //creates option tag
    $('<option/>', {
          html: destinationUrlsArray[i].name
          }).appendTo(stockUrlDropdownSelect); //appends to select if parent div has id dropdown
}
/*
chrome.storage.sync.get('color', function(data) 
{
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
  console.log (data.color);
});

console.log ("so: " + changeColor);

window.onload = function() 
{
    console.log("onload() Complete222222!")
}
*/