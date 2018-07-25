// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  searchV2Query as searchV2QueryResponse,
  searchV2QueryVariables,
  CaptureFieldsFragment,
  SessionWithoutItemCollectionFieldsFragment
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
  data: QueryProps<searchV2QueryVariables> & Partial<searchV2QueryResponse>;
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
    let sessions: Array<SessionWithoutItemCollectionFieldsFragment> = [];
    let captures: Array<CaptureFieldsFragment> = [];
    if (
      searchV2 &&
      searchV2.captures &&
      searchV2.captures.items &&
      searchV2.sessions &&
      searchV2.sessions.items
    ) {
      sessions = searchV2.sessions.items;
      captures = searchV2.captures.items;
    }

    const error = this.props.data.error;
    if (error) {
      return (
        <Help>
          <div>We ran into an issue loading your data.</div>
        </Help>
      );
    }

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

const withSearch = graphql<searchV2QueryResponse, Props>(search, {
  alias: "withSearch",
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
