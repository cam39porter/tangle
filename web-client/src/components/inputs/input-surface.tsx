// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// Components
import ButtonSurface from "./../buttons/button-surface";

// Utils
import { trim } from "lodash";
import { NetworkUtils, AnalyticsUtils } from "../../utils";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {}

interface State {
  text: string;
}

const MAX_LENGTH_SEARCH = 100; // characters

class InputSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const query = NetworkUtils.getQuery(this.props.location.search);

    this.state = {
      text: query
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const startingQuery = NetworkUtils.getQuery(this.props.location.search);
    const nextQuery = NetworkUtils.getQuery(nextProps.location.search);
    if (startingQuery === nextQuery) {
      return;
    }

    this.setState({
      text: nextQuery
    });
  }

  handleOnChange = e => {
    const text: string = e.target.value;

    if (text.length >= MAX_LENGTH_SEARCH) {
      return;
    }

    this.setState({
      text: e.target.value
    });
  };

  handleExit = url => {
    if (this.props.match.params["id"]) {
      this.props.history.push(`${url}/related`);
    } else {
      this.props.history.push(`${url}/recent`);
    }

    this.setState({
      text: ""
    });
  };

  handleSearch = (query, url) => {
    if (!query) {
      this.handleExit(url);
      AnalyticsUtils.trackEvent({
        category: this.props.match.params["id"]
          ? AnalyticsUtils.Categories.Session
          : AnalyticsUtils.Categories.Home,
        action: AnalyticsUtils.Actions.EnterToClearSearch,
        label: query
      });
      return;
    }

    this.props.history.push(`${url}/search?query=${encodeURIComponent(query)}`);
  };

  render() {
    let isSearching = this.props.location.pathname.includes("/search");

    const query = trim(this.state.text);
    const url = this.props.match.url;

    return (
      <div
        className={`flex ph2 bg-editor-gray br4 ba ${
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
        <input
          onKeyDown={e => {
            if (e.key !== "Enter") {
              return;
            }
            this.handleSearch(query, url);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.EnterToExecuteSearch,
              label: query
            });
          }}
          value={this.state.text}
          className={`flex-grow pv2 f6`}
          placeholder={"Search your tangle"}
          onChange={this.handleOnChange}
        />
        {(isSearching || query) && (
          <div
            className={`flex-column justify-around f7 pointer`}
            onClick={() => {
              this.handleExit(url);
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
        )}
      </div>
    );
  }
}

export default withRouter(InputSurface);
