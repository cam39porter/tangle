// React
import * as React from "react";

// GraphQL
import {
  // Archive Capture
  archiveCaptureMutation as archiveCaptureResponse,
  archiveCaptureMutationVariables,
  // Edit Capture
  editCaptureMutation as editCaptureResponse,
  editCaptureMutationVariables,
  // Types
  NodeType,
  CaptureCollectionFieldsFragment,
  SessionItemCollectionFieldsFragment,
  SurfaceResultsFieldsFragment
} from "../../__generated__/types";

import { graphql, compose, MutationFunc } from "react-apollo";

import {
  archiveCapture,
  editCapture,
  captureCollectionFragment,
  sessionItemCollectionFragment,
  surfaceResultsFragment
} from "../../queries";

// Components
import ButtonArchive from "./../buttons/button-archive";
import InputCapture from "../inputs/input-capture";

// Utils
import { remove } from "lodash";

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
                captureId={this.props.captureId}
                startingHTML={this.props.startingText}
              />
            </div>
          </div>
          {this.state.isShowingButtons && (
            <div
              className={`absolute flex top--1 right-0 h2 ph2 br4 shadow-1 z-7 bg-white gray`}
            >
              <div
                className={`w2`}
                onClick={e => {
                  e.stopPropagation();

                  this.props
                    .archiveCapture({
                      variables: { id: this.props.captureId },
                      optimisticResponse: {
                        archiveCapture: {
                          __typename: "Node",
                          id: this.props.captureId,
                          type: NodeType.Capture,
                          text: null,
                          level: null
                        }
                      },
                      update: store => {
                        // Capture Collection
                        let captureCollection: CaptureCollectionFieldsFragment | null = store.readFragment(
                          {
                            id: "CaptureCollection",
                            fragment: captureCollectionFragment,
                            fragmentName: "CaptureCollectionFields"
                          }
                        );
                        if (captureCollection) {
                          store.writeFragment({
                            id: "CaptureCollection",
                            fragment: captureCollectionFragment,
                            fragmentName: "CaptureCollectionFields",
                            data: {
                              __typename: "CaptureCollection",
                              items: captureCollection.items.filter(
                                capture => capture.id !== this.props.captureId
                              ),
                              pagingInfo: captureCollection.pagingInfo
                            }
                          });
                        }

                        // SessionItemsCollection
                        let sessionItemCollection: SessionItemCollectionFieldsFragment | null = store.readFragment(
                          {
                            id: "SessionItemCollection",
                            fragment: sessionItemCollectionFragment,
                            fragmentName: "SessionItemCollectionFields"
                          }
                        );
                        if (
                          sessionItemCollection &&
                          sessionItemCollection.items
                        ) {
                          store.writeFragment({
                            id: "SessionItemCollection",
                            fragment: sessionItemCollectionFragment,
                            fragmentName: "SessionItemCollectionFields",
                            data: {
                              __typename: "SessionItemCollection",
                              items: sessionItemCollection.items.filter(
                                capture => capture.id !== this.props.captureId
                              ),
                              pagingInfo: sessionItemCollection.pagingInfo
                            }
                          });
                        }

                        // SurfaceResults
                        const surfaceResults: SurfaceResultsFieldsFragment | null = store.readFragment(
                          {
                            id: "SurfaceResults",
                            fragment: surfaceResultsFragment,
                            fragmentName: "SurfaceResultsFields"
                          }
                        );
                        if (surfaceResults && surfaceResults.graph) {
                          remove(
                            surfaceResults.graph.nodes,
                            node => node.id === this.props.captureId
                          );
                          remove(
                            surfaceResults.graph.edges,
                            edge =>
                              edge.source === this.props.captureId ||
                              edge.destination === this.props.captureId
                          );
                          store.writeFragment({
                            id: "SurfaceResults",
                            fragment: surfaceResultsFragment,
                            fragmentName: "SurfaceResultsFields",
                            data: {
                              __typename: "SurfaceResults",
                              ...surfaceResults
                            }
                          });
                        }
                      }
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
