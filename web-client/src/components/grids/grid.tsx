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
import { AnalyticsUtils, ErrorsUtils } from "../../utils";

// Types
import {
  CaptureFieldsFragment,
  SessionWithoutItemCollectionFieldsFragment
} from "../../__generated__/types";
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  createSession: MutationFunc<
    createSessionResponse,
    createSessionCaptureMutationVariables
  >;
  sessions: Array<SessionWithoutItemCollectionFieldsFragment>;
  captures: Array<CaptureFieldsFragment>;
  emptySessionsMessage?: React.ReactChild;
  emptyCapturesMessage?: string;
  sessionId?: string;
  headerHeight: number;
  // Paging
  loadMoreSessions?: () => void;
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
    const { captures, loadMoreSessions } = this.props;

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
              <div className={`flex justify-between w-100 gray`}>
                <div className={`flex`}>
                  <div className={`flex-column justify-around`}>Notes</div>
                </div>
                <div
                  className={`flex-column justify-around f6 bb b--accent pointer dark-gray dim`}
                  onClick={() => {
                    this.props
                      .createSession({})
                      .then(res => {
                        let id = res.data.createSession.id;
                        this.props.history.push(
                          `/note/${encodeURIComponent(id)}/format/list/related`
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
                        ErrorsUtils.errorToasts.createSession();
                        ErrorsUtils.errorHandler.report(err.message, err.stack);
                      });
                  }}
                >
                  Create a new note
                </div>
              </div>
              {this.props.sessions.length === 0 &&
              this.props.captures.length === 0 ? (
                <div className={`pv4 measure lh-copy gray tc center`}>
                  {this.props.emptySessionsMessage}
                </div>
              ) : (
                <div className={`pt4`}>
                  {this.props.sessions.map(session => (
                    <div
                      className={``}
                      key={`${session.created}:${session.id}:${session.title}`}
                    >
                      <CardSession
                        sessionId={session.id}
                        title={session.title}
                        created={session.lastModified}
                      />
                    </div>
                  ))}
                  {loadMoreSessions && (
                    <div className={`pv4 tc`} onClick={loadMoreSessions}>
                      <span className={`pointer bb b--accent f6 dim`}>
                        Load More Notes
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Captures */}
          {(captures.length !== 0 || this.props.emptyCapturesMessage) && (
            <div className={``}>
              {captures.length === 0 ? (
                <div className={`pv4 measure lh-copy gray tc center`}>
                  {this.props.emptyCapturesMessage}
                </div>
              ) : (
                <div className={`flex flex-wrap pb4`}>
                  {captures.map(capture => (
                    <div
                      className={
                        this.props.match.params["id"]
                          ? `pa3 ${
                              this.props.windowWidth > 1360 ? "w-50" : "w-100"
                            }`
                          : "pa3"
                      }
                      key={capture.id}
                    >
                      <CardCapture
                        sessionParents={capture.parents || []}
                        captureId={capture.id}
                        startingHtml={capture.body}
                        authorName={capture.authorName}
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
