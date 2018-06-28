// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  searchV2Query as searchV2QueryResponse,
  searchV2QueryVariables
} from "../../__generated__/types";

import { search } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../../components/grids/grid";

// Utils

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
    const data = this.props.data;
    if (
      !(
        data &&
        data.searchV2 &&
        data.searchV2.captures &&
        data.searchV2.sessions
      )
    ) {
      return <div />;
    }

    return (
      <Grid
        sessions={data.searchV2.sessions.items}
        captures={data.searchV2.captures.items}
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
      sessionCount: 10,
      capturePageId: null,
      captureCount: 10
    },
    fetchPolicy: "network-only"
  })
});

// Export
export default compose(withSearch)(SearchGrid);
