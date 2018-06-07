// React
import * as React from "react";

// Components
import * as Draft from "draft-js";

// Utils
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

interface Props {
  handleEdit: () => void;
  tags?: Array<string>;
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
    if (this.props.tags) {
      this.props.tags.forEach(tag => {
        startingText = startingText ? startingText + `#${tag} ` : `#${tag} `;
      });
    }
    if (startingText) {
      const blocksFromHTML = Draft.convertFromHTML(startingText);
      const state = Draft.ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      editorState = Draft.EditorState.createWithContent(state);
    }

    this.state = {
      editorState
    };
  }

  handleOnChange = (editorState: Draft.EditorState) => {
    // inform parent components of state
    this.props.handleOnChange(stateToHTML(editorState.getCurrentContent()));

    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div className={`ph4 f5`}>
        <Draft.Editor
          editorState={this.state.editorState}
          onChange={this.handleOnChange}
          placeholder={`Tags like #todo #ideas`}
          handleReturn={(e, editorState) => {
            this.props.handleEdit();
            return "handled";
          }}
          onFocus={this.props.handleEdit}
          onBlur={this.props.handleEdit}
        />
      </div>
    );
  }
}

export default ListSessionTags;
