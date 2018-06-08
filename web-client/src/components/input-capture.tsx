// React
import * as React from "react";

// Components
import ReactTooltip from "react-tooltip";
import * as Draft from "draft-js";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";

const TIME_TO_AUTO_CAPTURE_EDIT = 500; // ms till change is automatically captured

interface Props {
  handleOnChange: (text: string) => void;
  handleCapture?: () => void;
  handleEdit?: () => void;
  startingHTML?: string;
}

interface State {
  editorState: Draft.EditorState;
}

class InputCapture extends React.Component<Props, State> {
  captureTimer;

  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    if (this.props.startingHTML) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(this.props.startingHTML)
      );
    }

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
      // inform parent components of content change
      this.props.handleOnChange(convertToHTML(newContent));

      // set timeout to capture after a given amount of time of no changes
      this.captureTimer && clearTimeout(this.captureTimer);
      this.captureTimer = setTimeout(
        this.props.handleEdit,
        TIME_TO_AUTO_CAPTURE_EDIT
      );
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
                    this.props.handleCapture();
                    this.setState({
                      editorState: Draft.EditorState.createEmpty()
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
