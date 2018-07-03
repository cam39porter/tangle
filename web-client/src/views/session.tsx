// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  deleteSessionMutation as deleteSessionResponse,
  deleteSessionMutationVariables,
  getSessionQuery as getSessionResponse,
  getSessionQueryVariables
} from "../__generated__/types";

import { getSession, deleteSession } from "../queries";
import { graphql, compose, QueryProps, MutationFunc } from "react-apollo";

// Components
import HeaderSession from "../components/headers/header-session";
import CardSessionTitle from "../components/cards/card-session-title";
import CardCapture from "../components/cards/card-capture";
import InputCapture from "../components/inputs/input-capture";
import ScrollContainer from "../components/scroll/scroll-container";
import ScrollContainerElement from "../components/scroll/scroll-container-element";
import ReactResizeDetector from "react-resize-detector";

// Utils
import windowSize from "react-window-size";
import { ApolloUtils, AnalyticsUtils } from "../utils/index";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getSessionQueryVariables> & Partial<getSessionResponse>;
  deleteSession: MutationFunc<
    deleteSessionResponse,
    deleteSessionMutationVariables
  >;
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

    const sessionId = decodeURIComponent(this.props.match.params["id"]);
    const nextSessionId = decodeURIComponent(nextProps.match.params["id"]);
    if (sessionId !== nextSessionId) {
      this.handleDeleteSession();
    }
  }

  componentWillUnmount() {
    this.handleDeleteSession();
  }

  handleDeleteSession = () => {
    const sessionCaptures = this.props.data.getSession;
    if (
      !(
        sessionCaptures &&
        sessionCaptures.itemCollection &&
        sessionCaptures.itemCollection.items
      ) || // Do not delete if session has a title or captures
      (sessionCaptures.title || sessionCaptures.itemCollection.items.length > 0)
    ) {
      return;
    }

    this.props
      .deleteSession({
        variables: {
          sessionId: sessionCaptures.id
        },
        update: ApolloUtils.deleteSessionUpdate(sessionCaptures.id)
      })
      .then(() => {
        AnalyticsUtils.trackEvent({
          category: AnalyticsUtils.Categories.Test,
          action: AnalyticsUtils.Actions.DeleteSession,
          label: sessionCaptures.id,
          nonInteraction: true
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  scrollTo = (id: string) => {
    this._scrollContainer && this._scrollContainer.scrollTo(id);
  };

  render() {
    const sessionCaptures = this.props.data.getSession;
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
        className={`bg-near-white ba b--light-gray`}
      >
        {/* Header */}
        <div>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                headerHeight: height
              });
            }}
          />
          <HeaderSession />
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
                <CardSessionTitle
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
                    sessionId={sessionCaptures.id}
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
  name: "data",
  alias: "withGetSession",
  options: (props: Props) => ({
    variables: {
      sessionId: decodeURIComponent(props.match.params["id"]),
      count: 20
    },
    fetchPolicy: "network-only"
  })
});

const withDeleteSession = graphql<deleteSessionResponse, Props>(deleteSession, {
  name: "deleteSession",
  alias: "withDeleteSession"
});

const ListCapturesWithData = windowSize(
  compose(
    withGetSession,
    withDeleteSession
  )(Session)
);

export default ListCapturesWithData;
