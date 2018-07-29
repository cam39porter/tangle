/// <reference types="chrome" />

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, { message: "get-readable" }, article => {
    console.log(article);
  });
});
