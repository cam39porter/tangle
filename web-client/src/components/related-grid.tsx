// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getRelatedCapturesBySessionQuery as getRelatedCapturesBySessionResponse,
  getRelatedCapturesBySessionQueryVariables
} from "../__generated__/types";

import { getRelatedCapturesBySession } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../components/grid";

// Utils

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
    const captures = this.props.data.getRelatedCapturesBySession;

    if (!captures) {
      return <div />;
    }

    return (
      <Grid
        sessions={[]}
        captures={captures.items}
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
      count: 5
    },
    fetchPolicy: "network-only"
  })
});

const RelatedGridWithData = compose(withGetRelatedCapturesBySession)(
  RelatedGrid
);

// Export
export default RelatedGridWithData;
