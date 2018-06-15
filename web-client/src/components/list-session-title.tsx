// React
import * as React from "react";

// Components
import * as Draft from "draft-js";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import { debounce, Cancelable } from "lodash";
import ReactResizeDetector from "react-resize-detector";

const TIME_TO_SAVE = 500; // ms

interface Props {
  startingTitle?: string;
  handleEdit: (title: string) => void;
}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
}

class ListSessionTitle extends React.Component<Props, State> {
  saveEdit: ((text: string) => void) & Cancelable | undefined;

  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    if (props.startingTitle) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(props.startingTitle)
      );
    }

    this.saveEdit =
      this.props.handleEdit && debounce(this.props.handleEdit, TIME_TO_SAVE);

    this.state = {
      editorState,
      editorWidth: 0
    };
  }

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
      <div className={``}>
        <ReactResizeDetector
          handleHeight={true}
          onResize={(width, _) => {
            this.setState({
              editorWidth: width
            });
          }}
        />
        <div
          className={`f4`}
          style={{
            width: `${this.state.editorWidth}px`
          }}
        >
          <Draft.Editor
            editorState={this.state.editorState}
            onChange={this.handleOnChange}
            placeholder={`Brainstorm title`}
          />
        </div>
      </div>
    );
  }
}

export default ListSessionTitle;
