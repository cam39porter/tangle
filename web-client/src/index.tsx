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
import { FirebaseUtils } from "./utils";
import config from "./cfg/env";

const httpLink = createHttpLink({
  uri: config.REACT_APP_GRAPHQL_URI
});

const authLink = setContext((_, { headers }) => {
  const idToken = localStorage.getItem("idToken");
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${idToken}`
    }
  };
});

const logoutLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    if (networkError["statusCode"] === 401) {
      const user = FirebaseUtils.firebaseAuth().currentUser;
      if (user !== null) {
        user.getIdToken(true).then(idToken => {
          localStorage.setItem("idToken", idToken);
        });
      } else {
        localStorage.removeItem("idToken");
        FirebaseUtils.firebaseAuth().signOut();
      }
    }
  } else if (graphQLErrors) {
    console.error(graphQLErrors[0].message);
    alert(
      "Sorry, you seemed to have found a dark corner of our application. Please email cole@usetangle.com and tell us about your problem so that we can fix it!"
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
        default:
          return defaultDataIdFromObject(object);
      }
    }
  }),
  link: retryLink.concat(logoutLink.concat(authLink.concat(httpLink)))
});

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
