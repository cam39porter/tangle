import * as React from "react";
import "tachyons";

import NavigationBar from "./components/navigation-bar";
import Capture from "./views/capture";

export interface Props {}
class App extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100 avenir`}>
        <div className={`clip-s`}>
          <NavigationBar />
        </div>
        <Capture />
      </div>
    );
  }
}

export default App;
