export default {
  endpoint:
    process.env.NODE_ENV === "production"
      ? "https://api.tangleapp.co"
      : "https://api.dev.tangleapp.co",
  firebase: {
    apiKey: "AIzaSyBhTwOzozQBpWVeXkccGjqLnWIrgj9RVak",
    authDomain: "opit-193719.firebaseapp.com",
    databaseURL: "https://opit-193719.firebaseio.com",
    projectId: "opit-193719",
    storageBucket: "opit-193719.appspot.com",
    messagingSenderId: "9191308198"
  }
};
