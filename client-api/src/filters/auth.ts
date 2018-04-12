import * as admin from "firebase-admin";
import * as requestContext from "request-context";

function initAuth() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://opit-193719.firebaseio.com"
  });
}

function authFilter(req, res, next) {
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
        res.send(401);
      });
  } else {
    res.send(400);
  }
}

function isDevOverride(req) {
  const isGraphiql = req.get("referer").includes("graphiql");
  return isGraphiql;
}

function verify(encodedToken) {
  return admin.auth().verifyIdToken(encodedToken);
}

function parseAuthorization(authorization: string): string {
  return authorization.split(" ")[1];
}

export { initAuth, authFilter };
