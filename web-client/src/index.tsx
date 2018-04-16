// React
import * as React from "react";
import * as ReactDOM from "react-dom";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";

// Components
import "./index.css";
import App from "./App";

// Apollo
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

// Router
import { BrowserRouter as Router } from "react-router-dom";

// Config / Utils
import { firebaseAuth } from "./utils";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

const authLink = setContext((_, { headers }) => {
  const idToken = localStorage.getItem("idToken");
  return {
    headers: {
      ...headers,
      authorization: idToken ? `Bearer ${idToken}` : ""
    }
  };
});

const logoutLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    if (networkError["statusCode"] === 401) {
      localStorage.removeItem("idToken");
      firebaseAuth().signOut();
    }
  } else if (graphQLErrors) {
    console.error(graphQLErrors[0].message);
    alert(
      "Sorry, you seemed to have found a dark corner of our application. Please email cole@hex.ventures and tell us about your problem so that we can fix it!"
    );
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: logoutLink.concat(authLink.concat(httpLink))
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
