import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
const Readability = require("mozilla-readability");

const ROOT_DIV = "tangle-root-extension";

/**
 * Listen for events to fetch readable content
 */
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === "get-readable") {
    // Make a deep clone to prevent modifying the DOM
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    sendResponse(article);
  }

  if (request.message === "page-saved") {
    // TODO: make this function isomorphic
    const rootDiv = document.createElement("div");
    rootDiv.id = ROOT_DIV;
    document.body.appendChild(rootDiv);
    ReactDOM.render(<App />, document.getElementById(ROOT_DIV));
  }
});
