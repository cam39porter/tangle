import * as React from "react";

import TextInputCapture from "../components/text-input-capture";

export interface Props {}
export interface CaptureState {}

class Capture extends React.Component<Props, CaptureState> {
  render() {
    return (
      <div className={``}>
        <TextInputCapture />
      </div>
    );
  }
}

export default Capture;
