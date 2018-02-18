import React, { Component } from "react";
import Capture from "./capture.js";

class CapturePanel extends Component {
  render() {
    return (
      <div className={`fl w-30 pa2 h-100 ba`}>
        <Capture />
      </div>
    );
  }
}

export default CapturePanel;
