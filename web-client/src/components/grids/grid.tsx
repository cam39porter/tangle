// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL
import {
  createSessionMutation as createSessionResponse,
  createSessionCaptureMutationVariables
} from "../../__generated__/types";
import { createSession } from "../../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components
import CardCapture from "./../cards/card-capture";
import CardSession from "./../cards/card-session";
import ScrollContainer from "../scroll/scroll-container";
import ScrollContainerElement from "../scroll/scroll-container-element";

// Utils
import windowSize from "react-window-size";
import { NetworkUtils } from "../../utils";

// Types
import {
  CaptureFieldsFragment,
  SessionFieldsFragment
} from "../../__generated__/types";
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  createSession: MutationFunc<
    createSessionResponse,
    createSessionCaptureMutationVariables
  >;
  sessions: Array<SessionFieldsFragment>;
  captures: Array<CaptureFieldsFragment>;
  scrollToId?: string;
  sessionId?: string;
  headerHeight: number;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {}

const WIDTH = "30em";

class GridCaptures extends React.Component<Props, State> {
  _scrollContainer: ScrollContainer | null = null;

  constructor(props: Props) {
    super(props);
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
    return (
      <div className={``}>
        <ScrollContainer
          ref={scrollContainer => (this._scrollContainer = scrollContainer)}
        >
          <div
            className={`flex-column items-center ph2 pv4 overflow-auto`}
            style={{
              height: `${this.props.windowHeight - this.props.headerHeight}px`
            }}
          >
            {/* Sessions */}
            <div className={`pv4`}>
              <div
                className={`flex justify-between pb4 w-100 gray`}
                style={{
                  width: WIDTH
                }}
              >
                <div className={`flex-column justify-around`}>Collections</div>
                <div
                  className={`flex-column justify-around f6 bb b--accent pointer`}
                  onClick={() => {
                    this.props
                      .createSession({})
                      .then(res => {
                        this.props.history.push(
                          `/session/${encodeURIComponent(
                            res.data.createSession.id
                          )}/recent`
                        );
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }}
                >
                  Create a new collection
                </div>
              </div>
              {!!this.props.sessions.length && (
                <div className={``}>
                  {this.props.sessions.map(session => {
                    // Do not render current session in the list
                    if (
                      session.id ===
                      decodeURIComponent(this.props.match.params["id"])
                    ) {
                      return null;
                    }

                    return (
                      <div
                        className={``}
                        style={{
                          width: WIDTH
                        }}
                        key={session.id}
                      >
                        <ScrollContainerElement name={session.id}>
                          <CardSession
                            id={session.id}
                            title={session.title}
                            created={session.created}
                          />
                        </ScrollContainerElement>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Captures */}
            <div className={`pv4`}>
              <div
                className={`flex justify-between pt4 w-100 gray`}
                style={{
                  width: WIDTH
                }}
              >
                <div className={`flex-column justify-around`}>Captures</div>
                <div
                  className={`flex-column justify-around f6 bb b--accent pointer`}
                  onClick={() => {
                    const query = NetworkUtils.getQuery(
                      this.props.location.search
                    );
                    this.props.history.push(
                      `${this.props.location.pathname}?${
                        query ? `query=${query}&` : ``
                      }capture=true`
                    );
                  }}
                >
                  Create a new capture
                </div>
              </div>
              {this.props.captures.map(capture => (
                <div
                  className={`pt4`}
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
            </div>
          </div>
        </ScrollContainer>
      </div>
    );
  }
}

const withCreateSession = graphql<createSessionResponse, Props>(createSession, {
  name: "createSession",
  alias: "withCreateSession"
});

export default compose(
  windowSize,
  withRouter,
  withCreateSession
)(GridCaptures);
