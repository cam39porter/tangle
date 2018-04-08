import * as React from "react";

import CaptureDialogue from "./capture-dialogue";

import config from "../cfg";

interface Props {
  isCapturing: boolean;
  handleIsCapturing: () => void;
}

class GraphButtons extends React.Component<Props, object> {
  render() {
    return (
      <div className={`bottom-2 right-2 absolute z-999`}>
        {this.props.isCapturing ? (
          <CaptureDialogue handleMinimize={this.props.handleIsCapturing} />
        ) : (
          <div
            className={`dt h3 w3 white br1 bg-${
              config.captureAccentColor
            } shadow-1 pointer`}
            onClick={this.props.handleIsCapturing}
          >
            <div className={`dtc tc v-mid f3`}>+</div>
          </div>
        )}
      </div>
    );
  }
}

export default GraphButtons;
