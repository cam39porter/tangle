// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route } from "react-router";

// Components
import RecentGrid from "../components/grids/recent-grid";
import RelatedGrid from "../components/grids/related-grid";
import SearchGrid from "../components/grids/search-grid";
import RecentGraph from "../components/graphs/recent-graph";
import RelatedGraph from "../components/graphs/related-graph";
import SearchGraph from "../components/graphs/search-graph";
import HeaderSurface from "../components/headers/header-surface";
import ReactResizeDetector from "react-resize-detector";

// Utils
import { NetworkUtils } from "../utils";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {}

interface State {
  headerHeight: number;
}

// Class
class Surface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      headerHeight: 0
    };
  }

  renderRecent = props => {
    const query = NetworkUtils.getQuery(this.props.location.search);

    if (this.props.match.params["type"] === "graph") {
      return (
        <RecentGraph
          headerHeight={this.state.headerHeight}
          query={query}
          {...props}
        />
      );
    }
    return (
      <RecentGrid
        headerHeight={this.state.headerHeight}
        query={query}
        {...props}
      />
    );
  };

  renderSearch = props => {
    const query = NetworkUtils.getQuery(this.props.location.search);

    if (this.props.match.params["type"] === "graph") {
      return (
        <SearchGraph
          headerHeight={this.state.headerHeight}
          query={query}
          {...props}
        />
      );
    }
    return (
      <SearchGrid
        headerHeight={this.state.headerHeight}
        query={query}
        {...props}
      />
    );
  };

  renderRelated = props => {
    if (this.props.match.params["type"] === "graph") {
      return <RelatedGraph headerHeight={this.state.headerHeight} {...props} />;
    }
    return <RelatedGrid headerHeight={this.state.headerHeight} {...props} />;
  };

  render() {
    return (
      <div className={`flex-grow bg-near-white bt bl br b--light-gray`}>
        <div className={`flex-column`}>
          <div>
            <ReactResizeDetector
              handleHeight={true}
              onResize={(_, height) => {
                this.setState({
                  headerHeight: height
                });
              }}
            />

            <HeaderSurface
              isGraphView={this.props.match.params["type"] === "graph"}
              handleIsGraphView={() => {
                const match = this.props.match.url;
                const matchSplit = match.split("/");
                const pathAfterMatch = this.props.location.pathname.replace(
                  match,
                  ""
                );
                matchSplit.pop();
                if (this.props.match.params["type"] === "graph") {
                  matchSplit.push("list");
                } else {
                  matchSplit.push("graph");
                }
                this.props.history.push(
                  `${matchSplit.join("/")}${pathAfterMatch}${
                    this.props.location.search
                  }`
                );
              }}
            />
          </div>
          <div className={`flex-grow`}>
            <Switch>
              {/* Recent */}
              <Route path={`/format/:type/recent`} render={this.renderRecent} />
              <Route
                path={`/note/:id/format/:type/recent`}
                render={this.renderRecent}
              />
              {/* Search  */}
              <Route path={`/format/:type/search`} render={this.renderSearch} />
              <Route
                path={`/note/:id/format/:type/search`}
                render={this.renderSearch}
              />
              {/* Related */}
              <Route
                path={`/note/:id/format/:type/related`}
                render={this.renderRelated}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

// Export
export default Surface;
