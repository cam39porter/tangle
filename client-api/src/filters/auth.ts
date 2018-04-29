import * as admin from "firebase-admin";
import { createUser, getUser } from "../db/db";
import { toUserUrn } from "../helpers/urn-helpers";
import { User } from "../models";
import { setAuthenticatedUser } from "../services/request-context";

function initAuth() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://opit-193719.firebaseio.com"
  });
}

function authFilter(req, res, next) {
  if (process.env.NODE_ENV === "development" && req.get("dev-override-id")) {
    setDevOverride(req.get("dev-override-id"))
      .then(() => next())
      .catch(err => res.send(500, err));
  } else if (req.get("authorization")) {
    const encodedToken = parseAuthorization(req.get("authorization"));
    verify(encodedToken)
      .then(token => {
        const user = new User(toUserUrn(token.uid), token.email, token.name);
        createUser(user)
          .then(() => {
            setAuthenticatedUser(user);
            next();
          })
          .catch(error => {
            console.log(error);
            res.send(500, error);
          });
      })
      .catch(error => {
        console.log(error);
        res.send(401, error);
      });
  } else {
    res.send(400, "Authorization header not provided");
  }
}

function setDevOverride(urn: string): Promise<void> {
  return getUser(urn).then(setAuthenticatedUser);
}

function verify(encodedToken) {
  return admin.auth().verifyIdToken(encodedToken);
}

function parseAuthorization(authorization: string): string {
  return authorization.split(" ")[1];
}

export { initAuth, authFilter };
