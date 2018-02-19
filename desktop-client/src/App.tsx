import * as React from "react";
import "tachyons";
import "./App.css";

import Sidebar from "./components/sidebar";
import SearchPanel from "./components/searchPanel";
import CapturePanel from "./components/capturePanel";
import Topbar from "./components/topbar";

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
