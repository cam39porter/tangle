// React
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";

// Apollo
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

// Fireabse
import { firebaseAuth } from "./utils";

// Router
import { BrowserRouter as Router } from "react-router-dom";

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

// logout the user if server sends 401
const logoutLink = onError(({ networkError }) => {
  if (networkError && networkError.statusCode === "401") {
    localStorage.removeItem("idToken");
    firebaseAuth().signOut();
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
