// React
import * as React from "react";

// Components
import * as Draft from "draft-js";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";

interface Props {
  handleEdit: () => void;
  startingTags?: Array<string>;
  handleOnChange: (tags: string) => void;
}

interface State {
  editorState: Draft.EditorState;
}

class ListSessionTags extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    let startingText: string | undefined;
    if (this.props.startingTags) {
      this.props.startingTags.forEach(tag => {
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
    // inform parent components of state
    this.props.handleOnChange(convertToHTML(editorState.getCurrentContent()));

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
          handleReturn={(e, editorState) => {
            this.props.handleEdit();
            return "handled";
          }}
        />
      </div>
    );
  }
}

export default ListSessionTags;
