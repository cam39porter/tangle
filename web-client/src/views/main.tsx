// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route } from "react-router";

// Components
// import CardCapture from "../components/card-capture";
import ListSessions from "../components/list-sessions";
// import GraphVisualization from "../components/graph-visualization";
// import Navigation from "../components/navigation";
// import ListSessionHeader from "../components/list-session-header";
// import InputSurface from "../components/input-surface";

// Utils
import { WindowUtils } from "../utils";
import windowSize from "react-window-size";

// Constants

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {}

// Class
class Main extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    let isLargeWindow = WindowUtils.getIsLargeWindow(this.props.windowWidth);

    return (
      <div className={`flex w-100 vh-100`}>
        {/* Sidebar */}
        <div
          className={`bg-near-white z-5 shadow-5`}
          style={{
            width: isLargeWindow ? "32.5em" : "100%"
          }}
        >
          <Switch>
            <Route path={this.props.match.url} component={ListSessions} />
          </Switch>
        </div>

        {/* Graph */}
        {/* {isLargeWindow ? (
          <div className={`relative flex-grow bg-near-white`}>
            <div className={`absolute w-100 top-0 z-max pa2`}>
              <div className={`flex`}>
                <div className={`flex flex-grow br4 bg-dark-gray shadow-1`}>
                  <div className={`flex-grow`}>
                    <Navigation />
                  </div>
                  <div
                    className={`flex-column justify-around ph2`}
                    style={{
                      minWidth: "20em"
                    }}
                  >
                    <InputSurface
                      handleSurface={text => {
                        let query = trim(text);
                        if (!query) {
                          return;
                        }
                        this.props.history.push(
                          `?query=${encodeURIComponent(text)}`
                        );
                      }}
                      startingHTML={NetworkUtils.getQuery(
                        this.props.location.search
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <GraphVisualization
              refEChart={noop}
              nodes={data && data.graph.nodes ? data.graph.nodes : []}
              edges={data && data.graph.edges ? data.graph.edges : []}
              onClick={e => {
                // to prevent selecting and edge for now

                if (
                  !(
                    e.data.category === ("focus" as string) ||
                    e.data.category === ("not_focus" as string)
                  )
                ) {
                  return;
                }

                // Entity click
                // Tag click
                // Capture that is in current session
                // Session

                this.setState({
                  graphFocus: { id: e.data.id, text: e.data.name }
                });
              }}
              onMouseOver={noop}
              onMouseOut={noop}
              showTooltip={false}
            />
            {this.state.graphFocus ? (
              <div
                className={`absolute bottom-1 right-1`}
                style={{ minWidth: "25em" }}
                id={this.state.graphFocus.id}
              >
                <CardCapture
                  captureId={this.state.graphFocus.id}
                  startingText={this.state.graphFocus.text}
                  handleExpand={noop}
                  handleFocus={noop}
                  isGraphFocus={false}
                  handleEdit={noop}
                  handleArchive={noop}
                />
              </div>
            ) : null}
          </div>
        ) : null} */}
      </div>
    );
  }
}

//  Window
const MainWithWindowSize = windowSize(Main);

// Export
export default MainWithWindowSize;
