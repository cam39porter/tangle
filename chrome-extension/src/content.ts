const Readability = require("mozilla-readability");

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === "get-readable") {
    // Make a deep clone to prevent modifying the DOM
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    sendResponse(article);
  }
});
