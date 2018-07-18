// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route, Redirect } from "react-router";

// Components
import Session from "../views/session";
import Navigation from "../components/navigation/navigation";
import Surface from "./surface";
import Import from "./import";
import Settings from "./settings";
import Mobile from "./mobile";
import ErrorBoundary from "../components/help/error-boundary";
import Feedback from "../components/help/feedback";
import { BrowserView, MobileView, isMobile } from "react-device-detect";

// Utils
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
  constructor(props: Props) {
    super(props);
  }

  render() {
    // let isLargeWindow = WindowUtils.getIsLargeWindow(this.props.windowWidth);

    return (
      <div className={`bg-near-white`}>
        <MobileView>
          <Switch>
            <Route exact={true} path="/mobile" component={Mobile} />
            <Redirect to={"/mobile"} />
          </Switch>
        </MobileView>
        <BrowserView>
          {isMobile && <Redirect to={"/mobile"} />}
          <div className={`flex w-100 vh-100`}>
            {/* Navigation */}
            <ErrorBoundary>
              <div className={`flex`}>
                <Route component={Navigation} />
              </div>
              <div className={`relative flex-grow`}>
                <div className={`flex`}>
                  {/* Session */}
                  <ErrorBoundary>
                    <Switch>
                      <Route path={`/note/:id`} component={Session} />
                    </Switch>
                  </ErrorBoundary>
                  {/* Surface */}
                  <ErrorBoundary>
                    <Switch>
                      <Route
                        path={`/note/:id/format/:type/`}
                        component={Surface}
                      />
                      <Route path={`/format/:type`} component={Surface} />
                      <Route path={`/import`} component={Import} />
                      <Route path={`/settings`} component={Settings} />
                      <Redirect
                        from={"/"}
                        to={`/format/list/recent${this.props.location.search}`}
                      />
                    </Switch>
                  </ErrorBoundary>
                </div>
              </div>
              <div className={`fixed right-1 bottom-0 z-max`}>
                <Feedback />
              </div>
            </ErrorBoundary>
          </div>
        </BrowserView>
      </div>
    );
  }
}

//  Window
const MainWithWindowSize = windowSize(Main);

// Export
export default MainWithWindowSize;
