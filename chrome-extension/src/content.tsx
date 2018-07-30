import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
const Readability = require("mozilla-readability");
import { once, assign } from "lodash";

const ROOT_DIV = "tangle-root-extension";

/**
 * Render page save success once
 */
function renderSaveSuccess(article, idToken) {
  const rootDiv = document.createElement("div");
  rootDiv.id = ROOT_DIV;
  document.body.appendChild(rootDiv);
  ReactDOM.render(
    <App article={article} idToken={idToken} />,
    document.getElementById(ROOT_DIV)
  );
}

const renderSaveSuccessOnce = once(renderSaveSuccess);

/**
 * Listen for events to fetch readable content
 */
chrome.runtime.onMessage.addListener(request => {
  if (request.message === "save-page") {
    const { url, idToken } = request;
    // Make a deep clone to prevent modifying the DOM
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    renderSaveSuccessOnce(assign({ url }, article), idToken);
  }

  if (request.message === "page-saved") {
  }
});
