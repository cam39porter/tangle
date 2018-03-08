import * as React from "react";
import "tachyons";

import { Route, Switch } from "react-router-dom";

import Tangle from "./views/tangle";
import Capture from "./views/capture";
import Surface from "./views/surface";
import SurfaceResults from "./views/surface-results";
import Reflect from "./views/reflect";

export interface Props {}

class App extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100 avenir`}>
        {/* Navigation */}
        <Switch>
          <Route exact={true} path="/" component={Capture} />
          <Route exact={true} path="/capture" component={Capture} />
          <Route exact={true} path="/surface" component={Surface} />
          <Route
            exact={true}
            path="/surface/:query"
            component={SurfaceResults}
          />
          <Route exact={true} path="/tangle" component={Tangle} />
          <Route exact={true} path="/reflect" component={Reflect} />
        </Switch>
      </div>
    );
  }
}

export default App;
