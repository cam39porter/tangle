/// <reference types="chrome" />

import * as firebase from "firebase";
import * as fetch from "isomorphic-fetch";

const config = {
  apiKey: "AIzaSyBhTwOzozQBpWVeXkccGjqLnWIrgj9RVak",
  authDomain: "opit-193719.firebaseapp.com",
  databaseURL: "https://opit-193719.firebaseio.com",
  projectId: "opit-193719",
  storageBucket: "opit-193719.appspot.com",
  messagingSenderId: "9191308198"
};

firebase.initializeApp(config);

let isSignedIn = false;

/**
 * Listen for clicks to the browser icon
 */
chrome.browserAction.onClicked.addListener(tab => {
  if (!isSignedIn) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    return;
  }

  chrome.tabs.sendMessage(tab.id, { message: "get-readable" }, article => {
    const idToken = localStorage.getItem("idToken");
    fetch("https://api.dev.tangleapp.co/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({
        query: `
          mutation(
            $url: String!
            $title: String!
            $content: String
            $byline: String
            $length: Int
          ) {
            createCapturedLink(
              url: $url
              title: $title
              content: $content
              byline: $byline
              length: $length
            )
          }
        `,
        variables: {
          url: tab.url,
          title: article.title,
          content: article.content,
          byline: article.byline,
          length: article.length
        }
      })
    })
      .then(() => {
        chrome.browserAction.setBadgeBackgroundColor({
          tabId: tab.id,
          color: "#ff9e37"
        });
      })
      .catch(err => {
        console.error(err);
      });
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
    }
    user.getIdToken(true).then(idToken => {
      isSignedIn = true;
      localStorage.setItem("idToken", idToken);
    });
  });
}

window.onload = () => initApp();
