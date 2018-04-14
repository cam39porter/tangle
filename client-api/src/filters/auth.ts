import * as admin from "firebase-admin";
import * as requestContext from "request-context";
import { getUser } from "../db/db";

function initAuth() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://opit-193719.firebaseio.com"
  });
}

function authFilter(req, res, next) {
  if (process.env.NODE_ENV === "development") {
    if (req.get("dev-override-uid")) {
      getUser(req.get("dev-override-uid")).then(userRecord => {
        const user = {
          uid: userRecord.properties.id,
          name: userRecord.properties.name,
          email: userRecord.properties.email
        };
        requestContext.set("request:user", user);
        next();
      });
    }
  } else {
    if (req.get("authorization")) {
      const encodedToken = parseAuthorization(req.get("authorization"));
      verify(encodedToken)
        .then(token => {
          const user = {
            uid: token.uid,
            name: token.name,
            email: token.email
          };
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
}

function verify(encodedToken) {
  return admin.auth().verifyIdToken(encodedToken);
}

function parseAuthorization(authorization: string): string {
  return authorization.split(" ")[1];
}

export { initAuth, authFilter };
