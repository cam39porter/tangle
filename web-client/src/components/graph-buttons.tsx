// React
import * as React from "react";

// Components
import CaptureDialogue from "./capture-dialogue";

// Config / Utils
import config from "../cfg";

interface Props {
  isCapturing: boolean;
  handleIsCapturing: () => void;
}

class GraphButtons extends React.Component<Props, object> {
  render() {
    if (this.props.isCapturing) {
      return <CaptureDialogue handleMinimize={this.props.handleIsCapturing} />;
    }

    return (
      <div className={`fixed bottom-0 right-0 pr3 pb5 z-999`}>
        <div
          className={`dt h2 w2 white br1 bg-${
            config.captureAccentColor
          } shadow-1 pointer`}
          onClick={this.props.handleIsCapturing}
        >
          <div className={`dtc tc v-mid f3`}>+</div>
        </div>
      </div>
    );
  }
}

export default GraphButtons;
