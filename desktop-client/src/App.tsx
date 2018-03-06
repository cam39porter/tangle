import * as React from "react";
import "tachyons";

import { Route, Switch, Redirect } from "react-router-dom";

import NavigationBar from "./components/navigation-bar";
import Capture from "./views/capture";
import Surface from "./views/surface";

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
          <Redirect exact={true} from="/" to="/capture" />
          <Route path="/capture" component={Capture} />
          <Route path="/surface" component={Surface} />
        </Switch>
      </div>
    );
  }
}

export default App;
