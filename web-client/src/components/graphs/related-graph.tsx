// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getDetailedQuery as getDetailedQueryResponse,
  getDetailedQueryVariables,
  NodeFieldsFragment,
  EdgeFieldsFragment,
  NodeType
} from "../../__generated__/types";

import { graphGetDetailed } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Graph from "../../components/graphs/graph";
import Help from "../help/help";
import { AnalyticsUtils } from "../../utils/index";

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
    const data = this.props.data;

    let nodes: Array<NodeFieldsFragment> = [];
    let edges: Array<EdgeFieldsFragment> = [];

    if (data && data.getDetailed && data.getDetailed.graph) {
      nodes = data.getDetailed.graph.nodes;
      edges = data.getDetailed.graph.edges;
    }

    if (data.loading) {
      return (
        <Help>
          <div />
        </Help>
      );
    }

    AnalyticsUtils.trackEvent({
      category: AnalyticsUtils.Categories.Session,
      action: AnalyticsUtils.Actions.ViewedRelatedGraph,
      label: this.props.match.params["id"],
      value: nodes.filter(
        node => node.type === NodeType.Session || node.type === NodeType.Capture
      ).length
    });

    if (nodes.length === 0) {
      return (
        <Help>
          <div>
            Capture a thought in the collection to see it visualized here.
          </div>
        </Help>
      );
    }

    return <Graph nodes={nodes} edges={edges} />;
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
