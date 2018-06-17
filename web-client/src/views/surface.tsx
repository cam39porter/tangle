// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route } from "react-router";

// Components
import RelatedGrid from "../components/related-grid";
import RelatedGraph from "../components/related-graph";
import InputSurface from "../components/input-surface";
import ReactResizeDetector from "react-resize-detector";

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
        <div className={`flex-column`}>
          {/* Header */}
          <div className={`bb bw1 b--light-gray`}>
            <ReactResizeDetector
              handleHeight={true}
              onResize={(_, height) => {
                this.setState({
                  headerHeight: height
                });
              }}
            />
            <div className={`flex pa2`}>
              <div className={`flex-grow items-center dark-gray`}>
                Description
              </div>
              <div className={`flex-grow`}>
                <InputSurface />
              </div>
            </div>
          </div>
          <div className={`flex-grow`}>
            <Switch>
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
      </div>
    );
  }
}

// Export
export default Surface;
