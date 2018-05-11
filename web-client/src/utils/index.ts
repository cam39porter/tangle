import tinygradient from "tinygradient";

import * as firebase from "firebase";

import config from "../cfg";

export function getGradient(
  startColor: string,
  endColor: string,
  gradientNumber: number
) {
  return tinygradient(startColor, endColor).rgb(gradientNumber);
}

firebase.initializeApp(config.firebase);

export const firebaseAuth = firebase.auth;
