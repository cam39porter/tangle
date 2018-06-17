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
import GridCaptures from "../components/grid-captures";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  getRelatedCapturesBySession: QueryProps<
    getRelatedCapturesBySessionQueryVariables
  > &
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
    const relatedCaptures = this.props.getRelatedCapturesBySession
      .getRelatedCapturesBySession;

    if (!relatedCaptures) {
      return <div />;
    }

    return (
      <GridCaptures
        captures={relatedCaptures.items}
        headerHeight={this.props.headerHeight}
      />
    );
  }
}

const withGetRelatedCapturesBySession = graphql<
  getRelatedCapturesBySessionResponse,
  Props
>(getRelatedCapturesBySession, {
  name: "getRelatedCapturesBySession",
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
