/// <reference types="chrome" />

import * as fetch from "isomorphic-fetch";
import * as firebase from "firebase";
import config from "./config/index";

firebase.initializeApp(config.firebase);

let isSignedIn = false;

/**
 * Listen for clicks to the browser icon
 */
chrome.browserAction.onClicked.addListener(tab => {
  const idToken = localStorage.getItem("idToken");
  if (!isSignedIn) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    return;
  }

  chrome.tabs.sendMessage(tab.id, {
    message: "save-page",
    url: tab.url,
    idToken
  });
});

/**
 * Initialize the application on Chrome window load
 */
function initApp() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      isSignedIn = false;
      localStorage.removeItem("idToken");
      return;
    }
    user.getIdToken(true).then(idToken => {
      isSignedIn = true;
      localStorage.setItem("idToken", idToken);
    });
  });
}

window.onload = () => initApp();
