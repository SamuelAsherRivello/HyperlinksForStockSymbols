'use strict';

function ChromeStorageSet (key, value)
{
  chrome.storage.sync.set({[key]: value}, function() {
    //MessagingFromPopupPage("ChromeStorageSet(): " + key + "=" + value);
  });
}
function ChromeStorageGet (key, fun)
{
  return chrome.storage.sync.get([key], function(result) {
    //MessagingFromPopupPage("ChromeStorageGet(): " + key + "=" + result[key]);
    fun(result[key]);
  });
}

function ChromeStorageOnChanged (key, fun)
{
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      /*
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
                  */
      fun (storageChange.newValue);
    }
  });
}
