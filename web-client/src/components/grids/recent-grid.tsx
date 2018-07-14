// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getRecentSessionsQuery as getRecentSessionsResponse,
  getRecentSessionsQueryVariables,
  SessionWithoutItemCollectionFieldsFragment
} from "../../__generated__/types";

import { getRecentSessions } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../grids/grid";
import Help from "../help/help";

// Utils
import config from "../../cfg";

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
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
    const sessionCollection = this.props.sessionData.getRecentSessions;
    let sessions: Array<SessionWithoutItemCollectionFieldsFragment> = [];

    if (sessionCollection && sessionCollection.items) {
      sessions = sessionCollection.items;
    }

    if (this.props.sessionData.loading) {
      return (
        <Help>
          <div />
        </Help>
      );
    }

    return (
      <Grid
        sessions={sessions}
        emptySessionsMessage={`Try creating your first note.`}
        captures={[]}
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
    options: () => ({
      variables: {
        count: config.resultCount,
        pageId: null
      },
      fetchPolicy: "network-only"
    })
  }
);

// Export
export default compose(withGetRecentSessions)(RecentGrid);
