// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  searchQuery as searchQueryResponse,
  searchQueryVariables,
  NodeFieldsFragment,
  EdgeFieldsFragment,
  NodeType
} from "../../__generated__/types";

import { graphSearch } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Graph from "../../components/graphs/graph";
import Help from "../help/help";

// Utils
import config from "../../cfg";
import { AnalyticsUtils } from "../../utils/index";

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
    let nodes: Array<NodeFieldsFragment> = [];
    let edges: Array<EdgeFieldsFragment> = [];

    if (data && data.search && data.search.graph) {
      nodes = data.search.graph.nodes;
      edges = data.search.graph.edges;
    }

    if (data.loading) {
      return (
        <Help>
          <div />
        </Help>
      );
    }

    if (this.props.query === "error") {
      throw new Error("I crashed");
    }

    AnalyticsUtils.trackEvent({
      category: this.props.match.params["id"]
        ? AnalyticsUtils.Categories.Session
        : AnalyticsUtils.Categories.Home,
      action: AnalyticsUtils.Actions.ViewedSearchGraph,
      label: this.props.query,
      value: nodes.filter(
        node => node.type === NodeType.Session || node.type === NodeType.Capture
      ).length
    });

    if (nodes.length === 0) {
      return (
        <Help>
          <div>
            We could not find any captures or collections that matched your
            search.
          </div>
        </Help>
      );
    }

    return <Graph nodes={nodes} edges={edges} />;
  }
}

const withSearch = graphql<searchQueryResponse, Props>(graphSearch, {
  alias: "withSearch",
  options: (props: Props) => ({
    skip: props.query === "",
    variables: {
      rawQuery: props.query,
      start: 0,
      count: config.resultCount
    },
    fetchPolicy: "network-only"
  })
});

// Export
export default compose(withSearch)(SearchGraph);
