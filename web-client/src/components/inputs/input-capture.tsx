// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL
import {
  // Create Session Capture
  createSessionCaptureMutation as createSessionCaptureResponse,
  createSessionCaptureMutationVariables,
  // Create Capture
  createCaptureMutation as createCaptureResponse,
  createCaptureMutationVariables,
  // Edit Capture
  editCaptureMutation as editCaptureResponse,
  editCaptureMutationVariables,
  // Types
  NodeType,
  // CaptureCollectionFieldsFragment,
  SessionItemCollectionFieldsFragment,
  NodeFieldsFragment,
  CaptureFieldsFragment
} from "../../__generated__/types";
import {
  graphGetRecent,
  graphSearch,
  graphGetDetailed,
  getRelatedCapturesBySession,
  createSessionCapture,
  createCapture,
  editCapture,
  // captureCollectionFragment,
  sessionItemCollectionFragment
} from "../../queries";
import { graphql, compose, MutationFunc, withApollo } from "react-apollo";

// Components
import * as Draft from "draft-js";
import ReactResizeDetector from "react-resize-detector";
// import ButtonCapture from "./button-capture";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import EditorUtils from "../../utils/editor";
import { debounce, Cancelable } from "lodash";
import { NetworkUtils } from "../../utils/index";
import config from "../../cfg";

const TIME_TO_SAVE = 500; // ms till change is automatically captured

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  createSessionCapture: MutationFunc<
    createSessionCaptureResponse,
    createSessionCaptureMutationVariables
  >;
  createCapture: MutationFunc<
    createCaptureResponse,
    createCaptureMutationVariables
  >;
  editCapture: MutationFunc<editCaptureResponse, editCaptureMutationVariables>;
  sessionData: {
    sessionId: string;
    previousId: string;
  };
  captureId?: string;
  startingHTML?: string;
}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
  isShowingCaptureButton: boolean;
}

