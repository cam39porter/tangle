// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getRecentSessions as getRecentSessionsResponse,
  getRecentSessionsVariables,
  SessionWithoutItemCollectionFields
} from "../../__generated__/types";

import { getRecentSessions } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../grids/grid";
import Help from "../help/help";

// Utils
import config from "../../cfg";
import { concat } from "lodash";
import { ErrorsUtils } from "../../utils/index";
import ErrorBoundary from "../help/error-boundary";

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  sessionData: QueryProps<getRecentSessionsVariables> &
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
    let sessions: Array<SessionWithoutItemCollectionFields> = [];

    // @ts-ignore
    const fetchMore = this.props.sessionData.fetchMore;
    let nextSessionPageId: string | null = null;

    if (sessionCollection && sessionCollection.items) {
      sessions = sessionCollection.items;
      nextSessionPageId =
        sessionCollection.pagingInfo && sessionCollection.pagingInfo.nextPageId;
    }

    // @ts-ignore
    const error = this.props.sessionData.error;
    if (error) {
      return (
        <Help>
          <div>We ran into an issue loading your data.</div>
        </Help>
      );
    }

    // @ts-ignore
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
        emptySessionsMessage={
          <React.Fragment>
            <div>
              For details on how to get started with Tangle, follow this{" "}
              <span
                className={`pointer bb b--accent dim`}
                onClick={() => {
                  window.open(`https://usetangle.com/blog-guide`);
                }}
              >
                guide
              </span>
              .
            </div>
          </React.Fragment>
        }
        captures={[]}
        headerHeight={this.props.headerHeight}
        loadMoreSessions={
          nextSessionPageId
            ? () => {
                console.log(nextSessionPageId);
                fetchMore({
                  variables: {
                    count: config.resultCount,
                    pageId: nextSessionPageId
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                      return prevResult;
                    }

                    console.log(prevResult["getRecentSessions"]);
                    console.log(fetchMoreResult["getRecentSessions"]);

                    const nextGetRecentSessions = {
                      __typename: "SessionCollection",
                      items: concat(
                        prevResult["getRecentSessions"]["items"],
                        fetchMoreResult["getRecentSessions"]["items"]
                      ),
                      pagingInfo:
                        fetchMoreResult["getRecentSessions"]["pagingInfo"]
                    };

                    return {
                      getRecentSessions: nextGetRecentSessions
                    };
                  }
                });
              }
            : undefined
        }
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
