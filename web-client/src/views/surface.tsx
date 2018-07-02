// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route, Redirect } from "react-router";

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
  isGraphView: boolean;
}

// Class
class Surface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      headerHeight: 0,
      isGraphView: false
    };
  }

  renderRecent = props => {
    const query = NetworkUtils.getQuery(this.props.location.search);

    if (this.state.isGraphView) {
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

    if (this.state.isGraphView) {
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
    if (this.state.isGraphView) {
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
              isGraphView={this.state.isGraphView}
              handleIsGraphView={() => {
                this.setState({
                  isGraphView: !this.state.isGraphView
                });
              }}
            />
          </div>
          <div className={`flex-grow`}>
            <Switch>
              {/* Recent */}
              <Route path={`/session/:id/recent`} render={this.renderRecent} />
              <Route path={`/recent`} render={this.renderRecent} />
              {/* Search  */}
              <Route path={`/session/:id/search`} render={this.renderSearch} />
              <Route path={`/search`} render={this.renderSearch} />
              {/* Related */}
              <Route
                path={`/session/:id/related`}
                render={this.renderRelated}
              />
              <Redirect
                exact={true}
                from={"/"}
                to={`/recent${this.props.location.search}`}
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
