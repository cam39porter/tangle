import * as React from "react";

import "tachyons";

import { RouteProps } from "react-router";
import { Route, Switch } from "react-router-dom";

import NavigationBar from "./components/navigation-bar";

import Login from "./views/login";
import Tangle from "./views/tangle";
// import Capture from "./views/capture";
import Surface from "./views/surface";

import { firebaseAuth } from "./utils";

interface Props extends RouteProps {}

interface State {
  isAuthenticated: boolean | null;
}

class App extends React.Component<Props, State> {
  removeFirebaseListener: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      isAuthenticated: null
    };
  }

  componentDidMount() {
    this.removeFirebaseListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          isAuthenticated: true
        });
      } else {
        this.setState({
          isAuthenticated: false
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeFirebaseListener();
  }

  render() {
    return (
      <div className={`vh-100 w-100 avenir relative`}>
        {this.state.isAuthenticated ? (
          <div className={`z-max absolute top-2 right-2`}>
            <NavigationBar />
          </div>
        ) : null}

        {/* Navigation */}
        {this.state.isAuthenticated === null ? null : (
          <div>
            {this.state.isAuthenticated ? (
              <Switch>
                {/* <Route path="/capture" component={Capture} /> */}
                <Route path="/surface" component={Surface} />
                <Route path="/tangle" component={Tangle} />
              </Switch>
            ) : (
              <Switch>
                <Route to="/" component={Login} />
                <Route to="/login" component={Login} />
              </Switch>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
