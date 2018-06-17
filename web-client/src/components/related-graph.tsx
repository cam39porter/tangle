// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getDetailedQuery as getDetailedQueryResponse,
  getDetailedQueryVariables
} from "../__generated__/types";

import { getDetailed } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import GraphVisualization from "../components/graph-visualization";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  getDetailed: QueryProps<getDetailedQueryVariables> &
    Partial<getDetailedQueryResponse>;
  headerHeight: number;
}

interface State {}

// Class
class RelatedGraph extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    const surfaceResults = this.props.getDetailed.getDetailed;

    if (!(surfaceResults && surfaceResults.graph)) {
      return <div />;
    }

    return (
      <GraphVisualization
        nodes={surfaceResults.graph.nodes}
        edges={surfaceResults.graph.edges}
      />
    );
  }
}

const withGetDetailed = graphql<getDetailedQueryResponse, Props>(getDetailed, {
  name: "getDetailed",
  alias: "withGetDetailed",
  options: (props: Props) => ({
    variables: {
      id: decodeURIComponent(props.match.params["id"])
    },
    fetchPolicy: "network-only"
  })
});

const RelatedGraphWithData = compose(withGetDetailed)(RelatedGraph);

// Export
export default RelatedGraphWithData;
