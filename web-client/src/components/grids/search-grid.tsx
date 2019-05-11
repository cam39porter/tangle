// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  searchV2 as searchV2Response,
  searchV2Variables,
  CaptureFields,
  SessionWithoutItemCollectionFields
} from "../../__generated__/types";

import { search } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../../components/grids/grid";
import Help from "../help/help";

// Utils
import config from "../../cfg";
import { AnalyticsUtils } from "../../utils/index";

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<searchV2Variables> & Partial<searchV2Response>;
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
    const searchV2 = this.props.data.searchV2;
    let sessions: Array<SessionWithoutItemCollectionFields> = [];
    let captures: Array<CaptureFields> = [];
    if (
      searchV2 &&
      searchV2.captures &&
      searchV2.captures.items &&
      searchV2.sessions &&
      searchV2.sessions.items
    ) {
      // @ts-ignore
      sessions = searchV2.sessions.items;
      // @ts-ignore

      captures = searchV2.captures.items;
    }
    // @ts-ignore
    const error = this.props.data.error;
    if (error) {
      return (
        <Help>
          <div>We ran into an issue loading your data.</div>
        </Help>
      );
    }
    // @ts-ignore

    if (this.props.data.loading) {
      return (
        <Help>
          <div />
        </Help>
      );
    }

    AnalyticsUtils.trackEvent({
      category: this.props.match.params["id"]
        ? AnalyticsUtils.Categories.Session
        : AnalyticsUtils.Categories.Home,
      action: AnalyticsUtils.Actions.ViewedSearchGrid,
      label: this.props.query,
      value: sessions.length + captures.length
    });

    return (
      <Grid
        sessions={sessions}
        emptySessionsMessage={`No notes matched your search`}
        captures={captures}
        headerHeight={this.props.headerHeight}
      />
    );
  }
}
// @ts-ignore
const withSearch = graphql<searchV2Response, Props>(search, {
  // @ts-ignore
  alias: "withSearch",
  // @ts-ignore
  options: (props: Props) => ({
    skip: props.query === "",
    variables: {
      rawQuery: props.query,
      sessionPageId: null,
      sessionCount: config.resultCount,
      capturePageId: null,
      captureCount: config.resultCount
    },
    fetchPolicy: "network-only"
  })
});

// Export
export default compose(withSearch)(SearchGrid);
