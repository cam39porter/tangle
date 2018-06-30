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
  constructor(props: Props) {
    super(props);
  }

  render() {
    // Do not render the current session in the list
    const sessionId = decodeURIComponent(this.props.match.params["id"]);
    const sessions = this.props.sessions.filter(
      session => session.id !== sessionId
    );

    return (
      <div className={``}>
        <div
          className={`ph4 flex-column overflow-auto`}
          style={{
            height: `${this.props.windowHeight - this.props.headerHeight}px`
          }}
        >
          {/* Sessions */}
          {!!sessions.length && (
            <div className={`pv4`}>
              <div className={`flex justify-between pb4 w-100 gray`}>
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
                          )}/related`
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
              <div className={``}>
                {this.props.sessions.map(session => (
                  <div className={`dim`} key={session.id}>
                    <CardSession
                      id={session.id}
                      title={session.title}
                      created={session.created}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Captures */}
          {this.props.captures.length !== 0 && (
            <div className={`pv4`}>
              <div className={`pb2 flex justify-between w-100 gray`}>
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
              <div className={``}>
                {this.props.captures.map(capture => (
                  <div
                    className={`pv4`}
                    style={{
                      width: WIDTH
                    }}
                    key={capture.id}
                  >
                    <CardCapture
                      captureId={capture.id}
                      startingText={capture.body}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
