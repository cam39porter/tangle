import * as React from "react";
import "tachyons";

import Topbar from "./components/topbar";

export interface Props {}
class App extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100 avenir`}>
        <Topbar />
      </div>
    );
  }
}

export default App;
