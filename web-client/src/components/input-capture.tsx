// React
import * as React from "react";

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
  editCaptureMutationVariables
} from "../__generated__/types";
import { createSessionCapture, createCapture, editCapture } from "../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components
import * as Draft from "draft-js";
import ReactResizeDetector from "react-resize-detector";
// import ButtonCapture from "./button-capture";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import EditorUtils from "../utils/editor";
import { debounce, Cancelable } from "lodash";

const TIME_TO_SAVE = 500; // ms till change is automatically captured

interface Props {
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
        {/* {!this.props.captureId && (
          <div className={`absolute flex top--2 right--2 br-100 z-max gray`}>
            <ButtonCapture
              onClick={() => {
                if (this.props.sessionData) {
                  this.props.createSessionCapture({
                    variables: {
                      sessionId: this.props.sessionData.sessionId,
                      previousCaptureId: this.props.sessionData.previousId,
                      body: convertToHTML(
                        this.state.editorState.getCurrentContent()
                      )
                    }
                  });
                }
                {
                  this.props.createCapture({
                    variables: {
                      body: convertToHTML(
                        this.state.editorState.getCurrentContent()
                      )
                    }
                  });
                }

                let cleanEditorState = EditorUtils.cleanEditorState(
                  this.state.editorState
                );

                this.setState({
                  editorState: cleanEditorState
                });
              }}
            />
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
                  if (!this.props.captureId) {
                    if (this.props.sessionData) {
                      this.props.createSessionCapture({
                        variables: {
                          sessionId: this.props.sessionData.sessionId,
                          previousCaptureId: this.props.sessionData.previousId,
                          body: convertToHTML(
                            convertToHTML(editorState.getCurrentContent())
                          )
                        }
                      });
                    }
                    {
                      this.props.createCapture({
                        variables: {
                          body: convertToHTML(
                            convertToHTML(editorState.getCurrentContent())
                          )
                        }
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
  withCreateSessionCapture,
  withCreateCapture,
  withEditCapture
)(InputCapture);

export default InputCaptureWithData;
