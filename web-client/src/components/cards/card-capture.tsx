// React
import * as React from "react";

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

// Utils
import { ApolloUtils, AnalyticsUtils, ErrorsUtils } from "../../utils/index";

// Types
interface Props {
  deleteCapture: MutationFunc<
    deleteCaptureResponse,
    deleteCaptureMutationVariables
  >;
  sessionParents?: Array<{
    __typename: "Session";
    id: string;
    title: string | null;
    created: number;
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
      isFocus: false,
      isShowingButtons: false
    };
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
        {sessionParents &&
          sessionParents.length && (
            <div className={`pa2 h2 gray f6 pointer dim`}>
              {sessionParents[0].title}
            </div>
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
                            type: NodeType.Capture,
                            text: null,
                            level: null
                          }
                        },
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

const CardCaptureWithData = compose(withArchiveCapture)(CardCapture);

export default CardCaptureWithData;
