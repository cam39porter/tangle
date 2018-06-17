// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// Components
import * as Draft from "draft-js";
import ButtonSurface from "./button-surface";

// Utils
import { convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import ReactResizeDetector from "react-resize-detector";
import { trim } from "lodash";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
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

  handleSearch = (editorState: Draft.EditorState) => {
    const query = trim(editorState.getCurrentContent().getPlainText());

    if (!query) {
      return;
    }

    this.props.history.push(`${this.props.match.url}/search?query=${query}`);
  };

  render() {
    return (
      <div className={`flex ph2 bg-white br4`}>
        <div className={`flex-column justify-around gray`}>
          <ButtonSurface
            onClick={() => {
              this.handleSearch(this.state.editorState);
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
                this.handleSearch(editorState);
                return "handled";
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(InputSurface);
