// React
import * as React from "react";
import * as ReactDOM from "react-dom";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";

// Components
import App from "./App";

// Apollo
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { RetryLink } from "apollo-link-retry";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

// Router
import { BrowserRouter as Router } from "react-router-dom";

// Config / Utils
import { FirebaseUtils, AnalyticsUtils, ErrorsUtils } from "./utils";
import config from "./cfg/env";
const firebaseAuth = FirebaseUtils.firebaseAuth;

// Apollo Linking
const httpLink = createHttpLink({
  uri: config.REACT_APP_GRAPHQL_URI,
  useGETForQueries: true
});

const authLink = setContext((_, { headers }) => {
  const idToken = localStorage.getItem("idToken");
  const authorization = `Bearer ${idToken}`;
  return {
    headers: {
      ...headers,
      authorization
    }
  };
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    if (networkError["statusCode"] === 401) {
      const user = firebaseAuth().currentUser;
      if (user !== null) {
        user.getIdToken(true).then(idToken => {
          localStorage.setItem("idToken", idToken);
          AnalyticsUtils.setUserId(user.uid);
        });
      } else {
        localStorage.removeItem("idToken");
        firebaseAuth().signOut();
        AnalyticsUtils.setUserId(undefined);
      }
    } else if (networkError["statusCode"] === 400) {
      const errorMessage = `It seems that your email address is not whitelisted. Please make sure you log in with the same email you used to sign up on usetangle.com. Contact info@usetangle.com if you have any quesitons or believe this is an error.`;
      alert(errorMessage);
      localStorage.removeItem("idToken");
      firebaseAuth().signOut();
      AnalyticsUtils.setUserId(undefined);
    } else {
      ErrorsUtils.errorHandler.report(
        networkError.message,
        networkError.stack ? networkError.stack : {}
      );
    }
  } else if (graphQLErrors) {
    let error = graphQLErrors[0];
    ErrorsUtils.errorHandler.report(
      error.message,
      error.stack ? error.stack : {}
    );
  }
});

const retryLink = new RetryLink({
  delay: {
    initial: 0,
    max: 5000,
    jitter: false
  },
  attempts: {
    max: 2,
    retryIf: (error, _operation) => error["statusCode"] === 401
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: (object: { __typename: string }) => {
      switch (object.__typename) {
        case "SurfaceResults":
          return "SurfaceResults";
        case "CaptureCollection":
          return "CaptureCollection";
        case "SessionItemCollection":
          return "SessionItemCollection";
        case "SessionCollection":
          return "SessionCollection";
        case "Session":
          return object["id"];
        default:
          return defaultDataIdFromObject(object);
      }
    }
  }),
  link: retryLink.concat(errorLink.concat(authLink.concat(httpLink)))
});

// Initialize Cloud Error Reporting
if (process.env.REACT_APP_ENV === "production") {
  ErrorsUtils.initializeCloudReporting(client);
}

class ApolloWrappedApp extends React.Component<object, object> {
  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Router>
    );
  }
}

ReactDOM.render(<ApolloWrappedApp />, document.getElementById(
  "root"
) as HTMLElement);

unregisterServiceWorker();
