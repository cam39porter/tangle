// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getDetailedQuery as getDetailedQueryResponse,
  getDetailedQueryVariables
} from "../../__generated__/types";

import { graphGetDetailed } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Graph from "../../components/graphs/graph";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getDetailedQueryVariables> &
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
    const surfaceResults = this.props.data.getDetailed;

    if (!(surfaceResults && surfaceResults.graph)) {
      return <div />;
    }

    return (
      <Graph
        key={`related-graph`}
        nodes={surfaceResults.graph.nodes}
        edges={surfaceResults.graph.edges}
      />
    );
  }
}

const withGetDetailed = graphql<getDetailedQueryResponse, Props>(
  graphGetDetailed,
  {
    alias: "withGetDetailed",
    options: (props: Props) => ({
      variables: {
        id: decodeURIComponent(props.match.params["id"])
      },
      fetchPolicy: "network-only"
    })
  }
);

const RelatedGraphWithData = compose(withGetDetailed)(RelatedGraph);

// Export
export default RelatedGraphWithData;
