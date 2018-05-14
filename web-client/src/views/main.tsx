// React
import * as React from "react";

// GraphQL
import {
  capturedTodayQuery as capturedTodayResponse,
  capturedTodayQueryVariables,
  searchQuery as searchResponse,
  searchQueryVariables,
  SearchResultsFieldsFragment,
  ListFieldsFragment,
  NodeFieldsFragment,
  EdgeFieldsFragment
} from "../__generated__/types";
import { capturedToday, search } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import List from "../components/list";
import GraphVisualization from "../components/graph-visualization";

// Utils
import { getIsLargeWindow, getCurrentLocation, getQuery } from "../utils";
import { noop } from "lodash";
import windowSize from "react-window-size";

// Types
import { Location } from "../types";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // Queries
  capturedToday: QueryProps<capturedTodayQueryVariables> &
    capturedTodayResponse;
  search: QueryProps<searchQueryVariables> & searchResponse;

  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  isCapturing: boolean;
  list: Array<ListFieldsFragment>;
  nodes: Array<NodeFieldsFragment>;
  edges: Array<EdgeFieldsFragment>;
}

// Class
class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCapturing: true,
      ...this.getData(props.location.search)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ...this.getData(nextProps.location.search)
    });
  }

  getData = (
    queryString: string
  ): {
    list: Array<ListFieldsFragment>;
    nodes: Array<NodeFieldsFragment>;
    edges: Array<EdgeFieldsFragment>;
  } => {
    let data: SearchResultsFieldsFragment | undefined;
    let currentLocation = getCurrentLocation(queryString);

    switch (currentLocation) {
      case Location.CapturedToday:
        data = this.props.capturedToday.getAll;
        break;
      case Location.Search:
        data = this.props.search.search;
        break;
      default:
        break;
    }

    if (data) {
      return {
        list: data.list as Array<ListFieldsFragment>,
        nodes: data.graph.nodes as Array<NodeFieldsFragment>,
        edges: data.graph.edges as Array<EdgeFieldsFragment>
      };
    }

    return {
      list: [] as Array<ListFieldsFragment>,
      nodes: [] as Array<NodeFieldsFragment>,
      edges: [] as Array<EdgeFieldsFragment>
    };
  };

  render() {
    let isLargeWindow = getIsLargeWindow(this.props.windowWidth);

    return (
      <div className={`flex w-100 vh-100`}>
        {/* List */}
        <div
          className={`shadow-1`}
          style={{
            minWidth: isLargeWindow ? "35em" : "100%",
            maxWidth: isLargeWindow ? "35em" : "100%"
          }}
        >
          <List
            // List
            isHidden={false}
            handleIsHidden={noop}
            listData={this.state.list}
            // Session
            sessionId={undefined}
            sessionTitle={undefined}
            sessionTags={undefined}
            sessionIsEditingTags={false}
            sessionIsEditingTitle={false}
            sessionHandleEditTags={noop}
            sessionHandleEditTitle={noop}
            sessionHandleClose={noop}
            // Header
            handleHeaderCaptureTextChange={noop}
            handleHeaderCapture={noop}
            handleHeaderExpand={noop}
            isHeaderCapturing={this.state.isCapturing}
            handleHeaderIsCapturing={() => {
              this.setState({
                isCapturing: !this.state.isCapturing
              });
            }}
            handleSurfaceTextChange={noop}
            handleSurface={noop}
            handleSurfaceClear={noop}
            // Captures
            handleExpand={(id: string) => noop}
            handleIsShowingRelated={(id: string) => noop}
            isShowingRelated={(id: string) => false}
            handleMore={(id: string) => noop}
            isMore={(id: string) => false}
            handleComment={(id: string) => noop}
            handleFocus={(id: string) => noop}
            handleEdit={(id: string) => noop}
            isEditing={(id: string) => false}
            handleArchive={(id: string) => noop}
            handleTextChange={(id: string) => noop}
            handleCapture={(id: string) => noop}
          />
        </div>

        {/* Graph */}
        {isLargeWindow ? (
          <div className={`flex-grow`}>
            <GraphVisualization
              refEChart={noop}
              nodes={this.state.nodes}
              edges={this.state.edges}
              onClick={noop}
              onMouseOver={noop}
              onMouseOut={noop}
              showTooltip={false}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

// GraphQL Queries and Mutations
const withCapturedToday = graphql<capturedTodayResponse, Props>(capturedToday, {
  name: "capturedToday",
  alias: "withCapturedToday",
  skip: (props: Props) =>
    getCurrentLocation(props.location.search) !== Location.CapturedToday,
  options: {
    variables: {
      timezoneOffset: new Date().getTimezoneOffset() / 60 * -1
    }
  }
});

const withSearch = graphql<searchResponse, Props>(search, {
  name: "search",
  alias: "withSearch",
  skip: (props: Props) =>
    getCurrentLocation(props.location.search) !== Location.Search,
  options: (props: Props) => ({
    variables: {
      rawQuery: getQuery(props.location.search)
    }
  })
});

const MainWithData = compose(withCapturedToday, withSearch)(Main);

const MainWithDataWithWindowSize = windowSize(MainWithData);

export default MainWithDataWithWindowSize;
