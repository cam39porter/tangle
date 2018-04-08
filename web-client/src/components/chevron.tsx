import * as React from "react";

import { ChevronRight, ChevronLeft } from "react-feather";

interface Props {
  isActive: boolean;
  onClick: () => void;
  right: boolean;
}

class Chevron extends React.Component<Props, object> {
  render() {
    return (
      <div
        className={`f6 dtc v-mid ${
          this.props.isActive ? "gray pointer" : "light-gray"
        }`}
        onClick={this.props.onClick}
      >
        {this.props.right ? <ChevronRight /> : <ChevronLeft />}
      </div>
    );
  }
}

export default Chevron;
