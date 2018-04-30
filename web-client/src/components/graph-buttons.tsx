// React
import * as React from "react";

// Components
import CaptureDialogue from "./capture-dialogue";
import { MessageSquare } from "react-feather";

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
        className={`dt h3 w3 white br4 bg-accent shadow-1 pointer`}
        onClick={this.props.handleIsCapturing}
      >
        <div className={`dtc tc v-mid pt1 f3`}>
          <MessageSquare />
        </div>
      </div>
    );
  }
}

export default GraphButtons;
