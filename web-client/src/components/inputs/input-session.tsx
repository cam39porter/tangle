// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL
import {
  editSessionMutation as editSessionResponse,
  editSessionMutationVariables
} from "../../__generated__/types";
import { editSession } from "../../queries";
import { graphql, compose, MutationFunc, withApollo } from "react-apollo";

// Components
import "draft-js/dist/Draft.css";
import * as Draft from "draft-js";
import Editor from "draft-js-plugins-editor";
import "draft-js-hashtag-plugin/lib/plugin.css";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import "draft-js-linkify-plugin/lib/plugin.css";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";

import ReactResizeDetector from "react-resize-detector";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import { debounce, Cancelable } from "lodash";
import { AnalyticsUtils, ApolloUtils, ErrorsUtils } from "../../utils";

const TIME_TO_SAVE = 500; // ms till change is automatically captured
const MAX_LENGTH_SESSION = 500000; // character / 1 MB
const MAX_LENGTH_TITLE = 200; // characters

// Types
interface RouteProps extends RouteComponentProps<{}> {}
interface Props extends RouteProps {
  editSession: MutationFunc<editSessionResponse, editSessionMutationVariables>;
  sessionId: string;
  startingHtml: string;
  startingTitle: string;
  handleFocus?: (focus: () => void) => void;
  handleIsSaving: (isSavingNow: boolean) => void;
}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
  editorHeight: number;
  title: string;
}

class InputSession extends React.Component<Props, State> {
  editor: Draft.Editor | undefined;
  saveEdit: ((body: string, title: string) => void) & Cancelable | undefined;
  numberOfOptimisticCaptures: number = 0;
  hashtagPlugin = createHashtagPlugin();
  linkifyPlugin = createLinkifyPlugin({
    component: props => {
      const { href, children, className } = props;
      return (
        <a
          href={href}
          className={className}
          onClick={() => {
            window.open(href, "_blank");
          }}
        >
          {children}
        </a>
      );
    }
  });
  markdownPlugin = createMarkdownShortcutsPlugin();
  plugins = [
    this.linkifyPlugin,
    this.hashtagPlugin,
    this.markdownPlugin /* this.toolbarPlugin */
  ];

