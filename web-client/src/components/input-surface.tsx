// React
import * as React from "react";

// Components
import ReactTooltip from "react-tooltip";
import ButtonSurface from "./button-surface";
import ButtonExit from "./button-exit";
import * as Draft from "draft-js";

// Utils
import { convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";

interface Props {
  handleOnChange: (text: string) => void;
  handleSurface: () => void;
  handleClear?: () => void;
  startingHTML?: string;
}

interface State {
  editorState: Draft.EditorState;
}

class InputSurface extends React.Component<Props, State> {
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

  handleOnChange = (editorState: Draft.EditorState) => {
    // inform parent components of state
    this.props.handleOnChange(editorState.getCurrentContent().getPlainText());

    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div className={`w-100 flex`}>
        <div className={`pa1`}>
          <ButtonSurface onClick={this.props.handleSurface} />
        </div>
        <div className={`flex-grow`}>
          <div className={`f6`}>
            <Draft.Editor
              editorState={this.state.editorState}
              onChange={this.handleOnChange}
              placeholder={`Search your tangle...`}
              handleReturn={(e, editorState) => {
                this.props.handleSurface();
                return "handled";
              }}
              spellCheck={true}
            />
          </div>
        </div>
        <div className={`pa1`}>
          {this.props.handleClear && (
            <div>
              <div data-tip={"Exit your search"}>
                <ButtonExit onClick={this.props.handleClear} />
              </div>
              <ReactTooltip />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default InputSurface;
