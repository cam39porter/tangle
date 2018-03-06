import * as React from "react";
import "tachyons";

import { Route, Switch } from "react-router-dom";

import NavigationBar from "./components/navigation-bar";
import Capture from "./views/capture";
import Surface from "./views/surface";
import SurfaceResults from "./views/surface-results";

export interface Props {}

class App extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100 avenir`}>
        {/* Navigation Bar */}
        <div className={`clip-s z-max`}>
          <NavigationBar />
        </div>

        {/* Navigation */}
        <Switch>
          <Route path="/" component={Capture} />
          <Route exact={true} path="/capture" component={Capture} />
          <Route exact={true} path="/surface" component={Surface} />
          <Route
            exact={true}
            path="/surface/:query"
            component={SurfaceResults}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
