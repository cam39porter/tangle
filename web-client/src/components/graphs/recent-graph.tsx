// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getMostRecent as getMostRecentResponse,
  getMostRecentVariables,
  NodeFields,
  EdgeFields
} from "../../__generated__/types";

import { graphGetRecent } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Graph from "./graph";
import Help from "../help/help";

// Utils
import config from "../../cfg";

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getMostRecentVariables> & Partial<getMostRecentResponse>;
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

    let nodes: Array<NodeFields> = [];
    let edges: Array<EdgeFields> = [];

    if (data && data.getMostRecent && data.getMostRecent.graph) {
      nodes = data.getMostRecent.graph.nodes;
      edges = data.getMostRecent.graph.edges;
    }

    if (nodes.length === 0) {
      return (
        <Help>
          <div>
            Try capturing a thought with the big orange "+" button to see it
            visualized here.
          </div>
        </Help>
      );
    }

    return <Graph nodes={nodes} edges={edges} />;
  }
}
// @ts-ignore
const withRecent = graphql<getMostRecentResponse, Props>(graphGetRecent, {
  // @ts-ignore
  alias: "withRecent",
  // @ts-ignore
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
