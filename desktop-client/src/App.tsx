import * as React from "react";
import "tachyons";
import "./App.css";

import Sidebar from "./sidebar";
import SearchPanel from "./searchPanel";
import CapturePanel from "./capturePanel";
import Topbar from "./topbar";

export interface Props {}
class App extends React.Component<Props, object> {
  render() {
    return (
      <div className="App vh-100">
        <Topbar />
        <Sidebar />
        <SearchPanel />
        <CapturePanel />
      </div>
    );
  }
}

export default App;
