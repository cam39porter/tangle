// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getRelatedCapturesBySessionQuery as getRelatedCapturesBySessionResponse,
  getRelatedCapturesBySessionQueryVariables,
  CaptureFieldsFragment
} from "../../__generated__/types";

import { getRelatedCapturesBySession } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../../components/grids/grid";
import Help from "../help/help";

// Utils
import config from "../../cfg";

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getRelatedCapturesBySessionQueryVariables> &
    Partial<getRelatedCapturesBySessionResponse>;
  headerHeight: number;
}

interface State {}

// Class
class RelatedGrid extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    const captureCollection = this.props.data.getRelatedCapturesBySession;
    let captures: Array<CaptureFieldsFragment> = [];

    if (captureCollection) {
      captures = captureCollection.items;
    }

    if (this.props.data.loading) {
      return (
        <Help>
          <div />
        </Help>
      );
    }

    return (
      <Grid
        key={`related-grid`}
        sessions={[]}
        captures={captures}
        emptyCapturesMessage={`We could not find any captures related to your collection. Try hitting the visualize button to watch your tangle grow.`}
        headerHeight={this.props.headerHeight}
      />
    );
  }
}

const withGetRelatedCapturesBySession = graphql<
  getRelatedCapturesBySessionResponse,
  Props
>(getRelatedCapturesBySession, {
  alias: "withGetRelatedCapturesBySession",
  options: (props: Props) => ({
    variables: {
      sessionId: decodeURIComponent(props.match.params["id"]),
      count: config.resultCount
    },
    fetchPolicy: "network-only"
  })
});

const RelatedGridWithData = compose(withGetRelatedCapturesBySession)(
  RelatedGrid
);

// Export
export default RelatedGridWithData;
