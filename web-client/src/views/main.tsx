// React
import * as React from "react";

// GraphQL
import {
  capturedTodayQuery as capturedTodayResponse,
  capturedTodayQueryVariables,
  ListFieldsFragment
} from "../__generated__/types";
import { capturedToday } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import List from "../components/list";
import GraphVisualization from "../components/graph-visualization";

// Utils
import { getIsLargeWindow } from "../utils";
import { noop } from "lodash";
import windowSize from "react-window-size";

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // Queries
  capturedToday: QueryProps<capturedTodayQueryVariables> &
    capturedTodayResponse;

  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {}

// Class
class Main extends React.Component<Props, State> {
  render() {
    let capturedTodayList = this.props.capturedToday.getAll
      ? this.props.capturedToday.getAll.list
      : [];
    let capturedTodayNodes = this.props.capturedToday.getAll
      ? this.props.capturedToday.getAll.graph.nodes
      : [];
    let capturedTodayEdges = this.props.capturedToday.getAll
      ? this.props.capturedToday.getAll.graph.edges
      : [];

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
            listData={capturedTodayList as Array<ListFieldsFragment>}
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
            isHeaderCapturing={true}
            handleHeaderIsCapturing={noop}
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
              nodes={capturedTodayNodes}
              edges={capturedTodayEdges}
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
  skip: (props: Props) => false,
  options: {
    variables: {
      timezoneOffset: new Date().getTimezoneOffset() / 60 * -1
    }
  }
});

const MainWithData = compose(withCapturedToday)(Main);

const MainWithDataWithWindowSize = windowSize(MainWithData);

export default MainWithDataWithWindowSize;
