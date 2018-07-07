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
// import "draft-js-static-toolbar-plugin/lib/plugin.css";
// import createToolbarPlugin from "draft-js-static-toolbar-plugin";
// import {
//   ItalicButton,
//   BoldButton,
//   UnderlineButton,
//   HeadlineThreeButton,
//   UnorderedListButton,
//   OrderedListButton
// } from "draft-js-buttons";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";

import ReactResizeDetector from "react-resize-detector";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import EditorUtils from "../../utils/editor";
import { debounce, Cancelable } from "lodash";
import { AnalyticsUtils, ApolloUtils, ErrorsUtils } from "../../utils";

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
    previousId: string;
  };
  captureId?: string;
  startingHTML?: string;
  focusOnNext?: () => void;
  focusOnPrevious?: () => void;
  handleFocus?: (focus: () => void) => void;
}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
  isHovering: boolean;
  isFocus: boolean;
}

class InputCapture extends React.Component<Props, State> {
  editor: Draft.Editor | undefined;
  saveEdit: ((text: string) => void) & Cancelable | undefined;
  numberOfOptimisticCaptures: number = 0;
  hashtagPlugin = createHashtagPlugin();
  linkifyPlugin = createLinkifyPlugin();
  // toolbarPlugin = createToolbarPlugin({
  //   structure: [
  //     ItalicButton,
  //     BoldButton,
  //     UnderlineButton,
  //     HeadlineThreeButton,
  //     UnorderedListButton,
  //     OrderedListButton
  //   ]
  // });
  markdownPlugin = createMarkdownShortcutsPlugin();
  plugins = [
    this.linkifyPlugin,
    this.hashtagPlugin,
    this.markdownPlugin /* this.toolbarPlugin */
  ];
  // Toolbar = this.toolbarPlugin.Toolbar;

