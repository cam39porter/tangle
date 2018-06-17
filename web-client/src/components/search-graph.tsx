// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  searchQuery as searchQueryResponse,
  searchQueryVariables
} from "../__generated__/types";

import { graphSearch } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import GraphVisualization from "../components/graph-visualization";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<searchQueryVariables> & Partial<searchQueryResponse>;
  headerHeight: number;
  query: string;
}

interface State {}

// Class
class SearchGraph extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    const surfaceResults = this.props.data.search;

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

const withSearch = graphql<searchQueryResponse, Props>(graphSearch, {
  alias: "withSearch",
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
export default compose(withSearch)(SearchGraph);
