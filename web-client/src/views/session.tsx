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
import ScrollContainer from "../components/scroll/scroll-container";
import ScrollContainerElement from "../components/scroll/scroll-container-element";
import ReactResizeDetector from "react-resize-detector";

// Utils
import windowSize from "react-window-size";
import { ApolloUtils, ErrorsUtils } from "../utils/index";

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

type InputsFocusMap = Map<string, () => void>;

interface State {
  headerHeight: number;
  footerHeight: number;
}

const WIDTH = "30em";

class Session extends React.Component<Props, State> {
  _scrollContainer: ScrollContainer | null = null;
  inputsFocus: InputsFocusMap = new Map();

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
      .catch(err => {
        ErrorsUtils.errorHandler.report(err.message, err.stack);
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
            className={`flex-column items-center ph4 pv4 overflow-auto`}
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
            {sessionItems.map((capture, index) => {
              const id = capture.id;
              const previousId =
                index === 0 ? undefined : sessionItems[index - 1].id;
              const nextId =
                index === sessionItems.length - 1
                  ? undefined
                  : sessionItems[index + 1].id;

              return (
                <div
                  className={``}
                  style={{
                    width: WIDTH
                  }}
                  key={id}
                >
                  <ScrollContainerElement name={id}>
                    <CardCapture
                      handleFocus={focus => {
                        this.inputsFocus.set(id, focus);
                      }}
                      sessionId={sessionCaptures.id}
                      captureId={id}
                      startingText={capture.body}
                      focusOnNext={() => {
                        if (!nextId) {
                          return;
                        }
                        const focusOnNext = this.inputsFocus.get(nextId);
                        if (focusOnNext) {
                          focusOnNext();
                        }
                      }}
                      focusOnPrevious={() => {
                        if (!previousId) {
                          return;
                        }
                        const focusOnPrevious = this.inputsFocus.get(
                          previousId
                        );

                        if (focusOnPrevious) {
                          focusOnPrevious();
                        }
                      }}
                    />
                  </ScrollContainerElement>
                </div>
              );
            })}
            <div
              style={{
                width: WIDTH
              }}
            >
              <ScrollContainerElement name={"input-capture"}>
                <CardCapture
                  sessionId={sessionCaptures.id}
                  previousId={
                    sessionItems.length > 0
                      ? sessionItems[sessionItems.length - 1].id
                      : sessionId
                  }
                />
              </ScrollContainerElement>
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
