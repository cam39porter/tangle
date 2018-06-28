// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getRecentCapturesQuery as getRecentCapturesResponse,
  getRecentCapturesQueryVariables,
  getRecentSessionsQuery as getRecentSessionsResponse,
  getRecentSessionsQueryVariables
} from "../../__generated__/types";

import { getRecentCaptures, getRecentSessions } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../../components/grids/grid";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  captureData: QueryProps<getRecentCapturesQueryVariables> &
    Partial<getRecentCapturesResponse>;
  sessionData: QueryProps<getRecentSessionsQueryVariables> &
    Partial<getRecentSessionsResponse>;
  query: string;
  headerHeight: number;
}

interface State {}

// Class
class SearchGrid extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    const captures = this.props.captureData.getRecentCaptures;
    const sessions = this.props.sessionData.getRecentSessions;

    if (!(captures && sessions)) {
      return <div />;
    }

    return (
      <Grid
        sessions={sessions.items}
        captures={captures.items}
        headerHeight={this.props.headerHeight}
      />
    );
  }
}

const withGetRecentSessions = graphql<getRecentSessionsResponse, Props>(
  getRecentSessions,
  {
    name: "sessionData",
    alias: "withGetRecentSessions",
    options: (props: Props) => ({
      variables: {
        count: 10,
        pageId: null
      },
      fetchPolicy: "network-only"
    })
  }
);

const withGetRecentCaptures = graphql<getRecentCapturesResponse, Props>(
  getRecentCaptures,
  {
    name: "captureData",
    alias: "withGetRecentCaptures",
    options: (props: Props) => ({
      variables: {
        count: 10,
        pageId: null
      },
      fetchPolicy: "network-only"
    })
  }
);

// Export
export default compose(
  withGetRecentSessions,
  withGetRecentCaptures
)(SearchGrid);
