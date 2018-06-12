// React
import * as React from "react";

// Components
import ReactTooltip from "react-tooltip";
import * as Draft from "draft-js";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import EditorUtils from "../utils/editor";
import { debounce, Cancelable } from "lodash";

const TIME_TO_SAVE = 500; // ms till change is automatically captured

interface Props {
  handleCapture?: (text: string) => void;
  handleEdit?: (text: string) => void;
  startingHTML?: string;
}

interface State {
  editorState: Draft.EditorState;
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

    this.saveEdit =
      this.props.handleEdit && debounce(this.props.handleEdit, TIME_TO_SAVE);

    this.state = {
      editorState
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
      <div className={`flex w-100`}>
        <div className={`flex-grow`}>
          <div className={`f6 lh-copy`}>
            <Draft.Editor
              editorState={this.state.editorState}
              onChange={this.handleOnChange}
              handleKeyCommand={(
                command: Draft.DraftEditorCommand | "command-return",
                editorState: Draft.EditorState
              ) => {
                if (command === "command-return") {
                  if (this.props.handleCapture) {
                    console.log("here");
                    this.props.handleCapture(
                      convertToHTML(editorState.getCurrentContent())
                    );

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
        <ReactTooltip />
      </div>
    );
  }
}

export default InputCapture;
