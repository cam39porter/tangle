// React
import * as React from "react";

// Components
import * as Draft from "draft-js";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";

const TIME_TO_SAVE = 100; // ms

interface Props {
  startingTags?: Array<string>;
  handleEdit: (tags: string) => void;
}

interface State {
  editorState: Draft.EditorState;
}

class ListSessionTags extends React.Component<Props, State> {
  saveTimer;

  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    let startingText: string | undefined;
    if (props.startingTags) {
      props.startingTags.forEach(tag => {
        startingText = startingText ? startingText + `#${tag} ` : `#${tag} `;
      });
    }
    if (startingText) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(startingText)
      );
    }

    this.state = {
      editorState
    };
  }

  handleOnChange = (editorState: Draft.EditorState) => {
    const currentContent = this.state.editorState.getCurrentContent();
    const newContent = editorState.getCurrentContent();

    // Content has changed
    if (currentContent !== newContent) {
      // set timeout to capture after a given amount of time of no changes
      this.saveTimer && clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(
        this.props.handleEdit(convertToHTML(newContent)),
        TIME_TO_SAVE
      );
    }
    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div className={`f5`}>
        <Draft.Editor
          editorState={this.state.editorState}
          onChange={this.handleOnChange}
          placeholder={`Tags like #todo #ideas`}
        />
      </div>
    );
  }
}

export default ListSessionTags;
