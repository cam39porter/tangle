// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  searchQuery as searchQueryResponse,
  searchQueryVariables
} from "../../__generated__/types";

import { graphSearch } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Graph from "../../components/graphs/graph";

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
    const data = this.props.data;

    if (!(data && data.search && data.search.graph)) {
      return <div />;
    }

    return (
      <Graph nodes={data.search.graph.nodes} edges={data.search.graph.edges} />
    );
  }
}

const withSearch = graphql<searchQueryResponse, Props>(graphSearch, {
  alias: "withSearch",
  options: (props: Props) => ({
    skip: props.query === "",
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
