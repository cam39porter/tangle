import * as React from "react";
import "tachyons";

import { Route, Switch } from "react-router-dom";

import NavigationBar from "./components/navigation-bar";
import Capture from "./views/capture";

export interface Props {}
class App extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100 avenir`}>
        {/* Navigation Bar */}
        <div className={`clip-s`}>
          <NavigationBar />
        </div>

        {/* Navigation */}
        <Switch>
          <Route path="/" component={Capture} />
          <Route path="/capture" component={Capture} />
        </Switch>
      </div>
    );
  }
}

export default App;
