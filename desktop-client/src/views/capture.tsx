import * as React from "react";

import TextInputCapture from "../components/text-input-capture";

export interface Props {}

class Capture extends React.Component<Props, object> {
  render() {
    return (
      <div className={``}>
        <TextInputCapture />
      </div>
    );
  }
}

export default Capture;