class InputCapture extends React.Component<Props, State> {
  saveEdit: ((text: string) => void) & Cancelable | undefined;
  numberOfOptimisticCaptures: number = 0;

  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    if (props.startingHTML) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(props.startingHTML)
      );
    }

    this.saveEdit = this.props.captureId
      ? debounce(text => {
          this.props.captureId &&
            this.props
              .editCapture({
                variables: {
                  id: this.props.captureId,
                  body: text
                }
              })
              .catch(err => {
                console.error(err);
              });
        }, TIME_TO_SAVE)
      : undefined;

    this.state = {
      editorState,
      editorWidth: 0,
      isShowingCaptureButton: false
    };
  }

  handleKeyBindings = (e: React.KeyboardEvent<{}>) => {
    if (e.key === "Enter" && Draft.KeyBindingUtil.hasCommandModifier(e)) {
      return "command-return";
    }

    return Draft.getDefaultKeyBinding(e);
  };

  handleOnChange = (editorState: Draft.EditorState) => {
    const currentContent = this.state.editorState.getCurrentContent();
    const newContent = editorState.getCurrentContent();

    // Content has changed
    if (currentContent !== newContent) {
      this.saveEdit && this.saveEdit(convertToHTML(newContent));
    }

    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div
        className={`relative flex w-100`}
        onMouseEnter={() => {
          this.setState({
            isShowingCaptureButton: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            isShowingCaptureButton: false
          });
        }}
      >
        <div className={`flex-grow`}>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(width, _) => {
              this.setState({
                editorWidth: width
              });
            }}
          />
          <div
            className={`f6 lh-copy`}
            style={{
              width: `${this.state.editorWidth}px`
            }}
          >
            <Draft.Editor
              editorState={this.state.editorState}
              onChange={this.handleOnChange}
              handleKeyCommand={(
                command: Draft.DraftEditorCommand | "command-return",
                editorState: Draft.EditorState
              ) => {
                if (command === "command-return") {
                  let content = editorState.getCurrentContent();
                  if (!this.props.captureId && content.getPlainText()) {
                    let body = convertToHTML(content);
                    if (this.props.sessionData) {
                      let refetchQueries;
                      const location = this.props.location.pathname.replace(
                        this.props.match.url,
                        ""
                      );
                      switch (location) {
                        case "/search":
                          refetchQueries = [
                            {
                              query: graphSearch,
                              variables: {
                                rawQuery: NetworkUtils.getQuery(
                                  this.props.location.search
                                ),
                                start: 0,
                                count: config.resultCount
                              }
                            }
                          ];
                          break;
                        case "/recent":
                          refetchQueries = [
                            {
                              query: graphGetRecent,
                              variables: {
                                start: 0,
                                count: config.resultCount
                              }
                            }
                          ];
                          break;
                        default:
                          refetchQueries = [
                            {
                              query: getRelatedCapturesBySession,
                              variables: {
                                sessionId: this.props.sessionData.sessionId,
                                pagingInfo: null,
                                count: config.resultCount
                              }
                            },
                            {
                              query: graphGetDetailed,
                              variables: {
                                id: this.props.sessionData.sessionId
                              }
                            }
                          ];
                      }

                      this.props
                        .createSessionCapture({
                          variables: {
                            sessionId: this.props.sessionData.sessionId,
                            previousCaptureId: this.props.sessionData
                              .previousId,
                            body
                          },
                          optimisticResponse: {
                            createCapture: {
                              __typename: "Node",
                              id: `${(this.numberOfOptimisticCaptures =
                                this.numberOfOptimisticCaptures +
                                1)}:optimistic`,
                              type: NodeType.Capture,
                              text: body,
                              level: 0
                            } as NodeFieldsFragment
                          },
                          refetchQueries: refetchQueries,
                          update: (store, { data }) => {
                            let captureNode =
                              data &&
                              (data["createCapture"] as NodeFieldsFragment);

                            if (!captureNode) {
                              return;
                            }

                            const captureItem = {
                              __typename: "Capture",
                              id: captureNode.id,
                              created: 0,
                              body: captureNode.text || ""
                            } as CaptureFieldsFragment;

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
                              sessionItemCollection.items.push(captureItem);
                              store.writeFragment({
                                id: "SessionItemCollection",
                                fragment: sessionItemCollectionFragment,
                                fragmentName: "SessionItemCollectionFields",
                                data: {
                                  __typename: "SessionItemCollection",
                                  items: sessionItemCollection.items,
                                  pagingInfo: sessionItemCollection.pagingInfo
                                }
                              });
                            }
                          }
                        })
                        .catch(err => {
                          console.error(err);
                        });
                    } else {
                      this.props
                        .createCapture({
                          variables: {
                            body
                          }
                        })
                        .catch(err => {
                          console.error(err);
                        });
                    }

                    let cleanEditorState = EditorUtils.cleanEditorState(
                      editorState
                    );

                    this.setState({
                      editorState: cleanEditorState
                    });

                    return "handled";
                  }
                }

                const newState = Draft.RichUtils.handleKeyCommand(
                  editorState,
                  command
                );

                if (newState) {
                  this.handleOnChange(newState);
                  return "handled";
                }
                return "not-handled";
              }}
              keyBindingFn={this.handleKeyBindings}
              placeholder={`Capture a thought...`}
              spellCheck={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

const withCreateSessionCapture = graphql<createSessionCaptureResponse, Props>(
  createSessionCapture,
  {
    name: "createSessionCapture",
    alias: "withCreateSessionCapture"
  }
);

const withCreateCapture = graphql<createCaptureResponse, Props>(createCapture, {
  name: "createCapture",
  alias: "withCreateCapture"
});

const withEditCapture = graphql<editCaptureResponse, Props>(editCapture, {
  name: "editCapture",
  alias: "withEditCapture"
});

const InputCaptureWithData = compose(
  withRouter,
  withCreateSessionCapture,
  withCreateCapture,
  withEditCapture,
  withApollo
)(InputCapture);

export default InputCaptureWithData;
