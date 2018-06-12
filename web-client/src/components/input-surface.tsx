// React
import * as React from "react";

// Components
import * as Draft from "draft-js";
import ButtonSurface from "./button-surface";

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
      <div className={`flex pa2 bg-white br4`}>
        <div className={`flex-column`}>
          <ButtonSurface
            onClick={() => {
              this.props.handleSurface(
                this.state.editorState.getCurrentContent().getPlainText()
              );
            }}
          />
        </div>
        <div className={`flex-grow pv2`}>
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
