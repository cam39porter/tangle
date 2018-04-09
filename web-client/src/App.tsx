import * as React from "react";
import "tachyons";

import { Route, Switch } from "react-router-dom";

import NavigationBar from "./components/navigation-bar";

import Tangle from "./views/tangle";
// import Capture from "./views/capture";
import Surface from "./views/surface";

interface Props {}

class App extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100 avenir relative`}>
        <div className={`z-max absolute top-2 right-2`}>
          <NavigationBar />
        </div>

        {/* Navigation */}
        <Switch>
          {/* <Route exact={true} path="/" component={Capture} />
          <Route path="/capture" component={Capture} /> */}
          <Route path="/surface" component={Surface} />
          <Route path="/tangle" component={Tangle} />
        </Switch>
      </div>
    );
  }
}

export default App;
