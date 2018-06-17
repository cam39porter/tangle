// React
import * as React from "react";

// GraphQL
import {
  getRecentSessionsQuery as getRecentSessionsResponse,
  getRecentSessionsQueryVariables
} from "../__generated__/types";
import { getRecentSessions } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import CardSession from "./card-session";
// import InputCapture from "./input-capture";
import ReactResizeDetector from "react-resize-detector";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";

// Utils
import windowSize from "react-window-size";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // GraphQL
  getRecentSessions: QueryProps<getRecentSessionsQueryVariables> &
    Partial<getRecentSessionsResponse>;
  scrollToId?: string;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  headerHeight: number;
  footerHeight: number;
}

class ListSessions extends React.Component<Props, State> {
  _scrollContainer: ScrollContainer | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      headerHeight: 0,
      footerHeight: 0
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.scrollToId) {
      this.scrollTo(nextProps.scrollToId);
    }
  }

  scrollTo = (id: string) => {
    this._scrollContainer && this._scrollContainer.scrollTo(id);
  };

  render() {
    const recentSessions = this.props.getRecentSessions.getRecentSessions;
    if (!(recentSessions && recentSessions.items)) {
      return <div />;
    }
    return (
      <div className={``}>
        {/* Header */}
        <div className={``}>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                headerHeight: height
              });
            }}
          />
          <div className={`flex pv3 h3 w-100 bg-white bb bt bw2 b--light-gray`}>
            <div className={`flex-column justify-around flex-grow`}>
              <div className={`ph3`}>Start a new brainstorm</div>
            </div>
            <div className={`pr1 flex-column justify-around`} />
          </div>
          {/* Capture Input */}
          {/* <div
            className={`pa2 bt bb bw2 b--accent bg-white`}
            style={{ minHeight: "10em" }}
          >
            <div className={`pa3`}>
              <InputCapture />
            </div>
          </div> */}
        </div>
        <ScrollContainer
          ref={scrollContainer => (this._scrollContainer = scrollContainer)}
        >
          {/* List */}
          <div
            className={`flex-column ph2 pv4 overflow-auto`}
            style={{
              height: `${this.props.windowHeight -
                this.state.headerHeight -
                this.state.footerHeight}px`
            }}
          >
            {recentSessions.items.map(session => (
              <div
                className={``}
                key={session.id}
                onClick={() => {
                  this.props.history.push(
                    `/session/${encodeURIComponent(session.id)}`
                  );
                }}
              >
                <ScrollContainerElement name={session.id}>
                  <CardSession
                    id={session.id}
                    title={session.title || "Untitled"}
                    created={session.created.toString()}
                  />
                </ScrollContainerElement>
              </div>
            ))}
          </div>
        </ScrollContainer>
        {/* Footer */}
        <div className={``}>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                footerHeight: height
              });
            }}
          />
        </div>
      </div>
    );
  }
}

const withGetRecentSessions = graphql<getRecentSessionsResponse, Props>(
  getRecentSessions,
  {
    name: "getRecentSessions",
    alias: "withGetRecentSessions",
    options: (props: Props) => ({
      variables: {
        count: 20
      },
      fetchPolicy: "network-only"
    })
  }
);

const ListSessionsWithData = windowSize(
  compose(withGetRecentSessions)(ListSessions)
);

export default ListSessionsWithData;
