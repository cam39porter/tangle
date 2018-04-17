// React
import * as React from "react";

// Components
import CaptureDialogue from "./capture-dialogue";

// Config / Utils
import config from "../cfg";

interface Props {
  isCapturing: boolean;
  handleIsCapturing: () => void;
  handleRefetch?: () => void;
}

class GraphButtons extends React.Component<Props, object> {
  render() {
    if (this.props.isCapturing) {
      return (
        <CaptureDialogue
          handleMinimize={this.props.handleIsCapturing}
          handleRefetch={this.props.handleRefetch}
        />
      );
    }

    return (
      <div
        className={`dt h3 w3 white br1 bg-${
          config.captureAccentColor
        } shadow-1 pointer`}
        onClick={this.props.handleIsCapturing}
      >
        <div className={`dtc tc v-mid f3`}>+</div>
      </div>
    );
  }
}

export default GraphButtons;
