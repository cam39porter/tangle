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
import ListSessionTitle from "../components/header-session";
import ButtonExit from "../components/button-exit";
import CardCapture from "../components/card-capture";
import ScrollContainer from "../components/scroll-container";
import ScrollContainerElement from "../components/scroll-container-element";
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

class ListCaptures extends React.Component<Props, State> {
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

    return (
      <div className={`flex-grow bg-near-white ba b--light-gray`}>
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
              <div className={`ph3`}>
                <ListSessionTitle
                  sessionId={sessionCaptures.id}
                  startingTitle={sessionCaptures.title}
                />
              </div>
            </div>
            <div className={`pr1 flex-column justify-around`}>
              <div>
                <ButtonExit
                  onClick={() => {
                    this.props.history.push("/");
                  }}
                />
              </div>
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
            {sessionCaptures.itemCollection.items.map(capture => (
              <div
                className={``}
                style={{
                  width: "35em"
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

const ListCapturesWithData = windowSize(compose(withGetSession)(ListCaptures));

export default ListCapturesWithData;