  constructor(props: Props) {
    super(props);

    this.props.handleFocus && this.props.handleFocus(this.handleFocus);

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
                ErrorsUtils.errorHandler.report(err.message, err.stack);
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

  createCapture = (editorState: Draft.EditorState) => {
    let { match } = this.props;
    const body = convertToHTML(editorState.getCurrentContent());

    this.props
      .createCapture({
        variables: {
          body
        }
      })
      .then(res => {
        const id = res.data.createCapture.id;
        AnalyticsUtils.trackEvent({
          category: match.params["id"]
            ? AnalyticsUtils.Categories.Session
            : AnalyticsUtils.Categories.Home,
          action: AnalyticsUtils.Actions.CreateCapture,
          label: id
        });
      })
      .catch(err => {
        ErrorsUtils.errorHandler.report(err.message, err.stack);
      });
  };

  createSessionCapture = (editorState: Draft.EditorState) => {
    const { sessionData, location } = this.props;
    const body = convertToHTML(editorState.getCurrentContent());

    if (!sessionData) {
      return;
    }

    this.props
      .createSessionCapture({
        variables: {
          sessionId: sessionData.sessionId,
          previousId: sessionData.previousId,
          body
        },
        optimisticResponse: {
          createCapture: {
            __typename: "Node",
            id: `${(this.numberOfOptimisticCaptures =
              this.numberOfOptimisticCaptures + 1)}:optimistic`,
            type: NodeType.Capture,
            text: body,
            parents: [
              {
                __typename: "Session",
                id: sessionData.sessionId,
                title: "",
                created: Date.now()
              }
            ]
          } as NodeFieldsFragment
        },
        refetchQueries: ApolloUtils.getCreateSessionCaptureRefetchQueries(
          location.pathname,
          location.search,
          sessionData.sessionId
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
        ErrorsUtils.errorHandler.report(err.message, err.stack);
      });
  };

  focusIsBeginning = (editorState: Draft.EditorState) => {
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const focusKey = selectionState.getFocusKey();
    const offset = selectionState.getFocusOffset();
    return focusKey === startKey && offset === 0;
  };

  focusIsEnd = (editorState: Draft.EditorState) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const lastBlock = contentState.getLastBlock();
    const lastKey = lastBlock.getKey();
    const lastBlockLength = lastBlock.getLength();
    const focusKey = selectionState.getFocusKey();
    const offset = selectionState.getFocusOffset();
    return focusKey === lastKey && lastBlockLength === offset;
  };

  handleKeyBindings = (e: React.KeyboardEvent<{}>) => {
    const keyCode = e.keyCode;

    if (keyCode === 13 /* Enter */) {
      if (e.nativeEvent.shiftKey) {
        return "new-line";
      } else {
        return "create-capture";
      }
    }

    return Draft.getDefaultKeyBinding(e);
  };

  handleOnChange = (editorState: Draft.EditorState) => {
    // const currentSelectionState = editorState.getSelection();
    // console.log(currentSelectionState);
    const currentContent = this.state.editorState.getCurrentContent();
    const newContent = editorState.getCurrentContent();
    if (currentContent !== newContent) {
      this.saveEdit && this.saveEdit(convertToHTML(newContent));
    }
    this.setState({
      editorState
    });
  };

  handleCreateCapture = (editorState: Draft.EditorState) => {
    const { sessionData, captureId } = this.props;
    const content = editorState.getCurrentContent();
    const plainText = content.getPlainText();

    // TODO: navigate to next capture in the list
    if (captureId) {
      this.props.focusOnNext && this.props.focusOnNext();
      return "handled";
    }

    if (!plainText) {
      return "handled";
    }

    if (sessionData) {
      this.createSessionCapture(editorState);
    } else {
      this.createCapture(editorState);
    }

    // Clean this for next input
    let cleanEditorState = EditorUtils.cleanEditorState(editorState);

    this.setState({
      editorState: cleanEditorState
    });

    return "handled";
  };

  handleNewLine = (editorState: Draft.EditorState) => {
    let newEditorState = Draft.RichUtils.insertSoftNewline(editorState);
    this.setState({ editorState: newEditorState });
  };

  handleFocus = () => {
    this.editor && this.editor.focus();
  };

  render() {
    const { sessionData, match, captureId } = this.props;
    const { editorWidth } = this.state;

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
        {/* {this.state.isFocus && (
          <div className={`absolute relative top--2 left--1 w-100`}>
            <div className={`flex absolute top--1 left-0`}>
              <this.Toolbar />
            </div>
          </div>
        )} */}
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
              width: `${editorWidth}px`
            }}
            onKeyDown={e => {
              const keyCode = e.keyCode;
              if (keyCode === 38 || keyCode === 37 /* Up or Left Arrow */) {
                if (this.focusIsBeginning(this.state.editorState)) {
                  this.props.focusOnPrevious && this.props.focusOnPrevious();
                }
              }
              if (keyCode === 40 || keyCode === 39 /* Right or Down Arrow */) {
                if (this.focusIsEnd(this.state.editorState)) {
                  this.props.focusOnNext && this.props.focusOnNext();
                }
              }
            }}
          >
            <Editor
              ref={editor => {
                this.editor = editor;
              }}
              plugins={this.plugins}
              editorState={this.state.editorState}
              onChange={this.handleOnChange}
              handleKeyCommand={(
                command:
                  | Draft.DraftEditorCommand
                  | "new-line"
                  | "create-capture"
                  | "previous",
                editorState: Draft.EditorState
              ) => {
                if (command === "new-line") {
                  this.handleNewLine(editorState);
                  return "handled";
                }

                if (command === "previous") {
                  this.props.focusOnPrevious && this.props.focusOnPrevious();
                  return "handled";
                }

                if (command === "create-capture") {
                  this.handleCreateCapture(editorState);
                  return "handled";
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
                    category: match.params["id"]
                      ? AnalyticsUtils.Categories.Session
                      : AnalyticsUtils.Categories.Home,
                    action: sessionData
                      ? AnalyticsUtils.Actions.EditSessionCapture
                      : AnalyticsUtils.Actions.EditCapture,
                    label: captureId
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
