// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getMostRecentQuery as getMostRecentResponse,
  getMostRecentQueryVariables
} from "../__generated__/types";

import { graphGetRecent } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Graph from "../components/graph";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getMostRecentQueryVariables> &
    Partial<getMostRecentResponse>;
  headerHeight: number;
  query: string;
}

interface State {}

// Class
class RecentGraph extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    const recentResults = this.props.data.getMostRecent;

    if (!(recentResults && recentResults.graph)) {
      return <div />;
    }

    return (
      <Graph
        nodes={recentResults.graph.nodes}
        edges={recentResults.graph.edges}
      />
    );
  }
}

const withRecent = graphql<getMostRecentResponse, Props>(graphGetRecent, {
  alias: "withRecent",
  options: (props: Props) => ({
    variables: {
      rawQuery: props.query,
      start: 0,
      count: 10
    },
    fetchPolicy: "network-only"
  })
});

// Export
export default compose(withRecent)(RecentGraph);
