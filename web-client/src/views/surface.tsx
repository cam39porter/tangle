// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route } from "react-router";

// Components
import RelatedGrid from "../components/related-grid";
import SearchGrid from "../components/search-grid";
import RelatedGraph from "../components/related-graph";
import SearchGraph from "../components/search-graph";
import HeaderSurface from "../components/header-surface";
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.isGraphView !== nextState.isGraphView) {
      return true;
    }
    if (
      this.props.location.pathname + this.props.location.search !==
      nextProps.location.pathname + nextProps.location.search
    ) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div className={`flex-grow bg-near-white ba b--light-gray`}>
        <div className={`flex-column`}>
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
          <div className={`flex-grow`}>
            <Switch>
              {/* Search  */}
              {/* <Route
                path={`/session/:id/search/graph`}
                render={props => (
                  <RelatedGraph
                  headerHeight={this.state.headerHeight}
                  {...props}
                  />
                )}
              /> */}
              <Route
                path={`/session/:id/search`}
                render={props => {
                  const query = NetworkUtils.getQuery(
                    this.props.location.search
                  );

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
                }}
              />
              {/* Related */}
              <Route
                path={`/session/:id/related`}
                render={props => {
                  if (this.state.isGraphView) {
                    return (
                      <RelatedGraph
                        headerHeight={this.state.headerHeight}
                        {...props}
                      />
                    );
                  }
                  return (
                    <RelatedGrid
                      headerHeight={this.state.headerHeight}
                      {...props}
                    />
                  );
                }}
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
