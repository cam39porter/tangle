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
  NodeFieldsFragment
} from "../../__generated__/types";
import {
  createSessionCapture,
  createCapture,
  editCapture
} from "../../queries";
import { graphql, compose, MutationFunc, withApollo } from "react-apollo";

// Components
import "draft-js/dist/Draft.css";
import * as Draft from "draft-js";
import Editor from "draft-js-plugins-editor";
import "draft-js-hashtag-plugin/lib/plugin.css";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import "draft-js-linkify-plugin/lib/plugin.css";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import "draft-js-static-toolbar-plugin/lib/plugin.css";
const toolbarStyles = require("../../css/draft-toolbar.css");
import createToolbarPlugin from "draft-js-static-toolbar-plugin";

import ReactResizeDetector from "react-resize-detector";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import EditorUtils from "../../utils/editor";
import { debounce, Cancelable } from "lodash";
import { AnalyticsUtils, ApolloUtils } from "../../utils";

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
  sessionData?: {
    sessionId: string;
    previousId?: string;
  };
  captureId?: string;
  startingHTML?: string;
}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
  isHovering: boolean;
  isFocus: boolean;
}

class InputCapture extends React.Component<Props, State> {
  saveEdit: ((text: string) => void) & Cancelable | undefined;
  numberOfOptimisticCaptures: number = 0;
  hashtagPlugin = createHashtagPlugin();
  linkifyPlugin = createLinkifyPlugin();
  toolbarPlugin = createToolbarPlugin();
  plugins = [this.linkifyPlugin, this.hashtagPlugin, this.toolbarPlugin];
  Toolbar = this.toolbarPlugin.Toolbar;

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
      isHovering: false,
      isFocus: false
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
            isHovering: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            isHovering: false
          });
        }}
      >
        {this.state.isFocus && (
          <div className={`absolute relative top--2 left--1 w-100`}>
            <div className={`flex absolute top--1 left-0`}>
              <this.Toolbar />
            </div>
          </div>
        )}
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
            <Editor
              plugins={this.plugins}
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
                    if (
                      this.props.sessionData &&
                      this.props.sessionData.previousId
                    ) {
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
                          refetchQueries: ApolloUtils.getCreateSessionCaptureRefetchQueries(
                            this.props.location.pathname,
                            this.props.location.search,
                            this.props.sessionData.sessionId
                          ),
                          update: ApolloUtils.createSessionCaptureUpdate
                        })
                        .then(res => {
                          const id = res.data.createCapture.id;
                          AnalyticsUtils.trackEvent({
                            category: AnalyticsUtils.Categories.Session,
                            action: AnalyticsUtils.Actions.CreateSessionCapture,
                            label: id
                          });
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
                        .then(res => {
                          const id = res.data.createCapture.id;
                          AnalyticsUtils.trackEvent({
                            category: this.props.match.params["id"]
                              ? AnalyticsUtils.Categories.Session
                              : AnalyticsUtils.Categories.Home,
                            action: AnalyticsUtils.Actions.CreateCapture,
                            label: id
                          });
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
              onFocus={() => {
                this.setState({
                  isFocus: true
                });
              }}
              onBlur={() => {
                this.setState({
                  isFocus: false
                });
                const content = this.state.editorState.getCurrentContent();
                const endingHtml = convertToHTML(content);
                if (this.props.startingHTML !== endingHtml) {
                  AnalyticsUtils.trackEvent({
                    category: this.props.match.params["id"]
                      ? AnalyticsUtils.Categories.Session
                      : AnalyticsUtils.Categories.Home,
                    action: this.props.sessionData
                      ? AnalyticsUtils.Actions.EditSessionCapture
                      : AnalyticsUtils.Actions.EditCapture,
                    label: this.props.captureId
                  });
                }
              }}
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
