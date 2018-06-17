// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  searchV2Query as searchV2QueryResponse,
  searchV2QueryVariables
} from "../__generated__/types";

import { search } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import GridCaptures from "../components/grid-captures";
import HeaderSurface from "../components/header-surface";
import ReactResizeDetector from "react-resize-detector";

// Utils

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<searchV2QueryVariables> & Partial<searchV2QueryResponse>;
  query: string;
}

interface State {
  headerHeight: number;
}

// Class
class SearchGrid extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      headerHeight: 0
    };
  }

  render() {
    const results = this.props.data.searchV2;

    if (!(results && results.captures)) {
      return <div />;
    }

    return (
      <div className={`flex-column`}>
        <div>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                headerHeight: height
              });
            }}
          />
          <HeaderSurface isGraphView={false} />
        </div>
        <GridCaptures
          captures={results.captures.items}
          headerHeight={this.state.headerHeight}
        />
      </div>
    );
  }
}

const withSearch = graphql<searchV2QueryResponse, Props>(search, {
  alias: "withSearch",
  options: (props: Props) => ({
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
