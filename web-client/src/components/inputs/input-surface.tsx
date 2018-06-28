// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// Components
import * as Draft from "draft-js";
import ButtonSurface from "./../buttons/button-surface";
import ReactResizeDetector from "react-resize-detector";

// Utils
import { convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import { trim } from "lodash";
import { NetworkUtils } from "../../utils";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
}

class InputSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    const startingHTML = NetworkUtils.getQuery(this.props.location.search);
    if (startingHTML) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(startingHTML)
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
    const url = this.props.match.url;

    if (!query) {
      if (url === "/") {
        this.props.history.push(`${url}recent`);
      } else {
        this.props.history.push(`${url}/related`);
      }
      return;
    }

    if (url === "/") {
      this.props.history.push(`${url}search?query=${query}`);
    } else {
      this.props.history.push(`${url}/search?query=${query}`);
    }
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
