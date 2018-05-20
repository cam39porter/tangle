import * as firebase from "firebase";
import config from "../cfg";

firebase.initializeApp(config.firebase);

export default {
  firebaseAuth: firebase.auth
};
