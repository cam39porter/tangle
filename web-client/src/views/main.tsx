// React
import * as React from "react";

// GraphQL
import {
  capturedTodayQuery as capturedTodayResponse,
  capturedTodayQueryVariables,
  searchQuery as searchResponse,
  searchQueryVariables
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
import { noop, trim } from "lodash";
import windowSize from "react-window-size";

// Types
import { Location } from "../types";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // Queries
  capturedToday?: QueryProps<capturedTodayQueryVariables> &
    Partial<capturedTodayResponse>;
  search?: QueryProps<searchQueryVariables> & Partial<searchResponse>;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  // Header
  isCapturing: boolean;
  captureText: string;
  surfaceText: string;
}

// Class
class Main extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isCapturing:
        getCurrentLocation(nextProps.location.search) ===
        Location.CapturedToday,
      captureText: "",
      surfaceText: getQuery(nextProps.location.search)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      isCapturing:
        getCurrentLocation(nextProps.location.search) ===
        Location.CapturedToday,
      surfaceText: getQuery(nextProps.location.search)
    });
  }

  render() {
    let isLoading;
    let data;

    if (this.props.capturedToday) {
      isLoading = this.props.capturedToday.loading;
      data = this.props.capturedToday.getAll;
    }

    if (this.props.search) {
      isLoading = this.props.search.loading;
      data = this.props.search.search;
    }

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
            listData={isLoading ? [] : data.list}
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
            handleHeaderCaptureTextChange={nextCaptureText => {
              this.setState({
                captureText: nextCaptureText
              });
            }}
            handleHeaderCapture={noop}
            handleHeaderExpand={noop}
            isHeaderCapturing={this.state.isCapturing}
            handleHeaderIsCapturing={() => {
              this.setState({
                isCapturing: !this.state.isCapturing
              });
            }}
            handleSurfaceTextChange={nextSurfaceText => {
              this.setState({
                surfaceText: nextSurfaceText
              });
            }}
            handleSurface={() => {
              this.props.history.push(
                `?query=${encodeURIComponent(
                  trim(this.state.surfaceText) || ""
                )}`
              );
            }}
            handleSurfaceClear={() => {
              this.props.history.push(`/`);
            }}
            surfaceStartingText={getQuery(this.props.location.search)}
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
              nodes={isLoading ? [] : data.graph.nodes}
              edges={isLoading ? [] : data.graph.edges}
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
