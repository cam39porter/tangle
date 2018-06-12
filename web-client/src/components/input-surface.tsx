// React
import * as React from "react";

// Components
import * as Draft from "draft-js";

// Utils
import { convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import ReactResizeDetector from "react-resize-detector";

interface Props {
  handleSurface: (text: string) => void;
  startingHTML?: string;
}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
}

class InputSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    if (props.startingHTML) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(props.startingHTML)
      );
    }

    this.state = {
      editorState,
      editorWidth: 0
    };
  }

  handleOnChange = (editorState: Draft.EditorState) => {
    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div className={`w-100 flex`}>
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
              placeholder={`Search your tangle...`}
              handleReturn={(_, editorState) => {
                this.props.handleSurface(
                  editorState.getCurrentContent().getPlainText()
                );
                return "handled";
              }}
              spellCheck={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default InputSurface;
