import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink
});

class ApolloWrappedApp extends React.Component<object, object> {
  render() {
    return (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );
  }
}

ReactDOM.render(<ApolloWrappedApp />, document.getElementById(
  "root"
) as HTMLElement);
registerServiceWorker();
