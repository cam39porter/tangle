// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getDetailedQuery as getDetailedQueryResponse,
  getDetailedQueryVariables
} from "../__generated__/types";

import { graphGetDetailed } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import GraphVisualization from "../components/graph-visualization";
import HeaderSurface from "../components/header-surface";
import ReactResizeDetector from "react-resize-detector";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  getDetailed: QueryProps<getDetailedQueryVariables> &
    Partial<getDetailedQueryResponse>;
}

interface State {
  headerHeight: number;
}

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
      <div className={`flex-column`}>
        <div>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                headerHeight: height
              });
            }}
          />
          <HeaderSurface isGraphView={true} />
        </div>
        <GraphVisualization
          nodes={surfaceResults.graph.nodes}
          edges={surfaceResults.graph.edges}
        />
      </div>
    );
  }
}

const withGetDetailed = graphql<getDetailedQueryResponse, Props>(
  graphGetDetailed,
  {
    name: "getDetailed",
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