  constructor(props: Props) {
    super(props);

    this.props.handleFocus && this.props.handleFocus(this.handleFocus);

    let editorState = Draft.EditorState.createEmpty();

    if (props.startingHtml) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(props.startingHtml)
      );
    }

    this.saveEdit = debounce((body, title) => {
      this.props
        .editSession({
          variables: {
            sessionId: props.sessionId,
            body: body,
            title: title
          },
          refetchQueries: ApolloUtils.updateCaptureRefetchQueries(
            location.pathname,
            location.search,
            props.sessionId
          )
        })
        .then(() => {
          this.props.handleIsSaving(false);
        })
        .catch(err => {
          ErrorsUtils.errorHandler.report(err.message, err.stack);
        });
    }, TIME_TO_SAVE);

    this.state = {
      editorState,
      editorWidth: 0,
      editorHeight: 0,
      title: props.startingTitle || ""
    };
  }

  handleKeyBindings = (e: React.KeyboardEvent<{}>) => {
    return Draft.getDefaultKeyBinding(e);
  };

  handleTitleChange = e => {
    const newTitle = e.target.value;

    if (newTitle.length >= MAX_LENGTH_TITLE) {
      return;
    }

    // Content has changed
    if (newTitle !== this.state.title) {
      const body = convertToHTML(this.state.editorState.getCurrentContent());
      this.props.handleIsSaving(true);
      this.saveEdit && this.saveEdit(body, newTitle);
    }

    this.setState({
      title: newTitle
    });
  };

  handleBodyChange = (editorState: Draft.EditorState) => {
    const currentContent = this.state.editorState.getCurrentContent();
    const newContent = editorState.getCurrentContent();
    if (currentContent !== newContent) {
      this.props.handleIsSaving(true);

      this.saveEdit &&
        this.saveEdit(convertToHTML(newContent), this.state.title);
    }
    this.setState({
      editorState
    });
  };

  handleFocus = () => {
    this.editor && this.editor.focus();
  };

  getLengthOfSelectedText = () => {
    const currentSelection = this.state.editorState.getSelection();
    const isCollapsed = currentSelection.isCollapsed();

    let length = 0;

    if (!isCollapsed) {
      const currentContent = this.state.editorState.getCurrentContent();
      const startKey = currentSelection.getStartKey();
      const endKey = currentSelection.getEndKey();
      const startBlock = currentContent.getBlockForKey(startKey);
      const isStartAndEndBlockAreTheSame = startKey === endKey;
      const startBlockTextLength = startBlock.getLength();
      const startSelectedTextLength =
        startBlockTextLength - currentSelection.getStartOffset();
      const endSelectedTextLength = currentSelection.getEndOffset();
      const keyAfterEnd = currentContent.getKeyAfter(endKey);
      if (isStartAndEndBlockAreTheSame) {
        length +=
          currentSelection.getEndOffset() - currentSelection.getStartOffset();
      } else {
        let currentKey = startKey;

        while (currentKey && currentKey !== keyAfterEnd) {
          if (currentKey === startKey) {
            length += startSelectedTextLength + 1;
          } else if (currentKey === endKey) {
            length += endSelectedTextLength;
          } else {
            length += currentContent.getBlockForKey(currentKey).getLength() + 1;
          }

          currentKey = currentContent.getKeyAfter(currentKey);
        }
      }
    }

    return length;
  };

  handleBeforeInput = () => {
    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText("").length;
    const selectedTextLength = this.getLengthOfSelectedText();

    if (currentContentLength - selectedTextLength > MAX_LENGTH_SESSION - 1) {
      return "handled";
    }

    return "not-handled";
  };

  handlePastedText = pastedText => {
    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText("").length;
    const selectedTextLength = this.getLengthOfSelectedText();

    if (
      currentContentLength + pastedText.length - selectedTextLength >
      MAX_LENGTH_SESSION
    ) {
      return "handled";
    }

    return "not-handled";
  };

  render() {
    const { sessionId } = this.props;
    const { editorWidth, editorHeight, title } = this.state;

    return (
      <div className={`relative flex-grow flex-column pa3 br4 bg-editor-gray`}>
        <div>
          <input
            value={title}
            type="text"
            className={`w-90 pb3 f4 fw3 accent overflow-hidden`}
            onChange={this.handleTitleChange}
            onBlur={() => {
              const endingTitle = title;
              if (this.props.startingTitle !== endingTitle) {
                AnalyticsUtils.trackEvent({
                  category: AnalyticsUtils.Categories.Session,
                  action: AnalyticsUtils.Actions.EditSessionTitle,
                  label: this.props.sessionId
                });
              }
            }}
            placeholder={`Title`}
            maxLength={MAX_LENGTH_TITLE}
          />
        </div>
        <div className={`flex-grow overflow-auto`}>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(width, height) => {
              this.setState({
                editorWidth: width,
                editorHeight: height
              });
            }}
          />
          <div
            className={`editor f6 fw2 lh-copy`}
            style={{
              height: `${editorHeight}px`,
              width: `${editorWidth}px`
            }}
          >
            <Editor
              ref={editor => {
                this.editor = editor;
              }}
              plugins={this.plugins}
              editorState={this.state.editorState}
              onChange={this.handleBodyChange}
              handleKeyCommand={(
                command: Draft.DraftEditorCommand,
                editorState: Draft.EditorState
              ) => {
                const newState = Draft.RichUtils.handleKeyCommand(
                  editorState,
                  command
                );

                if (newState) {
                  this.handleBodyChange(newState);
                  return "handled";
                }

                return "not-handled";
              }}
              keyBindingFn={this.handleKeyBindings}
              placeholder={`Capture a thought...`}
              onBlur={() => {
                const content = this.state.editorState.getCurrentContent();
                const endingHtml = convertToHTML(content);
                if (this.props.startingHtml !== endingHtml) {
                  AnalyticsUtils.trackEvent({
                    category: AnalyticsUtils.Categories.Session,
                    action: AnalyticsUtils.Actions.EditSessionBody,
                    label: sessionId
                  });
                }
              }}
              handleBeforeInput={this.handleBeforeInput}
              handlePastedText={this.handlePastedText}
              spellCheck={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

const withEditSession = graphql<editSessionResponse, Props>(editSession, {
  name: "editSession",
  alias: "withEditSession"
});

export default compose(
  withRouter,
  withApollo,
  withEditSession
)(InputSession);
