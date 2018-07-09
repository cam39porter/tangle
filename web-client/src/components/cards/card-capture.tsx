// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL
import {
  // Archive Capture
  deleteCaptureMutation as deleteCaptureResponse,
  deleteCaptureMutationVariables,
  // Types
  NodeType
} from "../../__generated__/types";

import { graphql, compose, MutationFunc } from "react-apollo";

import { deleteCapture } from "../../queries";

// Components
import ButtonArchive from "./../buttons/button-archive";
import InputCapture from "../inputs/input-capture";
import Markdown from "../help/markdown";

// Utils
import { ApolloUtils, AnalyticsUtils, ErrorsUtils } from "../../utils/index";
import { isBrowser, isMobile } from "react-device-detect";

// Types
interface Props extends RouteComponentProps<{}> {
  deleteCapture: MutationFunc<
    deleteCaptureResponse,
    deleteCaptureMutationVariables
  >;
  sessionParents?: Array<{
    __typename: "Session";
    id: string;
    title: string | null;
    created: number;
    lastModified: number;
  }>;
  sessionId?: string;
  captureId?: string;
  startingText?: string;
  previousId?: string;
}

interface State {
  isFocus: boolean;
  isShowingButtons: boolean;
}

class CardCapture extends React.Component<Props, State> {
  focus;

  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isFocus: !this.props.captureId,
      isShowingButtons: false
    };
  }

  componentDidMount() {
    if (this.state.isFocus && this.focus) {
      this.focus();
    }
  }

  render() {
    const { captureId, startingText, sessionId, sessionParents } = this.props;
    const { isShowingButtons } = this.state;

    return (
      <div
        onMouseEnter={() => {
          this.setState({
            isShowingButtons: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            isShowingButtons: false
          });
        }}
        onClick={() => {
          this.focus && this.focus();
        }}
      >
        {sessionParents && sessionParents.length > 0 ? (
          <div
            className={`flex-column justify-around h3`}
            onClick={() => {
              this.props.history.push(
                `/collection/${encodeURIComponent(
                  sessionParents[0].id
                )}/format/list/related`
              );
              AnalyticsUtils.trackEvent({
                category: sessionParents[0].id
                  ? AnalyticsUtils.Categories.Session
                  : AnalyticsUtils.Categories.Home,
                action: AnalyticsUtils.Actions.OpenSession,
                label: captureId
              });
            }}
          >
            <span className={`gray f6 pointer dim`}>
              {sessionParents[0].title}
            </span>
          </div>
        ) : (
          !this.props.sessionId && !isMobile && <div className={`h3`} />
        )}
        <div
          id={`list-capture`}
          className={`relative flex pa3 w-100 br4 ba bw1 bg-white ${
            this.state.isFocus ? "b--accent" : "b--light-gray"
          }`}
        >
          <div
            className={`flex-grow flex-column justify-around`}
            style={{
              cursor: "text"
            }}
          >
            <InputCapture
              handleFocus={focus => {
                this.focus = focus;
              }}
              onFocus={() => {
                this.setState({
                  isFocus: true
                });
              }}
              onBlur={() => {
                this.setState({
                  isFocus: false
                });
              }}
              sessionData={sessionId ? { sessionId } : undefined}
              captureId={captureId}
              startingHTML={startingText}
            />
          </div>
          {isShowingButtons &&
            captureId && (
              <div
                className={`absolute flex top--1 right-0 br4 ba b--light-gray bg-white`}
              >
                <div
                  className={`flex-column justify-around pa2 pointer`}
                  onClick={e => {
                    e.stopPropagation();
                    this.props
                      .deleteCapture({
                        variables: { id: captureId },
                        optimisticResponse: {
                          deleteCapture: {
                            __typename: "Node",
                            id: this.props.captureId,
                            type: NodeType.Capture
                          }
                        },
                        refetchQueries: ApolloUtils.updateCaptureRefetchQueries(
                          location.pathname,
                          location.search,
                          sessionId
                        ),
                        update: ApolloUtils.deleteCaptureUpdate(captureId)
                      })
                      .then(() => {
                        AnalyticsUtils.trackEvent({
                          category: sessionId
                            ? AnalyticsUtils.Categories.Session
                            : AnalyticsUtils.Categories.Home,
                          action: sessionId
                            ? AnalyticsUtils.Actions.DeleteSessionCapture
                            : AnalyticsUtils.Actions.DeleteCapture,
                          label: captureId
                        });
                      })
                      .catch(err =>
                        ErrorsUtils.errorHandler.report(err.message, err.stack)
                      );
                  }}
                >
                  <div>
                    <ButtonArchive />
                  </div>
                </div>
              </div>
            )}
        </div>
        {!captureId &&
          isBrowser && (
            <div className={`center`}>
              <Markdown />
            </div>
          )}
      </div>
    );
  }
}

const withArchiveCapture = graphql<deleteCaptureResponse, Props>(
  deleteCapture,
  {
    name: "deleteCapture",
    alias: "withArchiveCapture"
  }
);

const CardCaptureWithData = compose(
  withArchiveCapture,
  withRouter
)(CardCapture);

export default CardCaptureWithData;
