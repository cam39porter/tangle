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
import { ApolloUtils, AnalyticsUtils } from "../../utils/index";

// Types
interface Props {
  deleteCapture: MutationFunc<
    deleteCaptureResponse,
    deleteCaptureMutationVariables
  >;
  sessionId?: string;
  captureId: string;
  startingText: string;
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
    return (
      <div
        key={this.props.captureId}
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
                sessionData={
                  this.props.sessionId
                    ? { sessionId: this.props.sessionId }
                    : undefined
                }
                captureId={this.props.captureId}
                startingHTML={this.props.startingText}
              />
            </div>
          </div>
          {this.state.isShowingButtons && (
            <div
              className={`absolute flex top--1 right-0 br4 ba b--light-gray bg-white`}
            >
              <div
                className={`flex-column justify-around pa2 pointer`}
                onClick={e => {
                  e.stopPropagation();

                  this.props
                    .deleteCapture({
                      variables: { id: this.props.captureId },
                      optimisticResponse: {
                        deleteCapture: {
                          __typename: "Node",
                          id: this.props.captureId,
                          type: NodeType.Capture,
                          text: null,
                          level: null
                        }
                      },
                      update: ApolloUtils.deleteCaptureUpdate(
                        this.props.captureId
                      )
                    })
                    .then(() => {
                      AnalyticsUtils.trackEvent({
                        category: this.props.sessionId
                          ? AnalyticsUtils.Categories.Session
                          : AnalyticsUtils.Categories.Home,
                        action: this.props.sessionId
                          ? AnalyticsUtils.Actions.DeleteSessionCapture
                          : AnalyticsUtils.Actions.DeleteCapture,
                        label: this.props.captureId
                      });
                    })
                    .catch(err => console.error(err));
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
