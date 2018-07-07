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
  sessionId?: string;
  captureId?: string;
  startingText?: string;
  previousId?: string;
  focusOnNext?: () => void;
  focusOnPrevious?: () => void;
  handleFocus?: (focus: () => void) => void;
}

interface State {
  isShowingButtons: boolean;
}

class CardCapture extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isShowingButtons: false
    };
  }

  render() {
    const { captureId, startingText, sessionId } = this.props;
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
      >
        <div
          id={`list-capture`}
          className={`relative flex flex-wrap pa3 w-100 br4 ba bw1 b--light-gray
          } bg-white`}
        >
          <div className={`flex-grow dt`}>
            <div
              className={`dtc v-mid`}
              style={{
                cursor: "text"
              }}
            >
              <InputCapture
                handleFocus={this.props.handleFocus}
                focusOnNext={this.props.focusOnNext}
                focusOnPrevious={this.props.focusOnPrevious}
                sessionData={sessionId ? { sessionId } : undefined}
                captureId={captureId}
                startingHTML={startingText}
              />
            </div>
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
