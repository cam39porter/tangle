import * as React from "react";
import Capture from "./capture";

export interface Props {}

function CapturePanel(props: Props) {
  return (
    <div className={`fl w-30 pa2 h-100 ba`}>
      <Capture />
    </div>
  );
}

export default CapturePanel;
