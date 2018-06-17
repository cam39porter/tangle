// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route } from "react-router";

// Components
import RelatedGrid from "../components/related-grid";
import SearchGrid from "../components/search-grid";
import RelatedGraph from "../components/related-graph";

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

  render() {
    return (
      <div className={`flex-grow bg-near-white ba b--light-gray`}>
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
              render={props => (
                <SearchGrid
                  headerHeight={this.state.headerHeight}
                  query={NetworkUtils.getQuery(this.props.location.search)}
                  {...props}
                />
              )}
            />
            {/* Related */}
            <Route
              path={`/session/:id/related/graph`}
              render={props => (
                <RelatedGraph
                  headerHeight={this.state.headerHeight}
                  {...props}
                />
              )}
            />
            <Route
              path={`/session/:id/related`}
              render={props => (
                <RelatedGrid
                  headerHeight={this.state.headerHeight}
                  {...props}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

// Export
export default Surface;
