// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getSessionQuery as getSessionResponse,
  getSessionQueryVariables
} from "../__generated__/types";

import { getSession } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import ListSessionTitle from "../components/headers/header-session";
import ButtonExit from "../components/buttons/button-exit";
import CardCapture from "../components/cards/card-capture";
import InputCapture from "../components/inputs/input-capture";
import ScrollContainer from "../components/scroll/scroll-container";
import ScrollContainerElement from "../components/scroll/scroll-container-element";
import ReactResizeDetector from "react-resize-detector";

// Utils
import windowSize from "react-window-size";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  getSession: QueryProps<getSessionQueryVariables> &
    Partial<getSessionResponse>;
  scrollToId?: string;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  headerHeight: number;
  footerHeight: number;
}

const WIDTH = "30em";

class Session extends React.Component<Props, State> {
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
    const sessionCaptures = this.props.getSession.getSession;
    if (
      !(
        sessionCaptures &&
        sessionCaptures.itemCollection &&
        sessionCaptures.itemCollection.items
      )
    ) {
      return <div />;
    }

    let sessionItems = sessionCaptures.itemCollection.items;

    let sessionId = decodeURIComponent(this.props.match.params["id"]);

    return (
      <div
        key={`session-view-${sessionId}`}
        className={`flex-grow bg-near-white ba b--light-gray`}
      >
        {/* Header */}
        <div
          className={`flex justify-between bb bw1 b--light-gray`}
          style={{
            minHeight: "4em",
            userSelect: "none"
          }}
        >
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                headerHeight: height
              });
            }}
          />
          <div className={`flex-column justify-around ph2`}>
            Current Brainstorm
          </div>
          <div
            className={`flex-column justify-around ph2`}
            onClick={() => {
              this.props.history.push(`/${this.props.location.search}`);
            }}
          >
            <div>
              <ButtonExit />
            </div>
          </div>
        </div>
        <ScrollContainer
          ref={scrollContainer => (this._scrollContainer = scrollContainer)}
        >
          <div
            className={`flex-column items-center ph2 pv4 overflow-auto`}
            style={{
              height: `${this.props.windowHeight -
                this.state.headerHeight -
                this.state.footerHeight}px`
            }}
          >
            <div
              className={``}
              style={{
                width: WIDTH
              }}
              key={`session-view-list-${sessionId}`}
            >
              <div className={`pa3 br4 bg-white ba bw1 b--light-gray`}>
                <ListSessionTitle
                  key={sessionCaptures.id}
                  sessionId={sessionCaptures.id}
                  startingTitle={sessionCaptures.title}
                />
              </div>
            </div>
            {sessionItems.map(capture => (
              <div
                className={``}
                style={{
                  width: WIDTH
                }}
                key={capture.id}
              >
                <ScrollContainerElement name={capture.id}>
                  <CardCapture
                    captureId={capture.id}
                    startingText={capture.body}
                  />
                </ScrollContainerElement>
              </div>
            ))}
            <div
              className={`pa3 br4 bg-white ba bw1 b--light-gray`}
              style={{
                width: WIDTH
              }}
            >
              <InputCapture
                sessionData={{
                  sessionId,
                  previousId:
                    sessionItems.length > 0
                      ? sessionItems[sessionItems.length - 1].id
                      : sessionId
                }}
              />
            </div>
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

const withGetSession = graphql<getSessionResponse, Props>(getSession, {
  name: "getSession",
  alias: "withGetSession",
  options: (props: Props) => ({
    variables: {
      sessionId: decodeURIComponent(props.match.params["id"]),
      count: 20
    },
    fetchPolicy: "network-only"
  })
});

const ListCapturesWithData = windowSize(compose(withGetSession)(Session));

export default ListCapturesWithData;
