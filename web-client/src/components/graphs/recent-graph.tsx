// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getMostRecentQuery as getMostRecentResponse,
  getMostRecentQueryVariables,
  NodeFieldsFragment,
  EdgeFieldsFragment
} from "../../__generated__/types";

import { graphGetRecent } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Graph from "../../components/graphs/graph";

// Utils
import config from "../../cfg";

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
    const data = this.props.data;

    let nodes: Array<NodeFieldsFragment> = [];
    let edges: Array<EdgeFieldsFragment> = [];

    if (data && data.getMostRecent && data.getMostRecent.graph) {
      nodes = data.getMostRecent.graph.nodes;
      edges = data.getMostRecent.graph.edges;
    }

    return <Graph key={`recent-graph`} nodes={nodes} edges={edges} />;
  }
}

const withRecent = graphql<getMostRecentResponse, Props>(graphGetRecent, {
  alias: "withRecent",
  options: (props: Props) => ({
    variables: {
      rawQuery: props.query,
      start: 0,
      count: config.resultCount
    },
    fetchPolicy: "network-only"
  })
});

// Export
export default compose(withRecent)(RecentGraph);
