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
import CardCapture from "./../cards/card-capture-v2";
import CardSession from "./../cards/card-session";

// Utils
import windowSize from "react-window-size";
import { NetworkUtils, AnalyticsUtils, ErrorsUtils } from "../../utils";

// Types
import {
  CaptureFieldsFragment,
  SessionWithoutItemCollectionFieldsFragment
} from "../../__generated__/types";
import { isMobile } from "react-device-detect";
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  createSession: MutationFunc<
    createSessionResponse,
    createSessionCaptureMutationVariables
  >;
  sessions: Array<SessionWithoutItemCollectionFieldsFragment>;
  captures: Array<CaptureFieldsFragment>;
  emptySessionsMessage?: string;
  emptyCapturesMessage?: string;
  sessionId?: string;
  headerHeight: number;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {}

class GridCaptures extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const captures = this.props.captures;

    return (
      <div className={``}>
        <div
          className={`ph4 flex-column overflow-auto`}
          style={{
            height: `${this.props.windowHeight - this.props.headerHeight}px`
          }}
        >
          {/* Sessions */}
          {(this.props.sessions.length !== 0 ||
            this.props.emptySessionsMessage) && (
            <div className={`pv4`}>
              <div className={`flex justify-between pb4 w-100 gray`}>
                <div className={`flex-column justify-around`}>Collections</div>
                <div
                  className={`flex-column justify-around f6 bb b--accent pointer dark-gray`}
                  onClick={() => {
                    this.props
                      .createSession({})
                      .then(res => {
                        let id = res.data.createSession.id;
                        this.props.history.push(
                          `/collection/${encodeURIComponent(
                            res.data.createSession.id
                          )}/format/list/related`
                        );
                        return id;
                      })
                      .then(id => {
                        AnalyticsUtils.trackEvent({
                          category: this.props.match.params["id"]
                            ? AnalyticsUtils.Categories.Session
                            : AnalyticsUtils.Categories.Home,
                          action:
                            AnalyticsUtils.Actions.ClickToCreateNewSession,
                          label: id
                        });
                      })
                      .catch(err => {
                        ErrorsUtils.errorHandler.report(err.message, err.stack);
                      });
                  }}
                >
                  Create a new collection
                </div>
              </div>
              {this.props.sessions.length === 0 ? (
                <div className={`pv4 measure lh-copy gray tc center`}>
                  {this.props.emptySessionsMessage}
                </div>
              ) : (
                <div className={``}>
                  {this.props.sessions.map(session => (
                    <div className={``} key={session.id}>
                      <CardSession
                        sessionId={session.id}
                        title={session.title}
                        created={session.lastModified}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Captures */}
          {(captures.length !== 0 || this.props.emptyCapturesMessage) && (
            <div className={`pv4`}>
              <div className={`pb2 flex justify-between w-100 gray`}>
                <div className={`flex-column justify-around`}>Captures</div>
                <div
                  className={`flex-column justify-around f6 bb b--accent pointer dark-gray`}
                  onClick={() => {
                    const query = NetworkUtils.getQuery(
                      this.props.location.search
                    );
                    this.props.history.push(
                      `${this.props.location.pathname}?${
                        query ? `query=${query}&` : ``
                      }capture=true`
                    );
                    AnalyticsUtils.trackEvent({
                      category: this.props.match.params["id"]
                        ? AnalyticsUtils.Categories.Session
                        : AnalyticsUtils.Categories.Home,
                      action: AnalyticsUtils.Actions.ClickToCreateNewCapture
                    });
                  }}
                >
                  Create a new capture
                </div>
              </div>
              {captures.length === 0 ? (
                <div className={`pv4 measure lh-copy gray tc center`}>
                  {this.props.emptyCapturesMessage}
                </div>
              ) : (
                <div className={`flex-column center`}>
                  {captures.map(capture => (
                    <div className={`pa3`} key={capture.id}>
                      <CardCapture
                        sessionParents={capture.parents || []}
                        captureId={capture.id}
                        startingHtml={capture.body}
                      />
                    </div>
                  ))}
                </div>
              )}
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
