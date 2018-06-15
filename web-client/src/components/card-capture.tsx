// React
import * as React from "react";

// GraphQL
import {
  // Archive Capture
  archiveCaptureMutation as archiveCaptureResponse,
  archiveCaptureMutationVariables,
  // Edit Capture
  editCaptureMutation as editCaptureResponse,
  editCaptureMutationVariables
} from "../__generated__/types";

import { graphql, compose, MutationFunc } from "react-apollo";

import { archiveCapture, editCapture } from "../queries";

// Components
import ButtonArchive from "./button-archive";
import InputCapture from "./input-capture";

// Utils

// Types
interface Props {
  archiveCapture: MutationFunc<
    archiveCaptureResponse,
    archiveCaptureMutationVariables
  >;
  editCapture: MutationFunc<editCaptureResponse, editCaptureMutationVariables>;
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
                captureId={this.props.captureId}
                startingHTML={this.props.startingText}
              />
            </div>
          </div>
          {this.state.isShowingButtons && (
            <div
              className={`absolute flex top--1 right-0 h2 ph2 br4 shadow-1 z-max bg-white gray`}
            >
              <div className={`w2`}>
                <div>
                  <ButtonArchive
                    onClick={() => {
                      this.props
                        .archiveCapture({
                          variables: { id: this.props.captureId }
                        })
                        .catch(err => console.error(err));
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const withArchiveCapture = graphql<archiveCaptureResponse, Props>(
  archiveCapture,
  {
    name: "archiveCapture",
    alias: "withArchiveCapture"
  }
);

const withEditCapture = graphql<editCaptureResponse, Props>(editCapture, {
  name: "editCapture",
  alias: "withEditCapture"
});

const CardCaptureWithData = compose(
  withEditCapture,
  withArchiveCapture
)(CardCapture);

export default CardCaptureWithData;
