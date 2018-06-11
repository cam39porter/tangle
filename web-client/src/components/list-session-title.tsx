// React
import * as React from "react";

// Components
import * as Draft from "draft-js";

// Utils
import { convertToHTML, convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";

interface Props {
  handleEdit: () => void;
  startingTitle?: string;
  handleOnChange: (title: string) => void;
}

interface State {
  editorState: Draft.EditorState;
}

class ListSessionTitle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    if (this.props.startingTitle) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(this.props.startingTitle)
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
      <div className={`f3`}>
        <Draft.Editor
          editorState={this.state.editorState}
          onChange={this.handleOnChange}
          placeholder={`Brainstorm title`}
          handleReturn={(e, editorState) => {
            this.props.handleEdit();
            return "handled";
          }}
        />
      </div>
    );
  }
}

export default ListSessionTitle;
