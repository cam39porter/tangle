import * as admin from "firebase-admin";
import * as requestContext from "request-context";
import { getUser } from "../db/db";
import { User } from "../models";

function initAuth() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://opit-193719.firebaseio.com"
  });
}

function authFilter(req, res, next) {
  if (process.env.NODE_ENV === "development" && req.get("dev-override-uid")) {
    setDevOverride(req.get("dev-override-uid"))
      .then(() => next())
      .catch(err => res.send(500, err));
  } else if (req.get("authorization")) {
    const encodedToken = parseAuthorization(req.get("authorization"));
    verify(encodedToken)
      .then(token => {
        const user = new User(token.uid, token.name, token.email);
        requestContext.set("request:user", user);
        next();
      })
      .catch(error => {
        console.log(error);
        res.send(401, error);
      });
  } else {
    res.send(400, "Authorization header not provided");
  }
}

function setDevOverride(uid: string): Promise<void> {
  return getUser(uid).then(userRecord => {
    const user = new User(
      userRecord.properties.id,
      userRecord.properties.name,
      userRecord.properties.email
    );
    requestContext.set("request:user", user);
  });
}

function verify(encodedToken) {
  return admin.auth().verifyIdToken(encodedToken);
}

function parseAuthorization(authorization: string): string {
  return authorization.split(" ")[1];
}

export { initAuth, authFilter };
