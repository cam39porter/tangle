import * as admin from "firebase-admin";
import { User } from "../db/models/user";
import { mergeUser, getUser } from "../db/services/user";
import { setReqeustContext } from "./request-context";
import { UserUrn } from "../urn/user-urn";
import { Logger } from "../util/logging/logger";
import { NotWhitelistedError } from "../util/exceptions/not-whitelisted-error";

const LOGGER = new Logger("src/filters/auth.ts");

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
      .catch(err => {
        LOGGER.error(err);
        res.status(500).send("Fatal error");
      });
  } else if (req.get("authorization")) {
    const encodedToken = parseAuthorization(req.get("authorization"));
    verify(encodedToken)
      .then((token: admin.auth.DecodedIdToken) => {
        const user = new User(new UserUrn(token.uid), token.email, token.name);
        mergeUser(user)
          .then(() => {
            setReqeustContext(user);
            next();
          })
          .catch(error => {
            LOGGER.error(error);
            if (error instanceof NotWhitelistedError) {
              res.status(400).send(error);
            } else {
              res.status(500).send(error);
            }
          });
      })
      .catch(error => {
        LOGGER.error(error);
        res.status(401).send(error);
      });
  } else {
    LOGGER.error("Authorization header not provided");
    res.status(500).send("Authorization header not provided");
  }
}

function setDevOverride(urn: UserUrn): Promise<void> {
  return getUser(urn).then(user => setReqeustContext(user));
}

function verify(encodedToken): Promise<admin.auth.DecodedIdToken> {
  return admin.auth().verifyIdToken(encodedToken);
}

function parseAuthorization(authorization: string): string {
  return authorization.split(" ")[1];
}

export { initAuth, authFilter };
