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
import { NetworkUtils, EditorUtils, AnalyticsUtils } from "../../utils";

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

  componentWillReceiveProps(nextProps: Props) {
    const startingHTML = NetworkUtils.getQuery(this.props.location.search);
    const nextStartingHTML = NetworkUtils.getQuery(nextProps.location.search);
    if (startingHTML === nextStartingHTML) {
      return;
    }
    let nextEditorState = EditorUtils.cleanEditorState(this.state.editorState);
    nextEditorState = Draft.EditorState.createWithContent(
      convertFromHTML(nextStartingHTML)
    );
    nextEditorState = EditorUtils.moveSelectionToEnd(nextEditorState);

    this.setState({
      editorState: nextEditorState
    });
  }

  handleOnChange = (editorState: Draft.EditorState) => {
    this.setState({
      editorState
    });
  };

  handleExit = (url, query) => {
    if (this.props.match.params["id"]) {
      this.props.history.push(`${url}/related`);
    } else {
      this.props.history.push(`${url}/recent`);
    }

    const nextEditorState = EditorUtils.cleanEditorState(
      this.state.editorState
    );
    this.setState({
      editorState: nextEditorState
    });
  };

  handleSearch = (query, url) => {
    if (!query) {
      this.handleExit(url, query);
      AnalyticsUtils.trackEvent({
        category: this.props.match.params["id"]
          ? AnalyticsUtils.Categories.Session
          : AnalyticsUtils.Categories.Home,
        action: AnalyticsUtils.Actions.EnterToClearSearch,
        label: query
      });
      return;
    }

    this.props.history.push(`${url}/search?query=${query}`);
  };

  render() {
    let isSearching = this.props.location.pathname.includes("/search");

    const query = trim(
      this.state.editorState.getCurrentContent().getPlainText()
    );
    const url = this.props.match.url;

    return (
      <div
        className={`flex ph2 bg-white br4 ba ${
          isSearching ? "b--accent" : "b--white"
        }`}
      >
        <div
          className={`flex-column pa2 justify-around gray`}
          onClick={() => {
            this.handleSearch(query, url);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.ClickToExecuteSearch,
              label: query
            });
          }}
        >
          <ButtonSurface />
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
                this.handleSearch(query, url);
                AnalyticsUtils.trackEvent({
                  category: this.props.match.params["id"]
                    ? AnalyticsUtils.Categories.Session
                    : AnalyticsUtils.Categories.Home,
                  action: AnalyticsUtils.Actions.EnterToExecuteSearch,
                  label: query
                });
                return "handled";
              }}
            />
          </div>
        </div>
        <div
          className={`flex-column justify-around f7 ${
            isSearching || query ? "gray" : "white"
          } pointer`}
          onClick={() => {
            this.handleExit(url, query);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.ClickToClearSearch,
              label: query
            });
          }}
        >
          <div className={`ph2`}>Clear</div>
        </div>
      </div>
    );
  }
}

export default withRouter(InputSurface);
