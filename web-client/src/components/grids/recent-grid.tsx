// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getRecentCapturesQuery as getRecentCapturesResponse,
  getRecentCapturesQueryVariables,
  getRecentSessionsQuery as getRecentSessionsResponse,
  getRecentSessionsQueryVariables,
  CaptureFieldsFragment,
  SessionWithoutItemCollectionFieldsFragment
} from "../../__generated__/types";

import { getRecentCaptures, getRecentSessions } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../grids/grid";
import Help from "../help/help";

// Utils
import config from "../../cfg";

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
class RecentGrid extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    const captureCollection = this.props.captureData.getRecentCaptures;
    const sessionCollection = this.props.sessionData.getRecentSessions;
    let sessions: Array<SessionWithoutItemCollectionFieldsFragment> = [];
    let captures: Array<CaptureFieldsFragment> = [];

    if (captureCollection && sessionCollection && sessionCollection.items) {
      sessions = sessionCollection.items;
      captures = captureCollection.items;
    }

    if (this.props.captureData.loading || this.props.sessionData.loading) {
      return (
        <Help>
          <div />
        </Help>
      );
    }

    return (
      <Grid
        sessions={sessions}
        emptySessionsMessage={`Try collecting your thoughts by creating your first collection`}
        captures={captures}
        emptyCapturesMessage={`Click the big orange button to capture your first thought`}
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
        count: config.resultCount,
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
        count: config.resultCount,
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
)(RecentGrid);
