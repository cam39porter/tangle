// React
import * as React from "react";

// Components
import InputCapture from "./input-capture";
// import InputSurface from "./input-surface";
// import ButtonToggle from "./button-toggle";
// import ButtonSurface from "./button-surface";
// import ButtonZap from "./button-zap";
// import ButtonExit from "./button-exit";
// import ReactTooltip from "react-tooltip";

interface Props {
  handleCapture: (text: string) => void;
}

const ListCaptureHeader = (props: Props) => {
  return (
    <div className={`pa2 pv4 shadow-5 bb b--light-gray bg-white`}>
      <InputCapture handleCapture={props.handleCapture} />
    </div>
  );
};

export default ListCaptureHeader;
