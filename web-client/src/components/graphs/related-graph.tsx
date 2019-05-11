// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getDetailed as getDetailedQueryResponse,
  getDetailedVariables,
  NodeFields,
  EdgeFields,
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
  data: QueryProps<getDetailedVariables> & Partial<getDetailedQueryResponse>;
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

    let nodes: Array<NodeFields> = [];
    let edges: Array<EdgeFields> = [];

    if (data && data.getDetailed && data.getDetailed.graph) {
      nodes = data.getDetailed.graph.nodes;
      edges = data.getDetailed.graph.edges;
    }

    AnalyticsUtils.trackEvent({
      category: AnalyticsUtils.Categories.Session,
      action: AnalyticsUtils.Actions.ViewedRelatedGraph,
      label: decodeURIComponent(this.props.match.params["id"]),
      value: nodes.filter(
        node => node.type === NodeType.Session || node.type === NodeType.Capture
      ).length
    });

    if (nodes.length === 0) {
      return (
        <Help>
          <div>Start composing your note to see it visualized here.</div>
        </Help>
      );
    }

    return <Graph nodes={nodes} edges={edges} />;
  }
}

const withGetDetailed = graphql<getDetailedQueryResponse, Props>(
  graphGetDetailed,
  // @ts-ignore
  {
    // @ts-ignore
    alias: "withGetDetailed",
    // @ts-ignore
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
