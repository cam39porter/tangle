import React, { Component } from "react";
import "tachyons";
import Capture from "./capture.js";
import Sidebar from "./sidebar.js";
import SearchPanel from "./search-panel.js";
import CapturePanel from "./capture-panel.js";
import logo from "./logo.svg";
import "./app.css";
import Topbar from "./topbar.js";

class App extends Component {
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
