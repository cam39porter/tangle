// React
import * as React from "react";

// Style
import "./css/custom.css";
import "./tachyons.css";
import "draft-js/dist/Draft.css";

// Routing
import { RouteProps } from "react-router";
import { Route } from "react-router-dom";

// Components
import Feedback from "./components/help/feedback";
// import Verify from "./views/verify";
import Login from "./views/login";
import Main from "./views/main";

// Config / Utils
import { AnalyticsUtils } from "./utils";

// Types

interface Props extends RouteProps {}

interface State {
  isAuthenticated: boolean | null;
  isEmailVerified: boolean | null;
  user: null;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isAuthenticated: true,
      isEmailVerified: true,
      user: null
    };
  }

  render() {
    const { isAuthenticated, isEmailVerified } = this.state;
    return (
      <div className={`vh-100 w-100 sans-serif`}>
        {isAuthenticated === null ? null : (
          <div>
            {isAuthenticated ? (
              isEmailVerified === null ? null : (
                <div>
                  {!isEmailVerified ? (
                    <Route
                      path="/"
                      component={AnalyticsUtils.withTracker(Main)}
                    />
                  ) : (
                    <Route
                      path="/"
                      component={AnalyticsUtils.withTracker(Main)}
                    />
                  )}
                  <div className={`fixed right-1 bottom-0 z-max`}>
                    <Feedback />
                  </div>
                </div>
              )
            ) : (
              <Route to="/" component={Login} />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
