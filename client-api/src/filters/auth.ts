import * as admin from "firebase-admin";
import { User } from "../db/models/user";
import { createUser, getUser } from "../db/services/user";
import { setAuthenticatedUser } from "./request-context";
import { UserUrn } from "../urn/user-urn";

function initAuth(): void {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://opit-193719.firebaseio.com"
  });
}

function authFilter(req, res, next): void {
  if (process.env.NODE_ENV !== "production" && req.get("dev-override-id")) {
    setDevOverride(UserUrn.fromRaw(req.get("dev-override-id")))
      .then(() => next())
      .catch(err => res.send(500, err));
  } else if (req.get("authorization")) {
    const encodedToken = parseAuthorization(req.get("authorization"));
    verify(encodedToken)
      .then((token: admin.auth.DecodedIdToken) => {
        const user = new User(new UserUrn(token.uid), token.email, token.name);
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

function setDevOverride(urn: UserUrn): Promise<void> {
  return getUser(urn).then(setAuthenticatedUser);
}

function verify(encodedToken): Promise<admin.auth.DecodedIdToken> {
  return admin.auth().verifyIdToken(encodedToken);
}

function parseAuthorization(authorization: string): string {
  return authorization.split(" ")[1];
}

export { initAuth, authFilter };
