// React
import * as React from "react";

// Components
import * as Draft from "draft-js";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";

const TIME_TO_SAVE = 100; // ms

interface Props {
  startingTitle?: string;
  handleOnChange: (title: string) => void;
}

interface State {
  editorState: Draft.EditorState;
}

class ListSessionTitle extends React.Component<Props, State> {
  saveTimer;

  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    if (props.startingTitle) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(props.startingTitle)
      );
    }

    this.state = {
      editorState
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.startingTitle !== nextProps.startingTitle) {
      this.setState({
        editorState: Draft.EditorState.createWithContent(
          convertFromHTML(nextProps.startingTitle)
        )
      });
    }
  }

  handleOnChange = (editorState: Draft.EditorState) => {
    const currentContent = this.state.editorState.getCurrentContent();
    const newContent = editorState.getCurrentContent();

    // Content has changed
    if (currentContent !== newContent) {
      // set timeout to capture after a given amount of time of no changes
      this.saveTimer && clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(
        this.props.handleOnChange(convertToHTML(newContent)),
        TIME_TO_SAVE
      );
    }

    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div className={`f3`}>
        <Draft.Editor
          editorState={this.state.editorState}
          onChange={this.handleOnChange}
          placeholder={`Brainstorm title`}
        />
      </div>
    );
  }
}

export default ListSessionTitle;
